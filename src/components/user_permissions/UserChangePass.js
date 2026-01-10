import { useState } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import { Button } from "@mui/material";

const UserChangePass = ({ id }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [userPass, setUserPass] = useState("");
  const [isValidPass, setIsValidPass] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

  const handleChangePass = async () => {
    try {
      await axiosPrivateIntercept.patch(
        `/user/another-user-change-pass/${id}`,
        {
          password: userPass,
        }
      );
      setUserPass("");
      setErrMsg("Sukces.");
    } catch (err) {
      setErrMsg("Hasło nie zostało zmienione.");
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const newPassword = e.target.value;
    setUserPass(newPassword);
    const verifyPass = PASSWORD_REGEX.test(newPassword);
    setIsValidPass(verifyPass);
    setErrMsg("");
  };

  return (
    <section className="user-edit-card user-edit-card--limited">
      <header className="user-edit-card__header">
        <h3 className="user-edit-card__title">
          {!errMsg ? "Zmień hasło użytkownika" : errMsg}
        </h3>
      </header>

      <div className="user-edit-card__content user-edit-card__content--centered">
        <input
          className="user-edit-card__input"
          type="text" // Pozostawione jako text dla widoczności przy zmianie przez admina
          placeholder="podaj nowe hasło"
          value={userPass}
          onChange={handleInputChange}
        />
        {/* Opcjonalnie można tu dodać mały tekst z wymaganiami, jeśli isValidPass jest false i userPass nie jest puste */}
      </div>

      <footer className="user-edit-card__footer">
        <Button
          variant="contained"
          className="user-edit-card__button"
          onClick={handleChangePass}
          disabled={!isValidPass}
          color="primary"
          size="small"
        >
          Zmień hasło
        </Button>
      </footer>
    </section>
  );
};

export default UserChangePass;
