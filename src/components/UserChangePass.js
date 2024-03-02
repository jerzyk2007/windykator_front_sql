import { useState, useEffect } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import './UserChangePass.css';

const UserChangePass = ({ user }) => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [userPass, setUserPass] = useState('');
    const [isValidPass, setIsValidPass] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    const handleChangePass = async () => {
        try {
            const result = await axiosPrivateIntercept.patch(`/user/another-user-change-pass/${user._id}`, {
                password: userPass
            });
            setUserPass('');
            setErrMsg('Sukces.');
        }
        catch (err) {
            setErrMsg('Hasło nie zostało zmienione.');
            console.log(err);
        }
    };

    const handleInputChange = (e) => {
        const newPassword = e.target.value;
        setUserPass(newPassword);
        const verifyPass = PASSWORD_REGEX.test(newPassword);
        setIsValidPass(verifyPass);
        setErrMsg('');
    };

    return (
        <section className='user_change_pass'>
            <section className='user_change_pass__title'>
                <h3 className='user_change_pass__title--name'>
                    {!errMsg ? 'Zmień hasło użytkownika' : errMsg}
                </h3>
            </section>
            <section className='user_change_pass__container'>
                <input
                    className='user_change_pass__container--edit'
                    type="text"
                    placeholder='podaj nowe hasło'
                    value={userPass}
                    onChange={handleInputChange}
                />
            </section>

            <Button
                variant='contained'
                onClick={handleChangePass}
                disabled={!isValidPass}
                size='small'
            >Zmień</Button>
        </section>
    );
};

export default UserChangePass;