import { useState } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import "./AddDataFromFile.css";

const AddDataFromFile = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [errBecared, setErrBecared] = useState("");
  const [errSettlements, setSettlements] = useState("");
  const [errRubicon, setErrRubicon] = useState("");
  const [errFile, setErrFile] = useState("");
  const [pleaseWait, setPleaseWait] = useState(false);

  const handleSendFileBL = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return console.error("Brak pliku");
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setErrFile("Akceptowany jest tylko plik z rozszerzeniem .xlsx lub .xls");
      setPleaseWait(false);

      return;
    }
    try {
      setPleaseWait(true);
      const formData = new FormData();
      formData.append("excelFile", file);

      await axiosPrivateIntercept.post(
        `/add-data/send-documents/${type}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (type === "becared") {
        setErrBecared("Dokumenty zaktualizowane.");
      }
      else if (type === "settlements") {
        setSettlements("Dokumenty zaktualizowane.");
      }
      else if (type === "rubicon") {
        setErrRubicon("Dokumenty zaktualizowane.");
      }

      setPleaseWait(false);
    } catch (error) {
      if (type === "becared") {
        setErrBecared("Błąd aktualizacji dokumentów.");
      } else if (type === "settlements") {
        setSettlements("Błąd aktualizacji dokumentów.");
      }
      else if (type === "rubicon") {
        setErrRubicon("Błąd aktualizacji dokumentów.");
      }
      console.error("Błąd przesyłania pliku:", error);
      setPleaseWait(false);
    }
  };

  return pleaseWait ? (
    <PleaseWait />
  ) : (
    <section className="add_data_from_file">
      <section className="add_data_from_file__container">
        <section className="add_data_from_file__container--title">
          <p
            style={errFile ? { color: "red" } : null}
          >{errFile ? errFile : "Prześlij dane z plików Excel"}</p>
        </section>
        <section className="add_data_from_file__container--data">
          {/* {!errSettlements ? (
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
          )} */}

          {!errRubicon ? (
            <section className="add_data_from_file__container-documents">
              <input
                type="file"
                name="uploadfile"
                id="settlements_description"
                style={{ display: "none" }}
                onChange={(e) => handleSendFileBL(e, "rubicon")}
              />
              <label
                htmlFor="settlements_description"
                className="add_data_file-click-me"
              >
                Prześlij plik Rubicon
              </label>
            </section>
          ) : (
            <section className="add_data_from_file__container-documents">
              <span className="add_data_file-click-me">
                {errRubicon}
              </span>
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
        </section>
      </section>

    </section>
  );
};

export default AddDataFromFile;
