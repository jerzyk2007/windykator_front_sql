import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useData from "./hooks/useData";
import { axiosPrivate } from "../api/axios";
import { Button } from "@mui/material";
import ForgotPassword from "./user/ForgotPassword";
import "./Login.css";

const Login = () => {
  const { setAuth } = useData();
  const navigate = useNavigate();
  const userRef = useRef();

  const [userlogin, setUserlogin] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [forgotPass, setForgotPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(
        "/login",
        JSON.stringify({ userlogin, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const { username, usersurname, roles, id_user, permissions } =
        response?.data;
      setAuth({
        username,
        usersurname,
        userlogin,
        roles,
        id_user,
        permissions,
      });
      navigate("/");
    } catch (err) {
      if (!err?.response) setErrMsg("Brak odpowiedzi z serwera.");
      else if (err.response?.status === 400)
        setErrMsg("Błędny login lub hasło.");
      else setErrMsg("Błąd logowania.");
    }
  };

  useEffect(() => {
    userRef.current?.focus();
    // Blokada scrollowania tła (body), gdy wyświetlany jest ekran logowania
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="login-page">
      <section className="login-notice">
        <div className="login-notice__content">
          <h2 className="login-notice__title">Uwaga</h2>
          {/* <h2 className="login-notice__title">Uwaga! Przerwa techniczna</h2> */}
          <p style={{ fontWeight: "bold" }}>
            6:30 – 7:00: Aktualizacja danych – logowanie może być utrudnione.
          </p>
          <p>W razie innych problemów z aplikacją prosze o kontakt</p>
          <p className="login-notice__content">
            mail: jerzy.komorowski@krotoski.com
          </p>
          <p className="login-notice__content">telefon: 782 991 608</p>
        </div>
      </section>

      {!forgotPass ? (
        <section className="login-card">
          <header className="login-card__header">
            <h1 className="login-card__title">
              {errMsg ? (
                <span className="msg-error">{errMsg}</span>
              ) : (
                "Logowanie"
              )}
            </h1>
          </header>

          <form className="login-card__content" onSubmit={handleSubmit}>
            <div className="login-card__field">
              <label className="login-card__label" htmlFor="userlogin">
                Użytkownik:
              </label>
              <input
                className="login-card__input"
                id="userlogin"
                type="text"
                ref={userRef}
                value={userlogin}
                onChange={(e) =>
                  setUserlogin(e.target.value.toLocaleLowerCase())
                }
                required
              />
            </div>

            <div className="login-card__field">
              <label className="login-card__label" htmlFor="password">
                Hasło:
              </label>
              <input
                className="login-card__input"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              variant="contained"
              type="submit"
              className="login-card__button"
            >
              Zaloguj
            </Button>
          </form>

          <footer className="login-card__footer">
            <span
              className="login-card__link"
              onClick={() => setForgotPass(true)}
            >
              Zapomniałeś hasła?
            </span>
          </footer>
        </section>
      ) : (
        <ForgotPassword setForgotPass={setForgotPass} />
      )}
    </div>
  );
};

export default Login;
