import { useState } from 'react';
import './QuickTableNote.css';

const QuickTableNote = ({ quickNote, setQuickNote, documents, setDocuments }) => {

    const [note, setNote] = useState('');

    const handleAddNote = () => {
        const { _id, UWAGI } = quickNote;
        const newRow = { ...quickNote, UWAGI: quickNote.UWAGI ? quickNote.UWAGI + note : note };
        const newDocuments = documents.map(item => {
            if (item._id === _id) {
                return newRow;
            } else {
                return item;
            }
        });
        setDocuments(newDocuments);
        setQuickNote('');
    };

    return (
        <section className='quick_table_note'>
            <section className='quick_table_note__container'            >
                <span>{quickNote.NUMER}</span>
                <textarea
                    name=""
                    id=""
                    cols="10"
                    rows="10"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                ></textarea>
                <section>
                    <button onClick={() => setQuickNote('')}>Anuluj</button>
                    <button onClick={handleAddNote}>Zapisz</button>
                </section>
            </section>
        </section>
    );
};

export default QuickTableNote;