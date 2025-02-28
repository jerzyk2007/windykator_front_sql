import './InstructionCustom.css';

const InstructionAccess = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Uprawnienia użytkownika.</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_component-content--text'>W tym module można przypisać lub zmodyfikować uprawnienia użytkownika. W pierwszej kolejności należy go wyszukać, wpisując w pole wyszukiwania co najmniej 5 znaków – fragment imienia, nazwiska lub aliasu e-mailowego.
                </span >
                <br />
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/user_search.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "50%" }} />
                </div>
                <br />
                <span className='instruction_component-content--text'>Klikając w zieloną ikonę przechodzisz do edycji użytkownika.
                </span >
                <div className='instruction_custom-image'>
                    <img src="/instruction_image/user_access.png" alt="Logo" className="w-32 h-auto" style={{ maxWidth: "100%" }} />
                </div>
                <br />
                <span className='instruction_component-content--text' style={{ fontWeight: 700, textAlign: "center" }}>Zmień uprawnienia użytkownika.</span>
                <span className='instruction_component-content--text'>   <span style={{ fontWeight: 700 }}>
                    User - przeglądanie dokumentów</span> - podstawowa funkcja, która pozwala przeglądać dokumenty (bez możliwości edycji), dokonywać wpisów w czacie, przeglądać raporty,</span>
                <span className='instruction_component-content--text'>   <span style={{ fontWeight: 700 }}>
                    Editor - edytowanie dokumentów</span> - uprawnienia User + możliwość dokonywania edycji dokumentów, wyboru działań, przeglądanie dokumentów i uzupełniania wpisów dla Raportu FK</span>
                <span className='instruction_component-content--text'>   <span style={{ fontWeight: 700 }}>
                    Controller - kontroler dokumentów</span> - uprawnienia Editor + kontrola dokumentacji działu</span>
                <span className='instruction_component-content--text'>   <span style={{ fontWeight: 700 }}>
                    FK - dodatkowy Raport DW</span> - możliwość wygenerowania Raportu FK</span>
                <span className='instruction_component-content--text'>   <span style={{ fontWeight: 700 }}>
                    Nora - raport dla Nory</span> - możliwość wygenerowania Raportu Nora</span>
                <span className='instruction_component-content--text'>   <span style={{ fontWeight: 700 }}>
                    Admin - Administrator</span> - najważniejsza funkcja to możliwość zmiany uprawnień użytkownika, sam fakt posiadanie uprawnień Admina nie daje dostępu do całego systemu, ale można nadać takie uprawnienia sobie i innym.</span>
                <br />
                <span className='instruction_component-content--text' style={{ fontWeight: 700, textAlign: "center" }}>Zmień dostęp użytkownika.</span>
                <span className='instruction_component-content--text'>   <span style={{ fontWeight: 700 }}>
                    Basic - widzi tylko swoje dokumenty</span> - w przypadku założenia konta dla Doradcy, będzie mógł zobaczyć wszystkie faktury, które przygotował (nie zatwierdził) bez względu do jakich działów ma dostęp, w przypadku opcji Basic można nie dodawać żadnych dostępów do działów,</span>
                <span className='instruction_component-content--text'>   <span style={{ fontWeight: 700 }}>
                    Stnadard - edytowanie dokumentów</span> - Standard – użytkownik ma dostęp do wszystkich faktur w danym dziale, bardzo ważnym jest aby nadać mu dostępu do właściwego działu / działów,</span>
                <br />
                <span className='instruction_component-content--text' style={{ fontWeight: 700, textAlign: "center" }}>Zmień imię i nazwisko użytkownika.</span>
                <span className='instruction_component-content--text'>Możliwość zmiany imienia i nazwiska użytkownika,</span>
                <br />
                <span className='instruction_component-content--text' style={{ fontWeight: 700, textAlign: "center" }}>Zmień hasło użytkownika.</span>
                <span className='instruction_component-content--text'>Możliwość zmiany hasła użytkownika,</span>
                <br />
                <span className='instruction_component-content--text' style={{ fontWeight: 700, textAlign: "center" }}>Usuń użytkownika.</span>
                <span className='instruction_component-content--text'>Trwałe usunięcie uzytkownika z systemu,</span>
                <br />
                <span className='instruction_component-content--text' style={{ fontWeight: 700, textAlign: "center" }}>Dostęp do działów.</span>
                <span className='instruction_component-content--text'>Możliwość dodania dostępu do działów dla użytkownika.</span>

            </section>
        </section>
    );
};

export default InstructionAccess;