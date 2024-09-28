import "./EditDocBasicData.css";

const EditDocBasicData = ({ rowData, setRowData }) => {
  return (
    <section className="edit_doc_basic-data">
      {/* <section className="edit_doc_basic-data__container"> */}
      <section className="edit_doc_basic-data--document">
        <span className="edit_doc_basic-data--title">Faktura:</span>
        <span className="edit_doc_basic-data--content">{rowData.NUMER_FV}</span>
      </section>
      <section className="edit_doc_basic-data--document">
        <span className="edit_doc_basic-data--title">Data wystawienia:</span>
        <span className="edit_doc_basic-data--content">{rowData.DATA_FV}</span>
      </section>
      <section className="edit_doc_basic-data--document">
        <span className="edit_doc_basic-data--title">Termin płatności:</span>
        <span className="edit_doc_basic-data--content">{rowData.TERMIN}</span>
      </section>
      <section className="edit_doc_basic-data--document">
        <span className="edit_doc_basic-data--title">Po terminie:</span>
        <span
          className="edit_doc_basic-data--content"
          style={
            rowData.ILE_DNI_PO_TERMINIE > 0
              ? { backgroundColor: "rgba(240, 69, 69, .7)" }
              : null
          }
        >
          {rowData.ILE_DNI_PO_TERMINIE}
        </span>
      </section>
      <section className="edit_doc_basic-data--document">
        <span className="edit_doc_basic-data--title">
          Wprowadź kwotę brutto:
        </span>
        {/* <span className="edit_doc_basic-data--content">
          {rowData.BRUTTO.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </span> */}
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
                  (Number(e.target.value) - Number(e.target.value / 1.23)) / 2,
              };
            })
          }
        />
      </section>
      <section className="edit_doc_basic-data--document">
        <span className="edit_doc_basic-data--title">Brutto:</span>
        <span className="edit_doc_basic-data--content">
          {rowData.BRUTTO.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </span>
      </section>
      <section className="edit_doc_basic-data--document">
        <span className="edit_doc_basic-data--title">Netto:</span>
        <span className="edit_doc_basic-data--content">
          {rowData.NETTO.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </span>
      </section>
      <section className="edit_doc_basic-data--document">
        <span className="edit_doc_basic-data--title">Netto + 50% VAT:</span>
        <span className="edit_doc_basic-data--content">
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
      <section className="edit_doc_basic-data--document">
        <span className="edit_doc_basic-data--title">100% VAT:</span>
        <span
          className="edit_doc_basic-data--content"
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
      <section className="edit_doc_basic-data--document">
        <span className="edit_doc_basic-data--title">50% VAT:</span>
        <span
          className="edit_doc_basic-data--content"
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
      <section className="edit_doc_basic-data--document">
        <span className="edit_doc_basic-data--title">Do rozliczenia:</span>
        <span
          className="edit_doc_basic-data--content"
          style={{ backgroundColor: "rgba(248, 255, 152, .6)" }}
        >
          {rowData.DO_ROZLICZENIA.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </span>
      </section>
      <section className="edit_doc_basic-data--document">
        <span className="edit_doc_basic-data--title">Nr szkody:</span>
        <span className="edit_doc_basic-data--content">
          {rowData.NR_SZKODY}
        </span>
      </section>
      <section className="edit_doc_basic-data--document">
        <span className="edit_doc_basic-data--title">Nr rejestracyjny:</span>
        <span className="edit_doc_basic-data--content">
          {rowData.NR_REJESTRACYJNY}
        </span>
      </section>
      <section className="edit_doc_basic-data--document">
        <span className="edit_doc_basic-data--title">Doradca:</span>
        <span className="edit_doc_basic-data--content">{rowData.DORADCA}</span>
      </section>
      <section className="edit_doc_basic-data--document">
        <span className="edit_doc_basic-data--title">Kontrahent:</span>
        <span
          className="edit_doc_basic-data--content"
          style={
            rowData?.KONTRAHENT?.length > 35 ? { overflowY: "scroll" } : null
          }
        >
          {rowData.KONTRAHENT}
        </span>
      </section>
      <section className="edit_doc_basic-data--document">
        <span className="edit_doc_basic-data--title">Uwagi z faktury:</span>
        <span
          className="edit_doc_basic-data--content"
          style={
            rowData?.UWAGI_Z_FAKTURY?.length > 35
              ? { overflowY: "scroll" }
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
