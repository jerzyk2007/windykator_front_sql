import { useState, useEffect } from "react";
import useData from "../../hooks/useData";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import EditDocBasicData from "./EditDocBasicData";
import EditDocChat from "./EditDocChat";
import EditDocActions from "./EditDocActions";
import EditDocBeCared from "./EditDocBeCared";
import EditDataManagement from "./EditDataManagement";
import DocumentsControlBL from "./DocumentsControlBL";
import DocumentsControlChat from "./DocumentsControlChat";
import ReferToLawFirm from "./ReferToLawFirm";
import { changeSingleDoc } from "../utilsForTable/changeSingleDocument";
import { RxDoubleArrowRight, RxDoubleArrowLeft } from "react-icons/rx";

import "./EditRowTable.css";

const EditRowTable = ({
  dataRowTable,
  setDataRowTable,
  updateDocuments,
  roles,
  nextDoc,
  getSingleRow,
  clearRowTable,
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

  // dane dla przekzania do kancelarii
  const [lawFirmData, setLawFirmData] = useState({
    numerFv: rowData.NUMER_FV,
    kontrahent: rowData.KONTRAHENT,
    kwotaRoszczenia: "", // Zmieniamy na string, aby łatwiej obsługiwać formatowanie
    kancelaria: "",
    zapisz: false,
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
        lawFirmData,
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

  const handleChange = (event) => {
    setChangePanel(event.target.value);
  };

  useEffect(() => {
    if (changePanel === "control-bl") {
      setToggleState(2);
    } else if (changePanel === "law-partner") {
      setToggleState(3);
    } else {
      setToggleState(1);
    }
  }, [changePanel]);

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

    setLawFirmData((prev) => {
      return {
        ...prev,
        numerFv: dataRowTable?.singleDoc.NUMER_FV,
        kontrahent: dataRowTable?.singleDoc.KONTRAHENT,
      };
    });
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
                  {changePanel === "law-partner" && (
                    <ReferToLawFirm
                      rowData={rowData}
                      lawPartner={dataRowTable.lawPartner}
                      handleAddNote={handleAddNote}
                      lawFirmData={lawFirmData}
                      setLawFirmData={setLawFirmData}
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
                  <DocumentsControlBL
                    documentControlBL={documentControlBL}
                    setDocumentControlBL={setDocumentControlBL}
                  />
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
                <section className="edit-row-table_section-content-data">
                  {changePanel === "law-partner" && (
                    <ReferToLawFirm
                      rowData={rowData}
                      lawPartner={dataRowTable.lawPartner}
                      handleAddNote={handleAddNote}
                      lawFirmData={lawFirmData}
                      setLawFirmData={setLawFirmData}
                    />
                  )}
                </section>
                <section className="edit-row-table_section-content-data"></section>
                <section className="edit-row-table_section-content-data"></section>
              </section>
            </section>
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

          {/* --- Nowa logika dla Select --- */}
          {(() => {
            const menuItems = [
              <MenuItem key="doc-actions" value="doc-actions">
                PANEL AKCJI
              </MenuItem>,
            ];

            if (rowData.AREA === "BLACHARNIA") {
              menuItems.push(
                <MenuItem key="becared" value="becared">
                  KANCELARIA TU / BL
                </MenuItem>
              );
            }

            if (
              (auth.roles.includes(110) || auth.roles.includes(120)) &&
              rowData.MARK_FK
            ) {
              menuItems.push(
                <MenuItem key="management" value="management">
                  RAPORT FK
                </MenuItem>
              );
            }

            if (
              auth.roles.includes(120) &&
              dataRowTable.singleDoc.AREA === "BLACHARNIA"
            ) {
              menuItems.push(
                <MenuItem key="control-bl" value="control-bl">
                  KONTROLA BL
                </MenuItem>
              );
            }

            if (auth.roles.includes(150)) {
              menuItems.push(
                <MenuItem key="law-partner" value="law-partner">
                  PRZEKAŻ SPRAWĘ DO KANCELARII
                </MenuItem>
              );
            }

            // Jeśli mamy więcej niż 1 opcję, pokazujemy SELECT
            if (menuItems.length > 1) {
              return (
                <Select
                  value={changePanel}
                  onChange={handleChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: "rgb(255, 255, 255)",
                        color: "#000",
                        borderRadius: "5px",
                        border: "1px solid rgba(189, 67, 211, 1)",
                        "& .MuiMenuItem-root": {
                          justifyContent: "center",
                          textAlign: "center",
                          "&:hover": {
                            backgroundColor: "rgba(189, 67, 211, 0.15)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "rgba(189, 67, 211, 1) !important",
                            color: "#fff",
                          },
                          "&.Mui-selected:hover": {
                            backgroundColor:
                              "rgba(189, 67, 211, 0.35) !important",
                          },
                        },
                      },
                    },
                  }}
                  sx={{
                    width: "70%",
                    padding: "2px 0",
                    fontFamily: "Roboto",
                    backgroundColor: "rgb(156, 39, 176)",
                    color: "#fff",
                    borderRadius: "5px",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    textAlign: "center",
                    "& .MuiSelect-select": {
                      color: "#fff",
                      padding: "8px 12px",
                    },
                    "& fieldset": { border: "none" },
                  }}
                >
                  {menuItems}
                </Select>
              );
            }

            return null; // jeśli jest tylko jedna opcja, nic nie renderujemy
          })()}
        </section>
      </section>
    </section>
  );
};

export default EditRowTable;
