// import { useState, useEffect } from "react";
// import { FcRight, FcRightDown2 } from "react-icons/fc";
// import InstructionHelp from "./InstructionHelp";
// import InstructionAuthor from "./InstructionAuthor";
// import InstructionInfo from "./InstructionInfo";
// import InstructionTable from "./InstructionTable";
// import InstructionMenu from "./InstructionMenu";
// import ReportDepartment from "./ReportDepartment";
// import ReportAdviser from "./ReportAdviser";
// import DocumentEdition from "./DocumentEdition";
// import ReportFK from "./ReportFK";
// import DocumentControl from "./DocumentControl";
// import ReportDocumentControl from "./ReportDocumentControl";
// import ReportNora from "./ReportNora";
// import OrganizationStructure from "./OrganizationStructure";
// import InstructionUpdate from "./InstructionUpdate";
// import InstructionUser from "./InstructionUser";
// import InstructionLogout from "./InstructionLogout";
// import InstructionAddUser from "./InstructionAddUser";
// import InstructionPassword from "./InstructionPassword";
// import InstructionAddData from "./InstructionAddData";
// import InstructionAccess from "./InstructionAccess";
// import InstructionTableColumns from "./InstructionTableColumns";
// import InstructionMathData from "./InstructionMathData";
// import InstructionChangeData from "./InstructionChangeData";
// import InstructionRaportFK from "./InstructionRaportFK";
// import './Instruction.css';

// const menuStructure = [
//     {
//         id: 10,
//         category: "Tabelka",
//         items: [
//             { id: 100, name: "Aktualne" },
//             { id: 100, name: "Pilne" },
//             { id: 100, name: "Zobowiązania" },
//             { id: 100, name: "Archiwum" },
//             { id: 100, name: "Kpl dane" },
//             { id: 100, name: "Dokumenty Raportu FK" },
//             { id: 100, name: "Wyłączenia Raportu FK" },
//         ],
//     },
//     {
//         id: 20,
//         category: "Raporty",
//         items: [
//             {
//                 id: 201,
//                 category: "Raporty",
//                 items: [
//                     { id: 2011, name: "Raport - Dział" },
//                     { id: 2012, name: "Raport - Doradca" },
//                 ],
//             },
//             {
//                 id: 202,
//                 category: "Raporty FK",
//                 // items: [
//                 //     { id: 11, name: "Generuj Raport" },
//                 // ],
//                 items: [
//                     { id: 2021, name: "Generuj Raport KRT" },
//                     { id: 2022, name: "Generuj Raport KEM" },
//                 ],
//             },
//             {
//                 id: 203,
//                 category: "Kontrola dokumentacji",
//                 items: [
//                     { id: 2031, name: "Dokumenty kontroli BL" },
//                     { id: 2032, name: "Raport kontroli BL" },
//                 ],
//             },
//             // {
//             //     id: 15,
//             //     category: "Inne",
//             //     items: [
//             //         { id: 16, name: "Raport NORA" },
//             //         { id: 17, name: "Struktura organizacji" },
//             //     ],
//             // },
//             { id: 204, name: "Raport NORA" },
//             { id: 205, name: "Struktura organizacji" },
//         ],
//     },
//     {
//         id: 30,
//         category: "System",
//         items: [
//             { id: 301, name: "Uprawnienia użytkownika" },
//             { id: 302, name: "Dodaj dane" },
//             {
//                 id: 303,
//                 category: "Ustawienia",
//                 items: [
//                     { id: 3031, name: "Tabela - kolumny" },
//                     { id: 3032, name: "Dane struktury organizacji" },
//                     { id: 3033, name: "Zmiana struktury organizacji" },
//                 ],
//             },
//         ],
//     },
//     {
//         id: 40,
//         category: "Użytkownik",
//         items: [
//             { id: 401, name: "Aktualizacja danych" },
//             { id: 402, name: "Instrukcja obsługi" },
//             { id: 403, name: "Dodaj użytkownika" },
//             { id: 404, name: "Zmień hasło" },
//             { id: 405, name: "Wyloguj" },
//         ],
//     },
// ];

// const Instruction = () => {
//     const [openMainMenu, setOpenMainMenu] = useState(""); // Stan dla głównych kluczy
//     const [openSubMenu, setOpenSubMenu] = useState({}); // Stan dla zagnieżdżonych kluczy
//     const [selectedMenuItem, setSelectedMenuItem] = useState(100); // Stan dla aktualnie wybranego menu
//     const [hideMenu, setHideMenu] = useState(false);

