import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import Button from "@mui/material/Button";
import { saveAs } from "file-saver";
import "./FKAddData.css";

const FKAddData = ({ company }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [missongDeps, setMissingDeps] = useState("");
  const [dateCounter, setDateCounter] = useState({});

  const getRaport = async () => {
    setPleaseWait(true);

    try {
      const generateResponse = await axiosPrivateIntercept.get(
        `/fk/generate-data/${company}`
      );

      const titleDate = generateResponse?.data?.date || "Błąd";
      // const titleDate = "2025-09-02";

      const getMainRaport = await axiosPrivateIntercept.post(
        `/fk/get-main-report/${company}`,
        {},
        {
          responseType: "blob", // 👈 najważniejsze: pobieramy jako blob
        }
      );
      const blobMain = new Blob([getMainRaport.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blobMain, `Raport_Draft 201 203_należności_${titleDate}.xlsx`);

      const getBusinessRaport = await axiosPrivateIntercept.post(
        `/fk/get-business-report/${company}`,
        {},
        {
          responseType: "blob", // 👈 najważniejsze: pobieramy jako blob
        }
      );
      const blobBusiness = new Blob([getBusinessRaport.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blobBusiness, `Raport należności_biznes_stan _${titleDate}.xlsx`);

      await getDateAndCounter();
    } catch (err) {
      console.error(err);
    } finally {
      setPleaseWait(false);
    }
  };

  // funkcja generująca raport z już pobranych danych z pliku excel, każde generowanie nadaje nowe wiekowanie, kwote faktur do rozliczenia oraz od nowa przypisuje Obszary, Ownerów, Lokalizacje itd
  const createNewRaport = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get(
        `/fk/create-raport/${company}`
      );
      if (result?.data?.message) {
        return setMissingDeps(result.data.message);
      }

      if (result?.data?.info) {
        return setMissingDeps(result?.data?.info);
      }

      // po pobraniu nowych danych wiekowania, generuję raport własciwy
      await getRaport();

      await getDateAndCounter();
    } catch (err) {
      console.error(err);
    } finally {
      setPleaseWait(false);
    }
  };

  // pobieram daty i licznik ustawień dla aktualizowanych plików excel
  const getDateAndCounter = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get(
        `/fk/get-date-counter/${company}`
      );
      setDateCounter(result.data.updateData);
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
            <span>
              Dodaj dane do Raportu FK -{" "}
              <span style={{ color: "red" }}>{company}</span>{" "}
            </span>
          </section>

          <section className="fk_add_data__container">
            {dateCounter?.generate?.date && (
              <section className="fk_add_data__container-item">
                <span className="fk_add_data__container-item--title">
                  Raport wygenerowany dnia:
                </span>
                <span>{dateCounter?.generate?.date}</span>
              </section>
            )}

            {!missongDeps ? (
              <section className="fk_add_data__container-item">
                <section className="fk_add_data__container-file">
                  <Button
                    style={{ width: "50%" }}
                    variant="contained"
                    color="error"
                    disableElevation
                    onClick={createNewRaport}
                  >
                    Przygotuj nowy raport
                  </Button>
                </section>
                <section className="fk_add_data__container-item--title">
                  <span>Zakończ bieżący raport i wygeneruj kolejny.</span>
                </section>
              </section>
            ) : (
              <section className="fk_add_data__container-item">
                <p className="fk_add_data__container-item--error">
                  {missongDeps}
                </p>
              </section>
            )}

            {dateCounter?.raport?.date && (
              <section className="fk_add_data__container-item">
                <span>{`Data pobrania raportu: `}</span>
                <span style={{ color: "red" }}>
                  {dateCounter?.raport?.date}
                </span>
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
              </section>
            )}
          </section>
        </section>
      )}
    </>
  );
};

export default FKAddData;
