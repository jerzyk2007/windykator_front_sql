import { Button } from "@mui/material";

// import "./EditDocBeCared.css";

export const EditDocBeCared = ({ rowData, setBeCared }) => {
  return (
    // <section className="edit_doc_becared">
    <section className="edit_doc">
      <section className="edit_doc__container">
        <span className="edit_doc--title">
          Nr sprawy BeCared:
        </span>
        <span className="edit_doc--content">
          {rowData.NUMER_SPRAWY_BECARED}
        </span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">
          Data komentarza BeCared:
        </span>
        <span className="edit_doc--content">
          {rowData.DATA_KOMENTARZA_BECARED}
        </span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">
          Status sprawy kancelaria:
        </span>
        <span
          className={rowData?.STATUS_SPRAWY_KANCELARIA?.length > 35 ? "edit_doc--content-scroll" : "edit_doc--content"}
        >
          {rowData.STATUS_SPRAWY_KANCELARIA}
        </span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">
          Status sprawy windykacja:
        </span>
        <span
          className={rowData?.STATUS_SPRAWY_WINDYKACJA?.length > 35 ? "edit_doc--content-scroll" : "edit_doc--content"}
        >
          {rowData.STATUS_SPRAWY_WINDYKACJA}
        </span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">
          Komentarz kancelaria BeCared:
        </span>
        <span
          className={rowData?.KOMENTARZ_KANCELARIA_BECARED?.length > 35 ? "edit_doc--content-scroll" : "edit_doc--content"}
          style={
            rowData?.KOMENTARZ_KANCELARIA_BECARED?.length > 35
              ? { overflowY: "scroll" }
              : null
          }
        >
          {rowData.KOMENTARZ_KANCELARIA_BECARED}
        </span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">
          Kwota windykowana BeCared:
        </span>
        <span className="edit_doc--content">
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

      <section className="edit_doc--button">
        <Button variant="outlined" onClick={() => setBeCared(false)}>
          Działania
        </Button>
      </section>
    </section >
  );
};

export default EditDocBeCared;
