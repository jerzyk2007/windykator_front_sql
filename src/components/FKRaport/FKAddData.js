import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import useData from "../hooks/useData";
import Button from "@mui/material/Button";
import * as xlsx from "xlsx";

import "./FKAddData.css";

const FKAddData = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { pleaseWait, setPleaseWait } = useData();

  const [errFKAccountancy, setErrFKAccountancy] = useState("");
  const [dateCounter, setDateCounter] = useState({});

  // const handleExportExcel = (excelData) => {
  //   const wb = xlsx.utils.book_new();

  //   // Iteracja po kluczach obiektu excelData
  //   for (const key in excelData) {
  //     if (Object.hasOwnProperty.call(excelData, key)) {
  //       const sheetData = excelData[key];
  //       const ws = xlsx.utils.json_to_sheet(sheetData);
  //       xlsx.utils.book_append_sheet(wb, ws, key); // Dodanie arkusza z danymi dla danego klucza
  //     }
  //   }

  //   xlsx.writeFile(wb, "Faktury.xlsx"); // Zapisanie pliku Excel
  // };

  const handleExportExcel = (excelData) => {
    const wb = xlsx.utils.book_new();

    // Obsługa kluczy z tablicami stringów
    const stringArrayKeys = [
      "błedy_dzial",
      "fv_rozliczone",
      "błędy_wiekowania",
    ];
    stringArrayKeys.forEach((key) => {
      if (excelData[key]) {
        const data = excelData[key].map((string) => [string]); // Tworzenie tablicy dwuwymiarowej, gdzie każdy string jest w osobnej tablicy
        const ws = xlsx.utils.aoa_to_sheet(data); // Konwersja tablicy na arkusz
        xlsx.utils.book_append_sheet(wb, ws, key); // Dodanie arkusza z danymi dla danego klucza
      }
    });

    // Obsługa kluczy z tablicami obiektów
    const objectArrayKeys = Object.keys(excelData).filter(
      (key) => !stringArrayKeys.includes(key)
    );
    objectArrayKeys.forEach((key) => {
      const ws = xlsx.utils.json_to_sheet(excelData[key]);
      xlsx.utils.book_append_sheet(wb, ws, key); // Dodanie arkusza z danymi dla danego klucza
    });

    xlsx.writeFile(wb, "RaportFK.xlsx"); // Zapisanie pliku Excel
  };

  const handleSendFile = async (e, type) => {
    setPleaseWait(true);
    const file = e.target.files[0];
    if (!file) return console.log("Brak pliku");
    if (!file.name.endsWith(".xlsx")) {
      setErrFKAccountancy("Akceptowany jest tylko plik z rozszerzeniem .xlsx");
      return;
    }
    try {
      setPleaseWait(true);
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

  const getDateAndCounter = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get("/fk/get-date-counter");

      setDateCounter(result.data);
      setPleaseWait(false);
    } catch (err) {
      console.error(err);
    }
  };

  const generateRaport = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get("/fk/generate-raport");
      const excelData = {
        błedy_dzial: result.data.errorDepartments,
        błędy_wiekowania: result.data.errorAging,
        fv_rozliczone: result.data.errorSettlements,
        przygotowane_dok: result.data.preparedDataDep,
        nierozliczone_dok: result.data.preparedDataSettlements,
        wiekowanie_nierozliczone: result.data.preparedDataAging,
      };
      handleExportExcel(excelData);
      console.log(result.data);
      setPleaseWait(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDateAndCounter();
  }, []);

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
                  <span>{dateCounter?.updateDate?.accountancy?.date}</span>
                  <span>{dateCounter?.updateDate?.accountancy?.counter}</span>
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

            <section className="fk_add_data__container-item">
              <span></span>
              <span>Generuj raport FK</span>
              <span></span>
              <section className="fk_add_data__container-file">
                <Button
                  variant="contained"
                  color="secondary"
                  disableElevation
                  onClick={generateRaport}
                >
                  Generuj Raport FK
                </Button>
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
