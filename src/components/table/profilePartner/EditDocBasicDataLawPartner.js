import "./EditDocBasicDataLawPartner.css";

const EditDocBasicDataLawPartner = ({ rowData }) => {
  // console.log(rowData);
  const itemsSettlements = (rowData?.WYKAZ_SPLACONEJ_KWOTY_FK ?? [])
    .map((item, index) => {
      return (
        <section
          key={index}
          className="law_partner_basic_data_settlements_container"
        >
          <span>{item.data}</span>
          <span>{item.symbol}</span>
          <span>
            {item?.kwota
              ? item.kwota.toLocaleString("pl-PL", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })
              : "brak"}
          </span>
        </section>
      );
    })
    .filter(Boolean);

  return (
    <section className="edit_doc edit_doc_basic-data law_partner_basic-data">
      <section className="edit_doc__container">
        <span className="edit_doc--title">Data przekazania:</span>
        <span className="edit_doc--content">
          {rowData.DATA_PRZEKAZANIA_SPRAWY}
        </span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Data przyjęcia sprawy:</span>
        <span className="edit_doc--content">
          {rowData.DATA_PRZYJECIA_SPRAWY}
        </span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Faktura:</span>
        <span className="edit_doc--content">{rowData.NUMER_DOKUMENTU}</span>
      </section>
      {rowData?.OPIS_DOKUMENTU && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">Opis dokumentu:</span>
          <span className="edit_doc--content_law_partner">
            {rowData.OPIS_DOKUMENTU}
          </span>
        </section>
      )}

      <section className="edit_doc__container">
        <span className="edit_doc--title">Data wystawienia dok.</span>
        <span className="edit_doc--content">
          {rowData.DATA_WYSTAWIENIA_DOKUMENTU}
        </span>
      </section>

      <section className="edit_doc__container">
        <span className="edit_doc--title">Kwota brutto dok.</span>
        <span className="edit_doc--content">
          {rowData?.KWOTA_BRUTTO_DOKUMENTU
            ? rowData.KWOTA_BRUTTO_DOKUMENTU.toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })
            : ""}
        </span>
      </section>

      <section className="edit_doc__container">
        <span className="edit_doc--title">Kwota roszczenia:</span>
        <span
          className="edit_doc--content"
          style={{ backgroundColor: "rgba(252, 255, 206, 1)" }}
        >
          {rowData.KWOTA_ROSZCZENIA_DO_KANCELARII
            ? rowData.KWOTA_ROSZCZENIA_DO_KANCELARII.toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })
            : "0,00"}
        </span>
      </section>

      <section className="edit_doc__container">
        <span className="edit_doc--title">Kontrahent:</span>
        <span
          className="edit_doc--content_law_partner"
          style={
            rowData?.KONTRAHENT?.length > 160
              ? { overflowY: "auto", maxHeight: "100px" }
              : null
          }
        >
          {rowData?.KONTRAHENT}
        </span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">NIP:</span>
        <span className="edit_doc--content">{rowData?.NIP}</span>
      </section>

      <section className="edit_doc__container">
        <span className="edit_doc--title">Oddział:</span>
        <span className="edit_doc--content content_law_partner--content">
          <span className="edit_doc--content">
            {rowData?.ODDZIAL?.LOKALIZACJA}
          </span>
          <span className="edit_doc--content">
            {`${rowData?.ODDZIAL?.DZIAL} ${rowData?.ODDZIAL?.OBSZAR}`}
          </span>
        </span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Pozostała należność FK:</span>
        <span className="edit_doc--content">
          {rowData?.POZOSTALA_NALEZNOSC_FK
            ? rowData.POZOSTALA_NALEZNOSC_FK.toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })
            : "Brak danych"}
        </span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Suma spłaconej kwoty FK:</span>
        <span className="edit_doc--content">
          {rowData?.SUMA_SPLACONEJ_KWOTY_FK
            ? rowData.SUMA_SPLACONEJ_KWOTY_FK.toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })
            : "Brak danych"}
        </span>
      </section>
      <section className="edit_doc__container">
        <section className="law_partner_basic_data_settlements">
          <span className="law_partner_basic_data_settlements--title">
            Wykaz spłaconych kwot
          </span>
          {itemsSettlements.length ? (
            itemsSettlements
          ) : (
            <span style={{ textAlign: "center", color: "red" }}>
              Brak wpłat
            </span>
          )}
        </section>
      </section>
    </section>
  );
};

export default EditDocBasicDataLawPartner;