//     const toggleMainMenu = (key) => {
//         setOpenMainMenu(prev => (prev === key ? "" : key)); // Tylko jeden główny klucz
//         setOpenSubMenu({}); // Zwijamy wszystkie zagnieżdżone menu
//     };

//     const toggleSubMenu = (key) => {
//         setOpenSubMenu(prev => ({
//             ...prev,
//             [key]: !prev[key], // Zmiana stanu dla zagnieżdżonego menu
//         }));
//     };

//     const renderMenuItems = (items, parentKey = "") => {
//         return items.map((item) => {
//             const fullKey = parentKey ? `${parentKey}-${item.id}` : `${item.id}`;

//             if (item.items) {
//                 // Obsługa zagnieżdżonych elementów
//                 return (
//                     <div key={item.id}>
//                         <section className="instruction__menu-item" onClick={() => toggleSubMenu(fullKey)}>
//                             <div className="instruction__menu-item--logo">
//                                 {openSubMenu[fullKey] ? <FcRightDown2 /> : <FcRight />}
//                             </div>
//                             <span className="instruction__menu-item--title">{item.category}</span>
//                         </section>
//                         {openSubMenu[fullKey] && (
//                             <section className="instruction__menu-submenu2" >
//                                 {renderMenuItems(item.items, fullKey)}
//                             </section>
//                         )}
//                     </div>
//                 );
//             }

//             // Obsługa elementów bez zagnieżdżenia
//             return (
//                 <section
//                     key={item.id}
//                     className="instruction__menu-item"
//                     onClick={() => setSelectedMenuItem(item.id)}
//                 >
//                     <div className="instruction__menu-item--logo"><FcRight /></div>
//                     <span className="instruction__menu-item--title">{item.name}</span>
//                 </section>
//             );
//         });
//     };

//     const renderContent = () => {
//         switch (selectedMenuItem) {
//             case 100:
//                 return <InstructionTable />;
//             case 2011:
//                 return <ReportDepartment setSelectedMenuItem={setSelectedMenuItem} />;
//             case 2012:
//                 return <ReportAdviser setSelectedMenuItem={setSelectedMenuItem} />;
//             case 2021:
//                 return <ReportFK company='KRT' />;
//             case 2022:
//                 return <ReportFK company='KEM' />;
//             case 2031:
//                 return <DocumentControl setSelectedMenuItem={setSelectedMenuItem} />;
//             case 2032:
//                 return <ReportDocumentControl />;
//             case 204:
//                 return <ReportNora />;
//             case 205:
//                 return <OrganizationStructure />;
//             case 301:
//                 return <InstructionAccess />;
//             case 302:
//                 return <InstructionAddData />;
//             case 3031:
//                 return <InstructionTableColumns />;
//             case 3032:
//                 return <InstructionChangeData />;
//             case 3033:
//                 return <InstructionMathData />;
//             case 401:
//                 return <InstructionUpdate />;
//             case 402:
//                 return <InstructionUser />;
//             case 403:
//                 return <InstructionAddUser />;
//             case 404:
//                 return <InstructionPassword />;
//             case 405:
//                 return <InstructionLogout />;
//             case 9000:
//                 return <InstructionHelp />;
//             case 9001:
//                 return <InstructionAuthor />;
//             case 9001:
//                 return <InstructionAuthor />;
//             case 9002:
//                 return <InstructionInfo />;
//             case 9003:
//                 return <InstructionTable />;
//             case 9004:
//                 return <DocumentEdition />;
//             case 9005:
//                 return <InstructionRaportFK />;
//             case 9006:
//                 return <InstructionMenu />;
//             // Dodaj inne przypadki dla innych elementów menu
//             default:
//                 return <div>Instrukcja w przygotowaniu ...</div>;
//         }
//     };

