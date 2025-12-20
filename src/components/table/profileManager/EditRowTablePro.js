import { useState, useEffect, useCallback } from "react";
import useData from "../../hooks/useData";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import { RxDoubleArrowRight, RxDoubleArrowLeft } from "react-icons/rx";
import EditBasicDataPro from "./EditBasicDataPro";
import EditActionsDataPro from "./EditActionsDataPro";
import AcceptCasePanel from "./AcceptCasePanel";
import LogAndChat from "./LogAndChat";
import BasicDataInsider from "./BasicDataInsider";
import SelectPanel from "./SelectPanel";
import EditDocActions from "./EditDocActions";
import EditDocBeCared from "./EditDocBeCared";
import DocumentsControlBL from "./DocumentsControlBL";
import EditDataManagement from "./EditDataManagement";
import {
  changeSingleDoc,
  changeSingleDocLawPartner,
} from "../utilsForTable/changeSingleDocument";
import { basePath } from "../utilsForTable/basePathProfile";
import "./EditRowTablePro.css";

// Stała stanu początkowego notatek, aby uniknąć duplikowania przy przełączaniu
const initialChatLogState = {
  documents: { KANAL_KOMUNIKACJI: [], DZIENNIK_ZMIAN: [] },
  controlBL: { KANAL_KOMUNIKACJI: [], DZIENNIK_ZMIAN: [] },
  raportFK: { KANAL_KOMUNIKACJI: [], DZIENNIK_ZMIAN: [] },
};

