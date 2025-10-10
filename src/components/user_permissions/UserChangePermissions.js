import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import { Button } from "@mui/material";
// import "./UserChangePermissions.css";

const UserChangePermissions = ({ id, permissions }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [userPermissions, setUserPermissions] = useState(permissions);
  const [errMsg, setErrMsg] = useState("");

  const permissionsItem = Object.entries(userPermissions).map(
    ([permission, isChecked], index) => (
      <section key={index} className=".user-change-roles__container">
        <label
          className="user-change-roles__container--info"
          id={`permission${index}`}
        >
          <span className="user-change-roles__container--text">
            {permission === "Basic" && (
              <span className="edit_system_change--roles__container--information">
                Basic - widzi tylko swoje faktury
              </span>
            )}
            {permission === "Standard" && (
              <span className="edit_system_change--roles__container--information">
                Standard - widzi faktury całego działu
              </span>
            )}
          </span>
          <input
            className="user-change-roles--check"
            name={`permission${index}`}
            type="checkbox"
            checked={isChecked}
            onChange={() => {
              setUserPermissions((prevRoles) => {
                const updatedRoles = {};
                Object.keys(prevRoles).forEach((key) => {
                  updatedRoles[key] = key === permission;
                });
                return updatedRoles;
              });
            }}
          />
        </label>
      </section>
    )
  );

  const handleChangePermission = async () => {
    try {
      await axiosPrivateIntercept.patch(`/user/change-permissions/${id}`, {
        permissions: userPermissions,
      });
      setErrMsg("Sukces.");
    } catch (err) {
      setErrMsg("Uprawnienia nie zostały zmienione.");
      console.error(err);
    }
  };

  useEffect(() => {
    setErrMsg("");
  }, [userPermissions]);

  return (
    <section className="user-change-roles">
      <section className="user-change-roles__title">
        <h3 className="user-change-roles__title--name">
          {!errMsg ? "Zmień dostęp użytkownika" : errMsg}
        </h3>
      </section>
      {permissionsItem}
      <Button variant="contained" onClick={handleChangePermission} size="small">
        Zmień
      </Button>
    </section>
  );
};

export default UserChangePermissions;
