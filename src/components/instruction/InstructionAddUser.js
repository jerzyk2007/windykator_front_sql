import './InstructionCustom.css';

const InstructionAddUser = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Dodaj użytkownika.</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_component-content--text'>Tutaj możesz dodac nowego użytkownika.
                </span>

                <div className='instruction_custom-image'>
                    <img src="/instruction_image/add_user.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50%" }} />
                </div>
            </section>
        </section>
    );
};

export default InstructionAddUser;