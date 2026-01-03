import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import useLogout from "../hooks/useLogout";
import useData from "../hooks/useData";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiX } from "react-icons/fi";
import { Button } from "@mui/material";
import "../Login.css"; // Używamy wspólnego CSS

const ChangePassword = () => {
  const passRef = useRef();
  const navigate = useNavigate();
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const logout = useLogout();
  const { auth } = useData();

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
    if (!PASSWORD_REGEX.test(password)) {
      setErrMsg("Hasło nie spełnia wymagań.");
      return;
    }
    try {
      await axiosPrivateIntercept.patch(
        `/user/change-pass/${auth.id_user}`,
        JSON.stringify({ password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      logout();
    } catch (err) {
      setErrMsg(
        err.response?.status === 401
          ? "Brak autoryzacji."
          : "Błąd zmiany hasła."
      );
    }
  };

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
    setValidMatchPassword(password === matchPassword && matchPassword !== "");
    setErrMsg("");
  }, [password, matchPassword]);

  return (
    <div className="login-page">
      <section className="login-card">
        {/* <FiX className="login-card__close" onClick={() => navigate(-1)} /> */}
        <header className="login-card__header">
          <h1 className="login-card__title">
            {errMsg ? (
              <span className="msg-error">{errMsg}</span>
            ) : (
              "Zmiana hasła"
            )}
          </h1>
          <FiX className="login-card__close" onClick={() => navigate(-1)} />
        </header>

        <form className="login-card__content" onSubmit={handleSubmit}>
          <div
            className="login-card__info-box"
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            Zmiana hasła spowoduje automatyczne wylogowanie.
          </div>

          <div className="login-card__field">
            <label className="login-card__label">
              Nowe hasło:
              <span className={validPassword ? "icon-valid" : "icon-hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={
                  validPassword || !password ? "icon-hide" : "icon-invalid"
                }
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              className="login-card__input"
              type="password"
              ref={passRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              required
            />
            {passwordFocus && !validPassword && (
              <p className="login-card__instruction">
                <FontAwesomeIcon icon={faInfoCircle} /> 8-24 znaki, duża/mała
                litera, cyfra i znak (!@#$% )
              </p>
            )}
          </div>

          <div className="login-card__field">
            <label className="login-card__label">
              Powtórz hasło:
              <span className={validMatchPassword ? "icon-valid" : "icon-hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={
                  validMatchPassword || !matchPassword
                    ? "icon-hide"
                    : "icon-invalid"
                }
              >
                <FontAwesomeIcon icon={faTimes} />
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
            Zmień hasło
          </Button>
        </form>
      </section>
    </div>
  );
};

export default ChangePassword;
