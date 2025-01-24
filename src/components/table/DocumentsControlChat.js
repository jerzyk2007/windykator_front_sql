import { useRef, useEffect } from "react";
import { Button } from "@mui/material";
import "./DocumentsControlChat.css";

const DocumentsControlChat = ({ usersurname, controlChat, setControlChat }) => {
    const textareaRef = useRef(null);
    // console.log(controlChat);
    const controlsNote = (text) => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        let newNote = [];
        let addNote = `${formattedDate} - ${usersurname} - ${text}`;
        if (controlChat.chat.length) {
            newNote = [...controlChat.chat, addNote];
        } else {
            newNote = [addNote];
        }
        setControlChat({
            note: '',
            chat: newNote
        });
    };

    // Funkcja przewijająca do dołu
    const scrollToBottom = () => {
        if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [controlChat.chat]);

    return (
        <section className="edit-doc-chat">
            <span className="edit-doc-chat--title documents_control_chat-chat--title">
                Uwagi dotyczące kontroli dokumentów
            </span>

            <textarea
                ref={textareaRef}
                className="edit-doc-chat--content"
                readOnly
                value={controlChat.chat.length ? controlChat.chat.join("\n") : ""}
            ></textarea>
            <textarea
                className="edit-doc-chat--edit"
                placeholder="dodaj informacje"
                value={controlChat.note}
                onChange={(e) => setControlChat(prev => {
                    return {
                        ...prev,
                        note: e.target.value
                    };
                })}
            />
            <section className="edit-doc-chat__panel">
                <Button
                    disabled={!controlChat.note ? true : false}
                    variant="contained"
                    color="error"
                    onClick={() => setControlChat(prev => {
                        return {
                            ...prev,
                            note: ""
                        };
                    })}
                >
                    Usuń
                </Button>
                <Button
                    variant="contained"
                    onClick={() => controlsNote(controlChat.note)}
                    disabled={!controlChat.note ? true : false}
                >
                    Dodaj
                </Button>
            </section>
        </section>
    );
};

export default DocumentsControlChat;
