import { useRef, useEffect } from "react";
import "./EditDocSettlements.css";

const EditDocSettlements = ({ settlement, date }) => {
  const textareaRef = useRef(null);
  // Funkcja przewijająca do dołu
  const scrollToBottom = () => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom(); // Przewiń na dół po pierwszym renderze lub zmianie `rowData.UWAGI_ASYSTENT`
  }, [settlement]);

  return (
    // <section className="edit-doc-settlements">
    <section className="edit-doc-settlements">
      <span className="edit-doc-settlements--title">Opisy rozrachunków</span>
      {date && <section className="edit_doc__container">
        <span className="edit_doc--title">Data rozliczenia autostacja:</span>
        <span className="edit_doc--content">{date}</span>
      </section>}
      <textarea
        ref={textareaRef}
        className="edit-doc-settlements--content"
        readOnly
        value={settlement ? settlement.join("\n") : ""}
      ></textarea>
    </section>
  );
};

export default EditDocSettlements;
