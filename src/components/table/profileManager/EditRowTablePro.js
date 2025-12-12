import { useState, useEffect } from "react";
import useData from "../../hooks/useData";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import { RxDoubleArrowRight, RxDoubleArrowLeft } from "react-icons/rx";
import EditBasicDataPro from "./EditBasicDataPro";
import EditActionsDataPro from "./EditActionsDataPro";
import AcceptCasePanel from "./AcceptCasePanel";
import LogAndChat from "../profileInsider/LogAndChat";
import { changeSingleDocLawPartner } from "../utilsForTable/changeSingleDocument";
import "./EditRowTablePro.css";

const EditRowTablePro = ({
  dataRowTable,
  setDataRowTable,
  updateDocuments,
  removeDocuments,
  nextDoc,
  getSingleRow,
  clearRowTable,
  profile,
}) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();
  const [rowData, setRowData] = useState([]);
  const [note, setNote] = useState("");
  const [nextPrevDoc, SetNextPrevDoc] = useState({
    prev: null,
    next: null,
  });

  // stan nowych wpisów dla chat i logów
  const [chatLog, setChatLog] = useState({
    KANAL_KOMUNIKACJI: [],
    DZIENNIK_ZMIAN: [],
  });
  const [toggleState, setToggleState] = useState(1);

  const handleSaveData = async (type = "exit") => {
    const { id_document } = rowData;
    try {
      const basePath = {
        insider: "/documents",
        partner: "/law-partner",
        insurance: "/insurance",
      };

      await axiosPrivateIntercept.patch(
        `${basePath[profile]}/change-single-document`,
        { id_document, document: rowData, chatLog }
      );

      await updateDocuments(changeSingleDocLawPartner(rowData));

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
    const oldChat =
      type === "chat"
        ? [...(rowData.KANAL_KOMUNIKACJI ?? [])]
        : type === "log"
        ? [...(rowData.DZIENNIK_ZMIAN ?? [])]
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
      chat: "KANAL_KOMUNIKACJI",
      log: "DZIENNIK_ZMIAN",
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

  const profileComponentSecond = () => {
    if (profile === "partner") {
      if (rowData?.DATA_PRZYJECIA_SPRAWY) {
        return (
          <LogAndChat
            rowData={rowData}
            note={note}
            setNote={setNote}
            handleAddNote={handleAddNote}
          />
        );
      } else if (rowData?.id_document && !rowData?.DATA_PRZYJECIA_SPRAWY) {
        return (
          <section className="edit-row-table_section-content-data">
            <AcceptCasePanel
              rowData={rowData}
              updateDocuments={updateDocuments}
              removeDocuments={removeDocuments}
              setDataRowTable={setDataRowTable}
              clearRowTable={clearRowTable}
            />
          </section>
        );
      }
    } else if (profile === "insurance") {
      return (
        <LogAndChat
          rowData={rowData}
          note={note}
          setNote={setNote}
          handleAddNote={handleAddNote}
        />
      );
    } else {
      return (
        <section className="edit-row-table_section-content-data"></section>
      );
    }
  };
  const profileCompnentThird = () => {
    if (profile === "partner" && rowData?.DATA_PRZYJECIA_SPRAWY) {
      return (
        <section className="edit-row-table_section-content-data">
          <EditActionsDataPro
            rowData={rowData}
            setRowData={setRowData}
            handleAddNote={handleAddNote}
            profile={profile}
            roles={auth.roles || []}
          />
        </section>
      );
    } else if (profile === "insurance") {
      return (
        <section className="edit-row-table_section-content-data">
          <EditActionsDataPro
            rowData={rowData}
            setRowData={setRowData}
            handleAddNote={handleAddNote}
            profile={profile}
            roles={auth.roles || []}
          />
        </section>
      );
    } else
      return (
        <section className="edit-row-table_section-content-data"></section>
      );
  };

  const isButtonDisabled = (() => {
    if (profile === "partner") {
      return !rowData?.DATA_PRZYJECIA_SPRAWY;
    }

    if (profile === "insurance") {
      return false;
    }

    // domyślnie
    return true;
  })();

  useEffect(() => {
    const index = nextDoc.indexOf(rowData.id_document);
    SetNextPrevDoc({
      prev: nextDoc[index - 1] ? nextDoc[index - 1] : null,
      next: nextDoc[index + 1] ? nextDoc[index + 1] : null,
    });
  }, [rowData]);

  useEffect(() => {
    setRowData(dataRowTable?.singleDoc ? dataRowTable.singleDoc : {});
  }, [dataRowTable]);

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
              <EditBasicDataPro rowData={rowData} profile={profile} />
            </section>
            {profileComponentSecond()}
            {profileCompnentThird()}
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
            disabled={isButtonDisabled}
            onClick={() => handleSaveData()}
          >
            Zatwierdź
          </Button>
        </section>
        <section className="edit_row_table-buttons"></section>
      </section>
    </section>
  );
};
export default EditRowTablePro;
