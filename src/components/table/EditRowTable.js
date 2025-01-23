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
  const [toggleState, setToggleState] = useState(1);
  const [note, setNote] = useState("");

  // dane dla kontroli dokumentacji obszaru Blacharnia
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

  // dane dla DocumentsControlChat
  const [controlChat, setControlChat] = useState({
    note: '',
    chat: []
  });

  //dodawane są notatki z czatu i logi przy zmianie np błąd doradcy, pobrany VAT
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

  // const toggleTab = (index) => {
  //   setToggleState(index);
  // };

  const handleSaveData = async () => {
    const { id_document, NUMER_FV } = rowData;

    try {
      await axiosPrivateIntercept.patch(
        `/documents/change-single-document`,
        {
          id_document,
          documentItem: rowData,
        }

      );


      updateDocuments(changeSingleDoc(rowData));
      setDataRowTable("");

      // await axiosPrivateIntercept.patch(
      //   `/documents/change-control-chat`,
      //   {
      //     NUMER_FV,
      //     chat: controlChat.chat,
      //   });

      // console.log(controlChat.chat);

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
                    usersurname={auth.usersurname}
                    handleAddNote={handleAddNote}
                    note={note}
                    setNote={setNote}
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
                    usersurname={auth.usersurname}
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
                    usersurname={auth.usersurname}
                    controlChat={controlChat}
                    setControlChat={setControlChat}
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
