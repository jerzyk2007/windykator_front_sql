// import { useState, useEffect, useMemo } from "react";
// import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
// import PleaseWait from "../../PleaseWait";
// import { Divider, Typography } from "@mui/material";
// import {
//   IoArrowBackOutline,
//   IoPauseCircleOutline,
//   IoPlayCircleOutline,
//   IoTrendingUpOutline,
//   IoAlertCircleOutline,
//   IoCheckmarkDoneOutline,
//   IoHelpCircleOutline,
//   IoWarning,
// } from "react-icons/io5";

// const formatPLN = (value) => {
//   return (
//     new Intl.NumberFormat("pl-PL", {
//       style: "decimal",
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//       useGrouping: true,
//     }).format(value || 0) + " zł"
//   );
// };

// const ReportContractor = ({ contractor, onBack }) => {
//   const axiosPrivateIntercept = useAxiosPrivateIntercept();
//   const [pleaseWait, setPleaseWait] = useState(false);
//   const [reportData, setReportData] = useState([]);

//   const isBlacklisted = contractor.KOD_KONTR_LISTA === "CZARNA";

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         setPleaseWait(true);
//         const result = await axiosPrivateIntercept.get(
//           `/contractor/get-report-data/${contractor.KONTRAHENT_ID}/${contractor.SPOLKA}`,
//         );
//         setReportData(result.data || []);
//       } catch (error) {
//         console.error("Błąd:", error);
//       } finally {
//         setPleaseWait(false);
//       }
//     };
//     getData();
//   }, [contractor, axiosPrivateIntercept]);

//   const statsByYear = useMemo(() => {
//     if (!reportData || reportData.length === 0) return {};
//     const stats = {};
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Porównujemy same daty

//     reportData.forEach((item) => {
//       const year = new Date(item.DATA_FV).getFullYear();
//       if (!stats[year]) {
//         stats[year] = {
//           count: 0,
//           total: 0,
//           before: { count: 0, sum: 0 },
//           late1to8: { count: 0, sum: 0 },
//           late9to20: { count: 0, sum: 0 },
//           lateOver20: { count: 0, sum: 0 },
//           unpaidOverdue: { count: 0, sum: 0 }, // PO TERMINIE
//           unpaidInTerm: { count: 0, sum: 0 }, // W TERMINIE
//           settled: 0,
//           delaySum: 0,
//         };
//       }
//       const s = stats[year];
//       s.count++;
//       s.total += item.BRUTTO || 0;

//       const termDate = new Date(item.TERMIN);
//       termDate.setHours(0, 0, 0, 0);

//       // 1. Obsługa faktur NIEROZLICZONYCH
//       if (item.DO_ROZLICZENIA > 0) {
//         if (termDate < today) {
//           s.unpaidOverdue.count++;
//           s.unpaidOverdue.sum += item.BRUTTO;
//         } else {
//           s.unpaidInTerm.count++;
//           s.unpaidInTerm.sum += item.BRUTTO;
//         }
//       }

//       // 2. Obsługa faktur ROZLICZONYCH (Historia)
//       else if (item.DATA_ROZL_AS) {
//         s.settled++;
//         const rozlDate = new Date(item.DATA_ROZL_AS);
//         const diff = Math.ceil((rozlDate - termDate) / (1000 * 3600 * 24));
//         const kwota = item.BRUTTO;

//         s.delaySum += diff > 0 ? diff : 0;

//         if (diff <= 0) {
//           s.before.count++;
//           s.before.sum += kwota;
//         } else if (diff <= 8) {
//           s.late1to8.count++;
//           s.late1to8.sum += kwota;
//         } else if (diff <= 20) {
//           s.late9to20.count++;
//           s.late9to20.sum += kwota;
//         } else {
//           s.lateOver20.count++;
//           s.lateOver20.sum += kwota;
//         }
//       }
//     });
//     return stats;
//   }, [reportData]);

