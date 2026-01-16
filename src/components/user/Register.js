import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiX } from "react-icons/fi";
import { Button } from "@mui/material";
import PleaseWait from "../PleaseWait";
// Importujemy teraz tylko Login.css
import "../Login.css";

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [username, setUsername] = useState("");
  const [usersurname, setUsersurname] = useState("");

  const [userlogin, setUserlogin] = useState("");
  const [validUserlogin, setValidUserlogin] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");

  const [userPermission, setUserPermission] = useState({
    available: [],
    userChoice: "",
  });

  const descriptions = {
    Pracownik: "Pracownik – dotyczy osób zatrudnionych w strukturach Krotoski",
    Kancelaria: "Kancelaria – dotyczy osób z kancelarii zewnętrznych",
  };

  const USER_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const v1 = USER_REGEX.test(userlogin);

      if (!v1) {
        setErrMsg("Niepoprawny format danych.");
        return;
      }
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.post(
        "/user/register",
        JSON.stringify({
          userlogin,
          username,
          usersurname,
          permission: userPermission.userChoice,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setSuccess(result.data);
      setUserlogin("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Brak odpowiedzi z serwera.");
      } else if (err.response?.status === 400) {
        setErrMsg("Błędne dane użytkownika.");
      } else if (err.response?.status === 401) {
        setErrMsg("Brak autoryzacji.");
      } else if (err.response?.status === 409) {
        setErrMsg("Taki użytkownik już istnieje.");
      } else {
        setErrMsg("Rejestracja nie powiodła się.");
      }
    } finally {
      setPleaseWait(false);
    }
  };

  const handleExit = () => {
    navigate("/");
  };

  useEffect(() => {
    if (!pleaseWait && userRef.current) {
      userRef.current.focus();
    }
    // Opcjonalnie: blokada scrolla tak jak w Login
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [pleaseWait]);

  useEffect(() => {
    const result = USER_REGEX.test(userlogin);
    setValidUserlogin(result);
    setErrMsg("");
  }, [userlogin]);

  useEffect(() => {
    const getPermissions = async () => {
      setPleaseWait(true);
      try {
        const result = await axiosPrivateIntercept.get(
          "/settings/get-permissions"
        );
        setUserPermission((prev) => ({
          ...prev,
          available: result?.data?.permissions ? result.data.permissions : [],
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setPleaseWait(false);
      }
    };
    getPermissions();
  }, []);

  return (
    <>
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <div className="login-page">
          <section className="login-card">
            <header className="login-card__header">
              <h1 className="login-card__title">
                {success ? (
                  "Sukces!"
                ) : errMsg ? (
                  <span className="msg-error">{errMsg}</span>
                ) : (
                  "Rejestracja użytkownika"
                )}
              </h1>
              <FiX className="login-card__close" onClick={() => navigate(-1)} />
            </header>
            {success ? (
              <div
                className="login-card__content"
                style={{ textAlign: "center" }}
              >
                <p style={{ color: "#2e7d32", marginBottom: "20px" }}>
                  {success}
                </p>
                <Button
                  variant="contained"
                  onClick={handleExit}
                  fullWidth
                  className="login-card__button"
                >
                  Wyjście
                </Button>
              </div>
            ) : (
              <form className="login-card__content" onSubmit={handleSubmit}>
                {errMsg && (
                  <p className="register-card__error-box" ref={errRef}>
                    {errMsg}
                  </p>
                )}

                <div className="login-card__field">
                  <label htmlFor="username" className="login-card__label">
                    E-mail:
                    <span
                      className={validUserlogin ? "icon-valid" : "icon-hide"}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span
                      className={
                        validUserlogin || !userlogin
                          ? "icon-hide"
                          : "icon-invalid"
                      }
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  </label>
                  <input
                    className="login-card__input"
                    type="text"
                    id="username"
                    ref={userRef}
                    value={userlogin}
                    onChange={(e) => setUserlogin(e.target.value.toLowerCase())}
                    required
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    placeholder="adres@firma.pl"
                  />
                  {userFocus && userlogin && !validUserlogin && (
                    <p className="login-card__instruction">
                      <FontAwesomeIcon icon={faInfoCircle} />
                      Format: adres@domena.pl
                    </p>
                  )}
                </div>

                <div className="login-card__field">
                  <label htmlFor="user" className="login-card__label">
                    Imię:
                  </label>
                  <input
                    className="login-card__input"
                    type="text"
                    id="user"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="login-card__field">
                  <label htmlFor="usersurname" className="login-card__label">
                    Nazwisko:
                  </label>
                  <input
                    className="login-card__input"
                    type="text"
                    id="usersurname"
                    value={usersurname}
                    onChange={(e) => setUsersurname(e.target.value)}
                    required
                  />
                </div>

                <div className="login-card__field">
                  <label htmlFor="permission" className="login-card__label">
                    Typ użytkownika:
                  </label>
                  <select
                    className="login-card__input"
                    style={{ cursor: "pointer", backgroundColor: "white" }}
                    value={userPermission.userChoice || ""}
                    onChange={(e) =>
                      setUserPermission((prev) => ({
                        ...prev,
                        userChoice: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="" hidden>
                      Wybierz typ...
                    </option>
                    {userPermission?.available.map((key) => (
                      <option key={key} value={key}>
                        {descriptions[key] || key}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="login-card__info-box">
                  Po rejestracji użytkownik otrzyma e-mail z hasłem tymczasowym.
                  <br /> Pamiętaj o nadaniu odpowiednich uprawnień w kolejnych
                  krokach.
                </div>

                <Button
                  variant="contained"
                  type="submit"
                  disabled={
                    !validUserlogin ||
                    !username ||
                    !usersurname ||
                    !userPermission.userChoice
                  }
                  className="login-card__button"
                >
                  Zarejestruj użytkownika
                </Button>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
};

export default Register;
