import { useRef, useState, useEffect } from "react";
import useCopyTooltip from "../../hooks/useCopyTooltip";
import NotesList from "../utilsForTable/NotesList";
import TooltipPortal from "../utilsForTable/TooltipPortal";
import { Button } from "@mui/material";

import "./EditManagement.css";
import { maxHeight } from "@mui/system";

const EditManagement = ({
  setRowData,
  ostatecznaDataRozliczenia,
  historiaZmianyDatyRozliczenia,
  informacjaZarzad,
  handleAddNote,
  context,
}) => {
  const [note, setNote] = useState("");
  const [tempDate, setTempDate] = useState(""); //
  const [isFirstRender, setIsFirstRender] = useState(true); // Czy to pierwsze uruchomienie?
  // osobne refy dla każdej listy
  const historiaRef = useRef(null);
  const zarzadRef = useRef(null);

  const {
    tooltip,
    clickedIndex,
    handleCopyClick,
    handleMouseEnter,
    handleMouseLeave,
  } = useCopyTooltip();

  const handleAcceptNote = (info, text) => {
    handleAddNote(info, text, context);
    setNote("");
  };

  // funkcja do przewijania refu na dół
  const scrollToBottom = (ref) => {
    if (ref?.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  // max data jaką może wprowadzić user dzisiejsza + 45
  const maxDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 45);
    return date.toISOString().split("T")[0];
  })();

  const handleSaveDate = () => {
    handleAcceptNote(`Ostateczna data rozliczenia: ${tempDate}`, "log");
    setRowData((prev) => {
      return {
        ...prev,
        OSTATECZNA_DATA_ROZLICZENIA: tempDate,
      };
    });
    setIsFirstRender(false); // Odblokuj przycisk po pierwszym zapisie
  };

  const handleDateChange = (e) => {
    setTempDate(e.target.value); // Aktualizujemy tymczasową datę
    if (isFirstRender) setIsFirstRender(false); // Wyłącz tryb "pierwszego uruchomienia" przy dowolnej zmianie
  };

  // efekt dla historii zmiany daty
  useEffect(() => {
    scrollToBottom(historiaRef);
  }, [historiaZmianyDatyRozliczenia]);

  // efekt dla informacji dla zarządu
  useEffect(() => {
    scrollToBottom(zarzadRef);
  }, [informacjaZarzad]);

  useEffect(() => {
    setTempDate(ostatecznaDataRozliczenia);
  }, [ostatecznaDataRozliczenia]);

  // efekt dla przewijania po każdym wpisaniu notatki
  useEffect(() => {
    scrollToBottom(zarzadRef);
  }, [note]);

  return (
    <section className="edit_management">
      <section className="edit_management-date">
        <span className="edit_management--title">
          Historia zmiany daty ostatecznego rozliczenia
        </span>
        <div className="info_desk--notes" ref={historiaRef}>
          <NotesList
            data={historiaZmianyDatyRozliczenia}
            clickedIndex={clickedIndex}
            handleCopyClick={handleCopyClick}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            preWrap
          />
        </div>
        <section className="edit_doc__container">
          <span className="edit_doc--title">Ostateczna data rozl.:</span>
          <input
            className="edit_doc--select"
            style={
              !ostatecznaDataRozliczenia ? { backgroundColor: "yellow" } : null
            }
            type="date"
            max={maxDate}
            value={tempDate ?? ""}
            onChange={handleDateChange} // Obsługa zmiany daty
          />
          <Button
            variant="contained"
            onClick={handleSaveDate} // Zapisujemy datę
            disabled={
              isFirstRender || // Zablokowane przy pierwszym uruchomieniu
              tempDate === ostatecznaDataRozliczenia // Zablokowane, jeśli brak zmian
            }
          >
            Zapisz
          </Button>
        </section>
      </section>

      <section className="edit_management-note">
        <span className="edit_management--title">
          Informacja do przekazania dla Zarządu
        </span>
        <div className="info_desk--notes" ref={zarzadRef}>
          <NotesList
            data={informacjaZarzad}
            clickedIndex={clickedIndex}
            handleCopyClick={handleCopyClick}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            preWrap
          />
        </div>
        <textarea
          className="info_desk--edit"
          placeholder="dodaj informacje"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <section className="info_desk__panel">
          <Button
            disabled={!note}
            variant="contained"
            color="error"
            onClick={() => setNote("")}
          >
            Usuń
          </Button>
          <Button
            variant="contained"
            onClick={() => handleAcceptNote(note, "chat")}
            disabled={!note}
          >
            Dodaj
          </Button>
        </section>
        <TooltipPortal
          visible={tooltip.visible}
          x={tooltip.x}
          y={tooltip.y}
          content={tooltip.content}
          position={tooltip.position}
        />
      </section>
    </section>
  );
};

export default EditManagement;