//     useEffect(() => {
//     }, [selectedMenuItem]);
//     return (
//         <section className="instruction">
//             <section className="instruction__menu">
//                 <section className="instruction__menu-item"
//                     onClick={() => setSelectedMenuItem(9000)}>
//                     <div className="instruction__menu-item--logo">
//                         <FcRight />
//                     </div>
//                     <span className="instruction__menu-item--title">Informacje o programie</span>
//                 </section>
//                 <section className="instruction__menu-item"
//                     onClick={() => setSelectedMenuItem(9001)}>
//                     <div className="instruction__menu-item--logo">
//                         <FcRight />
//                     </div>
//                     <span className="instruction__menu-item--title">Historia projektu</span>
//                 </section>
//                 <section className="instruction__menu-item"
//                     onClick={() => setSelectedMenuItem(9002)}>
//                     <div className="instruction__menu-item--logo">
//                         <FcRight />
//                     </div>
//                     <span className="instruction__menu-item--title">Dostęp do programu</span>
//                 </section>

//                 <section className="instruction__menu-item"
//                     onClick={() => setSelectedMenuItem(9003)}>
//                     <div className="instruction__menu-item--logo">
//                         <FcRight />
//                     </div>
//                     <span className="instruction__menu-item--title">Tabela z danymi</span>
//                 </section>
//                 <section className="instruction__menu-item"
//                     onClick={() => setSelectedMenuItem(9004)}>
//                     <div className="instruction__menu-item--logo">
//                         <FcRight />
//                     </div>
//                     <span className="instruction__menu-item--title">Edycja dokumentu</span>
//                 </section>
//                 <section className="instruction__menu-item"
//                     onClick={() => setSelectedMenuItem(9005)}>
//                     <div className="instruction__menu-item--logo">
//                         <FcRight />
//                     </div>
//                     <span className="instruction__menu-item--title">Raport Należności dla Zarządu</span>
//                 </section>
//                 <section className="instruction__menu-item"
//                     onClick={() => {
//                         setHideMenu(prev => !prev);
//                         setOpenMainMenu("");
//                         setSelectedMenuItem(200);
//                     }

//                     }>
//                     <div className="instruction__menu-item--logo">
//                         {hideMenu ? <FcRightDown2 /> : <FcRight />}
//                     </div>
//                     <span className="instruction__menu-item--title">Menu programu</span>
//                 </section>

//                 {hideMenu && <section className="instruction__menu--hide" >

//                     {menuStructure.map(({ id, category, items }) => (
//                         <div key={id}>
//                             <section className="instruction__menu-item" onClick={() => toggleMainMenu(id)}>
//                                 <div className="instruction__menu-item--logo">
//                                     {openMainMenu === id ? <FcRightDown2 /> : <FcRight />}
//                                 </div>
//                                 <span className="instruction__menu-item--title">{category}</span>
//                             </section>
//                             {openMainMenu === id && (
//                                 <section className="instruction__menu-submenu">{renderMenuItems(items)}</section>
//                             )}
//                         </div>
//                     ))}
//                 </section>}
//             </section>
//             <section className="instruction__container">
//                 {renderContent()} {/* Renderowanie komponentu na podstawie wybranego menu */}
//             </section>
//         </section>
//     );
// };

// export default Instruction;

// po zmianie
// import { useState, useEffect } from "react";
// import { FcRight, FcRightDown2 } from "react-icons/fc";
// import { menuItems } from "../menu/menuConfig"; // Import Twojej konfiguracji

// // Importy komponentów instrukcji
// import InstructionHelp from "./InstructionHelp";
// import InstructionAuthor from "./InstructionAuthor";
// import InstructionInfo from "./InstructionInfo";
// import InstructionTable from "./InstructionTable";
// import InstructionMenu from "./InstructionMenu";
// import ReportDepartment from "./ReportDepartment";
// import ReportAdviser from "./ReportAdviser";
// import DocumentEdition from "./DocumentEdition";
// import ReportFK from "./ReportFK";
// import DocumentControl from "./DocumentControl";
// import ReportDocumentControl from "./ReportDocumentControl";
// import ReportNora from "./ReportNora";
// import OrganizationStructure from "./OrganizationStructure";
// import InstructionUpdate from "./InstructionUpdate";
// import InstructionUser from "./InstructionUser";
// import InstructionLogout from "./InstructionLogout";
// import InstructionAddUser from "./InstructionAddUser";
// import InstructionPassword from "./InstructionPassword";
// import InstructionAddData from "./InstructionAddData";
// import InstructionAccess from "./InstructionAccess";
// import InstructionTableColumns from "./InstructionTableColumns";
// import InstructionMathData from "./InstructionMathData";
// import InstructionChangeData from "./InstructionChangeData";
// import InstructionRaportFK from "./InstructionRaportFK";

// import "./Instruction.css";

