import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import Button from "@mui/material/Button";
import { saveAs } from "file-saver";
import InfoForRaportFK from "./InfoForRaportFK";
import "./FKAddData.css";

const FKAddData = ({ company }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [fKAccountancy, setFKAccountancy] = useState("");
  const [dateCounter, setDateCounter] = useState({});
  // const [generateRaportMsgV2, setGenerateRaportMsgV2] = useState("");
  // const [errorGenerateMsg, setErrorGenerateMsg] = useState(true);
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

  const [raportInfo, setRaportInfo] = useState({
    reportDate: new Date().toISOString().split('T')[0],
    agingDate: new Date().toISOString().split('T')[0],
    accountingDate: new Date().toISOString().split('T')[0],
    reportName: 'Draft 201 203_należności'
  });

  // const handleSendFile = async (e, type) => {
  //   setPleaseWait(true);
  //   const file = e.target.files[0];
  //   if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
  //     setFKAccountancy("Akceptowany jest tylko plik z rozszerzeniem .xlsx lub .xls");
  //     setPleaseWait(false);
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     formData.append("excelFile", file);
  //     const result = await axiosPrivateIntercept.post(
  //       `/add-data/send-documents-accountancy/${company}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     if (result?.data?.info) {
  //       setFKAccountancy(result?.data?.info);
  //     }
  //   } catch (error) {
  //     setFKAccountancy(message.error);
  //     console.error("Błąd przesyłania pliku:", error);
  //   }
  //   finally {
  //     setPleaseWait(false);
  //   }
  // };

  // funkcja generująca raport z już pobranych danych z pliku excel, każde generowanie nadaje nowe wiekowanie, kwote faktur do rozliczenia oraz od nowa przypisuje Obszary, Ownerów, Lokalizacje itd
  const generateRaport = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get(
        `/fk/generate-raport/${company}`
      );


      if (result?.data?.info) {
        setFKAccountancy(result?.data?.info);
      }


      const response = await axiosPrivateIntercept.post(
        `/fk/get-raport-data/${company}`,
        { raportInfo },
        {
          responseType: 'blob', // 👈 najważniejsze: pobieramy jako blob
        }
      );
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      saveAs(blob, `Raport_${raportInfo.reportName}.xlsx`);

      await getDateAndCounter();

      // setGenerateRaportMsgV2(message.generate);
    }
    catch (err) {
      // setGenerateRaportMsgV2(message.generateError);
      console.error(err);
    }
    finally {
      setPleaseWait(false);
    }
  };

  const getRaport = async () => {
    setPleaseWait(true);

    try {
      const response = await axiosPrivateIntercept.post(
        `/fk/get-raport-data/${company}`,
        { raportInfo },
        {
          responseType: 'blob', // 👈 najważniejsze: pobieramy jako blob
        }
      );
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      saveAs(blob, `Raport_${raportInfo.reportName}.xlsx`);

      await getDateAndCounter();
    }
    catch (err) {
      // setGenerateRaportMsgV2(message.generateError);
      console.error(err);
    }
    finally {
      setPleaseWait(false);
    }
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

  useEffect(() => {

    getDateAndCounter();
    // }, []);
  }, []);

  {/* {raportInfoActive ?
            <InfoForRaportFK
              setRaportInfoActive={setRaportInfoActive}
              setErrorGenerateMsg={setErrorGenerateMsg}
              setGetRaportInfo={setGetRaportInfo}
              company={company}
            /> : */}


  return (


    <>
      {pleaseWait ? (
        <PleaseWait />
      ) :


        <section className="fk_add_data">
          <section className="fk_add_data__title">
            <span>Dodaj dane do Raportu FK - <span style={{ color: "red" }}>{company}</span> </span>
          </section>

          <section className="fk_add_data__container">

            {dateCounter?.generate?.date && <section className="fk_add_data__container-item">
              <span className="fk_add_data__container-item--title">
                Raport wygenerowany dnia:
              </span>
              <span>{dateCounter?.generate?.date}</span>

            </section>}

            {!fKAccountancy ?
              <section className="fk_add_data__container-item">
                <section className="fk_add_data__container-file">
                  <Button
                    style={{ width: "50%" }}
                    variant="contained"
                    color="error"
                    disableElevation
                    onClick={generateRaport}
                  >
                    Przygotuj nowy raport

                  </Button>
                </section>
                <section className="fk_add_data__container-item--title">
                  <span>Zakończ bieżący raport i wygeneruj kolejny.</span>
                </section>
              </section>
              :
              <section className="fk_add_data__container-item">
                <p className="fk_add_data__container-item--error">{fKAccountancy}</p>
              </section>
            }

            {dateCounter?.raport?.date && <section className="fk_add_data__container-item">
              <span>{`Data pobrania raportu: `}

              </span>
              <span style={{ color: "red" }}>
                {dateCounter?.raport?.date}</span>
              <section className="fk_add_data__container-file">
                <Button
                  variant="contained"
                  color="success"
                  disableElevation
                  onClick={getRaport}
                >
                  Pobierz Raport FK
                </Button>
              </section>
            </section>}

          </section>
        </section >


      }
    </>
  );
};

export default FKAddData;
