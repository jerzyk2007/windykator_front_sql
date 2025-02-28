import './InstructionCustom.css';

const InstructionUser = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Instrukcja obsługi.</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_component-content--text'>Właśnie ją czytasz ...
                </span>

            </section>
        </section>
    );
};

export default InstructionUser;