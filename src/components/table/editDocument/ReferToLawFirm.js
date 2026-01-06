// import { useState, useEffect } from "react";
// import { Button, Tooltip } from "@mui/material"; // Możesz użyć Tooltip z MUI dla lepszego UX
// import { formatNip } from "../utilsForTable/tableFunctions";

// import "./ReferToLawFirm.css";

// // Formatuje liczbę do widoku (np. -500 -> "-500,00")
// const formatAmount = (value) => {
//   if (value === null || value === undefined || value === "") {
//     return "";
//   }
//   const num =
//     typeof value === "string" ? parseFloat(value.replace(",", ".")) : value;

//   if (isNaN(num)) return String(value);

//   return num.toLocaleString("pl-PL", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//     useGrouping: true,
//   });
// };

// // Parsuje tekst z powrotem na liczbę
// const parseFormattedAmount = (formattedString) => {
//   if (!formattedString) return 0;
//   const cleanString = String(formattedString)
//     .replace(/\s/g, "")
//     .replace(",", ".");
//   const num = parseFloat(cleanString);
//   return isNaN(num) ? 0 : num;
// };

// const ReferToLawFirm = ({
//   handleAddNote,
//   lawFirmData,
//   setLawFirmData,
//   lawFirmTransferDate,
// }) => {
//   const [displayKwotaRoszczenia, setDisplayKwotaRoszczenia] = useState("");
//   // Synchronizacja przy ładowaniu danych (podpowiadanie wartości)
//   useEffect(() => {
//     if (lawFirmData.kwotaRoszczenia !== undefined) {
//       setDisplayKwotaRoszczenia(formatAmount(lawFirmData.kwotaRoszczenia));
//     }
//   }, [lawFirmData.kwotaRoszczenia]);

//   const handleKwotaRoszczeniaChange = (e) => {
//     setDisplayKwotaRoszczenia(e.target.value);
//   };

//   const handleKwotaRoszczeniaBlur = (e) => {
//     const parsedValue = parseFormattedAmount(e.target.value);
//     setLawFirmData((prev) => ({
//       ...prev,
//       kwotaRoszczenia: parsedValue,
//     }));
//     setDisplayKwotaRoszczenia(formatAmount(parsedValue));
//   };

//   const handleAccept = () => {
//     const noteText = `Przekazano do kancelarii: ${
//       lawFirmData.kancelaria
//     } (Kwota roszczenia: ${formatAmount(lawFirmData.kwotaRoszczenia)} zł)`;
//     handleAddNote(noteText, "log", "documents");

//     setLawFirmData((prev) => ({
//       ...prev,
//       zapisz: true,
//     }));
//   };

//   // Warunek walidacji
//   const isAmountInvalid = lawFirmData.kwotaRoszczenia <= 0;

//   const referPanel = () => {
//     return (
//       <section className="refer_to_law_firm">
//         <span className="edit-doc-settlements--title refer_to_law_firm--title">
//           Przekaż sprawę do zewnętrznej kancelarii
//         </span>

//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Faktura:</span>
//           <span className="edit_doc--content">{lawFirmData.numerFv}</span>
//         </section>

//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Kontrahent:</span>
//           <span
//             className={
//               lawFirmData?.kontrahent?.length > 240
//                 ? "refer_to_law_firm--content-scroll"
//                 : "refer_to_law_firm--content"
//             }
//             style={
//               lawFirmData?.kontrahent?.length > 240
//                 ? { overflowY: "auto", maxHeight: "160px" }
//                 : null
//             }
//           >
//             {lawFirmData.kontrahent}
//           </span>
//         </section>

//         <section className="edit_doc__container">
//           <span className="edit_doc--title">NIP:</span>
//           <span className="edit_doc--content">
//             {formatNip(lawFirmData.nip)}
//           </span>
//         </section>

