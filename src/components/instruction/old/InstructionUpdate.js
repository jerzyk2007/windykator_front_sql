import './InstructionCustom.css';

const InstructionUpdate = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Aktualizacja danych.</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_component-content--text'>Dane w systemie są aktualizowane codziennie o godzinie 06:45, a cały proces trwa około 10–15 minut. <br /> W tym czasie nie zaleca sie korzystania z programu.<br /> Aktualizacja polega na pobraniu danych bezpośrednio z bazy Autostacji i obejmuje informacje zarejestrowane do końca dnia poprzedniego, zapewniając użytkownikom dostęp do najbardziej aktualnych danych.
                </span>
                <span className='instruction_component-content--text'>Nie wszystkie dane podlegają automatycznej aktualizacji. W wybranych przypadkach informacje są nadal pobierane z odpowiednio przygotowanych plików, co wynika ze specyfiki ich przetwarzania lub wymagań systemowych. Proces ten zapewnia spójność i poprawność danych, jednak może wymagać ręcznej interwencji przy ich aktualizacji.
                </span>
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/update.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "70%" }} />
                </div>
            </section>
        </section>
    );
};

export default InstructionUpdate;