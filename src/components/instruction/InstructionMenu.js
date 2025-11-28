import "./InstructionCustom.css";

const InstructionMenu = () => {
  return (
    <section className="instruction_custom">
      <section className="instruction_custom-title">
        <label>Menu aplikacji</label>
      </section>
      <section className="instruction_custom-content">
        <span className="instruction_custom-content--text">
          Układ menu został odwzorowany zgodnie z programem, z pełnym
          zachowaniem hierarchii zagnieżdżonych pól. Struktura została wiernie
          odtworzona, odzwierciedlając sposób organizacji elementów w
          oryginalnym systemie. Menu zaprojektowano tak, aby odpowiadało
          układowi programu, wraz z jego zagnieżdżonymi polami. Dzięki temu
          użytkownik otrzymuje spójne i intuicyjne doświadczenie zgodne z
          pierwotnym interfejsem.
        </span>
        <span className="instruction_custom-content--text">
          Jeśli w programie nie widzisz któregoś z pól, oznacza to brak
          odpowiednich uprawnień lub dostępu. Możliwe, że Twoje konto nie
          zostało przypisane do właściwej roli lub zakresu autoryzacji. W takim
          przypadku skontaktuj się z administratorem systemu w celu
          zweryfikowania i ewentualnej zmiany uprawnień. Upewnij się również, że
          korzystasz z właściwego profilu użytkownika zgodnie z przyznanymi
          uprawnieniami.
        </span>
      </section>
    </section>
  );
};

export default InstructionMenu;
