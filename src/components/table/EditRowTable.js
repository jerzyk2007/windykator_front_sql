import { useState } from "react";
import useData from "../hooks/useData";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import EditDocBasicData from "./EditDocBasicData";
import EditDocChat from "./EditDocChat";
// import EditDocSettlements from "./EditDocSettlements";
import EditDocActions from "./EditDocActions";
import EditDocBeCared from "./EditDocBeCared";
import EditDataManagement from "./EditDataManagement";
import DocumentsControlBL from './DocumentsControlBL';
import DocumentsControlChat from './DocumentsControlChat';
import { changeSingleDoc } from './utilsForTable/changeSingleDocument';
import "./EditRowTable.css";

const EditRowTable = ({ dataRowTable, setDataRowTable, updateDocuments }) => {
  const { auth } = useData();
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [rowData, setRowData] = useState(dataRowTable);
  const [changePanel, setChangePanel] = useState('doc-actions');
  const [note, setNote] = useState("");
  const [managementNote, setManagementNote] = useState("");
  const [toggleState, setToggleState] = useState(1);
  const [documentControlBL, setDocumentControlBL] = useState({
    upowaznienie: false,
    oswiadczenieVAT: false,
    prawoJazdy: false,
    dowodRejestr: false,
    polisaAC: false,
    faktura: false,
    odpowiedzialnosc: false,
    platnoscVAT: false,
  });
  const [documentControlNote, setDocumentControlNote] = useState("");
  const [documentControlChat, setDocumentControlChat] = useState([]);

  const handleAddNote = (info, text) => {
    const oldNote = rowData.UWAGI_ASYSTENT;
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    let newNote = [];
    let addNote = `${formattedDate} - ${auth.usersurname} - ${info} ${text}`;
    if (oldNote) {
      newNote = [...oldNote, addNote];
    } else {
      newNote = [addNote];
    }

    setRowData((prev) => {
      return {
        ...prev,
        UWAGI_ASYSTENT: newNote,
      };
    });
    if (!text) {
      setNote("");
    }
  };

  const handleAddManagementNote = (text) => {
    const oldNote = rowData.INFORMACJA_ZARZAD;
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    let newNote = [];
    let addNote = `${formattedDate} - ${auth.usersurname} - ${text}`;
    if (oldNote) {
      newNote = [...oldNote, addNote];
    } else {
      newNote = [addNote];
    }

    setRowData((prev) => {
      return {
        ...prev,
        INFORMACJA_ZARZAD: newNote,
      };
    });
    setManagementNote("");
  };

  const handleAddDocumentsControlNote = (text) => {
    // const oldNote = documentControlChat;
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    let newNote = [];
    let addNote = `${formattedDate} - ${auth.usersurname} - ${text}`;
    if (documentControlChat.length) {
      newNote = [...documentControlChat, addNote];
    } else {
      newNote = [addNote];
    }

    setDocumentControlChat(newNote);
    setDocumentControlNote("");
  };

  const handleDateHistoryNote = (info, text) => {
    const oldNote = rowData.HISTORIA_ZMIANY_DATY_ROZLICZENIA;
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    let newNote = [];
    let addNote = `${formattedDate} - ${auth.usersurname} - ${info} ${text}`;
    if (oldNote) {
      newNote = [...oldNote, addNote];
    } else {
      newNote = [addNote];
    }
    setRowData((prev) => {
      return {
        ...prev,
        HISTORIA_ZMIANY_DATY_ROZLICZENIA: newNote ? newNote : null,
      };
    });
  };

  // const toggleTab = (index) => {
  //   setToggleState(index);
  // };

  const handleSaveData = async () => {
    const { id_document } = rowData;

    try {
      await axiosPrivateIntercept.patch(
        `/documents/change-single-document/${auth.id_user}`,
        {
          id_document,
          documentItem: rowData,
        }
      );


      updateDocuments(changeSingleDoc(rowData));
      setDataRowTable("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="edit-row-table">
      <section className="edit-row-table-wrapper">
        <section className="edit-row-table__container">
          <section className="content-tabs">
            <section
              className={
                toggleState === 1 ? "content  active-content" : "content"
              }
            >
              <section className="edit-row-table_section-content">
                <section className="edit-row-table_section-content-data">
                  <EditDocBasicData rowData={rowData} setRowData={setRowData} />
                </section>
                <section className="edit-row-table_section-content-data">
                  <EditDocChat
                    rowData={rowData}
                    setRowData={setRowData}
                    note={note}
                    setNote={setNote}
                    handleAddNote={handleAddNote}
                  />

                </section>
                <section className="edit-row-table_section-content-data">
                  {changePanel === 'doc-actions' &&
                    <section className="edit-row-table__change-panel">
                      {auth.roles.includes(110) && <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setChangePanel('management')}

                      >
                        Raport FK
                      </Button>}
                      {rowData.AREA === 'BLACHARNIA' && < Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setChangePanel('becared')}
                      >
                        Becared
                      </Button>}


                    </section>}
                  {changePanel !== 'doc-actions' &&
                    <section className="edit-row-table__change-panel">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setChangePanel('doc-actions')}
                      >
                        Powrót
                      </Button>
                    </section>}

                  {changePanel === 'doc-actions' && (
                    <EditDocActions
                      rowData={rowData}
                      setRowData={setRowData}
                      setChangePanel={setChangePanel}
                      handleAddNote={handleAddNote}
                      roles={auth.roles}
                    />
                  )}
                  {changePanel === 'becared' && (
                    <EditDocBeCared
                      rowData={rowData}
                      setRowData={setRowData}
                    />
                  )}
                  {changePanel === 'management' && <EditDataManagement
                    rowData={rowData}
                    setRowData={setRowData}
                    setChangePanel={setChangePanel}
                    handleDateHistoryNote={handleDateHistoryNote}
                    managementNote={managementNote}
                    setManagementNote={setManagementNote}
                    handleAddManagementNote={handleAddManagementNote}
                  />}

                </section>
              </section>
            </section>
            <section
              className={
                toggleState === 2 ? "content  active-content" : "content"
              }
            >
              <section className="edit-row-table_section-content">
                <section className="edit-row-table_section-content-data">
                  <EditDocBasicData rowData={rowData} setRowData={setRowData} />
                </section>
                <section className="edit-row-table_section-content-data">
                  <DocumentsControlChat
                    documentControlNote={documentControlNote}
                    setDocumentControlNote={setDocumentControlNote}
                    documentControlChat={documentControlChat}
                    // setDocumentControlChat={setDocumentControlChat}
                    handleAddDocumentsControlNote={handleAddDocumentsControlNote}
                  />
                </section>
                <section className="edit-row-table_section-content-data">
                  {auth.roles.includes(120) && dataRowTable.AREA === "BLACHARNIA" &&
                    <DocumentsControlBL
                      documentControlBL={documentControlBL}
                      setDocumentControlBL={setDocumentControlBL}
                    />}
                </section>
              </section>
            </section>
            <section
              className={
                toggleState === 3 ? "content  active-content" : "content"
              }
            >
              <section className="edit-row-table_section-content">
                <section className="section-data"></section>
                <section className="section-data"></section>
                <section className="section-data"></section>
              </section>
            </section>
          </section>
          <section className="edit-row-table__panel">
            <section className="edit_row_table-buttons"></section>

            <section className="edit_row_table-buttons">
              <Button
                className="mui-button"
                variant="contained"
                size="large"
                color="error"
                onClick={() => setDataRowTable("")}
              >
                Anuluj
              </Button>
              <Button
                className="mui-button"
                variant="contained"
                size="large"
                color="success"
                onClick={handleSaveData}
              >
                Zatwierdź
              </Button>
            </section>
            <section className="edit_row_table-buttons">
              {auth.roles.includes(120) && <Button
                variant="contained"
                // color="secondary"
                onClick={() => setToggleState(prev => prev === 1 ? 2 : 1)}
              >
                Kontrola
              </Button>}
            </section>

          </section>
        </section>
      </section>
    </section >
  );
};

export default EditRowTable;