//   const risk = useMemo(() => {
//     if (isBlacklisted)
//       return {
//         label: "KONTRAHENT ZABLOKOWANY",
//         color: "#b71c1c",
//         icon: <IoAlertCircleOutline size={22} />,
//         text: "UWAGA: Czarna lista. Całkowity zakaz sprzedaży z odroczonym terminem.",
//       };
//     if (reportData.length === 0)
//       return {
//         label: "BRAK HISTORII",
//         color: "#7f8c8d",
//         icon: <IoHelpCircleOutline size={22} />,
//         text: "Brak danych o fakturach.",
//       };

//     let totalCritical = 0;
//     Object.values(statsByYear).forEach((y) => {
//       totalCritical +=
//         y.late9to20.count + y.lateOver20.count + y.unpaidOverdue.count;
//     });
//     const ratio = totalCritical / reportData.length;

//     if (ratio > 0.15)
//       return {
//         label: "WYSOKIE RYZYKO",
//         color: "#d32f2f",
//         icon: <IoAlertCircleOutline size={22} />,
//         text: "Wysoka zaległość lub nieterminowość. Zalecana blokada kredytu.",
//       };
//     return {
//       label: "WIARYGODNY PŁATNIK",
//       color: "#2e7d32",
//       icon: <IoCheckmarkDoneOutline size={22} />,
//       text: "Klient płaci terminowo.",
//     };
//   }, [reportData, statsByYear, isBlacklisted]);

//   return (
//     <>
//       {pleaseWait ? (
//         <PleaseWait />
//       ) : (
//         <div className="sm-edit-wrapper">
//           <header className="sm-edit-header">
//             <div className="sm-edit-header-left">
//               <button className="sm-back-btn" onClick={onBack} title="Wróć">
//                 <IoArrowBackOutline />
//               </button>
//               <div>
//                 <div
//                   style={{ display: "flex", alignItems: "center", gap: "12px" }}
//                 >
//                   <h1>Raport płatniczy</h1>
//                   <span className="sm-spolka-badge">{contractor.SPOLKA}</span>
//                 </div>
//                 <p>
//                   Analiza długu i historii:{" "}
//                   {contractor.NAZWA_KONTRAHENTA_SLOWNIK}
//                 </p>
//               </div>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px",
//                 padding: "8px 20px",
//                 borderRadius: "8px",
//                 border: `2px solid ${risk.color}`,
//                 color: risk.color,
//                 background: `${risk.color}05`,
//               }}
//             >
//               {risk.icon}{" "}
//               <strong style={{ fontSize: "1rem", textTransform: "uppercase" }}>
//                 {risk.label}
//               </strong>
//             </div>
//           </header>

//           <div className="sm-edit-grid">
//             <section className="sm-edit-column">
//               <div className="sm-edit-card">
//                 <h3>DANE PODSTAWOWE</h3>
//                 <div className="sm-view-field">
//                   <label>Nazwa kontrahenta</label>
//                   <span className="sm-value-important">
//                     {contractor.NAZWA_KONTRAHENTA_SLOWNIK}
//                   </span>
//                 </div>
//                 <div className="sm-view-field">
//                   <label>Adres siedziby</label>
//                   <span>
//                     {contractor.A_ULICA_EXT} {contractor.A_NRDOMU}
//                     <br />
//                     {contractor.A_KOD} {contractor.A_MIASTO}
//                   </span>
//                 </div>
//                 <div className="sm-view-row">
//                   <div className="sm-view-field">
//                     <label>NIP</label>
//                     <span>{contractor.KONTR_NIP || "---"}</span>
//                   </div>
//                   <div className="sm-view-field">
//                     <label>Status listy</label>
//                     <span style={{ color: risk.color, fontWeight: 700 }}>
//                       {isBlacklisted ? "CZARNA" : "BIAŁA"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             <section className="sm-edit-column">
//               <div className="sm-edit-card highlight-card">
//                 <h3>STRUKTURA ROZLICZEŃ</h3>
//                 {Object.keys(statsByYear)
//                   .sort((a, b) => b - a)
//                   .map((year) => {
//                     const s = statsByYear[year];
//                     const hasOverdue = s.unpaidOverdue.count > 0;

