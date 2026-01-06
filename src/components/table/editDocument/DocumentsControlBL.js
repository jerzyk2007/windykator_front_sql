const DocumentsControlBL = ({
  documentControlBL,
  setDocumentControlBL,
  handleAddNote,
  context,
}) => {
  // uniwersalny handler do selectów z logiem
  const handleSelectWithLog = (field, label) => (e) => {
    const value =
      e.target.value === "NULL"
        ? false
        : e.target.options[e.target.selectedIndex].text;

    setDocumentControlBL((prev) => ({
      ...prev,
      [field]: value,
    }));

    handleAddNote(`${label} - ${value}`, "log", context);
  };

  // do selectów, gdzie wartość jest brana bezpośrednio (nie text)
  const handleSelectDirect = (field, label) => (e) => {
    const value = e.target.value === "NULL" ? false : e.target.value;

    setDocumentControlBL((prev) => ({
      ...prev,
      [field]: value,
    }));

    handleAddNote(`${label} - ${value}`, "log", context);
  };

  return (
    <section className="ertp-data-section">
      <section className="ertp-data-section">
        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Dowód rejestracyjny:</span>
          <select
            className="ertp-input-select"
            value={documentControlBL.CONTROL_DOW_REJ ?? ""}
            onChange={handleSelectWithLog(
              "CONTROL_DOW_REJ",
              "Dowód rejestracyjny"
            )}
          >
            <option value="NULL"></option>
            <option value="BRAK">BRAK</option>
            <option value="JEST">JEST</option>
          </select>
        </section>

        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Upoważnienie:</span>
          <select
            className="ertp-input-select"
            value={documentControlBL.CONTROL_UPOW ?? ""}
            onChange={handleSelectWithLog("CONTROL_UPOW", "Upoważnienie")}
          >
            <option value="NULL"></option>
            <option value="BRAK">BRAK</option>
            <option value="JEST">JEST</option>
          </select>
        </section>

        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Oświadczenie o VAT:</span>
          <select
            className="ertp-input-select"
            value={documentControlBL.CONTROL_OSW_VAT ?? ""}
            onChange={handleSelectWithLog(
              "CONTROL_OSW_VAT",
              "Oświadczenie o VAT"
            )}
          >
            <option value="NULL"></option>
            <option value="BRAK">BRAK</option>
            <option value="JEST">JEST</option>
          </select>
        </section>

        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Prawo jazdy:</span>
          <select
            className="ertp-input-select"
            value={documentControlBL.CONTROL_PR_JAZ ?? ""}
            onChange={handleSelectWithLog("CONTROL_PR_JAZ", "Prawo jazdy")}
          >
            <option value="NULL"></option>
            <option value="BRAK">BRAK</option>
            <option value="JEST">JEST</option>
          </select>
        </section>

        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Polisa AC:</span>
          <select
            className="ertp-input-select"
            value={documentControlBL.CONTROL_POLISA ?? ""}
            onChange={handleSelectWithLog("CONTROL_POLISA", "Polisa AC")}
          >
            <option value="NULL"></option>
            <option value="BRAK">BRAK</option>
            <option value="JEST">JEST</option>
            <option value="NIE DOTYCZY">NIE DOTYCZY</option>
          </select>
        </section>

        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Decyzja TU:</span>
          <select
            className="ertp-input-select"
            value={documentControlBL.CONTROL_DECYZJA ?? ""}
            onChange={handleSelectWithLog("CONTROL_DECYZJA", "Decyzja TU")}
          >
            <option value="NULL"></option>
            <option value="BRAK">BRAK</option>
            <option value="JEST">JEST</option>
          </select>
        </section>

        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Faktura:</span>
          <select
            className="ertp-input-select"
            value={documentControlBL.CONTROL_FV ?? ""}
            onChange={handleSelectWithLog("CONTROL_FV", "Faktura")}
          >
            <option value="NULL"></option>
            <option value="BRAK">BRAK</option>
            <option value="JEST">JEST</option>
          </select>
        </section>

        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Odpowiedzialność:</span>
          <select
            className="ertp-input-select"
            value={documentControlBL.CONTROL_ODPOWIEDZIALNOSC ?? ""}
            onChange={handleSelectWithLog(
              "CONTROL_ODPOWIEDZIALNOSC",
              "Odpowiedzialność"
            )}
          >
            <option value="NULL"></option>
            <option value="BRAK">BRAK</option>
            <option value="JEST">JEST</option>
          </select>
        </section>

        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Płatność VAT:</span>
          <select
            className="ertp-input-select"
            value={documentControlBL.CONTROL_PLATNOSC_VAT ?? ""}
            onChange={handleSelectDirect(
              "CONTROL_PLATNOSC_VAT",
              "Płatność VAT"
            )}
          >
            <option value="NULL"></option>
            <option value="NIE DOTYCZY">NIE DOTYCZY</option>
            <option value="PŁATNOŚĆ ODROCZONA">PŁATNOŚĆ ODROCZONA</option>
            <option value="POBRANY">POBRANY</option>
            <option value="NIE POBRANY 50%">NIE POBRANY 50%</option>
            <option value="NIE POBRANY 100%">NIE POBRANY 100%</option>
          </select>
        </section>

        <section className="ertp-data-row">
          <span className="ertp-data-row__label">
            Działania od ostatniej kontroli:
          </span>
          <select
            className="ertp-input-select"
            value={documentControlBL.CONTROL_BRAK_DZIALAN_OD_OST ?? ""}
            onChange={handleSelectDirect(
              "CONTROL_BRAK_DZIALAN_OD_OST",
              "Działania od ostatniej kontroli"
            )}
          >
            <option value="NULL"></option>
            <option value="BRAK DZIAŁAŃ">BRAK DZIAŁAŃ</option>
            <option value="PODJĘTO DZIAŁANIA">PODJĘTO DZIAŁANIA</option>
            <option value="NIE DOTYCZY">NIE DOTYCZY</option>
          </select>
        </section>
      </section>
    </section>
  );
};

export default DocumentsControlBL;
