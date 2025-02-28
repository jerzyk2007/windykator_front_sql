import './InstructionCustom.css';

const OrganizationStructure = () => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Struktura organizacji</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_component-content--text'>Do pliku excel eksportowany jest raport zawierający strukturę organizacyjną, opracowaną specjalnie na potrzeby tej aplikacji. Dokument ten przedstawia szczegółowe informacje na temat przypisania użytkowników do poszczególnych działów, wskazując zarówno zakres ich dostępu, jak i obszary, za które ponoszą odpowiedzialność. Dzięki temu możliwe jest precyzyjne zarządzanie uprawnieniami oraz kontrola nad podziałem obowiązków w organizacji.
                </span>

            </section>
        </section>
    );
};

export default OrganizationStructure;