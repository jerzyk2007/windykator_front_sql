import './InstructionCustom.css';

const InstructionMathData = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Dopasowanie danych w strukturze organizacji.</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_component-content--text'>W tym miejscu jest budowana struktura organizacji, poprzez pola rozwijane można wykonać dowolne konfiguracje dotyczące działu, jego lokalizacji, obszaru, ownerów i opiekunów. Liczna ownerów i opiekunów może być dowolna dla danego działu. Zalecana kolejność to umieszczenie na pierwszym miejscu osoby z najwyższym stanowiskiem.
                </span >
                <br />
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/math_data.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "100%" }} />
                </div>
                <br />
                <span className='instruction_component-content--text'>Po każdej zmianie należy kliknąć w ikonę dyskietki dedykowanej dla danego działu.<br />
                    Program automatycznie podpowiada, jakie nowe działy zostały wykryte (robione to jest na podstawie wczytanych faktur) i sugeruje to w zielonym polu (istnieją nirozliczone dokumenty) lub w czerownym (istnieją nierozliczone dokumenty)
                </span >
                <span className='instruction_component-content--text'>W przypadku braku uzupełnionych danych, nie będzie można żadnemu użytkownikowi przyznać dostępu do takiego działu.
                </span >

            </section>
        </section>
    );
};

export default InstructionMathData;