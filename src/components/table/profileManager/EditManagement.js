import { useRef, useState, useEffect } from "react";
import useCopyTooltip from "../../hooks/useCopyTooltip";
import NotesList from "../utilsForTable/NotesList";
import TooltipPortal from "../utilsForTable/TooltipPortal";
import { Button } from "@mui/material";

const EditManagement = ({
  setRowData,
  ostatecznaDataRozliczenia,
  historiaZmianyDatyRozliczenia,
  informacjaZarzad,
  handleAddNote,
  context,
}) => {
  const [note, setNote] = useState("");
  const [tempDate, setTempDate] = useState("");
  const [isFirstRender, setIsFirstRender] = useState(true);

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

  const scrollToBottom = (ref) => {
    if (ref?.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  const maxDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 45);
    return date.toISOString().split("T")[0];
  })();

  const handleSaveDate = () => {
    handleAcceptNote(`Ostateczna data rozliczenia: ${tempDate}`, "log");
    setRowData((prev) => ({
      ...prev,
      OSTATECZNA_DATA_ROZLICZENIA: tempDate,
    }));
    setIsFirstRender(false);
  };

  const handleDateChange = (e) => {
    setTempDate(e.target.value);
    if (isFirstRender) setIsFirstRender(false);
  };

  useEffect(() => {
    scrollToBottom(historiaRef);
  }, [historiaZmianyDatyRozliczenia]);
  useEffect(() => {
    scrollToBottom(zarzadRef);
  }, [informacjaZarzad]);
  useEffect(() => {
    setTempDate(ostatecznaDataRozliczenia);
  }, [ostatecznaDataRozliczenia]);
  useEffect(() => {
    scrollToBottom(zarzadRef);
  }, [note]);

  return (
    <section className="ertp-management-wrapper">
      {/* SEKCJA DATY */}
      <section className="ertp-management-sub ertp-management-sub--date">
        <span className="ertp__header">
          Historia zmiany daty ostatecznego rozliczenia
        </span>
        <div className="ertp-notes-display" ref={historiaRef}>
          <NotesList
            data={historiaZmianyDatyRozliczenia}
            clickedIndex={clickedIndex}
            handleCopyClick={handleCopyClick}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            preWrap
          />
        </div>
        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Ostateczna data rozl.:</span>
          <div className="ertp-input-wrapper" style={{ gap: "10px" }}>
            <input
              className="ertp-input-date"
              style={
                !ostatecznaDataRozliczenia
                  ? { backgroundColor: "yellow" }
                  : null
              }
              type="date"
              max={maxDate}
              value={tempDate ?? ""}
              onChange={handleDateChange}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleSaveDate}
              disabled={isFirstRender || tempDate === ostatecznaDataRozliczenia}
            >
              Zapisz
            </Button>
          </div>
        </section>
      </section>

      {/* SEKCJA NOTATEK DLA ZARZĄDU */}
      <section className="ertp-management-sub ertp-management-sub--note">
        <span className="ertp__header">
          Informacja do przekazania dla Zarządu
        </span>
        <div className="ertp-notes-display" ref={zarzadRef}>
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
          className="ertp-textarea ertp-management__textarea"
          placeholder="dodaj informacje"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <section className="ertp-management__btn-panel">
          <Button
            disabled={!note}
            variant="contained"
            color="error"
            size="small"
            onClick={() => setNote("")}
          >
            Usuń
          </Button>
          <Button
            variant="contained"
            size="small"
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
