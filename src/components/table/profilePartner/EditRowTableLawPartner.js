import { useState, useEffect } from "react";
import useData from "../../hooks/useData";
import { Button } from "@mui/material";
import { RxDoubleArrowRight, RxDoubleArrowLeft } from "react-icons/rx";
import ChatLawPartner from "./ChatLawPartner";
import LogsEvent from "./LogsEvent";
import EditDocBasicDataLawPartner from "./EditDocBasicDataLawPartner";
import "./EditRowTableLawPartner.css";

const EditRowTableLawPartner = ({
  dataRowTable,
  setDataRowTable,
  updateDocuments,
  nextDoc,
  getSingleRow,
  clearRowTable,
}) => {
  const { auth } = useData();
  const [rowData, setRowData] = useState([]);
  const [note, setNote] = useState("");
  const [nextPrevDoc, SetNextPrevDoc] = useState({
    prev: null,
    next: null,
  });
  // stan zmiany z czat na logi
  const [panel, setPanel] = useState("chat");
  // stan nowych wpisów dla chat i logów
  const [chatLog, setChatLog] = useState({
    CZAT_KANCELARIA: [],
    CZAT_LOGI: [],
  });
  const [toggleState, setToggleState] = useState(1);

  const handleSaveData = async (type = "exit") => {
    const { id_document, NUMER_FV, FIRMA } = rowData;

    try {
      // await updateDocuments(changeSingleDoc(rowData));

      if (type !== "no_exit") {
        setDataRowTable(clearRowTable);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkNextDoc = async (type) => {
    try {
      await handleSaveData("no_exit");
      await getSingleRow(nextPrevDoc[type], "full");
    } catch (error) {
      console.error(error);
    }
  };

  //dodawane są notatki z czatu i logi przy zmianie np błąd doradcy, pobrany VAT
  const handleAddNote = (info, type) => {
    console.log(info);
    console.log(type);
    const oldChat =
      type === "chat"
        ? [...(rowData.CZAT_KANCELARIA ?? [])]
        : type === "logi"
        ? [...(rowData.CZAT_LOGI ?? [])]
        : [];
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    const note = {
      date: formattedDate,
      note: info,
      profile: auth.permissions,
      userlogin: auth.userlogin,
      username: auth.usersurname,
    };
    let newChat = [];

    if (oldChat && oldChat.length) {
      newChat = [...oldChat, note];
    } else {
      newChat = [note];
    }
    const saveInfo = {
      chat: "CZAT_KANCELARIA",
      logi: "CZAT_LOGI",
    };

    setChatLog((prev) => {
      return {
        ...prev,
        [saveInfo[type]]: [...(prev[saveInfo[type]] ?? []), note],
      };
    });

    setRowData((prev) => {
      return {
        ...prev,
        [saveInfo[type]]: newChat,
      };
    });
    setNote("");
  };

  useEffect(() => {
    // console.log(nextDoc);
    // console.log(rowData);

    const index = nextDoc.indexOf(rowData.id_document);
    SetNextPrevDoc({
      prev: nextDoc[index - 1] ? nextDoc[index - 1] : null,
      next: nextDoc[index + 1] ? nextDoc[index + 1] : null,
    });
    // }, [rowData?.NUMER_DOKUMENTU]);
  }, [rowData]);

  useEffect(() => {
    setRowData(dataRowTable?.singleDoc ? dataRowTable.singleDoc : {});
  }, [dataRowTable]);

  useEffect(() => {
    // console.log(rowData);
  }, [rowData]);

  return (
    <section className="edit-row-table-law-partner">
      <section className="edit-row-table-law-partner__container">
        <section
          className={
            toggleState === 1
              ? "edit-row-table__content  edit-row-table__active-content"
              : "edit-row-table__content"
          }
        >
          <section className="edit-row-table_section-content">
            <section className="edit-row-table_section-content-data">
              <EditDocBasicDataLawPartner rowData={rowData} />
            </section>
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
                <ChatLawPartner
                  chatData={rowData.CZAT_KANCELARIA}
                  note={note}
                  setNote={setNote}
                  handleAddNote={handleAddNote}
                />
              )}
              {panel === "logi" && (
                <LogsEvent
                  logsData={[]}
                  note={note}
                  setNote={setNote}
                  handleAddNote={handleAddNote}
                />
              )}
            </section>
            <section
              className="edit-row-table_section-content-data"
              // style={{ backgroundColor: "yellow" }}
            ></section>
          </section>
        </section>
        <section
          className={
            toggleState === 2
              ? "edit-row-table__content  edit-row-table__active-content"
              : "edit-row-table__content"
          }
        >
          <section className="edit-row-table_section-content">
            <section className="edit-row-table_section-content-data"></section>
            <section className="edit-row-table_section-content-data"></section>
            <section className="edit-row-table_section-content-data"></section>
          </section>
        </section>
        <section
          className={
            toggleState === 3
              ? "edit-row-table__content  edit-row-table__active-content"
              : "edit-row-table__content"
          }
        >
          <section className="edit-row-table_section-content">
            <section className="edit-row-table_section-content-data"></section>
            <section className="edit-row-table_section-content-data"></section>
            <section className="edit-row-table_section-content-data"></section>
          </section>
        </section>
      </section>
      <section className="edit-row-table__panel">
        <section className="edit_row_table-buttons">
          <RxDoubleArrowLeft
            className={
              nextPrevDoc.prev
                ? `edit_row_table-icon_buttons`
                : `edit_row_table-icon_buttons--disable`
            }
            onClick={() => nextPrevDoc.prev && checkNextDoc("prev")}
          />
          <RxDoubleArrowRight
            className={
              nextPrevDoc.next
                ? `edit_row_table-icon_buttons`
                : `edit_row_table-icon_buttons--disable`
            }
            onClick={() => nextPrevDoc.next && checkNextDoc("next")}
          />
        </section>
        <section className="edit_row_table-buttons">
          <Button
            className="mui-button"
            variant="contained"
            size="large"
            color="error"
            onClick={() => setDataRowTable(clearRowTable)}
          >
            Anuluj
          </Button>
          <Button
            className="mui-button"
            variant="contained"
            size="large"
            color="success"
            onClick={() => setDataRowTable(clearRowTable)}
            // onClick={() => handleSaveData()}
          >
            Zatwierdź
          </Button>
        </section>
        <section className="edit_row_table-buttons"></section>
      </section>
    </section>
  );
};
export default EditRowTableLawPartner;