//                     return (
//                       <div key={year} style={{ marginBottom: "35px" }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                             marginBottom: "10px",
//                           }}
//                         >
//                           <Typography
//                             variant="h6"
//                             sx={{ color: "#1976d2", fontWeight: 800 }}
//                           >
//                             {year}
//                           </Typography>
//                           <span
//                             style={{
//                               fontSize: "0.75rem",
//                               background: "#f1f4f8",
//                               padding: "4px 10px",
//                               borderRadius: "20px",
//                             }}
//                           >
//                             Śr. opóźnienie:{" "}
//                             {s.settled > 0
//                               ? (s.delaySum / s.settled).toFixed(1)
//                               : 0}{" "}
//                             dni
//                           </span>
//                         </div>

//                         {/* --- SEKCJA NIEROZLICZONE (AKTUALNE ZADŁUŻENIE) --- */}
//                         <div className="sm-unpaid-container">
//                           {/* 1. KRYTYCZNE: PO TERMINIE */}
//                           <div
//                             className={`sm-debt-box ${hasOverdue ? "active-debt" : ""}`}
//                           >
//                             <div className="sm-debt-header">
//                               <label>Nierozliczone: PO TERMINIE</label>
//                               {hasOverdue && (
//                                 <IoWarning color="#d32f2f" size={18} />
//                               )}
//                             </div>
//                             <div className="sm-debt-content">
//                               <strong>{s.unpaidOverdue.count} szt.</strong>
//                               <span className="sm-debt-amount">
//                                 {formatPLN(s.unpaidOverdue.sum)}
//                               </span>
//                             </div>
//                             {hasOverdue && (
//                               <small className="sm-debt-note">
//                                 Wymagana interwencja windykacyjna
//                               </small>
//                             )}
//                           </div>

//                           {/* 2. INFORMACYJNE: W TERMINIE */}
//                           <div className="sm-debt-box-clean">
//                             <label>Nierozliczone: W TERMINIE</label>
//                             <div className="sm-debt-content-small">
//                               <span>{s.unpaidInTerm.count} szt.</span>
//                               <strong>{formatPLN(s.unpaidInTerm.sum)}</strong>
//                             </div>
//                           </div>
//                         </div>

//                         <label className="sm-section-label-mini">
//                           Historia spłacalności (zamknięte):
//                         </label>
//                         <div className="sm-buckets-grid">
//                           <div
//                             className="sm-bucket-mini"
//                             style={{ borderLeftColor: "#2e7d32" }}
//                           >
//                             <label>W terminie ({s.before.count})</label>
//                             <span className="bucket-sum-small">
//                               {formatPLN(s.before.sum)}
//                             </span>
//                           </div>
//                           <div
//                             className="sm-bucket-mini"
//                             style={{ borderLeftColor: "#fbc02d" }}
//                           >
//                             <label>1 - 8 dni ({s.late1to8.count})</label>
//                             <span className="bucket-sum-small">
//                               {formatPLN(s.late1to8.sum)}
//                             </span>
//                           </div>
//                           <div
//                             className="sm-bucket-mini"
//                             style={{ borderLeftColor: "#fb8c00" }}
//                           >
//                             <label>9 - 20 dni ({s.late9to20.count})</label>
//                             <span className="bucket-sum-small">
//                               {formatPLN(s.late9to20.sum)}
//                             </span>
//                           </div>
//                           <div
//                             className="sm-bucket-mini"
//                             style={{ borderLeftColor: "#d32f2f" }}
//                           >
//                             <label>Pow. 20 dni ({s.lateOver20.count})</label>
//                             <span className="bucket-sum-small">
//                               {formatPLN(s.lateOver20.sum)}
//                             </span>
//                           </div>
//                         </div>
//                         <Divider sx={{ mt: 3 }} />
//                       </div>
//                     );
//                   })}
//               </div>
//             </section>

