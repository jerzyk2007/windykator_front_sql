import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useData from "./hooks/useData";
import { axiosPrivate } from "../api/axios";
import './Login.css';

const Login = () => {
    const { setAuth } = useData();
    const navigate = useNavigate();

    const userRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosPrivate.post('/login',
                JSON.stringify({ username, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            // setAuth({ username, password, roles, accessToken });
            setAuth({ username, roles });
            navigate('/');
        }
        catch (err) {
            if (!err?.response) {
                setErrMsg('Brak odpowiedzi z serwera.');
            } else if (err.response?.status === 400) {
                setErrMsg('Błedny login lub hasło.');
            }
            else if (err.response?.status === 401) {
                setErrMsg('Błąd w logowaniu.');
            }
            else {
                setErrMsg('Błąd w logowaniu.');
            }
        }
    };

    useEffect(() => {
        setErrMsg('');
    }, [username, password]);

    useEffect(() => {
        if (!localStorage?.getItem("username")) {
            userRef.current.focus();
        }
    }, []);

    return (
        <section className="login">
            {errMsg && <p className="login-error-message" ref={errRef}>{errMsg}</p>}
            {!errMsg && <h1 className="login-title">Logowanie</h1>}
            <form className="login__container" onSubmit={handleSubmit}>
                <label htmlFor="username" className="login__container-title">Użytkownik:</label>
                <input
                    className="login__container-text"
                    type="text"
                    id="username"
                    placeholder="username"
                    ref={userRef}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="password" className="login__container-title">Hasło:</label>
                <input
                    className="login__container-text"
                    type="password"
                    id="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="login__container-button">Zaloguj</button>
            </form>
        </section>
    );

};

export default Login;;;