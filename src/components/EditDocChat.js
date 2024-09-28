import { useState } from "react";
import useData from "./hooks/useData";
import { Button } from "@mui/material";
import "./EditDocChat.css";

const EditDocChat = ({ rowData, setRowData }) => {
  const { auth } = useData();
  const [note, setNote] = useState("");

  const handleAddNote = () => {
    const oldNote = rowData.UWAGI_ASYSTENT;
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    let newNote = [];
    let addNote = `${formattedDate} - ${auth.usersurname} - ${note}`;
    if (oldNote) {
      newNote = [...oldNote, addNote];
    } else {
      newNote = [addNote];
    }

    setRowData((prev) => {
      return {
        ...prev,
        UWAGI_ASYSTENT: newNote,
      };
    });
    setNote("");
  };
  return (
    <section className="edit-doc-chat">
      <span className="edit-doc-chat--title">
        Działanie podjęte przez {rowData.DZIAL}
      </span>

      <textarea
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
          onClick={handleAddNote}
          disabled={!note ? true : false}
        >
          Dodaj
        </Button>
      </section>
    </section>
  );
};

export default EditDocChat;
