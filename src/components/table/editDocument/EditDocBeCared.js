export const EditDocBeCared = ({ rowData }) => {
  return (
    <section className="ertp-data-section">
      <section className="ertp-data-row">
        <span
          className="ertp-data-row__label ertp-data-row__label--read-only"
          style={{ flexBasis: "45%" }}
        >
          Nr sprawy BeCared:
        </span>
        <span className="ertp-data-row__value">
          {rowData.NUMER_SPRAWY_BECARED}
        </span>
      </section>

      <section className="ertp-data-row">
        <span
          className="ertp-data-row__label ertp-data-row__label--read-only"
          style={{ flexBasis: "45%" }}
        >
          Data komentarza BeCared:
        </span>
        <span className="ertp-data-row__value">
          {rowData.DATA_KOMENTARZA_BECARED}
        </span>
      </section>

      <section className="ertp-data-row">
        <span
          className="ertp-data-row__label ertp-data-row__label--read-only"
          style={{ flexBasis: "45%" }}
        >
          Status sprawy kancelaria:
        </span>
        <span
          className={
            rowData?.STATUS_SPRAWY_KANCELARIA?.length > 35
              ? "ertp-data-row__value ertp-data-row__value--scrollable"
              : "ertp-data-row__value"
          }
        >
          {rowData.STATUS_SPRAWY_KANCELARIA}
        </span>
      </section>

      <section className="ertp-data-row">
        <span
          className="ertp-data-row__label ertp-data-row__label--read-only"
          style={{ flexBasis: "45%" }}
        >
          Status sprawy windykacja:
        </span>
        <span
          className={
            rowData?.STATUS_SPRAWY_WINDYKACJA?.length > 35
              ? "ertp-data-row__value ertp-data-row__value--scrollable"
              : "ertp-data-row__value"
          }
        >
          {rowData.STATUS_SPRAWY_WINDYKACJA}
        </span>
      </section>

      <section className="ertp-data-row">
        <span
          className="ertp-data-row__label ertp-data-row__label--read-only"
          style={{ flexBasis: "45%" }}
        >
          Komentarz kancelaria BeCared:
        </span>
        <span
          className={
            rowData?.KOMENTARZ_KANCELARIA_BECARED?.length > 35
              ? "ertp-data-row__value ertp-data-row__value--scrollable"
              : "ertp-data-row__value"
          }
          style={
            rowData?.KOMENTARZ_KANCELARIA_BECARED?.length > 35
              ? { overflowY: "scroll" }
              : null
          }
        >
          {rowData.KOMENTARZ_KANCELARIA_BECARED}
        </span>
      </section>

      <section className="ertp-data-row">
        <span
          className="ertp-data-row__label ertp-data-row__label--read-only"
          style={{ flexBasis: "45%" }}
        >
          Kwota windykowana BeCared:
        </span>
        <span className="ertp-data-row__value">
          {rowData.KWOTA_WINDYKOWANA_BECARED !== 0 &&
          rowData.KWOTA_WINDYKOWANA_BECARED
            ? rowData.KWOTA_WINDYKOWANA_BECARED.toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })
            : ""}
        </span>
      </section>
    </section>
  );
};

export default EditDocBeCared;
