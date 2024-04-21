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
  const [carReleased, setCarReleased] = useState("");
  const [settlementNames, setSettlementNames] = useState("");
  const [rubiconData, setRubiconData] = useState("");
  const [deleteRaport, setDeleteRaport] = useState("");
  const [dateCounter, setDateCounter] = useState({});
  const [raportErrors, setRaportErrors] = useState("");

  const handleExportExcel = (excelData, type) => {
    const wb = xlsx.utils.book_new();
    if (type === "errors") {
      // Obsługa kluczy z tablicami stringów
      const stringArrayKeys = [
        "dzial",
        "wiekowanie",
        "obszar",
        "lokalizacja",
        "owner",
      ];
      stringArrayKeys.forEach((key) => {
        if (excelData[key]) {
          const data = excelData[key].map((string) => [string]); // Tworzenie tablicy dwuwymiarowej, gdzie każdy string jest w osobnej tablicy
          const ws = xlsx.utils.aoa_to_sheet(data); // Konwersja tablicy na arkusz
          xlsx.utils.book_append_sheet(wb, ws, key); // Dodanie arkusza z danymi dla danego klucza
        }
      });
      xlsx.writeFile(wb, "Błędy.xlsx"); // Zapisanie pliku Excel
    }
    if (type === "generate") {
      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(excelData);
      xlsx.utils.book_append_sheet(wb, ws, "Raport");
      xlsx.writeFile(wb, "Raport.xlsx");
    }
  };

  const handleSendFile = async (e, type) => {
    setPleaseWait(true);
    setDeleteRaport("");
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
      console.log(response.data);

      if (type === "accountancy") {
        setErrFKAccountancy("Dokumenty zaktualizowane.");
      }
      if (type === "car") {
        setCarReleased("Dokumenty zaktualizowane.");
      }
      if (type === "rubicon") {
        setRubiconData("Dokumenty zaktualizowane.");
      }
      if (type === "settlement") {
        setSettlementNames("Dokumenty zaktualizowane.");
      }

      setPleaseWait(false);
    } catch (error) {
      if (type === "accountancy") {
        setErrFKAccountancy("Błąd aktualizacji dokumentów.");
      }
      if (type === "car") {
        setCarReleased("Błąd aktualizacji dokumentów.");
      }
      if (type === "rubicon") {
        setRubiconData("Błąd aktualizacji dokumentów.");
      }
      if (type === "settlement") {
        setSettlementNames("Błąd aktualizacji dokumentów.");
      }
      console.error("Błąd przesyłania pliku:", error);
      setPleaseWait(false);
    }
  };

  const generateRaport = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get("/fk/generate-raport");

      handleExportExcel(result.data, "generate");
      setPleaseWait(false);
    } catch (err) {
      console.error(err);
    }
  };

  const checkRaportErrors = async () => {
    try {
      setPleaseWait(true);

      const result = await axiosPrivateIntercept.get("/fk/check-error-raport");
      if (result.data.check === "OK") {
        setRaportErrors("Brak błędów :)");
      } else {
        const excelData = {
          dzial: result.data.check.departments,
          wiekowanie: result.data.check.aging,
          obszar: result.data.check.areas,
          lokalizacja: result.data.check.localizations,
          owner: result.data.check.owners,
        };
        handleExportExcel(excelData, "errors");
        setRaportErrors("Znaleziono błędy podczas przygotowania raportu");
      }

      console.log(result.data);
      setPleaseWait(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDataRaport = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get("/fk/delete-data-raport");
      if (result.data.result === "delete") {
        setDateCounter({});
        setDeleteRaport("Dane usunięte.");
        setPleaseWait(false);
      } else {
        setDeleteRaport("Wystąpił błąd podczas usuwania danych");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const getDateAndCounter = async () => {
      try {
        setPleaseWait(true);
        const result = await axiosPrivateIntercept.get("/fk/get-date-counter");
        setDateCounter(result.data.updateDate);
        setPleaseWait(false);
      } catch (err) {
        console.error(err);
      }
    };
    getDateAndCounter();
  }, [axiosPrivateIntercept, setPleaseWait]);

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
                  <span>{dateCounter?.accountancy?.date}</span>
                  <span>{dateCounter?.accountancy?.counter}</span>
                  {!dateCounter?.accountancy ? (
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
                  ) : (
                    <span></span>
                  )}
                </>
              ) : (
                <p className="fk_add_data-error">{errFKAccountancy}</p>
              )}
            </section>

            <section className="fk_add_data__container-item">
              {!carReleased ? (
                <>
                  <span>Auta wydane - plik wydane</span>
                  <span>{dateCounter?.carReleased?.date}</span>
                  <span>{dateCounter?.carReleased?.counter}</span>
                  {dateCounter?.accountancy && !dateCounter?.carReleased ? (
                    <section className="fk_add_data__container-file">
                      <input
                        type="file"
                        name="uploadfile"
                        id="car"
                        style={{ display: "none" }}
                        onChange={(e) => handleSendFile(e, "car")}
                      />
                      <label htmlFor="car" className="fk_add_data-click-me">
                        DODAJ
                      </label>
                    </section>
                  ) : (
                    <span></span>
                  )}
                </>
              ) : (
                <p className="fk_add_data-error">{carReleased}</p>
              )}
            </section>

            <section className="fk_add_data__container-item">
              {!rubiconData ? (
                <>
                  <span>Status sprawy - plik Rubicon</span>
                  <span>{dateCounter?.caseStatus?.date}</span>
                  <span>{dateCounter?.caseStatus?.counter}</span>

                  {dateCounter?.accountancy &&
                  dateCounter?.carReleased &&
                  !dateCounter?.caseStatus ? (
                    <section className="fk_add_data__container-file">
                      <input
                        type="file"
                        name="uploadfile"
                        id="rubicon"
                        style={{ display: "none" }}
                        onChange={(e) => handleSendFile(e, "rubicon")}
                      />
                      <label htmlFor="rubicon" className="fk_add_data-click-me">
                        DODAJ
                      </label>
                    </section>
                  ) : (
                    <span></span>
                  )}
                </>
              ) : (
                <p className="fk_add_data-error">{rubiconData}</p>
              )}
            </section>

            <section className="fk_add_data__container-item">
              {!settlementNames ? (
                <>
                  <span>Opisy rozrachunków - plik rozlas</span>
                  <span>{dateCounter?.settlementNames?.date}</span>
                  <span>{dateCounter?.settlementNames?.counter}</span>

                  {dateCounter?.accountancy &&
                  dateCounter?.carReleased &&
                  dateCounter?.caseStatus &&
                  !dateCounter?.settlementNames ? (
                    <section className="fk_add_data__container-file">
                      <input
                        type="file"
                        name="uploadfile"
                        id="settlement"
                        style={{ display: "none" }}
                        onChange={(e) => handleSendFile(e, "settlement")}
                      />
                      <label
                        htmlFor="settlement"
                        className="fk_add_data-click-me"
                      >
                        DODAJ
                      </label>
                    </section>
                  ) : (
                    <span></span>
                  )}
                </>
              ) : (
                <p className="fk_add_data-error">{settlementNames}</p>
              )}
            </section>

            <section className="fk_add_data__container-item">
              <section className="fk_add_data__container-file">
                <Button
                  variant="contained"
                  color="error"
                  disableElevation
                  onClick={deleteDataRaport}
                >
                  Usuń dane
                  <br />
                  Raportu FK
                </Button>
              </section>

              {!deleteRaport ? (
                <span className="fk_add_data__container-item--title">
                  Jeśli chcesz dodać nowe pliki, skasuj poprzedni raport
                </span>
              ) : (
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {deleteRaport}
                </span>
              )}
            </section>

            <section className="fk_add_data__container-item">
              {!raportErrors ? (
                <span className="fk_add_data__container-item--title">
                  Sprawdź dane przed wygenerowaniem raportu
                </span>
              ) : (
                <span
                  className="fk_add_data__container-item--title"
                  style={
                    raportErrors !== "Brak błędów :)"
                      ? { color: "red", fontWeight: "bold" }
                      : null
                  }
                >
                  {raportErrors}
                </span>
              )}
              <section className="fk_add_data__container-file">
                {dateCounter?.accountancy &&
                  dateCounter?.carReleased &&
                  dateCounter?.caseStatus &&
                  dateCounter?.settlementNames && (
                    <Button
                      variant="contained"
                      color="primary"
                      disableElevation
                      onClick={checkRaportErrors}
                    >
                      Sprawdź błędy
                    </Button>
                  )}
              </section>
            </section>

            <section className="fk_add_data__container-item">
              <span className="fk_add_data__container-item--title">
                Generuj raport FK
              </span>
              <section className="fk_add_data__container-file">
                {dateCounter?.accountancy &&
                  dateCounter?.carReleased &&
                  dateCounter?.caseStatus &&
                  dateCounter?.settlementNames && (
                    <Button
                      variant="contained"
                      color="secondary"
                      disableElevation
                      onClick={generateRaport}
                    >
                      Generuj Raport FK
                    </Button>
                  )}
              </section>
            </section>
          </section>
        </section>
      )}
    </>
  );
};

export default FKAddData;
