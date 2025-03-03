import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useData from "../hooks/useData";
import { axiosPrivate } from "../../api/axios";

import { Button } from "@mui/material";
import "../Login.css";

const ForgotPassword = ({ setForgotPass }) => {
    const { setAuth } = useData();
    const navigate = useNavigate();

    const userRef = useRef();

    const [userlogin, setUserlogin] = useState("");

    const handleReset = async () => {
        try {
            await axiosPrivate.post(
                "/reset-password",
                JSON.stringify({ userlogin }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

        }
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        userRef.current?.focus();
    }, []);

    return (
        <section className="login__fixed">

            <section className="login" style={{ width: "50%" }}>
                <h1 className="login-title">Resetowanie hasła</h1>
                <span className="login__information">Proszę podać adres e-mail konta, dla którego ma zostać zresetowane hasło. Na wskazany adres zostanie wysłana wiadomość zawierająca link do resetu. Należy kliknąć w link w ciągu 15 minut od zatwierdzenia operacji – po tym czasie procedura zostanie anulowana. Po kliknięciu w link otrzymasz kolejną wiadomość z nowym linkiem, który pozwoli Ci na zmianę hasła. <br />
                    Zapoznaj się z treścią maila zanim klikniesz w link <br />
                    Ze względów bezpieczeństwa, w przypadku podania nieprawidłowego adresu e-mail, nie zostanie wyświetlony żaden komunikat o błędzie.</span>
                <form className="login__container" onSubmit={handleReset}>
                    <label htmlFor="userlogin" className="login__container-title">
                        Wpisz login użytkownika:
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
                    <section className="forgot_password-accept">
                        <Button variant="contained" size="large" color="error" onClick={() => setForgotPass(false)}>Anuluj</Button>
                        <Button variant="contained" type="submit" size="large">
                            Resetuj
                        </Button>
                    </section>

                </form>
            </section>

        </section>
    );
};

export default ForgotPassword;
