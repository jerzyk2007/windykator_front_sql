// import { useEffect, useState, useRef } from "react";
// import { axiosPrivate, } from "../../api/axios";

// import { Button } from "@mui/material";
// import "../Login.css";

// const ForgotPassword = ({ setForgotPass }) => {
//     const userRef = useRef();

//     const [userlogin, setUserlogin] = useState("");

//     const handleReset = async () => {
//         try {
//             await axiosPrivate.post(
//                 "/reset-password",
//                 JSON.stringify({ userlogin }),
//             );
//         }
//         catch (error) {
//             console.error(error);
//         }
//     };

//     useEffect(() => {
//         userRef.current?.focus();
//     }, []);

//     return (
//         <section className="login__fixed">

//             <section className="login" style={{ width: "50%" }}>
//                 <h1 className="login-title">Resetowanie hasła</h1>
//                 <span className="login__information">Proszę podać adres e-mail konta, dla którego ma zostać zresetowane hasło. Na wskazany adres zostanie wysłana wiadomość zawierająca link do resetu. Należy kliknąć w link w ciągu 15 minut od zatwierdzenia operacji – po tym czasie procedura zostanie anulowana. Po kliknięciu w link pojawi się panel, który pozwoli Ci na zmianę hasła. <br />
//                     Zapoznaj się z treścią maila zanim klikniesz w link <br />
//                     Ze względów bezpieczeństwa, w przypadku podania nieprawidłowego adresu e-mail, nie zostanie wyświetlony żaden komunikat o błędzie.</span>
//                 <form className="login__container" onSubmit={handleReset}>
//                     <label htmlFor="userlogin" className="login__container-title">
//                         Wpisz login użytkownika:
//                     </label>
//                     <input
//                         className="login__container-text"
//                         id="userlogin"
//                         type="text"
//                         placeholder="userlogin"
//                         ref={userRef}
//                         value={userlogin}
//                         onChange={(e) => setUserlogin(e.target.value.toLocaleLowerCase())}
//                         required
//                         autoComplete="username"
//                     />
//                     <section className="forgot_password-accept">
//                         <Button variant="contained" size="large" color="error" onClick={() => setForgotPass(false)}>Anuluj</Button>
//                         <Button variant="contained" type="submit" size="large">
//                             Resetuj
//                         </Button>
//                     </section>

//                 </form>
//             </section>

//         </section>
//     );
// };

// export default ForgotPassword;

import { useEffect, useState, useRef } from "react";
import { axiosPrivate } from "../../api/axios";
import { Button } from "@mui/material";
import "../Login.css";

const ForgotPassword = ({ setForgotPass }) => {
  const userRef = useRef();
  const [userlogin, setUserlogin] = useState("");

  const handleReset = async (e) => {
    console.log("test");
    e.preventDefault();
    try {
      await axiosPrivate.post("/reset-password", JSON.stringify({ userlogin }));
      // Opcjonalnie: setForgotPass(false) po sukcesie lub komunikat
      setForgotPass(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  return (
    <div className="login-page">
      <section className="login-card">
        <header className="login-card__header">
          <h1 className="login-card__title">Resetowanie hasła</h1>
        </header>

        <div className="login-card__content">
          <div className="login-card__info-box">
            Podaj adres e-mail. Wyślemy link do resetu (ważny 15 min). Ze
            względów bezpieczeństwa nie informujemy, czy e-mail istnieje w
            bazie.
          </div>

          <form onSubmit={handleReset}>
            <div className="login-card__field">
              <label htmlFor="userlogin" className="login-card__label">
                Wpisz login (e-mail):
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
                placeholder="adres@firma.pl"
              />
            </div>

            <div className="login-card__button-group">
              <Button
                variant="contained"
                className="login-card__button"
                type="submit"
                sx={{ backgroundColor: "#2c7ba8" }}
              >
                Resetuj hasło
              </Button>
              <Button
                variant="outlined"
                onClick={() => setForgotPass(false)}
                sx={{
                  color: "#666",
                  borderColor: "#ccc",
                  textTransform: "none",
                }}
              >
                Powrót
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;
