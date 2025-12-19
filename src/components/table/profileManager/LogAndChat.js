import { useState } from "react";
import InfoDesk from "./InfoDesk";
import LogsEvent from "./LogsEvent";
import "./LogAndChat.css";

// const LogAndChat = ({ rowData, note, setNote, handleAddNote, type }) => {
const LogAndChat = ({
  kanalKomunikacji,
  dziennikZmian,
  handleAddNote,
  context,
}) => {
  const [panel, setPanel] = useState("chat");
  const [note, setNote] = useState("");

  const handleAcceptNote = (info, text) => {
    handleAddNote(info, text, context);
    setNote("");
  };

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
    <section className="edit_row_table_pro">
      <select
        className="log_and_chat--select"
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
          chatData={kanalKomunikacji}
          note={note}
          setNote={setNote}
          handleAcceptNote={handleAcceptNote}
          spanInfoStyle={spanInfoStyle}
          context={context}
        />
      )}
      {panel === "logi" && (
        <LogsEvent
          logsData={dziennikZmian}
          spanInfoStyle={spanInfoStyle}
          context={context}
        />
      )}
    </section>
  );
};
export default LogAndChat;
