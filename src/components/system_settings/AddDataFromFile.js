// import { useState } from "react";
// import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
// import PleaseWait from "../PleaseWait";
// import { saveAs } from "file-saver";
// import "./AddDataFromFile.css";

// const AddDataFromFile = () => {
//   const axiosPrivateIntercept = useAxiosPrivateIntercept();

//   const [errBecared, setErrBecared] = useState("");
//   const [errRubicon, setErrRubicon] = useState("");
//   const [errRandomFile, setErrRandomFile] = useState("");
//   const [errFile, setErrFile] = useState("");
//   const [pleaseWait, setPleaseWait] = useState(false);

//   const handleSendFileBL = async (e, type) => {
//     const file = e.target.files[0];
//     if (!file) return console.error("Brak pliku");
//     if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
//       setErrFile("Akceptowany jest tylko plik z rozszerzeniem .xlsx lub .xls");
//       setPleaseWait(false);

//       return;
//     }
//     try {
//       setPleaseWait(true);
//       const formData = new FormData();
//       formData.append("excelFile", file);

//       await axiosPrivateIntercept.post(
//         `/add-data/send-documents/${type}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       if (type === "becared") {
//         setErrBecared("Dokumenty zaktualizowane.");
//       } else if (type === "rubicon") {
//         setErrRubicon("Dokumenty zaktualizowane.");
//       } else if (type === "random") {
//         setErrRandomFile("Dokumenty zaktualizowane.");
//       }
//     } catch (error) {
//       if (type === "becared") {
//         setErrBecared("Błąd aktualizacji dokumentów.");
//       } else if (type === "rubicon") {
//         setErrRubicon("Błąd aktualizacji dokumentów.");
//       } else if (type === "random") {
//         setErrRandomFile("Błąd aktualizacji dokumentów.");
//       }
//       console.error("Błąd przesyłania pliku:", error);
//     } finally {
//       setPleaseWait(false);
//     }
//   };
//   const handleSendFileBL2 = async (e, type) => {
//     const file = e.target.files[0];
//     if (!file) return console.error("Brak pliku");
//     if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
//       setErrFile("Akceptowany jest tylko plik z rozszerzeniem .xlsx lub .xls");
//       setPleaseWait(false);

//       return;
//     }
//     try {
//       setPleaseWait(true);
//       const formData = new FormData();
//       formData.append("excelFile", file);

//       const raport = await axiosPrivateIntercept.post(
//         `/add-data/send-documents/${type}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           responseType: "arraybuffer", // <- bardzo ważne
//         }
//       );
//       const blob = new Blob([raport.data], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       });

//       // pobieramy plik
//       saveAs(blob, "raport.xlsx");
//       if (type === "becared") {
//         setErrBecared("Dokumenty zaktualizowane.");
//       } else if (type === "rubicon") {
//         setErrRubicon("Dokumenty zaktualizowane.");
//       } else if (type === "random") {
//         setErrRandomFile("Dokumenty zaktualizowane.");
//       }
//     } catch (error) {
//       if (type === "becared") {
//         setErrBecared("Błąd aktualizacji dokumentów.");
//       } else if (type === "rubicon") {
//         setErrRubicon("Błąd aktualizacji dokumentów.");
//       } else if (type === "random") {
//         setErrRandomFile("Błąd aktualizacji dokumentów.");
//       }
//       console.error("Błąd przesyłania pliku:", error);
//     } finally {
//       setPleaseWait(false);
//     }
//   };

//   return pleaseWait ? (
//     <PleaseWait />
//   ) : (
//     <section className="add_data_from_file">
//       <section className="add_data_from_file__container">
//         <section className="add_data_from_file__container--title">
//           <p style={errFile ? { color: "red" } : null}>
//             {errFile ? errFile : "Prześlij dane z plików Excel"}
//           </p>
//         </section>
//         <section className="add_data_from_file__container--data">
//           {!errRubicon ? (
//             <section className="add_data_from_file__container-documents">
//               <input
//                 type="file"
//                 name="uploadfile"
//                 id="rubicon"
//                 style={{ display: "none" }}
//                 onChange={(e) => handleSendFileBL(e, "rubicon")}
//               />
//               <label htmlFor="rubicon" className="add_data_file-click-me">
//                 Prześlij plik Rubicon
//               </label>
//             </section>
//           ) : (
//             <section className="add_data_from_file__container-documents">
//               <span className="add_data_file-click-me">{errRubicon}</span>
//             </section>
//           )}

//           {!errBecared ? (
//             <section className="add_data_from_file__container-documents">
//               <input
//                 type="file"
//                 name="uploadfile"
//                 id="becared"
//                 style={{ display: "none" }}
//                 onChange={(e) => handleSendFileBL(e, "becared")}
//               />
//               <label htmlFor="becared" className="add_data_file-click-me">
//                 Prześlij plik Becared
//               </label>
//             </section>
//           ) : (
//             <section className="add_data_from_file__container-documents">
//               <span className="add_data_file-click-me">{errBecared}</span>
//             </section>
//           )}

