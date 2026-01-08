// // import React from "react";
// // import "./ChangeOrgStr.css";

// // const MissingDepartments = ({ departments, companyData }) => {
// //   // Debugowanie wewnątrz komponentu

// //   // Obliczamy firmy, które mają jakiekolwiek braki
// //   const getActiveCompanies = () => {
// //     if (!departments || departments.length === 0) return [];
// //     if (companyData?.selectCompany && companyData.selectCompany !== "ALL") {
// //       return [companyData.selectCompany];
// //     }
// //     // Wyciągamy unikalne nazwy firm z dostępnych braków
// //     return [...new Set(departments.map((d) => d.company))].sort();
// //   };

// //   const activeCompanies = getActiveCompanies();

// //   // Pomocnik do listingu
// //   const renderDeps = (list, modifier) => {
// //     if (list.length === 0)
// //       return <span className="missing-deps__empty">Brak</span>;
// //     return list.map((item, i) => (
// //       <span
// //         key={i}
// //         className={`missing-deps__item missing-deps__item--${modifier}`}
// //       >
// //         {item.dep}
// //         {i < list.length - 1 && ", "}
// //       </span>
// //     ));
// //   };

// //   // Zamiast return null, renderujemy pusty ale istniejący kontener jeśli brak danych
// //   // To zapobiega "skakaniu" layoutu i błędom znikających komponentów
// //   return (
// //     <section
// //       className="missing-deps"
// //       style={{ display: departments?.length > 0 ? "flex" : "none" }}
// //     >
// //       <aside className="missing-deps__legend">
// //         <div className="missing-deps__cell missing-deps__cell--header">
// //           Statusy
// //         </div>
// //         <div className="missing-deps__cell">
// //           <span className="missing-deps__label missing-deps__label--success">
// //             Nierozliczone FV:
// //           </span>
// //         </div>
// //         <div className="missing-deps__cell">
// //           <span className="missing-deps__label missing-deps__label--danger">
// //             Rozliczone FV:
// //           </span>
// //         </div>
// //         <div className="missing-deps__cell">
// //           <span className="missing-deps__label missing-deps__label--manual">
// //             Ręczne:
// //           </span>
// //         </div>
// //       </aside>

// //       <div className="missing-deps__content">
// //         {activeCompanies.map((compName) => {
// //           const compItems = departments.filter((d) => d.company === compName);

// //           return (
// //             <div key={compName} className="missing-deps__company-col">
// //               <div className="missing-deps__cell missing-deps__cell--header">
// //                 {compName}
// //               </div>
// //               <div className="missing-deps__cell">
// //                 {renderDeps(
// //                   compItems.filter((d) => d.exist && !d.manual),
// //                   "success"
// //                 )}
// //               </div>
// //               <div className="missing-deps__cell">
// //                 {renderDeps(
// //                   compItems.filter((d) => !d.exist && !d.manual),
// //                   "danger"
// //                 )}
// //               </div>
// //               <div className="missing-deps__cell">
// //                 {renderDeps(
// //                   compItems.filter((d) => d.manual),
// //                   "manual"
// //                 )}
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </section>
// //   );
// // };

// // export default MissingDepartments;

// import React from "react";
// import "./ChangeOrgStr.css";

// const MissingDepartments = ({ departments, companyData }) => {
//   if (!departments || departments.length === 0 || !companyData) return null;

//   // 1. Obliczamy, które firmy bierzemy pod uwagę
//   const getActiveCompanies = () => {
//     if (companyData?.selectCompany && companyData.selectCompany !== "ALL") {
//       return [companyData.selectCompany];
//     }
//     return [...new Set(departments.map((d) => d.company))].sort();
//   };

//   const activeCompanies = getActiveCompanies();

//   // 2. Filtrujemy działy tylko dla aktywnych firm, aby sprawdzić widoczność wierszy
//   const relevantDeps = departments.filter((d) =>
//     activeCompanies.includes(d.company)
//   );

//   // 3. Sprawdzamy, czy w ogóle istnieją dane w konkretnych kategoriach (dla widocznych firm)
//   const hasSuccess = relevantDeps.some((d) => d.exist && !d.manual);
//   const hasDanger = relevantDeps.some((d) => !d.exist && !d.manual);
//   const hasManual = relevantDeps.some((d) => d.manual);

//   // Pomocnik do listingu
//   const renderDeps = (list, modifier) => {
//     // Tutaj już nie musimy zwracać "Brak", bo wiersz wyświetli się tylko gdy są dane
//     return list.map((item, i) => (
//       <span
//         key={i}
//         className={`missing-deps__item missing-deps__item--${modifier}`}
//       >
//         {item.dep}
//         {i < list.length - 1 && ", "}
//       </span>
//     ));
//   };

