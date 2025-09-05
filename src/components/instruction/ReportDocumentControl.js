import './InstructionCustom.css';

const ReportDocumentControl = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Raport kontroli BL</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_component-content--text'>Pobierany jest plik excel z kontroli dokumentacji BL.
                </span>

            </section>
        </section>
    );
};

export default ReportDocumentControl;