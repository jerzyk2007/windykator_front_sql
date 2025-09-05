import './InstructionCustom.css';


const InstructionLogout = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Wyloguj</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_component-content--text'>Podczas logowania do systemu w plikach cookies Twojej przeglądarki zapisywany jest token dostępu, którego ważność wynosi 24 godziny. Jeśli nie wylogujesz się po zakończeniu pracy, przy kolejnym uruchomieniu system będzie nadal działał poprawnie, jednak po upływie 24 godzin od ostatniego logowania nastąpi automatyczne wylogowanie. Może to skutkować utratą niezapisanych danych, dlatego zaleca się regularne zapisywanie zmian oraz świadome zarządzanie sesją użytkownika.
                    <br />
                    Możesz również zresetować swoje hasło.
                </span>
                <br />
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/logout.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50%", height: "auto" }} />
                </div>
            </section>
        </section>
    );
};

export default InstructionLogout;