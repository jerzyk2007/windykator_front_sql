import { useState, useEffect, useMemo } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import PleaseWait from "../../PleaseWait";
import { Divider, Typography } from "@mui/material";
import {
  IoArrowBackOutline,
  IoAlertCircleOutline,
  IoWarning,
  IoShieldCheckmarkOutline,
  IoLockClosedOutline,
  IoSearchOutline,
} from "react-icons/io5";

const formatPLN = (value) => {
  return (
    new Intl.NumberFormat("pl-PL", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(value || 0) + " zł"
  );
};

const ReportContractor = ({ contractor, onBack }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [pleaseWait, setPleaseWait] = useState(false);
  const [reportData, setReportData] = useState([]);

  const isBlacklisted = contractor.KOD_KONTR_LISTA === "CZARNA";
  const hasTransferConsent =
    contractor.PRZYPISANA_FORMA_PLATNOSCI?.toLowerCase().includes("przelew");

  useEffect(() => {
    const getData = async () => {
      try {
        setPleaseWait(true);
        const result = await axiosPrivateIntercept.get(
          `/contractor/get-report-data/${contractor.KONTRAHENT_ID}/${contractor.SPOLKA}`,
        );
        setReportData(result.data || []);
      } catch (error) {
        console.error("Błąd pobierania danych raportu:", error);
      } finally {
        setPleaseWait(false);
      }
    };
    getData();
  }, [contractor, axiosPrivateIntercept]);

  const statsByYear = useMemo(() => {
    if (!reportData || reportData.length === 0) return {};
    const stats = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    reportData.forEach((item) => {
      const year = new Date(item.DATA_FV).getFullYear();
      if (!stats[year]) {
        stats[year] = {
          count: 0,
          totalBrutto: 0,
          before: { count: 0, sum: 0 },
          late1to8: { count: 0, sum: 0 },
          late9to20: { count: 0, sum: 0 },
          lateOver20: { count: 0, sum: 0 },
          unpaidOverdue: { count: 0, sum: 0 },
          unpaidInTerm: { count: 0, sum: 0 },
          settledCount: 0,
          delaySum: 0,
          historyOkCount: 0, // Licznik wszystkich terminowych wpłat (nawet tych rozliczonych)
        };
      }
      const s = stats[year];
      const amountToSettle = item.DO_ROZLICZENIA || 0;

      s.count++;
      s.totalBrutto += item.BRUTTO || 0;

      const termDate = new Date(item.TERMIN);
      termDate.setHours(0, 0, 0, 0);

      // 1. GŁÓWNE BOKSY (Zadłużenie bieżące)
      if (amountToSettle > 0) {
        if (termDate < today) {
          s.unpaidOverdue.count++;
          s.unpaidOverdue.sum += amountToSettle;
        } else {
          s.unpaidInTerm.count++;
          s.unpaidInTerm.sum += amountToSettle;
        }
      }

      // 2. ANALIZA TERMINOWOŚCI (KOSZYKI)
      let compareDate;
      if (amountToSettle === 0 && item.DATA_ROZL_AS) {
        compareDate = new Date(item.DATA_ROZL_AS);
        s.settledCount++;
      } else {
        compareDate = today;
      }
      compareDate.setHours(0, 0, 0, 0);

      const diff = Math.ceil((compareDate - termDate) / (1000 * 3600 * 24));

      if (diff <= 0) {
        s.historyOkCount++; // Zliczamy do ogólnej wiarygodności
        if (amountToSettle > 0) {
          s.before.count++;
          s.before.sum += amountToSettle;
        }
      } else {
        if (amountToSettle === 0) s.delaySum += diff; // Tylko dla rozliczonych do statystyk średniej

        if (amountToSettle > 0) {
          if (diff <= 8) {
            s.late1to8.count++;
            s.late1to8.sum += amountToSettle;
          } else if (diff <= 20) {
            s.late9to20.count++;
            s.late9to20.sum += amountToSettle;
          } else {
            s.lateOver20.count++;
            s.lateOver20.sum += amountToSettle;
          }
        }
      }
    });
    return stats;
  }, [reportData]);

  const risk = useMemo(() => {
    if (isBlacklisted)
      return {
        label: "ZABLOKOWANY",
        color: "#b71c1c",
        icon: <IoLockClosedOutline size={22} />,
        text: "Kontrahent na czarnej liście. Bezwzględny zakaz sprzedaży odroczonej.",
      };

    if (reportData.length === 0)
      return {
        label: "BRAK HISTORII",
        color: "#607d8b",
        icon: <IoSearchOutline size={22} />,
        text: "Brak historycznych transakcji w systemie.",
      };

    let totalInvoices = reportData.length;
    let totalPaidInTermHistory = 0;
    let totalUnpaidOverdueCount = 0;
    let totalCriticalLateCount = 0;

    Object.values(statsByYear).forEach((y) => {
      totalPaidInTermHistory += y.historyOkCount;
      totalUnpaidOverdueCount += y.unpaidOverdue.count;
      totalCriticalLateCount += y.late9to20.count + y.lateOver20.count;
    });

    const ratioCritical =
      (totalCriticalLateCount + totalUnpaidOverdueCount) / totalInvoices;

    // 1. WYSOKIE RYZYKO
    if (totalUnpaidOverdueCount > 0 || ratioCritical > 0.15)
      return {
        label: "WYSOKIE RYZYKO",
        color: "#c62828",
        icon: <IoAlertCircleOutline size={22} />,
        text: `Wykryto ${totalUnpaidOverdueCount} zaległości płatniczych lub niski poziom dyscypliny (${(ratioCritical * 100).toFixed(1)}% spóźnień).`,
      };

    // 2. BRAK UPRAWNIEŃ
    if (!hasTransferConsent)
      return {
        label: "BRAK UPRAWNIEŃ",
        color: "#ef6c00",
        icon: <IoWarning size={22} />,
        text: "Klient nie ma przypisanej formy płatności 'Przelew'. Sprzedaż tylko gotówkowa.",
      };

    // 3. WIARYGODNY PŁATNIK (Zasada 3 faktur)
    if (totalPaidInTermHistory >= 3 && ratioCritical <= 0.05)
      return {
        label: "WIARYGODNY PŁATNIK",
        color: "#2e7d32",
        icon: <IoShieldCheckmarkOutline size={22} />,
        text: "Rzetelny płatnik. Pozytywna historia i brak bieżących zaległości.",
      };

    // 4. OGRANICZONE ZAUFANIE (Nowy lub drobne spóźnienia)
    return {
      label: "OGRANICZONE ZAUFANIE",
      color: "#f9a825",
      icon: <IoWarning size={22} />,
      text: "Zbyt krótka historia współpracy (poniżej 3 faktur) lub występujące drobne opóźnienia.",
    };
  }, [reportData, statsByYear, isBlacklisted, hasTransferConsent]);

  return (
    <>
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <div className="sm-edit-wrapper">
          <header className="sm-edit-header">
            <div className="sm-edit-header-left">
              <button className="sm-back-btn" onClick={onBack} title="Wróć">
                <IoArrowBackOutline />
              </button>
              <div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <h1>Raport płatniczy</h1>
                  <span className="sm-spolka-badge">{contractor.SPOLKA}</span>
                </div>
                <p style={{ fontSize: "1rem" }}>
                  {contractor.NAZWA_KONTRAHENTA_SLOWNIK}
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 24px",
                borderRadius: "12px",
                border: `2px solid ${risk.color}`,
                color: risk.color,
                background: `${risk.color}08`,
                boxShadow: `0 4px 12px ${risk.color}15`,
              }}
            >
              {risk.icon}
              <strong
                style={{ fontSize: "1.1rem", textTransform: "uppercase" }}
              >
                {risk.label}
              </strong>
            </div>
          </header>

          <div className="sm-edit-grid">
            {/* KOLUMNA 1: DANE PODSTAWOWE */}
            <section className="sm-edit-column">
              <div className="sm-edit-card">
                <h3>DANE PODSTAWOWE</h3>
                <div className="sm-view-field">
                  <label>NIP</label>
                  <span className="sm-value-important">
                    {contractor.KONTR_NIP || "---"}
                  </span>
                </div>
                <div className="sm-view-field">
                  <label>Status listy</label>
                  <span
                    style={{
                      color: isBlacklisted ? "#b71c1c" : "#2e7d32",
                      fontWeight: 700,
                    }}
                  >
                    {isBlacklisted ? "CZARNA LISTA" : "BIAŁA LISTA"}
                  </span>
                </div>
                <div className="sm-view-field">
                  <label>Zgoda na przelew</label>
                  <span
                    style={{
                      color: hasTransferConsent ? "#2e7d32" : "#c62828",
                      fontWeight: 700,
                    }}
                  >
                    {hasTransferConsent
                      ? "TAK / MOŻLIWY PRZELEW"
                      : "NIE / TYLKO GOTÓWKA"}
                  </span>
                </div>
              </div>
            </section>

            {/* KOLUMNA 2: STRUKTURA ROZLICZEŃ */}
            <section className="sm-edit-column">
              <div className="sm-edit-card highlight-card">
                <h3>STRUKTURA ROZLICZEŃ (DŁUG)</h3>
                {Object.keys(statsByYear).length === 0 && (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#7f8c8d",
                      padding: "20px",
                    }}
                  >
                    Brak danych
                  </p>
                )}
                {Object.keys(statsByYear)
                  .sort((a, b) => b - a)
                  .map((year) => {
                    const s = statsByYear[year];
                    const hasOverdue = s.unpaidOverdue.count > 0;
                    return (
                      <div key={year} style={{ marginBottom: "30px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ color: "#1976d2", fontWeight: 800 }}
                          >
                            {year}
                          </Typography>
                          <span style={{ fontSize: "0.85rem", color: "#666" }}>
                            Śr. spóźnienie:{" "}
                            {s.settledCount > 0
                              ? (s.delaySum / s.settledCount).toFixed(1)
                              : 0}{" "}
                            dni
                          </span>
                        </div>

                        <div className="sm-unpaid-container">
                          <div
                            className={`sm-debt-box ${hasOverdue ? "active-debt" : ""}`}
                          >
                            <label>PO TERMINIE</label>
                            <div className="sm-debt-content">
                              <strong>{s.unpaidOverdue.count} szt.</strong>
                              <span>{formatPLN(s.unpaidOverdue.sum)}</span>
                            </div>
                          </div>
                          <div className="sm-debt-box-clean">
                            <label>W TERMINIE (OTWARTE)</label>
                            <div className="sm-debt-content">
                              <strong>{s.unpaidInTerm.count} szt.</strong>
                              <span>{formatPLN(s.unpaidInTerm.sum)}</span>
                            </div>
                          </div>
                        </div>

                        <label className="sm-section-label-mini">
                          Wiek obecnego zadłużenia:
                        </label>
                        <div className="sm-buckets-grid">
                          <div
                            className="sm-bucket-mini"
                            style={{ borderLeftColor: "#2e7d32" }}
                          >
                            <label>W terminie ({s.before.count})</label>
                            <span>{formatPLN(s.before.sum)}</span>
                          </div>
                          <div
                            className="sm-bucket-mini"
                            style={{ borderLeftColor: "#fbc02d" }}
                          >
                            <label>1-8 dni ({s.late1to8.count})</label>
                            <span>{formatPLN(s.late1to8.sum)}</span>
                          </div>
                          <div
                            className="sm-bucket-mini"
                            style={{ borderLeftColor: "#fb8c00" }}
                          >
                            <label>9-20 dni ({s.late9to20.count})</label>
                            <span>{formatPLN(s.late9to20.sum)}</span>
                          </div>
                          <div
                            className="sm-bucket-mini"
                            style={{ borderLeftColor: "#d32f2f" }}
                          >
                            <label>Pow. 20 dni ({s.lateOver20.count})</label>
                            <span>{formatPLN(s.lateOver20.sum)}</span>
                          </div>
                        </div>
                        <Divider sx={{ mt: 2 }} />
                      </div>
                    );
                  })}
              </div>
            </section>

            {/* KOLUMNA 3: REKOMENDACJA */}
            <section className="sm-edit-column">
              <div className="sm-edit-card">
                <h3>REKOMENDACJA</h3>
                <div
                  style={{
                    padding: "20px",
                    borderRadius: "12px",
                    background: `${risk.color}10`,
                    border: `2px solid ${risk.color}`,
                  }}
                >
                  <p
                    style={{
                      color: risk.color,
                      fontWeight: 800,
                      marginBottom: "8px",
                    }}
                  >
                    STATUS: {risk.label}
                  </p>
                  <p style={{ margin: 0, lineHeight: 1.5 }}>{risk.text}</p>
                </div>
                <div
                  className="sm-view-field"
                  style={{
                    marginTop: "20px",
                    background: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "8px",
                  }}
                >
                  <label>Łączna liczba faktur w historii</label>
                  <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                    {reportData.length}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportContractor;
