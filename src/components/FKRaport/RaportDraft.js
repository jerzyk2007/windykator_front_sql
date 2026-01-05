import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import Button from "@mui/material/Button";
import { saveAs } from "file-saver";
import "./RaportDraft.css";

const RaportDraft = ({ company }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [missongDeps, setMissingDeps] = useState("");
  const [dateCounter, setDateCounter] = useState({});
  const [mails, setMails] = useState({
    generate: false,
    data: [],
  });

  const getRaport = async () => {
    setPleaseWait(true);

    try {
      await axiosPrivateIntercept.get(`/fk/generate-data/${company}`);

      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0"); // miesiące od 0-11
      const dd = String(today.getDate()).padStart(2, "0");

      const titleDate = `${yyyy}-${mm}-${dd}`;
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

  const getOwnersMail = async () => {
    try {
      setPleaseWait(true);

      const result = await axiosPrivateIntercept.get(
        `/fk/get-owners-mail/${company}`
      );
      const sortedMails = result.data.mail.sort((a, b) => a.localeCompare(b));
      setMails({
        generate: true,
        data: sortedMails || [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setPleaseWait(false);
    }
  };

  const copyMails = () => {
    if (mails?.data) {
      const textToCopy = mails.data.join("; "); // łączysz maile w jeden string
      navigator.clipboard.writeText(textToCopy);
    }
  };

  const generateMails = mails.data.map((item, index) => {
    return (
      <section key={index} className="fk_add_data__mails-item">
        {item}
      </section>
    );
  });

  useEffect(() => {
    getDateAndCounter();
  }, []);

  return (
    <>
      {pleaseWait ? (
        <PleaseWait info="xmas" />
      ) : (
        <section className="fk_add_data">
          <section className="fk_add_data__title">
            <span>
              Dodaj dane do Raportu FK -{" "}
              <span style={{ color: "red" }}>{company}</span>{" "}
            </span>
          </section>

          <section className="fk_add_data__container">
            {dateCounter?.accountancy?.date && (
              <section className="fk_add_data__container-item">
                <span className="fk_add_data__container-item--title">
                  Dane wiekowania z dnia:
                </span>
                <span>{dateCounter?.accountancy?.date}</span>
              </section>
            )}
            {dateCounter?.raport?.date && (
              <section className="fk_add_data__container-item">
                <span className="fk_add_data__container-item--title">
                  Dane pobrane dnia:
                </span>
                <span>{dateCounter?.raport?.date}</span>
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
                  Anulowano generowanie raportu
                </p>
                <p className="fk_add_data__container-item--error">
                  {missongDeps}
                </p>
              </section>
            )}

            {dateCounter?.generate?.date && (
              <section className="fk_add_data__container-item">
                <span>Data wygenerowania raportu:</span>
                <span style={{ color: "red" }}>
                  {dateCounter?.generate?.date}
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
            <section className="fk_add_data__container-item fk_add_data__mails">
              <section className="fk_add_data__mails__wrapper">
                {!mails.generate && (
                  <Button
                    variant="contained"
                    color="secondary"
                    disableElevation
                    onClick={getOwnersMail}
                  >
                    Pobierz adresy mailowe Ownerów
                  </Button>
                )}
                {mails.generate && !mails.data.length && (
                  <p className="fk_add_data__mails-title">Brak danych</p>
                )}
                {mails.generate && mails.data.length ? (
                  <>
                    <section className="fk_add_data__mails__container">
                      {generateMails}
                    </section>
                    <section className="fk_add_data__mails__copy">
                      <Button
                        variant="contained"
                        color="secondary"
                        disableElevation
                        onClick={copyMails}
                      >
                        Skopiuj do schowka
                      </Button>
                    </section>
                  </>
                ) : null}
              </section>
            </section>
          </section>
        </section>
      )}
    </>
  );
};

export default RaportDraft;
