import { FcInfo } from "react-icons/fc";
import "./InstructionCustom.css";

const DocumentEdition = () => {
  return (
    <section className="instruction_custom">
      <section className="instruction_custom-title">
        <label>Edycja wybranego dokumentu</label>
      </section>
      <section className="instruction_custom-content">
        {/* <span className="instruction_custom-content--text">
          Otwarcie okna do edycji i pełnego podglądu dokumentu wymaga
          dwukrotnego kliknięcia w wybrany dokument w tabeli. Ale jest jeden
          wyjątek.
        </span>
        <span className="instruction_custom-content--text">
          Dwukrotne kliknięcie w dowolny dokument w polu „Podjęte działania”
          pozwala dopisać komentarz dotyczący działań przy rozliczeniu dokumentu
          bez otwarcia okna edycji dokumentu. Masz również podgląd na wszytskie
          komentarze wpisane już wcześniej. Możesz w tym miejscu dopisać kolejny
          komentarz jakie podjęte zostały działania przy rozliczeniu dokumentu.
        </span>
        <span className="instruction_custom-content--text">
          Komentarz powinien składać się tylko z tekstu, data i nazwisko (osoby
          zalogowanej) jest dodawane automatycznie.
        </span>
        <div className="instruction_custom-image">
          <img
            src="/instruction_image/mini_edition.png"
            alt="Logo"
            className="w-32 h-auto"
            style={{ maxWidth: "50vw" }}
          />
        </div> */}
        <br />
        <span className="instruction_custom-content--text">
          <span style={{ fontWeight: 700 }}>Dwukrotne kliknięcie</span> w
          wybrany wiersz w tabeli otworzy okno edycji.
        </span>
        <div className="instruction_custom-image">
          <img
            src="/instruction_image/doc_edition.png"
            alt="Logo"
            className="w-32 h-auto"
          />
        </div>
        <br />
        <span className="instruction_custom-content--text">
          Lewa część ekranu to podstawowe informacje dokumentu, w zależności od
          obszaru (Blacharnia, Części) wyświetlane dane mogą się różnić.
        </span>
        <span className="instruction_custom-content--text">
          Środkowa części to czat „Działanie podjęte przez 'tu nr działu'”, w
          którym możemy notować wszystkie działania podjęte dla rozliczenia
          faktury. Nie ma możliwości edycji po wyjściu ze sprawy ani jej
          usunięcia. W przypadku omyłkowego wpisu polecam zrobić kolejny z
          informacją, który wpis jest błędny i dodać nowy komentarz.
        </span>
        <span className="instruction_custom-content--text">
          Prawa część ekranu pozwala na pewne zmiany i zaznaczenia (jeśli nie
          masz możliwości zmian to znaczy, że masz zbyt niskie uprawnienia), jak
          np. Błąd doradcy, Pobrano VAT czy Wyróżnij kontrahenta, ta ostatnia
          funkcja służy do zabarwienia komórki kontrahent w tabeli na kolor
          turkusowy, aby później wyfiltrować wszystkie te sprawy.
        </span>
        <span className="instruction_custom-content--text">
          Prawa dolna część - Opisy rozrachunków – to wszystkie rozliczenia wg
          Rozrachunków Autostacji, jeśli do danego dokumentu jest wciągnięta
          faktura zaliczkowa to będzie również uwzględniona w tym okienku
          (pomimo że tych informacji nie ma w Rozrachunkach AS)
        </span>
        <br />
        <span className="instruction_custom-content--text">
          Opis przycisków w Edycji dokumentu:
        </span>
        <section className="instruction_component__wrapper">
          <FcInfo />
          <span
            className="instruction_component-content--element"
            style={{ margin: "0 20px" }}
          >
            Poprzedni / następny element:
          </span>
          <img
            src="/instruction_image/arrows.png"
            alt="Logo"
            className="w-32 h-auto"
          />
        </section>
        <span className="instruction_custom-content--text">
          wczytywanie kolejnych dokumentów bez wychodzenia z edycji, kolejność
          dokumentów jest zgodna z filtrowanie, sortowaniem w tabeli, przejście
          do kolejnego dokumentu wykonuje automatyczny zapis zmian dokonanych w
          dokumencie (jak wpis, wybór opcji itd.)
        </span>
        <section className="instruction_component__wrapper">
          <FcInfo />
          <span
            className="instruction_component-content--element"
            style={{ margin: "0 20px" }}
          >
            ANULUJ / ZATWIERDŹ:
          </span>
          <img
            src="/instruction_image/cancel_accept.png"
            alt="Logo"
            className="w-32 h-auto"
          />
        </section>
        <span className="instruction_custom-content--text">
          Anuluj - wyjście z edycji bez zapisania zmian
        </span>
        <span className="instruction_custom-content--text">
          Zatwierdź - wyjście z edycji z zapisaniem wszystkich zmian w
          dokumencie
        </span>
        <section className="instruction_component__wrapper">
          <FcInfo />
          <span
            className="instruction_component-content--element"
            style={{ margin: "0 20px" }}
          >
            LISTA WYBORU
          </span>
          <img
            src="/instruction_image/raport_fk_select.png"
            alt="Logo"
            className="w-32 h-auto"
          />
        </section>
        {/* <section className="instruction_component__wrapper">
          <FcInfo />
          <span
            className="instruction_component-content--element"
            style={{ margin: "0 20px" }}
          >
            RAPORT FK
          </span>
          <img
            src="/instruction_image/raport_fk.png"
            alt="Logo"
            className="w-32 h-auto"
          />
        </section> */}
        <span className="instruction_custom-content--text">
          przycisk pojawi się tylko wtedy jeśli wybierzemy wczytanie danych z
          menu: Tabelka / Dokumenty Raportu FK
        </span>
        <div className="instruction_custom-image">
          <img
            src="/instruction_image/raport_fk_edit.png"
            alt="Logo"
            className="w-32 h-auto"
            style={{ maxWidth: "50%" }}
          />
        </div>
        <span className="instruction_custom-content--text">
          Wpisy w tej części będą dodawane do Raportu FK, oczekiwane jest aby
          użytkownik wybrał datę ostatecznego rozliczenia dokumentu oraz
          komentarz z którego będzie wynikać dlaczego do tej pory nie został
          rozliczony. Historia tych komentarzy, ilość wpisów i ilość zmiany daty
          wygeneruje się w odpowiednim raporcie dla Zarządu.
        </span>
        <section className="instruction_component__wrapper">
          <FcInfo />
          <span
            className="instruction_component-content--element"
            style={{ margin: "0 20px" }}
          >
            BECARED
          </span>
          <img
            src="/instruction_image/becared.png"
            alt="Logo"
            className="w-32 h-auto"
          />
        </section>
        <span className="instruction_custom-content--text">
          przycisk pojawi się tylko w przypadku sparw "Blacharskich" w
          kancelariach dot. "PZU"
        </span>
        <span className="instruction_custom-content--text">
          Prezentowane informacje dotyczą etapu sprawy w kancelarii
        </span>
        <div className="instruction_custom-image">
          <img
            src="/instruction_image/becared_edit.png"
            alt="Logo"
            className="w-32 h-auto"
            style={{ maxWidth: "50%" }}
          />
        </div>

        <section className="instruction_component__wrapper">
          <FcInfo />
          <span
            className="instruction_component-content--element"
            style={{ margin: "0 20px" }}
          >
            FK ON / FK OFF
          </span>
          <img
            src="/instruction_image/fk_on_off.png"
            alt="Logo"
            className="w-32 h-auto"
          />
        </section>
        <span className="instruction_custom-content--text">
          wyłączenie/ włączenie dokumentu w raportowaniu FK. Wyłączony dokumnet
          nie pojawi się w raporcie w zakładce danego obszaru np. CZĘŚCI, SERWIS
          itd.
        </span>
        <section className="instruction_component__wrapper">
          <FcInfo />
          <span
            className="instruction_component-content--element"
            style={{ margin: "0 20px" }}
          >
            KONTROLA
          </span>
          <img
            src="/instruction_image/control.png"
            alt="Logo"
            className="w-32 h-auto"
          />
        </section>
        <span className="instruction_custom-content--text">
          dotyczy kontroli dokumentacji poszczególnych działów
        </span>
        <div className="instruction_custom-image">
          <img
            src="/instruction_image/control_edit.png"
            alt="Logo"
            className="w-32 h-auto"
          />
        </div>
      </section>
    </section>
  );
};

export default DocumentEdition;
