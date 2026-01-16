import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import { Button } from "@mui/material";

const UserChangeLogin = ({ id, login }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [userLogin, setUserLogin] = useState("");
  const [isValidLogin, setIsValidLogin] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const MAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChangeLogin = async () => {
    try {
      await axiosPrivateIntercept.patch(`/user/change-login/${id}`, {
        newUserlogin: userLogin,
      });
      setErrMsg(`Sukces.`);
    } catch (err) {
      if (err.response?.status === 409) {
        setErrMsg(`Użytkownik ${userLogin} już istnieje.`);
      } else {
        setErrMsg(`Zmiana się nie powiodła.`);
      }
      console.error(err);
    }
  };

  useEffect(() => {
    const verifyLogin = MAIL_REGEX.test(userLogin);
    setIsValidLogin(verifyLogin);
    setErrMsg("");
  }, [userLogin]);

  return (
    <section className="user-edit-card user-edit-card--limited">
      <header className="user-edit-card__header">
        <h3 className="user-edit-card__title">
          {!errMsg ? "Zmień login użytkownika" : errMsg}
        </h3>
      </header>

      <div className="user-edit-card__content user-edit-card__content--centered">
        <input
          className="user-edit-card__input"
          type="email"
          placeholder={login}
          value={userLogin}
          onChange={(e) => setUserLogin(e.target.value.toLowerCase())}
        />
      </div>

      <footer className="user-edit-card__footer">
        <Button
          variant="contained"
          className="user-edit-card__button"
          onClick={handleChangeLogin}
          disabled={!isValidLogin}
          color="primary"
          size="small"
        >
          Zmień login
        </Button>
      </footer>
    </section>
  );
};

export default UserChangeLogin;
