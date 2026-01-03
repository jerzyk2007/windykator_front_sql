// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import useData from "./hooks/useData";
// import { axiosPrivate } from "../api/axios";
// import { Button } from "@mui/material";
// import ForgotPassword from "./user/ForgotPassword";
// import "./Login.css";

// const Login = () => {
//   const { setAuth } = useData();
//   const navigate = useNavigate();
//   const userRef = useRef();
//   const errRef = useRef();

//   const [userlogin, setUserlogin] = useState("");
//   const [password, setPassword] = useState("");
//   const [errMsg, setErrMsg] = useState("");
//   const [forgotPass, setForgotPass] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axiosPrivate.post(
//         "/login",
//         JSON.stringify({ userlogin, password }),
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );
//       const { username, usersurname, roles, id_user, permissions } =
//         response?.data;
//       setAuth({
//         username,
//         usersurname,
//         userlogin,
//         roles,
//         id_user,
//         permissions,
//       });
//       navigate("/");
//     } catch (err) {
//       if (!err?.response) {
//         setErrMsg("Brak odpowiedzi z serwera.");
//       } else if (err.response?.status === 400) {
//         setErrMsg("Błedny login lub hasło.");
//       } else if (err.response?.status === 401) {
//         setErrMsg("Błąd w logowaniu.");
//       } else {
//         setErrMsg("Błąd w logowaniu.");
//       }
//     }
//   };

//   useEffect(() => {
//     setErrMsg("");
//   }, [userlogin, password]);

//   useEffect(() => {
//     userRef.current?.focus();
//   }, []);

//   return (
//     <section className="login__fixed">
//       {/* <section className="login__high_information">
//         <h1>UWAGA !!!</h1>
//         <span>
//           Chciałem poinformować, że w programie nastąpiła bardzo duża
//           aktualizacja.
//         </span>
//         <span>
//           Starałem się aby pod kątem wizualnym i funkcjonalnym zmiany były jak
//           najmniej widoczne.
//         </span>
//         <span>Jest również zaktualizowana instrukcja obsługi.</span>
//         <span>
//           W przypadku nieprawidłowego działania programu, prosze o kontakt.
//         </span>
//         <span style={{ fontWeight: "bold", color: "red" }}>
//           jerzy.komorowski@krotoski.com, 782 991 608
//         </span>
//       </section> */}
//       <section className="login__high_information">
//         <h1>Uwaga !!!</h1>
//         <span>
//           W godzinach <strong>6:30–7:00</strong> system przeprowadza
//           aktualizację danych, dlatego logowanie może być w tym czasie
//           utrudnione.
//         </span>
//         <span>
//           W przypadku jakichkolwiek problemów z działaniem aplikacji proszę o
//           kontakt:
//         </span>
//         <span style={{ fontWeight: "bold", color: "red" }}>
//           jerzy.komorowski@krotoski.com - 782&nbsp;991&nbsp;608
//         </span>
//       </section>
//       {!forgotPass ? (
//         <section className="login">
//           {errMsg && (
//             <p className="user-error-message" ref={errRef}>
//               {errMsg}
//             </p>
//           )}
//           {!errMsg && <h1 className="login-title">Logowanie</h1>}
//           <form className="login__container" onSubmit={handleSubmit}>
//             <label htmlFor="userlogin" className="login__container-title">
//               Użytkownik:
//             </label>
//             <input
//               className="login__container-text"
//               id="userlogin"
//               type="text"
//               placeholder="userlogin"
//               ref={userRef}
//               value={userlogin}
//               onChange={(e) => setUserlogin(e.target.value.toLocaleLowerCase())}
//               required
//               autoComplete="username"
//             />
//             <label htmlFor="password" className="login__container-title">
//               Hasło:
//             </label>
//             <input
//               className="login__container-text"
//               id="password"
//               type="password"
//               placeholder="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               autoComplete="password"
//             />
//             <Button variant="contained" type="submit" size="large">
//               Zaloguj
//             </Button>
//           </form>
//           <section
//             className="login__password"
//             onClick={() => setForgotPass(true)}
//           >
//             <span>Zresetuj hasło</span>
//           </section>
//         </section>
//       ) : (
//         <ForgotPassword setForgotPass={setForgotPass} />
//       )}

//       <section className="login__high_information"></section>
//     </section>
//   );
// };

// export default Login;

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
          <h2 className="login-notice__title">Uwaga! Przerwa techniczna</h2>
          <p>
            6:30 – 7:00: Aktualizacja danych – logowanie może być utrudnione.
          </p>
          <p className="login-notice__content">
            Mail: jerzy.komorowski@krotoski.com
          </p>
          <p className="login-notice__content">Telefon: 782 991 608</p>
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
