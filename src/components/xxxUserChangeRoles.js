import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from "./hooks/useData";
import { Button } from "@mui/material";
import "./UserChangeRoles.css";

const UserChangeRoles = ({ user, roles }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();

  const [userRoles, setUserRoles] = useState(roles);
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
            {role === "FK" && (
              <span className="user-change-roles--information">
                {" "}
                - dodatkowy Raport DW
              </span>
            )}
            {role === "FKAdmin" && (
              <span className="user-change-roles--information">
                {" "}
                - admin FK
              </span>
            )}
            {role === "User" && (
              <span className="user-change-roles--information">
                {" "}
                - BL przeglądanie
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
                - BL edytowanie tabel i raportów
              </span>
            )}
            {role === "EditorPlus" && (
              <span className="user-change-roles--information">
                {" "}
                - BL Editor + dodawanie danych
              </span>
            )}

            {role === "Admin" && (
              <span className="user-change-roles--information">
                {" "}
                - Super Admin
              </span>
            )}
          </span>
          <input
            className="user-change-roles--check"
            name={`role${index}`}
            type="checkbox"
            // checked={isChecked || role === 'User'}
            checked={isChecked}
            onChange={() => {
              // Jeśli rola to 'User', nie zmieniaj wartości
              // if (role === 'User') return;
              setUserRoles((prevRoles) => {
                const updatedRoles = { ...prevRoles, [role]: !isChecked };

                if (role === "Editor" && !isChecked) {
                  updatedRoles["User"] = true;
                }

                // Jeśli zaznaczono 'Admin', ustaw także 'Editor' na 'true'
                if (role === "Admin" && !isChecked) {
                  updatedRoles["User"] = true;
                  updatedRoles["Editor"] = true;
                }

                // Jeśli odznaczono 'Editor', ustaw także 'Admin' na 'false'
                if (role === "Editor" && isChecked) {
                  updatedRoles["Admin"] = false;
                }

                //odznacz inne role jesli jest zaznaczany FK
                // if (role === "FK" && !isChecked) {
                //   updatedRoles["User"] = false;
                //   updatedRoles["Editor"] = false;
                //   updatedRoles["Admin"] = false;
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

      await axiosPrivateIntercept.patch(`/user/change-roles/${user.id_user}`, {
        roles: arrayRoles,
      });
      setErrMsg("Sukces.");
    } catch (err) {
      setErrMsg("Dostęp nie został zmieniony.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!auth?.roles?.includes(1000)) {
      const acceptedRoles = ["User", "Editor", "EditorPlus"];

      const filteredRoles = Object.keys(roles).reduce((acc, role) => {
        if (acceptedRoles.includes(role)) {
          acc[role] = roles[role];
        }
        return acc;
      }, {});

      setUserRoles(filteredRoles);
    }
    setErrMsg("");
  }, [roles]);

  return (
    <section className="user-change-roles">
      <section className="user-change-roles__title">
        <h3 className="user-change-roles__title--name">
          {!errMsg ? "Zmień uprawnienia użytkownika" : errMsg}
        </h3>
      </section>
      {rolesItem}
      {/* <button className='user-change-roles--button' onClick={handleChangeRoles} >Zmień</button> */}
      <Button variant="contained" onClick={handleChangeRoles} size="small">
        Zmień
      </Button>
    </section>
  );
};

export default UserChangeRoles;
