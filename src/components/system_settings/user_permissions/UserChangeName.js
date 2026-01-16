import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import "./EditUserSettings.css";

const UserChangeName = ({ id, name, surname }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [username, setUsername] = useState("");
  const [usersurname, setUsersurname] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleChangeNameSurname = async () => {
    try {
      await axiosPrivateIntercept.patch(`/user/change-name/${id}`, {
        name: username,
        surname: usersurname,
      });
      setErrMsg("Sukces.");
    } catch (err) {
      setErrMsg(`Zmiana się nie powiodła.`);
      console.error(err);
    }
  };

  useEffect(() => {
    setErrMsg("");
  }, [username, usersurname]);

  return (
    <section className="user-edit-card user-edit-card--limited">
      <header className="user-edit-card__header">
        <h3 className="user-edit-card__title">
          {!errMsg ? "Zmień imię i nazwisko użytkownika" : errMsg}
        </h3>
      </header>

      <div className="user-edit-card__content user-edit-card__content--centered">
        <input
          className="user-edit-card__input"
          type="text"
          placeholder={name}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="user-edit-card__input"
          type="text"
          placeholder={surname}
          value={usersurname}
          onChange={(e) => setUsersurname(e.target.value)}
        />
      </div>

      <footer className="user-edit-card__footer">
        <Button
          variant="contained"
          className="user-edit-card__button"
          onClick={handleChangeNameSurname}
          disabled={!username || !usersurname}
          color="primary"
          size="small"
        >
          Zapisz zmiany
        </Button>
      </footer>
    </section>
  );
};

export default UserChangeName;
