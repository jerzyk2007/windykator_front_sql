import { useState, useEffect } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import './EditSystemSettings.css';

const EditSystemSettings = ({ user, setEdit }) => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [login, setLogin] = useState('');
    const [isValidLogin, setIsValidLogin] = useState(false);
    const [errLogin, setErrLogin] = useState('');

    const [pass, setPass] = useState('');
    const [isValidPass, setIsValidPass] = useState(false);
    const [errPass, setErrPass] = useState('');

    const [permissions, setPermissions] = useState({
        basic: true,
        standard: false
    });
    const [errPermission, setErrPermission] = useState('');

    const [errDelete, setErrDelete] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);

    const MAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    const handleChangeLogin = async () => {
        try {
            const result = await axiosPrivateIntercept.patch('/user/change-name', {
                username: user.username, newUsername: login
            });
            setEdit(false);
        }
        catch (err) {
            if (err.response.status === 409) {
                setErrLogin(`Użytkownik ${login} już istnieje.`);
            } else {
                setErrLogin(`Zmiana się nie powiodła.`);
            }
            console.log(err);
        }
    };

    const handleChangePass = async () => {
        try {
            const result = await axiosPrivateIntercept.patch('/user/another-user-change-pass', {
                username: user.username, password: pass
            });
            setErrPass('Sukces.');
        }
        catch (err) {
            setErrPass('Hasło nie zostało zmienione.');
            console.log(err);
        }
    };

    const handleChangePermission = async () => {
        try {
            const result = await axiosPrivateIntercept.patch('/user/change-permissions', {
                username: user.username, permissions
            });
            setErrPermission('Sukces.');
        }
        catch (err) {
            setErrPermission('Uprawnienia nie zostały zmienione.');
            console.log(err);
        }
    };

    const handleConfirmDeleteUser = async () => {
        try {
            const result = await axiosPrivateIntercept.delete('/user/delete-user', {
                username: user.username
            });
            setEdit(false);
        }
        catch (err) {
            setErrDelete('Użytkownik nie został usunięty.');
            console.log(err);
        }
    };

    const handleDeleteUser = () => {
        setConfirmDelete(true);
    };

    const handleCancelUser = () => {
        setConfirmDelete(false);
    };

    useEffect(() => {
        const verifyLogin = MAIL_REGEX.test(login);
        setIsValidLogin(verifyLogin);
        setErrLogin('');
    }, [login]);

    useEffect(() => {
        const verifyPass = PASSWORD_REGEX.test(pass);
        setIsValidPass(verifyPass);
        setErrPass('');
    }, [pass]);

    useEffect(() => {
        setErrPermission('');
    }, [permissions]);

    return (
        <section className='edit_system_settings'>
            <section className='edit_system_change'>
                <section className='edit_system_settings--user'>
                    <section className='edit_system_change--name__container'>
                        <h3 className='edit_system_change--name__container--title'>{!errLogin ? "Zmień login użytkownika" : errLogin}</h3>
                        <input
                            className='edit_system_change--name__container--edit'
                            type="text"
                            placeholder={user.username}
                            value={login}
                            onChange={(e) => setLogin((e.target.value).toLocaleLowerCase())}
                        />
                        <button className='edit_system_change--name__container--button' disabled={!isValidLogin} onClick={handleChangeLogin}>Zmień login</button>
                    </section>
                    <section className='edit_system_change--pass__container'>
                        <h3 className='edit_system_change--pass__container--title'>{!errPass ? "Zmień hasło użytkownika" : errPass}</h3>
                        <input
                            className='edit_system_change--pass__container--edit'
                            type="text"
                            placeholder='podaj nowe hasło'
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                        />
                        <button className='edit_system_change--pass__container--button' disabled={!isValidPass} onClick={handleChangePass}>Zmień hasło</button>
                    </section>
                    <section className='edit_system_change--permission__container'>
                        <h3 className='edit_system_change--permission__container--title'>{!errPermission ? "Zmień uprawnienia użytkownika" : errPermission}</h3>
                        <form className='edit_system_change--permission__container--choice'>
                            <label className='edit_system_change--permission__container--info' id='basic'>
                                <span className='edit_system_change--permission__container--text' >Doradca - widzi tylko swoje faktury</span>
                                <input
                                    className='edit_system_change--permission__container--check'
                                    name="basic"
                                    type="checkbox"
                                    checked={permissions.basic}
                                    onChange={() => setPermissions({
                                        basic: true,
                                        standard: false
                                    })}
                                />
                            </label>
                            <label className='edit_system_change--permission__container--info' id='standard'>
                                <span className='edit_system_change--permission__container--text' >Asystent - widzi faktury całego działu</span>
                                <input
                                    className='edit_system_change--permission__container--check'
                                    name="standard"
                                    type="checkbox"
                                    checked={permissions.standard}
                                    onChange={() => setPermissions({
                                        basic: false,
                                        standard: true
                                    })}
                                />
                            </label>
                        </form>
                        <button className='edit_system_change--permission__container--button' onClick={handleChangePermission}>Zmień</button>
                    </section>
                    <section className='edit_system_change--delete__container'>
                        {!confirmDelete && <h3 className='edit_system_change--delete__container--title'>{!errDelete ? "Usuń użytkownika" : errDelete}</h3>}
                        {confirmDelete && <h3 className='edit_system_change--delete__container--title'>Potwierdź, tej operacji nie można cofnąć !</h3>}
                        <p className='edit_system_change--delete__container--edit'
                        >{user.username}</p>
                        {!confirmDelete ? <button className='edit_system_change--delete__container--button' onClick={handleDeleteUser}>Usuń użytkownika</button> :
                            <section className='edit_system_change--delete__container-confirm'>
                                <button className='edit_system_change--delete__container--button edit_system_change--delete__container--cancel' onClick={handleCancelUser}>Anuluj</button>
                                <button className='edit_system_change--delete__container--button edit_system_change--delete__container--confirm' onClick={handleConfirmDeleteUser}>Usuń użytkownika</button>
                            </section>}
                    </section>
                </section>
                <section className='edit_system_settings--data'></section>
                <section className='edit_system_settings--table'></section>
            </section>
            <section className='edit_system_confirm'>
                <button>OK</button>
            </section>
        </section>
    );
};

export default EditSystemSettings;;