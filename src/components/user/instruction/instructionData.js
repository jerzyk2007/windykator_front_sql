export const instructionData = {
  "intro-help": {
    title: "Zarządzaj windykacją bez wysiłku",
    subtitle: "Wprowadzenie do systemu",
    content: [
      "Aplikacja do obsługi windykacji to zaawansowane narzędzie, które umożliwia kompleksowe zarządzanie procesem windykacyjnym. Dzięki precyzyjnie określonym poziomom dostępu każdy użytkownik otrzymuje uprawnienia dopasowane do swojego zakresu obowiązków, co zapewnia wygodną i bezpieczną pracę.",
      "System pozwala na bieżące monitorowanie statusu wszystkich nierozliczonych dokumentów płatniczych, co umożliwia szybkie reagowanie na zaległe płatności. Oprócz obsługi dokumentów program generuje szczegółowe raporty, które pomagają analizować efektywność pracy zarówno poszczególnych działów, jak i indywidualnych pracowników.",
      "Użytkownicy mają dostęp do zawsze aktualnych informacji o nierozliczonych fakturach i rozliczeniach, które są w pełni zintegrowane z systemem Autostacja. Dzięki temu nie ma potrzeby ręcznego pobierania i porównywania danych z różnych źródeł, co znacznie ułatwia codzienną pracę.",
      "Wdrożenie tego rozwiązania to duży krok naprzód w porównaniu do wcześniejszych metod, takich jak ręczne prowadzenie ewidencji w arkuszach Excel. Aplikacja automatyzuje wiele procesów, oszczędza czas i zwiększa skuteczność działań windykacyjnych.",
    ],
    // image: "path/to/your/image.png", // Opcjonalne
  },
  "intro-history": {
    title: "Historia projektu",
    content: [
      "Projekt aplikacji do windykacji zrodził się z potrzeby usprawnienia procesów obsługi kilku działów blacharskich, które wcześniej opierały się na niewygodnych i nieefektywnych plikach Excel. Pliki te okazały się być niepraktyczne, zwłaszcza przy współpracy między oddziałami oraz w sytuacjach wymagających synchronizacji danych i łatwego dostępu do informacji.",
      "Pod koniec 2023 roku rozpocząłem prace nad pierwszymi wersjami kodu aplikacji. Celem było stworzenie narzędzia, które w pełni zastąpiłoby tradycyjne pliki Excel, automatyzując i uproszczając procesy związane z windykacją i obsługą dokumentacji. W 2024 roku aplikacja została wdrożona dla wszystkich oddziałów Blacharskich w Grupie Krotoski. Nowe rozwiązanie pozwoliło na znaczne zwiększenie efektywności pracy, eliminując problemy związane z błędami ludzkimi, chaosem danych czy utrudnionym dostępem do aktualnych informacji.",
      "Od momentu wdrożenia aplikacja jest nieustannie rozwijana. Dodawane są nowe funkcje, usprawnienia, a także wprowadzane zmiany wynikające z potrzeb użytkowników. Dzięki temu narzędzie staje się coraz bardziej zaawansowane i dostosowane do specyficznych wymagań branży, oferując coraz bardziej intuicyjną i wydajną obsługę procesów windykacyjnych.",
      "Jeśli masz jakieś uwagi dotyczące działania aplikacji lub pomysły dotyczącymi rozwoju programu to proszę, skontaktuj się ze mną.",
      "", // Pusty ciąg zadziała jak odstęp
      {
        text: "Jerzy Komorowski",
        bold: true,
        color: "#2c7ba8",
        align: "center",
      },
      {
        text: "telefon: 782 991 608",
        bold: true,
        color: "#cf1322",
        align: "center",
      },
      {
        text: "jerzy.komorowski@krotoski.com",
        color: "#2c7ba8",
        isLink: true,
        align: "center",
      },
    ],
  },
  "app-access": {
    title: "Dostęp do aplikacji",
    // subtitle: "Wprowadzenie do systemu",
    content: [
      "Program oferuje zaawansowany system zarządzania dostępem, umożliwiający precyzyjne określenie uprawnień użytkowników zarówno do funkcji aplikacji, jak i do przechowywanych danych. Każdy użytkownik może mieć indywidualnie przydzielone uprawnienia, dostosowane do jego roli oraz zakresu obowiązków w organizacji.",
      "Dzięki temu możliwe jest efektywne kontrolowanie dostępu do poszczególnych modułów, operacji oraz informacji, co zwiększa bezpieczeństwo i integralność danych. Jeśli określona funkcja lub zasób nie jest widoczny dla użytkownika, oznacza to, że nie posiada on odpowiednich uprawnień dostępowych.",
      "System zapewnia w ten sposób klarowny i uporządkowany dostęp do zasobów, eliminując ryzyko nieautoryzowanego wglądu lub modyfikacji danych.",
    ],
  },

  table: {
    title: "Tabela z danymi",
    subtitle: "Znasz Excel na poziomie podstawowym - to wystarczy.",
    content: [
      "Tabela w programie zapewnia zaawansowane funkcje umożliwiające intuicyjne i efektywne zarządzanie danymi. Użytkownik może dostosować widok do swoich potrzeb poprzez sortowanie, filtrowanie oraz dynamiczne zarządzanie kolumnami.",
      "Interfejs tabeli został zaprojektowany w sposób przejrzysty i przyjazny, co ułatwia nawigację oraz pracę z dużymi zbiorami danych. Wszystkie zmiany w układzie tabeli odbywają się w czasie rzeczywistym.",
      "Bez względu na opcję w menu która zostanie wybrana, zostaną wczytane tylko te dane, do których jako użytkownik masz dostęp. Jeśli pojawi się informacja „brak danych” – oznacza to, że nie ma dokumentów spełniających dane kryteria.",

      { text: "Możliwe widoki tabeli (wg menu):", bold: true },

      {
        isList: true,
        prefix: "a)",
        title: "Aktualne",
        desc: "tylko dokumenty, których wartość do rozliczenia jest większa od zera.",
      },
      {
        isList: true,
        prefix: "b)",
        title: "Pilne",
        desc: "dokumenty nieprzekazane do kancelarii, z terminem płatności od -3 dni.",
      },
      {
        isList: true,
        prefix: "c)",
        title: "Zobowiązania",
        desc: "dokumenty, których wartość jest mniejsza od zera (nadpłaty/korekty).",
      },
      {
        isList: true,
        prefix: "d)",
        title: "Archiwum",
        desc: "tylko dokumenty rozliczone, których wartość jest równa zero.",
      },
      {
        isList: true,
        prefix: "e)",
        title: "Kpl dane",
        desc: "wszystkie dokumenty (uwaga: wczytanie dużej ilości danych może spowolnić program).",
      },
      {
        isList: true,
        prefix: "f)",
        title: "KRD",
        desc: "dokumenty, które zostały przekazane do Krajowego Rejestru Długów.",
      },
      {
        isList: true,
        prefix: "g)",
        title: "Dokumenty Raportu FK",
        desc: "dokumenty wymagające decyzji biznesu lub ostatecznej daty rozliczenia.",
      },
      {
        isList: true,
        prefix: "h)",
        title: "Wyłączenia Raportu FK",
        desc: "dokumenty ręcznie wyłączone z procesu raportowania FK.",
      },

      { isImage: true, src: "/instruction_image/table.png", size: "large" },

      {
        text: "Opis poszczególnych elementów obsługi:",
        bold: true,
        color: "#2c7ba8",
      },

      { text: "Szukaj:", bold: true },
      { isImage: true, src: "/instruction_image/szukaj.png", size: "small" },
      "Wpisując frazy, słowa czy znaki, wyświetlisz tylko wiersze je zawierające. Klikając w lupę, możesz wybrać tryb szukania:",
      {
        isList: true,
        prefix: "a)",
        title: "Rozmyte dopasowanie",
        desc: "wyszukuje zbliżone frazy (wybacza literówki).",
      },
      {
        isList: true,
        prefix: "b)",
        title: "Zawiera",
        desc: "wyszukuje dokładnie wpisany tekst (opcja domyślna).",
      },
      {
        isList: true,
        prefix: "c)",
        title: "Zaczyna się od",
        desc: "wyszukuje dokumenty zaczynające się od danej frazy.",
      },

      { isDivider: true }, // <--- LINIA
      { text: "Tryb pełnoekranowy:", bold: true },
      {
        isImage: true,
        src: "/instruction_image/fullscreen.png",
        size: "small",
      },
      "Pozwala powiększyć tabelę na cały ekran, ukrywając boczne menu programu, co znacznie poprawia komfort pracy na mniejszych monitorach.",

      { isDivider: true }, // <--- LINIA

      { text: "Zarządzanie kolumnami:", bold: true },
      "Pozwala na pełną kontrolę nad widocznością danych:",
      {
        isImage: true,
        src: "/instruction_image/show_hide_columns.png",
        size: "small",
      },
      {
        isList: true,
        prefix: "",
        title: "Ukryj wszystko",
        desc: "ukrywa wszystkie kolumny widoczne w tabeli.",
      },
      {
        isList: true,
        prefix: "",
        title: "Resetuj kolejność",
        desc: "wszystkie zmiany, które użytkownik wprowadził przy zmianie kolejności kolumn zostaną zresetowane do ustawień początkowych.",
      },
      {
        isList: true,
        prefix: "",
        title: "Odepnij wszystkie",
        desc: "wybrane kolumny można przypiąć do lewej lub prawej strony ekranu, będą one zawsze widoczne, bez względu na przewijanie ekranu, wyświetlanie innych kolumn itp.",
      },
      {
        isList: true,
        prefix: "",
        title: "Pokaż wszystko",
        desc: "włącza widoczność wszystkich kolumn dostępnych dla użytkownika.",
      },
      {
        isList: true,
        prefix: "",
        title: "Przenieś",
        desc: "po lewej stronie pozwalają zamienić miejscami kolumny, żeby ustawić je w kolejności, która jest najbardziej oczekiwana od użytkownika (łapiemy lewym przyciskiem myszy i przeciągamy do góry lub do dołu).",
      },
      {
        isList: true,
        prefix: "",
        title: "Pinezki",
        desc: "pozwala przypiąć kolumnę na stałe do lewej lub prawej strony.",
      },
      {
        isList: true,
        prefix: "",
        title: "Suwak",
        desc: "daje możliwość włączenia lub wyłączenia widoczności danej kolumny.",
      },
      { isDivider: true }, // <--- LINIA

      { text: "Opis najważniejszych kolumn:", bold: true, color: "#2c7ba8" },
      {
        isList: true,
        prefix: "",
        title: "100VAT",
        desc: "Kwota odpowiadająca 100% podatku VAT dla danego dokumentu. Jeśli brakująca kwota jest równa pełnej wartości VAT, komórka zostaje oznaczona kolorem czerwonym.",
      },
      {
        isList: true,
        prefix: "",
        title: "50VAT",
        desc: "Kwota odpowiadająca 50% podatku VAT dla danego dokumentu. Jeśli brakująca kwota jest równa pełnej wartości VAT, komórka zostaje oznaczona kolorem czerwonym.",
      },
      {
        isList: true,
        prefix: "",
        title: "Błąd doradcy",
        desc: "w przypadku edycji dokumentu możemy zaznaczyć i opisać pomyłkę Doradcy w procesowaniu i wystawianiu dokumentu, dzięki temu możemy wyfiltrować tylko sprawy z błędami i się nimi zająć.",
      },
      {
        isList: true,
        prefix: "",
        title: "Brutto",
        desc: "kwota brutto dokumentu.",
      },
      {
        isList: true,
        prefix: "",
        title: "Data fv",
        desc: "data wystawienia dokumentu.",
      },
      {
        isList: true,
        prefix: "",
        title: "Data wydania auta",
        desc: "wartość odczytana z AS, dotyczy sprzedaży samochodów.",
      },
      {
        isList: true,
        prefix: "",
        title: "Do rozl.",
        desc: "kwota nierozliczona wg AS.",
      },
      {
        isList: true,
        prefix: "",
        title: "Doradca",
        desc: "osoba przygotowująca dokument.",
      },
      {
        isList: true,
        prefix: "",
        title: "Dział",
        desc: "D008, D117 itd.",
      },
      {
        isList: true,
        prefix: "",
        title: "Faktura",
        desc: "numer dokumentu.",
      },
      {
        isList: true,
        prefix: "",
        title: "Ile",
        desc: "ile dni pozostało do terminu płatności lub ile dni po terminie (po terminie komórka jest czerwona).",
      },
      {
        isList: true,
        prefix: "",
        title: "Info dla Zarządu",
        desc: "w przypadku uzupełnienia (w edycji dokumentu) pola „Informacja do przekazania dla Zarządu” to w tabelce będzie pokazany ostatni wpis.",
      },
      {
        isList: true,
        prefix: "",
        title: "Jaka kancelaria",
        desc: "jeśli dokument jest już przekazany do kancelarii to wyświetli się jej nazwa.",
      },
      {
        isList: true,
        prefix: "",
        title: "Kontrahent",
        desc: "kontrahent z dokumentu.",
      },
      {
        isList: true,
        prefix: "",
        title: "Netto",
        desc: "kwota netto dokumentu.",
      },
      {
        isList: true,
        prefix: "",
        title: "Obszar",
        desc: "filtrowanie wg obszaru: BLACHARNIA, CZĘŚCI itd.",
      },
      {
        isList: true,
        prefix: "",
        title: "Ostateczna data rozliczenia",
        desc: "data wskazana przez działa jako ostateczna data rozliczenia dokumentu. Jest to też informacja do Raportu FK.",
      },
      {
        isList: true,
        prefix: "",
        title: "P / N",
        desc: "sprawy przeterminowane i nieprzeterminowane.",
      },
      {
        isList: true,
        prefix: "",
        title: "Pobrano VAT",
        desc: "W trybie edycji dokumentu dostępna jest opcja zaznaczenia, która umożliwia wyfiltrowanie wszystkich spraw dotyczących VAT.",
      },
      {
        isList: true,
        prefix: "",
        title: "Podjęte działania",
        desc: "pole tekstowe uzupełniane przez pracowników dotyczące wszystkich podjętych działań w sprawie rozliczenia dokumentu.",
      },
      {
        isList: true,
        prefix: "",
        title: "Rodzaj działania",
        desc: "w edycji dokumentu możliwość sugerowanego działania w sprawie danego dokumentu.",
      },
      {
        isList: true,
        prefix: "",
        title: "Typ płatności",
        desc: "Przelew, Gotówka itd.",
      },
      {
        isList: true,
        prefix: "",
        title: "Zaznacz kontrahenta",
        desc: "służy do wyróżnienia danego kontrahenta w tabeli.",
      },
      { isDivider: true }, // <--- LINIA
      { text: "Paginacja (Strony):", bold: true },

      {
        isImage: true,
        src: "/instruction_image/pagination.png",
        size: "small",
      },
      "Na dole tabeli możesz wybrać, ile dokumentów chcesz widzieć na raz na jednej stronie tabeli (od 10 do 100) oraz przełączać się między stronami.",
      { isDivider: true }, // <--- LINIA
      { text: "Szybkie kopiowanie:", bold: true },

      { isImage: true, src: "/instruction_image/ctrlC.png", size: "small" },
      "Kliknięcie lewym przyciskiem myszy w dowolną wartość (np. numer faktury lub NIP) automatycznie kopiuje ją do schowka. Nie musisz zaznaczać tekstu.",
      { isDivider: true }, // <--- LINIA
      { text: "Szerokość kolumn:", bold: true },

      {
        isImage: true,
        src: "/instruction_image/change_width.png",
        size: "small",
      },
      "Możesz dowolnie rozciągać kolumny, chwytając za pionową kreskę w nagłówku tabeli.",
      { isDivider: true }, // <--- LINIA
      { text: "Sortowanie danych:", bold: true },

      { isImage: true, src: "/instruction_image/sort.png", size: "small" },
      "Kliknij w nazwę kolumny, aby ułożyć dane rosnąco lub malejąco (np. od najstarszych faktur).",
      { isDivider: true }, // <--- LINIA
      { text: "Filtrowanie danych:", bold: true },
      "Jeśli dla danej kolumny dostępne jest filtrowanie, w nagłówku kolumny widoczny jest wyszarzony symbol lejka. Kliknięcie w ikonę umożliwia filtrowanie tabeli zgodnie z typem filtra przypisanym do kolumny:",
      {
        isList: true,
        prefix: "",
        title: "kolumny z datami",
        desc: "dostępne są dwa pola pozwalające ustawić zakres dat (data początkowa i końcowa) lub tylko jedną z nich.",
      },
      {
        isList: true,
        prefix: "",
        title: "kolumny z liczbami",
        desc: "dostępne są dwa pola pozwalające ustawić zakres liczb od-do lub tylko jedną z nich.",
      },
      {
        isList: true,
        prefix: "",
        title: "filtr pojedynczego wyboru",
        desc: "umożliwia wybór jednej wartości.",
      },
      {
        isList: true,
        prefix: "",
        title: "filtr wielokrotnego wyboru",
        desc: "pozwala zaznaczyć wiele wartości jednocześnie, z podpowiedzią liczby dokumentów, które spełnią wybrane kryteria.",
      },
      { isImage: true, src: "/instruction_image/filtr.png", size: "small" },

      { isDivider: true }, // <--- LINIA
      { text: "Zapis zmian w tabeli i eksport dnych", bold: true },

      {
        isImage: true,
        src: "/instruction_image/icons_table.png",
        size: "small",
      },
      {
        isList: true,
        prefix: "",
        title: "Zapisz widok",
        desc: "służy do trwałego zapisania Twojego układu kolumn. Użyj jej po dostosowaniu tabeli do własnych potrzeb.",
      },
      {
        isList: true,
        prefix: "",
        title: "Export Excel",
        desc: "pobiera widoczne dane w tabeli do pliku. Pamiętaj: włącz kolumny, których potrzebujesz przed pobraniem.",
      },

      "",
      {
        text: "W razie pytań dotyczących obsługi tabeli, skontaktuj się z administratorem.",
        align: "center",
      },
    ],
  },
  //edycja dokumentu
  "edit-doc": {
    title: "Edycja dokumentu",
    subtitle: "Zarządzaj informacjami i historią działań wewnątrz sprawy.",
    content: [
      { text: "Otwieranie okna edycji:", bold: true },
      "Aby przejść do szczegółów i edycji dokumentu, należy wykonać dwukrotne kliknięcie lewym przyciskiem myszy w wybrany wiersz w tabeli głównej.",

      {
        isImage: true,
        src: "/instruction_image/doc_edition.png",
        size: "large",
      },

      "Okno edycji zostało zaprojektowane tak, aby najważniejsze funkcje były zawsze pod ręką. Ekran podzielony jest na trzy główne sekcje:",
      {
        isList: true,
        prefix: "",
        title: "Lewa kolumna",
        desc: "podstawowe dane faktury. Znajdziesz tu numer dokumentu, daty, kwoty oraz dane pojazdu i doradcy.",
      },
      { text: "Środkowa kolumna", bold: true },

      {
        isList: true,
        prefix: "",
        title: "Panel Komunikacji",
        desc: "umożliwia dodawanie dowolnych notatek dotyczących działań podjętych w procesie windykacji dokumentu. Program automatycznie wyróżnia nazwisko autora wpisu. Po najechaniu kursorem wyświetlany jest pełny adres e-mail autora, a po kliknięciu w nazwisko adres zostaje skopiowany do schowka, co pozwala wkleić go bezpośrednio do programu pocztowego.",
      },
      {
        isList: true,
        prefix: "",
        title: "Dziennik zmian",
        desc: "rejestr wszystkich czynności wykonanych przez użytkowników podczas edycji dokumentu.",
      },
      { isImage: true, src: "/instruction_image/czat_log.png", size: "small" },
      {
        isList: true,
        prefix: "",
        title: "Prawa kolumna",
        desc: "umożliwia wprowadzanie wybranych zmian i oznaczeń (jeśli nie masz możliwości edycji, oznacza to niewystarczające uprawnienia), takich jak: Błąd doradcy, Pobrano VAT czy Wyróżnij kontrahenta. Ostatnia z tych opcji służy do oznaczenia kontrahenta w tabeli kolorem turkusowym, co pozwala w późniejszym etapie wyfiltrować wszystkie powiązane sprawy.",
      },
      { isDivider: true }, // <--- LINIA

      { text: "Przyciski nawigacji i zapisu:", bold: true, color: "#2c7ba8" },
      { text: "Przełączanie dokumentów (Strzałki):", bold: true },

      { isImage: true, src: "/instruction_image/arrows.png", size: "small" },
      "Pozwalają na wczytywanie kolejnych faktur z tabeli bez konieczności zamykania okna edycji. Uwaga: Kliknięcie strzałki wykonuje automatyczny zapis zmian w obecnym dokumencie!",
      { isDivider: true }, // <--- LINIA

      { text: "Zamykanie i Zapis:", bold: true },

      {
        isImage: true,
        src: "/instruction_image/cancel_accept.png",
        size: "small",
      },
      {
        isList: true,
        prefix: "",
        title: "Anuluj",
        desc: "zamyka okno i odrzuca wszystkie wprowadzone zmiany.",
      },
      {
        isList: true,
        prefix: "",
        title: "Zatwierdź",
        desc: "zapisuje wprowadzone notatki oraz zmiany i wraca do widoku tabeli.",
      },

      { isDivider: true }, // <--- LINIA

      { text: "Lista wyboru (Zmiana panelu):", bold: true },

      {
        isImage: true,
        src: "/instruction_image/raport_fk_select.png",
        size: "small",
      },
      {
        text: "Pozwala na zmianę wyświetlanych informacji. W zalezności od Twoich uprawnień będziesz miał dostęp do innych paneli z danymi.",
        bold: false,
      },
      {
        isList: true,
        prefix: "",
        title: "Panel akcji",
        desc: "zakres podstawowych opcji, które można zmieniać w dokumencie. Oraz okno z wpłatami do sprawy.",
      },
      {
        isImage: true,
        src: "/instruction_image/action_panel.png",
        size: "small",
      },

      {
        isList: true,
        prefix: "",
        title: "Kancelaria TU / BL",
        desc: 'opcja na liście pojawi się tylko w przypadku sparw "Blacharskich" w          kancelariach dot. PZU.',
      },
      {
        isImage: true,
        src: "/instruction_image/TU_BL.png",
        size: "small",
      },
      {
        isList: true,
        prefix: "",
        title: "Raport FK",
        desc: "panel z możliwością wpisania ostatecznej decyzji i daty rozliczenia. Dane te będą wprowadzone do Raportu Draft.",
      },
      {
        isImage: true,
        src: "/instruction_image/report_draft_addInfo.png",
        size: "small",
      },
      {
        isList: true,
        prefix: "",
        title: "Kontrola BL",
        desc: "panel do kontroli dokumnetacji spraw blacharskich.",
      },
      {
        isImage: true,
        src: "/instruction_image/control_edit.png",
        size: "small",
      },
      {
        isList: true,
        prefix: "",
        title: "Przekaż sprawę do kancelarii",
        desc: "możliwość przekazania danych do zewnętrznej kancelarii.",
      },
      {
        isImage: true,
        src: "/instruction_image/to_law.png",
        size: "small",
      },
      { isDivider: true }, // <--- LINIA

      { text: "Włącznik FK ON / OFF:", bold: true },

      { isImage: true, src: "/instruction_image/fk_on_off.png", size: "small" },

      "Przycisk pozwalający ręcznie wykluczyć daną fakturę z procesu raportowania dla Zarządu (np. w przypadku sporów prawnych).",

      {
        text: "Pamiętaj o regularnym zapisywaniu notatek w dzienniku działań, aby inni pracownicy mieli wgląd w status sprawy.",
        align: "center",
        bold: true,
      },
    ],
  },
  "raport-fk": {
    title: "Raport Draft",
    subtitle: "Raport Należności przeterminowanych - decyzje biznesu",
    content: [
      "Dwa razy w miesiącu Dział Nadzoru i Kontroli Należności przesyła raport dotyczący przeterminowanych należności. Należy podjąć decyzję biznesową wyjaśniającą przyczynę opóźnienia płatności oraz działania Twojego działu w celu jej rozliczenia. Dodatkowo trzeba określić ostateczną datę rozliczenia dokumentu – maksymalny termin, w którym płatność zostanie uregulowana (program pozwala wpisać datę do 45 dni od dnia wprowadzenia).",
      "Sprawdź, czy w menu dostępna jest opcja - Dokumenty Raportu FK",
      {
        isImage: true,
        src: "/instruction_image/report_fk_menu.png",
        size: "small",
      },
      "Jeśli nie widzisz tej pozycji zwróć się do Działu Nadzoru i Kontroli Należności o nadanie odpowiednich uprawnień.",
      "Zostanie wyświetlona tabela ze wszystkimi dokumentami dla których masz podjąć decyzję biznesową. Jeżeli Tabelka będzie pusta to oznacza, ze Twój dział (lub działy) nie ma żadnych dokumentów dla których wymagana jest decyzja.",
      "Program automatycznie uaktywni panel do wpisania ostatecznej daty rozliczenia i decyzji biznesu",
      "W tym miejscu będziesz mógł wybrać ostateczną datę rozliczenia dokumentu oraz wpisać wyjaśnienie dotyczące przyczyny, dlaczego dokument nie został rozliczony, a także opisać kroki podjęte przez dział w celu jego rozliczenia.",
      {
        isImage: true,
        src: "/instruction_image/report_draft_addInfo.png",
        size: "small",
      },
      "Datę ostatecznego rozliczenia możesz zmieniać wielokrotnie, jednak wszystkie wprowadzone przez Ciebie zmiany będą widoczne w ostatecznym raporcie.",
      "Tekst decyzji powinien zawierać wyjaśnienie, dlaczego sprawa nie została jeszcze rozliczona oraz opis działań podjętych przez Twój dział w celu zapewnienia, że rozliczenie nastąpi zgodnie z deklarowaną ostateczną datą rozliczenia.",
      "Nie masz możliwości usunięcia ani edytowania już wpisanej decyzji. Jedyną opcją jest dodanie nowej decyzji, w której wyjaśnisz, że poprzednia była nieprawidłowa, a następnie wpiszesz poprawną, właściwą decyzję.",
      ,
      "Przyciskiem ZATWIERDŹ zapisujesz zmiany, wychodzisz z edycji dokumentu, powinieneś przejść do kolejnego dokumentu i kontynuować proces uzupełniania dat oraz decyzji, aż wszystkie dokumenty będą miały przypisaną ostateczną datę rozliczenia i decyzję.",
      {
        isImage: true,
        src: "/instruction_image/cancel_accept.png",
        size: "small",
      },
      "Możesz również skorzystać ze strzałek do przejścia do nast ępnego / poprzedniego dokumentu.",
      {
        isImage: true,
        src: "/instruction_image/arrows.png",
        size: "small",
      },
    ],
  },
};
