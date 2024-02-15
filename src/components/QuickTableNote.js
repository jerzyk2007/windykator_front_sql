import { useState, useRef, useEffect } from 'react';
import useData from "./hooks/useData";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";

import './QuickTableNote.css';

const QuickTableNote = ({ quickNote, setQuickNote, documents, setDocuments }) => {
    const noteRef = useRef();

    const { auth } = useData();
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [note, setNote] = useState('');

    const handleAddNote = async () => {
        const { _id, UWAGI } = quickNote;
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        let newNote = [];
        let addNote = `${formattedDate} - ${auth.usersurname} - ${note}`;
        if (UWAGI) {
            newNote = [...UWAGI, addNote];
        } else {
            newNote = [addNote];
        }

        const newRow = { ...quickNote, UWAGI: newNote };
        const newDocuments = documents.map(item => {
            if (item._id === _id) {
                return newRow;
            } else {
                return item;
            }
        });

        try {
            const result = await axiosPrivateIntercept.patch(`/documents/change-single-document/${auth._id}`, {
                _id: quickNote._id, documentItem: newRow
            });
            setDocuments(newDocuments);
            setQuickNote('');
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        noteRef.current.focus();
    }, []);

    return (
        <section className='quick_table_note'>
            <section className='quick_table_note__container'>
                <section className='quick_table_note__container-title'>
                    <span className='quick_table_note__container-title--document'>Faktura: </span>
                    <span className='quick_table_note__container-title--document'>{quickNote.NUMER}</span>

                </section>

                <textarea
                    className='quick_table_note__container-edit'
                    ref={noteRef}
                    name=""
                    id=""
                    cols="10"
                    rows="10"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                ></textarea>
                <section className='quick_table_note__container-button'>
                    <button className='quick_table_note__container-button--cancel' onClick={() => setQuickNote('')}>Anuluj</button>
                    <button
                        className='quick_table_note__container-button--confirm'
                        onClick={handleAddNote}
                        disabled={!note ? true : false}
                    >Zapisz</button>
                </section>
            </section>
        </section>
    );
};

export default QuickTableNote;