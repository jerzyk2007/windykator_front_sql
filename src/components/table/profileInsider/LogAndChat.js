import { useState } from "react";
import InfoDesk from "../profileManager/InfoDesk";
import LogsEvent from "../profileManager/LogsEvent";

const LogAndChat = ({ rowData, note, setNote, handleAddNote }) => {
  const [panel, setPanel] = useState("chat");

  //styl dla panelu informacji i logów do zmiany koloru daty i użytkownika
  const spanInfoStyle = (profile, info = "name") => {
    const dateColor = "rgba(47, 173, 74, 1)";
    return profile === "Pracownik"
      ? {
          color: info === "name" ? "rgba(42, 4, 207, 1)" : dateColor,
          fontWeight: "bold",
        }
      : profile === "Kancelaria"
      ? {
          color: info === "name" ? "rgba(192, 112, 8, 1)" : dateColor,
          fontWeight: "bold",
        }
      : {
          color: info === "name" ? "rgba(255, 14, 203, 1)" : dateColor,
          fontWeight: "bold",
        };
  };
  return (
    <section className="edit-row-table_section-content-data edit-row-table-law-partner_section-content-data">
      <select
        className="edit-row-table-law-partner--select"
        style={
          panel === "chat"
            ? { backgroundColor: "rgb(166, 255, 131)" }
            : panel === "logi"
            ? { backgroundColor: "rgba(253, 255, 126, 1)" }
            : null
        }
        value={panel}
        onChange={(e) => {
          setPanel(e.target.value);
        }}
      >
        <option value="chat">Panel Komunikacji</option>
        <option value="logi">Dziennik zmian</option>
      </select>
      {panel === "chat" && (
        <InfoDesk
          chatData={rowData.KANAL_KOMUNIKACJI}
          note={note}
          setNote={setNote}
          handleAddNote={handleAddNote}
          spanInfoStyle={spanInfoStyle}
        />
      )}
      {panel === "logi" && (
        <LogsEvent
          logsData={rowData.DZIENNIK_ZMIAN}
          spanInfoStyle={spanInfoStyle}
        />
      )}
    </section>
  );
};
export default LogAndChat;
