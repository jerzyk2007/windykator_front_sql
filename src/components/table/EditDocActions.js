import EditDocSettlements from "./EditDocSettlements";
import { Button } from "@mui/material";
import "./EditDocActions.css";

const EditDocActions = ({ rowData, setRowData, setChangePanel, changePanel, handleAddNote }) => {
  return (
    <section className="edit_doc_actions">
      {/* <section className="edit_doc edit_doc_actions"> */}
      <section className="edit_doc edit_doc_actions__container">
        <section className="edit_doc__container">
          <span className="edit_doc--title">Jaka kancelaria:</span>
          <span className="edit_doc--content">{rowData?.JAKA_KANCELARIA ? rowData.JAKA_KANCELARIA : "BRAK"}</span>
        </section>
        {/* {rowData?.JAKA_KANCELARIA && <section className="edit_doc__container">
        <span className="edit_doc--title">Data przek. do kanc.:</span>
        <span className="edit_doc--content">{rowData?.DATA_PRZENIESIENIA_DO_WP ? rowData.DATA_PRZENIESIENIA_DO_WP : "BRAK"}</span>
      </section>} */}
        {rowData?.JAKA_KANCELARIA && <section className="edit_doc__container">
          <span className="edit_doc--title">Status kancelaria:</span>
          <span className="edit_doc--content">{rowData?.STATUS_AKTUALNY ? rowData.STATUS_AKTUALNY : "BRAK"}</span>
        </section>}
        <section className="edit_doc__container">
          <span className="edit_doc--title">
            Rodzaj działania:
          </span>
          <select
            className="edit_doc--select"
            value={rowData.DZIALANIA ? rowData.DZIALANIA : ""}
            onChange={(e) => {
              handleAddNote(
                "Rodzaj działania:",
                e.target.options[e.target.selectedIndex].text
              );
              setRowData((prev) => {
                return {
                  ...prev,
                  DZIALANIA: e.target.value,
                };
              });
            }}
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

        <section className="edit_doc__container">
          <span className="edit_doc--title">
            Błąd doradcy:
          </span>

          <select
            className="edit_doc--select"
            value={rowData.BLAD_DORADCY ? rowData.BLAD_DORADCY : ""}
            onChange={(e) => {
              handleAddNote(
                "Błąd doradcy:",
                e.target.options[e.target.selectedIndex].text
              );
              setRowData((prev) => {
                return {
                  ...prev,
                  BLAD_DORADCY: e.target.value,
                };
              });
            }}
          >
            <option value="NIE">Nie</option>
            <option value="TAK">Tak</option>
          </select>
        </section>

        {rowData.area === "BLACHARNIA" && (
          <section className="edit_doc__container">
            <span className="edit_doc--title">
              Pobrany VAT ?
            </span>
            <select
              className="edit_doc--select"
              value={rowData.POBRANO_VAT ? rowData.POBRANO_VAT : ""}
              onChange={(e) => {
                handleAddNote(
                  "Pobrany VAT:",
                  e.target.options[e.target.selectedIndex].text
                );
                setRowData((prev) => {
                  return {
                    ...prev,
                    POBRANO_VAT: e.target.value,
                  };
                });
              }}
            >
              <option value="Nie dotyczy">Nie dotyczy</option>
              <option value="TAK">Tak</option>
              <option value="50">Nie pobrano 50%</option>
              <option value="100">Nie pobrano 100%</option>
            </select>
          </section>
        )}

        {(rowData.area === "SAMOCHODY NOWE" ||
          rowData.area === "SAMOCHODY UŻYWANE") && (
            <section className="edit_doc__container">
              <span className="edit_doc--title">
                Data wydania auta:
              </span>
              <span className="edit_doc--content">{rowData.DATA_WYDANIA_AUTA ? rowData.DATA_WYDANIA_AUTA : null}</span>
              {/* <input
              className="edit_doc--select"
              style={
                !rowData.DATA_WYDANIA_AUTA ? { backgroundColor: "yellow" } : null
              }
              type="date"
              value={rowData.DATA_WYDANIA_AUTA ? rowData.DATA_WYDANIA_AUTA : ""}
              onChange={(e) => {
                handleAddNote(
                  "Data wydania auta:",
                  e.target.value.length > 3 ? e.target.value : "Brak"
                );
                setRowData((prev) => {
                  return {
                    ...prev,
                    DATA_WYDANIA_AUTA: e.target.value,
                  };
                });
              }}
            /> */}
            </section>
          )}

        {rowData.area === "BLACHARNIA" && (
          // <section className="edit_doc_actions__container">
          <section className="edit_doc__container">
            <span className="edit_doc--title">
              Wybierz kancelarię TU:
            </span>

            <select
              className="edit_doc--select"
              value={rowData.JAKA_KANCELARIA_TU ? rowData.JAKA_KANCELARIA_TU : "BRAK"}
              onChange={(e) => {
                handleAddNote(
                  "Wybierz kancelarię:",
                  e.target.options[e.target.selectedIndex].text
                );
                setRowData((prev) => {
                  return {
                    ...prev,
                    JAKA_KANCELARIA_TU: e.target.value ? e.target.value : null,
                  };
                });
              }}
            >
              <option value="">BRAK</option>
              <option value="KANCELARIA KROTOSKI">KANCELARIA KROTOSKI</option>
              <option value="KRAUZE">KRAUZE</option>
              <option value="POSTEPOWANIE SANACYJNE">
                POSTĘPOWANIE SANACYJNE
              </option>
              <option value="ROK-KONOPA">ROK-KONOPA</option>
              <option value="CNP">CNP</option>
            </select>
          </section>
        )}

        {/* <section className="edit_doc__container">
        <span className="edit_doc--title">
          Ostateczna data rozliczenia:
        </span>
        <input
          className="edit_doc--select"
          style={
            !rowData.OSTATECZNA_DATA_ROZLICZENIA ? { backgroundColor: "yellow" } : null
          }
          type="date"
          value={rowData.OSTATECZNA_DATA_ROZLICZENIA ? rowData.OSTATECZNA_DATA_ROZLICZENIA : ""}
          onChange={(e) => {
            handleAddNote(
              "Ostateczna data rozliczenia:",
              e.target.value.length > 3 ? e.target.value : "Brak"
            );
            setRowData((prev) => {
              return {
                ...prev,
                OSTATECZNA_DATA_ROZLICZENIA: e.target.value,
              };
            });
          }}
        />
      </section> */}


        <section className="edit_doc__container">
          <span className="edit_doc--title">
            Wyróżnij kontrahenta:
          </span>
          <input
            className="edit_doc--select"
            style={{
              transform: "scale(0.7)",
            }}
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

        <section className="edit_doc--button">
          <Button variant="outlined" onClick={() => setChangePanel({ type: 'management' })}>
            Dane dla Zarządu
          </Button>
          {rowData.area === "BLACHARNIA" && (<Button variant="outlined" onClick={() => setChangePanel({ type: 'becared' })}>
            BeCared
          </Button>
          )}
        </section>
      </section>
      <EditDocSettlements settlement={rowData.OPIS_ROZRACHUNKU} date={rowData?.DATA_ROZL_AS ? rowData.DATA_ROZL_AS : null} />
    </section>
  );
};

export default EditDocActions;
