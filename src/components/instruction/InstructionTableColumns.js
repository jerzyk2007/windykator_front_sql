import './InstructionCustom.css';

const InstructionTableColumns = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Ustawienia kloumn w tabeli.</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_component-content--text'>W tym module można przypisać lub zmodyfikować uprawnienia użytkownika. W pierwszej kolejności należy go wyszukać, wpisując w pole wyszukiwania co najmniej 5 znaków – fragment imienia, nazwiska lub aliasu e-mailowego.
                </span >
                <br />
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/table_columns.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "100%" }} />
                </div>
                <br />
                <span className='instruction_component-content--text'>W tym module można zarządzać dostępem i widocznością kolumn dla wybranego obszaru. Użytkownik ma możliwość globalnej zmiany nazwy kolumny, dodania lub modyfikacji filtra, a także dodania nowej kolumny. <br />
                    <span style={{ fontWeight: 700 }}>Uwaga:</span>  Dodanie nowej kolumny wymaga jednoczesnego dodania odpowiednich danych na serwerze.
                </span >

            </section>
        </section>
    );
};

export default InstructionTableColumns;