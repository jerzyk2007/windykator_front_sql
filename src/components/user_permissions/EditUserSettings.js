import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import UserChangeRoles from "./UserChangeRoles";
import UserChangeDepartments from "./UserChangeDepartments";
import UserChangePermissions from "./UserChangePermissions";
import UserChangeName from "./UserChangeName";
import UserChangePass from "./UserChangePass";
import UserChangeLogin from "./UserChangeLogin";
import UserDelete from "./UserDelete";
import PleaseWait from "../PleaseWait";
import { Button } from "@mui/material";


import "./EditUserSettings.css";

const EditUserSettings = ({ user, setEdit }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [permissions, setPermissions] = useState({});
  const [roles, setRoles] = useState({});
  const [departments, setDepartments] = useState([]);
  const [company, setCompany] = useState([]);
  const [pleaseWait, setPleaseWait] = useState(false);
  // const [toggleState, setToggleState] = useState(1);
  // const toggleTab = (index) => {
  //   setToggleState(index);
  // };


  //sprawdzanie działów przypisanych do użytkownika, występujących w dokumentach i opisanych company_join_items
  const checkMergeDep = (data) => {
    const departmentsFromCompDocs = (
      data.find(obj => obj.departmentsFromCompDocs)?.departmentsFromCompDocs || []
    ).map(({ DZIAL, FIRMA }) => ({
      DEPARTMENT: DZIAL,
      COMPANY: FIRMA
    }));
    const departmentsFromCJI = data.find(obj => obj.departmentsFromCJI)?.departmentsFromCJI || [];
    const userDepartments = user?.departments?.map(dep => {
      return {
        COMPANY: dep.company,
        DEPARTMENT: dep.department
      };
    }) || [];

    const getKey = ({ DEPARTMENT, COMPANY }) => `${DEPARTMENT}__${COMPANY}`;

    // Tworzymy zbiór unikalnych obiektów po DEPARTMENT i COMPANY
    const uniqueMap = new Map();

    [...departmentsFromCompDocs, ...departmentsFromCJI].forEach(obj => {
      uniqueMap.set(getKey(obj), obj);
    });

    const uniqueDepartments = [...uniqueMap.values()];

    const finalArray = uniqueDepartments.map(dep => ({
      department: dep,
      available: departmentsFromCJI.some(
        d => d.DEPARTMENT === dep.DEPARTMENT && d.COMPANY === dep.COMPANY
      ),
      user: userDepartments.some(
        d => d.DEPARTMENT === dep.DEPARTMENT && d.COMPANY === dep.COMPANY
      )
    }));

    // Sortujemy po nazwie działu, a jeśli są takie same – po firmie
    finalArray.sort((a, b) =>
      a.department.DEPARTMENT.localeCompare(b.department.DEPARTMENT) ||
      a.department.COMPANY.localeCompare(b.department.COMPANY)
    );

    return finalArray;
  };

  useEffect(() => {
    const getSettings = async () => {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get("/settings/get-settings");

      const filteredRoles = result.data
        .map((item) => item.roles)
        .filter(Boolean)[0];

      const roles = filteredRoles.reduce((acc, role, index) => {
        // acc[role] = user?.roles[index] ? true : false;
        acc[role] = user?.roles.includes(role);
        return acc;
      }, {});

      const filteredPermissions = result.data
        .map((item) => item.permissions)
        .filter(Boolean)[0];

      const permissions = filteredPermissions.reduce((acc, perm, index) => {
        // Ustawiamy user.permissions jako pusty obiekt, jeśli nie istnieje
        const userPermissions = user?.permissions || {};
        acc[perm] = userPermissions[perm] ? true : false;
        return acc;
      }, {});

      const company = result.data
        .map((item) => item.company)
        .filter(Boolean)[0];


      setPermissions(permissions);
      setCompany(company);
      setDepartments(checkMergeDep(result.data));
      setRoles(roles);
      setPleaseWait(false);
    };
    getSettings();
  }, []);

  return (
    <section className="edit_user_settings">
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <>
          <section className="edit_user_settings_section-content">
            <section
              className="edit_user_settings_section-content-data"
            >
              {roles && Object.keys(roles).length > 0 && (
                <UserChangeRoles
                  id={user.id_user}
                  roles={roles}
                  user={user.roles}
                />
              )}
              {permissions && Object.keys(permissions).length > 0 && (
                <UserChangePermissions
                  id={user.id_user}
                  permissions={permissions}
                />
              )}
            </section>

            <section className="edit_user_settings_section-content-data">
              <UserChangeName
                id={user.id_user}
                name={user.username}
                surname={user.usersurname}
              />
              <UserChangePass
                id={user.id_user}
              />
              <UserChangeLogin
                id={user.id_user}
                login={user.userlogin}
              />
              <UserDelete
                id={user.id_user}
                login={user.userlogin}
                setEdit={setEdit} />
            </section>
            <section className="edit_user_settings_section-content-data">
              {departments && Object.keys(departments).length > 0 && (
                <UserChangeDepartments
                  id={user.id_user}
                  departments={departments}
                  multiCompany={company}
                />
              )}
            </section>
          </section>
          {/* <FiX
            className="edit_user_settings-button"
            onClick={() => setEdit(false)}
          /> */}

        </>
      )}
      <section className="edit_user_settings-button">
        <Button
          className="mui-button"
          variant="contained"
          size="large"
          color="secondary"
          onClick={() => setEdit(false)}
        >
          Wyjście
        </Button>
      </section>
    </section>
  );
  // return (
  //   <section className="edit_user_settings">
  //     {pleaseWait ? (
  //       <PleaseWait />
  //     ) : (
  //       <>
  //         <section className="edit_user_settings_items">
  //           <section className="edit_user_settings-wrapper">
  //             <section className="edit_user_settings__container">
  //               <section className="bloc-tabs">
  //                 <button
  //                   className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
  //                   onClick={() => toggleTab(1)}
  //                 ></button>
  //                 <button
  //                   className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
  //                   onClick={() => toggleTab(2)}
  //                 ></button>
  //                 <button
  //                   className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
  //                   onClick={() => toggleTab(3)}
  //                 ></button>
  //               </section>

  //               <section className="edit_user_settings_content-tabs">
  //                 <section
  //                   className={
  //                     toggleState === 1 ? "content  active-content" : "content"
  //                   }
  //                 >
  //                   <section className="edit_user_settings_section-content">
  //                     <section
  //                       className="edit_user_settings_section-content-data"
  //                     >
  //                       {roles && Object.keys(roles).length > 0 && (
  //                         <UserChangeRoles user={user} roles={roles} />
  //                       )}
  //                       {permissions && Object.keys(permissions).length > 0 && (
  //                         <UserChangePermissions
  //                           user={user}
  //                           permissions={permissions}
  //                         />
  //                       )}
  //                     </section>

  //                     <section className="edit_user_settings_section-content-data">
  //                       <UserChangeName user={user} />
  //                       <UserChangePass user={user} />
  //                       <UserChangeLogin user={user} />
  //                       <UserDelete user={user} setEdit={setEdit} />
  //                     </section>
  //                     <section className="edit_user_settings_section-content-data">
  //                       {departments && Object.keys(departments).length > 0 && (
  //                         <UserChangeDepartments
  //                           user={user}
  //                           departments={departments}
  //                         />
  //                       )}
  //                     </section>
  //                   </section>
  //                 </section>
  //                 <section
  //                   className={
  //                     toggleState === 2 ? "content  active-content" : "content"
  //                   }
  //                 >
  //                   <section className="edit_user_settings_section-content">
  //                     <section className="edit_user_settings_section-content-data">
  //                     </section>
  //                     <section className="edit_user_settings_section-content-data">
  //                     </section>
  //                     <section className="edit_user_settings_section-content-data"></section>
  //                   </section>
  //                 </section>
  //                 <section
  //                   className={
  //                     toggleState === 3 ? "content  active-content" : "content"
  //                   }
  //                 >
  //                   <section className="edit_user_settings_section-content">
  //                     <section className="edit_user_settings_section-content-data"></section>
  //                     <section className="edit_user_settings_section-content-data"></section>
  //                   </section>
  //                 </section>
  //               </section>
  //             </section>
  //           </section>
  //         </section>

  //         <FiX
  //           className="edit_user_settings-button"
  //           onClick={() => setEdit(false)}
  //         />
  //       </>
  //     )}
  //   </section>
  // );
};

export default EditUserSettings;
