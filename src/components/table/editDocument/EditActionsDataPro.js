import { useState } from "react";

const formatAmount = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num = parseFloat(String(value).replace(",", "."));
  if (isNaN(num)) return String(value);
  return num.toLocaleString("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
};

const parseFormattedAmount = (formattedString) => {
  const cleanString = formattedString.replace(/\s/g, "").replace(",", ".");
  const num = parseFloat(cleanString);
  return isNaN(num) ? 0 : num;
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
    setDisplayKwotaSplaty(inputValue);
  };

  const handleKwotaBlur = (e) => {
    const inputValue = e.target.value;
    const parsedValue = parseFormattedAmount(inputValue);
    if (parsedValue !== 0) {
      setDisplayKwotaSplaty(formatAmount(parsedValue));
      handleAddNote(
        `Wprowadzono wpłatę od klienta w wysokości : ${formatAmount(
          parsedValue
        )}`,
        "log",
        context
      );
      setRowData((prev) => ({
        ...prev,
        NALEZNOSC: rowData.NALEZNOSC - parsedValue,
      }));
    }
  };

  if (profile === "partner") {
    return (
      <section className="ertp-data-section">
        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Data akceptacji:</span>
          <span className="ertp-data-row__value">
            {rowData.DATA_PRZYJECIA_SPRAWY}
          </span>
        </section>

        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Status sprawy:</span>
          <select
            className="ertp-input-select ertp-input--alert"
            value={rowData?.STATUS_SPRAWY || ""}
            onChange={(e) => {
              handleAddLog(
                "Status sprawy",
                rowData.STATUS_SPRAWY,
                e.target.value
              );
              setRowData((prev) => ({
                ...prev,
                STATUS_SPRAWY: e.target.value,
              }));
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

        {/* Powtarzalny blok dla Textarea */}
        {[
          {
            label: "Sygnatura sprawy:",
            field: "SYGNATURA_SPRAWY_SADOWEJ",
            title: "Sygnaturę sprawy",
          },
          {
            label: "Wydział Sądu:",
            field: "WYDZIAL_SADU",
            title: "Wydział Sądu",
          },
          {
            label: "Organ egzekucyjny:",
            field: "ORGAN_EGZEKUCYJNY",
            title: "Organ egzekucyjny",
          },
          {
            label: "Sygn. sprawy egz.:",
            field: "SYGN_SPRAWY_EGZEKUCYJNEJ",
            title: "Sygn. sprawy egzekucyjnej",
          },
        ].map((item) => (
          <section className="ertp-data-row" key={item.field}>
            <span className="ertp-data-row__label">{item.label}</span>
            <div className="ertp-input-wrapper">
              <textarea
                className="ertp-textarea ertp-input--alert"
                defaultValue={rowData[item.field] || ""}
                rows={1}
                maxLength={250}
                placeholder="wpisz dane - max 250 znaków"
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onBlur={(e) => {
                  const newValue = e.target.value;
                  const oldValue = rowData[item.field] || "";
                  if (newValue !== oldValue) {
                    handleAddLog(item.title, oldValue, newValue || "BRAK");
                    setRowData((prev) => ({ ...prev, [item.field]: newValue }));
                  }
                }}
              />
            </div>
          </section>
        ))}

        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Termin przedawnienia:</span>
          <div className="ertp-input-wrapper">
            <input
              className="ertp-input-date ertp-input--alert"
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

        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Data wymagalności:</span>
          <div className="ertp-input-wrapper">
            <input
              className="ertp-input-date ertp-input--alert"
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
                    "Data wymagalności płatności",
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
      <section className="ertp-data-section">
        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Wysokość wpłaty:</span>
          <input
            className="ertp-textarea ertp-input--alert"
            style={{ textAlign: "center" }}
            type="text"
            value={displayKwotaSplaty}
            placeholder={formatAmount(rowData.NALEZNOSC)}
            onChange={handleKwotaChange}
            onBlur={handleKwotaBlur}
          />
        </section>

        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Status sprawy:</span>
          <select
            className="ertp-input-select ertp-input--alert"
            value={rowData?.STATUS || ""}
            onChange={(e) => {
              handleAddLog("Status sprawy", rowData.STATUS, e.target.value);
              setRowData((prev) => ({ ...prev, STATUS: e.target.value }));
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
          <section className="ertp-data-row">
            <span className="ertp-data-row__label">Data rozliczenia OW:</span>
            {!rowData.OW ? (
              <div className="ertp-input-wrapper">
                <input
                  className="ertp-input-date ertp-input--alert"
                  type="date"
                  onBlur={(e) => {
                    const newValue = e.target.value || null;
                    const oldValue = rowData.OW || null;
                    if (newValue !== oldValue) {
                      handleAddLog(
                        "Rozliczenia OW",
                        oldValue ? oldValue.slice(0, 10) : "BRAK",
                        newValue || "BRAK"
                      );
                      setRowData((prev) => ({ ...prev, OW: newValue }));
                    }
                  }}
                />
              </div>
            ) : (
              <span className="ertp-data-row__value">{rowData.OW}</span>
            )}
          </section>
        )}
      </section>
    );
  }

  return <section className="ertp-data-section" />;
};

export default EditDocActionsPro;
