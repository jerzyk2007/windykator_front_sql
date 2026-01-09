import { FcInfo } from "react-icons/fc";
import "./InstructionCustom.css";

const ReportAdviser = ({ setSelectedMenuItem }) => {
  return (
    <section className="instruction_custom">
      <section className="instruction_custom-title">
        <label>Raport wg Doradcy</label>
      </section>
      <section className="instruction_custom-content">
        <span className="instruction_custom-content--text">
          System wyświetli listę wszystkich Doradców w dziale lub działach do
          których masz przyznany dostęp, Doradca może pojawić się wielokrotnie
          jeśli wystawiał dokumenty w kilku działach, a Ty masz dostęp do
          każdego z nich. Zestawienie to pozwoli na szybki przegląd danych
          dotyczących doradców w różnych kontekstach, nawet jeśli są przypisani
          do różnych obszarów. Widok ten jest generowany automatycznie na
          podstawie Twoich uprawnień i obejmuje tylko tych doradców, do których
          masz dostęp w ramach przypisanych działów. Dzięki temu możesz
          analizować informacje w szerszym kontekście bez konieczności
          przełączania się między poszczególnymi sekcjami, a każda pozycja
          będzie odpowiednio przypisana do swojego działu.
        </span>
        <span className="instruction_custom-content--text">
          Jeśli chodzi o kolejność kolumn, ich ukrywanie oraz przypinanie,
          funkcjonalność działa identycznie jak w tabeli z dokumentami. Możesz
          dowolnie zmieniać układ kolumn, dostosowując widok do własnych
          potrzeb. Opcje przypinania pozwalają na utrzymanie wybranych kolumn w
          stałej pozycji, niezależnie od przewijania. Mechanizm ten zapewnia
          spójność działania i ułatwia pracę z danymi w różnych sekcjach
          systemu.
        </span>
        <span className="instruction_custom-content--text">
          Jeśli nie wiesz jak się poruszać po tabeli proszę zajrzyj tutaj:
        </span>
        <span
          className="instruction_custom-content--text"
          style={{
            textAlign: "center",
            color: "red",
            cursor: "pointer",
            textDecoration: "dashed",
            borderBottom: "1px dashed red",
          }}
          // Używamy klucza zdefiniowanego w Instruction.js (contentMap)
          onClick={() => setSelectedMenuItem("intro-table-info")}
        >
          Instrukcja obsługi tabeli
        </span>
        <div className="instruction_custom-image">
          <img
            src="/instruction_image/report_adv.png"
            alt="Logo"
            className="w-32 h-auto"
          />
        </div>
        <section className="instruction_component__wrapper">
          <FcInfo />
          <span
            className="instruction_component-content--element"
            style={{ margin: "0 20px" }}
          >
            Wybierz przedział dat dla raportu:
          </span>
          <img
            src="/instruction_image/report_date.png"
            alt="Logo"
            className="w-32 h-auto"
            style={{ maxWidth: "50vw", height: "auto" }}
          />
        </section>
        <span className="instruction_custom-content--text">
          Domyślnie zakres dat „od” i „do” jest automatycznie pobierany z
          dokumentów, do których masz dostęp. Możesz jednak w dowolnym momencie
          dostosować ten zakres, wybierając inne wartości zgodnie ze swoimi
          potrzebami. Zmiana dat pozwala na filtrowanie wyników i wyświetlanie
          tylko tych dokumentów, które mieszczą się w określonym przedziale
          czasowym. Dzięki temu masz pełną kontrolę nad zakresem analizowanych
          danych.
        </span>
        <span className="instruction_component-content--text">
          Opis kolumn możliwych do włączenia w raporcie:
        </span>
        <span
          className="instruction_component-content--text"
          style={{ marginLeft: "20px" }}
        >
          {`• `}
          <span className="instruction_component-content--element">
            Doradca
          </span>
          {` - lista Doradców, którzy mają nierozliczone dokumenty,`}
        </span>
        <span
          className="instruction_component-content--text"
          style={{ marginLeft: "20px" }}
        >
          {`• `}
          <span className="instruction_component-content--element">Dział</span>
          {` - numer działu,`}
        </span>
        <span
          className="instruction_component-content--text"
          style={{ marginLeft: "20px" }}
        >
          {`• `}
          <span className="instruction_component-content--element">
            Stan należności w %
          </span>
          {` - stosunek przeterminowanych dokumentów do wszystkich (w przypadku Doradcy BL nie są uwzględniane sprawy „PZU”, dla Doradców innych działów uwzględniane są wszystkie dokumenty,`}
        </span>
        <span
          className="instruction_component-content--text"
          style={{ marginLeft: "20px" }}
        >
          {`• `}
          <span className="instruction_component-content--element">
            Kwota przeterminowanych FV
          </span>
          {` - wszystkie przeterminowane i nierozliczone faktury,`}
        </span>
        <span
          className="instruction_component-content--text"
          style={{ marginLeft: "20px" }}
        >
          {`• `}
          <span className="instruction_component-content--element">
            Ilość przeterminowanych FV
          </span>
          {` - ilość przeterminowanych i nierozliczonych faktur,`}
        </span>
        <span
          className="instruction_component-content--text"
          style={{ marginLeft: "20px" }}
        >
          {`• `}
          <span className="instruction_component-content--element">
            Kwota nieprzeterminowanych FV
          </span>
          {` - wszystkie nieprzeterminowane i nierozliczone faktury,`}
        </span>
        <span
          className="instruction_component-content--text"
          style={{ marginLeft: "20px" }}
        >
          {`• `}
          <span className="instruction_component-content--element">
            Kwota niepobranych VAT’ów
          </span>
          {` - jeśli w edycji dokumentu zaznaczono niepobrany VAT to tutaj jest on zsumowany, dotyczy tylko spraw gdzie dokument nie jest jeszcze rozliczony,`}
        </span>
        <span
          className="instruction_component-content--text"
          style={{ marginLeft: "20px" }}
        >
          {`• `}
          <span className="instruction_component-content--element">
            Ilość niepobranych VAT’ów
          </span>
          {` - jw. podana jest ilość takich spraw,`}
        </span>
        <span
          className="instruction_component-content--text"
          style={{ marginLeft: "20px" }}
        >
          {`• `}
          <span className="instruction_component-content--element">
            Kwota nierozliczonych FV – błędy doradcy i dokumentacji{" "}
          </span>
          {` - jeśli w edycji dokumentu zaznaczono Błąd doradcy to tutaj jest on zsumowany, dotyczy tylko spraw gdzie dokument nie jest jeszcze rozliczony,`}
        </span>
        <span
          className="instruction_component-content--text"
          style={{ marginLeft: "20px" }}
        >
          {`• `}
          <span className="instruction_component-content--element">
            Ilość nierozliczonych FV – błędy Doradcy i dokumentacji
          </span>
          {` - jw. podana jest ilość takich spraw,`}
        </span>
      </section>
    </section>
  );
};

export default ReportAdviser;