//   return (
//     <section
//       className="missing-deps"
//       style={{
//         display: hasSuccess || hasDanger || hasManual ? "flex" : "none",
//       }}
//     >
//       <aside className="missing-deps__legend">
//         <div className="missing-deps__cell missing-deps__cell--header">
//           Statusy
//         </div>
//         {hasSuccess && (
//           <div className="missing-deps__cell">
//             <span className="missing-deps__label missing-deps__label--success">
//               Nierozliczone FV:
//             </span>
//           </div>
//         )}
//         {hasDanger && (
//           <div className="missing-deps__cell">
//             <span className="missing-deps__label missing-deps__label--danger">
//               Rozliczone FV:
//             </span>
//           </div>
//         )}
//         {hasManual && (
//           <div className="missing-deps__cell">
//             <span className="missing-deps__label missing-deps__label--manual">
//               Ręczne:
//             </span>
//           </div>
//         )}
//       </aside>

//       <div className="missing-deps__content">
//         {activeCompanies.map((compName) => {
//           const compItems = departments.filter((d) => d.company === compName);

//           return (
//             <div key={compName} className="missing-deps__company-col">
//               <div className="missing-deps__cell missing-deps__cell--header">
//                 {compName}
//               </div>

//               {hasSuccess && (
//                 <div className="missing-deps__cell">
//                   {renderDeps(
//                     compItems.filter((d) => d.exist && !d.manual),
//                     "success"
//                   )}
//                 </div>
//               )}

//               {hasDanger && (
//                 <div className="missing-deps__cell">
//                   {renderDeps(
//                     compItems.filter((d) => !d.exist && !d.manual),
//                     "danger"
//                   )}
//                 </div>
//               )}

//               {hasManual && (
//                 <div className="missing-deps__cell">
//                   {renderDeps(
//                     compItems.filter((d) => d.manual),
//                     "manual"
//                   )}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// };

// export default MissingDepartments;

import React from "react";
import "./ChangeOrgStr.css";

const MissingDepartments = ({ departments, companyData }) => {
  if (!departments || departments.length === 0 || !companyData) return null;

  const getActiveCompanies = () => {
    if (companyData?.selectCompany && companyData.selectCompany !== "ALL") {
      return [companyData.selectCompany];
    }
    return [...new Set(departments.map((d) => d.company))].sort();
  };

  const activeCompanies = getActiveCompanies();

  const relevantDeps = departments.filter((d) =>
    activeCompanies.includes(d.company)
  );

  const hasSuccess = relevantDeps.some((d) => d.exist && !d.manual);
  const hasDanger = relevantDeps.some((d) => !d.exist && !d.manual);
  const hasManual = relevantDeps.some((d) => d.manual);

  // POMOCNIK DO LISTINGU - Poprawiony separator
  const renderDeps = (list, modifier) => {
    return list.map((item, i) => (
      <span
        key={i}
        className={`missing-deps__item missing-deps__item--${modifier}`}
      >
        {item.dep}
        {/* Dodajemy przecinek i jawną spację (niełamliwą) */}
        {i < list.length - 1 ? ",\u00A0" : ""}
      </span>
    ));
  };

  return (
    <section
      className="missing-deps"
      style={{
        display: hasSuccess || hasDanger || hasManual ? "flex" : "none",
      }}
    >
      <aside className="missing-deps__legend">
        <div className="missing-deps__cell missing-deps__cell--header">
          Statusy
        </div>
        {hasSuccess && (
          <div className="missing-deps__cell">
            <span className="missing-deps__label missing-deps__label--success">
              Nierozliczone FV:
            </span>
          </div>
        )}
        {hasDanger && (
          <div className="missing-deps__cell">
            <span className="missing-deps__label missing-deps__label--danger">
              Rozliczone FV:
            </span>
          </div>
        )}
        {hasManual && (
          <div className="missing-deps__cell">
            <span className="missing-deps__label missing-deps__label--manual">
              Ręczne:
            </span>
          </div>
        )}
      </aside>

      <div className="missing-deps__content">
        {activeCompanies.map((compName) => {
          const compItems = departments.filter((d) => d.company === compName);

          return (
            <div key={compName} className="missing-deps__company-col">
              <div className="missing-deps__cell missing-deps__cell--header">
                {compName}
              </div>

              {hasSuccess && (
                <div className="missing-deps__cell">
                  {renderDeps(
                    compItems.filter((d) => d.exist && !d.manual),
                    "success"
                  )}
                </div>
              )}

              {hasDanger && (
                <div className="missing-deps__cell">
                  {renderDeps(
                    compItems.filter((d) => !d.exist && !d.manual),
                    "danger"
                  )}
                </div>
              )}

              {hasManual && (
                <div className="missing-deps__cell">
                  {renderDeps(
                    compItems.filter((d) => d.manual),
                    "manual"
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MissingDepartments;