//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Kwota roszczenia:</span>
//           <div
//             className="edit_doc__container-message"
//             // style={{ display: "flex", flexDirection: "column", width: "100%" }}
//           >
//             <input
//               className={`edit_doc--content refer_to_law_firm--input ${
//                 isAmountInvalid ? "input-error-border" : ""
//               }`}
//               type="text"
//               value={displayKwotaRoszczenia}
//               onChange={handleKwotaRoszczeniaChange}
//               onBlur={handleKwotaRoszczeniaBlur}
//               style={
//                 isAmountInvalid
//                   ? { borderColor: "red", backgroundColor: "#fff0f0" }
//                   : {}
//               }
//             />
//             {isAmountInvalid && (
//               <span
//                 style={{
//                   color: "red",
//                   fontSize: "0.7rem",
//                   marginTop: "4px",
//                   fontWeight: "bold",
//                 }}
//               >
//                 Wartość musi być większa od zera!
//               </span>
//             )}
//           </div>
//         </section>

//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Wybierz kancelarię:</span>
//           <select
//             className="edit_doc--select"
//             value={lawFirmData?.kancelaria || ""}
//             onChange={(e) =>
//               setLawFirmData((prev) => ({
//                 ...prev,
//                 kancelaria: e.target.value,
//               }))
//             }
//           >
//             <option value="" disabled hidden>
//               -- Wybierz kancelarię --
//             </option>
//             {lawFirmData?.kancelariaWybor?.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         </section>

//         <section className="refer_to_law_firm--panel">
//           <Tooltip
//             title={
//               isAmountInvalid
//                 ? "Nie można wprowadzić kwoty mniejszej lub równej zero"
//                 : ""
//             }
//             arrow
//           >
//             <span>
//               {" "}
//               {/* Span jest potrzebny, aby Tooltip działał na disabled Button */}
//               <Button
//                 className="mui-button"
//                 variant="contained"
//                 size="medium"
//                 disabled={
//                   lawFirmData.zapisz === true ||
//                   !lawFirmData.kancelaria ||
//                   isAmountInvalid
//                 }
//                 onClick={handleAccept}
//               >
//                 {lawFirmData.zapisz ? "Wprowadzono" : "Wprowadź"}
//               </Button>
//             </span>
//           </Tooltip>
//         </section>
//       </section>
//     );
//   };

//   const infoPanel = () => {
//     return (
//       <section className="refer_to_law_firm">
//         <span className="edit-doc-settlements--title refer_to_law_firm--title">
//           Informacja
//         </span>
//         <section className="refer_to_law_firm__info_panel">
//           <span>Sprawę przekazano do kancelarii:</span>
//           <span className="refer_to_law_firm__info_panel--date">
//             {lawFirmTransferDate}
//           </span>
//         </section>
//       </section>
//     );
//   };

//   return (
//     // <section className="refer_to_law_firm">
//     lawFirmTransferDate ? infoPanel() : referPanel()
//     // </section>
//   );
//   // return (
//   //   <section className="refer_to_law_firm">
//   //     <span className="edit-doc-settlements--title refer_to_law_firm--title">
//   //       Przekaż sprawę do zewnętrznej kancelarii
//   //     </span>

//   //     <section className="edit_doc__container">
//   //       <span className="edit_doc--title">Faktura:</span>
//   //       <span className="edit_doc--content">{lawFirmData.numerFv}</span>
//   //     </section>

//   //     <section className="edit_doc__container">
//   //       <span className="edit_doc--title">Kontrahent:</span>
//   //       <span
//   //         className={
//   //           lawFirmData?.kontrahent?.length > 240
//   //             ? "refer_to_law_firm--content-scroll"
//   //             : "refer_to_law_firm--content"
//   //         }
//   //         style={
//   //           lawFirmData?.kontrahent?.length > 240
//   //             ? { overflowY: "auto", maxHeight: "160px" }
//   //             : null
//   //         }
//   //       >
//   //         {lawFirmData.kontrahent}
//   //       </span>
//   //     </section>

//   //     <section className="edit_doc__container">
//   //       <span className="edit_doc--title">NIP:</span>
//   //       <span className="edit_doc--content">{formatNip(lawFirmData.nip)}</span>
//   //     </section>

