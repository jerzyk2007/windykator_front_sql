import './InstructionCustom.css';

const ReportNora = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Raport NORA</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_component-content--text'>Niezbędne jest wczytanie odpowiednio przygotowanego pliku excel z kodami pocztowymi. <br />Programy automatycznie generuje raport i zapisuje go do pliku excel.
                </span>
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/report_nora.png" alt="Logo" className="w-32 h-auto" />
                </div>
            </section>
        </section>
    );
};

export default ReportNora;