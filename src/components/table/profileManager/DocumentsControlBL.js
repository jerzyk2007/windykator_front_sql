import "./DocumentsControlBL.css";

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

    // 1. Aktualizacja stanu
    setDocumentControlBL((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 2. Dodanie notatki
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
    <section className="edit_doc documentControlBLs_control">
      <section className="edit_doc documentControlBLs_control__container">
        <section className="edit_doc__container">
          <span className="edit_doc--title">Dowód rejestracyjny:</span>
          <select
            className="edit_doc--select"
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

        <section className="edit_doc__container">
          <span className="edit_doc--title">Upoważnienie:</span>
          <select
            className="edit_doc--select"
            value={documentControlBL.CONTROL_UPOW ?? ""}
            onChange={handleSelectWithLog("CONTROL_UPOW", "Upoważnienie")}
          >
            <option value="NULL"></option>
            <option value="BRAK">BRAK</option>
            <option value="JEST">JEST</option>
          </select>
        </section>

        <section className="edit_doc__container">
          <span className="edit_doc--title">Oświadczenie o VAT:</span>
          <select
            className="edit_doc--select"
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

        <section className="edit_doc__container">
          <span className="edit_doc--title">Prawo jazdy:</span>
          <select
            className="edit_doc--select"
            value={documentControlBL.CONTROL_PR_JAZ ?? ""}
            onChange={handleSelectWithLog("CONTROL_PR_JAZ", "Prawo jazdy")}
          >
            <option value="NULL"></option>
            <option value="BRAK">BRAK</option>
            <option value="JEST">JEST</option>
          </select>
        </section>

        <section className="edit_doc__container">
          <span className="edit_doc--title">Polisa AC:</span>
          <select
            className="edit_doc--select"
            value={documentControlBL.CONTROL_POLISA ?? ""}
            onChange={handleSelectWithLog("CONTROL_POLISA", "Polisa AC")}
          >
            <option value="NULL"></option>
            <option value="BRAK">BRAK</option>
            <option value="JEST">JEST</option>
            <option value="NIE DOTYCZY">NIE DOTYCZY</option>
          </select>
        </section>

        <section className="edit_doc__container">
          <span className="edit_doc--title">Decyzja TU:</span>
          <select
            className="edit_doc--select"
            value={documentControlBL.CONTROL_DECYZJA ?? ""}
            onChange={handleSelectWithLog("CONTROL_DECYZJA", "Decyzja TU")}
          >
            <option value="NULL"></option>
            <option value="BRAK">BRAK</option>
            <option value="JEST">JEST</option>
          </select>
        </section>

        <section className="edit_doc__container">
          <span className="edit_doc--title">Faktura:</span>
          <select
            className="edit_doc--select"
            value={documentControlBL.CONTROL_FV ?? ""}
            onChange={handleSelectWithLog("CONTROL_FV", "Faktura")}
          >
            <option value="NULL"></option>
            <option value="BRAK">BRAK</option>
            <option value="JEST">JEST</option>
          </select>
        </section>

        <section className="edit_doc__container">
          <span className="edit_doc--title">Odpowiedzialność:</span>
          <select
            className="edit_doc--select"
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

        <section className="edit_doc__container">
          <span className="edit_doc--title">Płatność VAT:</span>
          <select
            className="edit_doc--select"
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

        <section className="edit_doc__container">
          <span className="edit_doc--title">
            Działania od ostatniej kontroli:
          </span>
          <select
            className="edit_doc--select"
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
