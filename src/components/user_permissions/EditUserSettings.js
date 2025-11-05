import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import UserChangeRoles from "./UserChangeRoles";
import UserChangeDepartments from "./UserChangeDepartments";
import UserChangeLawPartner from "./UserChangeLawPartner";
import UserChangeName from "./UserChangeName";
import UserChangePass from "./UserChangePass";
import UserChangeLogin from "./UserChangeLogin";
import UserDelete from "./UserDelete";
import PleaseWait from "../PleaseWait";
import { Button } from "@mui/material";

import "./EditUserSettings.css";

const EditUserSettings = ({ user, setEdit }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [permissions, setPermissions] = useState("");
  const [roles, setRoles] = useState({});
  const [departments, setDepartments] = useState([]);
  const [company, setCompany] = useState([]);
  const [pleaseWait, setPleaseWait] = useState(false);
  const [lawPartner, setLawPartner] = useState([]);
  // const [toggleState, setToggleState] = useState(1);
  // const toggleTab = (index) => {
  //   setToggleState(index);
  // };
  //sprawdzanie działów przypisanych do użytkownika, występujących w dokumentach i opisanych company_join_items
  const checkMergeDep = (data) => {
    const departmentsFromCompDocs = (
      data.find((obj) => obj.departmentsFromCompDocs)
        ?.departmentsFromCompDocs || []
    ).map(({ DZIAL, FIRMA }) => ({
      DEPARTMENT: DZIAL,
      COMPANY: FIRMA,
    }));
    const departmentsFromCJI =
      data.find((obj) => obj.departmentsFromCJI)?.departmentsFromCJI || [];
    const userDepartments =
      user?.departments[user.permissions]?.map((dep) => {
        return {
          COMPANY: dep.company,
          DEPARTMENT: dep.department,
        };
      }) || [];

    const getKey = ({ DEPARTMENT, COMPANY }) => `${DEPARTMENT}__${COMPANY}`;

    // Tworzymy zbiór unikalnych obiektów po DEPARTMENT i COMPANY
    const uniqueMap = new Map();

    [...departmentsFromCompDocs, ...departmentsFromCJI].forEach((obj) => {
      uniqueMap.set(getKey(obj), obj);
    });

    const uniqueDepartments = [...uniqueMap.values()];

    const finalArray = uniqueDepartments.map((dep) => {
      return {
        department: dep,
        available: departmentsFromCJI.some(
          (d) => d.DEPARTMENT === dep.DEPARTMENT && d.COMPANY === dep.COMPANY
        ),
        user: userDepartments.some(
          (d) => d.DEPARTMENT === dep.DEPARTMENT && d.COMPANY === dep.COMPANY
        ),
      };
    });

    // Sortujemy po nazwie działu, a jeśli są takie same – po firmie
    finalArray.sort(
      (a, b) =>
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

      const filteredExtOffice = result.data
        .map((item) => item.ext_company)
        .filter(Boolean)[0];

      const userExtOffice = filteredExtOffice.map((perm) => {
        const extOffice = user.departments["Kancelaria"] || [];

        // znajdź obiekt w tablicy, który ma klucz taki jak perm
        const found = extOffice.find((item) => Object.keys(item)[0] === perm);

        // jeśli znaleziono — użyj jego wartości, jeśli nie — false
        return { [perm]: found ? Object.values(found)[0] : false };
      });

      const company = result.data
        .map((item) => item.company)
        .filter(Boolean)[0];
      setPermissions(user?.permissions || "");
      setCompany(company);
      setDepartments(checkMergeDep(result.data));
      setRoles(roles);
      setLawPartner(userExtOffice);
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
            <section className="edit_user_settings_section-content-data">
              <UserChangeName
                id={user.id_user}
                name={user.username}
                surname={user.usersurname}
              />
              <UserChangePass id={user.id_user} />
              <UserChangeLogin id={user.id_user} login={user.userlogin} />
              <UserDelete
                id={user.id_user}
                login={user.userlogin}
                setEdit={setEdit}
              />
            </section>

            <section className="edit_user_settings_section-content-data">
              {/* {permissions && Object.keys(permissions).length > 0 && (
                <UserChangePermissions
                  id={user.id_user}
                  permissions={permissions}
                  setPermissions={setPermissions}
                />
              )} */}

              {
                // permissions === "Pracownik" &&
                roles && Object.keys(roles).length > 0 && (
                  <UserChangeRoles
                    id={user.id_user}
                    roles={roles}
                    setRoles={setRoles}
                    permission={permissions}
                    // user={user.roles}
                  />
                )
              }
              {roles?.LawPartner === true && permissions === "Pracownik" && (
                <UserChangeLawPartner
                  id={user.id_user}
                  lawPartner={lawPartner}
                  setLawPartner={setLawPartner}
                />
              )}
              {permissions === "Kancelaria" && (
                <UserChangeLawPartner
                  id={user.id_user}
                  lawPartner={lawPartner}
                  setLawPartner={setLawPartner}
                />
              )}
            </section>

            <section className="edit_user_settings_section-content-data">
              {permissions === "Pracownik" &&
                departments &&
                Object.keys(departments).length > 0 && (
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
};

export default EditUserSettings;
