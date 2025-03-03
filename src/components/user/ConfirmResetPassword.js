import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { axiosPrivate } from "../../api/axios";
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
import PleaseWait from "../PleaseWait";
import "./ChangePassword.css";

const ConfirmResetPassword = () => {
    const { token, email } = useParams(); // Pobiera token z URL

    const passRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();
    // const logout = useLogout();

    const { auth } = useData();

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
            const v1 = PASSWORD_REGEX.test(password);

            if (!v1) {
                setErrMsg("Invalid entry");
                return;
            }

            await axiosPrivate.patch(
                `/reset-password/change-pass`,
                JSON.stringify({ password, token, email }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            setPassword("");
            setMatchPassword("");
            navigate("/login", { replace: true }); // Zapobiega powrotowi wstecz
        } catch (err) {
            if (!err?.response) {
                setErrMsg("Brak odpowiedzi z serwera.");
            } else if (err.response?.status === 400) {
                setErrMsg("Błędne hasło.");
            } else if (err.response?.status === 401) {
                setErrMsg("Brak autoryzaji.");
            } else {
                setErrMsg("Zmiana hasła nie powiodła się.");
            }
        }
    };


    useEffect(() => {
        const result = PASSWORD_REGEX.test(password);
        setValidPassword(result);
        const match = password === matchPassword;
        setValidMatchPassword(match);
    }, [password, matchPassword]);

    useEffect(() => {
        setErrMsg("");
    }, [password, matchPassword]);


    const veryfiResetPass = async () => {
        try {
            const result = await axiosPrivate.post(
                `/reset-password/verify-pass`,
                JSON.stringify({ token, email }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            console.log(result);

            if (result?.data?.checkDate) {
                setConfirmPass(true);
            } else {
                setConfirmPass(true);

                navigate('/login');
            }
        }
        catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {

        // passRef.current.focus();

        veryfiResetPass();
    }, []);

    return (
        <>
            {confirmPass ? <section className="change_password">
                {errMsg && (
                    <p className="user-error-message" ref={errRef}>
                        {errMsg}
                    </p>
                )}
                {!errMsg && <h1 className="change_password-title">Zmiana hasła</h1>}
                <h3 className="change_user_pass-info">
                    Jeśli zmiana hasła zakończy się sukcesem to pojawi sie okno logowania
                </h3>
                <form className="change_password__container" onSubmit={handleSubmit}>
                    <label htmlFor="password" className="change_password__container-title">
                        Hasło:
                        <span
                            className={
                                validPassword
                                    ? "change_password__container-title--valid"
                                    : "change_password__container-title--hide"
                            }
                        >
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span
                            className={
                                validPassword || !password
                                    ? "change_password__container-title--hide"
                                    : "change_password__container-title--invalid"
                            }
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <input
                        className="change_password-text"
                        type="password"
                        id="password"
                        autoComplete="off"
                        name="uniqueNameForThisField" //wyłącza w chrome autouzupełnianie
                        ref={passRef}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);

                        }}
                        required
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                    />
                    {passwordFocus && !validPassword && (
                        <p className="change_password__container-instructions">
                            <FontAwesomeIcon icon={faInfoCircle} />
                            od 8 od 24 znaków.
                            <br />
                            Musi zawierać małe i duże litery, cyfrę i znak specjalny.
                            <br />
                            Dostępne znaki specjalne:
                            <span aria-label="exclamation mark">!</span>{" "}
                            <span aria-label="at symbol">@</span>{" "}
                            <span aria-label="hashtag">#</span>{" "}
                            <span aria-label="dollar sign">$</span>{" "}
                            <span aria-label="percent">%</span>
                        </p>
                    )}
                    <label
                        htmlFor="confirm_password"
                        className="change_password__container-title"
                    >
                        Powtórz hasło:
                        <span
                            className={
                                validMatchPassword && matchPassword
                                    ? "change_password__container-title--valid"
                                    : "change_password__container-title--hide"
                            }
                        >
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span
                            className={
                                validMatchPassword || !matchPassword
                                    ? "change_password__container-title--hide"
                                    : "change_password__container-title--invalid"
                            }
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <input
                        className="change_password-text"
                        type="password"
                        id="confirm_password"
                        autoComplete="off"
                        name="uniqueNameForThisField" //wyłącza w chrome autouzupełnianie
                        value={matchPassword}
                        onChange={(e) => setMatchPassword(e.target.value)}
                        required
                        onFocus={() => setMatchPasswordFocus(true)}
                        onBlur={() => setMatchPasswordFocus(false)}
                    />
                    {matchPasswordFocus && !validMatchPassword && (
                        <p className="change_password__container-instructions">
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Hasła musza być takie same.
                        </p>
                    )}
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={!validPassword || !validMatchPassword}
                        size="large"
                    >
                        Zmień hasło
                    </Button>
                </form>
                <FiX
                    className="change_password-close-button"
                    onClick={() => navigate('/login')}
                />
            </section> : <PleaseWait />}
        </>
    );
};

export default ConfirmResetPassword;
