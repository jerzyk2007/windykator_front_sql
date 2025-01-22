import { useRef, useEffect, useState } from "react";
import HistoryDateSettlement from "./HistoryDateSettlement";
import { Button } from "@mui/material";
import "./EditDataManagement.css";

const EditDataManagement = ({ rowData, setRowData, setChangePanel, handleDateHistoryNote, managementNote, setManagementNote, handleAddManagementNote }) => {
    const textareaRef = useRef(null);
    const [tempDate, setTempDate] = useState(rowData.OSTATECZNA_DATA_ROZLICZENIA || ""); // Tymczasowa data
    const [isFirstRender, setIsFirstRender] = useState(true); // Czy to pierwsze uruchomienie?

    const scrollToBottom = () => {
        if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom(); // Przewiń na dół po pierwszym renderze lub zmianie `rowData.INFORMACJA_ZARZAD`
    }, [rowData.INFORMACJA_ZARZAD]);

    const handleSaveDate = () => {
        // Zapisujemy datę, w tym "Brak", jeśli jest pusta
        handleDateHistoryNote(
            "Ostateczna data rozliczenia:",
            tempDate || "Brak"
        );

        setRowData((prev) => ({
            ...prev,
            OSTATECZNA_DATA_ROZLICZENIA: tempDate, // Aktualizacja w głównych danych
        }));

        setIsFirstRender(false); // Odblokuj przycisk po pierwszym zapisie
    };

    const handleDateChange = (e) => {
        setTempDate(e.target.value); // Aktualizujemy tymczasową datę
        if (isFirstRender) setIsFirstRender(false); // Wyłącz tryb "pierwszego uruchomienia" przy dowolnej zmianie
    };

    return (
        <section className="edit_doc edit_doc_actions ">
            <HistoryDateSettlement
                setRowData={setRowData}
                dateSettlement={rowData.OSTATECZNA_DATA_ROZLICZENIA}
                dateHistory={rowData.HISTORIA_ZMIANY_DATY_ROZLICZENIA}
            />

            <section className="edit_doc__container">
                <span className="edit_doc--title">Ostateczna data rozl.:</span>
                <input
                    className="edit_doc--select"
                    style={!rowData.OSTATECZNA_DATA_ROZLICZENIA ? { backgroundColor: "yellow" } : null}
                    type="date"
                    value={tempDate} // Używamy lokalnej daty
                    onChange={handleDateChange} // Obsługa zmiany daty
                />
                <Button
                    variant="contained"
                    onClick={handleSaveDate} // Zapisujemy datę
                    disabled={
                        isFirstRender || // Zablokowane przy pierwszym uruchomieniu
                        tempDate === rowData.OSTATECZNA_DATA_ROZLICZENIA // Zablokowane, jeśli brak zmian
                    }
                >
                    Zapisz
                </Button>
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
                        disabled={!managementNote}
                        variant="contained"
                        color="error"
                        onClick={() => setManagementNote("")}
                    >
                        Usuń
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => handleAddManagementNote(managementNote, "")}
                        disabled={!managementNote}
                    >
                        Dodaj
                    </Button>
                </section>
            </section>

        </section>
    );
};

export default EditDataManagement;
