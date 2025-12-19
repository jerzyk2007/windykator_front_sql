import "./DocumentsControlBL.css";

const DocumentsControlBL = ({ documentControlBL, setDocumentControlBL }) => {
  console.log(documentControlBL);
  return (
    <section className="edit_doc documentControlBLs_control">
      <section className="edit_doc documentControlBLs_control__container">
        <section className="edit_doc__container">
          <span className="edit_doc--title">Dowód rejestracyjny:</span>
          <select
            className="edit_doc--select"
            value={documentControlBL.control_dow_rej}
            onChange={(e) => {
              setDocumentControlBL((prev) => {
                return {
                  ...prev,
                  control_dow_rej:
                    e.target.value === "NULL"
                      ? false
                      : e.target.options[e.target.selectedIndex].text,
                };
              });
            }}
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
            value={documentControlBL.control_upow}
            onChange={(e) => {
              setDocumentControlBL((prev) => {
                return {
                  ...prev,
                  control_upow:
                    e.target.value === "NULL"
                      ? false
                      : e.target.options[e.target.selectedIndex].text,
                };
              });
            }}
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
            value={documentControlBL.control_osw_vat}
            onChange={(e) => {
              setDocumentControlBL((prev) => {
                return {
                  ...prev,
                  control_osw_vat:
                    e.target.value === "NULL"
                      ? false
                      : e.target.options[e.target.selectedIndex].text,
                };
              });
            }}
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
            value={documentControlBL.control_pr_jaz}
            onChange={(e) => {
              setDocumentControlBL((prev) => ({
                ...prev,
                control_pr_jaz:
                  e.target.value === "NULL"
                    ? false
                    : e.target.options[e.target.selectedIndex].text,
              }));
            }}
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
            value={documentControlBL.control_polisa}
            onChange={(e) => {
              setDocumentControlBL((prev) => {
                return {
                  ...prev,
                  control_polisa:
                    e.target.value === "NULL"
                      ? false
                      : e.target.options[e.target.selectedIndex].text,
                };
              });
            }}
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
            value={documentControlBL.control_decyzja}
            onChange={(e) => {
              setDocumentControlBL((prev) => {
                return {
                  ...prev,
                  control_decyzja:
                    e.target.value === "NULL"
                      ? false
                      : e.target.options[e.target.selectedIndex].text,
                };
              });
            }}
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
            value={documentControlBL.control_fv}
            onChange={(e) => {
              setDocumentControlBL((prev) => {
                return {
                  ...prev,
                  control_fv:
                    e.target.value === "NULL"
                      ? false
                      : e.target.options[e.target.selectedIndex].text,
                };
              });
            }}
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
            value={documentControlBL.control_odpowiedzialnosc}
            onChange={(e) => {
              setDocumentControlBL((prev) => {
                return {
                  ...prev,
                  control_odpowiedzialnosc:
                    e.target.value === "NULL"
                      ? false
                      : e.target.options[e.target.selectedIndex].text,
                };
              });
            }}
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
            value={documentControlBL.control_platnosc_vat}
            onChange={(e) => {
              setDocumentControlBL((prev) => {
                return {
                  ...prev,
                  control_platnosc_vat:
                    e.target.value === "NULL" ? false : e.target.value,
                };
              });
            }}
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
            value={documentControlBL.control_brak_dzialan_od_ost}
            onChange={(e) => {
              setDocumentControlBL((prev) => {
                return {
                  ...prev,
                  control_brak_dzialan_od_ost:
                    e.target.value === "NULL" ? false : e.target.value,
                };
              });
            }}
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