//   //     <section className="edit_doc__container">
//   //       <span className="edit_doc--title">Kwota roszczenia:</span>
//   //       <div
//   //         className="edit_doc__container-message"
//   //         // style={{ display: "flex", flexDirection: "column", width: "100%" }}
//   //       >
//   //         <input
//   //           className={`edit_doc--content refer_to_law_firm--input ${
//   //             isAmountInvalid ? "input-error-border" : ""
//   //           }`}
//   //           type="text"
//   //           value={displayKwotaRoszczenia}
//   //           onChange={handleKwotaRoszczeniaChange}
//   //           onBlur={handleKwotaRoszczeniaBlur}
//   //           style={
//   //             isAmountInvalid
//   //               ? { borderColor: "red", backgroundColor: "#fff0f0" }
//   //               : {}
//   //           }
//   //         />
//   //         {isAmountInvalid && (
//   //           <span
//   //             style={{
//   //               color: "red",
//   //               fontSize: "0.7rem",
//   //               marginTop: "4px",
//   //               fontWeight: "bold",
//   //             }}
//   //           >
//   //             Wartość musi być większa od zera!
//   //           </span>
//   //         )}
//   //       </div>
//   //     </section>

//   //     <section className="edit_doc__container">
//   //       <span className="edit_doc--title">Wybierz kancelarię:</span>
//   //       <select
//   //         className="edit_doc--select"
//   //         value={lawFirmData?.kancelaria || ""}
//   //         onChange={(e) =>
//   //           setLawFirmData((prev) => ({ ...prev, kancelaria: e.target.value }))
//   //         }
//   //       >
//   //         <option value="" disabled hidden>
//   //           -- Wybierz kancelarię --
//   //         </option>
//   //         {lawFirmData?.kancelariaWybor?.map((option, index) => (
//   //           <option key={index} value={option}>
//   //             {option}
//   //           </option>
//   //         ))}
//   //       </select>
//   //     </section>

//   //     <section className="refer_to_law_firm--panel">
//   //       <Tooltip
//   //         title={
//   //           isAmountInvalid
//   //             ? "Nie można wprowadzić kwoty mniejszej lub równej zero"
//   //             : ""
//   //         }
//   //         arrow
//   //       >
//   //         <span>
//   //           {" "}
//   //           {/* Span jest potrzebny, aby Tooltip działał na disabled Button */}
//   //           <Button
//   //             className="mui-button"
//   //             variant="contained"
//   //             size="medium"
//   //             disabled={
//   //               lawFirmData.zapisz === true ||
//   //               !lawFirmData.kancelaria ||
//   //               isAmountInvalid
//   //             }
//   //             onClick={handleAccept}
//   //           >
//   //             {lawFirmData.zapisz ? "Wprowadzono" : "Wprowadź"}
//   //           </Button>
//   //         </span>
//   //       </Tooltip>
//   //     </section>
//   //   </section>
//   // );
// };

// export default ReferToLawFirm;

import { useState, useEffect } from "react";
import { Button, Tooltip } from "@mui/material";
import { formatNip } from "../utilsForTable/tableFunctions";

const formatAmount = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num =
    typeof value === "string" ? parseFloat(value.replace(",", ".")) : value;
  if (isNaN(num)) return String(value);
  return num.toLocaleString("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
};

const parseFormattedAmount = (formattedString) => {
  if (!formattedString) return 0;
  const cleanString = String(formattedString)
    .replace(/\s/g, "")
    .replace(",", ".");
  const num = parseFloat(cleanString);
  return isNaN(num) ? 0 : num;
};

