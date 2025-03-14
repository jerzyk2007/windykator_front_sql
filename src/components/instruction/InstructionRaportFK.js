import { FcInfo } from "react-icons/fc";

const InstructionRaportFK = () => {
    return (
        <section className='instruction_component'>
            <section className='instruction_component-title'>
                <label>Raport Należności przeterminowanych - decyzje biznesu</label>
            </section>
            <section className='instruction_component-content'>
                <span className='instruction_component-content--text'>Dwa razy w miesiącu otrzymasz od Działu Nadzoru i Kontroli Należności raport dotyczący przeterminowanych należności. Wymagane jest podjęcie decyzji biznesowej, która wyjaśni, dlaczego płatność nie została uregulowana w terminie oraz jakie działania podjął Twój dział, aby rozliczyć ją w zadeklarowanym czasie. Oprócz decyzji biznesowej należy określić ostateczną datę rozliczenia dokumentu – powinna ona wskazywać maksymalny termin, w którym płatność zostanie uregulowana.
                </span>
                <span className='instruction_component-content--text'>Sprawdź, czy w menu dostępna jest opcja <span style={{ fontWeight: 'bold' }}>Tabelka / Dokumenty Raportu FK.</span> <br />
                    Jeśli nie widzisz tej pozycji zwróć się do Działu Nadzoru i Kontroli Należności o nadanie odpowiednich uprawnień.
                </span>
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/report_draft_menu.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "20vw" }} />
                </div>

                <br />
                <span className='instruction_component-content--text'>Zostanie wyświetlona tabela ze wszystkimi dokumentami dla których masz podjąć decyzję biznesową. <br />
                    Jeżeli Tabelka będzie pusta to oznacza, ze Twój dział nie ma żadnych dokumentów dla których wymagana jest decyzja.
                </span>
                <br />
                <span className='instruction_component-content--text'>Należy wejść w edycję dokumentu i wybrać przycisk <span style={{ fontWeight: 'bold' }}>Raport FK</span>
                </span>
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/report_draft_button.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "40vw" }} />
                </div>

                <br />
                <span className='instruction_component-content--text'>W tym miejscu będziesz mógł wybrać ostateczną datę rozliczenia dokumentu oraz wpisać wyjaśnienie dotyczące przyczyny, dlaczego dokument nie został rozliczony, a także opisać kroki podjęte przez dział w celu jego rozliczenia.
                </span>
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/report_draft_addInfo.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "40vw" }} />
                </div>

                <br />
                <span className='instruction_component-content--text'>Datę ostatecznego rozliczenia możesz zmieniać wielokrotnie, jednak wszystkie wprowadzone przez Ciebie zmiany będą widoczne w ostatecznym raporcie.
                </span>
                <span className='instruction_component-content--text'>Tekst decyzji powinien zawierać wyjaśnienie, dlaczego sprawa nie została jeszcze rozliczona, oraz opis działań podjętych przez Twój dział w celu zapewnienia, że rozliczenie nastąpi zgodnie z deklarowaną ostateczną datą rozliczenia.
                </span>
                <br />

                <span className='instruction_component-content--text'>Przyciskiem <span style={{ fontWeight: 'bold' }}>Zatwierdź</span> zapisujesz zmiany, wychodzisz z educji dokumentu, powinieneś przejść do kolejnego dokumentu i kontynuować proces uzupełniania dat oraz decyzji, aż wszystkie dokumenty będą miały przypisaną ostateczną datę rozliczenia i decyzję.</span >
                <br />
                <span className='instruction_component-content--text'>Możesz również skorzystać z przycisków <span style={{ fontWeight: 'bold' }}>poprzedni / następny</span> dokument.
                </span>
                <section className='instruction_component__wrapper'>
                    <FcInfo />
                    <span className='instruction_component-content--element'
                        style={{ margin: "0 20px" }}
                    >Następny / poprzedni dokument:
                    </span>
                    <img src="/instruction_image/arrows.png" alt="Logo" className="w-32 h-auto" />
                </section>
                <br />
                <br />

            </section>

        </section>
    );
};

export default InstructionRaportFK;