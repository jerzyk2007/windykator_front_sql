import { FcInfo } from "react-icons/fc";
import "./InstructionCustom.css";

const ReportFK = ({ company }) => {
  return (
    <section className="instruction_custom">
      <section className="instruction_custom-title">
        <label>Przygotowanie Raportu FK - {company}</label>
      </section>
      <section className="instruction_custom-content">
        <span className="instruction_custom-content--text">
          Pozycja służy do wygenerowania Raportu FK dla firmy {company}.
          Tworzony jest raport z historią decyzji podjętych przez biznes.
        </span>
        <div className="instruction_custom-image">
          <img
            src="/instruction_image/report_fk_edit.png"
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
            Przygotuj nowy raport:
          </span>
          <img
            src="/instruction_image/prepare_new_report.png"
            alt="Logo"
            className="w-32 h-auto"
            style={{ maxWidth: "50vw", height: "70%" }}
          />
        </section>
        <span className="instruction_custom-content--text">
          Po naciśnięciu przycisku stary raport jest usuwany, wczytywane sa nowe
          dane, generowana jest historia decyzji. Automatycznie wygenerowany
          jest raport i zapisywany do pliku excel.
        </span>
        <section className="instruction_component__wrapper">
          <FcInfo />
          <span
            className="instruction_component-content--element"
            style={{ margin: "0 20px" }}
          >
            Pobierz raport FK:
          </span>
          <img
            src="/instruction_image/report_fk_download.png"
            alt="Logo"
            className="w-32 h-auto"
            style={{ maxWidth: "50vw", height: "80%" }}
          />
        </section>
        <span className="instruction_custom-content--text">
          Raport jest generowany ponownie na podstawie wcześniejszych danych
          wiekowania (nie pobierane sa nowe dane). Pobrane są również aktualne
          dane z autostacji. Nie tworzona jest nowa historia decyzji biznesu.
        </span>
        <section className="instruction_component__wrapper">
          <FcInfo />
          <span
            className="instruction_component-content--element"
            style={{ margin: "0 20px" }}
          >
            Pobierz adresy mailowe ownerów:
          </span>
          <img
            src="/instruction_image/report_fk_download_mails.png"
            alt="Logo"
            className="w-32 h-auto"
            style={{ maxWidth: "50vw", height: "80%" }}
          />
        </section>
        <span className="instruction_custom-content--text">
          Pobiera wszytskie adresy mailowe Ownerów do których powinien trafić
          raport, Wystarczy wkleić do Outlooka.
        </span>
      </section>
    </section>
  );
};

export default ReportFK;
