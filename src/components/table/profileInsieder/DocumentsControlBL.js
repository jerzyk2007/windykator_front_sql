import './DocumentsControlBL.css';

const DocumentsControlBL = ({ documentControlBL, setDocumentControlBL }) => {
    return (
        <section className="edit_doc documentControlBLs_control">
            <section className="edit_doc documentControlBLs_control__container">
                <section className="edit_doc__container">
                    <span className="edit_doc--title">
                        Dowód rejestracyjny:
                    </span>
                    <select
                        className="edit_doc--select"
                        value={documentControlBL.dowodRejestr}
                        onChange={(e) => {
                            setDocumentControlBL(prev => {
                                return {
                                    ...prev,
                                    dowodRejestr: e.target.value === "NULL" ? false : e.target.options[e.target.selectedIndex].text,
                                };
                            });
                        }}
                    >
                        <option value="NULL"></option>
                        <option value="BRAK">BRAK</option>
                        <option value="JEST">JEST</option>
                    </select>
                </section>
                <section className="edit_doc__container">
                    <span className="edit_doc--title">
                        Upoważnienie:
                    </span>
                    <select
                        className="edit_doc--select"
                        value={documentControlBL.upowaznienie}
                        onChange={(e) => {
                            setDocumentControlBL(prev => {
                                return {
                                    ...prev,
                                    upowaznienie: e.target.value === "NULL" ? false : e.target.options[e.target.selectedIndex].text,
                                };
                            });
                        }}
                    >
                        <option value="NULL"></option>
                        <option value="BRAK">BRAK</option>
                        <option value="JEST">JEST</option>
                    </select>
                </section>
                <section className="edit_doc__container">
                    <span className="edit_doc--title">
                        Oświadczenie o VAT:
                    </span>
                    <select
                        className="edit_doc--select"
                        value={documentControlBL.oswiadczenieVAT}
                        onChange={(e) => {
                            setDocumentControlBL(prev => {
                                return {
                                    ...prev,
                                    oswiadczenieVAT: e.target.value === "NULL" ? false : e.target.options[e.target.selectedIndex].text,
                                };
                            });
                        }}
                    >
                        <option value="NULL"></option>
                        <option value="BRAK">BRAK</option>
                        <option value="JEST">JEST</option>
                    </select>
                </section>
                <section className="edit_doc__container">
                    <span className="edit_doc--title">
                        Prawo jazdy:
                    </span>
                    <select
                        className="edit_doc--select"
                        value={documentControlBL.prawoJazdy}
                        onChange={(e) => {
                            setDocumentControlBL((prev) => ({
                                ...prev,
                                prawoJazdy: e.target.value === "NULL" ? false : e.target.options[e.target.selectedIndex].text,
                            }));
                        }}
                    >
                        <option value="NULL"></option>
                        <option value="BRAK">BRAK</option>
                        <option value="JEST">JEST</option>
                    </select>
                </section>

                <section className="edit_doc__container">
                    <span className="edit_doc--title">
                        Polisa AC:
                    </span>
                    <select
                        className="edit_doc--select"
                        value={documentControlBL.polisaAC}
                        onChange={(e) => {
                            setDocumentControlBL(prev => {
                                return {
                                    ...prev,
                                    polisaAC: e.target.value === "NULL" ? false : e.target.options[e.target.selectedIndex].text,
                                };
                            });
                        }}
                    >
                        <option value="NULL"></option>
                        <option value="BRAK">BRAK</option>
                        <option value="JEST">JEST</option>
                        <option value="NIE DOTYCZY">NIE DOTYCZY</option>
                    </select>
                </section>
                <section className="edit_doc__container">
                    <span className="edit_doc--title">
                        Decyzja TU:
                    </span>
                    <select
                        className="edit_doc--select"
                        value={documentControlBL.decyzja}
                        onChange={(e) => {
                            setDocumentControlBL(prev => {
                                return {
                                    ...prev,
                                    decyzja: e.target.value === "NULL" ? false : e.target.options[e.target.selectedIndex].text,
                                };
                            });
                        }}
                    >
                        <option value="NULL"></option>
                        <option value="BRAK">BRAK</option>
                        <option value="JEST">JEST</option>
                    </select>
                </section>
                <section className="edit_doc__container">
                    <span className="edit_doc--title">
                        Faktura:
                    </span>
                    <select
                        className="edit_doc--select"
                        value={documentControlBL.faktura}
                        onChange={(e) => {
                            setDocumentControlBL(prev => {
                                return {
                                    ...prev,
                                    faktura: e.target.value === "NULL" ? false : e.target.options[e.target.selectedIndex].text,
                                };
                            });
                        }}
                    >
                        <option value="NULL"></option>
                        <option value="BRAK">BRAK</option>
                        <option value="JEST">JEST</option>
                    </select>
                </section>
                <section className="edit_doc__container">
                    <span className="edit_doc--title">
                        Odpowiedzialność:
                    </span>
                    <select
                        className="edit_doc--select"
                        value={documentControlBL.odpowiedzialnosc}
                        onChange={(e) => {
                            setDocumentControlBL(prev => {
                                return {
                                    ...prev,
                                    odpowiedzialnosc: e.target.value === "NULL" ? false : e.target.options[e.target.selectedIndex].text,
                                };
                            });
                        }}
                    >
                        <option value="NULL"></option>
                        <option value="BRAK">BRAK</option>
                        <option value="JEST">JEST</option>
                    </select>
                </section>
                <section className="edit_doc__container">
                    <span className="edit_doc--title">
                        Płatność VAT:
                    </span>
                    <select
                        className="edit_doc--select"
                        value={documentControlBL.platnoscVAT}
                        onChange={(e) => {
                            setDocumentControlBL(prev => {
                                return {
                                    ...prev,
                                    platnoscVAT: e.target.value === "NULL" ? false : e.target.value
                                };
                            });
                        }}
                    >
                        <option value="NULL"></option>
                        <option value="NIE DOTYCZY">NIE DOTYCZY</option>
                        <option value="PŁATNOŚĆ ODROCZONA">PŁATNOŚĆ ODROCZONA</option>
                        <option value="POBRANY">POBRANY</option>
                        <option value="NIE POBRANY 50%">NIE POBRANY 50%</option>
                        <option value="NIE POBRANY 100%">NIE POBRANY 100%</option>
                    </select>
                </section>
                <section className="edit_doc__container">
                    <span className="edit_doc--title">
                        Działania od ostatniej kontroli:
                    </span>
                    <select
                        className="edit_doc--select"
                        value={documentControlBL.zmianyOstatniaKontrola}
                        onChange={(e) => {
                            setDocumentControlBL(prev => {
                                return {
                                    ...prev,
                                    zmianyOstatniaKontrola: e.target.value === "NULL" ? false : e.target.value
                                };
                            });
                        }}
                    >
                        <option value="NULL"></option>
                        <option value="BRAK DZIAŁAŃ">BRAK DZIAŁAŃ</option>
                        <option value="PODJĘTO DZIAŁANIA">PODJĘTO DZIAŁANIA</option>
                        <option value="NIE DOTYCZY">NIE DOTYCZY</option>
                    </select>
                </section>
            </section>

        </section>
    );
};

export default DocumentsControlBL;