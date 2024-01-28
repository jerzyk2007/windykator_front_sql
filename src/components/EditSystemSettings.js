import { useState, useEffect } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import './EditSystemSettings.css';

// dokończyc usuwanie użytkonika;

const EditSystemSettings = ({ user, setEdit }) => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();
    const [login, setLogin] = useState('');
    const [isValidLogin, setIsValidLogin] = useState(false);
    const [errLogin, setErrLogin] = useState('');

    const [pass, setPass] = useState('');
    const [isValidPass, setIsValidPass] = useState(false);
    const [errPass, setErrPass] = useState('');

    const [permissions, setPermissions] = useState(user.permissions);
    const [errPermission, setErrPermission] = useState('');

    const [errDelete, setErrDelete] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);

    const [roles, setRoles] = useState({});
    const [errRoles, setErrRoles] = useState('');


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
        console.log(permissions);
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
            const result = await axiosPrivateIntercept.delete(`/user/delete-user/${user._id}`, {
                username: user.username
            });
            setEdit(false);
        }
        catch (err) {
            setErrDelete('Użytkownik nie został usunięty.');
            console.log(err);
        }
    };

    const rolesItem = Object.entries(roles).map(([role, isChecked], index) => (
        <form key={index} className='edit_system_change--roles__container--choice'>
            <label className='edit_system_change--roles__container--info' id={`role${index}`}>
                <span className='edit_system_change--roles__container--text' >{role}
                    {role === "User" && <span className='edit_system_change--roles__container--text-information'> - przeglądanie</span>}
                    {role === "Editor" && <span className='edit_system_change--roles__container--text-information'> - edytowanie tabel i raportów</span>}
                    {role === "Admin" && <span className='edit_system_change--roles__container--text-information'> - uprawnienia użytkownika</span>}
                </span>
                <input
                    className='edit_system_change--roles__container--check'
                    name={`role${index}`}
                    type="checkbox"
                    checked={isChecked || role === 'User'}
                    onChange={() => {
                        // Jeśli rola to 'User', nie zmieniaj wartości
                        if (role === 'User') return;
                        setRoles(prevRoles => {
                            const updatedRoles = { ...prevRoles, [role]: !isChecked };

                            // Jeśli zaznaczono 'Admin', ustaw także 'Editor' na 'true'
                            if (role === 'Admin' && !isChecked) {
                                updatedRoles['Editor'] = true;
                            }

                            // Jeśli odznaczono 'Editor', ustaw także 'Admin' na 'false'
                            if (role === 'Editor' && isChecked) {
                                updatedRoles['Admin'] = false;
                            }

                            return updatedRoles;
                        });
                    }}
                />
            </label>
        </form>
    ));


    // const rolesItem = roles.map((role, index) => {
    //     return (
    //         <form
    //             key={index} className='edit_system_change--roles__container--choice'
    //         >
    //             <label className='edit_system_change--permissions__container--info' id={`role${index}`}>
    //                 <span className='edit_system_change--permissions__container--text' >{role}</span>
    //                 <input
    //                     className='edit_system_change--permissions__container--check'
    //                     name={`role${index}`}
    //                     type="checkbox"
    //                     checked={permissions.Basic}
    //                     onChange={() => setPermissions({
    //                         Basic: true,
    //                         Standard: false
    //                     })}
    //                 />
    //             </label>
    //         </form >
    //     );
    // });

    const handleChangeRoles = async () => {

        const departments = ["D6", "D7", "D8", "D17", "D88", "D98"];
        try {
            // const result = await axiosPrivateIntercept.post('/settings/change-roles', { roles, departments });

            // const result = await axiosPrivateIntercept.get('/settings/get-settings');
            const arrayRoles = Object.entries(roles).map(([role, isChecked], index) => {
                if (isChecked) {
                    return role;
                }
            }).filter(Boolean);
            const result = await axiosPrivateIntercept.patch(`/settings/change-roles/${user._id}`, { roles: arrayRoles });
            setErrRoles('Sukces.');
            console.log(result.data);
            console.log(user._id);

        }
        catch (err) {
            setErrRoles('Dostęp nie został zmieniony.');
            console.log(err);
        }
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

    useEffect(() => {
        const getGlobalSettings = async () => {
            const result = await axiosPrivateIntercept.get('/settings/get-settings');
            const filteredRoles = result.data.map(item => item.roles).filter(Boolean)[0];

            const roles = filteredRoles.reduce((acc, role, index) => {
                acc[role] = user?.roles[index] ? true : false;
                return acc;
            }, {});

            setRoles(roles);
        };
        getGlobalSettings();
    }, []);

    return (
        <section className='edit_system_settings'>
            <section className='edit_system_change'>
                <section className='edit_system_settings--data'></section>
                <section className='edit_system_settings--table'>

                    <section className='edit_system_change--roles__container'>
                        <h3 className='edit_system_change--roles__container--title'>{!errRoles ? "Zmień dostęp użytkownika" : errRoles}</h3>
                        {rolesItem}
                        <button className='edit_system_change--roles__container--button' onClick={handleChangeRoles}>Zmień</button>
                    </section>

                    <section className='edit_system_change--permissions__container'>
                        <h3 className='edit_system_change--permissions__container--title'>{!errPermission ? "Zmień uprawnienia użytkownika" : errPermission}</h3>
                        <form className='edit_system_change--permissions__container--choice'>
                            <label className='edit_system_change--permissions__container--info' id='basic'>
                                <span className='edit_system_change--permissions__container--text' >Doradca - widzi tylko swoje faktury</span>
                                <input
                                    className='edit_system_change--permissions__container--check'
                                    name="basic"
                                    type="checkbox"
                                    checked={permissions.Basic}
                                    onChange={() => setPermissions({
                                        Basic: true,
                                        Standard: false
                                    })}
                                />
                            </label>
                            <label className='edit_system_change--permissions__container--info' id='standard'>
                                <span className='edit_system_change--permissions__container--text' >Asystent - widzi faktury całego działu</span>
                                <input
                                    className='edit_system_change--permissions__container--check'
                                    name="standard"
                                    type="checkbox"
                                    checked={permissions.Standard}
                                    onChange={() => setPermissions({
                                        Basic: false,
                                        Standard: true
                                    })}
                                />
                            </label>
                        </form>
                        <button className='edit_system_change--permissions__container--button' onClick={handleChangePermission}>Zmień</button>
                    </section>

                </section>

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

                    <section className='edit_system_change--delete__container'>
                        {!confirmDelete && <h3 className='edit_system_change--delete__container--title'>{!errDelete ? "Usuń użytkownika" : errDelete}</h3>}
                        {confirmDelete && <h3 className='edit_system_change--delete__container--title'>Potwierdź, tej operacji nie można cofnąć !</h3>}
                        <p className='edit_system_change--delete__container--edit'
                        >{user.username}</p>
                        {!confirmDelete ? <button className='edit_system_change--delete__container--button' onClick={() => setConfirmDelete(true)}>Usuń użytkownika</button> :
                            <section className='edit_system_change--delete__container-confirm'>
                                <button className='edit_system_change--delete__container--button edit_system_change--delete__container--cancel' onClick={() => setConfirmDelete(false)}>Anuluj</button>
                                <button className='edit_system_change--delete__container--button edit_system_change--delete__container--confirm' onClick={handleConfirmDeleteUser}>Usuń użytkownika</button>
                            </section>}
                    </section>
                </section>
            </section>
            <section className='edit_system_confirm'>
                <button>OK</button>
            </section>
        </section>
    );
};

export default EditSystemSettings;;