import { useState } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import useData from "../hooks/useData";
import "./FKDataSettings.css";

const FKDataSettings = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { pleaseWait, setPleaseWait } = useData();

  // const [errFKAging, setErrFKAging] = useState("");

  // const handleSendFile = async (e, type) => {
  //   console.log(type);

  //   setPleaseWait(true);
  //   const file = e.target.files[0];
  //   if (!file) return console.log("Brak pliku");
  //   if (!file.name.endsWith(".xlsx")) {
  //     setErrFKAging("Akceptowany jest tylko plik z rozszerzeniem .xlsx");
  //     return;
  //   }
  //   try {
  //     const formData = new FormData();
  //     formData.append("excelFile", file);

  //     const response = await axiosPrivateIntercept.post(
  //       `/fk/send-documents/${type}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (type === "aging") {
  //       setErrFKAging("Dokumenty zaktualizowane.");
  //     }

  //     setPleaseWait(false);
  //   } catch (error) {
  //     if (type === "sharepoint") {
  //       setErrFKAging("Błąd aktualizacji dokumentów.");
  //     }
  //     console.error("Błąd przesyłania pliku:", error);
  //     setPleaseWait(false);
  //   }
  // };

  return (
    <>
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <section className="fk_data_settings">
          <section className="fk_data_settings__title">
            <span>Dopasuj wyświetlanie danych</span>
          </section>
          <section className="fk_data_settings__container">
            <section className="fk_data_settings__container-item">
              <span className="fk_data_settings-department">Dział</span>
              <span className="fk_data_settings-localization">Lokalizacja</span>
              <span className="fk_data_settings-area">Obszar</span>
              <span className="fk_data_settings-owner">Owner</span>
              <span className="fk_data_settings-owner">Opiekun</span>
            </section>

            <section className="fk_data_settings__container-item">
              <span>Wiekowanie - plik księgowość</span>
              <span></span>
              <span></span>
              <span></span>
            </section>

            <section className="fk_data_settings__container-item">
              <span>Rozrachunki - przelewy bankowe</span>
              <span></span>
              <span></span>
              <span></span>
            </section>
          </section>
        </section>
      )}
    </>
  );
};

export default FKDataSettings;