// const Instruction = () => {
//   // Zmieniamy stan selectedMenuItem na string (ścieżkę lub klucz),
//   // domyślnie "intro-help" (lub cokolwiek co ma się wyświetlać na start)
//   const [selectedKey, setSelectedKey] = useState("intro-help");

//   // Zarządzanie otwieraniem menu
//   const [openMenus, setOpenMenus] = useState({}); // Obiekt do trzymania stanu otwartych podmenu
//   const [hideMenu, setHideMenu] = useState(false);

//   // Funkcja togglująca menu (działa dla każdego poziomu zagnieżdżenia)
//   const toggleMenu = (key) => {
//     setOpenMenus((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   // --- MAPA KOMPONENTÓW ---
//   // Tutaj łączymy 'path' lub 'action' z menuConfig z Twoimi komponentami instrukcji.
//   // Klucze tutaj muszą odpowiadać path/action z menuConfig.js
//   const contentMap = {
//     // === SEKCJA STATYCZNA (Menu Instrukcji) ===
//     "intro-help": <InstructionHelp />,
//     "intro-history": <InstructionAuthor />,
//     "intro-access": <InstructionInfo />,
//     "intro-table-info": <InstructionTable />, // Ogólne info o tabeli
//     "intro-edit": <DocumentEdition />,
//     "intro-raport-fk": <InstructionRaportFK />,

//     // === SEKCJA Z MENUCONFIG (Tabelka) ===
//     "/actual-table": (
//       <div>
//         <p style={{ display: "flex", alignItems: "center" }}>
//           <span
//             style={{
//               color: "rgba(255, 0, 234, 1)",
//               fontWeight: "bold",
//               marginRight: "20px",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {"Aktualne - "}
//           </span>
//           <span style={{ color: "rgb(0, 26, 255)" }}>
//             {
//               "tylko dokumenty, których wartość do rozliczenia jest większa od zera"
//             }
//           </span>
//         </p>
//         <InstructionTable />{" "}
//       </div>
//     ),
//     "/critical-table": (
//       <div>
//         <p style={{ display: "flex", alignItems: "center" }}>
//           <span
//             style={{
//               color: "rgba(255, 0, 234, 1)",
//               fontWeight: "bold",
//               marginRight: "20px",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {"Pilne - "}
//           </span>
//           <span style={{ color: "rgb(0, 26, 255)" }}>
//             {
//               "tylko dokumenty, których wartość do rozliczenia jest większa od zera, nie są w kancelarii i mają termin od minus 3 dni"
//             }
//           </span>
//         </p>
//         <InstructionTable />{" "}
//       </div>
//     ), // Możesz tu przekazać propsy jeśli komponent je obsługuje
//     "/obligations-table": <InstructionTable />,
//     "/archive-table": <InstructionTable />,
//     "/all-data-table": <InstructionTable />,
//     "/krd": <InstructionTable />, // Zakładam, że to też tabela
//     "/fk-documents-table": <InstructionTable />,
//     "/fk-disabled-documents-table": <InstructionTable />,

//     // === KANCELARIA & POLISY ===
//     "/actual-law-table": <InstructionTable />,
//     "/no-accept-table": <InstructionTable />,
//     "/actual-insurance-table": <InstructionTable />,

//     // === RAPORTY ===
//     "/raport-departments": (
//       <ReportDepartment setSelectedMenuItem={setSelectedKey} />
//     ), // setSelectedMenuItem jeśli potrzebne wewnątrz
//     "/raport-advisers": <ReportAdviser setSelectedMenuItem={setSelectedKey} />,

//     "/generate-raport-fk-KRT": <ReportFK company="KRT" />,
//     "/generate-raport-fk-KEM": <ReportFK company="KEM" />,
//     "/generate-raport-fk-RAC": <ReportFK company="RAC" />, // Dodane RAC z configu

//     "/control-bl-documents-table": (
//       <DocumentControl setSelectedMenuItem={setSelectedKey} />
//     ),
//     controlRaportBL: <ReportDocumentControl />, // Action z configu

//     "/raport-nora": <ReportNora />,
//     organizationStructure: <OrganizationStructure />, // Action z configu
//     differenceAs_Fk: <div>Instrukcja: Raport różnic AS - FK</div>, // Brak importu w Twoim kodzie, placeholder
//     lawStatement: <div>Instrukcja: Zestawienie wpłat</div>, // Brak importu, placeholder

