import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";
import { Button } from "@mui/material";
// import "./UserChangeRoles.css";

const UserChangeRoles = ({ id, roles, setRoles, permission }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();
  const [userRoles, setUserRoles] = useState({});
  const [errMsg, setErrMsg] = useState("");

  // const rolesItem = Object.entries(userRoles).map(
  //   ([role, isChecked], index) => (
  //     <section key={index} className="user-change-roles__container">
  //       <label
  //         className="user-change-roles__container--info"
  //         id={`role${index}`}
  //       >
  //         <span className="user-change-roles__container--text">
  //           {/* Owinąłem nazwę roli w span dla lepszego wyglądu */}
  //           <span className="role-name">{role}</span>

  //           {role === "FK_KRT" && (
  //             <span className="user-change-roles--information">
  //               {" dodatkowy Raport FK - KRT"}
  //             </span>
  //           )}
  //           {role === "FK_KEM" && (
  //             <span className="user-change-roles--information">
  //               {" dodatkowy Raport FK - KEM"}
  //             </span>
  //           )}
  //           {role === "FK_RAC" && (
  //             <span className="user-change-roles--information">
  //               {" dodatkowy Raport FK - RAC"}
  //             </span>
  //           )}
  //           {role === "FKAdmin" && (
  //             <span className="user-change-roles--information">
  //               {" administrator FK"}
  //             </span>
  //           )}
  //           {role === "User" && (
  //             <span className="user-change-roles--information">
  //               {" przeglądanie dokumentów"}
  //             </span>
  //           )}
  //           {role === "Nora" && (
  //             <span className="user-change-roles--information">
  //               {" raporty dla Nory"}
  //             </span>
  //           )}
  //           {role === "Insurance" && (
  //             <span className="user-change-roles--information">
  //               {" obsługa polis"}
  //             </span>
  //           )}
  //           {role === "Editor" && (
  //             <span className="user-change-roles--information">
  //               {" edytowanie dokumentów"}
  //             </span>
  //           )}
  //           {role === "Raports" && (
  //             <span className="user-change-roles--information">
  //               {" tylko pobieranie raportów excel"}
  //             </span>
  //           )}
  //           {role === "Controller" && (
  //             <span className="user-change-roles--information">
  //               {" kontroler dokumentów"}
  //             </span>
  //           )}
  //           {role === "DNiKN" && (
  //             <span className="user-change-roles--information">
  //               {" wszystkie uprawnienia windykacyjne"}
  //             </span>
  //           )}
  //           {role === "LawPartner" && (
  //             <span className="user-change-roles--information">
  //               {" dostęp do danych zewn Kancelarii"}
  //             </span>
  //           )}
  //           {role === "Admin" && (
  //             <span className="user-change-roles--information">
  //               {" Administrator"}
  //             </span>
  //           )}

  //           {role === "SuperAdmin" && (
  //             <span className="user-change-roles--information">
  //               {" Super Administrator"}
  //             </span>
  //           )}
  //         </span>
  //         <input
  //           className="user-change-roles--check"
  //           name={`role${index}`}
  //           type="checkbox"
  //           checked={isChecked}
  //           onChange={() => {
  //             setUserRoles((prevRoles) => {
  //               const updatedRoles = { ...prevRoles, [role]: !isChecked };
  //               if (role === "Editor" && !isChecked) {
  //                 updatedRoles["User"] = true;
  //               }
  //               return updatedRoles;
  //             });
  //           }}
  //         />
  //       </label>
  //     </section>
  //   )
  // );

  const handleChangeRoles = async () => {
    try {
      const arrayRoles = Object.entries(userRoles)
        .map(([role, isChecked]) => (isChecked ? role : null))
        .filter(Boolean);
      await axiosPrivateIntercept.patch(`/user/change-roles/${id}`, {
        roles: arrayRoles,
      });
      setRoles(userRoles);
      setErrMsg("Sukces.");
    } catch (err) {
      setErrMsg("Dostęp nie został zmieniony.");
      console.error(err);
    }
  };

  useEffect(() => {
    const superAdmin = auth.roles.filter((item) => item === 2000);
    const newRolesUser = superAdmin.length
      ? {
          User: roles?.User || false,
          Editor: roles?.Editor || false,
          Raports: roles?.Raports || false,
          Admin: roles?.Admin || false,
          Controller: roles?.Controller || false,
          DNiKN: roles?.DNiKN || false,
          FK_KRT: roles?.FK_KRT || false,
          FK_KEM: roles?.FK_KEM || false,
          FK_RAC: roles?.FK_RAC || false,
          Nora: roles?.Nora || false,
          Insurance: roles?.Insurance || false,
          LawPartner: roles?.LawPartner || false,
          SuperAdmin: roles?.SuperAdmin || false,
        }
      : {
          User: roles?.User || false,
          Editor: roles?.Editor || false,
          Admin: roles?.Admin || false,
        };

    const newRolesLaw = {
      LawPartner: roles?.LawPartner || false,
    };

    setUserRoles(permission === "Pracownik" ? newRolesUser : newRolesLaw);
  }, [roles]);

  // return (
  //   <section className="user-change-roles">
  //     <section className="user-change-roles__title">
  //       <h3 className="user-change-roles__title--name">
  //         {!errMsg ? "Zmień uprawnienia użytkownika" : errMsg}
  //       </h3>
  //     </section>
  //     <section className="user-change-roles__wrapper">{rolesItem}</section>
  //     <Button
  //       className="edit_user__Buttons"
  //       variant="contained"
  //       onClick={handleChangeRoles}
  //       size="small"
  //       sx={{
  //         // Dodatkowe wymuszenie stylów MUI, jeśli globalne style by je nadpisywały
  //         textTransform: "none",
  //         fontSize: "0.9rem",
  //       }}
  //     >
  //       Zapisz zmiany
  //     </Button>
  //   </section>
  // );
  return (
    <section className="user-edit-card user-edit-card--flexible">
      <header className="user-edit-card__header">
        <h3 className="user-edit-card__title">
          {!errMsg ? "Zmień uprawnienia użytkownika" : errMsg}
        </h3>
      </header>

      <div className="user-edit-card__content">
        <div className="user-edit-card__list">
          {Object.entries(userRoles).map(([role, isChecked], index) => (
            <label
              key={index}
              className="user-edit-card__item user-edit-card__item--row"
            >
              <div className="user-edit-card__item-text">
                <span className="user-edit-card__item-label">{role}</span>
                {/* <span className="user-edit-card__item-sub">
                  {role === "User" && "przeglądanie dokumentów"}
                  {role === "Editor" && "edytowanie dokumentów"}
                  {role === "Raports" && "dostęp tylko do wybranych raportów"}
                  {role === "Admin" &&
                    "możliwość dodawanie użytkowników i nadawanie niektórych uprawnień"}
                  {role === "Controller" &&
                    "dostęp do panelu kontroli dokumentów oraz raportu z tym związanego"}
                  {role === "DNiKN" && "dostęp tylko dla pracowników DNiKN"}
                  {role === "FK_KRT" && "generowanie Raportu Draft dla KRT"}
                  {role === "FK_KEM" && "generowanie Raportu Draft dla KEM"}
                  {role === "FK_RAC" && "generowanie Raportu Draft dla RAC"}
                  {role === "Nora" &&
                    "generowanie i pobieranie raportów przygotowanych dla Nora"}
                  {role === "Insurance" &&
                    "dostęp do windykacji polis ubezpieczeniowych"}
                  {role === "LawPartner" &&
                    "dostęp do windykacji przekierowanych do zewnętrznych kancelarii"}
                  {role === "SuperAdmin" &&
                    "możliwość nadawanie wszystkich możliwych dostępów dla użytkowników"}
                </span> */}
                <span className="user-edit-card__item-sub">
                  {role === "User" && "dostęp do przeglądania dokumentów"}
                  {role === "Editor" && "możliwość edytowania dokumentów"}
                  {role === "Raports" &&
                    "dostęp wyłącznie do wybranych raportów"}
                  {role === "Admin" &&
                    "zarządzanie użytkownikami oraz nadawanie wybranych uprawnień"}
                  {role === "Controller" &&
                    "dostęp do panelu kontroli dokumentów oraz powiązanych raportów"}
                  {role === "DNiKN" &&
                    "dostęp przeznaczony wyłącznie dla pracowników DNiKN"}
                  {role === "FK_KRT" &&
                    "generowanie raportu Draft dla jednostki KRT"}
                  {role === "FK_KEM" &&
                    "generowanie raportu Draft dla jednostki KEM"}
                  {role === "FK_RAC" &&
                    "generowanie raportu Draft dla jednostki RAC"}
                  {role === "Nora" &&
                    "generowanie oraz pobieranie raportów przygotowanych dla Nora"}
                  {role === "Insurance" &&
                    "dostęp do modułu windykacji polis ubezpieczeniowych"}
                  {role === "LawPartner" &&
                    "dostęp do windykacji przekazywanej do zewnętrznych kancelarii"}
                  {role === "SuperAdmin" &&
                    "pełne uprawnienia, w tym nadawanie wszystkich dostępów użytkownikom"}
                </span>
              </div>
              <input
                type="checkbox"
                className="user-edit-card__checkbox"
                checked={isChecked}
                onChange={() =>
                  setUserRoles((prev) => ({ ...prev, [role]: !isChecked }))
                }
              />
            </label>
          ))}
        </div>
      </div>

      <footer className="user-edit-card__footer">
        <Button
          variant="contained"
          className="user-edit-card__button"
          onClick={handleChangeRoles}
        >
          Zapisz zmiany
        </Button>
      </footer>
    </section>
  );
};

export default UserChangeRoles;
