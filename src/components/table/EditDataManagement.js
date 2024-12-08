import { useRef, useEffect } from "react";
import HistoryDateSettlement from "./HistoryDateSettlement";
import { Button } from "@mui/material";
import "./EditDataManagement.css";

const EditDataManagement = ({ rowData, setRowData, setChangePanel, handleDateHistoryNote, managementNote, setManagementNote, handleAddManagementNote }) => {
    const textareaRef = useRef(null);

    const scrollToBottom = () => {
        if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom(); // Przewiń na dół po pierwszym renderze lub zmianie `rowData.UWAGI_ASYSTENT`
    }, [rowData.INFORMACJA_ZARZAD]);

    return (
        <section className="edit_doc edit_doc_actions ">
            <HistoryDateSettlement
                setRowData={setRowData}
                dateSettlement={rowData.OSTATECZNA_DATA_ROZLICZENIA}
                dateHistory={rowData.HISTORIA_ZMIANY_DATY_ROZLICZENIA}
            />


            <section className="edit_doc__container">
                <span className="edit_doc--title">
                    Ostateczna data rozl.:
                </span>
                <input
                    className="edit_doc--select"
                    style={
                        !rowData.OSTATECZNA_DATA_ROZLICZENIA ? { backgroundColor: "yellow" } : null
                    }
                    type="date"
                    value={rowData.OSTATECZNA_DATA_ROZLICZENIA ? rowData.OSTATECZNA_DATA_ROZLICZENIA : ""}
                    onChange={(e) => {
                        handleDateHistoryNote(
                            "Ostateczna data rozliczenia:",
                            e.target.value.length > 3 ? e.target.value : "Brak"
                        );
                        setRowData((prev) => {
                            return {
                                ...prev,
                                OSTATECZNA_DATA_ROZLICZENIA: e.target.value,
                            };
                        });
                    }}
                />
            </section>

            <section className="edit-doc-chat edit_data_management-chat">
                <span className="edit-doc-chat--title edit_data_management--title">
                    Informacja do przekazania dla Zarządu
                </span>

                <textarea
                    ref={textareaRef}
                    className="edit-doc-chat--content edit_data_management--content"
                    readOnly
                    value={rowData.INFORMACJA_ZARZAD ? rowData.INFORMACJA_ZARZAD.join("\n") : ""}
                ></textarea>
                <textarea
                    className="edit-doc-chat--edit"
                    placeholder="dodaj informacje"
                    value={managementNote}
                    onChange={(e) => setManagementNote(e.target.value)}
                />
                <section className="edit-doc-chat__panel">
                    <Button
                        disabled={!managementNote ? true : false}
                        variant="contained"
                        color="error"
                        onClick={() => setManagementNote("")}
                    >
                        Usuń
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleAddManagementNote(managementNote, "")}
                        disabled={!managementNote ? true : false}
                    >
                        Dodaj
                    </Button>
                </section>
            </section>

            <section className="edit_doc--button">
                <Button variant="outlined" onClick={() => setChangePanel({ type: 'doc-actions' })}>
                    Działania
                </Button>
            </section>
        </section>
    );
};

export default EditDataManagement;
