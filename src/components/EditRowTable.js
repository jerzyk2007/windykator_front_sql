import { useState, useEffect } from 'react';
import useData from "./hooks/useData";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import './EditRowTable.css';

const EditRowTable = ({ dataRowTable, setDataRowTable, documents, setDocuments }) => {
    const { auth } = useData();
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [rowData, setRowData] = useState(dataRowTable);
    const [note, setNote] = useState('');

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
                            <span>Faktura:</span>
                            <span>{rowData.NUMER_FV}</span>
                        </section>

                        <section className='edit_row_table-section-data--document'>
                            <span>Data wystawienia:</span>
                            <span>{rowData.DATA_FV}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span>Termin płatności:</span>
                            <span>{rowData.TERMIN}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span>Po terminie:</span>
                            <span
                                style={rowData.ILE_DNI_PO_TERMINIE > 0 ? { backgroundColor: "#f04545" } : null}
                            >{rowData.ILE_DNI_PO_TERMINIE
                                }</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span>Wprowadź kwotę brutto:</span>
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
                            <span>Kwota Brutto:</span>
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
                            <span>{(rowData.DO_ROZLICZENIA).toLocaleString('pl-PL', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                useGrouping: true,
                            })}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span>100% VAT:</span>
                            <span
                                style={Math.abs((rowData.BRUTTO - rowData.NETTO) - rowData.DO_ROZLICZENIA) <= 1 ? { backgroundColor: "#f04545" } : null}
                            >{(rowData.BRUTTO - rowData.NETTO).toLocaleString('pl-PL', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                useGrouping: true,
                            })}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span>50% VAT:</span>
                            <span
                                style={Math.abs((rowData.BRUTTO - rowData.NETTO) / 1.23 - rowData.DO_ROZLICZENIA) <= 1 ? { backgroundColor: "#f04545" } : null}
                            >{((rowData.BRUTTO - rowData.NETTO) / 1.23).toLocaleString('pl-PL', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                                useGrouping: true,
                            })}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span>Nr szkody:</span>
                            <span>{rowData.NR_SZKODY}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span>Nr rejestracyjny:</span>
                            <span>{rowData.NR_REJESTRACYJNY}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span>Doradca:</span>
                            <span>{rowData.DORADCA}</span>
                        </section>
                        <section className='edit_row_table-section-data--document'>
                            <span>Kontrahent:</span>
                            <span>{rowData.KONTRAHENT}</span>
                        </section>
                    </section>
                    <section className='edit_row_table-section-data'>
                        <section className='edit_row_table-section-data__chat'>
                            <h4 className='edit_row_table-section-data__chat-title'>Działanie podjęte przez {rowData.DZIAL}</h4>

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
                    <section className='edit_row_table-section-data'>
                        <section className='edit_row_table-section-data-law'>
                            <h4 className='edit_row_table-section-data-law--title'>Wybierz kancelarię:</h4>

                            <select
                                className='edit_row_table-section-data-law--select'
                                value={rowData.JAKA_KANCELARIA ? rowData.JAKA_KANCELARIA : ''}
                                onChange={(e) => setRowData(prev => {
                                    return {
                                        ...prev,
                                        JAKA_KANCELARIA: e.target.value
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
                                <option value="PZU-UGODA">Przekazano do PZU-UGODA</option>
                                <option value="Postępowanie Sanacyjne">Postępowanie Sanacyjne</option>
                            </select>
                        </section>
                        <section className='edit_row_table-section-data-actions'>
                            <h4 className='edit_row_table-section-data-actions--title'>Rodzaj działania:</h4>

                            <select
                                className='edit_row_table-section-data-actions--select'
                                value={rowData.DZIALANIA ? rowData.DZIALANIA : ''}
                                onChange={(e) => setRowData(prev => {
                                    return {
                                        ...prev,
                                        DZIALANIA: e.target.value
                                    };
                                })}
                            >
                                <option value=""></option>
                                <option value="W koszty działu">W koszty działu</option>
                                <option value="Do korekty">Do korekty</option>
                                <option value="Przygotować wezwanie">Przygotować wezwanie</option>
                                <option value="Wysłano wezwanie">Wysłano wezwanie</option>
                                <option value="Do decyzji kierownika">Do decyzji kierownika</option>
                                <option value="Działania windykacja BL">Działania windykacja BL</option>
                                <option value="Do ugody PZU">Do ugody PZU</option>
                                <option value="Przekazano do ugody PZU">Przekazano do ugody PZU</option>
                            </select>
                        </section>

                        {/* poprawić klasy, value i onChange */}
                        <section className='edit_row_table-section-data-actions'>
                            <h4 className='edit_row_table-section-data-actions--title'>Błąd doradcy:</h4>

                            <select
                                className='edit_row_table-section-data-actions--select'
                                value={rowData.BLAD_DORADCY ? rowData.BLAD_DORADCY : ''}
                                onChange={(e) => setRowData(prev => {
                                    return {
                                        ...prev,
                                        BLAD_DORADCY: e.target.value
                                    };
                                })}
                            >
                                <option value="false">Nie</option>
                                <option value="true">Tak</option>
                            </select>
                        </section>

                        {/* poprawić klasy, value i onChange */}
                        <section className='edit_row_table-section-data-actions'>
                            <h4 className='edit_row_table-section-data-actions--title'>Błędy w dokumentacji:</h4>

                            <select
                                className='edit_row_table-section-data-actions--select'
                                value={rowData.BLAD_W_DOKUMENTACJI ? rowData.BLAD_W_DOKUMENTACJI : ''}
                                onChange={(e) => setRowData(prev => {
                                    return {
                                        ...prev,
                                        BLAD_W_DOKUMENTACJI: e.target.value
                                    };
                                })}
                            >
                                <option value="false">Nie</option>
                                <option value="true">Tak</option>
                            </select>
                        </section>

                        {/* poprawić klasy, value i onChange */}
                        <section className='edit_row_table-section-data-actions'>
                            <h4 className='edit_row_table-section-data-actions--title'>Pobrany VAT ?</h4>

                            <select
                                className='edit_row_table-section-data-actions--select'
                                value={rowData.POBRANO_VAT ? rowData.POBRANO_VAT : ''}
                                onChange={(e) => setRowData(prev => {
                                    return {
                                        ...prev,
                                        POBRANO_VAT: e.target.value
                                    };
                                })}
                            >
                                <option value="false">Nie dotyczy</option>
                                <option value="true">Tak</option>
                                <option value="50">Nie pobrano 50%</option>
                                <option value="100">Nie pobrano 100%</option>
                            </select>
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