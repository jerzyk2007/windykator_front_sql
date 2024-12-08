import { useRef, useEffect } from "react";
import './HistoryDateSettlement.css';

const HistoryDateSettlement = ({ dateHistory }) => {
    const textareaHistoryRef = useRef(null);

    // Funkcja przewijająca do dołu
    const scrollToBottom = () => {
        if (textareaHistoryRef.current) {
            textareaHistoryRef.current.scrollTop = textareaHistoryRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom(); // Przewiń na dół po pierwszym renderze lub zmianie `rowData.UWAGI_ASYSTENT`
    }, [dateHistory]);
    return (
        <section className="edit-doc-chat history_date_settlement">
            <span className="edit-doc-chat--title history_date_settlement--title">
                Historia zmiany daty ostatecznego rozliczenia.
            </span>
            <textarea
                ref={textareaHistoryRef}
                className="edit-doc-chat--content history_date_settlement--content"
                readOnly
                value={dateHistory ? dateHistory.join("\n") : ""}
            ></textarea>
        </section>
    );
};

export default HistoryDateSettlement;