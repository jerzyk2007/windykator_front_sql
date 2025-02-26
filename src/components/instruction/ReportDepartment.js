import { FcInfo } from "react-icons/fc";
import './InstructionCustom.css';

const ReportDepartment = ({ setSelectedMenuItem }) => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Raport Działu</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_custom-content--text'>Jeżeli masz dostęp do więcej niż jednego działu, system wyświetli dodatkowe podsumowanie, obejmujące wszystkie dostępne dla Ciebie działy. Zestawienie to pozwoli na szybki przegląd danych z różnych obszarów w jednym miejscu. Widok ten jest generowany automatycznie na podstawie Twoich uprawnień i obejmuje wszystkie sekcje, do których masz dostęp. Dzięki temu możesz analizować informacje w szerszym kontekście bez konieczności przełączania się między poszczególnymi działami.
                </span>
                <span className='instruction_custom-content--text'>Jeśli chodzi o kolejność kolumn, ich ukrywanie oraz przypinanie, funkcjonalność działa identycznie jak w tabeli z dokumentami. Możesz dowolnie zmieniać układ kolumn, dostosowując widok do własnych potrzeb. Opcje przypinania pozwalają na utrzymanie wybranych kolumn w stałej pozycji, niezależnie od przewijania. Mechanizm ten zapewnia spójność działania i ułatwia pracę z danymi w różnych sekcjach systemu.
                </span>
                <span className='instruction_custom-content--text'>Jeśli nie wiesz jak się poruszać po tabeli proszę zajrzyj tutaj:
                </span>
                <span className='instruction_custom-content--text'
                    style={{ textAlign: "center", color: "red", cursor: "pointer", textDecoration: "dashed" }}
                    onClick={() => setSelectedMenuItem(103)}
                >Instrukcja obsługi tabeli
                </span>
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/report_dep.png" alt="Logo" className="w-32 h-auto" />
                </div>
                <section className='instruction_component__wrapper'>
                    <FcInfo />
                    <span className='instruction_component-content--element'
                        style={{ margin: "0 20px" }}
                    >Wybierz przedział dat dla raportu:
                    </span>
                    <img src="/instruction_image/report_date.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50vw", height: "auto" }} />
                </section>
                <span className='instruction_custom-content--text'>Domyślnie zakres dat „od” i „do” jest automatycznie pobierany z dokumentów, do których masz dostęp. Możesz jednak w dowolnym momencie dostosować ten zakres, wybierając inne wartości zgodnie ze swoimi potrzebami. Zmiana dat pozwala na filtrowanie wyników i wyświetlanie tylko tych dokumentów, które mieszczą się w określonym przedziale czasowym. Dzięki temu masz pełną kontrolę nad zakresem analizowanych danych.
                </span>
                <span className='instruction_component-content--text'>Opis kolumn możliwych do włączenia w raporcie:
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Dział</span>
                    {` - numer działu,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Cele na ... kwartał </span>
                    {` - procentowe wartości, dodane wg ustaleń,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Stan należności w % - BL</span>
                    {` - (kolor pomarańczowy) ta kolumna dotyczy spraw Blacharskich – stosunek procentowy spraw przeterminowanych do wszystkich nierozliczonych bez uwzględnienia sprawę w sądach ale dotyczących spraw „PZU",`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Kwota przeterminowanych FV – BL</span>
                    {` - (kolor pomarańczowy) ta kolumna dotyczy spraw Blacharskich – wszystkie przeterminowane i nierozliczone faktury bez uwzględnienia spraw „PZU”,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Ilość przeterminowanych FV – BL</span>
                    {` - (kolor pomarańczowy) ta kolumna dotyczy spraw Blacharskich – ilość wszystkich przeterminowanych faktur bez uwzględnienia spraw „PZU”,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Kwota nieprzeterminowanych FV – BL </span>
                    {` - (kolor pomarańczowy) ta kolumna dotyczy spraw Blacharskich – wszystkie nieprzeterminowane faktury bez uwzględnienia spraw „PZU”,,
                    Stan wszystkich należności w % - (kolor zielony) stosunek procentowy spraw przeterminowanych do wszystkich nierozliczonych,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Kwota przeterminowanych FV</span>
                    {` - (kolor zielony) - wszystkie przeterminowane i nierozliczone faktury,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Ilość wszystkich przeterminowanych FV</span>
                    {` - (kolor zielony) - ilość wszystkich przeterminowanych faktur,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Kwota wszystkich nieprzeterminowanych FV</span>
                    {` - (kolor zielony) - wszystkie nieprzeterminowane faktury,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Stan należności bez kancelarii w %</span>
                    {` - (kolor niebieski) - stosunek procentowy spraw przeterminowanych do wszystkich nierozliczonych bez uwzględniania spraw w kancelarii MLegal, Incaso, Krotoski itp.,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Kwota przeterminowanych FV bez kancelarii</span>
                    {` - (kolor niebieski) - wszystkie przeterminowane i nierozliczone faktury bez uwzględnienia spraw w kancelarii MLegal, Incaso, Krotoski itp.,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Ilość przeterminowanych FV bez kancelarii</span>
                    {` - (kolor niebieski) - ilość wszystkich przeterminowanych faktur bez uwzględnienia spraw w kancelarii MLegal, Incaso, Krotoski itp.,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Kwota nieprzeterminowanych FV bez kancelarii</span>
                    {` - (kolor niebieski) - wszystkie nieprzeterminowane i nierozliczone faktury bez uwzględnienia spraw w kancelarii MLegal, Incaso, Krotoski itp.,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Kwota niepobranych VAT’ów</span>
                    {` - jeśli w edycji dokumentu zaznaczono niepobrany VAT to tutaj jest on zsumowany, dotyczy tylko spraw gdzie dokument nie jest jeszcze rozliczony,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Ilość niepobranych VAT’ów</span>
                    {` – jw. podana jest ilość takich spraw,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Kwota nierozliczonych FV</span>
                    {` - błędy doradcy i dokumentacji - jeśli w edycji dokumentu zaznaczono Błąd doradcy to tutaj jest on zsumowany, dotyczy tylko spraw gdzie dokument nie jest jeszcze rozliczony,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Ilość nierozliczonych FV</span>
                    {` - błędy Doradcy i dokumentacji - jw. podana jest ilość takich spraw,`}
                </span>
            </section>
        </section>
    );
};

export default ReportDepartment;