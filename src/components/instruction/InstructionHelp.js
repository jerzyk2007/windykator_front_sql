import './InstructionCustom.css';

const InstructionHelp = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Zarządzaj windykacją bez wysiłku</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_custom-content--text'>Aplikacja do obsługi windykacji to zaawansowane narzędzie, które umożliwia kompleksowe zarządzanie procesem windykacyjnym. Dzięki precyzyjnie określonym poziomom dostępu każdy użytkownik otrzymuje uprawnienia dopasowane do swojego zakresu obowiązków, co zapewnia wygodną i bezpieczną pracę.
                </span>
                <span className='instruction_custom-content--text'>System pozwala na bieżące monitorowanie statusu wszystkich nierozliczonych dokumentów płatniczych, co umożliwia szybkie reagowanie na zaległe płatności. Oprócz obsługi dokumentów program generuje szczegółowe raporty, które pomagają analizować efektywność pracy zarówno poszczególnych działów, jak i indywidualnych pracowników.
                </span>
                <span className='instruction_custom-content--text'>Użytkownicy mają dostęp do zawsze aktualnych informacji o nierozliczonych fakturach i rozliczeniach, które są w pełni zintegrowane z systemem Autostacja. Dzięki temu nie ma potrzeby ręcznego pobierania i porównywania danych z różnych źródeł, co znacznie ułatwia codzienną pracę.
                </span>
                <span className='instruction_custom-content--text'>Wdrożenie tego rozwiązania to duży krok naprzód w porównaniu do wcześniejszych metod, takich jak ręczne prowadzenie ewidencji w arkuszach Excel. Aplikacja automatyzuje wiele procesów, oszczędza czas i zwiększa skuteczność działań windykacyjnych.
                </span>
            </section>
        </section>
    );
};

export default InstructionHelp;