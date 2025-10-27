import { useState, useEffect } from "react";
import useData from "../hooks/useData";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import EditDocBasicData from "./EditDocBasicData";
import EditDocChat from "./EditDocChat";
import EditDocActions from "./EditDocActions";
import EditDocBeCared from "./EditDocBeCared";
import EditDataManagement from "./EditDataManagement";
import DocumentsControlBL from "./DocumentsControlBL";
import DocumentsControlChat from "./DocumentsControlChat";
import { changeSingleDoc } from "./utilsForTable/changeSingleDocument";
import { RxDoubleArrowRight, RxDoubleArrowLeft } from "react-icons/rx";

import "./EditRowTable.css";

const EditRowTable = ({
  dataRowTable,
  setDataRowTable,
  updateDocuments,
  roles,
  nextDoc,
  getSingleRow,
}) => {
  const { auth } = useData();
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [rowData, setRowData] = useState([]);
  const [changePanel, setChangePanel] = useState("doc-actions");
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
    zmianyOstatniaKontrola: false,
  });

  // dane dla DocumentsControlChat
  const [controlChat, setControlChat] = useState({
    note: "",
    chat: [],
  });

  // zmienna dla zmiany DZIALu przez Blacharnie
  const [changeDepartment, setChangeDepartment] = useState({
    oldDep: "",
    newDep: "",
    optionsDep: [],
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

  const handleSaveData = async (type = "exit") => {
    const { id_document, NUMER_FV, FIRMA } = rowData;

    try {
      await axiosPrivateIntercept.patch(`/documents/change-single-document`, {
        id_document,
        documentItem: rowData,
        changeDeps: changeDepartment?.newDep ? changeDepartment.newDep : null,
      });

      if (roles.includes(120)) {
        await axiosPrivateIntercept.patch(`/documents/change-control-chat`, {
          NUMER_FV,
          chat: controlChat.chat,
          FIRMA,
        });

        if (rowData.AREA === "BLACHARNIA") {
          await axiosPrivateIntercept.patch(
            `/documents/change-document-control`,
            {
              NUMER_FV,
              documentControlBL,
              FIRMA,
            }
          );
        }
      }

      if (
        managementDescription.INFORMACJA_ZARZAD.length ||
        managementDescription.HISTORIA_ZMIANY_DATY_ROZLICZENIA.length
      ) {
        await axiosPrivateIntercept.post(`/fk/add-decision-date-fk`, {
          NUMER_FV,
          data: managementDescription,
          FIRMA,
        });
      }

      setManagementDescription({
        INFORMACJA_ZARZAD: [],
        HISTORIA_ZMIANY_DATY_ROZLICZENIA: [],
      });
      await updateDocuments(changeSingleDoc(rowData));

      if (type !== "no_exit") {
        setDataRowTable({
          edit: false,
          singleDoc: {},
          controlDoc: {},
        });
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

  const changeMarkDoc = async (NUMER_FV, MARK_FK, FIRMA) => {
    try {
      await axiosPrivateIntercept.patch(`/fk/change-mark-document`, {
        NUMER_FV,
        MARK_FK,
        FIRMA,
      });
      setRowData((prev) => {
        return {
          ...prev,
          MARK_FK: prev.MARK_FK === 1 ? 0 : 1,
        };
      });
    } catch (error) {
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
    setChangeDepartment((prev) => {
      return {
        ...prev,
        oldDep: rowData.DZIAL,
      };
    });
    const fetchData = async () => {
      try {
        const result = await axiosPrivateIntercept.get(
          `/documents/get-available-deps/${rowData.FIRMA}`
        );
        setChangeDepartment((prev) => ({
          ...prev,
          optionsDep:
            Array.isArray(result.data) && result.data.length > 0
              ? result.data
              : prev.optionsDep, // jeśli pusta, zostawiamy poprzednią wartość
        }));
      } catch (error) {
        console.error(error);
      }
    };
    if (rowData.AREA === "BLACHARNIA") {
      fetchData();
    }
  }, [rowData.DZIAL]);

  useEffect(() => {
    setRowData(dataRowTable?.singleDoc ? dataRowTable.singleDoc : {});
    setControlChat((prev) => {
      return {
        ...prev,
        chat: dataRowTable?.controlDoc?.CONTROL_UWAGI
          ? dataRowTable.controlDoc.CONTROL_UWAGI
          : [],
      };
    });

    if (dataRowTable.singleDoc.AREA === "BLACHARNIA") {
      setDocumentControlBL({
        upowaznienie: dataRowTable?.controlDoc?.CONTROL_UPOW
          ? dataRowTable.controlDoc.CONTROL_UPOW
          : false,
        oswiadczenieVAT: dataRowTable?.controlDoc?.CONTROL_OSW_VAT
          ? dataRowTable.controlDoc.CONTROL_OSW_VAT
          : false,
        prawoJazdy: dataRowTable?.controlDoc?.CONTROL_PR_JAZ
          ? dataRowTable.controlDoc.CONTROL_PR_JAZ
          : false,
        dowodRejestr: dataRowTable?.controlDoc?.CONTROL_DOW_REJ
          ? dataRowTable.controlDoc.CONTROL_DOW_REJ
          : false,
        polisaAC: dataRowTable?.controlDoc?.CONTROL_POLISA
          ? dataRowTable.controlDoc.CONTROL_POLISA
          : false,
        decyzja: dataRowTable?.controlDoc?.CONTROL_DECYZJA
          ? dataRowTable.controlDoc.CONTROL_DECYZJA
          : false,
        faktura: dataRowTable?.controlDoc?.CONTROL_FV
          ? dataRowTable.controlDoc.CONTROL_FV
          : false,
        odpowiedzialnosc: dataRowTable?.controlDoc?.CONTROL_ODPOWIEDZIALNOSC
          ? dataRowTable.controlDoc.CONTROL_ODPOWIEDZIALNOSC
          : false,
        platnoscVAT: dataRowTable?.controlDoc?.CONTROL_PLATNOSC_VAT
          ? dataRowTable.controlDoc.CONTROL_PLATNOSC_VAT
          : false,
        zmianyOstatniaKontrola: dataRowTable?.controlDoc
          ?.CONTROL_BRAK_DZIALAN_OD_OST
          ? dataRowTable.controlDoc.CONTROL_BRAK_DZIALAN_OD_OST
          : false,
      });
    }
  }, [dataRowTable]);

  return (
    <section className="edit-row-table">
      <section className="edit-row-table-wrapper">
        <section className="edit-row-table__container">
          <section className="edit-row-table__content-section">
            <section
              className={
                toggleState === 1
                  ? "edit-row-table__content  edit-row-table__active-content"
                  : "edit-row-table__content"
              }
            >
              <section className="edit-row-table_section-content">
                <section className="edit-row-table_section-content-data">
                  <EditDocBasicData
                    rowData={rowData}
                    setRowData={setRowData}
                    login={auth.userlogin || null}
                    handleAddNote={handleAddNote}
                    changeDepartment={changeDepartment}
                    setChangeDepartment={setChangeDepartment}
                  />
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
                  {changePanel === "doc-actions" && (
                    <section className="edit-row-table__change-panel">
                      {(auth.roles.includes(110) || auth.roles.includes(120)) &&
                      rowData.MARK_FK ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => setChangePanel("management")}
                        >
                          Raport FK
                        </Button>
                      ) : null}
                      {rowData.AREA === "BLACHARNIA" && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => setChangePanel("becared")}
                        >
                          Becared
                        </Button>
                      )}
                    </section>
                  )}
                  {changePanel !== "doc-actions" && (
                    <section className="edit-row-table__change-panel">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setChangePanel("doc-actions")}
                      >
                        Powrót
                      </Button>
                    </section>
                  )}
                  {changePanel === "doc-actions" && (
                    <EditDocActions
                      rowData={rowData}
                      setRowData={setRowData}
                      setChangePanel={setChangePanel}
                      handleAddNote={handleAddNote}
                      roles={auth.roles}
                    />
                  )}
                  {changePanel === "becared" && (
                    <EditDocBeCared rowData={rowData} setRowData={setRowData} />
                  )}
                  {changePanel === "management" && (
                    <EditDataManagement
                      rowData={rowData}
                      setRowData={setRowData}
                      usersurname={auth.usersurname}
                      managementDescription={managementDescription}
                      setManagementDescription={setManagementDescription}
                    />
                  )}
                </section>
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
                <section className="edit-row-table_section-content-data">
                  <EditDocBasicData
                    rowData={rowData}
                    setRowData={setRowData}
                    login={auth.userlogin || null}
                    handleAddNote={handleAddNote}
                    changeDepartment={changeDepartment}
                    setChangeDepartment={setChangeDepartment}
                  />
                </section>
                <section className="edit-row-table_section-content-data">
                  {toggleState === 2 && (
                    <DocumentsControlChat
                      usersurname={auth.usersurname}
                      controlChat={controlChat}
                      setControlChat={setControlChat}
                    />
                  )}
                </section>
                <section className="edit-row-table_section-content-data">
                  {auth.roles.includes(120) &&
                    dataRowTable.singleDoc.AREA === "BLACHARNIA" && (
                      <DocumentsControlBL
                        documentControlBL={documentControlBL}
                        setDocumentControlBL={setDocumentControlBL}
                      />
                    )}
                </section>
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
                <section className="section-data"></section>
                <section className="section-data"></section>
                <section className="section-data"></section>
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
                // onClick={() => nextPrevDoc.prev && getSingleRow(nextPrevDoc.prev, 'full')                }
              />
              <RxDoubleArrowRight
                className={
                  nextPrevDoc.next
                    ? `edit_row_table-icon_buttons`
                    : `edit_row_table-icon_buttons--disable`
                }
                onClick={() => nextPrevDoc.next && checkNextDoc("next")}
                // onClick={() => nextPrevDoc.next && getSingleRow(nextPrevDoc.next, 'full')}
              />
            </section>
            <section className="edit_row_table-buttons">
              <Button
                className="mui-button"
                variant="contained"
                size="large"
                color="error"
                onClick={() =>
                  setDataRowTable({
                    edit: false,
                    singleDoc: {},
                    controlDoc: {},
                  })
                }
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
              {auth.roles.includes(200) && rowData.MARK_FV && (
                <Button
                  variant="contained"
                  color={rowData.MARK_FK ? "secondary" : "error"}
                  onClick={() =>
                    changeMarkDoc(
                      rowData.NUMER_FV,
                      rowData.MARK_FK === 1 ? 0 : 1,
                      rowData.FIRMA
                    )
                  }
                >
                  {rowData.MARK_FK ? "FK ON" : "FK OFF"}
                </Button>
              )}
              {auth.roles.includes(120) &&
                dataRowTable.singleDoc.AREA === "BLACHARNIA" && (
                  <Button
                    variant="contained"
                    // color="secondary"
                    onClick={() =>
                      setToggleState((prev) => (prev === 1 ? 2 : 1))
                    }
                  >
                    Kontrola
                  </Button>
                )}
            </section>
          </section>
        </section>
      </section>
    </section>
  );
};

export default EditRowTable;
