import EditDocSettlements from "./EditDocSettlements";
import "./EditDocActions.css";

const EditDocActions = ({ rowData, setRowData, handleAddNote, roles }) => {
  return (
    <section className="edit_doc_actions">
      <section className="edit_doc edit_doc_actions__container">
        <section className="edit_doc__container">
          <span className="edit_doc--title">Jaka kancelaria:</span>
          <span className="edit_doc--content">
            {rowData?.JAKA_KANCELARIA ? rowData.JAKA_KANCELARIA : "BRAK"}
          </span>
        </section>
        <section className="edit_doc__container">
          <span className="edit_doc--title">Status kancelaria:</span>
          <span className="edit_doc--content">
            {rowData?.STATUS_AKTUALNY ? rowData.STATUS_AKTUALNY : "BRAK"}
          </span>
        </section>
        <section className="edit_doc__container">
          <span className="edit_doc--title">Wpis do KRD:</span>
          {roles.includes(150) ? (
            <select
              className="edit_doc--select"
              value={rowData.KRD ? rowData.KRD : "BRAK"}
              onChange={(e) => {
                handleAddNote(
                  "Wpis do KRD:",
                  e.target.options[e.target.selectedIndex].text
                );
                setRowData((prev) => {
                  return {
                    ...prev,
                    KRD: e.target.value ? e.target.value : null,
                  };
                });
              }}
            >
              <option value="">BRAK</option>
              <option value="PRZEKAZANO DO KRD">PRZEKAZANO DO KRD</option>
              <option value="WYCOFANO Z KRD">WYCOFANO Z KRD</option>
            </select>
          ) : (
            <span className="edit_doc--content">
              {rowData.KRD ? rowData.KRD : "BRAK"}
            </span>
          )}
        </section>
        <section className="edit_doc__container">
          <span className="edit_doc--title">Rodzaj działania:</span>
          {roles.includes(110) || roles.includes(120) ? (
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
              <option value="DO DECYZJI KIEROWNIKA">
                DO DECYZJI KIEROWNIKA
              </option>
              <option value="WYSŁANO WEZWANIE DO ZAPŁATY">
                WYSŁANO WEZWANIE DO ZAPŁATY
              </option>
              <option value="GREEN PARTS">GREEN PARTS</option>
              <option value="WINDYKACJA WEWNĘTRZNA">
                WINDYKACJA WEWNĘTRZNA
              </option>
            </select>
          ) : (
            <span className="edit_doc--content">
              {rowData?.DZIALANIA ? rowData.DZIALANIA : "BRAK"}
            </span>
          )}
        </section>

        <section className="edit_doc__container">
          <span className="edit_doc--title">Błąd doradcy:</span>

          {roles.includes(110) || roles.includes(120) ? (
            <select
              className="edit_doc--select"
              value={rowData.BLAD_DORADCY ? rowData.BLAD_DORADCY : "NIE"}
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
              <option value="NIE">NIE</option>
              <option value="TAK">TAK</option>
            </select>
          ) : (
            <span className="edit_doc--content">
              {rowData?.BLAD_DORADCY ? rowData.BLAD_DORADCY : "NIE"}
            </span>
          )}
        </section>

        {rowData.AREA === "BLACHARNIA" && (
          <section className="edit_doc__container">
            <span className="edit_doc--title">Pobrany VAT ?</span>
            {roles.includes(110) || roles.includes(120) ? (
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
            ) : (
              <span className="edit_doc--content">
                {rowData?.POBRANO_VAT ? rowData.POBRANO_VAT : "Nie dotyczy"}
              </span>
            )}
          </section>
        )}

        {(rowData.AREA === "SAMOCHODY NOWE" ||
          rowData.AREA === "SAMOCHODY UŻYWANE") && (
          <section className="edit_doc__container">
            <span className="edit_doc--title">Data wydania auta:</span>
            <span className="edit_doc--content">
              {rowData.DATA_WYDANIA_AUTA ? rowData.DATA_WYDANIA_AUTA : null}
            </span>
          </section>
        )}

        {rowData.AREA === "BLACHARNIA" && (
          <section className="edit_doc__container">
            <span className="edit_doc--title">Wybierz kancelarię TU:</span>

            {roles.includes(110) || roles.includes(120) ? (
              <select
                className="edit_doc--select"
                value={
                  rowData.JAKA_KANCELARIA_TU
                    ? rowData.JAKA_KANCELARIA_TU
                    : "BRAK"
                }
                onChange={(e) => {
                  handleAddNote(
                    "Wybierz kancelarię:",
                    e.target.options[e.target.selectedIndex].text
                  );
                  setRowData((prev) => {
                    return {
                      ...prev,
                      JAKA_KANCELARIA_TU: e.target.value
                        ? e.target.value
                        : null,
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
            ) : (
              <span className="edit_doc--content">
                {rowData?.JAKA_KANCELARIA_TU
                  ? rowData.JAKA_KANCELARIA_TU
                  : "BRAK"}
              </span>
            )}
          </section>
        )}

        <section className="edit_doc__container">
          <span className="edit_doc--title">Wyróżnij kontrahenta:</span>
          {roles.includes(110) || roles.includes(120) ? (
            <input
              className="edit_doc--select"
              style={{
                transform: "scale(0.7)",
              }}
              type="checkbox"
              checked={rowData.ZAZNACZ_KONTRAHENTA === "TAK"}
              onChange={(e) =>
                setRowData((prev) => {
                  const newValue = e.target.checked ? "TAK" : null;
                  return {
                    ...prev,
                    ZAZNACZ_KONTRAHENTA: newValue,
                  };
                })
              }
            />
          ) : (
            <input
              className="edit_doc--select"
              style={{
                transform: "scale(0.7)",
              }}
              type="checkbox"
              checked={rowData.ZAZNACZ_KONTRAHENTA === "TAK"}
              readOnly
            />
          )}
        </section>
      </section>
      {rowData?.FIRMA !== "RAC" && (
        <EditDocSettlements
          settlement={rowData.OPIS_ROZRACHUNKU}
          date={rowData?.DATA_ROZL_AS ? rowData.DATA_ROZL_AS : null}
          fv_zal={rowData.FV_ZALICZKOWA ? rowData.FV_ZALICZKOWA : null}
          fv_zal_kwota={rowData.KWOTA_FV_ZAL ? rowData.KWOTA_FV_ZAL : null}
        />
      )}
    </section>
  );
};

export default EditDocActions;
