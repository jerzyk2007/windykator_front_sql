import { useRef, useEffect } from "react";
import { Button } from "@mui/material";
import "./EditDocChat.css";

const EditDocChat = ({ rowData, note, setNote, handleAddNote }) => {
  const textareaRef = useRef(null);

  // Funkcja przewijająca do dołu
  const scrollToBottom = () => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  };

  // Przewijanie na dół po załadowaniu komponentu lub zmianie `rowData.UWAGI_ASYSTENT`
  useEffect(() => {
    scrollToBottom(); // Przewiń na dół po pierwszym renderze lub zmianie `rowData.UWAGI_ASYSTENT`
  }, [rowData.UWAGI_ASYSTENT]); // Wywołaj useEffect przy zmianie `rowData.UWAGI_ASYSTENT`

  return (
    <section className="edit-doc-chat">
      <span className="edit-doc-chat--title">
        Działanie podjęte przez {rowData.DZIAL}
      </span>

      <textarea
        ref={textareaRef}
        className="edit-doc-chat--content"
        readOnly
        value={rowData.UWAGI_ASYSTENT ? rowData.UWAGI_ASYSTENT.join("\n") : ""}
      ></textarea>
      <textarea
        className="edit-doc-chat--edit"
        placeholder="dodaj informacje"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <section className="edit-doc-chat__panel">
        <Button
          disabled={!note ? true : false}
          variant="contained"
          color="error"
          onClick={() => setNote("")}
        >
          Usuń
        </Button>
        <Button
          variant="contained"
          onClick={() => handleAddNote(note, "")}
          disabled={!note ? true : false}
        >
          Dodaj
        </Button>
      </section>
    </section>
  );
};

export default EditDocChat;
