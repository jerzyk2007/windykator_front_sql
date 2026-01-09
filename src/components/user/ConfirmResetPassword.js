import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { axiosPrivate } from "../../api/axios";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import PleaseWait from "../PleaseWait";
import "../Login.css";

const ConfirmResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [confirmPass, setConfirmPass] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [matchPassword, setMatchPassword] = useState("");
  const [validMatchPassword, setValidMatchPassword] = useState(false);
  const [matchPasswordFocus, setMatchPasswordFocus] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.patch(
        `/reset-password/change-pass`,
        JSON.stringify({ password, token }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      navigate("/login", { replace: true });
    } catch (err) {
      setErrMsg("Sesja wygasła lub błąd serwera.");
    }
  };

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
    setValidMatchPassword(password === matchPassword && matchPassword !== "");
  }, [password, matchPassword]);

  const verifyResetPass = async () => {
    try {
      const result = await axiosPrivate.post(
        `/reset-password/verify-pass`,
        JSON.stringify({ token }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (result?.data?.checkDate) setConfirmPass(true);
      else navigate("/login");
    } catch (error) {
      navigate("/login");
    }
  };

  useEffect(() => {
    verifyResetPass();
  }, []);

  if (!confirmPass) return <PleaseWait />;

  return (
    <div className="login-page">
      <section className="login-card">
        <header className="login-card__header">
          <h1 className="login-card__title">Ustalanie nowego hasła</h1>
        </header>

        <form className="login-card__content" onSubmit={handleSubmit}>
          {errMsg && <p className="register-card__error-box">{errMsg}</p>}

          <div className="login-card__field">
            <label className="login-card__label">
              Nowe hasło:
              <span className={validPassword ? "icon-valid" : "icon-hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
            </label>
            <input
              className="login-card__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              required
            />
            {passwordFocus && !validPassword && (
              <p className="login-card__instruction">
                Musi zawierać: 8-24 znaki, A-z, 0-9 i znak specjalny.
              </p>
            )}
          </div>

          <div className="login-card__field">
            <label className="login-card__label">
              Powtórz hasło:
              <span className={validMatchPassword ? "icon-valid" : "icon-hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
            </label>
            <input
              className="login-card__input"
              type="password"
              value={matchPassword}
              onChange={(e) => setMatchPassword(e.target.value)}
              onFocus={() => setMatchPasswordFocus(true)}
              onBlur={() => setMatchPasswordFocus(false)}
              required
            />
          </div>

          <Button
            variant="contained"
            type="submit"
            className="login-card__button"
            disabled={!validPassword || !validMatchPassword}
          >
            Zapisz nowe hasło
          </Button>
        </form>
      </section>
    </div>
  );
};

export default ConfirmResetPassword;