//             <section className="sm-edit-column">
//               <div className="sm-edit-card">
//                 <h3>ANALIZA I DECYZJA</h3>
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "15px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       padding: "15px",
//                       borderRadius: "8px",
//                       background: `${risk.color}15`,
//                       border: isBlacklisted
//                         ? `2px solid ${risk.color}`
//                         : `1px dashed ${risk.color}`,
//                     }}
//                   >
//                     <Typography
//                       variant="subtitle2"
//                       sx={{
//                         color: risk.color,
//                         fontWeight: 800,
//                         mb: 1,
//                         fontSize: "0.7rem",
//                         textTransform: "uppercase",
//                       }}
//                     >
//                       Rekomendacja:
//                     </Typography>
//                     <p
//                       style={{
//                         fontSize: "0.95rem",
//                         margin: 0,
//                         color: "#2c3e50",
//                         fontWeight: isBlacklisted ? 700 : 500,
//                         lineHeight: 1.5,
//                       }}
//                     >
//                       {risk.text}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ReportContractor;

import { useState, useEffect, useMemo } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import PleaseWait from "../../PleaseWait";
import { Divider, Typography } from "@mui/material";
import {
  IoArrowBackOutline,
  IoPauseCircleOutline,
  IoPlayCircleOutline,
  IoTrendingUpOutline,
  IoAlertCircleOutline,
  IoCheckmarkDoneOutline,
  IoHelpCircleOutline,
  IoWarning,
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

  // LOGIKA: Czy kontrahent ma zgodę na przelew?
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
          total: 0,
          before: { count: 0, sum: 0 },
          late1to8: { count: 0, sum: 0 },
          late9to20: { count: 0, sum: 0 },
          lateOver20: { count: 0, sum: 0 },
          unpaidOverdue: { count: 0, sum: 0 },
          unpaidInTerm: { count: 0, sum: 0 },
          settled: 0,
          delaySum: 0,
        };
      }
      const s = stats[year];
      s.count++;
      s.total += item.BRUTTO || 0;

      const termDate = new Date(item.TERMIN);
      termDate.setHours(0, 0, 0, 0);

      if (item.DO_ROZLICZENIA > 0) {
        if (termDate < today) {
          s.unpaidOverdue.count++;
          s.unpaidOverdue.sum += item.BRUTTO;
        } else {
          s.unpaidInTerm.count++;
          s.unpaidInTerm.sum += item.BRUTTO;
        }
      } else if (item.DATA_ROZL_AS) {
        s.settled++;
        const rozlDate = new Date(item.DATA_ROZL_AS);
        const diff = Math.ceil((rozlDate - termDate) / (1000 * 3600 * 24));
        const kwota = item.BRUTTO;
        s.delaySum += diff > 0 ? diff : 0;

        if (diff <= 0) {
          s.before.count++;
          s.before.sum += kwota;
        } else if (diff <= 8) {
          s.late1to8.count++;
          s.late1to8.sum += kwota;
        } else if (diff <= 20) {
          s.late9to20.count++;
          s.late9to20.sum += kwota;
        } else {
          s.lateOver20.count++;
          s.lateOver20.sum += kwota;
        }
      }
    });
    return stats;
  }, [reportData]);

  const risk = useMemo(() => {
    if (isBlacklisted)
      return {
        label: "KONTRAHENT ZABLOKOWANY",
        color: "#b71c1c",
        icon: <IoAlertCircleOutline size={22} />,
        text: "UWAGA: Czarna lista. Całkowity zakaz sprzedaży z odroczonym terminem płatności.",
      };
    if (reportData.length === 0)
      return {
        label: "BRAK HISTORII",
        color: "#7f8c8d",
        icon: <IoHelpCircleOutline size={22} />,
        text: "Brak danych o fakturach dla tego kontrahenta.",
      };

    let totalCritical = 0;
    Object.values(statsByYear).forEach((y) => {
      totalCritical +=
        y.late9to20.count + y.lateOver20.count + y.unpaidOverdue.count;
    });
    const ratio = totalCritical / reportData.length;

    if (ratio > 0.15)
      return {
        label: "WYSOKIE RYZYKO",
        color: "#d32f2f",
        icon: <IoAlertCircleOutline size={22} />,
        text: "Wysoka zaległość lub nieterminowość. Zalecana blokada sprzedaży odroczonej.",
      };
    return {
      label: "WIARYGODNY PŁATNIK",
      color: "#2e7d32",
      icon: <IoCheckmarkDoneOutline size={22} />,
      text: "Klient reguluje płatności terminowo.",
    };
  }, [reportData, statsByYear, isBlacklisted]);

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
                <p>
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
                padding: "8px 20px",
                borderRadius: "8px",
                border: `2px solid ${risk.color}`,
                color: risk.color,
                background: `${risk.color}05`,
              }}
            >
              {risk.icon}{" "}
              <strong style={{ fontSize: "1rem", textTransform: "uppercase" }}>
                {risk.label}
              </strong>
            </div>
          </header>

          <div className="sm-edit-grid">
            {/* KOLUMNA 1 */}
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
                    <span style={{ color: risk.color, fontWeight: 700 }}>
                      {isBlacklisted ? "CZARNA" : "BIAŁA"}
                    </span>
                  </div>
                </div>

                <div className="sm-view-field">
                  <label>Zgoda na termin (Przelew)</label>
                  <span
                    style={{
                      color: hasTransferConsent ? "#2e7d32" : "#d32f2f",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {hasTransferConsent ? "TAK / WYRAŻONA" : "NIE / BRAK"}
                    {hasTransferConsent && (
                      <small style={{ fontWeight: 400, color: "#7f8c8d" }}>
                        ({contractor.PRZYPISANA_FORMA_PLATNOSCI})
                      </small>
                    )}
                  </span>
                </div>
              </div>
            </section>

            {/* KOLUMNA 2 */}
            <section className="sm-edit-column">
              <div className="sm-edit-card highlight-card">
                <h3>STRUKTURA ROZLICZEŃ</h3>
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
                              fontSize: "0.75rem",
                              background: "#f1f4f8",
                              padding: "4px 10px",
                              borderRadius: "20px",
                            }}
                          >
                            Śr. opóźnienie:{" "}
                            {s.settled > 0
                              ? (s.delaySum / s.settled).toFixed(1)
                              : 0}{" "}
                            dni
                          </span>
                        </div>

                        <div className="sm-unpaid-container">
                          <div
                            className={`sm-debt-box ${hasOverdue ? "active-debt" : ""}`}
                          >
                            <div className="sm-debt-header">
                              <label>Nierozliczone: PO TERMINIE</label>
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
                            {hasOverdue && (
                              <small className="sm-debt-note">
                                Wymagana interwencja windykacyjna
                              </small>
                            )}
                          </div>
                          <div className="sm-debt-box-clean">
                            <label>Nierozliczone: W TERMINIE</label>
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
                            <label>1 - 8 dni ({s.late1to8.count})</label>
                            <span className="bucket-sum-small">
                              {formatPLN(s.late1to8.sum)}
                            </span>
                          </div>
                          <div
                            className="sm-bucket-mini"
                            style={{ borderLeftColor: "#fb8c00" }}
                          >
                            <label>9 - 20 dni ({s.late9to20.count})</label>
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

            {/* KOLUMNA 3 */}
            <section className="sm-edit-column">
              <div className="sm-edit-card">
                <h3>ANALIZA I DECYZJA</h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      padding: "15px",
                      borderRadius: "8px",
                      background: `${risk.color}15`,
                      border: isBlacklisted
                        ? `2px solid ${risk.color}`
                        : `1px dashed ${risk.color}`,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: risk.color,
                        fontWeight: 800,
                        mb: 1,
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                      }}
                    >
                      Rekomendacja:
                    </Typography>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        margin: 0,
                        color: "#2c3e50",
                        fontWeight: isBlacklisted ? 700 : 500,
                        lineHeight: 1.5,
                      }}
                    >
                      {risk.text}
                    </p>
                  </div>
                  <div className="sm-view-field">
                    <label>Łączna liczba faktur w historii</label>
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
