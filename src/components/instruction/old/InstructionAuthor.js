import './InstructionCustom.css';

const InstructionAuthor = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Historia powstania aplikacji</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_custom-content--text'>Projekt aplikacji do windykacji zrodził się z potrzeby usprawnienia procesów obsługi kilku działów blacharskich, które wcześniej opierały się na niewygodnych i nieefektywnych plikach Excel. Pliki te okazały się być niepraktyczne, zwłaszcza przy współpracy między oddziałami oraz w sytuacjach wymagających synchronizacji danych i łatwego dostępu do informacji.
                </span>
                <span className='instruction_custom-content--text'>Pod koniec 2023 roku rozpocząłem prace nad pierwszymi wersjami kodu aplikacji. Celem było stworzenie narzędzia, które w pełni zastąpiłoby tradycyjne pliki Excel, automatyzując i uproszczając procesy związane z windykacją i obsługą dokumentacji. W 2024 roku aplikacja została wdrożona dla wszystkich oddziałów Blacharskich w Grupie Krotoski. Nowe rozwiązanie pozwoliło na znaczne zwiększenie efektywności pracy, eliminując problemy związane z błędami ludzkimi, chaosem danych czy utrudnionym dostępem do aktualnych informacji.
                </span>
                <span className='instruction_custom-content--text'>Od momentu wdrożenia aplikacja jest nieustannie rozwijana. Dodawane są nowe funkcje, usprawnienia, a także wprowadzane zmiany wynikające z potrzeb użytkowników. Dzięki temu narzędzie staje się coraz bardziej zaawansowane i dostosowane do specyficznych wymagań branży, oferując coraz bardziej intuicyjną i wydajną obsługę procesów windykacyjnych.
                </span>
                <span className='instruction_custom-content--text'>Jeśli masz jakieś uwagi dotyczące działania aplikacji lub pomysły dotyczącymi rozwoju programu to proszę, skontaktuj się ze mną.
                </span>
                <span className='instruction_custom-content--text author' >Jerzy Komorowski
                </span>
                <span className='instruction_custom-content--text author' >telefon: 782 991 608
                </span>
                <span className='instruction_custom-content--text author' >jerzy.komorowski@krotoski.com
                </span>
            </section>

        </section>
    );
};

export default InstructionAuthor;