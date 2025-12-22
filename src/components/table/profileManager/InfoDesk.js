import { useRef, useEffect } from "react";
import { Button } from "@mui/material";
import useCopyTooltip from "../../hooks/useCopyTooltip";
import NotesList from "../utilsForTable/NotesList";
import TooltipPortal from "../utilsForTable/TooltipPortal";
import "./InfoDesk.css";

const InfoDesk = ({ chatData = [], note, setNote, handleAcceptNote }) => {
  const notesRef = useRef(null); //  Referencja do kontenera z notatkami

  const {
    tooltip,
    clickedIndex,
    handleCopyClick,
    handleMouseEnter,
    handleMouseLeave,
  } = useCopyTooltip();

  useEffect(() => {
    if (notesRef.current) {
      notesRef.current.scrollTop = notesRef.current.scrollHeight;
    }
  }, [chatData]);

  return (
    <>
      <section className="info_desk">
        <div className="info_desk--notes" ref={notesRef}>
          <NotesList
            data={chatData}
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
            disabled={!note ? true : false}
            variant="contained"
            color="error"
            onClick={() => setNote("")}
          >
            Usuń
          </Button>
          <Button
            variant="contained"
            onClick={() => handleAcceptNote(note, "chat")}
            disabled={!note ? true : false}
          >
            Dodaj
          </Button>
        </section>
      </section>

      <TooltipPortal
        visible={tooltip.visible}
        x={tooltip.x}
        y={tooltip.y}
        content={tooltip.content}
        position={tooltip.position}
      />
    </>
  );
};

export default InfoDesk;
