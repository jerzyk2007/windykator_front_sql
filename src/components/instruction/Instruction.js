import { useState, useEffect } from "react";
import { FcRight, FcRightDown2 } from "react-icons/fc";
import InstructionHelp from "./InstructionHelp";
import InstructionAuthor from "./InstructionAuthor";
import InstructionAccess from "./InstructionAccess";
import InstructionTable from "./InstructionTable";
import InstructionMenu from "./InstructionMenu";
import './Instruction.css';


const menuStructure = [
    {
        id: 1,
        category: "Tabelka",
        items: [
            { id: 1, name: "Aktualne" },
            { id: 2, name: "Zobowiązania" },
            { id: 3, name: "Archiwum" },
            { id: 4, name: "Kpl dane" },
            { id: 5, name: "Dokumenty Raportu FK" },
            { id: 6, name: "Wyłączenia Raportu FK" },
        ],
    },
    {
        id: 2,
        category: "Raporty",
        items: [
            {
                id: 7,
                category: "Raporty",
                items: [
                    { id: 8, name: "Raport - Dział" },
                    { id: 9, name: "Raport - Doradca" },
                ],
            },
            {
                id: 10,
                category: "Raporty FK",
                items: [
                    { id: 11, name: "Generuj Raport" },
                ],
            },
            {
                id: 12,
                category: "Kontrola dokumentacji",
                items: [
                    { id: 13, name: "Dokumenty kontroli BL" },
                    { id: 14, name: "Raport kontroli BL" },
                ],
            },
            {
                id: 15,
                category: "Inne",
                items: [
                    { id: 16, name: "Raport NORA" },
                    { id: 17, name: "Struktura organizacji" },
                ],
            },
        ],
    },
    {
        id: 18,
        category: "System",
        items: [
            { id: 19, name: "Uprawnienia użytkownika" },
            { id: 20, name: "Dodaj dane" },
            {
                id: 21,
                category: "Ustawienia",
                items: [
                    { id: 22, name: "Tabela - kolumny" },
                    { id: 23, name: "Zmień stałe" },
                    { id: 24, name: "Dopasuj dane" },
                ],
            },
        ],
    },
    {
        id: 25,
        category: "Użytkownik",
        items: [
            { id: 26, name: "Aktualizacja danych" },
            { id: 27, name: "Instrukcja obsługi" },
            { id: 28, name: "Dodaj użytkownika" },
            { id: 29, name: "Zmień hasło" },
            { id: 30, name: "Wyloguj" },
        ],
    },
];


const Instruction = () => {
    const [openMainMenu, setOpenMainMenu] = useState(""); // Stan dla głównych kluczy
    const [openSubMenu, setOpenSubMenu] = useState({}); // Stan dla zagnieżdżonych kluczy
    const [selectedMenuItem, setSelectedMenuItem] = useState(100); // Stan dla aktualnie wybranego menu
    const [hideMenu, setHideMenu] = useState(false);

    const toggleMainMenu = (key) => {
        setOpenMainMenu(prev => (prev === key ? "" : key)); // Tylko jeden główny klucz
        setOpenSubMenu({}); // Zwijamy wszystkie zagnieżdżone menu
    };

    const toggleSubMenu = (key) => {
        setOpenSubMenu(prev => ({
            ...prev,
            [key]: !prev[key], // Zmiana stanu dla zagnieżdżonego menu
        }));
    };

    const renderMenuItems = (items, parentKey = "") => {
        return items.map((item) => {
            const fullKey = parentKey ? `${parentKey}-${item.id}` : `${item.id}`;

            if (item.items) {
                // Obsługa zagnieżdżonych elementów
                return (
                    <div key={item.id}>
                        <section className="instruction__menu-item" onClick={() => toggleSubMenu(fullKey)}>
                            <div className="instruction__menu-item--logo">
                                {openSubMenu[fullKey] ? <FcRightDown2 /> : <FcRight />}
                            </div>
                            <span className="instruction__menu-item--title">{item.category}</span>
                        </section>
                        {openSubMenu[fullKey] && (
                            <section className="instruction__menu-submenu2" >
                                {renderMenuItems(item.items, fullKey)}
                            </section>
                        )}
                    </div>
                );
            }

            // Obsługa elementów bez zagnieżdżenia
            return (
                <section
                    key={item.id}
                    className="instruction__menu-item"
                    onClick={() => setSelectedMenuItem(item.id)}
                >
                    <div className="instruction__menu-item--logo"><FcRight /></div>
                    <span className="instruction__menu-item--title">{item.name}</span>
                </section>
            );
        });
    };

    const renderContent = () => {
        switch (selectedMenuItem) {
            case 100:
                return <InstructionHelp />;
            case 101:
                return <InstructionAuthor />;
            case 102:
                return <InstructionAccess />;
            case 103:
                return <InstructionTable />;
            case 104:
                return <InstructionMenu />;
            // Dodaj inne przypadki dla innych elementów menu
            default:
                return <div>Wybierz element menu, aby wyświetlić zawartość</div>;
        }
    };

    useEffect(() => {
        console.log(selectedMenuItem);
    }, [selectedMenuItem]);
    return (
        <section className="instruction">
            <section className="instruction__menu">
                <section className="instruction__menu-item"
                    onClick={() => setSelectedMenuItem(100)}>
                    <div className="instruction__menu-item--logo">
                        <FcRight />
                    </div>
                    <span className="instruction__menu-item--title">Informacje o programie</span>
                </section>
                <section className="instruction__menu-item"
                    onClick={() => setSelectedMenuItem(101)}>
                    <div className="instruction__menu-item--logo">
                        <FcRight />
                    </div>
                    <span className="instruction__menu-item--title">Historia projektu</span>
                </section>
                <section className="instruction__menu-item"
                    onClick={() => setSelectedMenuItem(102)}>
                    <div className="instruction__menu-item--logo">
                        <FcRight />
                    </div>
                    <span className="instruction__menu-item--title">Dostęp do programu</span>
                </section>
                <section className="instruction__menu-item"
                    onClick={() => setSelectedMenuItem(103)}>
                    <div className="instruction__menu-item--logo">
                        <FcRight />
                    </div>
                    <span className="instruction__menu-item--title">Tabela z danymi</span>
                </section>

                <section className="instruction__menu-item"
                    onClick={() => {
                        setHideMenu(prev => !prev);
                        setOpenMainMenu("");
                        setSelectedMenuItem(104);
                    }

                    }>
                    <div className="instruction__menu-item--logo">
                        {hideMenu ? <FcRightDown2 /> : <FcRight />}
                    </div>
                    <span className="instruction__menu-item--title">Menu programu</span>
                </section>

                {hideMenu && <section className="instruction__menu--hide" >

                    {menuStructure.map(({ id, category, items }) => (
                        <div key={id}>
                            <section className="instruction__menu-item" onClick={() => toggleMainMenu(id)}>
                                <div className="instruction__menu-item--logo">
                                    {openMainMenu === id ? <FcRightDown2 /> : <FcRight />}
                                </div>
                                <span className="instruction__menu-item--title">{category}</span>
                            </section>
                            {openMainMenu === id && (
                                <section className="instruction__menu-submenu">{renderMenuItems(items)}</section>
                            )}
                        </div>
                    ))}
                </section>}
            </section>
            <section className="instruction__container">
                {renderContent()} {/* Renderowanie komponentu na podstawie wybranego menu */}
            </section>
        </section>
    );
};

export default Instruction;
