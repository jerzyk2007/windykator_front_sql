// import { useState } from "react";
// import InfoDesk from "./InfoDesk";
// import LogsEvent from "./LogsEvent";
// import "./LogAndChat.css";

// // const LogAndChat = ({ rowData, note, setNote, handleAddNote, type }) => {
// const LogAndChat = ({
//   kanalKomunikacji,
//   dziennikZmian,
//   handleAddNote,
//   context,
// }) => {
//   const [panel, setPanel] = useState("chat");
//   const [note, setNote] = useState("");

//   const handleAcceptNote = (info, text) => {
//     handleAddNote(info, text, context);
//     setNote("");
//   };

//   return (
//     <section className="edit_row_table_pro">
//       <select
//         className="log_and_chat--select"
//         style={
//           panel === "chat"
//             ? context === "controlBL"
//               ? { backgroundColor: "rgba(255, 140, 94, 1)" }
//               : { backgroundColor: "rgb(166, 255, 131)" }
//             : panel === "logi"
//             ? context === "controlBL"
//               ? { backgroundColor: "rgba(126, 236, 255, 1)" }
//               : { backgroundColor: "rgba(253, 255, 126, 1)" }
//             : null
//         }
//         value={panel ?? ""}
//         onChange={(e) => {
//           setPanel(e.target.value);
//         }}
//       >
//         <option value="chat">{`Panel Komunikacji ${
//           context === "controlBL" ? "- kontrola dokumentacji" : ""
//         }`}</option>
//         <option value="logi">{`Dziennik zmian ${
//           context === "controlBL" ? "- kontrola dokumentacji" : ""
//         }`}</option>
//       </select>
//       {panel === "chat" && (
//         <InfoDesk
//           chatData={kanalKomunikacji}
//           note={note}
//           setNote={setNote}
//           handleAcceptNote={handleAcceptNote}
//           context={context}
//         />
//       )}
//       {panel === "logi" && (
//         <LogsEvent logsData={dziennikZmian} context={context} />
//       )}
//     </section>
//   );
// };
// export default LogAndChat;

import { useState } from "react";
import InfoDesk from "./InfoDesk";
import LogsEvent from "./LogsEvent";

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

  return (
    <section className="ertp-data-section">
      <select
        className="ertp-input-select ertp-log-chat-select"
        style={
          panel === "chat"
            ? context === "controlBL"
              ? { backgroundColor: "rgba(255, 226, 129, 1)" }
              : { backgroundColor: "rgb(166, 255, 131)" }
            : panel === "logi"
            ? context === "controlBL"
              ? { backgroundColor: "rgba(158, 240, 255, 1)" }
              : { backgroundColor: "rgba(253, 255, 126, 1)" }
            : null
        }
        value={panel ?? ""}
        onChange={(e) => setPanel(e.target.value)}
      >
        <option value="chat">{`Panel Komunikacji ${
          context === "controlBL" ? "- kontrola dokumentacji" : ""
        }`}</option>
        <option value="logi">{`Dziennik zmian ${
          context === "controlBL" ? "- kontrola dokumentacji" : ""
        }`}</option>
      </select>

      {panel === "chat" && (
        <InfoDesk
          chatData={kanalKomunikacji}
          note={note}
          setNote={setNote}
          handleAcceptNote={handleAcceptNote}
          context={context}
        />
      )}
      {panel === "logi" && (
        <LogsEvent logsData={dziennikZmian} context={context} />
      )}
    </section>
  );
};
export default LogAndChat;
