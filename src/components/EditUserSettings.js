import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import UserTableColumns from "./UserTableColumns";
import UserChangeRoles from "./UserChangeRoles";
import UserChangeDepartments from "./UserChangeDepartments";
import UserChangePermissions from "./UserChangePermissions";
import UserChangeName from "./UserChangeName";
import UserChangePass from "./UserChangePass";
import UserChangeLogin from "./UserChangeLogin";
import UserDelete from "./UserDelete";
import PleaseWait from "./PleaseWait";
import { FiX } from "react-icons/fi";
import isEqual from "lodash/isEqual";
// import useData from "./hooks/useData";

import "./EditUserSettings.css";

const EditUserSettings = ({ user, setEdit }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  // const { pleaseWait, setPleaseWait } = useData();

  const [permissions, setPermissions] = useState({});
  const [roles, setRoles] = useState({});
  const [departments, setDepartments] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pleaseWait, setPleaseWait] = useState(false);
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
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

      const filteredDepartments = result.data
        .map((item) => item.departments)
        .filter(Boolean)[0];

      const filteredPermissions = result.data
        .map((item) => item.permissions)
        .filter(Boolean)[0];

      const columnsDB = result.data
        .map((item) => item.columns)
        .filter(Boolean)[0];

      const userColumns = user?.columns ? [...user.columns] : [];

      const departments = filteredDepartments.reduce((acc, dep) => {
        // Ustawiamy user.departments jako pusty obiekt, jeśli nie istnieje
        const userDepartments = user?.departments || {};
        acc[dep] = userDepartments[dep] ? true : false;
        return acc;
      }, {});

      const permissions = filteredPermissions.reduce((acc, perm, index) => {
        // Ustawiamy user.permissions jako pusty obiekt, jeśli nie istnieje
        const userPermissions = user?.permissions || {};
        acc[perm] = userPermissions[perm] ? true : false;
        return acc;
      }, {});

      const modifiedColumnsDB = columnsDB.map((col) => {
        const userColMatch = userColumns.find((userCol) =>
          isEqual(col, userCol)
        );
        return { ...col, checked: !!userColMatch };
      });
      setPermissions(permissions);
      setDepartments(departments);
      setRoles(roles);
      setColumns(modifiedColumnsDB);
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
                <section className="edit_user_settings--bloc-tabs">
                  <button
                    className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
                    onClick={() => toggleTab(1)}
                  >
                    Globalne
                  </button>
                  <button
                    className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
                    onClick={() => toggleTab(2)}
                  >
                    Blacharnia
                  </button>
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
                        // style={{ backgroundColor: "red" }}
                      >
                        {roles && Object.keys(roles).length > 0 && (
                          <UserChangeRoles user={user} roles={roles} />
                        )}
                      </section>

                      <section className="edit_user_settings_section-content-data">
                        <UserChangeName user={user} />
                        <UserChangePass user={user} />
                      </section>
                      <section className="edit_user_settings_section-content-data">
                        <UserChangeLogin user={user} />
                        <UserDelete user={user} setEdit={setEdit} />
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
                        {columns.length > 0 && (
                          <UserTableColumns user={user} columns={columns} />
                        )}
                      </section>
                      <section className="edit_user_settings_section-content-data">
                        {permissions && Object.keys(permissions).length > 0 && (
                          <UserChangePermissions
                            user={user}
                            permissions={permissions}
                          />
                        )}
                        {departments && Object.keys(departments).length > 0 && (
                          <UserChangeDepartments
                            user={user}
                            departments={departments}
                          />
                        )}
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
