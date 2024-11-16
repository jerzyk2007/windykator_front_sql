import { useState } from "react";
import useData from "./hooks/useData";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import EditDocBasicData from "./EditDocBasicData";
import EditDocChat from "./EditDocChat";
import EditDocSettlements from "./EditDocSettlements";
import EditDocActions from "./EditDocActions";
import EditDocBeCared from "./EditDocBeCared";
// import { format } from "date-fns";
import "./EditRowTable.css";

const EditRowTable = ({ dataRowTable, setDataRowTable, updateDocuments }) => {
  const { auth } = useData();
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [rowData, setRowData] = useState(dataRowTable);
  const [beCared, setBeCared] = useState(false);
  const [note, setNote] = useState("");
  const [toggleState, setToggleState] = useState(1);

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

  const toggleTab = (index) => {
    setToggleState(index);
  };

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

      updateDocuments(rowData);
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
                  {!beCared && (
                    <EditDocActions
                      rowData={rowData}
                      setRowData={setRowData}
                      setBeCared={setBeCared}
                      handleAddNote={handleAddNote}
                    />
                  )}
                  {beCared && (
                    <EditDocBeCared
                      rowData={rowData}
                      setRowData={setRowData}
                      setBeCared={setBeCared}
                    />
                  )}
                  {/* {!beCared && rowData.OPIS_ROZRACHUNKU && (
                    <EditDocSettlements settlement={rowData.OPIS_ROZRACHUNKU} />
                  )} */}
                  {/* {!beCared && rowData.OPIS_ROZRACHUNKU && (
                    <EditDocSettlements settlement={rowData.OPIS_ROZRACHUNKU} date={rowData?.DATA_ROZL_AS ? rowData.DATA_ROZL_AS : null} />
                  )} */}
                  {!beCared && (
                    <EditDocSettlements settlement={rowData.OPIS_ROZRACHUNKU} date={rowData?.DATA_ROZL_AS ? rowData.DATA_ROZL_AS : null} />
                  )}
                </section>
              </section>
            </section>
            <section
              className={
                toggleState === 2 ? "content  active-content" : "content"
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
          </section>
        </section>
      </section>
    </section>
  );
};

export default EditRowTable;
