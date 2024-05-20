import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import Button from "@mui/material/Button";
import { getAllDataRaport } from "../utilsForTable/excelFilteredTable";
import { format } from "date-fns";

import "./FKAddData.css";

const FKAddData = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  // const { pleaseWait, setPleaseWait } = useData();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [fKAccountancy, setfKAccountancy] = useState("");
  const [carReleased, setCarReleased] = useState("");
  const [settlementNames, setSettlementNames] = useState("");
  const [rubiconData, setRubiconData] = useState("");
  const [deleteRaport, setDeleteRaport] = useState("");
  const [dateCounter, setDateCounter] = useState({});

  const handleSendFile = async (e, type) => {
    setPleaseWait(true);
    setDeleteRaport("");
    const file = e.target.files[0];
    if (!file) return console.log("Brak pliku");
    if (!file.name.endsWith(".xlsx")) {
      setfKAccountancy("Akceptowany jest tylko plik z rozszerzeniem .xlsx");
      return;
    }
    try {
      setPleaseWait(true);
      const formData = new FormData();
      formData.append("excelFile", file);

      const result = await axiosPrivateIntercept.post(
        `/fk/send-documents/${type}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPleaseWait(false);

      // console.log(result.data);
      if (result.data.error) {
        return setfKAccountancy(
          `Nie dopasowano danych dla: ${result.data.data}`
        );
      }

      if (type === "accountancy") {
        setfKAccountancy("Dokumenty zaktualizowane.");
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
    } catch (error) {
      if (type === "accountancy") {
        setfKAccountancy("Błąd aktualizacji dokumentów.");
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

      const settingsColumn = await axiosPrivateIntercept.get(
        "/fk/get-columns-order"
      );

      const orderColumns = settingsColumn.data;

      // const dataToString = result.data.map((item) => {
      //   if (item.ILE_DNI_NA_PLATNOSC_FV) {
      //     item.ILE_DNI_NA_PLATNOSC_FV = String(item.ILE_DNI_NA_PLATNOSC_FV);
      //   }
      //   if (item.RODZAJ_KONTA) {
      //     item.RODZAJ_KONTA = String(item.RODZAJ_KONTA);
      //   }
      //   if (item.NR_KLIENTA) {
      //     item.NR_KLIENTA = String(item.NR_KLIENTA);
      //   }
      //   // if (item.KWOTA_WPS) {
      //   //   item.KWOTA_WPS = item.KWOTA_WPS !== "0" ? Number(item.KWOTA_WPS) : "";
      //   // }
      //   return item;
      // });
      getAllDataRaport(result.data, orderColumns, "Generowanie Raportu");
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
        setfKAccountancy("");
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
