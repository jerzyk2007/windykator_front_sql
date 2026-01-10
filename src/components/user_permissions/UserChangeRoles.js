import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";
import { Button } from "@mui/material";

const UserChangeRoles = ({ id, roles, setRoles, permission }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();
  const [userRoles, setUserRoles] = useState({});
  const [errMsg, setErrMsg] = useState("");

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
                <span className="user-edit-card__item-sub">
                  {role === "User" && "dostęp do przeglądania tabeli"}
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
          size="small"
        >
          Zapisz zmiany
        </Button>
      </footer>
    </section>
  );
};

export default UserChangeRoles;
