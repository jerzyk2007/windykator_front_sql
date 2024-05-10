import { Button } from "@mui/material";

import "./EditDocBeCared.css";

export const EditDocBeCared = ({ rowData, setBeCared }) => {
  return (
    <section className="edit_doc_becared-section-data">
      <section className="edit_doc_becared-section-data-becared">
        <span className="edit_doc_becared-section-data-becared--title">
          Nr sprawy BeCared:
        </span>
        <span className="edit_doc_becared-section-data-becared--content">
          {rowData.NUMER_SPRAWY_BECARED}
        </span>
      </section>
      <section className="edit_doc_becared-section-data-becared">
        <span className="edit_doc_becared-section-data-becared--title">
          Data komentarza BeCared:
        </span>
        <span className="edit_doc_becared-section-data-becared--content">
          {rowData.DATA_KOMENTARZA_BECARED}
        </span>
      </section>
      <section className="edit_doc_becared-section-data-becared">
        <span className="edit_doc_becared-section-data-becared--title">
          Status sprawy kancelaria:
        </span>
        <span className="edit_doc_becared-section-data-becared--content">
          {rowData.STATUS_SPRAWY_KANCELARIA}
        </span>
      </section>
      <section className="edit_doc_becared-section-data-becared">
        <span className="edit_doc_becared-section-data-becared--title">
          Status sprawy windykacja:
        </span>
        <span className="edit_doc_becared-section-data-becared--content">
          {rowData.STATUS_SPRAWY_WINDYKACJA}
        </span>
      </section>
      <section className="edit_doc_becared-section-data-becared">
        <span className="edit_doc_becared-section-data-becared--title">
          Komentarz kancelaria BeCared:
        </span>
        <span className="edit_doc_becared-section-data-becared--content">
          {rowData.KOMENTARZ_KANCELARIA_BECARED}
        </span>
      </section>
      <section className="edit_doc_becared-section-data-becared">
        <span className="edit_doc_becared-section-data-becared--title">
          Kwota windykowana BeCared:
        </span>
        <span className="edit_doc_becared-section-data-becared--content">
          {rowData.KWOTA_WINDYKOWANA_BECARED !== 0
            ? rowData.KWOTA_WINDYKOWANA_BECARED.toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })
            : ""}
        </span>
      </section>

      <section className="edit_doc_becared-section-data-becared--button">
        <Button variant="outlined" onClick={() => setBeCared(false)}>
          Działania
        </Button>
      </section>
    </section>
  );
};

export default EditDocBeCared;
