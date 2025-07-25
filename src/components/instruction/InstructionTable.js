import { FcInfo } from "react-icons/fc";

const InstructionTable = () => {
    return (
        <section className='instruction_component'>
            <section className='instruction_component-title'>
                <label>Tabela</label>
            </section>
            <section className='instruction_component-content'>
                <span className='instruction_component-content--text'>Tabela w programie zapewnia zaawansowane funkcje umożliwiające intuicyjne i efektywne zarządzanie danymi. Użytkownik może dostosować widok do swoich potrzeb poprzez sortowanie, filtrowanie oraz dynamiczne zarządzanie kolumnami. Dzięki temu możliwe jest szybkie odnalezienie istotnych informacji i uporządkowanie danych zgodnie z określonymi kryteriami.
                </span>
                <span className='instruction_component-content--text'>Funkcja filtrowania pozwala na precyzyjne zawężenie wyników według wybranych wartości, a sortowanie umożliwia uporządkowanie danych w kolejności rosnącej lub malejącej. Użytkownik ma również pełną kontrolę nad strukturą tabeli – może ukrywać i ponownie wyświetlać kolumny, zmieniać ich kolejność oraz dostosowywać szerokość, co pozwala na optymalne wykorzystanie przestrzeni roboczej.
                </span>
                <span className='instruction_component-content--text'>Interfejs tabeli został zaprojektowany w sposób przejrzysty i przyjazny, co ułatwia nawigację oraz pracę z dużymi zbiorami danych. Wszystkie zmiany w układzie tabeli odbywają się w czasie rzeczywistym, zapewniając płynność działania i komfort użytkowania.
                </span>
                <span className='instruction_component-content--text'>Bez względu na opcję w menu która zostanie wybrana zostaną wczytane tylko te dane, do których jako użytkownik masz dostęp. Może się zdarzyć sytuacja, że pojawi się tabela z informacją brak danych – oznacza to, że nie ma żadnych danych, które mogą zostać wyświetlone.
                </span>

                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`a) `}
                    <span className='instruction_component-content--element'>Aktualne
                    </span>
                    {` – tylko dokumenty, których wartość do rozliczenia jest większa od zera,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`b) `}
                    <span className='instruction_component-content--element'>Pilne
                    </span>
                    {` – tylko dokumenty, których wartość do rozliczenia jest większa od zera, nie są w kancelarii i mają termin od minus 3 dni`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`c) `}
                    <span className='instruction_component-content--element'>Zobowiązania
                    </span>
                    {` - tylko dokumenty,  których wartość do rozliczenia jest mniejsza od zera (te dokumenty występują w Autostacji jako zobowiązania),`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`d) `}
                    <span className='instruction_component-content--element'>Archiwum
                    </span> {` - tylko dokumenty rozliczone, których wartość jest równa zero,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`e) `}
                    <span className='instruction_component-content--element'>Kpl dane
                    </span>
                    {` – zostaną wczytane wszystkie dokumenty (jeśli masz dostęp do wszystkich działów wczytane zostanie kilkaset tysięcy dokumentów, może to spowolnić działanie programu),`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`f) `}
                    <span className='instruction_component-content--element'>Dokumenty Raportu FK
                    </span>
                    {` – zostaną wczytane dokumenty, które zostały omówione w Raporcie FK i dla których dokumentów oczekiwane jest naniesienie decyzji biznesu oraz ostatecznej daty rozliczenia,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`g) `}
                    <span className='instruction_component-content--element'>Wyłączenia Raportu FK</span>
                    {` - niektóre dokumenty mogą zostać wyłączone z procesu  Raportowania FK, wybranie tej pozycji menu spowoduje wczytanie dokumentów „ręcznie” wyłączonych,`}
                </span>
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/table.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "100%" }} />
                </div>
                <br />
                <span className='instruction_component-content--title'>Opis poszczególnych elementów tabeli:
                </span>
                <section className='instruction_component__wrapper'>
                    <FcInfo />
                    <span className='instruction_component-content--element'
                        style={{ margin: "0 20px" }}
                    >Szukaj:
                    </span>
                    <img src="/instruction_image/szukaj.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50vw", height: "auto" }} />
                </section>
                <span className='instruction_component-content--text'>Wpisując odpowiednie frazy, słowa czy znaki zostaną wyświetlone tylko wiersze, które je zawierają, opcja szukaj ma ponadto możliwość zmiany wyszukiwania tekstu, po kliknięciu w lupę rozwinie się podmenu:
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`a) `}
                    <span className='instruction_component-content--element'>Rozmyte dopasowanie</span>
                    {` - program wyszukuje zbliżone frazy uwzględniając możliwe „literówki”, np. wpisując numer faktury jako VBL/1 (gdzie poprawną wartością jest UBL) zostaną wyszukane również faktury UBL,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`b) `}
                    <span className='instruction_component-content--element'>Zawiera</span>
                    {` – program wyszukuje dokładnie tych fraz i słów które istnieją w dokumencie, a zostały wpisane do okienka szukaj, jest to domyślna opcja wyszukiwania,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`c) `}
                    <span className='instruction_component-content--element'>Zaczyna się od</span>
                    {` – program wyszukuje tylko elementy, których wartość zaczyna się od frazy wpisanej, nie może być w środku tekstu.`}
                </span>
                <section className='instruction_component__wrapper'>
                    <FcInfo />
                    <span className='instruction_component-content--element'
                        style={{ margin: "0 20px" }}
                    >Tryb pełnoekranowy:
                    </span>
                    <img src="/instruction_image/fullscreen.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50vw", height: "auto" }} />
                </section>
                <span className='instruction_component-content--text'>Tabela może zostać powiększona do pełnej wartości okna, wyłączają menu
                </span>
                <section className='instruction_component__wrapper'>
                    <FcInfo />
                    <span className='instruction_component-content--element'
                        style={{ margin: "0 20px" }}
                    >Pokaż/ukryj kolumny:
                    </span>
                    <img src="/instruction_image/show_hide_columns.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50vw", height: "auto" }} />
                </section>
                <span className='instruction_component-content--text'>Ta opcja pozwala na pełną kontrolę nad wyświetlaną tabelą, dostępne opcje:
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`- `}
                    <span className='instruction_component-content--element'>ukryj wszystko</span>
                    {` – ukrywa wszystkie kolumny widoczne w tabeli,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`- `}
                    <span className='instruction_component-content--element'>resetuj kolejność</span>
                    {` – wszystkie zmiany, które użytkownik wprowadził przy zmianie kolejności kolumn zostaną zresetowane do ustawień początkowych,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`- `}
                    <span className='instruction_component-content--element'>odepnij wszystkie</span>
                    {` – wybrane kolumny można przypiąć do lewej lub prawej strony ekranu, będą one zawsze widoczne, bez względu na przewijanie ekranu, wyświetlanie innych kolumn itp.,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`- `}
                    <span className='instruction_component-content--element'>pokaż wszystkie</span>
                    {` – włącza widoczność wszystkich kolumn dostępnych dla użytkownika,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`- `}
                    <span className='instruction_component-content--element'>dwie poziome kreseczki</span>
                    {` - po lewej stronie pozwalają zamienić miejscami kolumny, żeby ustawić je w kolejności, która jest najbardziej oczekiwana od użytkownika (łapiemy lewym przyciskiem myszy i przeciągamy do góry lub do dołu),`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`- `}
                    <span className='instruction_component-content--element'>pinezki </span>
                    {` - kliknięcie w lewą przypina dokument do lewej strony ekranu, prawą do prawej, jeżeli przypniemy więcej niż jedną kolumnę to kolejność wyświetlanych kolumn zaczyna się od przypiętych, warto jednak przed przypięciem ustawić kolejność kolumny we właściwym miejscu. Będzie to miało znaczenie przy pobieraniu danych do pliku excel,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`- `}
                    <span className='instruction_component-content--element'>suwak </span>
                    {` - daje możliwość włączenia lub wyłączenia widoczności danej kolumny,`}
                </span>

                <span className='instruction_component-content--text'>Opis kolumn możliwych do włączenia w tabeli (kolumny są przypisane dla danych obszarów np. SERWIS, CZĘŚCI itd.) i użytkownik działu części może nie mieć możliwości włączenia kolumny
                    100VAT – zarezerwowanego dla BLACHARNI:
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>	100VAT</span>
                    {` kwota 100% podatku VAT dla danego dokumentu (jeśli brakująca kwota zgadza się z wartością 100VAT to komórka jest czerwona),`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>	50VAT</span>
                    {` kwota 100% podatku VAT dla danego dokumentu (jeśli brakująca kwota zgadza się z wartością 50VAT to komórka jest czerwona),`}
                </span>

                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Obszar</span>
                    {` filtrowanie wg obszaru: BLACHARNIA, CZĘŚCI itd.`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Błąd doradcy </span>
                    {` w przypadku edycji dokumentu możemy zaznaczyć i opisać pomyłkę Doradcy w procesowaniu i wystawianiu dokumentu, dzięki temu możemy wyfiltrować tylko sprawy z błędami i się nimi zająć,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>	Brutto</span>
                    {` kwota brutto dokumentu,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>P / N</span>
                    {` sprawy przeterminowane i nieprzeterminowane,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Data fv</span>
                    {` data wystawienia dokumentu,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Data komentarza Becared </span>
                    {` sprawy dotyczące spraw „blacharskich” w kancelarii,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>	Do rozl.</span>
                    {` kwota nierozliczona wg AS,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>	Doradca</span>
                    {` osoba przygotowująca dokument,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>	Dział</span>
                    {` D008, D117 itd.,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Rodzaj działania </span>
                    {` w edycji dokumentu możliwość sugerowanego działania w sprawie danego dokumentu,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Ile</span>
                    {` ile dni pozostało do terminu płatności lub ile dni po terminie (po terminie komórka jest czerwona,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Info dla Zarządu </span>
                    {` w przypadku uzupełnienia (w edycji dokumentu) pola „Informacja do przekazania dla Zarządu” to w tabelce będzie pokazany ostatni wpis,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Jaka kancelaria </span>
                    {` jeśli dokument jest już w kancelarii to wyświetli się nazwa,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Jaka kanc. TU </span>
                    {` jw. ale dotyczy tylko Blacharni i spraw sądowych związanych z PZU,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Komentarz kancelaria Becared </span>
                    {` dot Blacharni i spraw sądowych z PZU,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>	Kontrahent</span>
                    {` kontrahent z dokumentu,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Kwota windykowana Becared </span>
                    {` dot Blacharni i spraw sądowych z PZU,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>	Netto</span>
                    {` kwota netto dokumentu,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>NIP</span>
                    {` NIP kontrahenta,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Nr rejestr.</span>
                    {` numer rejestracyjny z dokumentu,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Nr szkody</span>
                    {` numer szkody wpisywany w zleceniu AS,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Faktura </span>
                    {` numer dokumentu,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Nr sprawy Becared </span>
                    {` dot Blacharni i spraw sądowych z PZU,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Ostateczna data rozliczenia</span>
                    {` data wskazana przez działa jako ostateczna data rozliczenia dokumentu,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Pobrano VAT ?</span>
                    {` w edycji dokumentu możliwość zaznaczenia w celu wyfiltrowania wszystkich spraw „VATowych”,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Status sprawy kancelaria </span>
                    {` status odczytywany z systemu Rubicon,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Status sprawy windykacja</span>
                    {` dot Blacharni i spraw sądowych z PZU,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Termin</span>
                    {` termin rozliczenia dokumentu,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Typ płatności</span>
                    {` Przelew, Gotówka itd.,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Podjęte działania</span>
                    {` pole tekstowe uzupełniane przez pracowników dotyczące wszystkich podjętych działań w sprawie rozliczenia dokumentu,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Uwagi z fv</span>
                    {` uwagi z dokumentu wg AS,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Zaznacz kontrahenta</span>
                    {` służy do wyróżnienia danego kontrahenta w tabeli,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>VIN</span>
                    {` numer VIN,`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`• `}
                    <span className='instruction_component-content--element'>Data wydania auta</span>
                    {` wartość odczytana z AS, dotyczy sprzedaży samochodów,`}
                </span>




                <section className='instruction_component__wrapper'>
                    <FcInfo />
                    <span className='instruction_component-content--element'
                        style={{ margin: "0 20px" }}
                    >Paginacja strony:
                    </span>
                    <img src="/instruction_image/pagination.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50vw", height: "auto" }} />
                </section>
                <span className='instruction_component-content--text'>Pozwala na swobodne przemieszczanie się między stronami tabeli, można również wybrać ile dokumentów ma się wyświetlać na stronie (od 10 do 100)
                </span>

                <section className='instruction_component__wrapper'>
                    <FcInfo />
                    <span className='instruction_component-content--element'
                        style={{ margin: "0 20px" }}
                    >Kopiowanie danych do schowka:
                    </span>
                    <img src="/instruction_image/ctrlC.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50vw", height: "auto" }} />
                </section>
                <span className='instruction_component-content--text'>kliknięcie lewym przyciskiem w wartość komórki kopiuje zawartość do schowka (taki ctrl+c).
                </span>

                <section className='instruction_component__wrapper'>
                    <FcInfo />
                    <span className='instruction_component-content--element'
                        style={{ margin: "0 20px" }}
                    >Zmiana szerokości kolumn:
                    </span>
                    <img src="/instruction_image/change_width.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50vw", height: "auto" }} />
                </section>
                <span className='instruction_component-content--text'>Zmiana szerokości kolumn – pomiędzy komórkami nagłówka, jest pogrubiona kreska, wystarczy „złapać” ja lewym przyciskiem myszy i zmniejszyć lub powiększyć kolumny, zmiana wielkość może spowodować zmniejszenie/powiększenie wysokości wierszy, w zależności ile danych się wyświetla w danej komórce.
                </span>

                <section className='instruction_component__wrapper'>
                    <FcInfo />
                    <span className='instruction_component-content--element'
                        style={{ margin: "0 20px" }}
                    >Sortowanie tabeli:
                    </span>
                    <img src="/instruction_image/sort.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50vw", height: "auto" }} />
                </section>
                <span className='instruction_component-content--text'>kliknięcie w nagłówek tabeli np. w kolumnę Faktura czy Data FV następuje sortowanie tabeli, od największych, od najmniejszych, trzeci kliknięcie to wyłączenie sortowania (kolejność sortowania wyznacza ikona strzałek).
                </span>

                <section className='instruction_component__wrapper'>
                    <FcInfo />
                    <span className='instruction_component-content--element'
                        style={{ margin: "0 20px" }}
                    >Filtrowanie tabeli:
                    </span>
                    <img src="/instruction_image/filtr.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50vw", height: "auto" }} />
                </section>
                <span className='instruction_component-content--text'>jeśli dla danej kolumny jest przewidziane filtrowanie to w komórce nagłówka znajduje się wyszarzony symbol lejka.<br />
                    I klikając w niego możemy filtrować tabelę wg przewidzianego filtra:
                    - w kolumnie z datami pojawiają się dwa okienka gdzie można wybrać datę początkową i końcową lub tylko pocztąkową/końcową
                    - filtr pojedynczego wyboru
                    - duża część filtrów to możliwość wielokrotnego wyboru (z podpowiedzią ile dokumentów otrzymamy)

                </span>

                <section className='instruction_component__wrapper'>
                    <FcInfo />
                    <span className='instruction_component-content--element'
                        style={{ margin: "0 20px" }}
                    >Ikony nad tabelą:
                    </span>
                    <img src="/instruction_image/icons_table.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50vw", height: "auto" }} />
                </section>

                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`- `}
                    <span className='instruction_component-content--element'>dyskietka</span>
                    {` - wszystkie zmiany, które mogłeś wprowadzić do tabeli (kolejność, widoczność itp.) zostaną usunięte po ponownym odświeżeniu stronu lub wyłączeniu i włączeniu przeglądarki. Czyli pewne zmiany dla chwilowej potrzeby możesz wykonać, a potem odświeżając stronę przywrócić je do stanu poprzedniego. Jeśli chcesz zachować wprowadzone zmiany na stałe kliknij na dyskietkę nad tabelą, jeśli dyskietka na chwilę zrobi się czerwona i „podskoczy” to zmiany zostały zapisane, jeśli nie to kliknij ponownie (być może tabela ma otwarte przez Ciebie filtry i należy najpierw z nich wyjść),`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`- `}
                    <span className='instruction_component-content--element'>excel - ikona zielona</span>
                    {` - pobiera wszystkie dane do pliku excel, które wyświetla dana tabela (bez względu na to czy jakieś kolumny są ukryte, włączone filtry itd),`}
                </span>
                <span className='instruction_component-content--text'
                    style={{ marginLeft: "20px" }}
                >{`- `}
                    <span className='instruction_component-content--element'>lejek - ikona niebieska</span>
                    {` - pobierane dane do pliku excel, z uwzględnieniem tego co wyświetla się w tabeli, jak tabela jest wyfiltrowana, które kolumny są ukryte.`}
                </span>
            </section>

        </section>
    );
};

export default InstructionTable;