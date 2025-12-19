import { useState, useEffect } from "react";
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
import { changeSingleDocLawPartner } from "../utilsForTable/changeSingleDocument";
import { basePath } from "../utilsForTable/basePathProfile";
import "./EditRowTablePro.css";

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
  // const [note, setNote] = useState("");
  const [nextPrevDoc, SetNextPrevDoc] = useState({
    prev: null,
    next: null,
  });

  // stan nowych wpisów dla chat i logów
  const [chatLog, setChatLog] = useState({
    documents: {
      KANAL_KOMUNIKACJI: [],
      DZIENNIK_ZMIAN: [],
    },
    controlBL: {
      KANAL_KOMUNIKACJI: [],
      DZIENNIK_ZMIAN: [],
    },
    raportFK: {
      KANAL_KOMUNIKACJI: [],
      DZIENNIK_ZMIAN: [],
    },
  });

  //zmiana panlu po wyborze Select
  const [changePanel, setChangePanel] = useState(() => {
    const panelMap = {
      raport_fk: "management",
      "control-bl": "control-bl",
      "law-partner": "law-partner",
      // przykładowa opcja na przyszłość
      // tu możesz dopisywać kolejne mapowania
    };
    // Jeśli info znajduje się w mapie, użyj tej wartości, w przeciwnym razie "doc-actions"
    return panelMap[info] || "doc-actions";
  });

  const [toggleState, setToggleState] = useState(1);

  // dane dla kontroli dokumentacji obszaru Blacharnia
  const [documentControlBL, setDocumentControlBL] = useState({
    company: null,
    control_brak_dzialan_od_ost: null,
    control_decyzja: null,
    control_dow_rej: null,
    control_fv: null,
    control_odpowiedzialnosc: null,
    control_osw_vat: null,
    control_platnosc_vat: null,
    control_polisa: null,
    control_pr_jaz: null,
    control_upow: null,
    dziennik_zmian: null,
    kanal_komunikacji: null,
    numer_fv: null,
    id_control_documents: null,
  });

  const handleSaveData = async (type = "exit") => {
    const { id_document } = rowData;
    try {
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
  const handleAddNote = (info, type, context) => {
    // console.log(info);
    // console.log(type);
    // console.log(context);
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

    setChatLog((prev) => ({
      ...prev,
      [context]: {
        ...prev[context],
        [saveInfo[type]]: [...(prev[context]?.[saveInfo[type]] ?? []), note],
      },
    }));

    if (context === "documents") {
      setRowData((prev) => {
        return {
          ...prev,
          [saveInfo[type]]: newChat,
        };
      });
    }
  };

  const changeMarkDoc = async (NUMER_FV, MARK_FK, FIRMA) => {
    try {
      await axiosPrivateIntercept.patch(`/fk/change-mark-document`, {
        NUMER_FV,
        MARK_FK,
        FIRMA,
      });

      handleAddNote(
        MARK_FK === 0
          ? "Wyłączono dokument z Raportu FK"
          : "Przywrócono dokument do Raportu FK",
        "log",
        "documents"
      );
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
    } else return null;
  };

  const profileComponentSecond = () => {
    if (profile === "insider") {
      return (
        <LogAndChat
          kanalKomunikacji={rowData.KANAL_KOMUNIKACJI}
          dziennikZmian={rowData.DZIENNIK_ZMIAN}
          handleAddNote={handleAddNote}
          context="documents"
        />
      );
    } else if (profile === "partner") {
      if (rowData?.DATA_PRZYJECIA_SPRAWY) {
        return (
          <LogAndChat
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
          kanalKomunikacji={rowData.KANAL_KOMUNIKACJI}
          dziennikZmian={rowData.DZIENNIK_ZMIAN}
          handleAddNote={handleAddNote}
          context="documents"
        />
      );
    } else {
      return (
        <section className="edit_row_table_pro_section-content-data"></section>
      );
    }
  };

  const profileCompnentThird = () => {
    if (profile === "partner" && rowData?.DATA_PRZYJECIA_SPRAWY) {
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
    } else if (profile === "insurance") {
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
          />
        );
      }
    } else return null;
  };
  const isButtonDisabled = (() => {
    if (profile === "insider") {
      return false;
    } else if (profile === "partner") {
      return !rowData?.DATA_PRZYJECIA_SPRAWY;
    } else if (profile === "insurance") {
      return false;
    }
    // domyślnie
    return true;
  })();

  useEffect(() => {
    if (!rowData?.id_document) return;

    const index = nextDoc.indexOf(rowData.id_document);

    SetNextPrevDoc({
      prev: nextDoc[index - 1] ?? null,
      next: nextDoc[index + 1] ?? null,
    });
  }, [rowData, nextDoc]);

  useEffect(() => {
    setRowData(dataRowTable?.singleDoc ? dataRowTable.singleDoc : {});
    setDocumentControlBL({
      company: dataRowTable?.controlDoc?.COMPANY || null,
      control_brak_dzialan_od_ost:
        dataRowTable?.controlDoc?.CONTROL_BRAK_DZIALAN_OD_OST || null,
      control_decyzja: dataRowTable?.controlDoc?.CONTROL_DECYZJA || null,
      control_dow_rej: dataRowTable?.controlDoc?.CONTROL_DOW_REJ || null,
      control_fv: dataRowTable?.controlDoc?.CONTROL_FV || null,
      control_odpowiedzialnosc:
        dataRowTable?.controlDoc?.CONTROL_ODPOWIEDZIALNOSC || null,
      control_osw_vat: dataRowTable?.controlDoc?.CONTROL_OSW_VAT || null,
      control_platnosc_vat:
        dataRowTable?.controlDoc?.CONTROL_PLATNOSC_VAT || null,
      control_polisa: dataRowTable?.controlDoc?.CONTROL_POLISA || null,
      control_pr_jaz: dataRowTable?.controlDoc?.CONTROL_PR_JAZ || null,
      control_upow: dataRowTable?.controlDoc?.CONTROL_UPOW || null,
      dziennik_zmian: dataRowTable?.controlDoc?.DZIENNIK_ZMIAN || null,
      kanal_komunikacji: dataRowTable?.controlDoc?.KANAL_KOMUNIKACJI || null,
      numer_fv: dataRowTable?.controlDoc?.NUMER_FV || null,
      id_control_documents:
        dataRowTable?.controlDoc?.id_control_documents || null,
    });
  }, [dataRowTable]);

  // useEffect(() => {
  //   if (changePanel === "control-bl") {
  //     setToggleState(2);
  //   } else if (changePanel === "law-partner") {
  //     setToggleState(3);
  //   } else {
  //     setToggleState(1);
  //   }
  // }, [changePanel]);

  return (
    <section className="edit_row_table_pro">
      <section className="edit_row_table_pro__container">
        <section
          className={
            toggleState === 1
              ? "edit_row_table_pro__content  edit_row_table_pro__active-content"
              : "edit_row_table_pro__content"
          }
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
        <section
          className={
            toggleState === 2
              ? "edit_row_table_pro__content  edit_row_table_pro__active-content"
              : "edit_row_table_pro__content"
          }
        >
          <section className="edit_row_table_pro_section-content">
            <section className="edit_row_table_pro_section-content-data">
              {profileComponentFirst()}
            </section>
            <section className="edit_row_table_pro_section-content-data">
              <LogAndChat
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
        <section
          className={
            toggleState === 3
              ? "edit_row_table_pro__content  edit_row_table_pro__active-content"
              : "edit_row_table_pro__content"
          }
        >
          <section className="edit_row_table_pro_section-content">
            <section className="edit_row_table_pro_section-content-data"></section>
            <section className="edit_row_table_pro_section-content-data"></section>
            <section className="edit_row_table_pro_section-content-data"></section>
          </section>
        </section>
      </section>
      <section className="edit_row_table_pro__panel">
        <section className="edit_row_table_pro-buttons">
          <RxDoubleArrowLeft
            className={
              nextPrevDoc.prev
                ? `edit_row_table_pro-icon_buttons`
                : `edit_row_table_pro-icon_buttons--disable`
            }
            onClick={() => nextPrevDoc.prev && checkNextDoc("prev")}
          />
          <RxDoubleArrowRight
            className={
              nextPrevDoc.next
                ? `edit_row_table_pro-icon_buttons`
                : `edit_row_table_pro-icon_buttons--disable`
            }
            onClick={() => nextPrevDoc.next && checkNextDoc("next")}
          />
        </section>
        <section className="edit_row_table_pro-buttons">
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
        <section className="edit_row_table_pro-buttons">
          {(auth.roles.includes(200) ||
            auth.roles.includes(201) ||
            auth.roles.includes(202)) &&
            rowData.MARK_FV &&
            profile === "insider" && (
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
