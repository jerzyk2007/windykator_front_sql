import { useState, useRef, useEffect } from "react";
import useData from "./hooks/useData";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import "./QuickTableNote.css";

const QuickTableNote = ({
  quickNote,
  setQuickNote,
  documents,
  setDocuments,
}) => {
  const noteRef = useRef();

  const { auth } = useData();
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [note, setNote] = useState("");

  const handleAddNote = async () => {
    const { _id, UWAGI_ASYSTENT } = quickNote;
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    let newNote = [];
    let addNote = `${formattedDate} - ${auth.usersurname} - ${note}`;
    if (UWAGI_ASYSTENT) {
      newNote = [...UWAGI_ASYSTENT, addNote];
    } else {
      newNote = [addNote];
    }

    const newRow = { ...quickNote, UWAGI_ASYSTENT: newNote };
    const newDocuments = documents.map((item) => {
      if (item._id === _id) {
        return newRow;
      } else {
        return item;
      }
    });

    try {
      await axiosPrivateIntercept.patch(
        `/documents/change-single-document/${auth._id}`,
        {
          _id: quickNote._id,
          documentItem: newRow,
        }
      );
      setDocuments(newDocuments);
      setQuickNote("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    noteRef.current.focus();
  }, []);

  return (
    <section className="quick_table_note">
      <section className="quick_table_note__container">
        <section className="quick_table_note__container-title">
          <span className="quick_table_note__container-title--document">
            Faktura:{" "}
          </span>
          <span className="quick_table_note__container-title--document">
            {quickNote.NUMER_FV}
          </span>
        </section>

        <textarea
          className="quick_table_note__container-edit"
          name=""
          id=""
          cols="15"
          rows="6"
          value={
            quickNote.UWAGI_ASYSTENT ? quickNote.UWAGI_ASYSTENT.join("\n") : ""
          }
          readOnly
        ></textarea>

        <textarea
          className="quick_table_note__container-edit"
          ref={noteRef}
          name=""
          id=""
          cols="15"
          rows="3"
          placeholder="Dodaj"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>

        <section className="quick_table_note__container-button">
          <Button
            variant="contained"
            onClick={() => setQuickNote("")}
            size="small"
            color="error"
          >
            Anuluj
          </Button>

          <Button variant="contained" onClick={handleAddNote} size="small">
            Zapisz
          </Button>
        </section>
      </section>
    </section>
  );
};

export default QuickTableNote;
