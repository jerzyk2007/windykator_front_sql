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
import { FiX } from "react-icons/fi";

import "./EditUserSettings.css";

const EditUserSettings = ({ user, setEdit }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [permissions, setPermissions] = useState({});
  const [roles, setRoles] = useState({});
  const [departments, setDepartments] = useState([]);
  const [pleaseWait, setPleaseWait] = useState(false);
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };

  useEffect(() => {
    const getSettings = async () => {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get("/settings/get-settings");


      const checkDep = () => {
        const filteredDep = result.data.find(obj => obj.departments)?.departments || [];
        const filteredDepJI = result.data.find(obj => obj.departmentsJI)?.departmentsJI || [];
        const userDepartments = user?.departments || []; // Sprawdzamy, czy tablica user?.departments istnieje
        const uniqueDepartments = new Set([...filteredDep, ...filteredDepJI]);
        const finalArray = [];

        uniqueDepartments.forEach(department => {
          finalArray.push({
            dep: department,
            available: filteredDepJI.includes(department),
            user: userDepartments.includes(department)
          });
        });
        finalArray.sort((a, b) => a.dep.localeCompare(b.dep));
        return finalArray;
      };

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


      // console.log(checkDep());
      const permissions = filteredPermissions.reduce((acc, perm, index) => {
        // Ustawiamy user.permissions jako pusty obiekt, jeśli nie istnieje
        const userPermissions = user?.permissions || {};
        acc[perm] = userPermissions[perm] ? true : false;
        return acc;
      }, {});

      setPermissions(permissions);
      setDepartments(checkDep());
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
          <section className="edit_user_settings_items">
            <section className="edit_user_settings-wrapper">
              <section className="edit_user_settings__container">
                {/* <section className="edit_user_settings--bloc-tabs"> */}
                <section className="bloc-tabs">
                  <button
                    className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
                    onClick={() => toggleTab(1)}
                  ></button>
                  <button
                    className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
                    onClick={() => toggleTab(2)}
                  ></button>
                  <button
                    className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
                    onClick={() => toggleTab(3)}
                  ></button>
                </section>

                <section className="edit_user_settings_content-tabs">
                  <section
                    className={
                      toggleState === 1 ? "content  active-content" : "content"
                    }
                  >
                    <section className="edit_user_settings_section-content">
                      <section
                        className="edit_user_settings_section-content-data"
                      >
                        {roles && Object.keys(roles).length > 0 && (
                          <UserChangeRoles user={user} roles={roles} />
                        )}
                        {permissions && Object.keys(permissions).length > 0 && (
                          <UserChangePermissions
                            user={user}
                            permissions={permissions}
                          />
                        )}
                      </section>

                      <section className="edit_user_settings_section-content-data">
                        <UserChangeName user={user} />
                        <UserChangePass user={user} />
                        <UserChangeLogin user={user} />
                        <UserDelete user={user} setEdit={setEdit} />
                      </section>
                      <section className="edit_user_settings_section-content-data">
                        {departments && Object.keys(departments).length > 0 && (
                          <UserChangeDepartments
                            user={user}
                            departments={departments}
                          />
                        )}
                      </section>
                    </section>
                  </section>
                  <section
                    className={
                      toggleState === 2 ? "content  active-content" : "content"
                    }
                  >
                    <section className="edit_user_settings_section-content">
                      <section className="edit_user_settings_section-content-data">
                      </section>
                      <section className="edit_user_settings_section-content-data">
                      </section>
                      <section className="edit_user_settings_section-content-data"></section>
                    </section>
                  </section>
                  <section
                    className={
                      toggleState === 3 ? "content  active-content" : "content"
                    }
                  >
                    <section className="edit_user_settings_section-content">
                      <section className="edit_user_settings_section-content-data"></section>
                      <section className="edit_user_settings_section-content-data"></section>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>

          <FiX
            className="edit_user_settings-button"
            onClick={() => setEdit(false)}
          />
        </>
      )}
    </section>
  );
};

export default EditUserSettings;
