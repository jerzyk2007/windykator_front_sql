import { FcInfo } from "react-icons/fc";
import './InstructionCustom.css';

const ReportFK = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Przygotowanie Raportu FK</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_custom-content--text'>Pozycja służy do wygenerowania Raportu FK. Po dodaniu odpowiednio przygotowanego pliku excel z danymi od Księgowości, należy go wczytać do programu.
                    Obecnie Dział KOntroli i Nadzoru korzysta tylko z wersji nr 2.
                    Wersja ta tworzy raport z historią decyzji podjętych przez biznes.
                </span>
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/report_fk_edit.png" alt="Logo" className="w-32 h-auto" />
                </div>
                <section className='instruction_component__wrapper'>
                    <FcInfo />
                    <span className='instruction_component-content--element'
                        style={{ margin: "0 20px" }}
                    >Usuń dane raportu FK:
                    </span>
                    <img src="/instruction_image/report_fk_delete.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50vw", height: "70%" }} />
                </section>
                <span className='instruction_custom-content--text'>Usuwa poprzednie dane raportu.
                </span>
                <section className='instruction_component__wrapper'>
                    <FcInfo />
                    <span className='instruction_component-content--element'
                        style={{ margin: "0 20px" }}
                    >Dodaj dane raportu FK:
                    </span>
                    <img src="/instruction_image/report_fk_add.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50vw", height: "100%" }} />
                </section>
                <span className='instruction_custom-content--text'>Po usunięciu poprzednich danych pojawi się przycisk z możliwością dodania nowych danych (pamiętaj o prawidłowym przygotowaniu pliku excel).
                </span>
                <section className='instruction_component__wrapper'>
                    <FcInfo />
                    <span className='instruction_component-content--element'
                        style={{ margin: "0 20px" }}
                    >Generuj raport FK:
                    </span>
                    <img src="/instruction_image/report_fk_generate.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50vw", height: "70%" }} />
                </section>
                <span className='instruction_custom-content--text'>Podczas generowania raportu program przypisuje aktualne dane z AS. Wygenerowanie raportu powoduje automatyczne zapisanie danych w bazie. Co oznacza, że można go pobrac potem wielokrotnie z dokładnie takimi samymi danymi.
                </span>
                <section className='instruction_component__wrapper'>
                    <FcInfo />
                    <span className='instruction_component-content--element'
                        style={{ margin: "0 20px" }}
                    >Pobierz raport FK:
                    </span>
                    <img src="/instruction_image/report_fk_download.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50vw", height: "70%" }} />
                </section>
                <span className='instruction_custom-content--text'>Pobierasz raport do pliku excel.
                </span>
            </section>
        </section>
    );
};

export default ReportFK;