import { useRef, useState, useEffect } from "react";
import "./EditDocSettlements.css";

const EditDocSettlements = ({ settlement, date, fv_zal, fv_zal_kwota }) => {

  const textareaRef = useRef(null);

  const [settlementData, setSettlementData] = useState(settlement || []);

  // Funkcja przewijająca do dołu
  const scrollToBottom = () => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom(); // Przewiń na dół po pierwszym renderze lub zmianie `rowData.UWAGI_ASYSTENT`
  }, [settlement]);

  useEffect(() => {
    if (fv_zal) {
      const newData = `${fv_zal} - ${fv_zal_kwota.toLocaleString("pl-PL", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
      })}`;
      setSettlementData(prevData => [newData, ...(settlement || prevData || [])]);
    }
  }, [fv_zal, fv_zal_kwota]);


  return (
    // <section className="edit-doc-settlements">
    <section className="edit-doc-settlements">
      <span className="edit-doc-settlements--title">Opisy rozrachunków</span>
      {<section className="edit_doc__container">
        <span className="edit_doc--title">Data rozliczenia autostacja:</span>
        <span className="edit_doc--content">{date || "brak danych"}</span>
      </section>}
      <textarea
        ref={textareaRef}
        className="edit-doc-settlements--content"
        readOnly
        value={settlementData ? settlementData.join("\n") : ""}
      ></textarea>
    </section>
  );
};

export default EditDocSettlements;
