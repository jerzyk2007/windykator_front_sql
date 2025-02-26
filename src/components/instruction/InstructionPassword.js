import './InstructionCustom.css';

const InstructionPassword = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Zmień hasło.</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_component-content--text'>Tutaj możesz zmienić swoje hasło w programie. Bardzo ważne jest, abyś zrobił to przynajmniej raz i nie korzystał z domyślnego hasła lub hasła nadanego przez kogoś innego. Ustawienie własnego, unikalnego hasła zwiększa bezpieczeństwo Twojego konta i chroni Twoje dane przed nieautoryzowanym dostępem. Pamiętaj, aby używać silnego hasła, które składa się z co najmniej 8 znaków, zawiera wielkie i małe litery, cyfry oraz znaki specjalne.
                </span>
                <br />
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/password.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50%" }} />
                </div>
            </section>
        </section>
    );
};

export default InstructionPassword;