//     // === SYSTEM ===
//     "/user-settings": <InstructionAccess />,
//     "/add-data": <InstructionAddData />,
//     "/table-settings": <InstructionTableColumns />,
//     "/change-org-str": <InstructionChangeData />,
//     "/create-org-str": <InstructionMathData />, // Sprawdź czy to dobry komponent

//     // === UŻYTKOWNIK ===
//     "/instruction": <InstructionMenu />, // To chyba ta instrukcja w instrukcji?
//     "/register": <InstructionAddUser />,
//     "/change-password": <InstructionPassword />,
//     logout: <InstructionLogout />,
//   };

//   // Funkcja renderująca zawartość na podstawie klucza
//   const renderContent = () => {
//     return (
//       contentMap[selectedKey] || (
//         <div>
//           Instrukcja w przygotowaniu lub nie znaleziono tematu ({selectedKey})
//         </div>
//       )
//     );
//   };

//   // Rekurencyjna funkcja do renderowania drzewa menu
//   const renderTree = (items, levelPrefix = "root") => {
//     return items.map((item, index) => {
//       // Unikalny klucz dla elementu w drzewie DOM
//       const uniqueKey = `${levelPrefix}-${index}`;

//       // Sprawdzamy czy element ma dzieci (submenu lub sideMenu)
//       const children = item.submenu || item.sideMenu;

//       // Klucz logiczny do mapowania treści (path lub action)
//       // Jeśli nie ma path/action, używamy tytułu jako identyfikatora (tylko dla folderów)
//       const contentKey = item.path || item.action;

//       if (children) {
//         // --- To jest kategoria (ma dzieci) ---
//         return (
//           <div key={uniqueKey}>
//             <section
//               className="instruction__menu-item"
//               onClick={() => toggleMenu(uniqueKey)}
//             >
//               <div className="instruction__menu-item--logo">
//                 {openMenus[uniqueKey] ? <FcRightDown2 /> : <FcRight />}
//               </div>
//               <span className="instruction__menu-item--title">
//                 {item.title || item.label}
//               </span>
//             </section>

//             {/* Renderowanie dzieci, jeśli kategoria jest otwarta */}
//             {openMenus[uniqueKey] && (
//               <section
//                 className={
//                   item.sideMenu
//                     ? "instruction__menu-submenu2"
//                     : "instruction__menu-submenu"
//                 }
//               >
//                 {renderTree(children, uniqueKey)}
//               </section>
//             )}
//           </div>
//         );
//       } else {
//         // --- To jest element końcowy (link/akcja) ---
//         return (
//           <section
//             key={uniqueKey}
//             className={`instruction__menu-item ${
//               selectedKey === contentKey ? "active" : ""
//             }`} // Opcjonalnie dodaj klasę active
//             onClick={() => {
//               if (contentKey) setSelectedKey(contentKey);
//             }}
//           >
//             <div className="instruction__menu-item--logo">
//               <FcRight />
//             </div>
//             <span className="instruction__menu-item--title">
//               {item.label || item.title}
//             </span>
//           </section>
//         );
//       }
//     });
//   };

//   useEffect(() => {
//     // Ewentualne scrollowanie do góry przy zmianie
//     // window.scrollTo(0, 0);
//   }, [selectedKey]);

//   return (
//     <section className="instruction">
//       <section className="instruction__menu">
//         {/* --- SEKCJA STAŁA (META INSTRUKCJE) --- */}
//         {/* Te elementy nie były w menuConfig, więc zostawiamy je na górze na sztywno */}
//         <section
//           className="instruction__menu-item"
//           onClick={() => setSelectedKey("intro-help")}
//         >
//           <div className="instruction__menu-item--logo">
//             <FcRight />
//           </div>
//           <span className="instruction__menu-item--title">
//             Informacje o programie
//           </span>
//         </section>
//         <section
//           className="instruction__menu-item"
//           onClick={() => setSelectedKey("intro-history")}
//         >
//           <div className="instruction__menu-item--logo">
//             <FcRight />
//           </div>
//           <span className="instruction__menu-item--title">
//             Historia projektu
//           </span>
//         </section>
//         <section
//           className="instruction__menu-item"
//           onClick={() => setSelectedKey("intro-access")}
//         >
//           <div className="instruction__menu-item--logo">
//             <FcRight />
//           </div>
//           <span className="instruction__menu-item--title">
//             Dostęp do programu
//           </span>
//         </section>
//         <section
//           className="instruction__menu-item"
//           onClick={() => setSelectedKey("intro-table-info")}
//         >
//           <div className="instruction__menu-item--logo">
//             <FcRight />
//           </div>
//           <span className="instruction__menu-item--title">Tabela z danymi</span>
//         </section>
//         <section
//           className="instruction__menu-item"
//           onClick={() => setSelectedKey("intro-edit")}
//         >
//           <div className="instruction__menu-item--logo">
//             <FcRight />
//           </div>
//           <span className="instruction__menu-item--title">
//             Edycja dokumentu
//           </span>
//         </section>
//         <section
//           className="instruction__menu-item"
//           onClick={() => setSelectedKey("intro-raport-fk")}
//         >
//           <div className="instruction__menu-item--logo">
//             <FcRight />
//           </div>
//           <span className="instruction__menu-item--title">
//             Raport Należności dla Zarządu
//           </span>
//         </section>

