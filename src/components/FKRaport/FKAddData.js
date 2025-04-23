import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import Button from "@mui/material/Button";
import InfoForRaportFK from "./InfoForRaportFK";
import "./FKAddData.css";

const FKAddData = ({ company }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [fKAccountancy, setFKAccountancy] = useState("");
  const [dateCounter, setDateCounter] = useState({});
  const [generateRaportMsgV2, setGenerateRaportMsgV2] = useState("");
  const [errorGenerateMsg, setErrorGenerateMsg] = useState(true);
  const [message, setMessage] = useState({
    prepare: "Przygotowywanie danych.",
    progress: "Trwa dopasowywanie danych.",
    error: "Nastąpił błąd. Sprawdź plik.",
    finish: "Dokumenty zaktualizowane",
    errorExcelFile: "Nieprawidłowy plik. Proszę przesłać plik Excel.",
    errorXLSX: "Akceptowany jest tylko plik z rozszerzeniem .xlsx",
    errorData: "Nieprawidłowe dane w pliku.",
    saveToDB: "Zapis do bazy danych - proszę czekać ...",
    generate: "Raport został wygenerowany.",
    generateError: "Wystąpił błąd."
  });

  const [raportInfoActive, setRaportInfoActive] = useState(false);
  const [getRaportInfo, setGetRaportInfo] = useState(true);

  const handleSendFile = async (e, type) => {
    setPleaseWait(true);
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
        `/add-data/send-documents-accountancy/${company}`,
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
    } catch (error) {
      setFKAccountancy(message.error);
      console.error("Błąd przesyłania pliku:", error);
    }
    finally {
      setPleaseWait(false);
    }
  };

  // funkcja generująca raport z już pobranych danych z pliku excel, każde generowanie nadaje nowe wiekowanie, kwote faktur do rozliczenia oraz od nowa przypisuje Obszary, Ownerów, Lokalizacje itd
  const generateRaport = async () => {
    try {
      setPleaseWait(true);
      await axiosPrivateIntercept.get(
        `/fk/generate-raport/${company}`
      );
      setGenerateRaportMsgV2(message.generate);
    }
    catch (err) {
      setGenerateRaportMsgV2(message.generateError);
      console.error(err);
    }
    finally {
      setPleaseWait(false);
    }
  };

  const getRaport = () => {
    setRaportInfoActive(true);
    setGetRaportInfo(false);
  };

  const deleteDataRaport = async () => {
    try {
      setPleaseWait(true);

      const result = await axiosPrivateIntercept.get(`/fk/delete-data-raport/${company}`);
      if (result.data.result === "delete") {
        setDateCounter({});
        setFKAccountancy("");
        setPleaseWait(false);
      }

      setPleaseWait(false);

    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    // pobieram daty i licznik ustawień dla aktualizowanych plików excel
    const getDateAndCounter = async () => {
      try {
        setPleaseWait(true);
        const result = await axiosPrivateIntercept.get(`/fk/get-date-counter/${company}`);
        setDateCounter(result.data.updateData);
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

        <>
          {raportInfoActive ?
            <InfoForRaportFK
              setRaportInfoActive={setRaportInfoActive}
              setErrorGenerateMsg={setErrorGenerateMsg}
              setGetRaportInfo={setGetRaportInfo}
              company={company}
            /> :
            <section className="fk_add_data">
              <section className="fk_add_data__title">
                <span>Dodaj dane do Raportu FK - <span style={{ color: "red" }}>{company}</span> </span>
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
                      {!dateCounter?.accountancy?.date ? (
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

                {dateCounter?.accountancy?.date ?
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
                    <section className="fk_add_data__container-item--title">
                      <span>Jeśli chcesz dodać nowe dane, najpierw usuń poprzedni raport.</span>
                    </section>
                  </section>
                  :
                  null
                }


                {dateCounter?.accountancy?.date &&
                  //  {!generateRaportMsgV2 ?
                  <>
                    {!generateRaportMsgV2 ?
                      <section className="fk_add_data__container-item">

                        <section className="fk_add_data__container-data">
                          <section className="fk_add_data__container-data--title">

                            {dateCounter?.generate?.date ? <span>{`Data wygenerowania raportu: `}
                              <span style={{ color: "red" }}>{dateCounter.generate.date}</span></span>
                              : dateCounter?.accountancy?.date ? <span>Wygeneruj raport FK</span> : <span></span>
                            }
                          </section>
                          <section className="fk_add_data__container-data-file">
                            {dateCounter?.accountancy && (
                              <Button
                                variant="contained"
                                color="primary"
                                disableElevation
                                onClick={generateRaport}
                              >
                                Generuj Raport FK
                              </Button>
                            )}
                          </section>
                        </section>

                        {dateCounter?.generate?.date &&
                          <>
                            {getRaportInfo ? <section className="fk_add_data__container-data">
                              <section className="fk_add_data__container-data--title">

                                {dateCounter?.raport?.date ? <span>{`Data pobrania raportu: `}
                                  <span style={{ color: "red" }}>{dateCounter.raport.date}</span></span>
                                  : dateCounter?.generate?.date ? <span>Pobierz raport FK</span> : <span></span>
                                }
                              </section>
                              <section className="fk_add_data__container-data-file">
                                <Button
                                  variant="contained"
                                  color="success"
                                  disableElevation
                                  onClick={getRaport}
                                >
                                  Pobierz Raport FK
                                </Button>
                              </section>
                            </section>
                              :
                              <section className="fk_add_data__container-data">
                                <p className="fk_add_data-error">Raport został pobrany.</p>
                              </section>}
                          </>
                        }
                      </section>
                      :
                      <section className="fk_add_data__container-item">
                        <p className="fk_add_data-error">{generateRaportMsgV2}</p>
                      </section>}
                  </>
                }
              </section>
            </section >}
        </>
      )
      }
    </>
  );
};

export default FKAddData;
