import { useState } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import useData from "../hooks/useData";
import "./FKAddData.css";

const FKAddData = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { pleaseWait, setPleaseWait } = useData();

  const [errFKAccountancy, setErrFKAccountancy] = useState("");

  const handleSendFile = async (e, type) => {
    console.log(type);

    setPleaseWait(true);
    const file = e.target.files[0];
    if (!file) return console.log("Brak pliku");
    if (!file.name.endsWith(".xlsx")) {
      setErrFKAccountancy("Akceptowany jest tylko plik z rozszerzeniem .xlsx");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("excelFile", file);

      const response = await axiosPrivateIntercept.post(
        `/fk/send-documents/${type}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (type === "accountancy") {
        setErrFKAccountancy("Dokumenty zaktualizowane.");
      }

      setPleaseWait(false);
    } catch (error) {
      if (type === "accountancy") {
        setErrFKAccountancy("Błąd aktualizacji dokumentów.");
      }
      console.error("Błąd przesyłania pliku:", error);
      setPleaseWait(false);
    }
  };

  return (
    <>
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <section className="fk_add_data">
          <section className="fk_add_data__title">
            <span>Dodaj dane do Raportu FK</span>
          </section>
          <section className="fk_add_data__container">
            <section className="fk_add_data__container-item">
              <span>Dane</span>
              <span>Data dodanych danych</span>
              <span>Ilość dodanych danych</span>
              <span></span>
            </section>

            <section className="fk_add_data__container-item">
              {!errFKAccountancy ? (
                <>
                  <span>Wiekowanie - plik księgowość</span>
                  <span></span>
                  <span></span>
                  <section className="fk_add_data__container-file">
                    <input
                      type="file"
                      name="uploadfile"
                      id="accountancy"
                      style={{ display: "none" }}
                      onChange={(e) => handleSendFile(e, "accountancy")}
                    />
                    <label
                      htmlFor="accountancy"
                      className="fk_add_data-click-me"
                    >
                      DODAJ
                    </label>
                  </section>
                </>
              ) : (
                <p className="fk_add_data-error">{errFKAccountancy}</p>
              )}
            </section>

            <section className="fk_add_data__container-item">
              <span>Rozrachunki - przelewy bankowe</span>
              <span></span>
              <span></span>
              <section className="fk_add_data__container-file">
                {/* <input
                  type="file"
                  name="uploadfile"
                  id="bank"
                  style={{ display: "none" }}
                  onChange={(e) => handleSendFile(e, "bank")}
                />
                <label htmlFor="bank" className="fk_add_data-click-me">
                  DODAJ
                </label> */}
              </section>
            </section>
          </section>
        </section>
      )}
    </>
  );
};

export default FKAddData;