const EditRowTablePro = ({
  dataRowTable,
  setDataRowTable,
  updateDocuments,
  removeDocuments,
  nextDoc,
  getSingleRow,
  clearRowTable,
  info,
  profile,
}) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();
  const [rowData, setRowData] = useState({});
  const [nextPrevDoc, SetNextPrevDoc] = useState({ prev: null, next: null });
  const [toggleState, setToggleState] = useState(1);

  // Stan nowych wpisów (bufor przed wysłaniem na serwer)
  const [chatLog, setChatLog] = useState(initialChatLogState);

  // Zmiana panelu po wyborze Select
  const [changePanel, setChangePanel] = useState(() => {
    const panelMap = {
      raport_fk: "management",
      "control-bl": "control-bl",
      "law-partner": "law-partner",
    };
    return panelMap[info] ?? "doc-actions";
  });

  // zmienna dla obsługi panelu KOntrola BL
  const [documentControlBL, setDocumentControlBL] = useState({
    COMPANY: null,
    CONTROL_ODPOWIEDZIALNOSC: null,
    CONTROL_DECYZJA: null,
    CONTROL_DOW_REJ: null,
    CONTROL_BRAK_DZIALAN_OD_OST: null,
    CONTROL_FV: null,
    CONTROL_OSW_VAT: null,
    CONTROL_PLATNOSC_VAT: null,
    CONTROL_POLISA: null,
    CONTROL_PR_JAZ: null,
    CONTROL_UPOW: null,
    DZIENNIK_ZMIAN: null,
    KANAL_KOMUNIKACJI: null,
    NUMER_FV: null,
    id_control_documents: null,
  });

  //zmienna do tworzenia histori decyzji dla zarządu wykorzystywane później w raporcie
  const [managementDescription, setManagementDescription] = useState({
    INFORMACJA_ZARZAD: [],
    HISTORIA_ZMIANY_DATY_ROZLICZENIA: [],
  });

  const handleSaveData = async (type = "exit") => {
    const { id_document, NUMER_FV, FIRMA } = rowData;
    try {
      await axiosPrivateIntercept.patch(
        `${basePath[profile]}/change-single-document`,
        { id_document, document: rowData, chatLog }
      );

      // zapis danych z kontroli BL
      if (
        rowData.AREA === "BLACHARNIA" &&
        (auth.roles.includes(120) || auth.roles.includes(2000))
      ) {
        await axiosPrivateIntercept.patch(
          `/documents/change-document-control`,
          {
            NUMER_FV,
            documentControlBL,
            FIRMA,
            chatLog: chatLog.controlBL,
          }
        );
      }

      // Po udanym zapisie czyścimy bufor chatLog
      setChatLog(initialChatLogState);

      if (profile === "insider") {
        updateDocuments(changeSingleDoc(rowData));
      } else if (profile === "partner") {
        updateDocuments(changeSingleDocLawPartner(rowData));
      }

      if (type !== "no_exit") {
        setDataRowTable(clearRowTable);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = (info, type, context) => {
    const saveInfo = { chat: "KANAL_KOMUNIKACJI", log: "DZIENNIK_ZMIAN" };
    const fieldName = saveInfo[type];

    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;

    const note = {
      date: formattedDate,
      note: info,
      profile: auth.permissions,
      userlogin: auth.userlogin,
      username: auth.usersurname,
    };

    // 1. Aktualizacja bufora wysyłkowego (chatLog)
    setChatLog((prev) => ({
      ...prev,
      [context]: {
        ...prev[context],
        [fieldName]: [...(prev[context]?.[fieldName] ?? []), note],
      },
    }));

    // 2. Aktualizacja widoku lokalnego (rowData lub controlBL)
    if (context === "documents") {
      setRowData((prev) => ({
        ...prev,
        [fieldName]: [...(prev[fieldName] ?? []), note],
      }));
    } else if (context === "controlBL") {
      setDocumentControlBL((prev) => ({
        ...prev,
        [fieldName]: [...(prev[fieldName] ?? []), note],
      }));
    }
  };

  const profileComponentFirst = () => {
    if (profile === "insider") {
      return (
        <BasicDataInsider
          rowData={rowData}
          setRowData={setRowData}
          login={auth.userlogin || null}
          handleAddNote={handleAddNote}
          context="documents"
        />
      );
    } else if (profile === "partner" || profile === "insurance") {
      return <EditBasicDataPro rowData={rowData} profile={profile} />;
    }
    return null;
  };

  const profileComponentSecond = () => {
    const currentContext =
      changePanel === "control-bl" ? "controlBL" : "documents";

    // Klucz 'key' zależy od id dokumentu i aktualnego panelu.
    // Dzięki temu przy każdej zmianie panelu stan 'note' w LogAndChat się zeruje.
    const uniqueKey = `${rowData.id_document}-${currentContext}`;

    if (profile === "insider") {
      return (
        <LogAndChat
          key={uniqueKey}
          kanalKomunikacji={
            changePanel === "control-bl"
              ? documentControlBL.KANAL_KOMUNIKACJI
              : rowData.KANAL_KOMUNIKACJI
          }
          dziennikZmian={
            changePanel === "control-bl"
              ? documentControlBL.DZIENNIK_ZMIAN
              : rowData.DZIENNIK_ZMIAN
          }
          handleAddNote={handleAddNote}
          context={currentContext}
        />
      );
    } else if (profile === "partner") {
      if (rowData?.DATA_PRZYJECIA_SPRAWY) {
        return (
          <LogAndChat
            key={uniqueKey}
            kanalKomunikacji={rowData.KANAL_KOMUNIKACJI}
            dziennikZmian={rowData.DZIENNIK_ZMIAN}
            handleAddNote={handleAddNote}
            context="documents"
          />
        );
      } else if (rowData?.id_document && !rowData?.DATA_PRZYJECIA_SPRAWY) {
        return (
          <section className="edit_row_table_pro_section-content-data">
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
          key={uniqueKey}
          kanalKomunikacji={rowData.KANAL_KOMUNIKACJI}
          dziennikZmian={rowData.DZIENNIK_ZMIAN}
          handleAddNote={handleAddNote}
          context="documents"
        />
      );
    }
    return (
      <section className="edit_row_table_pro_section-content-data"></section>
    );
  };

  const profileCompnentThird = () => {
    if (
      (profile === "partner" || profile === "insurance") &&
      rowData?.DATA_PRZYJECIA_SPRAWY
    ) {
      return (
        <EditActionsDataPro
          rowData={rowData}
          setRowData={setRowData}
          handleAddNote={handleAddNote}
          profile={profile}
          roles={auth.roles || []}
          context="documents"
        />
      );
    } else if (profile === "insider") {
      if (changePanel === "doc-actions") {
        return (
          <EditDocActions
            rowData={rowData}
            setRowData={setRowData}
            handleAddNote={handleAddNote}
            roles={auth.roles || []}
            context="documents"
          />
        );
      } else if (changePanel === "becared") {
        return <EditDocBeCared rowData={rowData} />;
      } else if (changePanel === "control-bl") {
        return (
          <DocumentsControlBL
            documentControlBL={documentControlBL}
            setDocumentControlBL={setDocumentControlBL}
            handleAddNote={handleAddNote}
            context="controlBL"
          />
        );
      } else if (changePanel === "management") {
        return (
          <EditDataManagement
            rowData={rowData}
            setRowData={setRowData}
            usersurname={auth.usersurname}
            // managementDescription={managementDescription}
            setManagementDescription={setManagementDescription}
          />
        );
      }
    }
    return null;
  };

  const checkNextDoc = async (type) => {
    try {
      await handleSaveData("no_exit");
      await getSingleRow(nextPrevDoc[type], "full");
    } catch (error) {
      console.error(error);
    }
  };

  // możliwosć wyłączenia dokumnetu z Raportu FK
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

  const isButtonDisabled =
    profile === "partner" ? !rowData?.DATA_PRZYJECIA_SPRAWY : false;

  // Logika dla strzałek Nawigacji
  useEffect(() => {
    if (!rowData?.id_document) return;
    const index = nextDoc.indexOf(rowData.id_document);
    SetNextPrevDoc({
      prev: nextDoc[index - 1] ?? null,
      next: nextDoc[index + 1] ?? null,
    });
  }, [rowData, nextDoc]);

  // Czyścimy bufor chatLog przy każdej zmianie dokumentu (strzałki/ładowanie)
  useEffect(() => {
    setRowData(dataRowTable?.singleDoc ? dataRowTable.singleDoc : {});
    setChatLog(initialChatLogState); // Resetujemy notatki, których nie zapisano
    setDocumentControlBL({
      COMPANY: dataRowTable?.controlDoc?.COMPANY || null,
      CONTROL_ODPOWIEDZIALNOSC:
        dataRowTable?.controlDoc?.CONTROL_ODPOWIEDZIALNOSC || null,
      CONTROL_DECYZJA: dataRowTable?.controlDoc?.CONTROL_DECYZJA || null,
      CONTROL_DOW_REJ: dataRowTable?.controlDoc?.CONTROL_DOW_REJ || null,
      CONTROL_BRAK_DZIALAN_OD_OST:
        dataRowTable?.controlDoc?.CONTROL_BRAK_DZIALAN_OD_OST || null,
      CONTROL_FV: dataRowTable?.controlDoc?.CONTROL_FV || null,
      CONTROL_OSW_VAT: dataRowTable?.controlDoc?.CONTROL_OSW_VAT || null,
      CONTROL_PLATNOSC_VAT:
        dataRowTable?.controlDoc?.CONTROL_PLATNOSC_VAT || null,
      CONTROL_POLISA: dataRowTable?.controlDoc?.CONTROL_POLISA || null,
      CONTROL_PR_JAZ: dataRowTable?.controlDoc?.CONTROL_PR_JAZ || null,
      CONTROL_UPOW: dataRowTable?.controlDoc?.CONTROL_UPOW || null,
      DZIENNIK_ZMIAN: dataRowTable?.controlDoc?.DZIENNIK_ZMIAN || null,
      KANAL_KOMUNIKACJI: dataRowTable?.controlDoc?.KANAL_KOMUNIKACJI || null,
      NUMER_FV: dataRowTable?.controlDoc?.NUMER_FV || null,
      id_control_documents:
        dataRowTable?.controlDoc?.id_control_documents || null,
    });
  }, [dataRowTable]);

  // useEffect(() => {
  //   console.log(changePanel);
  // }, [changePanel]);
  return (
    <section className="edit_row_table_pro">
      <section className="edit_row_table_pro__container">
        {/* Renderowanie głównego kontentu */}
        <section
          className={`edit_row_table_pro__content ${
            toggleState === 1 ? "edit_row_table_pro__active-content" : ""
          }`}
        >
          <section className="edit_row_table_pro_section-content">
            <section className="edit_row_table_pro_section-content-data">
              {profileComponentFirst()}
            </section>
            <section className="edit_row_table_pro_section-content-data">
              {profileComponentSecond()}
            </section>
            <section className="edit_row_table_pro_section-content-data">
              {profileCompnentThird()}
            </section>
          </section>
        </section>

        {/* Toggle 2 - Panel kontroli dokumentacji */}
        <section
          className={`edit_row_table_pro__content ${
            toggleState === 2 ? "edit_row_table_pro__active-content" : ""
          }`}
        >
          <section className="edit_row_table_pro_section-content">
            <section className="edit_row_table_pro_section-content-data">
              {profileComponentFirst()}
            </section>
            <section className="edit_row_table_pro_section-content-data">
              <LogAndChat
                key={`tab2-${rowData.id_document}`} // Osobny klucz dla zakładki 2
                kanalKomunikacji={rowData.KANAL_KOMUNIKACJI}
                dziennikZmian={rowData.DZIENNIK_ZMIAN}
                handleAddNote={handleAddNote}
                context="controlBL"
              />
            </section>
            <section className="edit_row_table_pro_section-content-data">
              <EditDocBeCared rowData={rowData} />
            </section>
          </section>
        </section>
      </section>

      {/* Dolny panel przycisków */}
      <section className="edit_row_table_pro__panel">
        <section className="edit_row_table_pro-buttons">
          <RxDoubleArrowLeft
            className={
              nextPrevDoc.prev
                ? "edit_row_table_pro-icon_buttons"
                : "edit_row_table_pro-icon_buttons--disable"
            }
            onClick={() => nextPrevDoc.prev && checkNextDoc("prev")}
          />
          <RxDoubleArrowRight
            className={
              nextPrevDoc.next
                ? "edit_row_table_pro-icon_buttons"
                : "edit_row_table_pro-icon_buttons--disable"
            }
            onClick={() => nextPrevDoc.next && checkNextDoc("next")}
          />
        </section>

        <section className="edit_row_table_pro-buttons">
          <Button
            variant="contained"
            color="error"
            onClick={() => setDataRowTable(clearRowTable)}
          >
            Anuluj
          </Button>
          <Button
            variant="contained"
            color="success"
            disabled={isButtonDisabled}
            onClick={() => handleSaveData()}
          >
            Zatwierdź
          </Button>
        </section>

        <section className="edit_row_table_pro-buttons">
          {(auth.roles.includes(200) ||
            auth.roles.includes(201) ||
            auth.roles.includes(202)) &&
            rowData.MARK_FV && (
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
          {profile === "insider" && (
            <SelectPanel
              changePanel={changePanel}
              setChangePanel={setChangePanel}
              roles={auth.roles || []}
              rowData={rowData}
            />
          )}
        </section>
      </section>
    </section>
  );
};

export default EditRowTablePro;
