import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import "./UserChangeDepartments.css";

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

  // zmienia zaznaczenia dla wszytskich działów z uwględnieniem firmy
  const handleChangeAllChecked = (info) => {
    const updatedUserDepartments = startData.map((item) => {
      if (changeCompany === "ALL") {
        return {
          ...item,
          user: item.available ? (info === "all" ? true : false) : false,
        };
      } else {
        // tylko zmień user, jeśli company się zgadza
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

  // zmienia zaznaczenia dla pojedyńczych działów
  const handleChangeCheckedDep = (dep) => {
    const updateDeps = startData.map((item) => {
      if (
        item.department.DEPARTMENT === dep.department.DEPARTMENT &&
        item.department.COMPANY === dep.department.COMPANY
      ) {
        return {
          ...item,
          user: !item.user,
        };
      } else {
        return item;
      }
    });
    setStartData(updateDeps);
  };

  const handleSaveUserDepartments = async () => {
    const activeDepartments = startData
      .filter((item) => item.user) // Zatrzymaj tylko obiekty, gdzie user === true
      .map((item) => {
        return {
          department: item.department.DEPARTMENT,
          company: item.department.COMPANY,
        };
      }); // Zwróć tylko wartości dep jako stringi
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
    return (
      <label
        key={index}
        className="user_change_departments__info"
        id={`dep${index}`}
      >
        <section className="user_change_departments__text">
          <span
            style={
              !item.available ? { color: "red", fontWeight: "bold" } : null
            }
          >
            {item.department.DEPARTMENT}
          </span>
          <span
            style={
              !item.available ? { color: "red", fontWeight: "bold" } : null
            }
          >
            {item.department.COMPANY}
          </span>
        </section>
        {item.available && (
          <input
            className="user_change_departments__container--check"
            type="checkbox"
            // onChange={() =>
            //   setUserDepartments((prev) => {
            //     return prev.map((obj) =>
            //       obj.dep === item.dep ? { ...obj, user: !obj.user } : obj
            //     );
            //   })
            // }
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

  return (
    <section className="user_change_departments">
      <section className="user_change_departments__title">
        <section className="user_change_departments--counter">
          <span className="user_change_departments--counter--info">
            {userDepartments ? userDepartments.length : ""}
          </span>
        </section>
        <h3 className="user_change_departments__title--name">
          {!errMsg ? "Dostęp do działów" : errMsg}
        </h3>
        <select
          className="user_change_departments__title--select"
          value={changeCompany}
          onChange={(e) => setChangeCompany(e.target.value)}
        >
          {company.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </section>
      <section className="user_change_departments__select">
        <Button
          variant="contained"
          onClick={() => handleChangeAllChecked("all")}
          size="small"
          color="secondary"
        >
          Zaznacz
        </Button>

        <Button
          variant="outlined"
          onClick={() => handleChangeAllChecked("none")}
          size="small"
          color="secondary"
        >
          Odznacz
        </Button>
      </section>
      <section className="user_change_departments__container">
        {departmentsItem}
      </section>

      <section className="user_change_departments__accept">
        <Button
          variant="contained"
          onClick={handleSaveUserDepartments}
          size="small"
        >
          Zmień
        </Button>
      </section>
    </section>
  );
};

export default UserChangeDepartments;
