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
        console.error("Błąd:", error);
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
        };
      }
      const s = stats[year];
      s.count++;
      s.totalBrutto += item.BRUTTO || 0;

      const termDate = new Date(item.TERMIN);
      termDate.setHours(0, 0, 0, 0);

      if (item.DO_ROZLICZENIA > 0) {
        if (termDate < today) {
          s.unpaidOverdue.count++;
          s.unpaidOverdue.sum += item.DO_ROZLICZENIA;
        } else {
          s.unpaidInTerm.count++;
          s.unpaidInTerm.sum += item.DO_ROZLICZENIA;
        }
      }

      if (item.DATA_ROZL_AS) {
        const rozlDate = new Date(item.DATA_ROZL_AS);
        rozlDate.setHours(0, 0, 0, 0);
        const diff = Math.ceil((rozlDate - termDate) / (1000 * 3600 * 24));

        if (item.DO_ROZLICZENIA === 0) {
          s.settledCount++;
          s.delaySum += diff > 0 ? diff : 0;
          if (diff <= 0) {
            s.before.count++;
            s.before.sum += item.BRUTTO;
          } else if (diff <= 8) {
            s.late1to8.count++;
            s.late1to8.sum += item.BRUTTO;
          } else if (diff <= 20) {
            s.late9to20.count++;
            s.late9to20.sum += item.BRUTTO;
          } else {
            s.lateOver20.count++;
            s.lateOver20.sum += item.BRUTTO;
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
        text: "KONTRAHENT NA CZARNEJ LIŚCIE. Bezwzględny zakaz sprzedaży z odroczonym terminem.",
      };

    if (reportData.length === 0)
      return {
        label: "BRAK HISTORII",
        color: "#607d8b",
        icon: <IoSearchOutline size={22} />,
        text: "Brak historycznych rozliczeń w systemie.",
      };

    let totalInvoices = reportData.length;
    let totalPaidOnTime = 0;
    let totalUnpaidOverdueCount = 0;
    let totalCriticalLateCount = 0;

    Object.values(statsByYear).forEach((y) => {
      totalPaidOnTime += y.before.count;
      totalUnpaidOverdueCount += y.unpaidOverdue.count;
      totalCriticalLateCount += y.late9to20.count + y.lateOver20.count;
    });

    const ratioCritical =
      (totalCriticalLateCount + totalUnpaidOverdueCount) / totalInvoices;

    // 1. WYSOKIE RYZYKO: Ma długi teraz LUB więcej niż 15% faktur to duże spóźnienia
    if (totalUnpaidOverdueCount > 0 || ratioCritical > 0.15)
      return {
        label: "WYSOKIE RYZYKO",
        color: "#c62828",
        icon: <IoAlertCircleOutline size={22} />,
        text: `Wykryto ${totalUnpaidOverdueCount} faktur po terminie lub bardzo niski wskaźnik terminowości (${(ratioCritical * 100).toFixed(1)}%).`,
      };

    // 2. BRAK UPRAWNIEŃ: Brak zgody na przelew
    if (!hasTransferConsent)
      return {
        label: "BRAK UPRAWNIEŃ",
        color: "#ef6c00",
        icon: <IoWarning size={22} />,
        text: "Klient nie posiada w systemie zgody na odroczony termin płatności (formę: Przelew).",
      };

    // 3. WIARYGODNY PŁATNIK (Poprawiona logika):
    // Jeśli ma zgodę, brak długów i jego historia jest "czysta" (ratioCritical < 5%)
    // To bez względu na to czy ma 1, 2 czy 100 faktur - jest wiarygodny.
    if (ratioCritical <= 0.05 && totalPaidOnTime > 0)
      return {
        label: "WIARYGODNY PŁATNIK",
        color: "#2e7d32",
        icon: <IoShieldCheckmarkOutline size={22} />,
        text: "Klient posiada pozytywną historię płatności i wymaganą zgodę na formę przelewową.",
      };

    // 4. OGRANICZONE ZAUFANIE: Jeśli jednak ratioCritical jest między 5% a 15%
    if (ratioCritical > 0.05)
      return {
        label: "OGRANICZONE ZAUFANIE",
        color: "#f9a825",
        icon: <IoWarning size={22} />,
        text: `W historii występują opóźnienia (${(ratioCritical * 100).toFixed(1)}% faktur powyżej 8 dni). Zalecane monitorowanie płatności.`,
      };

    // Domyślny dla nowych bez żadnej rozliczonej faktury
    return {
      label: "W TRAKCIE WERYFIKACJI",
      color: "#607d8b",
      icon: <IoSearchOutline size={22} />,
      text: "Brak rozliczonych dokumentów do pełnej oceny historycznej.",
    };
  }, [reportData, statsByYear, isBlacklisted, hasTransferConsent]);

  return (
    // ... reszta kodu JSX pozostaje bez zmian ...
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
                  Analiza długu i historii:{" "}
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
            <section className="sm-edit-column">
              <div className="sm-edit-card">
                <h3>DANE PODSTAWOWE</h3>
                <div className="sm-view-field">
                  <label>Nazwa kontrahenta</label>
                  <span className="sm-value-important">
                    {contractor.NAZWA_KONTRAHENTA_SLOWNIK}
                  </span>
                </div>
                <div className="sm-view-field">
                  <label>Adres siedziby</label>
                  <span>
                    {contractor.A_ULICA_EXT} {contractor.A_NRDOMU}
                    <br />
                    {contractor.A_KOD} {contractor.A_MIASTO}
                  </span>
                </div>
                <div className="sm-view-row">
                  <div className="sm-view-field">
                    <label>NIP</label>
                    <span>{contractor.KONTR_NIP || "---"}</span>
                  </div>
                  <div className="sm-view-field">
                    <label>Status listy</label>
                    <span
                      style={{
                        color: isBlacklisted ? "#b71c1c" : "#2e7d32",
                        fontWeight: 700,
                      }}
                    >
                      {isBlacklisted ? "CZARNA" : "BIAŁA"}
                    </span>
                  </div>
                </div>
                <div className="sm-view-field">
                  <label>Zgoda na termin (Przelew)</label>
                  <span
                    style={{
                      color: hasTransferConsent ? "#2e7d32" : "#c62828",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {hasTransferConsent ? (
                      <>
                        <IoShieldCheckmarkOutline /> TAK / WYRAŻONA
                      </>
                    ) : (
                      <>
                        <IoAlertCircleOutline /> NIE / BRAK
                      </>
                    )}
                  </span>
                </div>
              </div>
            </section>

            <section className="sm-edit-column">
              <div className="sm-edit-card highlight-card">
                <h3>STRUKTURA ROZLICZEŃ</h3>
                {Object.keys(statsByYear).length === 0 && (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#7f8c8d",
                      padding: "20px",
                    }}
                  >
                    Brak danych operacyjnych
                  </p>
                )}
                {Object.keys(statsByYear)
                  .sort((a, b) => b - a)
                  .map((year) => {
                    const s = statsByYear[year];
                    const hasOverdue = s.unpaidOverdue.count > 0;
                    return (
                      <div key={year} style={{ marginBottom: "35px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "10px",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ color: "#1976d2", fontWeight: 800 }}
                          >
                            {year}
                          </Typography>
                          <span
                            style={{
                              fontSize: "0.85rem",
                              background: "#f1f4f8",
                              padding: "4px 10px",
                              borderRadius: "20px",
                            }}
                          >
                            Śr. opóźnienie:{" "}
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
                            <div className="sm-debt-header">
                              <label>Zaległości: PO TERMINIE</label>
                              {hasOverdue && (
                                <IoWarning color="#d32f2f" size={18} />
                              )}
                            </div>
                            <div className="sm-debt-content">
                              <strong>{s.unpaidOverdue.count} szt.</strong>
                              <span className="sm-debt-amount">
                                {formatPLN(s.unpaidOverdue.sum)}
                              </span>
                            </div>
                          </div>
                          <div className="sm-debt-box-clean">
                            <label>W terminie (OTWARTE)</label>
                            <div className="sm-debt-content-small">
                              <span>{s.unpaidInTerm.count} szt.</span>
                              <strong>{formatPLN(s.unpaidInTerm.sum)}</strong>
                            </div>
                          </div>
                        </div>

                        <label className="sm-section-label-mini">
                          Historia spłacalności (zamknięte):
                        </label>
                        <div className="sm-buckets-grid">
                          <div
                            className="sm-bucket-mini"
                            style={{ borderLeftColor: "#2e7d32" }}
                          >
                            <label>W terminie ({s.before.count})</label>
                            <span className="bucket-sum-small">
                              {formatPLN(s.before.sum)}
                            </span>
                          </div>
                          <div
                            className="sm-bucket-mini"
                            style={{ borderLeftColor: "#fbc02d" }}
                          >
                            <label>1-8 dni ({s.late1to8.count})</label>
                            <span className="bucket-sum-small">
                              {formatPLN(s.late1to8.sum)}
                            </span>
                          </div>
                          <div
                            className="sm-bucket-mini"
                            style={{ borderLeftColor: "#fb8c00" }}
                          >
                            <label>9-20 dni ({s.late9to20.count})</label>
                            <span className="bucket-sum-small">
                              {formatPLN(s.late9to20.sum)}
                            </span>
                          </div>
                          <div
                            className="sm-bucket-mini"
                            style={{ borderLeftColor: "#d32f2f" }}
                          >
                            <label>Pow. 20 dni ({s.lateOver20.count})</label>
                            <span className="bucket-sum-small">
                              {formatPLN(s.lateOver20.sum)}
                            </span>
                          </div>
                        </div>
                        <Divider sx={{ mt: 3 }} />
                      </div>
                    );
                  })}
              </div>
            </section>

            <section className="sm-edit-column">
              <div className="sm-edit-card">
                <h3>REKOMENDACJA SYSTEMOWA</h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      padding: "20px",
                      borderRadius: "12px",
                      background: `${risk.color}10`,
                      border: `2px solid ${risk.color}`,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: risk.color,
                        fontWeight: 800,
                        mb: 1.5,
                        fontSize: "0.9rem",
                        textTransform: "uppercase",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {risk.icon} Status:
                    </Typography>
                    <p
                      style={{
                        fontSize: "1rem",
                        margin: 0,
                        color: "#2c3e50",
                        fontWeight: 500,
                        lineHeight: 1.6,
                      }}
                    >
                      {risk.text}
                    </p>
                  </div>
                  <div
                    className="sm-view-field"
                    style={{
                      background: "#f8f9fa",
                      padding: "15px",
                      borderRadius: "8px",
                    }}
                  >
                    <label>Łączna liczba wszystkich faktur</label>
                    <span style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                      {reportData.length}
                    </span>
                  </div>
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
