import { useState, useEffect } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import './UserChangeLogin.css';

const UserChangeLogin = ({ user }) => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [userLogin, setUserLogin] = useState('');
    const [isValidLogin, setIsValidLogin] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const MAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleChangeLogin = async () => {
        try {
            const result = await axiosPrivateIntercept.patch(`/user/change-login/${user._id}`, {
                newUserlogin: userLogin
            });
            setErrMsg(`Sukces.`);
        }
        catch (err) {
            if (err.response.status === 409) {
                setErrMsg(`Użytkownik ${userLogin} już istnieje.`);
            } else {
                setErrMsg(`Zmiana się nie powiodła.`);
            }
            console.log(err);
        }
    };

    useEffect(() => {
        const verifyLogin = MAIL_REGEX.test(userLogin);
        setIsValidLogin(verifyLogin);
        setErrMsg('');
    }, [userLogin]);

    return (
        <section className='user_change_login'>
            <section className='user_change_login__title'>
                <h3 className='user_change_login__title--name'>{!errMsg ? "Zmień login użytkownika" : errMsg}</h3>
            </section>
            <section className='user_change_login__container'>
                <input
                    className='user_change_login__container--edit'
                    type="text"
                    placeholder={user.userlogin}
                    value={userLogin}
                    onChange={(e) => setUserLogin((e.target.value).toLocaleLowerCase())}
                />
            </section>
            <Button
                variant='contained'
                onClick={handleChangeLogin}
                disabled={!isValidLogin}
                size='small'
            >Zmień login</Button>

        </section>
    );
};

export default UserChangeLogin;