import './InstructionCustom.css';

const InstructionInfo = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Dostęp do aplikacji</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_custom-content--text'>Program oferuje zaawansowany system zarządzania dostępem, umożliwiający precyzyjne określenie uprawnień użytkowników zarówno do funkcji aplikacji, jak i do przechowywanych danych. Każdy użytkownik może mieć indywidualnie przydzielone uprawnienia, dostosowane do jego roli oraz zakresu obowiązków w organizacji.
                </span>
                <span className='instruction_custom-content--text'>Dzięki temu możliwe jest efektywne kontrolowanie dostępu do poszczególnych modułów, operacji oraz informacji, co zwiększa bezpieczeństwo i integralność danych. Jeśli określona funkcja lub zasób nie jest widoczny dla użytkownika, oznacza to, że nie posiada on odpowiednich uprawnień dostępowych.
                </span>
                <span className='instruction_custom-content--text'>System zapewnia w ten sposób klarowny i uporządkowany dostęp do zasobów, eliminując ryzyko nieautoryzowanego wglądu lub modyfikacji danych.
                </span>

            </section>

        </section>
    );
};

export default InstructionInfo;