import { useRef, useEffect } from "react";
import useCopyTooltip from "../../hooks/useCopyTooltip";
import NotesList from "../utilsForTable/NotesList";
import TooltipPortal from "../utilsForTable/TooltipPortal";

const LogsEvent = ({ logsData = [] }) => {
  const notesRef = useRef(null);

  const {
    tooltip,
    clickedIndex,
    handleCopyClick,
    handleMouseEnter,
    handleMouseLeave,
  } = useCopyTooltip();

  useEffect(() => {
    if (notesRef.current) {
      setTimeout(() => {
        notesRef.current.scrollTop = notesRef.current.scrollHeight;
      }, 0);
    }
  }, [logsData]);

  return (
    <>
      <section className="ertp-data-section">
        <div
          className="ertp-notes-display ertp-notes-display--logs"
          ref={notesRef}
        >
          <NotesList
            data={logsData}
            clickedIndex={clickedIndex}
            handleCopyClick={handleCopyClick}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            preWrap
          />
        </div>
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

export default LogsEvent;
