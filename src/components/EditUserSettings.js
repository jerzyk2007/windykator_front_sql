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

  useEffect(() => {
    const getSettings = async () => {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get("/settings/get-settings");
      const filteredRoles = result.data
        .map((item) => item.roles)
        .filter(Boolean)[0];
      // console.log(user.roles);
      // console.log(filteredRoles);

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
      const userColumns = [...user.columns];

      const departments = filteredDepartments.reduce((acc, dep, index) => {
        acc[dep] = user?.departments[dep] ? true : false;
        return acc;
      }, {});

      const permissions = filteredPermissions.reduce((acc, perm, index) => {
        acc[perm] = user?.permissions[perm] ? true : false;
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
          <section className="edit_user_settings__container">
            {columns.length && (
              <UserTableColumns user={user} columns={columns} />
            )}
          </section>

          <section className="edit_user_settings__container">
            {roles && Object.keys(roles).length > 0 && (
              <UserChangeRoles user={user} roles={roles} />
            )}
            {permissions && Object.keys(permissions).length > 0 && (
              <UserChangePermissions user={user} permissions={permissions} />
            )}
            {departments && Object.keys(departments).length > 0 && (
              <UserChangeDepartments user={user} departments={departments} />
            )}
          </section>

          <section className="edit_user_settings__container">
            <UserChangeName user={user} />
            <UserChangePass user={user} />
            <UserChangeLogin user={user} />
            <UserDelete user={user} setEdit={setEdit} />
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
