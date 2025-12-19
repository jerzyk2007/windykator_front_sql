import { useState, useEffect } from "react";
import "./EditActionsDataPro.css";

// Funkcja pomocnicza do formatowania liczby do wyświetlenia
const formatAmount = (value) => {
  if (value === null || value === undefined || value === "") {
    return ""; // Pusty string, jeśli wartość jest pusta
  }
  // Próbujemy parsować wartość jako liczbę, potem formatujemy
  const num = parseFloat(String(value).replace(",", ".")); // Upewnij się, że kropka jest używana do parsowania
  if (isNaN(num)) {
    return String(value); // Jeśli nie jest liczbą, zwróć oryginalny string
  }
  return num.toLocaleString("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
};

// Funkcja pomocnicza do parsowania sformatowanego stringu na liczbę
const parseFormattedAmount = (formattedString) => {
  // Usuń spacje (separator tysięcy) i zamień przecinek na kropkę
  const cleanString = formattedString.replace(/\s/g, "").replace(",", ".");
  const num = parseFloat(cleanString);
  return isNaN(num) ? 0 : num; // Zwróć 0, jeśli nie jest prawidłową liczbą
};

const EditDocActionsPro = ({
  rowData,
  handleAddNote,
  setRowData,
  profile,
  roles,
  context,
}) => {
  const [displayKwotaSplaty, setDisplayKwotaSplaty] = useState("");

  const status_sprawy =
    profile === "partner"
      ? [
          "BRAK",
          "EGZEKUCYJNA",
          "PRZEDSĄDOWA",
          "RESTRUKTURYZACYJNA",
          "SĄDOWA",
          "SĄDOWA / EGZEKUCYJNA",
        ]
      : profile === "insurance"
      ? ["BRAK", "WINDYKACJA WEWNĘTRZNA", "EPU", "SĄDOWA", "ZAKOŃCZONA"]
      : [];

  const handleAddLog = (title, oldStatus, newStatus) => {
    const note = `Zmieniono ${title}: z ${
      oldStatus ? oldStatus : "BRAK"
    } na ${newStatus}`;
    handleAddNote(note, "log", context);
  };

  const handleKwotaChange = (e) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[^0-9,\s]/g, "");
    // Aktualizujemy wyświetlaną wartość (może być niepoprawnie sformatowana, gdy użytkownik wpisuje)
    setDisplayKwotaSplaty(inputValue);
  };

  const handleKwotaBlur = (e) => {
    const inputValue = e.target.value;
    const parsedValue = parseFormattedAmount(inputValue);
    if (parsedValue !== 0) {
      // Po blurze, formatujemy wartość i ustawiamy ją z powrotem w input
      setDisplayKwotaSplaty(formatAmount(parsedValue));
      handleAddNote(
        `Wprowadzono wpłatę od klienta w wysokości : ${formatAmount(
          parsedValue
        )}`,
        "log",
        context
      );

      setRowData((prev) => {
        return {
          ...prev,
          NALEZNOSC: rowData.NALEZNOSC - parsedValue,
        };
      });
    }
  };

  // useEffect(() => {
  //   const initialKwota = rowData.NALEZNOSC || 0;
  //   setDisplayKwotaSplaty(formatAmount(initialKwota));
  // }, [rowData]);

  if (profile === "partner") {
    return (
      <section className="edit_doc edit_doc_basic-data edit_basic_data_pro">
        <section className="edit_doc__container">
          <span className="edit_doc--title">Data akceptacji:</span>
          <span className="edit_doc--content">
            {rowData.DATA_PRZYJECIA_SPRAWY}
          </span>
        </section>
        <section className="edit_doc__container">
          <span className="edit_doc--title">Status sprawy:</span>
          <select
            className="item_component-title__container-data--text edit_basic_data_pro--select"
            value={rowData?.STATUS_SPRAWY ? rowData.STATUS_SPRAWY : ""}
            onChange={(e) => {
              handleAddLog(
                "Status sprawy",
                rowData.STATUS_SPRAWY,
                e.target.value
              );
              setRowData((prev) => {
                return {
                  ...prev,
                  STATUS_SPRAWY: e.target.value,
                };
              });
            }}
          >
            <option value="BRAK" disabled hidden>
              BRAK
            </option>
            {status_sprawy.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </section>

        <section className="edit_doc__container">
          <span className="edit_doc--title">Sygnatura sprawy:</span>
          <div className="textarea-wrapper">
            <textarea
              className="edit_basic_data_pro--textarea"
              defaultValue={rowData.SYGNATURA_SPRAWY_SADOWEJ || ""}
              rows={1}
              maxLength={250}
              placeholder="wpisz dane - max 250 znaków"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onBlur={(e) => {
                const newValue = e.target.value;
                const oldValue = rowData.SYGNATURA_SPRAWY_SADOWEJ || "";

                if (newValue !== oldValue) {
                  handleAddLog(
                    "Sygnaturę sprawy",
                    oldValue,
                    newValue ? newValue : "BRAK"
                  );

                  setRowData((prev) => ({
                    ...prev,
                    SYGNATURA_SPRAWY_SADOWEJ: newValue,
                  }));
                }
              }}
            ></textarea>
          </div>
        </section>

        <section className="edit_doc__container">
          <span className="edit_doc--title">Wydział Sądu:</span>
          <div className="textarea-wrapper">
            <textarea
              className="edit_basic_data_pro--textarea"
              defaultValue={rowData.WYDZIAL_SADU || ""}
              rows={1}
              maxLength={250}
              placeholder="wpisz dane - max 250 znaków"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onBlur={(e) => {
                const newValue = e.target.value;
                const oldValue = rowData.WYDZIAL_SADU || "";

                if (newValue !== oldValue) {
                  handleAddLog(
                    "Wydział Sądu",
                    oldValue,
                    newValue ? newValue : "BRAK"
                  );

                  setRowData((prev) => ({
                    ...prev,
                    WYDZIAL_SADU: newValue,
                  }));
                }
              }}
            ></textarea>
          </div>
        </section>

        <section className="edit_doc__container">
          <span className="edit_doc--title">Organ egzekucyjny:</span>
          <div className="textarea-wrapper">
            <textarea
              className="edit_basic_data_pro--textarea"
              defaultValue={rowData.ORGAN_EGZEKUCYJNY || ""}
              rows={1}
              maxLength={250}
              placeholder="wpisz dane - max 250 znaków"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onBlur={(e) => {
                const newValue = e.target.value;
                const oldValue = rowData.ORGAN_EGZEKUCYJNY || "";

                if (newValue !== oldValue) {
                  handleAddLog(
                    "Organ egzekucyjny",
                    oldValue,
                    newValue ? newValue : "BRAK"
                  );

                  setRowData((prev) => ({
                    ...prev,
                    ORGAN_EGZEKUCYJNY: newValue,
                  }));
                }
              }}
            ></textarea>
          </div>
        </section>

        <section className="edit_doc__container">
          <span className="edit_doc--title">
            Sygnatura sprawy egzekucyjnej:
          </span>
          <div className="textarea-wrapper">
            <textarea
              className="edit_basic_data_pro--textarea"
              defaultValue={rowData.SYGN_SPRAWY_EGZEKUCYJNEJ || ""}
              rows={1}
              maxLength={250}
              placeholder="wpisz dane - max 250 znaków"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onBlur={(e) => {
                const newValue = e.target.value;
                const oldValue = rowData.SYGN_SPRAWY_EGZEKUCYJNEJ || "";

                if (newValue !== oldValue) {
                  handleAddLog(
                    "Sygn. sprawy egzekucyjnej",
                    oldValue,
                    newValue ? newValue : "BRAK"
                  );

                  setRowData((prev) => ({
                    ...prev,
                    SYGN_SPRAWY_EGZEKUCYJNEJ: newValue,
                  }));
                }
              }}
            ></textarea>
          </div>
        </section>

        <section className="edit_doc__container">
          <span className="edit_doc--title">
            Termin przedawnienia roszczenia:
          </span>
          <div className="textarea-wrapper">
            <input
              className="item_component-title__container-data--text edit_basic_data_pro--date"
              type="date"
              defaultValue={
                rowData.TERMIN_PRZEDAWNIENIA_ROSZCZENIA
                  ? rowData.TERMIN_PRZEDAWNIENIA_ROSZCZENIA.slice(0, 10)
                  : ""
              }
              onBlur={(e) => {
                const newValue = e.target.value || null;
                const oldValue =
                  rowData.TERMIN_PRZEDAWNIENIA_ROSZCZENIA || null;

                if (newValue !== oldValue) {
                  handleAddLog(
                    "Termin przedawnienia roszczenia",
                    oldValue ? oldValue.slice(0, 10) : "BRAK",
                    newValue || "BRAK"
                  );

                  setRowData((prev) => ({
                    ...prev,
                    TERMIN_PRZEDAWNIENIA_ROSZCZENIA: newValue,
                  }));
                }
              }}
            />
          </div>
        </section>
        <section className="edit_doc__container">
          <span className="edit_doc--title">Data wymagalności płatności:</span>
          <div className="textarea-wrapper">
            <input
              className="item_component-title__container-data--text edit_basic_data_pro--date"
              type="date"
              defaultValue={
                rowData.DATA_WYMAGALNOSCI_PLATNOSCI
                  ? rowData.DATA_WYMAGALNOSCI_PLATNOSCI.slice(0, 10)
                  : ""
              }
              onBlur={(e) => {
                const newValue = e.target.value || null;
                const oldValue = rowData.DATA_WYMAGALNOSCI_PLATNOSCI || null;

                if (newValue !== oldValue) {
                  handleAddLog(
                    "Termin przedawnienia roszczenia",
                    oldValue ? oldValue.slice(0, 10) : "BRAK",
                    newValue || "BRAK"
                  );

                  setRowData((prev) => ({
                    ...prev,
                    DATA_WYMAGALNOSCI_PLATNOSCI: newValue,
                  }));
                }
              }}
            />
          </div>
        </section>
      </section>
    );
  } else if (profile === "insurance") {
    return (
      <section className="edit_doc edit_doc_basic-data edit_basic_data_pro">
        <section className="edit_doc__container">
          <span className="edit_doc--title">Wysokość wpłaty:</span>
          <input
            className="edit_doc--content edit_basic_data_pro--date"
            type="text"
            value={displayKwotaSplaty}
            placeholder={formatAmount(rowData.NALEZNOSC)}
            onChange={handleKwotaChange}
            onBlur={handleKwotaBlur}
          />
        </section>
        <section className="edit_doc__container">
          <span className="edit_doc--title">Status sprawy:</span>
          <select
            className="item_component-title__container-data--text edit_basic_data_pro--select"
            value={rowData?.STATUS ? rowData.STATUS : ""}
            onChange={(e) => {
              handleAddLog("Status sprawy", rowData.STATUS, e.target.value);
              setRowData((prev) => {
                return {
                  ...prev,
                  STATUS: e.target.value,
                };
              });
            }}
          >
            <option value="BRAK" disabled hidden>
              BRAK
            </option>
            {status_sprawy.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </section>
        {roles.includes(150) && (
          <section className="edit_doc__container">
            <span className="edit_doc--title">Data rozliczenia OW:</span>
            {!rowData.OW ? (
              <div className="textarea-wrapper">
                <input
                  className="item_component-title__container-data--text edit_basic_data_pro--date"
                  type="date"
                  defaultValue={rowData.OW ? rowData.OW.slice(0, 10) : ""}
                  onBlur={(e) => {
                    const newValue = e.target.value || null;
                    const oldValue = rowData.OW || null;

                    if (newValue !== oldValue) {
                      handleAddLog(
                        "Rozliczenia OW",
                        oldValue ? oldValue.slice(0, 10) : "BRAK",
                        newValue || "BRAK"
                      );

                      setRowData((prev) => ({
                        ...prev,
                        OW: newValue,
                      }));
                    }
                  }}
                />
              </div>
            ) : (
              <span className="edit_doc--content">{rowData.OW}</span>
            )}
          </section>
        )}
      </section>
    );
  } else {
    return (
      <section className="edit_doc edit_doc_basic-data edit_basic_data_pro"></section>
    );
  }
};

export default EditDocActionsPro;
