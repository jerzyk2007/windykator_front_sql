import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useData from "./hooks/useData";
import { axiosPrivate } from "../api/axios";
import { Button } from "@mui/material";
import "./Login.css";

const Login = () => {
  const { setAuth } = useData();
  const navigate = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [userlogin, setUserlogin] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

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
      if (!err?.response) {
        setErrMsg("Brak odpowiedzi z serwera.");
      } else if (err.response?.status === 400) {
        setErrMsg("Błedny login lub hasło.");
      } else if (err.response?.status === 401) {
        setErrMsg("Błąd w logowaniu.");
      } else {
        setErrMsg("Błąd w logowaniu.");
      }
    }
  };

  useEffect(() => {
    setErrMsg("");
  }, [userlogin, password]);

  return (
    <section className="login__fixed">
      <section className="login">
        {errMsg && (
          <p className="login-error-message" ref={errRef}>
            {errMsg}
          </p>
        )}
        {!errMsg && <h1 className="login-title">Logowanie</h1>}
        <form className="login__container" onSubmit={handleSubmit}>
          <label htmlFor="userlogin" className="login__container-title">
            Użytkownik:
          </label>
          <input
            className="login__container-text"
            id="userlogin"
            type="text"
            placeholder="userlogin"
            ref={userRef}
            value={userlogin}
            onChange={(e) => setUserlogin(e.target.value.toLocaleLowerCase())}
            required
            autoComplete="username"
          />
          <label htmlFor="password" className="login__container-title">
            Hasło:
          </label>
          <input
            className="login__container-text"
            id="password"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="password"
          />
          <Button variant="contained" type="submit" size="large">
            Zaloguj
          </Button>
        </form>
      </section>
    </section>
  );
};

export default Login;
