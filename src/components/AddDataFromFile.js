import { useState } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from "./hooks/useData";
import PleaseWait from "./PleaseWait";
import "./AddDataFromFile.css";

const AddDataFromFile = () => {
  const { pleaseWait, setPleaseWait } = useData();
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [errBecared, setErrBecared] = useState("");
  const [errSettlements, setSettlements] = useState("");
  const [errAS, setErrAS] = useState("");
  const [errMsg, setErrMsg] = useState("");
  // const [errDataFK, setErrDataFK] = useState("");

  const handleSendFileBL = async (e, type) => {
    setPleaseWait(true);
    const file = e.target.files[0];
    if (!file) return console.log("Brak pliku");
    if (!file.name.endsWith(".xlsx")) {
      console.log("Akceptowany jest tylko plik z rozszerzeniem .xlsx");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("excelFile", file);

      // const response = await axiosPrivateIntercept.post(
      await axiosPrivateIntercept.post(
        `/documents/send-documents/${type}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (type === "becared") {
        setErrBecared("Dokumenty zaktualizowane.");
      } else if (type === "settlements") {
        setSettlements("Dokumenty zaktualizowane.");
      } else if (type === "AS") {
        setErrAS("Dokumenty zaktualizowane.");
      } else if (type === "test") {
        setErrMsg("Dokumenty zaktualizowane.");
      }

      setPleaseWait(false);
    } catch (error) {
      if (type === "becared") {
        setErrBecared("Błąd aktualizacji dokumentów.");
      } else if (type === "AS") {
        setErrAS("Błąd aktualizacji dokumentów.");
      } else if (type === "settlements") {
        setSettlements("Błąd aktualizacji dokumentów.");
      } else if (type === "test") {
        setErrMsg("Błąd aktualizacji dokumentów.");
      }
      console.error("Błąd przesyłania pliku:", error);
      setPleaseWait(false);
    }
  };

  // funkcja dla przesłania gotowych danych, już przygotowanych i obrobionych da raportu FK
  // const handleSendFileFK = async (e, type) => {
  //   setPleaseWait(true);
  //   const file = e.target.files[0];
  //   if (!file) return console.log("Brak pliku");
  //   if (!file.name.endsWith(".xlsx")) {
  //     console.log("Akceptowany jest tylko plik z rozszerzeniem .xlsx");
  //     return;
  //   }
  //   try {
  //     const formData = new FormData();
  //     formData.append("excelFile", file);

  //     const response = await axiosPrivateIntercept.post(
  //       "/fk/send-data-fk",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (type === "dataFK") {
  //       setErrDataFK("Dokumenty zaktualizowane.");
  //     }

  //     setPleaseWait(false);
  //   } catch (error) {
  //     if (type === "dataFK") {
  //       setErrDataFK("Błąd aktualizacji dokumentów.");
  //     }
  //     console.error("Błąd przesyłania pliku:", error);
  //     setPleaseWait(false);
  //   }
  // };

  return pleaseWait ? (
    <PleaseWait />
  ) : (
    <section className="add_data_from_file">
      <section className="add_data_from_file__container">
        <section className="add_data_from_file__container--title">
          <p>Dane dla windykacji BL</p>
        </section>
        <section className="add_data_from_file__container--data">
          {!errSettlements ? (
            <section className="add_data_from_file__container-documents">
              <input
                type="file"
                name="uploadfile"
                id="settlements"
                style={{ display: "none" }}
                onChange={(e) => handleSendFileBL(e, "settlements")}
              />
              <label htmlFor="settlements" className="add_data_file-click-me">
                Prześlij rozrachunki
              </label>
            </section>
          ) : (
            <section className="add_data_from_file__container-documents">
              <span className="add_data_file-click-me">{errSettlements}</span>
            </section>
          )}

          {!errAS ? (
            <section className="add_data_from_file__container-documents">
              <input
                type="file"
                name="uploadfile"
                id="AS"
                style={{ display: "none" }}
                onChange={(e) => handleSendFileBL(e, "AS")}
              />
              <label htmlFor="AS" className="add_data_file-click-me">
                Prześlij faktury AS
              </label>
            </section>
          ) : (
            <section className="add_data_from_file__container-documents">
              <span className="add_data_file-click-me">{errAS}</span>
            </section>
          )}

          {!errBecared ? (
            <section className="add_data_from_file__container-documents">
              <input
                type="file"
                name="uploadfile"
                id="sharepoint"
                style={{ display: "none" }}
                onChange={(e) => handleSendFileBL(e, "becared")}
              />
              <label htmlFor="sharepoint" className="add_data_file-click-me">
                Prześlij plik Becared
              </label>
            </section>
          ) : (
            <section className="add_data_from_file__container-documents">
              <span className="add_data_file-click-me">{errBecared}</span>
            </section>
          )}

          {/* <section className='add_data_from_file__container-corrections'>
                   
                    </section> */}

          {/* chwilowa funckja do naprawiania, nadpisywania danych */}
          {!errMsg ? (
            <section className="add_data_from_file__container-documents">
              <input
                type="file"
                name="uploadfile"
                id="test"
                style={{ display: "none" }}
                // onChange={(e) => handleSendFileBL(e, 'test')}
              />
              {/* <label htmlFor="test" className="add_data_file-click-me">Napraw</label> */}
            </section>
          ) : (
            <section className="add_data_from_file__container-documents">
              <span className="add_data_file-click-me">{errMsg}</span>
            </section>
          )}
        </section>
      </section>

      {/* <section className="add_data_from_file__container ">
        <section className="add_data_from_file__container--title">
          <p>Dane dla Raportu FK</p>
        </section>
        <section className="add_data_from_file__container--data">
          {!errDataFK ? (
            <section className="add_data_from_file__container-documents">
              <input
                type="file"
                name="uploadfile"
                id="dataFK"
                style={{ display: "none" }}
                onChange={(e) => handleSendFileFK(e, "dataFK")}
              />
              <label htmlFor="dataFK" className="add_data_file-click-me">
                Prześlij dane
              </label>
            </section>
          ) : (
            <section className="add_data_from_file__container-documents">
              <span className="add_data_file-click-me">{errDataFK}</span>
            </section>
          )}
        </section>
      </section> */}
    </section>
  );
};

export default AddDataFromFile;
