import { useState, useEffect } from 'react';
import useData from "./hooks/useData";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import EditDocAction from './EditDocAction';
import EditDocBeCared from './EditDocBeCared';
import './EditRowTable.css';

const EditRowTable = ({ dataRowTable, setDataRowTable, documents, setDocuments }) => {
    const { auth } = useData();
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [rowData, setRowData] = useState(dataRowTable);
    const [note, setNote] = useState('');
    const [beCared, setBeCared] = useState(false);

    const handleAddNote = () => {
        const oldNote = rowData.UWAGI_ASYSTENT;
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
                UWAGI_ASYSTENT: newNote
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

                <section className='edit_row_table-section-content'>
                    <section className='edit_row_table-section-data'>
                        <section className='edit_row_table-section-data--document'>
                            <span className='edit_row_table-section-data--title'>Faktura:</span>
                            <span className='edit_row_table-section-data--content'>{rowData.NUMER_FV}</span>
                        </section>

                        <section className='edit_row_table-section-data--document'>
                            <span className='edit_row_table-section-data--title'>Data wystawienia:</span>
                            <span className='edit_row_table-section-data--content'>{rowData.DATA_FV}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span className='edit_row_table-section-data--title'>Termin płatności:</span>
                            <span className='edit_row_table-section-data--content'>{rowData.TERMIN}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span className='edit_row_table-section-data--title'>Po terminie:</span>
                            <span
                                className='edit_row_table-section-data--content'
                                style={rowData.ILE_DNI_PO_TERMINIE > 0 ? { backgroundColor: "rgba(240, 69, 69, .7)" } : null}
                            >{rowData.ILE_DNI_PO_TERMINIE
                                }</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span className='edit_row_table-section-data--title'>Wprowadź kwotę brutto:</span>
                            <input
                                className='edit_row_table-section-data--document--input'
                                type="number"
                                value={rowData.BRUTTO}
                                onChange={(e) => setRowData(prev => {
                                    return {
                                        ...prev,
                                        BRUTTO: Number(e.target.value),
                                        NETTO: Number((e.target.value) / 1.23),
                                        "100_VAT": Number(e.target.value) - Number((e.target.value) / 1.23),
                                        "50_VAT": (Number(e.target.value) - Number((e.target.value) / 1.23)) / 2
                                    };
                                })}
                            />
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span className='edit_row_table-section-data--title'>Kwota Brutto:</span>
                            <span className='edit_row_table-section-data--content'>{(rowData.BRUTTO).toLocaleString('pl-PL', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                useGrouping: true,
                            })}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span className='edit_row_table-section-data--title'>Kwota netto:</span>
                            <span className='edit_row_table-section-data--content'>{(rowData.NETTO).toLocaleString('pl-PL', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                useGrouping: true,
                            })}</span>
                        </section>

                        <section className='edit_row_table-section-data--document'>
                            <span className='edit_row_table-section-data--title'>100% VAT:</span>
                            <span
                                className='edit_row_table-section-data--content'
                                style={Math.abs((rowData.BRUTTO - rowData.NETTO) - rowData.DO_ROZLICZENIA) <= 1 ? { backgroundColor: "rgba(240, 69, 69, .7)" } : null}
                            >{(rowData.BRUTTO - rowData.NETTO).toLocaleString('pl-PL', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                useGrouping: true,
                            })}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span className='edit_row_table-section-data--title'>50% VAT:</span>
                            <span
                                className='edit_row_table-section-data--content'
                                style={Math.abs((rowData.BRUTTO - rowData.NETTO) / 2 - rowData.DO_ROZLICZENIA) <= 1 ? { backgroundColor: "rgba(240, 69, 69, .7)" } : null}
                            >{((rowData.BRUTTO - rowData.NETTO) / 2).toLocaleString('pl-PL', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                useGrouping: true,
                            })}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span className='edit_row_table-section-data--title'>Do rozliczenia:</span>
                            <span
                                className='edit_row_table-section-data--content'
                                style={{ backgroundColor: 'rgba(248, 255, 152, .6)' }}>{(rowData.DO_ROZLICZENIA).toLocaleString('pl-PL', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                    useGrouping: true,
                                })}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span className='edit_row_table-section-data--title'>Nr szkody:</span>
                            <span className='edit_row_table-section-data--content'>{rowData.NR_SZKODY}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span className='edit_row_table-section-data--title'>Nr rejestracyjny:</span>
                            <span className='edit_row_table-section-data--content'>{rowData.NR_REJESTRACYJNY}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span className='edit_row_table-section-data--title'>Doradca:</span>
                            <span className='edit_row_table-section-data--content'>{rowData.DORADCA}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span className='edit_row_table-section-data--title'>Kontrahent:</span>
                            <span className='edit_row_table-section-data--content'>{rowData.KONTRAHENT}</span>
                        </section>
                    </section>
                    <section className='edit_row_table-section-data'>
                        <section className='edit_row_table-section-data__chat'>
                            <span className='edit_row_table-section-data__chat-title'>Działanie podjęte przez {rowData.DZIAL}</span>

                            <textarea
                                className='edit_row_table-section-data__chat-content'
                                readOnly
                                value={rowData.UWAGI_ASYSTENT ? rowData.UWAGI_ASYSTENT.join('\n') : ''}
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


                    {!beCared && <EditDocAction
                        rowData={rowData}
                        setRowData={setRowData}
                        setBeCared={setBeCared}
                    />}
                    {beCared && <EditDocBeCared
                        rowData={rowData}
                        setRowData={setRowData}
                        setBeCared={setBeCared}
                    />}

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