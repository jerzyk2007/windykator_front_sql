import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import { Button } from "@mui/material";
// import "./UserChangeDepartments.css";

const UserChangeDepartments = ({ id, departments, multiCompany }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [startData, setStartData] = useState(departments);
  const [userDepartments, setUserDepartments] = useState([]);
  const [company, setCompany] = useState(
    multiCompany.length > 1
      ? ["ALL", ...multiCompany]
      : multiCompany.length === 1
      ? multiCompany
      : []
  );
  const [changeCompany, setChangeCompany] = useState(
    multiCompany?.length > 1
      ? "ALL"
      : multiCompany?.length === 1
      ? multiCompany[0]
      : ""
  );
  const [errMsg, setErrMsg] = useState("");

  const handleChangeAllChecked = (info) => {
    const updatedUserDepartments = startData.map((item) => {
      if (changeCompany === "ALL") {
        return {
          ...item,
          user: item.available ? (info === "all" ? true : false) : false,
        };
      } else {
        if (item.department.COMPANY === changeCompany) {
          return {
            ...item,
            user: item.available ? (info === "all" ? true : false) : false,
          };
        }
        return item;
      }
    });
    setStartData(updatedUserDepartments);
  };

  const handleChangeCheckedDep = (dep) => {
    const updateDeps = startData.map((item) => {
      if (
        item.department.DEPARTMENT === dep.department.DEPARTMENT &&
        item.department.COMPANY === dep.department.COMPANY
      ) {
        return { ...item, user: !item.user };
      } else {
        return item;
      }
    });
    setStartData(updateDeps);
  };

  const handleSaveUserDepartments = async () => {
    const activeDepartments = startData
      .filter((item) => item.user)
      .map((item) => ({
        department: item.department.DEPARTMENT,
        company: item.department.COMPANY,
      }));
    try {
      await axiosPrivateIntercept.patch(`/user/change-departments/${id}`, {
        activeDepartments,
      });
      setErrMsg(`Sukces.`);
    } catch (err) {
      setErrMsg(`Zmiana się nie powiodła.`);
      console.error(err);
    }
  };

  const departmentsItem = userDepartments.map((item, index) => {
    const isUnavailable = !item.available;
    return (
      <label key={index} className="user_change_departments__info">
        <section className="user_change_departments__text">
          <span
            className="dep-name"
            style={isUnavailable ? { color: "#d32f2f" } : null}
          >
            {item.department.DEPARTMENT}
          </span>
          <span
            className="comp-name"
            style={isUnavailable ? { color: "#d32f2f" } : null}
          >
            {item.department.COMPANY}
          </span>
        </section>
        {item.available && (
          <input
            className="user_change_departments__container--check"
            type="checkbox"
            onChange={() => handleChangeCheckedDep(item)}
            checked={item.user}
          />
        )}
      </label>
    );
  });

  useEffect(() => {
    setErrMsg("");
    setUserDepartments(startData);
  }, [startData]);

  useEffect(() => {
    setUserDepartments(
      changeCompany === "ALL"
        ? startData
        : startData.filter((item) => item.department.COMPANY === changeCompany)
    );
  }, [changeCompany, startData]);

  // return (
  //   <section className="user_change_departments">
  //     <header className="user_change_departments__title">
  //       <div className="user_change_departments--counter">
  //         <div className="user_change_departments--counter--info">
  //           {userDepartments ? userDepartments.length : "0"}
  //         </div>
  //       </div>
  //       <h3 className="user_change_departments__title--name">
  //         {!errMsg ? "Dostęp do działów" : errMsg}
  //       </h3>
  //       <select
  //         className="user_change_departments__title--select"
  //         value={changeCompany}
  //         onChange={(e) => setChangeCompany(e.target.value)}
  //       >
  //         {company.map((option, index) => (
  //           <option key={index} value={option}>
  //             {option}
  //           </option>
  //         ))}
  //       </select>
  //     </header>

  //     <section className="user_change_departments__select">
  //       <Button
  //         variant="contained"
  //         onClick={() => handleChangeAllChecked("all")}
  //         size="small"
  //         color="primary"
  //       >
  //         Zaznacz widoczne
  //       </Button>
  //       <Button
  //         variant="outlined"
  //         onClick={() => handleChangeAllChecked("none")}
  //         size="small"
  //         color="primary"
  //       >
  //         Odznacz widoczne
  //       </Button>
  //     </section>

  //     <section className="user_change_departments__container">
  //       {departmentsItem}
  //     </section>

  //     <footer className="user_change_departments__accept">
  //       <Button
  //         className="edit_user__Buttons"
  //         variant="contained"
  //         onClick={handleSaveUserDepartments}
  //         size="medium"
  //         color="success"
  //       >
  //         Zapisz zmiany
  //       </Button>
  //     </footer>
  //   </section>
  // );
  return (
    <section className="user-edit-card">
      <header className="user-edit-card__header">
        <div className="user-edit-card__badge">
          {userDepartments?.length || "0"}
        </div>
        <h3 className="user-edit-card__title">
          {!errMsg ? "Dostęp do działów" : errMsg}
        </h3>
        <select
          className="user-edit-card__header-select"
          value={changeCompany}
          onChange={(e) => setChangeCompany(e.target.value)}
        >
          {company.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </header>

      <section className="user-edit-card__filters">
        <Button
          variant="contained"
          onClick={() => handleChangeAllChecked("all")}
          size="small"
        >
          Zaznacz
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleChangeAllChecked("none")}
          size="small"
        >
          Odznacz
        </Button>
      </section>

      <div className="user-edit-card__content">
        <div className="user-edit-card__grid">
          {userDepartments.map((item, index) => (
            <label key={index} className="user-edit-card__item">
              <div className="user-edit-card__item-text--dep">
                <span
                  className="user-edit-card__item-label--dep"
                  style={!item.available ? { color: "#d32f2f" } : null}
                >
                  {item.department.DEPARTMENT}
                </span>
                <span
                  className="user-edit-card__item-sub--dep"
                  style={!item.available ? { color: "#d32f2f" } : null}
                >
                  {item.department.COMPANY}
                </span>
              </div>
              {item.available && (
                <input
                  type="checkbox"
                  className="user-edit-card__checkbox"
                  checked={item.user}
                  onChange={() => handleChangeCheckedDep(item)}
                />
              )}
            </label>
          ))}
        </div>
      </div>

      <footer className="user-edit-card__footer">
        <Button
          variant="contained"
          className="user-edit-card__button"
          onClick={handleSaveUserDepartments}
          color="success"
        >
          Zapisz zmiany
        </Button>
      </footer>
    </section>
  );
};

export default UserChangeDepartments;
