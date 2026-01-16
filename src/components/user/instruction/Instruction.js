import { useState, useEffect, useRef } from "react";
import {
  FiChevronRight,
  FiChevronDown,
  FiBookOpen,
  FiZoomIn,
} from "react-icons/fi";
// import { menuItems } from "../../menu/menuConfig";
import { instructionData } from "./instructionData";
import InstructionTable from "./InstructionTable";
import "./Instruction.css";

const Instruction = () => {
  const [selectedKey, setSelectedKey] = useState("intro-help");
  const [openMenus, setOpenMenus] = useState({});
  const [zoomedImg, setZoomedImg] = useState(null);

  const scrollRef = useRef(null);

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Funkcja pomocnicza do formatowania list: a) Pogrubione Reszta
  const formatListText = (text) => {
    const parts = text.split(" ");
    if (parts.length < 2) return text;
    const prefix = parts[0]; // np. "a)"
    const boldWord = parts[1]; // np. "Aktualne"
    const rest = parts.slice(2).join(" "); // reszta zdania
    return (
      <>
        {prefix} <strong className="instr-text-bold">{boldWord}</strong> {rest}
      </>
    );
  };

  const renderGenericContent = (data) => (
    <div className="instr-content">
      <h1 className="instr-content__title">{data.title}</h1>
      {data.subtitle && (
        <h2 className="instr-content__subtitle">{data.subtitle}</h2>
      )}

      <div className="instr-content__body">
        {data.content.map((item, idx) => {
          // --- NOWOŚĆ: OBSŁUGA LINII ODDZIELAJĄCEJ ---
          if (item.isDivider) {
            return <hr key={idx} className="instr-divider" />;
          }
          // --- 1. OBSŁUGA OBRAZKÓW (Przywrócenie działania) ---
          if (item.isImage) {
            return (
              <div
                key={idx}
                className="instr-content__image-container"
                style={{ textAlign: item.align || "center" }}
              >
                <div className="instr-img-wrapper">
                  <img
                    src={process.env.PUBLIC_URL + item.src}
                    alt="Instrukcja"
                    className={`instr-img-${
                      item.size || "large"
                    } instr-img-clickable`}
                    onClick={() =>
                      setZoomedImg(process.env.PUBLIC_URL + item.src)
                    }
                    onError={(e) => console.error("Błąd obrazu:", item.src)}
                  />
                  <div className="instr-img-hint">
                    <FiZoomIn /> Kliknij obrazek, aby go powiększyć
                  </div>
                </div>
              </div>
            );
          }

          // --- 2. OBSŁUGA LIST (Nowy format i Stary format) ---
          if (typeof item === "object" && item.isList) {
            return (
              <div key={idx} className="instr-content__text instr-list-item">
                {/* Jeśli masz nowy format (prefix, title, desc) */}
                {item.title ? (
                  <>
                    <span className="instr-list-prefix">{item.prefix}</span>
                    {/* <strong className="instr-text-bold">{item.title}</strong> */}
                    <span className="instr-text-bold">{item.title}</span>
                    <span className="instr-list-description">{item.desc}</span>
                  </>
                ) : (
                  /* Jeśli to stary format (tylko .text) */
                  formatListText(item.text)
                )}
              </div>
            );
          }

          // --- 3. OBSŁUGA ZWYKŁEGO TEKSTU (String) ---
          if (typeof item === "string") {
            return (
              <p key={idx} className="instr-content__text">
                {item === "" ? <br /> : item}
              </p>
            );
          }

          // --- 4. OBSŁUGA TEKSTU FORMATOWANEGO (Obiekty: bold, color, link) ---
          return (
            <p
              key={idx}
              className="instr-content__text"
              style={{
                fontWeight: item.bold ? "800" : "400",
                color: item.color || "inherit",
                textAlign: item.align || "left",
                marginBottom: item.align === "center" ? "5px" : "20px",
              }}
            >
              {item.isLink ? (
                <a
                  href={
                    item.text.includes("@") ? `mailto:${item.text}` : item.text
                  }
                  className="instr-link"
                >
                  {item.text}
                </a>
              ) : (
                item.text
              )}
            </p>
          );
        })}
      </div>
    </div>
  );

  const renderContent = () => {
    if (instructionData[selectedKey]) {
      return renderGenericContent(instructionData[selectedKey]);
    }
    if (selectedKey.startsWith("/")) {
      return (
        <div className="instr-content">
          <h1 className="instr-content__title">Widok Tabeli</h1>
          <InstructionTable />
        </div>
      );
    }
    return (
      <div className="instr-content">
        <h1 className="instr-content__title">Instrukcja</h1>
        <p className="instr-content__text">
          Wybrany temat: {selectedKey}. Treść w przygotowaniu.
        </p>
      </div>
    );
  };

  const renderTree = (items, level = 0) => {
    return items.map((item, index) => {
      const key = item.path || item.action || `node-${level}-${index}`;
      const hasChildren = item.submenu || item.sideMenu;
      const isOpen = openMenus[key];

      return (
        <div key={key} className="instr-menu__node">
          <div
            className={`instr-menu__item level-${level} ${
              selectedKey === key ? "active" : ""
            }`}
            onClick={() =>
              hasChildren ? toggleMenu(key) : setSelectedKey(key)
            }
          >
            <span className="instr-menu__icon">
              {hasChildren ? (
                isOpen ? (
                  <FiChevronDown />
                ) : (
                  <FiChevronRight />
                )
              ) : (
                <FiBookOpen />
              )}
            </span>
            <span className="instr-menu__label">
              {item.title || item.label}
            </span>
          </div>
          {hasChildren && isOpen && (
            <div className="instr-menu__children">
              {renderTree(hasChildren || item.sideMenu, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
      // Opcjonalnie dla płynnego efektu:
      // scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedKey]);

  return (
    <section className="instr-layout">
      <aside className="instr-sidebar">
        <div className="instr-sidebar__header">Instrukcja Obsługi</div>
        <nav className="instr-menu">
          <div
            className={`instr-menu__item ${
              selectedKey === "intro-help" ? "active" : ""
            }`}
            onClick={() => setSelectedKey("intro-help")}
          >
            <FiBookOpen className="instr-menu__icon" />
            <span className="instr-menu__label">O programie</span>
          </div>
          <div
            className={`instr-menu__item ${
              selectedKey === "intro-history" ? "active" : ""
            }`}
            onClick={() => setSelectedKey("intro-history")}
          >
            <FiBookOpen className="instr-menu__icon" />
            <span className="instr-menu__label">Historia projektu</span>
          </div>
          <div
            className={`instr-menu__item ${
              selectedKey === "app-access" ? "active" : ""
            }`}
            onClick={() => setSelectedKey("app-access")}
          >
            <FiBookOpen className="instr-menu__icon" />
            <span className="instr-menu__label">Dostęp do aplikacji</span>
          </div>
          <div
            className={`instr-menu__item ${
              selectedKey === "table" ? "active" : ""
            }`}
            onClick={() => setSelectedKey("table")}
          >
            <FiBookOpen className="instr-menu__icon" />
            <span className="instr-menu__label">Tabela z danymi</span>
          </div>
          <div
            className={`instr-menu__item ${
              selectedKey === "edit-doc" ? "active" : ""
            }`}
            onClick={() => setSelectedKey("edit-doc")}
          >
            <FiBookOpen className="instr-menu__icon" />
            <span className="instr-menu__label">Edycja dokumentu</span>
          </div>
          <div
            className={`instr-menu__item ${
              selectedKey === "raport-fk" ? "active" : ""
            }`}
            onClick={() => setSelectedKey("raport-fk")}
          >
            <FiBookOpen className="instr-menu__icon" />
            <span className="instr-menu__label">
              Raport należności dla Zarządu
            </span>
          </div>
          {/* // funkcja dla rozwijanego menu */}
          {/* <div className="instr-sidebar__divider">Funkcje systemu wg menu</div> */}
          {/* {renderTree(menuItems)} */}
        </nav>
      </aside>

      <main className="instr-main">
        <div className="instr-main__scroll" ref={scrollRef}>
          {renderContent()}
        </div>
      </main>

      {/* MODAL POWIĘKSZENIA (ZOOM) */}
      {zoomedImg && (
        <div className="instr-zoom-overlay" onClick={() => setZoomedImg(null)}>
          <div className="instr-zoom-container">
            <img
              src={zoomedImg}
              alt="Powiększenie"
              className="instr-zoom-image"
            />
            <div className="instr-zoom-hint">
              KLIKNIJ GDZIEKOLWIEK, ABY ZAMKNĄĆ
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Instruction;
