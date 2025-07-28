import { useState, useEffect } from "react";
import { FcRight, FcRightDown2 } from "react-icons/fc";
import InstructionHelp from "./InstructionHelp";
import InstructionAuthor from "./InstructionAuthor";
import InstructionInfo from "./InstructionInfo";
import InstructionTable from "./InstructionTable";
import InstructionMenu from "./InstructionMenu";
import ReportDepartment from "./ReportDepartment";
import ReportAdviser from "./ReportAdviser";
import DocumentEdition from "./DocumentEdition";
import ReportFK from "./ReportFK";
import DocumentControl from "./DocumentControl";
import ReportDocumentControl from "./ReportDocumentControl";
import ReportNora from "./ReportNora";
import OrganizationStructure from "./OrganizationStructure";
import InstructionUpdate from "./InstructionUpdate";
import InstructionUser from "./InstructionUser";
import InstructionLogout from "./InstructionLogout";
import InstructionAddUser from "./InstructionAddUser";
import InstructionPassword from "./InstructionPassword";
import InstructionAddData from "./InstructionAddData";
import InstructionAccess from "./InstructionAccess";
import InstructionTableColumns from "./InstructionTableColumns";
import InstructionMathData from "./InstructionMathData";
import InstructionChangeData from "./InstructionChangeData";
import InstructionRaportFK from "./InstructionRaportFK";
import './Instruction.css';


const menuStructure = [
    {
        id: 10,
        category: "Tabelka",
        items: [
            { id: 100, name: "Aktualne" },
            { id: 100, name: "Pilne" },
            { id: 100, name: "Zobowiązania" },
            { id: 100, name: "Archiwum" },
            { id: 100, name: "Kpl dane" },
            { id: 100, name: "Dokumenty Raportu FK" },
            { id: 100, name: "Wyłączenia Raportu FK" },
        ],
    },
    {
        id: 20,
        category: "Raporty",
        items: [
            {
                id: 201,
                category: "Raporty",
                items: [
                    { id: 2011, name: "Raport - Dział" },
                    { id: 2012, name: "Raport - Doradca" },
                ],
            },
            {
                id: 202,
                category: "Raporty FK",
                // items: [
                //     { id: 11, name: "Generuj Raport" },
                // ],
                items: [
                    { id: 2021, name: "Generuj Raport KRT" },
                    { id: 2022, name: "Generuj Raport KEM" },
                ],
            },
            {
                id: 203,
                category: "Kontrola dokumentacji",
                items: [
                    { id: 2031, name: "Dokumenty kontroli BL" },
                    { id: 2032, name: "Raport kontroli BL" },
                ],
            },
            // {
            //     id: 15,
            //     category: "Inne",
            //     items: [
            //         { id: 16, name: "Raport NORA" },
            //         { id: 17, name: "Struktura organizacji" },
            //     ],
            // },
            { id: 204, name: "Raport NORA" },
            { id: 205, name: "Struktura organizacji" },
        ],
    },
    {
        id: 30,
        category: "System",
        items: [
            { id: 301, name: "Uprawnienia użytkownika" },
            { id: 302, name: "Dodaj dane" },
            {
                id: 303,
                category: "Ustawienia",
                items: [
                    { id: 3031, name: "Tabela - kolumny" },
                    { id: 3032, name: "Dane struktury organizacji" },
                    { id: 3033, name: "Zmiana struktury organizacji" },
                ],
            },
        ],
    },
    {
        id: 40,
        category: "Użytkownik",
        items: [
            { id: 401, name: "Aktualizacja danych" },
            { id: 402, name: "Instrukcja obsługi" },
            { id: 403, name: "Dodaj użytkownika" },
            { id: 404, name: "Zmień hasło" },
            { id: 405, name: "Wyloguj" },
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
                return <InstructionTable />;
            // case 2:
            //     return <InstructionTable />;
            // case 3:
            //     return <InstructionTable />;
            // case 4:
            //     return <InstructionTable />;
            // case 5:
            //     return <InstructionTable />;
            // case 6:
            //     return <InstructionTable />;
            case 2011:
                return <ReportDepartment setSelectedMenuItem={setSelectedMenuItem} />;
            case 2012:
                return <ReportAdviser setSelectedMenuItem={setSelectedMenuItem} />;
            case 2021:
                return <ReportFK company='KRT' />;
            case 2022:
                return <ReportFK company='KEM' />;
            case 2031:
                return <DocumentControl setSelectedMenuItem={setSelectedMenuItem} />;
            case 2032:
                return <ReportDocumentControl />;
            case 204:
                return <ReportNora />;
            case 205:
                return <OrganizationStructure />;
            case 301:
                return <InstructionAccess />;
            case 302:
                return <InstructionAddData />;
            case 3031:
                return <InstructionTableColumns />;
            case 3032:
                return <InstructionChangeData />;
            case 3033:
                return <InstructionMathData />;
            case 401:
                return <InstructionUpdate />;
            case 402:
                return <InstructionUser />;
            case 403:
                return <InstructionAddUser />;
            case 404:
                return <InstructionPassword />;
            case 405:
                return <InstructionLogout />;
            case 9000:
                return <InstructionHelp />;
            case 9001:
                return <InstructionAuthor />;
            case 9001:
                return <InstructionAuthor />;
            case 9002:
                return <InstructionInfo />;
            case 9003:
                return <InstructionTable />;
            case 9004:
                return <DocumentEdition />;
            case 9005:
                return <InstructionRaportFK />;
            case 9006:
                return <InstructionMenu />;
            // Dodaj inne przypadki dla innych elementów menu
            default:
                return <div>Instrukcja w przygotowaniu ...</div>;
        }
    };

    useEffect(() => {
    }, [selectedMenuItem]);
    return (
        <section className="instruction">
            <section className="instruction__menu">
                <section className="instruction__menu-item"
                    onClick={() => setSelectedMenuItem(9000)}>
                    <div className="instruction__menu-item--logo">
                        <FcRight />
                    </div>
                    <span className="instruction__menu-item--title">Informacje o programie</span>
                </section>
                <section className="instruction__menu-item"
                    onClick={() => setSelectedMenuItem(9001)}>
                    <div className="instruction__menu-item--logo">
                        <FcRight />
                    </div>
                    <span className="instruction__menu-item--title">Historia projektu</span>
                </section>
                <section className="instruction__menu-item"
                    onClick={() => setSelectedMenuItem(9002)}>
                    <div className="instruction__menu-item--logo">
                        <FcRight />
                    </div>
                    <span className="instruction__menu-item--title">Dostęp do programu</span>
                </section>

                <section className="instruction__menu-item"
                    onClick={() => setSelectedMenuItem(9003)}>
                    <div className="instruction__menu-item--logo">
                        <FcRight />
                    </div>
                    <span className="instruction__menu-item--title">Tabela z danymi</span>
                </section>
                <section className="instruction__menu-item"
                    onClick={() => setSelectedMenuItem(9004)}>
                    <div className="instruction__menu-item--logo">
                        <FcRight />
                    </div>
                    <span className="instruction__menu-item--title">Edycja dokumentu</span>
                </section>
                <section className="instruction__menu-item"
                    onClick={() => setSelectedMenuItem(9005)}>
                    <div className="instruction__menu-item--logo">
                        <FcRight />
                    </div>
                    <span className="instruction__menu-item--title">Raport Należności dla Zarządu</span>
                </section>
                <section className="instruction__menu-item"
                    onClick={() => {
                        setHideMenu(prev => !prev);
                        setOpenMainMenu("");
                        setSelectedMenuItem(200);
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
