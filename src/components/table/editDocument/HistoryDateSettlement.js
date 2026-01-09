import { useRef, useEffect } from "react";

const HistoryDateSettlement = ({ dateHistory }) => {
  const textareaHistoryRef = useRef(null);

  // Funkcja przewijająca do dołu
  const scrollToBottom = () => {
    if (textareaHistoryRef.current) {
      textareaHistoryRef.current.scrollTop =
        textareaHistoryRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [dateHistory]);

  return (
    <section className="ertp-data-section" style={{ marginBottom: 0 }}>
      {/* Używamy ujednoliconego nagłówka z sekcji management */}
      <span className="ertp-management__header">
        Historia zmiany daty ostatecznego rozliczenia.
      </span>
      <textarea
        ref={textareaHistoryRef}
        className="ertp-textarea ertp-textarea--history"
        readOnly
        value={dateHistory ? dateHistory.join("\n") : ""}
      />
    </section>
  );
};

export default HistoryDateSettlement;