//           {/* {!errRandomFile ? (
//             <section className="add_data_from_file__container-documents">
//               <input
//                 type="file"
//                 name="uploadfile"
//                 id="random"
//                 style={{ display: "none" }}
//                 onChange={(e) => handleSendFileBL2(e, "random")}
//               />
//               <label htmlFor="random" className="add_data_file-click-me">
//                 Przesyłanie pliku jednorazowego
//               </label>
//             </section>
//           ) : (
//             <section className="add_data_from_file__container-documents">
//               <span className="add_data_file-click-me">{errRandomFile}</span>
//             </section>
//           )} */}
//         </section>
//       </section>
//     </section>
//   );
// };

// export default AddDataFromFile;

import { useState } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import { saveAs } from "file-saver";
import {
  faFileExcel,
  faCheckCircle,
  faCloudUploadAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./AddDataFromFile.css";

const AddDataFromFile = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [errBecared, setErrBecared] = useState("");
  const [errRubicon, setErrRubicon] = useState("");
  const [errFile, setErrFile] = useState("");
  const [pleaseWait, setPleaseWait] = useState(false);

  const handleSendFileBL = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setErrFile("Błąd: Akceptujemy tylko pliki Excel (.xlsx, .xls)");
      return;
    }

    setErrFile(""); // Reset błędu ogólnego
    try {
      setPleaseWait(true);
      const formData = new FormData();
      formData.append("excelFile", file);

      await axiosPrivateIntercept.post(
        `/add-data/send-documents/${type}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const msg = "Dokumenty zaktualizowane pomyślnie.";
      if (type === "becared") setErrBecared(msg);
      else if (type === "rubicon") setErrRubicon(msg);
    } catch (error) {
      const msg = "Błąd podczas przesyłania danych.";
      if (type === "becared") setErrBecared(msg);
      else if (type === "rubicon") setErrRubicon(msg);
    } finally {
      setPleaseWait(false);
    }
  };

  return (
    <section className="upload-page">
      {pleaseWait && <PleaseWait />}

      <div className="upload-card">
        <header className="upload-card__header">
          <h2 className="upload-card__title">
            Aktualizacja bazy z plików zewnętrznych
          </h2>
          <p className={`upload-card__subtitle ${errFile ? "msg-error" : ""}`}>
            {errFile ||
              "Wybierz odpowiedni plik Excel, aby zsynchronizować dane"}
          </p>
        </header>

        <div className="upload-card__content">
          {/* SEKCJA RUBICON */}
          <div
            className={`upload-zone ${
              errRubicon.includes("pomyślnie") ? "upload-zone--success" : ""
            }`}
          >
            <div className="upload-zone__icon">
              <FontAwesomeIcon
                icon={
                  errRubicon.includes("pomyślnie") ? faCheckCircle : faFileExcel
                }
              />
            </div>
            <div className="upload-zone__info">
              <h3>Plik Rubicon</h3>
              <p>{errRubicon || "Status: oczekiwanie na plik"}</p>
            </div>
            {!errRubicon.includes("pomyślnie") ? (
              <label htmlFor="rubicon" className="upload-zone__button">
                <FontAwesomeIcon icon={faCloudUploadAlt} /> Wybierz plik
              </label>
            ) : (
              <button
                className="upload-zone__button upload-zone__button--reset"
                onClick={() => setErrRubicon("")}
              >
                Prześlij ponownie
              </button>
            )}
            <input
              type="file"
              id="rubicon"
              style={{ display: "none" }}
              onChange={(e) => handleSendFileBL(e, "rubicon")}
            />
          </div>

          {/* SEKCJA BECARED */}
          <div
            className={`upload-zone ${
              errBecared.includes("pomyślnie") ? "upload-zone--success" : ""
            }`}
          >
            <div className="upload-zone__icon">
              <FontAwesomeIcon
                icon={
                  errBecared.includes("pomyślnie") ? faCheckCircle : faFileExcel
                }
              />
            </div>
            <div className="upload-zone__info">
              <h3>Plik Becared</h3>
              <p>{errBecared || "Status: oczekiwanie na plik"}</p>
            </div>
            {!errBecared.includes("pomyślnie") ? (
              <label htmlFor="becared" className="upload-zone__button">
                <FontAwesomeIcon icon={faCloudUploadAlt} /> Wybierz plik
              </label>
            ) : (
              <button
                className="upload-zone__button upload-zone__button--reset"
                onClick={() => setErrBecared("")}
              >
                Prześlij ponownie
              </button>
            )}
            <input
              type="file"
              id="becared"
              style={{ display: "none" }}
              onChange={(e) => handleSendFileBL(e, "becared")}
            />
          </div>
        </div>

        <footer className="upload-card__footer">
          <span>Obsługiwane formaty: .xlsx, .xls</span>
        </footer>
      </div>
    </section>
  );
};

export default AddDataFromFile;
