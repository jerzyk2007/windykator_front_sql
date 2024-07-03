import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import Button from "@mui/material/Button";
import { getAllDataRaport } from "../utilsForTable/excelFilteredTable";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import {
  preparedAccountancyData,
  preparedCarData,
  getPreparedData,
  preparedRubiconData,
  preparedSettlementData,
} from "./preparedDataFKFile";

import "./FKAddData.css";

const FKAddData = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  // const { pleaseWait, setPleaseWait } = useData();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [fKAccountancy, setFKAccountancy] = useState("");
  const [carReleased, setCarReleased] = useState("");
  const [settlementNames, setSettlementNames] = useState("");
  const [rubiconData, setRubiconData] = useState("");
  const [deleteRaport, setDeleteRaport] = useState("");
  const [dateCounter, setDateCounter] = useState({});
  const [message, setMessage] = useState({
    prepare: "Przygotowywanie danych.",
    progress: "Trwa dopasowywanie danych.",
    error: "Nastąpił bład.",
    finish: "Dokumenty zaktualizowane",
    errorExcelFile: "Nieprawidłowy plik. Proszę przesłać plik Excel.",
    errorXLSX: "Akceptowany jest tylko plik z rozszerzeniem .xlsx",
    errorData: "Nieprawidłowe dane w pliku.",
    saveToDB: "Zapis do bazy danych - proszę czekać ...",
  });

  // weryfikacja czy plik excel jest prawidłowy (czy nie jest podmienione rozszerzenie)
  const isExcelFile = (data) => {
    const excelSignature = [0x50, 0x4b, 0x03, 0x04];
    for (let i = 0; i < excelSignature.length; i++) {
      if (data[i] !== excelSignature[i]) {
        return false;
      }
    }
    return true;
  };

  // funkcja zamienia dane z pliku excel na json
  const decodeExcelFile = (
    file,
    type,
    setFKAccountancy,
    setCarReleased,
    setRubiconData,
    setSettlementNames
  ) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;

        const uint8Array = new Uint8Array(arrayBuffer);

        // Sprawdzenie, czy plik jest prawidłowym plikiem Excel
        if (!isExcelFile(uint8Array)) {
          if (type === "accountancy") {
            return setFKAccountancy(message.errorExcelFile);
          } else if (type === "car") {
            return setCarReleased(message.errorExcelFile);
          } else if (type === "rubicon") {
            return setRubiconData(message.errorExcelFile);
          } else if (type === "settlement") {
            return setSettlementNames(message.errorExcelFile);
          }
          return;
        }
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const saveDataToDB = async (info, dataDB, counterData) => {
    try {
      await axiosPrivateIntercept.post("/fk/save-data", {
        type: info,
        data: dataDB,
        counter: counterData,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendFile = async (e, type) => {
    setPleaseWait(true);
    setDeleteRaport("");
    const file = e.target.files[0];
    // if (!file) return console.log("Brak pliku");
    if (!file || !file.name.endsWith(".xlsx")) {
      if (type === "accountancy") {
        return setFKAccountancy(message.errorXLSX);
      } else if (type === "car") {
        return setCarReleased(message.errorXLSX);
      } else if (type === "rubicon") {
        return setRubiconData(message.errorXLSX);
      } else if (type === "settlement") {
        return setSettlementNames(message.errorXLSX);
      }
    }

    try {
      const decodedFile = await decodeExcelFile(
        file,
        type,
        setFKAccountancy,
        setCarReleased,
        setRubiconData,
        setSettlementNames
      );
      setPleaseWait(false);
      if (type === "accountancy") {
        if (
          !decodedFile[0]["Nr. dokumentu"] ||
          !decodedFile[0]["Kontrahent"] ||
          !decodedFile[0]["Płatność"] ||
          !decodedFile[0]["Data płatn."] ||
          !decodedFile[0]["Nr kontrahenta"] ||
          !decodedFile[0]["Synt."]
        ) {
          return setFKAccountancy(message.errorData);
        }

        const result = await preparedAccountancyData(
          axiosPrivateIntercept,
          decodedFile
        );
        if (result?.errorDepartments.length) {
          return setFKAccountancy(
            `Brak przypisanych działów: ${result.errorDepartments}`
          );
        }
        setFKAccountancy(message.saveToDB);

        await saveDataToDB(
          "accountancy",
          result.generateDocuments,
          result.generateDocuments.length
        );
        setFKAccountancy(message.finish);
      }

      if (type === "car") {
        if (!decodedFile[0]["NR FAKTURY"] || !decodedFile[0]["WYDANO"]) {
          return setCarReleased(message.errorData);
        }

        setCarReleased(message.prepare);

        const resultPreparedData = await getPreparedData(axiosPrivateIntercept);

        const result = preparedCarData(
          decodedFile,
          resultPreparedData,
          setCarReleased
        );
        setCarReleased(message.saveToDB);

        await saveDataToDB(
          "carReleased",
          result.preparedDataReleasedCars,
          result.counter
        );
        setCarReleased(message.finish);
      }
      if (type === "rubicon") {
        if (
          !decodedFile[0]["Faktura nr"] ||
          !decodedFile[0]["Status aktualny"] ||
          !decodedFile[0]["Firma zewnętrzna"] ||
          !decodedFile[0]["Data faktury"]
        ) {
          return setRubiconData(message.errorData);
        }
        // setRubiconData(message.prepare);
        setRubiconData("Przetwarzanie danych z pliku Rubicon.");

        const resultPreparedData = await getPreparedData(axiosPrivateIntercept);

        const result = await preparedRubiconData(
          decodedFile,
          resultPreparedData,
          setRubiconData,
          axiosPrivateIntercept
        );
        setRubiconData(message.saveToDB);

        await saveDataToDB(
          "caseStatus",
          result.preparedCaseStatusBL,
          result.counter
        );

        setRubiconData(message.finish);
      }
      if (type === "settlement") {
        if (
          !decodedFile[0]["NUMER"] ||
          !decodedFile[0]["OPIS"] ||
          !decodedFile[0]["DataRozlAutostacja"] ||
          !decodedFile[0]["DATA_WYSTAWIENIA"]
        ) {
          return setSettlementNames(message.errorData);
        }
        setSettlementNames(message.prepare);

        const resultPreparedData = await getPreparedData(axiosPrivateIntercept);

        const result = preparedSettlementData(
          decodedFile,
          resultPreparedData,
          setSettlementNames
        );
        setSettlementNames(message.saveToDB);
        await saveDataToDB(
          "settlementNames",
          result.preparedSettlementDate,
          result.counter
        );
        setSettlementNames(message.finish);
      }
    } catch (error) {
      if (type === "accountancy") {
        setFKAccountancy(message.error);
      }
      if (type === "car") {
        setCarReleased(message.error);
      }
      if (type === "rubicon") {
        setRubiconData(message.error);
      }
      if (type === "settlement") {
        setSettlementNames(message.error);
      }
      console.error("Błąd przesyłania pliku:", error);
      setPleaseWait(false);
    }
  };

  const generateRaport = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get("/fk/generate-raport");

      const settingsColumn = await axiosPrivateIntercept.get(
        "/fk/get-columns-order"
      );

      const orderColumns = settingsColumn.data;

      // console.log(result.data[0]);
      const dataToString = result.data.map((item) => {
        return {
          ...item,
          ILE_DNI_NA_PLATNOSC_FV: item.ILE_DNI_NA_PLATNOSC_FV.toString(),
          RODZAJ_KONTA: item.RODZAJ_KONTA.toString(),
          NR_KLIENTA: item.NR_KLIENTA.toString(),
        };
      });

      getAllDataRaport(dataToString, orderColumns, "Generowanie Raportu");
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
        setFKAccountancy("");
        setCarReleased("");
        setSettlementNames("");
        setRubiconData("");
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
        const response = await axiosPrivateIntercept.get(`/update/get-time`);
        const DMS_date = response.data;

        const update = {
          ...result.data.updateDate,
          dms: {
            date: format(DMS_date, "dd-MM-yyyy "),
            hour: format(DMS_date, "HH:mm"),
          },
        };

        setDateCounter(update);
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
              {!fKAccountancy ? (
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
                <p className="fk_add_data-error">{fKAccountancy}</p>
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
                  // dateCounter?.settlementNames ? (
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

            {/* <section className="fk_add_data__container-item">
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
            </section> */}
            <section className="fk_add_data__container-item">
              <span className="fk_add_data__container-item--title">
                Rozrachunki z Autostacji
              </span>
              <span>{dateCounter?.dms?.date}</span>
              <span>godzina: {dateCounter?.dms?.hour}</span>

              <section className="fk_add_data__container-file"></section>
            </section>

            <section className="fk_add_data__container-item">
              <span className="fk_add_data__container-item--title">
                Generuj raport FK
              </span>
              <span>{dateCounter?.genrateRaport?.date}</span>
              <span></span>

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