//         {/* --- PRZYCISK ROZWIJANIA MENU PROGRAMU --- */}
//         <section
//           className="instruction__menu-item"
//           onClick={() => setHideMenu((prev) => !prev)}
//           style={{
//             marginTop: "20px",
//             borderTop: "1px solid #ccc",
//             paddingTop: "10px",
//           }}
//         >
//           <div className="instruction__menu-item--logo">
//             {hideMenu ? <FcRightDown2 /> : <FcRight />}
//           </div>
//           <span
//             className="instruction__menu-item--title"
//             style={{ fontWeight: "bold" }}
//           >
//             Menu programu (Struktura)
//           </span>
//         </section>

//         {/* --- DYNAMICZNE MENU Z CONFIGA --- */}
//         {hideMenu && (
//           <section className="instruction__menu--hide">
//             {renderTree(menuItems)}
//           </section>
//         )}
//       </section>

//       <section className="instruction__container">{renderContent()}</section>
//     </section>
//   );
// };

// export default Instruction;
import React, { useState, useEffect } from "react";
import { FcRight, FcRightDown2 } from "react-icons/fc";
import { menuItems } from "../menu/menuConfig"; // Upewnij się, że ścieżka jest poprawna

// Importy komponentów instrukcji
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

import "./Instruction.css";

// --- KONFIGURACJA OPISÓW DLA TABEL ---
// Tutaj dodajesz tylko te tabele, które mają mieć specjalny nagłówek z opisem.
const tableDescriptions = {
  "/actual-table": {
    title: "Aktualne",
    description:
      "tylko dokumenty, których wartość do rozliczenia jest większa od zera",
  },
  "/critical-table": {
    title: "Pilne",
    description:
      "tylko dokumenty, których wartość do rozliczenia jest większa od zera, nie są w kancelarii i mają termin od minus 3 dni",
  },
  "/obligations-table": {
    title: "Zobowiązania",
    description: "dokumenty z terminem płatności w przyszłości",
  },
  "/archive-table": {
    title: "Archiwum",
    description: "tylko dokumenty rozliczone, których wartość jest równa zero",
  },
  "/all-data-table": {
    title: "Kpl dane",
    description:
      "zostaną wczytane wszystkie dokumenty (jeśli masz dostęp do wszystkich działów wczytane zostanie od kilkaset tysięcy dokumentów (nawet do kilku milionów), może to spowolnić działanie programu)",
  },
  "/krd": {
    title: "KRD",
    description:
      "zostaną wczytane wszystkie dokumenty, które zostały przekzane do KRD",
  },
  "/fk-documents-table": {
    title: "Dokumenty Raportu FK",
    description:
      "zostaną wczytane dokumenty, które zostały omówione w Raporcie FK i dla których dokumentów oczekiwane jest naniesienie decyzji biznesu oraz ostatecznej daty rozliczenia",
  },
  "/fk-disabled-documents-table": {
    title: "Wyłączenia Raportu FK",
    description:
      "niektóre dokumenty mogą zostać wyłączone z procesu Raportowania FK, wybranie tej pozycji menu spowoduje wczytanie dokumentów „ręcznie” wyłączonych",
  },
  "/actual-law-table": {
    title: "W realizacji",
    description:
      "sprawy przekazane do zewnętrznej kancelarii, w trakcie obsługi",
  },
  "/no-accept-table": {
    title: "Sprawy do przyjęcia",
    description:
      "sprawy przekierowane do zewnętrznej kancelarii, ale jeszcze nie przyjęte do obsługi",
  },
  "/actual-insurance-table": {
    title: "W windykacji",
    description:
      "w trakcie przygotowania, tymczasowo będzie to tylko statyczna tabela (bez automatycznych aktualizacji) dla lepszej komunikacji z Klaudią i Wojtkiem ;)",
  },
};

