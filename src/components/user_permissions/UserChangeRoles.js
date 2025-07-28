import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";
import { Button } from "@mui/material";
import "./UserChangeRoles.css";

const UserChangeRoles = ({ id, roles }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();

  const [userRoles, setUserRoles] = useState({});
  const [errMsg, setErrMsg] = useState("");

  const rolesItem = Object.entries(userRoles).map(
    ([role, isChecked], index) => (

      <section key={index} className="user-change-roles__container">
        <label
          className="user-change-roles__container--info"
          id={`role${index}`}
        >
          <span className="user-change-roles__container--text">
            {role}
            {role === "FK_KRT" && (
              <span className="user-change-roles--information">
                {" - dodatkowy Raport FK - KRT"}

              </span>
            )}
            {role === "FK_KEM" && (
              <span className="user-change-roles--information">
                {" - dodatkowy Raport FK - KEM"}

              </span>
            )}
            {role === "FK_RAC" && (
              <span className="user-change-roles--information">
                {" - dodatkowy Raport FK - RAC"}

              </span>
            )}
            {role === "FKAdmin" && (
              <span className="user-change-roles--information">
                {" - administrator FK"}

              </span>
            )}
            {role === "User" && (
              <span className="user-change-roles--information">
                {" "}
                - przeglądanie dokumentów
              </span>
            )}
            {role === "Nora" && (
              <span className="user-change-roles--information">
                {" "}
                - raporty dla Nory
              </span>
            )}
            {role === "Editor" && (
              <span className="user-change-roles--information">
                {" "}
                - edytowanie dokumentów
              </span>
            )}
            {role === "Controller" && (
              <span className="user-change-roles--information">
                {" "}
                - kontroler dokumentów
              </span>
            )}
            {role === "Admin" && (
              <span className="user-change-roles--information">
                {" - Administrator"}
              </span>
            )}

            {role === "SuperAdmin" && (
              <span className="user-change-roles--information">
                {" - Super Administartor"}
              </span>
            )}
          </span>
          <input
            className="user-change-roles--check"
            name={`role${index}`}
            type="checkbox"
            checked={isChecked}
            onChange={() => {
              setUserRoles((prevRoles) => {
                const updatedRoles = { ...prevRoles, [role]: !isChecked };

                if (role === "Editor" && !isChecked) {
                  updatedRoles["User"] = true;
                }

                // Jeśli zaznaczono 'Admin', ustaw także 'Editor' na 'true'
                // if (role === "Admin" && !isChecked) {
                //   updatedRoles["User"] = true;
                //   updatedRoles["Editor"] = true;
                //   updatedRoles["Controller"] = true;
                //   updatedRoles["FK"] = true;
                //   updatedRoles["Nora"] = true;
                // }

                return updatedRoles;
              });
            }}
          />
        </label>
      </section>
    )
  );

  const handleChangeRoles = async () => {
    try {

      const arrayRoles = Object.entries(userRoles)
        .map(([role, isChecked]) => {
          if (isChecked) {
            return role;
          }
        })
        .filter(Boolean);

      // dodaje role Start - podstwawowa rola startowa
      arrayRoles.push("Start");
      await axiosPrivateIntercept.patch(`/user/change-roles/${id}`, {
        roles: arrayRoles,
      });
      setErrMsg("Sukces.");
    } catch (err) {
      setErrMsg("Dostęp nie został zmieniony.");
      console.error(err);
    }
  };

  useEffect(() => {
    const superAdmin = auth.roles.filter(item => item == 2000);


    const newRoles = superAdmin.length ? {
      User: roles?.User ? roles.User : false,
      Editor: roles?.Editor ? roles.Editor : false,
      Admin: roles?.Admin ? roles.Admin : false,
      Controller: roles?.Controller ? roles.Controller : false,
      FK_KRT: roles?.FK_KRT ? roles.FK_KRT : false,
      FK_KEM: roles?.FK_KEM ? roles.FK_KEM : false,
      FK_RAC: roles?.FK_RAC ? roles.FK_RAC : false,
      Nora: roles?.Nora ? roles.Nora : false,
      SuperAdmin: roles?.SuperAdmin ? roles.SuperAdmin : false,
    } : {
      User: roles?.User ? roles.User : false,
      Editor: roles?.Editor ? roles.Editor : false,
      Admin: roles?.Admin ? roles.Admin : false,
    };

    setUserRoles(newRoles);

  }, [roles]);

  return (
    <section className="user-change-roles">
      <section className="user-change-roles__title">
        <h3 className="user-change-roles__title--name">
          {!errMsg ? "Zmień uprawnienia użytkownika" : errMsg}
        </h3>
      </section>
      {rolesItem}
      <Button variant="contained" onClick={handleChangeRoles} size="small">
        Zmień
      </Button>
    </section>
  );
};

export default UserChangeRoles;
