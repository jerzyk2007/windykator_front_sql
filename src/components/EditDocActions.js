import { Button } from "@mui/material";
import "./EditDocActions.css";

const EditDocActions = ({ rowData, setRowData, setBeCared }) => {
  return (
    <section className="edit_doc_actions">
      <section className="edit_doc_actions__container">
        <span className="edit_doc_actions__container--title">
          Wybierz kancelarię:
        </span>

        <select
          className="edit_doc_actions__container--select"
          value={rowData.JAKA_KANCELARIA ? rowData.JAKA_KANCELARIA : ""}
          onChange={(e) =>
            setRowData((prev) => {
              return {
                ...prev,
                JAKA_KANCELARIA: e.target.value,
              };
            })
          }
        >
          <option value="BRAK">BRAK</option>
          <option value="M_LEGAL">M_LEGAL</option>
          <option value="INWEST INKASO">INWEST INKASO</option>
          <option value="KANCELARIA KROTOSKI">KANCELARIA KROTOSKI</option>
          <option value="KRAUZE">KRAUZE</option>
          <option value="POSTEPOWANIE SANACYJNE">POSTĘPOWANIE SANACYJNE</option>
          <option value="ROK-KONOPA">ROK-KONOPA</option>
          <option value="CNP">CNP</option>
        </select>
      </section>

      <section className="edit_doc_actions__container">
        <span className="edit_doc_actions__container--title">
          Rodzaj działania:
        </span>
        <select
          className="edit_doc_actions__container--select"
          value={rowData.DZIALANIA ? rowData.DZIALANIA : ""}
          onChange={(e) =>
            setRowData((prev) => {
              return {
                ...prev,
                DZIALANIA: e.target.value,
              };
            })
          }
        >
          <option value="BRAK">BRAK</option>
          <option value="W KOSZTY DZIAŁU">W KOSZTY DZIAŁU</option>
          <option value="DO KOREKTY">DO KOREKTY</option>
          <option value="DO DECYZJI KIEROWNIKA">DO DECYZJI KIEROWNIKA</option>
          <option value="WYSŁANO WEZWANIE DO ZAPŁATY">
            WYSŁANO WEZWANIE DO ZAPŁATY
          </option>
          <option value="GREEN PARTS">GREEN PARTS</option>
        </select>
      </section>

      <section className="edit_doc_actions__container">
        <span className="edit_doc_actions__container--title">
          Błąd doradcy:
        </span>

        <select
          className="edit_doc_actions__container--select"
          value={rowData.BLAD_DORADCY ? rowData.BLAD_DORADCY : ""}
          onChange={(e) =>
            setRowData((prev) => {
              return {
                ...prev,
                BLAD_DORADCY: e.target.value,
              };
            })
          }
        >
          <option value="NIE">Nie</option>
          <option value="TAK">Tak</option>
        </select>
      </section>

      <section className="edit_doc_actions__container">
        <span className="edit_doc_actions__container--title">
          Pobrany VAT ?
        </span>
        <select
          className="edit_doc_actions__container--select"
          value={rowData.POBRANO_VAT ? rowData.POBRANO_VAT : ""}
          onChange={(e) =>
            setRowData((prev) => {
              return {
                ...prev,
                POBRANO_VAT: e.target.value,
              };
            })
          }
        >
          <option value="Nie dotyczy">Nie dotyczy</option>
          <option value="TAK">Tak</option>
          <option value="50">Nie pobrano 50%</option>
          <option value="100">Nie pobrano 100%</option>
        </select>
      </section>

      <section className="edit_doc_actions__container">
        <span className="edit_doc_actions__container--title">
          Wyróżnij kontrahenta
        </span>
        <input
          className="edit_doc_actions__container--select"
          type="checkbox"
          checked={rowData.ZAZNACZ_KONTRAHENTA === "Tak"}
          onChange={(e) =>
            setRowData((prev) => {
              const newValue = e.target.checked ? "Tak" : "Nie";
              return {
                ...prev,
                ZAZNACZ_KONTRAHENTA: newValue,
              };
            })
          }
        />
      </section>
      <section className="edit_doc_actions--button">
        <Button variant="outlined" onClick={() => setBeCared(true)}>
          BeCared
        </Button>
      </section>
    </section>
  );
};

export default EditDocActions;
