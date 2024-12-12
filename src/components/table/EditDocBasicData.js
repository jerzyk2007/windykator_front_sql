import "./EditDocBasicData.css";

const EditDocBasicData = ({ rowData }) => {
  return (
    <section className=" edit_doc edit_doc_basic-data">
      <section className="edit_doc__container">
        <span className="edit_doc--title">Faktura:</span>
        <span className="edit_doc--content">{rowData.NUMER_FV}</span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Data wystawienia:</span>
        <span className="edit_doc--content">{rowData.DATA_FV}</span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Termin płatności:</span>
        <span className="edit_doc--content">{rowData.TERMIN}</span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Po terminie:</span>
        <span
          className="edit_doc--content"
          style={
            rowData.ILE_DNI_PO_TERMINIE > 0
              ? { backgroundColor: "rgba(240, 69, 69, .7)" }
              : null
          }
        >
          {rowData.ILE_DNI_PO_TERMINIE}
        </span>
      </section>

      {/* {rowData.area === "BLACHARNIA" && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">
            Wprowadź kwotę brutto:
          </span>
          <input
            className="edit_doc_basic-data--document--input"
            type="number"
            value={rowData.BRUTTO}
            onChange={(e) =>
              setRowData((prev) => {
                return {
                  ...prev,
                  BRUTTO: Number(e.target.value),
                  NETTO: Number(e.target.value / 1.23),
                  "100_VAT":
                    Number(e.target.value) - Number(e.target.value / 1.23),
                  "50_VAT":
                    (Number(e.target.value) - Number(e.target.value / 1.23)) /
                    2,
                };
              })
            }
          />
        </section>
      )} */}

      <section className="edit_doc__container">
        <span className="edit_doc--title">Brutto:</span>
        <span className="edit_doc--content">
          {rowData.BRUTTO.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Netto:</span>
        <span className="edit_doc--content">
          {rowData.NETTO.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </span>
      </section>
      {rowData.area === "BLACHARNIA" && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">Netto + 50% VAT:</span>
          <span className="edit_doc--content">
            {(
              rowData.NETTO +
              parseFloat(((rowData.BRUTTO - rowData.NETTO) / 2).toFixed(2))
            ).toLocaleString("pl-PL", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              useGrouping: true,
            })}
          </span>
        </section>
      )}

      {rowData.area === "BLACHARNIA" && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">100% VAT:</span>
          <span
            className="edit_doc--content"
            style={{
              backgroundColor:
                Math.abs(
                  rowData.BRUTTO - rowData.NETTO - rowData.DO_ROZLICZENIA
                ) <= 1
                  ? "rgba(240, 69, 69, .7)"
                  : null,
            }}
          >
            {(rowData.BRUTTO - rowData.NETTO).toLocaleString("pl-PL", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              useGrouping: true,
            })}
          </span>
        </section>
      )}

      {rowData.area === "BLACHARNIA" && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">50% VAT:</span>
          <span
            className="edit_doc--content"
            style={{
              backgroundColor:
                Math.abs(
                  (rowData.BRUTTO - rowData.NETTO) / 2 - rowData.DO_ROZLICZENIA
                ) <= 1
                  ? "rgba(240, 69, 69, .7)"
                  : null,
            }}
          >
            {((rowData.BRUTTO - rowData.NETTO) / 2).toLocaleString("pl-PL", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              useGrouping: true,
            })}
          </span>
        </section>
      )}

      <section className="edit_doc__container">
        <span className="edit_doc--title">Do rozliczenia:</span>
        <span
          className="edit_doc--content"
          style={{ backgroundColor: "rgba(248, 255, 152, .6)" }}
        >
          {rowData.DO_ROZLICZENIA ? rowData.DO_ROZLICZENIA.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          }) : "0,00"}
        </span>
      </section>

      {rowData.area === "SERWIS" && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">Typ płatności:</span>
          <span
            className="edit_doc--content"
            style={
              rowData.TYP_PLATNOSCI === "Gotówka"
                ? { backgroundColor: "rgba(240, 69, 69, .7)" }
                : null
            }
          >
            {rowData.TYP_PLATNOSCI}
          </span>
        </section>
      )}

      {rowData.area === "BLACHARNIA" && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">Nr szkody:</span>
          <span className="edit_doc--content">
            {rowData.NR_SZKODY}
          </span>
        </section>
      )}
      {rowData.area !== "BLACHARNIA" && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">Nr autoryzacji:</span>
          <span className="edit_doc--content">
            {rowData.NR_AUTORYZACJI}
          </span>
        </section>
      )}

      {rowData.area !== "CZĘŚCI" && rowData.area !== "SAMOCHODY NOWE" && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">Nr rejestracyjny:</span>
          <span className="edit_doc--content">
            {rowData.NR_REJESTRACYJNY}
          </span>
        </section>
      )}
      {rowData.area !== "CZĘŚCI" && rowData.area !== "BLACHARNIA" && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">Nr VIN:</span>
          <span className="edit_doc--content">{rowData.VIN}</span>
        </section>
      )}

      <section className="edit_doc__container">
        <span className="edit_doc--title">Doradca:</span>
        <span className="edit_doc--content">{rowData.DORADCA}</span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Kontrahent:</span>
        <span
          className={rowData?.KONTRAHENT?.length > 140 ? "edit_doc--content-scroll" : "edit_doc--content"}
          style={
            rowData?.KONTRAHENT?.length > 140 && rowData.area === "BLACHARNIA"
              ? { overflowY: "auto", maxHeight: "80px" }
              : null
          }
        >
          {rowData.KONTRAHENT}
        </span>
      </section>

      {rowData.area !== "BLACHARNIA" && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">NIP:</span>
          <span className="edit_doc--content">{rowData.NIP}</span>
        </section>
      )}

      <section className="edit_doc__container">
        <span className="edit_doc--title">Uwagi z faktury:</span>
        <span
          className={rowData?.UWAGI_Z_FAKTURY?.length > 70 ? "edit_doc--content-scroll" : "edit_doc--content"}
          style={
            rowData?.UWAGI_Z_FAKTURY?.length > 70 &&
              rowData.area === "BLACHARNIA"
              ? { overflowY: "auto", maxHeight: "70px" }
              : null
          }
        >
          {rowData.UWAGI_Z_FAKTURY}
        </span>
      </section>
    </section>
  );
};

export default EditDocBasicData;
