import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiX } from "react-icons/fi";
import { Button } from "@mui/material";
import './Register.css';

const Register = () => {

    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [username, setUsername] = useState('');
    const [usersurname, setUsersurname] = useState('');

    const [userlogin, setUserlogin] = useState('');
    const [validUserlogin, setValidUserlogin] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState('');

    const USER_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const v1 = USER_REGEX.test(userlogin);

            if (!v1) {
                setErrMsg("Invalid entry");
                return;
            }
            const result = await axiosPrivateIntercept.post('/user/register',

                JSON.stringify({ userlogin, username, usersurname }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            setSuccess(result.data);
            setUserlogin('');

        }
        catch (err) {
            if (!err?.response) {
                setErrMsg('Brak odpowiedzi z serwera.');
            } else if (err.response?.status === 400) {
                setErrMsg('Błędny użytkownik lub hasło');
            } else if (err.response?.status === 401) {
                setErrMsg('Brak autoryzaji.');
            } else if (err.response?.status === 409) {
                setErrMsg('Taki użytkownik już istnieje.');
            } else {
                setErrMsg('Rejestracja nie powiodła się.');
            }
        }
    };

    const handleExit = () => {
        navigate("/");
    };

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        const result = USER_REGEX.test(userlogin);
        setValidUserlogin(result);
    }, [userlogin]);


    useEffect(() => {
        setErrMsg('');
    }, [userlogin]);

    return (
        <>
            {success ?
                (<section className="register">
                    <h3 style={{ fontSize: "1.3rem" }} className="register-title">{success}</h3>
                    <Button
                        variant='contained'
                        type="submit"
                        size='large'
                        onClick={handleExit}
                    >
                        Wyjście
                    </Button>

                </section>) :
                (<section className="register">
                    {errMsg && <p className="user-error-message" ref={errRef}>{errMsg}</p>}
                    {!errMsg && <h1 className="register-title">Rejestracja użytkownika.</h1>}
                    <form className="register__container" onSubmit={handleSubmit}>

                        <label htmlFor="username" className="register__container-title">
                            E-mail:
                            <span className={validUserlogin ? "register__container-title--valid" : "register__container-title--hide"}><FontAwesomeIcon icon={faCheck} /></span>
                            <span className={validUserlogin || !userlogin ? "register__container-title--hide" : "register__container-title--invalid"}><FontAwesomeIcon icon={faTimes} /></span>
                        </label>
                        <input
                            className="register__container-text"
                            type="text"
                            id="username"
                            autoComplete="new-userlogin"
                            name="uniqueNameForThisField" //wyłącza w chrome autouzupełnianie 
                            ref={userRef}
                            value={userlogin}
                            onChange={(e) => setUserlogin((e.target.value).toLowerCase())}
                            required
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        {userFocus && userlogin && !validUserlogin && <p className="register__container-instructions" >
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Od 4 do 24 znaków<br />
                            Musi to byc format adresu email.<br />
                        </p>}

                        <label htmlFor="user" className="register__container-title">
                            Imię:
                        </label>
                        <input
                            className="register__container-text"
                            type="text"
                            id="user"
                            autoComplete="new-username"
                            name="uniqueNameForThisField" //wyłącza w chrome autouzupełnianie 
                            // ref={userRef}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <label htmlFor="usersurname" className="register__container-title">
                            Nazwisko:
                        </label>
                        <input
                            className="register__container-text"
                            type="text"
                            id="usersurname"
                            autoComplete="new-usersurname"
                            name="uniqueNameForThisField" //wyłącza w chrome autouzupełnianie 
                            value={usersurname}
                            onChange={(e) => setUsersurname(e.target.value)}
                            required
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <span className="register-info">Jeśli rejestracja zakońćzy się sukcesem do użytkownika zostanie wysłany email z hasłem dostępu. Pamiętaj, aby nadać mu odpowiednie uprawnienia i zapewnić dostęp do wymaganych danych.</span>
                        <Button
                            variant='contained'
                            type="submit"
                            disabled={!validUserlogin || !username || !usersurname}
                            size='large'
                        >
                            Zarejestruj
                        </Button>
                    </form>
                    <FiX className='register-close-button' onClick={() => navigate(-1)} />
                </section>)}
        </>
    );
};

export default Register;
