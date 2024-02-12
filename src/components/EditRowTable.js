import { useState } from 'react';
import useData from "./hooks/useData";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import './EditRowTable.css';

const EditRowTable = ({ dataRowTable, setDataRowTable, documents, setDocuments }) => {
    const { auth } = useData();
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [rowData, setRowData] = useState(dataRowTable);
    const [toggleState, setToggleState] = useState(1);
    const [note, setNote] = useState('');

    const toggleTab = (index) => {
        setToggleState(index);
    };

    const handleAddNote = () => {
        const oldNote = rowData.UWAGI;

        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        let newNote = [];
        let addNote = `${formattedDate} - ${auth.usersurname} - ${note}`;
        if (oldNote) {
            newNote = [...oldNote, addNote];
        } else {
            newNote = [addNote];
        }

        setRowData(prev => {
            return {
                ...prev,
                UWAGI: newNote
            };
        });
        setNote('');
    };

    const handleSaveData = async () => {
        const { _id } = rowData;

        const newDocuments = documents.map(item => {
            if (item._id === _id) {
                return rowData;
            } else {
                return item;
            }
        });

        try {
            const result = await axiosPrivateIntercept.patch(`/documents/change-single-document/${auth._id}`, {
                _id, documentItem: rowData
            });

            setDocuments(newDocuments);
            setDataRowTable('');
        }
        catch (err) {
            console.log(err);
        }

    };

    return (
        <section className='edit_row_table'>

            <section className='edit_row_table__container'>
                <section className='edit_row_table__bloc-tabs'>
                    <button
                        className={toggleState === 1 ? "edit_row_table-tabs active-tabs" : "edit_row_table-tabs"}
                        onClick={() => toggleTab(1)}>
                        Dział {rowData.DZIAL}
                        {/* {data.DZIAL} */}
                    </button>
                    <button
                        className={toggleState === 2 ? "edit_row_table-tabs active-tabs" : "edit_row_table-tabs"}
                        onClick={() => toggleTab(2)}>
                        Windykacja - ???
                    </button>
                    <button
                        className={toggleState === 3 ? "edit_row_table-tabs active-tabs" : "edit_row_table-tabs"}
                        onClick={() => toggleTab(3)}>
                        Kancelaria - ???
                    </button>
                </section>

                <section className='edit_row_table-content-tabs'>
                    <section
                        className={
                            toggleState === 1 ? "edit_row_table-content  active-content" : "edit_row_table-content"
                        }>
                        <section className='edit_row_table-section-content'>
                            <section className='edit_row_table-section-data'>
                                <section className='edit_row_table-section-data__documents'>
                                    <section className='edit_row_table-section-data--document'>
                                        <span>Faktura:</span>
                                        <span>{rowData.NUMER}</span>
                                    </section>

                                    <section className='edit_row_table-section-data--document'>
                                        <span>Data wystawienia:</span>
                                        <span>{rowData.DATAFV}</span>
                                    </section>
                                    <section className='edit_row_table-section-data--document'>
                                        <span>Termin płatności:</span>
                                        <span>{rowData.TERMIN}</span>
                                    </section>
                                    <section className='edit_row_table-section-data--document'>
                                        <span>Po terminie:</span>
                                        <span
                                            style={rowData.ILEDNIPOTERMINIE > 0 ? { backgroundColor: "#f04545" } : null}
                                        >{rowData.ILEDNIPOTERMINIE
                                            }</span>
                                    </section>
                                    <section className='edit_row_table-section-data--document'>
                                        <span>Kwota brutto:</span>
                                        <span>{(rowData.BRUTTO).toLocaleString('pl-PL', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                            useGrouping: true,
                                        })}</span>
                                    </section>
                                    <section className='edit_row_table-section-data--document'>
                                        <span>Kwota netto:</span>
                                        <span>{(rowData.NETTO).toLocaleString('pl-PL', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                            useGrouping: true,
                                        })}</span>
                                    </section>
                                    <section className='edit_row_table-section-data--document'>
                                        <span>Do rozliczenia:</span>
                                        <span>{(rowData.DOROZLICZ).toLocaleString('pl-PL', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                            useGrouping: true,
                                        })}</span>
                                    </section>
                                    <section className='edit_row_table-section-data--document'>
                                        <span>Nr szkody:</span>
                                        <span>{rowData.NRSZKODY}</span>
                                    </section>
                                    <section className='edit_row_table-section-data--document'>
                                        <span>Doradca:</span>
                                        <span>{rowData.ZATWIERDZIL}</span>
                                    </section>
                                    <section className='edit_row_table-section-data--document'>
                                        <span>Kontrahent:</span>
                                        <span>{rowData.KONTRAHENT}</span>
                                    </section>
                                    <section className='edit_row_table-section-data--document'>
                                        <span>Nr rejestracyjny:</span>
                                        <span>{rowData.NRREJESTRACYJNY}</span>
                                    </section>
                                </section>
                            </section>
                            <section className='edit_row_table-section-data'>
                                <section className='edit_row_table-section-data__chat'>
                                    <h4 className='edit_row_table-section-data__chat-title'>Działanie podjęte przez {rowData.DZIAL}</h4>

                                    <textarea
                                        className='edit_row_table-section-data__chat-content'
                                        readOnly
                                        value={rowData.UWAGI ? rowData.UWAGI.join('\n') : ''}
                                    >
                                    </textarea>
                                    <textarea
                                        className='edit_row_table-section-data__chat-edit'
                                        placeholder='dodaj informacje'
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    />
                                    <section className='edit_row_table-section-data__panel'>
                                        <Button
                                            variant='contained'
                                            color='error'
                                            onClick={() => setNote('')}
                                        >
                                            Usuń
                                        </Button>
                                        <Button variant='contained'
                                            onClick={handleAddNote}
                                            disabled={!note ? true : false}
                                        >
                                            Dodaj
                                        </Button>
                                    </section>
                                </section>
                            </section>
                            <section className='edit_row_table-section-data'>
                                <section className='edit_row_table-section-data-law'>
                                    <h4 className='edit_row_table-section-data-law--title'>Wybierz kancelarię:</h4>

                                    <select
                                        className='edit_row_table-section-data-law--select'
                                        value={rowData.JAKAKANCELARIA ? rowData.JAKAKANCELARIA : ''}
                                        onChange={(e) => setRowData(prev => {
                                            return {
                                                ...prev,
                                                JAKAKANCELARIA: e.target.value
                                            };
                                        })}
                                    >
                                        <option value=""></option>
                                        <option value="ROK-KONOPA">ROK-KONOPA</option>
                                        <option value="CNP">CNP</option>
                                        <option value="MLEGAL">MLEGAL</option>
                                        <option value="INKASO">INKASO</option>
                                        <option value="Kancelaria Krotoski">Kancelaria Krotoski</option>
                                        <option value="Krauze">Krauze</option>
                                        <option value="Nie przekazano do RK">Nie przekazano do RK</option>
                                        <option value="PZU-UGODA">PZU-UGODA</option>
                                        <option value="Postępowanie Sanacyjne">Postępowanie Sanacyjne</option>
                                    </select>
                                </section>

                            </section>
                        </section>
                    </section>
                    <section
                        className={
                            toggleState === 2 ? "edit_row_table-content  active-content" : "edit_row_table-content"
                        }>
                        <section className='edit_row_table-section-content'>

                        </section>
                    </section>
                    <section
                        className={
                            toggleState === 3 ? "edit_row_table-content  active-content" : "edit_row_table-content"
                        }>
                        <section className='edit_row_table-section-content'>

                        </section>
                    </section>
                </section>
            </section>
            <section className='edit_row_table-panel'>

                <Button
                    className='mui-button'
                    variant='contained'
                    size='large'
                    color='error'
                    onClick={() => setDataRowTable('')}
                >
                    Anuluj
                </Button>
                <Button
                    className='mui-button'
                    variant='contained'
                    size='large'
                    color='success'
                    onClick={handleSaveData}
                >
                    Zatwierdź
                </Button>
            </section>
        </section >
    );
};

export default EditRowTable;