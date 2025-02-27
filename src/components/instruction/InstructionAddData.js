import './InstructionCustom.css';

const InstructionAddData = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Dodaj dane.</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_component-content--text'>W tym miejscu jest możliwość ręcznego dodania danych, poprzez wgranie odpowiednio przygotowanych plików excel.  </span>
                <br />
                <span className='instruction_component-content--text'>  <span style={{ fontWeight: 700 }}>Rozrachunki</span> - w przypadku problemu połaczenia z serwerem AS można pobrać dane bezpośrednio z programu Autostacji i dodać je do systemu.  </span>
                <span className='instruction_component-content--text'>   <span style={{ fontWeight: 700 }}>Rubicon</span> - aktualizacja danych z systemu Rubicon </span>
                <span className='instruction_component-content--text'>   <span style={{ fontWeight: 700 }}>Becared</span> - aktualizacja danych z kancelari dla spraw blacharskich  dot "PZU"  </span>
                <br />
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/add_data.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "70%" }} />
                </div>
            </section>
        </section>
    );
};

export default InstructionAddData;
