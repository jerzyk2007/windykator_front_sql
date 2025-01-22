import { useRef, useEffect } from "react";
import { Button } from "@mui/material";
import "./DocumentsControlChat.css";

const DocumentsControlChat = ({ documentControlNote, handleAddDocumentsControlNote, setDocumentControlNote, documentControlChat }) => {
    const textareaRef = useRef(null);

    // Funkcja przewijająca do dołu
    const scrollToBottom = () => {
        if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [documentControlChat]);

    return (
        <section className="edit-doc-chat">
            <span className="edit-doc-chat--title documents_control_chat-chat--title">
                Uwagi dotyczące kontroli dokumentów
            </span>

            <textarea
                ref={textareaRef}
                className="edit-doc-chat--content"
                readOnly
                value={documentControlChat.length ? documentControlChat.join("\n") : ""}
            ></textarea>
            <textarea
                className="edit-doc-chat--edit"
                placeholder="dodaj informacje"
                value={documentControlNote}
                onChange={(e) => setDocumentControlNote(e.target.value)}
            />
            <section className="edit-doc-chat__panel">
                <Button
                    disabled={!documentControlNote ? true : false}
                    variant="contained"
                    color="error"
                    onClick={() => setDocumentControlNote("")}
                >
                    Usuń
                </Button>
                <Button
                    variant="contained"
                    onClick={() => handleAddDocumentsControlNote(documentControlNote)}
                    disabled={!documentControlNote ? true : false}
                >
                    Dodaj
                </Button>
            </section>
        </section>
    );
};

export default DocumentsControlChat;