const ReferToLawFirm = ({
  handleAddNote,
  lawFirmData,
  setLawFirmData,
  lawFirmTransferDate,
}) => {
  const [displayKwotaRoszczenia, setDisplayKwotaRoszczenia] = useState("");

  useEffect(() => {
    if (lawFirmData.kwotaRoszczenia !== undefined) {
      setDisplayKwotaRoszczenia(formatAmount(lawFirmData.kwotaRoszczenia));
    }
  }, [lawFirmData.kwotaRoszczenia]);

  const handleKwotaRoszczeniaChange = (e) =>
    setDisplayKwotaRoszczenia(e.target.value);

  const handleKwotaRoszczeniaBlur = (e) => {
    const parsedValue = parseFormattedAmount(e.target.value);
    setLawFirmData((prev) => ({ ...prev, kwotaRoszczenia: parsedValue }));
    setDisplayKwotaRoszczenia(formatAmount(parsedValue));
  };

  const handleAccept = () => {
    const noteText = `Przekazano do kancelarii: ${
      lawFirmData.kancelaria
    } (Kwota roszczenia: ${formatAmount(lawFirmData.kwotaRoszczenia)} zł)`;
    handleAddNote(noteText, "log", "documents");
    setLawFirmData((prev) => ({ ...prev, zapisz: true }));
  };

  const isAmountInvalid = lawFirmData.kwotaRoszczenia <= 0;

  const referPanel = () => (
    <section className="ertp-data-section ertp-law-firm-transfer">
      <span className="ertp__header">
        Przekaż sprawę do zewnętrznej kancelarii
      </span>

      <section className="ertp-data-row">
        <span className="ertp-data-row__label">Faktura:</span>
        <span className="ertp-data-row__value">{lawFirmData.numerFv}</span>
      </section>

      <section className="ertp-data-row">
        <span className="ertp-data-row__label">Kontrahent:</span>
        <span
          className={
            lawFirmData?.kontrahent?.length > 240
              ? "ertp-data-row__value ertp-data-row__value--scrollable"
              : "ertp-data-row__value"
          }
          style={
            lawFirmData?.kontrahent?.length > 240
              ? { maxHeight: "160px" }
              : null
          }
        >
          {lawFirmData.kontrahent}
        </span>
      </section>

      <section className="ertp-data-row">
        <span className="ertp-data-row__label">NIP:</span>
        <span className="ertp-data-row__value">
          {formatNip(lawFirmData.nip)}
        </span>
      </section>

      <section className="ertp-data-row">
        <span className="ertp-data-row__label">Kwota roszczenia:</span>
        <div className="ertp-input-group-vertical">
          <input
            className={`ertp-input-text ${
              isAmountInvalid ? "ertp-input-text--error" : ""
            }`}
            type="text"
            value={displayKwotaRoszczenia}
            onChange={handleKwotaRoszczeniaChange}
            onBlur={handleKwotaRoszczeniaBlur}
            style={isAmountInvalid ? { backgroundColor: "#fff0f0" } : {}}
          />
          {isAmountInvalid && (
            <span
              style={{
                color: "red",
                fontSize: "0.7rem",
                marginTop: "4px",
                fontWeight: "bold",
              }}
            >
              Wartość musi być większa od zera!
            </span>
          )}
        </div>
      </section>

      <section className="ertp-data-row">
        <span className="ertp-data-row__label">Wybierz kancelarię:</span>
        <select
          className="ertp-input-select"
          value={lawFirmData?.kancelaria || ""}
          onChange={(e) =>
            setLawFirmData((prev) => ({ ...prev, kancelaria: e.target.value }))
          }
        >
          <option value="" disabled hidden>
            -- Wybierz kancelarię --
          </option>
          {lawFirmData?.kancelariaWybor?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </section>

      <section className="ertp-form-actions">
        <Tooltip
          title={
            isAmountInvalid
              ? "Nie można wprowadzić kwoty mniejszej lub równej zero"
              : ""
          }
          arrow
        >
          <span>
            <Button
              variant="contained"
              size="medium"
              disabled={
                lawFirmData.zapisz === true ||
                !lawFirmData.kancelaria ||
                isAmountInvalid
              }
              onClick={handleAccept}
            >
              {lawFirmData.zapisz ? "Wprowadzono" : "Wprowadź"}
            </Button>
          </span>
        </Tooltip>
      </section>
    </section>
  );

  const infoPanel = () => (
    <section className="ertp-data-section ertp-law-firm-transfer">
      <span className="ertp__header">Informacja</span>
      <section className="ertp-info-box">
        <span>Sprawę przekazano do kancelarii:</span>
        <span className="ertp-info-box__date">{lawFirmTransferDate}</span>
      </section>
    </section>
  );

  return lawFirmTransferDate ? infoPanel() : referPanel();
};

export default ReferToLawFirm;
