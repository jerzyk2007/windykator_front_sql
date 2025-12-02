import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "./LogsEvent.css";

const LogsEvent = ({ logsData = [] }) => {
  const [clickedIndex, setClickedIndex] = useState(null);
  const notesRef = useRef(null); //  Referencja do kontenera z notatkami

  // Stan tooltipa
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: "",
    position: "top",
  });

  //  Efekt przewijania w dół

  const handleCopyClick = (userlogin, index) => {
    if (userlogin) {
      navigator.clipboard.writeText(userlogin);
      setClickedIndex(index);
      setTimeout(() => setClickedIndex(null), 300);
    }
  };

  const handleMouseEnter = (e, userlogin) => {
    if (!userlogin) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const spaceAbove = rect.top;

    const showBelow = spaceAbove < 150;

    setTooltip({
      visible: true,
      x: rect.left,
      y: showBelow ? rect.bottom : rect.top,
      content: userlogin,
      position: showBelow ? "bottom" : "top",
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const notesItem = logsData?.map((item, index) => {
    return (
      <section className="info_desk__container" key={index}>
        <span>{item.date}</span>
        <span>{" - "}</span>
        <span
          className={`info_desk--username ${
            clickedIndex === index ? "clicked" : ""
          }`}
          style={
            item.profile === "Pracownik"
              ? { color: "rgba(42, 4, 207, 1)" }
              : item.profile === "Kancelaria"
              ? { color: "rgba(255, 14, 203, 1)" }
              : null
          }
          onClick={() => handleCopyClick(item.userlogin, index)}
          onMouseEnter={(e) => handleMouseEnter(e, item.userlogin)}
          onMouseLeave={handleMouseLeave}
        >
          {item.username}
        </span>
        <span>{" - "}</span>
        <span>{item.note}</span>
      </section>
    );
  });

  useEffect(() => {
    if (notesRef.current) {
      // Poczekaj aż elementy zostaną wyrenderowane
      setTimeout(() => {
        notesRef.current.scrollTop = notesRef.current.scrollHeight;
      }, 0);
    }
  }, [logsData]);

  return (
    <>
      <section className="chat_log_event">
        {/*  Przypięcie refa do elementu */}
        <div className="chat_log_event--notes" ref={notesRef}>
          {notesItem}
        </div>
      </section>

      {tooltip.visible &&
        createPortal(
          <div
            className={`portal-tooltip ${tooltip.position}`}
            style={{
              top: tooltip.y,
              left: tooltip.x,
            }}
          >
            {tooltip.content}
          </div>,
          document.body
        )}
    </>
  );
};

export default LogsEvent;
