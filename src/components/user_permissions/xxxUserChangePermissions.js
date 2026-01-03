// import { useState, useEffect } from "react";
// import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
// import { Button } from "@mui/material";
// import "./UserChangePermissions.css";

// const UserChangePermissions = ({ id, permissions, setPermissions }) => {
//   const axiosPrivateIntercept = useAxiosPrivateIntercept();

//   // const [userPermissions, setUserPermissions] = useState(permissions);
//   const [errMsg, setErrMsg] = useState("");

//   const permissionsItem = Object.entries(permissions).map(
//     ([permission, isChecked], index) => (
//       <section key={index} className=".user-change-permissions__container">
//         <label
//           className="user-change-permissions__container--info"
//           id={`permission${index}`}
//         >
//           <span className="user-change-permissions__container--text">
//             {permission === "Pracownik" && (
//               <span className="edit_system_change--roles__container--information">
//                 Pracownik - dotyczy osób zatrudnionych w strukturach Krotoski
//               </span>
//             )}
//             {permission === "Kancelaria" && (
//               <span className="edit_system_change--roles__container--information">
//                 Kancelaria - dotyczy osób z kancelarii zewnętrznych
//               </span>
//             )}
//           </span>
//           <input
//             className="user-change-permissions--check"
//             name={`permission${index}`}
//             type="checkbox"
//             checked={isChecked}
//             onChange={() => {
//               setPermissions((prevRoles) => {
//                 const updatedRoles = {};
//                 Object.keys(prevRoles).forEach((key) => {
//                   updatedRoles[key] = key === permission;
//                 });
//                 return updatedRoles;
//               });
//             }}
//           />
//         </label>
//       </section>
//     )
//   );

//   const handleChangePermission = async () => {
//     try {
//       await axiosPrivateIntercept.patch(`/user/change-permissions/${id}`, {
//         permissions: permissions,
//       });
//       setErrMsg("Sukces.");
//     } catch (err) {
//       setErrMsg("Uprawnienia nie zostały zmienione.");
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     setErrMsg("");
//   }, [permissions]);

//   return (
//     <section className="user-change-permissions">
//       <section className="user-change-permissions__title">
//         <h3 className="user-change-permissions__title--name">
//           {!errMsg ? "Zmień dostęp użytkownika" : errMsg}
//         </h3>
//       </section>
//       {permissionsItem}
//       <Button variant="contained" onClick={handleChangePermission} size="small">
//         Zmień
//       </Button>
//     </section>
//   );
// };

// export default UserChangePermissions;

import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import "./UserChangePermissions.css";

const UserChangePermissions = ({ id, permissions, setPermissions }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [errMsg, setErrMsg] = useState("");

  const permissionsItem = Object.entries(permissions).map(
    ([permission, isChecked], index) => (
      // Usunięto błędną kropkę z nazwy klasy w kodzie JSX
      <section key={index} className="user-change-permissions__container">
        <label
          className="user-change-permissions__container--info"
          id={`permission${index}`}
        >
          <span className="user-change-permissions__container--text">
            {permission === "Pracownik" && (
              <span className="edit_system_change--roles__container--information">
                <strong>Pracownik</strong> - dotyczy osób zatrudnionych w
                strukturach Krotoski
              </span>
            )}
            {permission === "Kancelaria" && (
              <span className="edit_system_change--roles__container--information">
                <strong>Kancelaria</strong> - dotyczy osób z kancelarii
                zewnętrznych
              </span>
            )}
          </span>
          <input
            className="user-change-permissions--check"
            name={`permission${index}`}
            type="checkbox"
            checked={isChecked}
            onChange={() => {
              setPermissions((prevRoles) => {
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
        permissions: permissions,
      });
      setErrMsg("Sukces.");
    } catch (err) {
      setErrMsg("Uprawnienia nie zostały zmienione.");
      console.error(err);
    }
  };

  useEffect(() => {
    setErrMsg("");
  }, [permissions]);

  return (
    <section className="user-change-permissions">
      <section className="user-change-permissions__title">
        <h3 className="user-change-permissions__title--name">
          {!errMsg ? "Zmień dostęp użytkownika" : errMsg}
        </h3>
      </section>

      {/* Kontenery z opcjami */}
      {permissionsItem}

      <Button
        className="edit_user__Buttons"
        variant="contained"
        onClick={handleChangePermission}
        size="small"
        sx={{ textTransform: "none" }}
      >
        Zapisz dostęp
      </Button>
    </section>
  );
};

export default UserChangePermissions;