// --- KOMPONENT POMOCNICZY DO NAGŁÓWKA ---
const InfoHeader = ({ title, description }) => (
  <div style={{ marginBottom: "20px" }}>
    <p style={{ display: "flex", alignItems: "center" }}>
      <span
        style={{
          color: "rgba(255, 0, 234, 1)",
          fontWeight: "bold",
          marginRight: "10px",
          whiteSpace: "nowrap",
          fontSize: "1.1em",
        }}
      >
        {title} -
      </span>
      <span style={{ color: "rgb(0, 26, 255)" }}>{description}</span>
    </p>
    <hr
      style={{ border: "0", borderTop: "1px solid #eee", margin: "10px 0" }}
    />
  </div>
);

const Instruction = () => {
  const [selectedKey, setSelectedKey] = useState("intro-help");
  const [openMenus, setOpenMenus] = useState({});
  const [hideMenu, setHideMenu] = useState(false);

  // Funkcja togglująca menu
  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // --- MAPA KOMPONENTÓW SPECJALNYCH ---
  // Tutaj trzymamy tylko komponenty, które NIE są standardową InstructionTable
  const contentMap = {
    // === SEKCJA STATYCZNA ===
    "intro-help": <InstructionHelp />,
    "intro-history": <InstructionAuthor />,
    "intro-access": <InstructionInfo />,
    "intro-table-info": <InstructionTable />,
    "intro-edit": <DocumentEdition />,
    "intro-raport-fk": <InstructionRaportFK />,

    // === RAPORTY ===
    "/raport-departments": (
      <ReportDepartment setSelectedMenuItem={setSelectedKey} />
    ),
    "/raport-advisers": <ReportAdviser setSelectedMenuItem={setSelectedKey} />,
    "/generate-raport-fk-KRT": <ReportFK company="KRT" />,
    "/generate-raport-fk-KEM": <ReportFK company="KEM" />,
    "/generate-raport-fk-RAC": <ReportFK company="RAC" />,
    "/control-bl-documents-table": (
      <DocumentControl setSelectedMenuItem={setSelectedKey} />
    ),
    controlRaportBL: <ReportDocumentControl />,
    "/raport-nora": <ReportNora />,
    organizationStructure: <OrganizationStructure />,

    // === SYSTEM I UŻYTKOWNIK ===
    "/user-settings": <InstructionAccess />,
    "/add-data": <InstructionAddData />,
    "/table-settings": <InstructionTableColumns />,
    "/change-org-str": <InstructionChangeData />,
    "/create-org-str": <InstructionMathData />,
    "/": <InstructionUpdate />,
    "/instruction": <InstructionUser />,
    "/register": <InstructionAddUser />,
    "/change-password": <InstructionPassword />,
    logout: <InstructionLogout />,

    // Placeholdery dla brakujących komponentów
    differenceAs_Fk: <div>Instrukcja: Raport różnic AS - FK</div>,
    lawStatement: <div>Instrukcja: Zestawienie wpłat</div>,
  };

  // Lista kluczy, które mają renderować InstructionTable, ale nie mają opisu w tableDescriptions
  const simpleTables = [
    "/archive-table",
    "/all-data-table",
    "/krd",
    "/fk-documents-table",
    "/fk-disabled-documents-table",
    "/actual-law-table",
    "/no-accept-table",
    "/actual-insurance-table",
  ];

  const renderContent = () => {
    // 1. Sprawdź, czy klucz ma zdefiniowany opis (Tabela z nagłówkiem)
    if (tableDescriptions[selectedKey]) {
      const { title, description } = tableDescriptions[selectedKey];
      return (
        <div>
          <InfoHeader title={title} description={description} />
          <InstructionTable />
        </div>
      );
    }

    // 2. Sprawdź, czy to specjalny komponent z mapy
    if (contentMap[selectedKey]) {
      return contentMap[selectedKey];
    }

    // 3. Sprawdź, czy to zwykła tabela bez opisu
    if (simpleTables.includes(selectedKey)) {
      return <InstructionTable />;
    }

    // 4. Domyślny widok
    return (
      <div>
        Instrukcja w przygotowaniu lub nie znaleziono tematu ({selectedKey})
      </div>
    );
  };

  // Rekurencyjna funkcja renderowania drzewa menu
  const renderTree = (items, levelPrefix = "root") => {
    return items.map((item, index) => {
      const uniqueKey = `${levelPrefix}-${index}`;
      const children = item.submenu || item.sideMenu;
      const contentKey = item.path || item.action;

      if (children) {
        return (
          <div key={uniqueKey}>
            <section
              className="instruction__menu-item"
              onClick={() => toggleMenu(uniqueKey)}
            >
              <div className="instruction__menu-item--logo">
                {openMenus[uniqueKey] ? <FcRightDown2 /> : <FcRight />}
              </div>
              <span className="instruction__menu-item--title">
                {item.title || item.label}
              </span>
            </section>
            {openMenus[uniqueKey] && (
              <section
                className={
                  item.sideMenu
                    ? "instruction__menu-submenu2"
                    : "instruction__menu-submenu"
                }
              >
                {renderTree(children, uniqueKey)}
              </section>
            )}
          </div>
        );
      } else {
        return (
          <section
            key={uniqueKey}
            className={`instruction__menu-item ${
              selectedKey === contentKey ? "active" : ""
            }`}
            onClick={() => {
              if (contentKey) setSelectedKey(contentKey);
            }}
          >
            <div className="instruction__menu-item--logo">
              <FcRight />
            </div>
            <span className="instruction__menu-item--title">
              {item.label || item.title}
            </span>
          </section>
        );
      }
    });
  };

  return (
    <section className="instruction">
      <section className="instruction__menu">
        {/* --- STATYCZNE POZYCJE MENU --- */}
        <section
          className="instruction__menu-item"
          onClick={() => setSelectedKey("intro-help")}
        >
          <div className="instruction__menu-item--logo">
            <FcRight />
          </div>
          <span className="instruction__menu-item--title">
            Informacje o programie
          </span>
        </section>
        <section
          className="instruction__menu-item"
          onClick={() => setSelectedKey("intro-history")}
        >
          <div className="instruction__menu-item--logo">
            <FcRight />
          </div>
          <span className="instruction__menu-item--title">
            Historia projektu
          </span>
        </section>
        <section
          className="instruction__menu-item"
          onClick={() => setSelectedKey("intro-access")}
        >
          <div className="instruction__menu-item--logo">
            <FcRight />
          </div>
          <span className="instruction__menu-item--title">
            Dostęp do programu
          </span>
        </section>
        <section
          className="instruction__menu-item"
          onClick={() => setSelectedKey("intro-table-info")}
        >
          <div className="instruction__menu-item--logo">
            <FcRight />
          </div>
          <span className="instruction__menu-item--title">Tabela z danymi</span>
        </section>
        <section
          className="instruction__menu-item"
          onClick={() => setSelectedKey("intro-edit")}
        >
          <div className="instruction__menu-item--logo">
            <FcRight />
          </div>
          <span className="instruction__menu-item--title">
            Edycja dokumentu
          </span>
        </section>
        <section
          className="instruction__menu-item"
          onClick={() => setSelectedKey("intro-raport-fk")}
        >
          <div className="instruction__menu-item--logo">
            <FcRight />
          </div>
          <span className="instruction__menu-item--title">
            Raport Należności dla Zarządu
          </span>
        </section>

        {/* --- PRZEŁĄCZNIK MENU STRUKTURALNEGO --- */}
        <section
          className="instruction__menu-item"
          onClick={() => setHideMenu((prev) => !prev)}
          style={{
            marginTop: "20px",
            borderTop: "1px solid #ccc",
            paddingTop: "10px",
          }}
        >
          <div className="instruction__menu-item--logo">
            {hideMenu ? <FcRightDown2 /> : <FcRight />}
          </div>
          <span
            className="instruction__menu-item--title"
            style={{ fontWeight: "bold" }}
          >
            Menu programu (Struktura)
          </span>
        </section>

        {/* --- DYNAMICZNE MENU --- */}
        {hideMenu && (
          <section className="instruction__menu--hide">
            {renderTree(menuItems)}
          </section>
        )}
      </section>

      {/* --- KONTENER TREŚCI --- */}
      <section className="instruction__container">{renderContent()}</section>
    </section>
  );
};

export default Instruction;
