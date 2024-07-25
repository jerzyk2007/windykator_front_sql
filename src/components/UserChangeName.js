import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import "./UserChangeName.css";

const UserChangeName = ({ user }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [username, setUsername] = useState("");
  const [usersurname, setUsersurname] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleChangeNameSurname = async () => {
    try {
      const result = await axiosPrivateIntercept.patch(
        `/user/change-name/${user._id}`,
        {
          name: username,
          surname: usersurname,
        }
      );
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
    <section className="user_change_name">
      <section className="user_change_name__title">
        <h3 className="user_change_name__title--name">
          {!errMsg ? "Zmień imię i nazwisko użytkownika" : errMsg}
        </h3>
      </section>

      <section className="user_change_name__container">
        <input
          className="user_change_name__container--edit"
          type="text"
          placeholder={user.username}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="user_change_name__container--edit"
          type="text"
          placeholder={user.usersurname}
          value={usersurname}
          onChange={(e) => setUsersurname(e.target.value)}
        />
      </section>
      {/* <button className='user_change_name--button' disabled={!username || !usersurname} onClick={handleChangeNameSurname}>Zmień</button> */}
      <Button
        variant="contained"
        onClick={handleChangeNameSurname}
        disabled={!username || !usersurname}
        size="small"
      >
        Zmień
      </Button>
    </section>
  );
};

export default UserChangeName;
