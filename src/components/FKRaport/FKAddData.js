import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import Button from "@mui/material/Button";
import { getAllDataRaport } from "../pliki_do_usuniecia/utilsForTable/excelFilteredTable";
import { getExcelRaport } from "./utilsForFKTable/prepareFKExcelFile";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import {
  excelDateToISODate,
  isExcelDate,
  preparedAccountancyData,
  preparedCarData,
  getPreparedData,
  preparedRubiconData,
  preparedSettlementData,
  prepareDataRaport,
  prepareMissedDate,
} from "./preparedDataFKFile";

import "./FKAddData.css";

const FKAddData = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  // const { pleaseWait, setPleaseWait } = useData();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [fKAccountancy, setFKAccountancy] = useState("");
  // const [carReleased, setCarReleased] = useState("");
  // const [settlementNames, setSettlementNames] = useState("");
  // const [rubiconData, setRubiconData] = useState("");
  // const [missedDate, setMissedDate] = useState("");
  // const [disableMissedDate, setDisableMissedDate] = useState(false);
  const [deleteRaport, setDeleteRaport] = useState("");
  const [dateCounter, setDateCounter] = useState({});
  const [generateRaportMsg, setGenerateRaportMsg] = useState("");
  const [message, setMessage] = useState({
    prepare: "Przygotowywanie danych.",
    progress: "Trwa dopasowywanie danych.",
    error: "Nastąpił błąd. Sprawdź plik.",
    finish: "Dokumenty zaktualizowane",
    errorExcelFile: "Nieprawidłowy plik. Proszę przesłać plik Excel.",
    errorXLSX: "Akceptowany jest tylko plik z rozszerzeniem .xlsx",
    errorData: "Nieprawidłowe dane w pliku.",
    saveToDB: "Zapis do bazy danych - proszę czekać ...",
  });

  // weryfikacja czy plik excel jest prawidłowy (czy nie jest podmienione rozszerzenie)
  // const isExcelFile = (data) => {
  //   const excelSignature = [0x50, 0x4b, 0x03, 0x04];
  //   for (let i = 0; i < excelSignature.length; i++) {
  //     if (data[i] !== excelSignature[i]) {
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  // funkcja zamienia dane z pliku excel na json
  // const decodeExcelFile = (
  //   file,
  //   type,
  //   setFKAccountancy,
  //   setCarReleased,
  //   setRubiconData,
  //   setSettlementNames
  // ) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const arrayBuffer = event.target.result;

  //       const uint8Array = new Uint8Array(arrayBuffer);

  //       // Sprawdzenie, czy plik jest prawidłowym plikiem Excel
  //       if (!isExcelFile(uint8Array)) {
  //         setPleaseWait(false);

  //         if (type === "accountancy") {
  //           return setFKAccountancy(message.errorExcelFile);
  //         } else if (type === "car") {
  //           return setCarReleased(message.errorExcelFile);
  //         } else if (type === "rubicon") {
  //           return setRubiconData(message.errorExcelFile);
  //         } else if (type === "settlement") {
  //           return setSettlementNames(message.errorExcelFile);
  //         } else if (type === "missedDate") {
  //           return setMissedDate(message.errorExcelFile);
  //         }
  //         return;
  //       }
  //       const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
  //         type: "array",
  //       });

  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];
  //       const jsonData = XLSX.utils.sheet_to_json(worksheet);
  //       resolve(jsonData);
  //     };

  //     reader.onerror = (error) => {
  //       reject(error);
  //     };

  //     reader.readAsArrayBuffer(file);
  //   });
  // };

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
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setFKAccountancy("Akceptowany jest tylko plik z rozszerzeniem .xlsx lub .xls");
      setPleaseWait(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("excelFile", file);

      const result = await axiosPrivateIntercept.post(
        `/add-data/send-documents/accountancy`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (result?.data?.info) {
        setFKAccountancy(result?.data?.info);
      }

      setPleaseWait(false);

    } catch (error) {
      setFKAccountancy(message.error);
      console.error("Błąd przesyłania pliku:", error);
      setPleaseWait(false);
    }
  };

  // funkcja generująca raport z już pobranych danych z pliku excel, każde generowanie nadaje nowe wiekowanie, kwote faktur do rozliczenia oraz od nowa przypisuje Obszary, Ownerów, Lokalizacje itd
  const generateRaport = async () => {
    try {
      // setDisableMissedDate(true);
      setPleaseWait(true);
      // const result = await axiosPrivateIntercept.get("/fk/generate-raport");
      const result = await axiosPrivateIntercept.get(
        "/fk/generate-raport"
      );
      // console.log(result.data);
      // const dataRaport = prepareDataRaport(result.data);

      // await axiosPrivateIntercept.post("/fk/save-raport-FK", { dataRaport });

      setPleaseWait(false);
      setGenerateRaportMsg("Raport został wygenerowany.");

      // funkcja generująca plik excel ze wszytskimi danymi
      // const settingsColumn = await axiosPrivateIntercept.get(
      //   "/fk/get-columns-order"
      // );

      // const orderColumns = settingsColumn.data;

      // const dataToString = dataRaport.map((item) => {
      //   return {
      //     ...item,
      //     ILE_DNI_NA_PLATNOSC_FV: item.ILE_DNI_NA_PLATNOSC_FV.toString(),
      //     RODZAJ_KONTA: item.RODZAJ_KONTA.toString(),
      //     NR_KLIENTA: item.NR_KLIENTA.toString(),
      //   };
      // });

      // const orderColumns = Object.keys(result.data[0]);

      // getAllDataRaport(result.data, orderColumns, "Generowanie Raportu");
    } catch (err) {
      setPleaseWait(false);
      setGenerateRaportMsg("Wystąpił błąd.");
      console.error(err);
    }
  };

  const getRaport = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.post("/fk/get-raport-data");

      const accountArray = [
        ...new Set(
          result.data
            .filter((item) => item.RODZAJ_KONTA)
            .map((item) => item.OBSZAR)
        ),
      ].sort();


      // usuwam wartości null, bo excel ma z tym problem
      const eraseNull = result.data.map(item => {

        return {
          ...item,
          ILE_DNI_NA_PLATNOSC_FV: String(item.ILE_DNI_NA_PLATNOSC_FV),
          RODZAJ_KONTA: String(item.RODZAJ_KONTA),
          NR_KLIENTA: String(item.NR_KLIENTA),
          DO_ROZLICZENIA_AS: item.DO_ROZLICZENIA_AS ? item.DO_ROZLICZENIA_AS : "NULL",
          ROZNICA: item.ROZNICA !== 0 ? item.ROZNICA : "NULL",
          DATA_ROZLICZENIA_AS: item.DATA_ROZLICZENIA_AS ? item.DATA_ROZLICZENIA_AS : "NULL",
          BRAK_DATY_WYSTAWIENIA_FV: item.BRAK_DATY_WYSTAWIENIA_FV ? item.BRAK_DATY_WYSTAWIENIA_FV : " ",
          JAKA_KANCELARIA: item.JAKA_KANCELARIA ? item.JAKA_KANCELARIA : " ",
          ETAP_SPRAWY: item.ETAP_SPRAWY ? item.ETAP_SPRAWY : " ",
          KWOTA_WPS: item.KWOTA_WPS ? item.KWOTA_WPS : " ",
          CZY_SAMOCHOD_WYDANY_AS: item.CZY_SAMOCHOD_WYDANY_AS ? item.CZY_SAMOCHOD_WYDANY_AS : " ",
          DATA_WYDANIA_AUTA: item.DATA_WYDANIA_AUTA ? item.DATA_WYDANIA_AUTA : " ",
          OPIEKUN_OBSZARU_CENTRALI: Array.isArray(item.OPIEKUN_OBSZARU_CENTRALI)
            ? item.OPIEKUN_OBSZARU_CENTRALI.join("\n")
            : item.OPIEKUN_OBSZARU_CENTRALI,
          OPIS_ROZRACHUNKU: Array.isArray(item.OPIS_ROZRACHUNKU)
            ? item.OPIS_ROZRACHUNKU.join("\n\n")
            : "NULL",
          OWNER: Array.isArray(item.OWNER) ? item.OWNER.join("\n") : item.OWNER,
        };
      }
      );

      // rozdziela dane na poszczególne obszary BLACHARNIA, CZĘŚCI itd
      const resultArray = accountArray.reduce((acc, area) => {
        // Filtrujemy obiekty, które mają odpowiedni OBSZAR
        const filteredData = eraseNull.filter(item => item.OBSZAR === area);

        // Jeśli są dane, dodajemy obiekt do wynikowej tablicy
        if (filteredData.length > 0) {
          // acc.push({ [area]: filteredData });
          acc.push({ name: area, data: filteredData });
        }

        return acc;
      }, []);


      // // Dodajemy obiekt RAPORT na początku tablicy
      const finalResult = [{ name: 'RAPORT', data: eraseNull }, ...resultArray];

      // usuwam wiekowanie starsze niż <0, 1-7 z innych niż arkusza RAPORT
      const updateAging = finalResult.map((element) => {
        if (element.name !== "RAPORT" && element.data) {
          const updatedData = element.data.filter((item) => {
            return item.PRZEDZIAL_WIEKOWANIE !== "1-7" && item.PRZEDZIAL_WIEKOWANIE !== "<0";
          });
          return { ...element, data: updatedData }; // Zwracamy zaktualizowany element
        }

        return element; // Zwracamy element bez zmian, jeśli name === "Raport" lub data jest niezdefiniowana
      });

      //usuwam kolumny CZY_SAMOCHOD_WYDANY_AS, DATA_WYDANIA_AUTA z innych arkuszy niż Raport, SAMOCHODY NOWE, SAMOCHODY UŻYWANE
      const updateCar = updateAging.map((element) => {
        if (
          element.name !== "RAPORT" &&
          element.name !== "SAMOCHODY NOWE" &&
          element.name !== "SAMOCHODY UŻYWANE"
        ) {
          const updatedData = element.data.map((item) => {
            const { CZY_SAMOCHOD_WYDANY_AS, DATA_WYDANIA_AUTA, ...rest } = item;
            return rest; // Zwróć obiekt bez tych dwóch kluczy
          });
          return { ...element, data: updatedData };
        }
        return element;
      });

      // usuwam kolumnę BRAK DATY WYSTAWIENIA FV ze wszytskich arkuszy oprócz RAPORT
      const updateFvDate = updateCar.map((element) => {
        if (element.name !== "RAPORT") {
          const updatedData = element.data.map((item) => {
            const { BRAK_DATY_WYSTAWIENIA_FV, ...rest } = item;
            return rest;
          });
          return { ...element, data: updatedData };
        }
        return element;
      });

      // zmieniam zapis daty string na zapis date
      const updateDate = updateFvDate.map((element) => {
        const updatedData = element.data.map((item) => {
          const convertToDateIfPossible = (value) => {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              return date;
            }
            return value;
          };

          return {
            ...item,
            DATA_WYSTAWIENIA_FV: convertToDateIfPossible(
              item.DATA_WYSTAWIENIA_FV
            ),
            DATA_ROZLICZENIA_AS: convertToDateIfPossible(
              item.DATA_ROZLICZENIA_AS
            ),
            TERMIN_PLATNOSCI_FV: convertToDateIfPossible(
              item.TERMIN_PLATNOSCI_FV
            ),
            DATA_WYDANIA_AUTA: convertToDateIfPossible(item.DATA_WYDANIA_AUTA),
          };
        });
        return { ...element, data: updatedData };
      });



      getExcelRaport(updateDate);
      // getExcelRaport(update, settingsColumn);
      setPleaseWait(false);

    }
    catch (error) {
      console.error(error);

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
        // setCarReleased("");
        // setSettlementNames("");
        // setRubiconData("");
        setPleaseWait(false);
      } else {
        setDeleteRaport("Wystąpił błąd podczas usuwania danych");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // pobieram daty i licznik ustawień dla aktualizowanych plików excel
    const getDateAndCounter = async () => {
      try {
        setPleaseWait(true);
        const result = await axiosPrivateIntercept.get("/fk/get-date-counter");
        const response = await axiosPrivateIntercept.get(`/update/get-time`);
        const DMS_date = response.data.find(item => item.data_name === "Rozrachunki");
        const update = {
          accountancy: result.data.updateData.accountancy,
          raport: result.data.updateData.raport,
          dms: {
            date: DMS_date.update_success ? DMS_date.date : "Błąd aktualizacji",
            hour: DMS_date.update_success ? `godzina: ${DMS_date.hour}` : "Błąd aktualizacji",
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
                    <section className="fk_add_data__container-file"></section>
                  )}
                </>
              ) : (
                <p className="fk_add_data-error">{fKAccountancy}</p>
              )}
            </section>

            <section className="fk_add_data__container-item">
              <span className="fk_add_data__container-item--title">
                Rozrachunki z Autostacji
              </span>
              <span>{dateCounter?.dms?.date}</span>
              <span>{dateCounter?.dms?.hour}</span>

              <section className="fk_add_data__container-file"></section>
            </section>

            {/* <section className="fk_add_data__container-item">
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
                    <section className="fk_add_data__container-file"></section>
                  )}
                </>
              ) : (
                <p className="fk_add_data-error">{carReleased}</p>
              )}
            </section> */}

            {/* <section className="fk_add_data__container-item">
              {!rubiconData ? (
                <>
                  <span>Status sprawy - plik Rubicon</span>
                  <span>{dateCounter?.caseStatus?.date}</span>
                  <span>{dateCounter?.caseStatus?.counter}</span>

                  {dateCounter?.accountancy &&
                    dateCounter?.carReleased &&
                    // dateCounter?.caseStatus ? (
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
                    <section className="fk_add_data__container-file"></section>
                  )}
                </>
              ) : (
                <p className="fk_add_data-error">{rubiconData}</p>
              )}
            </section> */}

            {/* <section className="fk_add_data__container-item">
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
                    <section className="fk_add_data__container-file"></section>
                  )}
                </>
              ) : (
                <p className="fk_add_data-error">{settlementNames}</p>
              )}
            </section> */}

            {/* <section className="fk_add_data__container-item">
              {!missedDate ? (
                <>
                  <span>Dodatkowy plik - Data wystawienia dokumentu</span>
                  <span>{dateCounter?.missedDate?.date}</span>
                  <span>{dateCounter?.missedDate?.counter}</span>

                  {dateCounter?.accountancy &&
                    dateCounter?.carReleased &&
                    dateCounter?.caseStatus &&
                    dateCounter?.settlementNames &&
                    !dateCounter?.missedDate &&
                    !dateCounter?.genrateRaport &&
                    !disableMissedDate ? (
                    <section className="fk_add_data__container-file">
                      <input
                        type="file"
                        name="uploadfile"
                        id="missedDate"
                        style={{ display: "none" }}
                        onChange={(e) => handleSendFile(e, "missedDate")}
                      />
                      <label
                        htmlFor="missedDate"
                        className="fk_add_data-click-me"
                      >
                        DODAJ
                      </label>
                    </section>
                  ) : (
                    <section className="fk_add_data__container-file"></section>
                  )}
                </>
              ) : (
                <p className="fk_add_data-error">{missedDate}</p>
              )}
            </section> */}

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
                  Jeśli chcesz dodać nowe pliki, skasuj poprzednie dane.
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
              {!generateRaportMsg ? (
                <section className="fk_add_data__container-data">
                  <section className="fk_add_data__container-data--title">
                    <span>
                      {dateCounter?.raport?.date ? `Data raportu: ${dateCounter?.raport?.date}` : dateCounter?.accountancy ? "Generuj raport FK" : ""}

                    </span>
                    {/* <span>{dateCounter?.genrateRaport?.date}</span> */}
                    {/* <span></span> */}
                  </section>

                  <section className="fk_add_data__container-data-file">
                    {dateCounter?.accountancy && (
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
              ) : (
                <p className="fk_add_data-error">{generateRaportMsg}</p>
              )}


              {dateCounter?.raport?.date && <section className="fk_add_data__container-data">
                <section className="fk_add_data__container-data--title">
                  <span>
                    {dateCounter?.genrateRaport?.date ? dateCounter?.genrateRaport?.date : "Pobierz raport FK"}

                  </span>
                  {/* <span>{dateCounter?.genrateRaport?.date}</span> */}
                  {/* <span></span> */}
                </section>

                <section className="fk_add_data__container-data-file">
                  {dateCounter?.accountancy && (
                    <Button
                      variant="contained"
                      color="success"
                      disableElevation
                      onClick={getRaport}
                    >
                      Pobierz Raport FK
                    </Button>
                  )}
                </section>
              </section>}

            </section>
          </section>
        </section>
      )}
    </>
  );
};

export default FKAddData;
