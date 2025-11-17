import { useRef, useEffect, useState } from "react";
import HistoryDateSettlement from "./HistoryDateSettlement";
import { Button } from "@mui/material";
import "./EditDataManagement.css";

const EditDataManagement = ({
  rowData,
  setRowData,
  usersurname,
  managementDescription,
  setManagementDescription,
}) => {
  const textareaRef = useRef(null);
  const [managementNote, setManagementNote] = useState("");
  // Tymczasowa data
  const [tempDate, setTempDate] = useState(
    rowData.OSTATECZNA_DATA_ROZLICZENIA || ""
  ); //
  const [isFirstRender, setIsFirstRender] = useState(true); // Czy to pierwsze uruchomienie?

  const maxDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 45);
    return date.toISOString().split("T")[0];
  })();

  const scrollToBottom = () => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  };

  const handleAddManagementNote = (text) => {
    const oldNote = rowData.INFORMACJA_ZARZAD;
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    let newNote = [];
    let addNote = `${formattedDate} - ${usersurname} - ${text}`;
    if (oldNote) {
      newNote = [...oldNote, addNote];
    } else {
      newNote = [addNote];
    }

    setRowData((prev) => {
      return {
        ...prev,
        INFORMACJA_ZARZAD: newNote,
      };
    });

    setManagementDescription((prev) => ({
      ...prev,
      INFORMACJA_ZARZAD: [...(prev.INFORMACJA_ZARZAD || []), addNote],
    }));

    setManagementNote("");
  };

  const handleDateHistoryNote = (info, text) => {
    const oldNote = rowData.HISTORIA_ZMIANY_DATY_ROZLICZENIA;
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    let newNote = [];
    let addNote = `${formattedDate} - ${usersurname} - ${info} ${text}`;
    if (oldNote) {
      newNote = [...oldNote, addNote];
    } else {
      newNote = [addNote];
    }
    setRowData((prev) => {
      return {
        ...prev,
        HISTORIA_ZMIANY_DATY_ROZLICZENIA: newNote ? newNote : null,
      };
    });

    setManagementDescription((prev) => ({
      ...prev,
      HISTORIA_ZMIANY_DATY_ROZLICZENIA: [
        ...(prev.HISTORIA_ZMIANY_DATY_ROZLICZENIA || []),
        addNote,
      ],
    }));
  };

  const handleSaveDate = () => {
    // Zapisujemy datę, w tym "Brak", jeśli jest pusta
    handleDateHistoryNote("Ostateczna data rozliczenia:", tempDate || "Brak");

    setRowData((prev) => ({
      ...prev,
      OSTATECZNA_DATA_ROZLICZENIA: tempDate, // Aktualizacja w głównych danych
    }));

    setIsFirstRender(false); // Odblokuj przycisk po pierwszym zapisie
  };

  const handleDateChange = (e) => {
    setTempDate(e.target.value); // Aktualizujemy tymczasową datę
    if (isFirstRender) setIsFirstRender(false); // Wyłącz tryb "pierwszego uruchomienia" przy dowolnej zmianie
  };

  useEffect(() => {
    scrollToBottom(); // Przewiń na dół po pierwszym renderze lub zmianie `rowData.INFORMACJA_ZARZAD`
  }, [rowData.INFORMACJA_ZARZAD]);

  useEffect(() => {
    setTempDate(rowData.OSTATECZNA_DATA_ROZLICZENIA || "");
    setIsFirstRender(true);
  }, [rowData]);

  return (
    // <section className="edit_doc edit_doc_actions">
    <section className="edit_data_management">
      <HistoryDateSettlement
        setRowData={setRowData}
        dateSettlement={rowData.OSTATECZNA_DATA_ROZLICZENIA}
        dateHistory={rowData.HISTORIA_ZMIANY_DATY_ROZLICZENIA}
      />

      <section className="edit_doc__container">
        <span className="edit_doc--title">Ostateczna data rozl.:</span>
        <input
          className="edit_doc--select"
          style={
            !rowData.OSTATECZNA_DATA_ROZLICZENIA
              ? { backgroundColor: "yellow" }
              : null
          }
          type="date"
          max={maxDate}
          value={tempDate || " "}
          onChange={handleDateChange} // Obsługa zmiany daty
        />
        <Button
          variant="contained"
          onClick={handleSaveDate} // Zapisujemy datę
          disabled={
            isFirstRender || // Zablokowane przy pierwszym uruchomieniu
            tempDate === rowData.OSTATECZNA_DATA_ROZLICZENIA // Zablokowane, jeśli brak zmian
          }
        >
          Zapisz
        </Button>
      </section>

      <section className="edit-doc-chat edit_data_management-chat">
        <span className="edit-doc-chat--title edit_data_management--title">
          Informacja do przekazania dla Zarządu
        </span>

        <textarea
          ref={textareaRef}
          className="edit-doc-chat--content edit_data_management--content"
          readOnly
          value={
            Array.isArray(rowData.INFORMACJA_ZARZAD)
              ? rowData.INFORMACJA_ZARZAD.join("\n")
              : ""
          }
        ></textarea>
        <textarea
          className="edit-doc-chat--edit"
          placeholder="dodaj informacje"
          value={managementNote}
          onChange={(e) => setManagementNote(e.target.value)}
        />
        <section className="edit-doc-chat__panel">
          <Button
            disabled={!managementNote}
            variant="contained"
            color="error"
            onClick={() => setManagementNote("")}
          >
            Usuń
          </Button>
          <Button
            variant="contained"
            onClick={() => handleAddManagementNote(managementNote, "")}
            disabled={!managementNote}
          >
            Dodaj
          </Button>
        </section>
      </section>
    </section>
  );
};

export default EditDataManagement;
