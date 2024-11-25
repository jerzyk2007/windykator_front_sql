import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import "./UserChangeDepartments.css";

const UserChangeDepartments = ({ user, departments }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [userDepartments, setUserDepartments] = useState(departments);
  const [errMsg, setErrMsg] = useState("");

  const departmentsItem = userDepartments.map((item, index) => {
    return (
      <label
        key={index}
        className="user_change_departments__container--info"
        id={`dep${index}`}
      >
        <span
          style={!item.available ? { color: "red", fontWeight: "bold" } : null}
          className="user_change_departments__container--text">{item.dep}</span>
        {item.available && <input
          className="user_change_departments__container--check"
          type="checkbox"
          onChange={() =>
            setUserDepartments((prev) => {
              return prev.map((obj) =>
                obj.dep === item.dep ? { ...obj, user: !obj.user } : obj
              );
            })
          }
          checked={item.user}
        />}
      </label>

    );
  });


  const handleChangeChecked = (info) => {
    const updatedUserDepartments = userDepartments.map(item => {
      return {
        ...item,
        user: item.available ? info === "all" ? true : false : false
      };
    });
    setUserDepartments(updatedUserDepartments);
  };

  const handleSaveUserDepartments = async () => {

    const activeDepartments = userDepartments
      .filter(item => item.user) // Zatrzymaj tylko obiekty, gdzie user === true
      .map(item => item.dep);    // Zwróć tylko wartości dep jako stringi

    try {
      await axiosPrivateIntercept.patch(
        `/user/change-departments/${user.id_user}`,
        {
          departments: activeDepartments,
        }
      );
      setErrMsg(`Sukces.`);
    } catch (err) {
      setErrMsg(`Zmiana się nie powiodła.`);
      console.error(err);
    }
  };

  useEffect(() => {
    setErrMsg("");
  }, [userDepartments]);

  return (
    <section className="user_change_departments">
      <section className="user_change_departments__title">
        <h3 className="user_change_departments--name">
          {!errMsg ? "Dostęp do działów" : errMsg}
        </h3>
        <section className="user_change_departments__select">
          <Button
            variant="contained"
            onClick={() => handleChangeChecked("all")}
            size="small"
            color="secondary"
          >
            Zaznacz
          </Button>

          <Button
            variant="outlined"
            onClick={() => handleChangeChecked("none")}
            size="small"
            color="secondary"
          >
            Odznacz
          </Button>
        </section>
      </section>
      <section className="user_change_departments__container">
        {departmentsItem}
      </section>
      <Button
        variant="contained"
        onClick={handleSaveUserDepartments}
        size="small"
      >
        Zmień
      </Button>
    </section>
  );
};

export default UserChangeDepartments;
