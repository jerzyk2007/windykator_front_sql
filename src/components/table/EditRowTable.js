import { useState, useEffect } from "react";
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
import { RxDoubleArrowRight, RxDoubleArrowLeft } from "react-icons/rx";
import "./EditRowTable.css";

const EditRowTable = ({ dataRowTable, setDataRowTable, updateDocuments, roles, nextDoc }) => {

  const { auth } = useData();
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [rowData, setRowData] = useState([]);
  const [changePanel, setChangePanel] = useState('doc-actions');
  const [toggleState, setToggleState] = useState(1);
  const [note, setNote] = useState("");

  //zmienna do tworzenia histori decyzji dla zarządu wykorzystywane później w raporcie
  const [managementDescription, setManagementDescription] = useState({
    INFORMACJA_ZARZAD: [],
    HISTORIA_ZMIANY_DATY_ROZLICZENIA: [],
  });

  const [nextPrevDoc, SetNextPrevDoc] = useState({
    prev: null,
    next: null,
  });

  // dane dla kontroli dokumentacji obszaru Blacharnia
  const [documentControlBL, setDocumentControlBL] = useState({
    upowaznienie: false,
    oswiadczenieVAT: false,
    prawoJazdy: false,
    dowodRejestr: false,
    polisaAC: false,
    decyzja: false,
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

  const handleSaveData = async (type) => {
    const { id_document, NUMER_FV, FIRMA } = rowData;
    try {
      await axiosPrivateIntercept.patch(
        `/documents/change-single-document`,
        {
          id_document,
          documentItem: rowData,
        }

      );

      if (roles.includes(120)) {
        await axiosPrivateIntercept.patch(
          `/documents/change-control-chat`,
          {
            NUMER_FV,
            chat: controlChat.chat,
          });

        if (rowData.AREA === 'BLACHARNIA') {
          await axiosPrivateIntercept.patch(
            `/documents/change-document-control`,
            {
              NUMER_FV,
              documentControlBL
            }
          );
        }
      }

      if (managementDescription.INFORMACJA_ZARZAD.length || managementDescription.HISTORIA_ZMIANY_DATY_ROZLICZENIA.length) {
        console.log(FIRMA);
        await axiosPrivateIntercept.post(
          `/fk/add-decision-date-fk`,
          {
            NUMER_FV,
            data: managementDescription,
            FIRMA
          }
        );
      }


      setManagementDescription({
        INFORMACJA_ZARZAD: [],
        HISTORIA_ZMIANY_DATY_ROZLICZENIA: [],
      });
      await updateDocuments(changeSingleDoc(rowData));

      if (type !== "no_exit") {
        setDataRowTable("");
      }

    } catch (err) {
      console.error(err);
    }
  };

  const getDocControl = async () => {
    const dataChatControl = await axiosPrivateIntercept.get(
      `/documents/get-control-document/${encodeURIComponent(rowData.NUMER_FV)}`,
    );
    setControlChat(prev => {
      return {
        ...prev,
        chat: dataChatControl?.data?.CONTROL_UWAGI ? dataChatControl.data.CONTROL_UWAGI : []
      };
    });
    if (rowData.AREA === 'BLACHARNIA') {
      setDocumentControlBL({
        upowaznienie: dataChatControl?.data?.CONTROL_UPOW ? dataChatControl.data.CONTROL_UPOW : false,
        oswiadczenieVAT: dataChatControl?.data?.CONTROL_OSW_VAT ? dataChatControl.data.CONTROL_OSW_VAT : false,
        prawoJazdy: dataChatControl?.data?.CONTROL_PR_JAZ ? dataChatControl.data.CONTROL_PR_JAZ : false,
        dowodRejestr: dataChatControl?.data?.CONTROL_DOW_REJ ? dataChatControl.data.CONTROL_DOW_REJ : false,
        polisaAC: dataChatControl?.data?.CONTROL_POLISA ? dataChatControl.data.CONTROL_POLISA : false,
        decyzja: dataChatControl?.data?.CONTROL_DECYZJA ? dataChatControl.data.CONTROL_DECYZJA : false,
        faktura: dataChatControl?.data?.CONTROL_FV ? dataChatControl.data.CONTROL_FV : false,
        odpowiedzialnosc: dataChatControl?.data?.CONTROL_UPOW ? dataChatControl.data.CONTROL_UPOW : false,
        platnoscVAT: dataChatControl?.data?.CONTROL_PLATNOSC_VAT ? dataChatControl.data.CONTROL_PLATNOSC_VAT : false,
      });
    }
  };

  const checkNextDoc = async (type) => {
    await handleSaveData('no_exit');

    if (type === "prev") {
      const response = await axiosPrivateIntercept.get(
        `/documents/get-single-document/${nextPrevDoc.prev}`
      );
      setRowData(response.data);
    }
    if (type === "next") {
      const response = await axiosPrivateIntercept.get(
        `/documents/get-single-document/${nextPrevDoc.next}`
      );
      setRowData(response.data);
    }
  };

  const changeMarkDoc = async (NUMER_FV, MARK_FK, FIRMA) => {
    try {
      await axiosPrivateIntercept.patch(
        `/fk/change-mark-document`,
        {
          NUMER_FV,
          MARK_FK,
          FIRMA
        }
      );
      setRowData(prev => {
        return {
          ...prev,
          MARK_FK: prev.MARK_FK === 1 ? 0 : 1
        };
      });
    }
    catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const index = nextDoc.indexOf(rowData.id_document);
    SetNextPrevDoc({
      prev: nextDoc[index - 1] ? nextDoc[index - 1] : null,
      next: nextDoc[index + 1] ? nextDoc[index + 1] : null,
    });

  }, [rowData.NUMER_FV]);

  useEffect(() => {
    if (roles.includes(120)) {
      getDocControl();
    }
  }, [rowData.id_document]);

  useEffect(() => {
    setRowData(dataRowTable);
  }, []);

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
                      {(auth.roles.includes(110) || auth.roles.includes(120)) && rowData.MARK_FV && rowData.MARK_FK ? (< Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setChangePanel('management')}
                      >
                        Raport FK
                      </Button>) : null}
                      {rowData.AREA === 'BLACHARNIA' && < Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setChangePanel('becared')}
                      >
                        Becared
                      </Button>}
                    </section>
                  }
                  {changePanel !== 'doc-actions' &&
                    <section className="edit-row-table__change-panel">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setChangePanel('doc-actions')}
                      >
                        Powrót
                      </Button>
                    </section>
                  }
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
                    managementDescription={managementDescription}
                    setManagementDescription={setManagementDescription}
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
            <section className="edit_row_table-buttons">

              <RxDoubleArrowLeft
                className={nextPrevDoc.prev ? `edit_row_table-icon_buttons` : `edit_row_table-icon_buttons--disable`}
                onClick={() => nextPrevDoc.prev && checkNextDoc("prev")}
              />
              <RxDoubleArrowRight
                className={nextPrevDoc.next ? `edit_row_table-icon_buttons` : `edit_row_table-icon_buttons--disable`}
                onClick={() => nextPrevDoc.next && checkNextDoc("next")}

              />

            </section>
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
                onClick={() => handleSaveData()}
              >
                Zatwierdź
              </Button>

            </section>
            <section className="edit_row_table-buttons">
              {auth.roles.includes(200) && rowData.MARK_FV && <Button
                variant="contained"
                color={rowData.MARK_FK ? "secondary" : "error"}
                onClick={() => changeMarkDoc(rowData.NUMER_FV, rowData.MARK_FK === 1 ? 0 : 1, rowData.FIRMA)}
              >
                {rowData.MARK_FK ? "FK ON" : "FK OFF"}
              </Button>}
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
