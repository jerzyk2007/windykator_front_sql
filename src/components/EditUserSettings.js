import { useState, useEffect } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import UserTableColumns from './UserTableColumns';
import UserChangeRoles from './UserChangeRoles';
import UserChangeDepartments from './UserChangeDepartments';
import UserChangePermissions from './UserChangePermissions';
import UserChangeName from './UserChangeName';
import UserChangePass from './UserChangePass';
import UserChangeLogin from './UserChangeLogin';
import { FiX } from "react-icons/fi";
import isEqual from 'lodash/isEqual';
import './EditUserSettings.css';

const EditSystemSettings = ({ user, setEdit }) => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [login, setLogin] = useState('');
    const [isValidLogin, setIsValidLogin] = useState(false);
    const [errLogin, setErrLogin] = useState('');

    // const [pass, setPass] = useState('');

    // const [name, setName] = useState('');
    // const [surname, setSurname] = useState('');
    // const [errName, setErrName] = useState('');

    const [permissions, setPermissions] = useState({});

    const [errDelete, setErrDelete] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);

    const [roles, setRoles] = useState({});

    const [departments, setDepartments] = useState([]);

    const [columns, setColumns] = useState([]);

    const MAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    const handleChangeLogin = async () => {
        try {
            const result = await axiosPrivateIntercept.patch(`/user/change-login/${user._id}`, {
                newUserlogin: login
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

    // const handleChangeNameSurname = async () => {
    //     try {
    //         const result = await axiosPrivateIntercept.patch(`/user/change-name/${user._id}`, {
    //             name, surname
    //         });
    //         setErrName('Sukces.');
    //     }
    //     catch (err) {
    //         setErrName(`Zmiana się nie powiodła.`);
    //         console.log(err);
    //     }
    // };

    // const handleChangePass = async () => {
    //     try {
    //         const result = await axiosPrivateIntercept.patch(`/user/another-user-change-pass/${user._id}`, {
    //             password: pass
    //         });
    //         setErrPass('Sukces.');
    //     }
    //     catch (err) {
    //         setErrPass('Hasło nie zostało zmienione.');
    //         console.log(err);
    //     }
    // };

    const handleConfirmDeleteUser = async () => {
        try {
            const result = await axiosPrivateIntercept.delete(`/user/delete-user/${user._id}`, {
                userlogin: user.userlogin
            });
            setEdit(false);
        }
        catch (err) {
            setErrDelete('Użytkownik nie został usunięty.');
            console.log(err);
        }
    };


    useEffect(() => {
        const verifyLogin = MAIL_REGEX.test(login);
        setIsValidLogin(verifyLogin);
        setErrLogin('');
    }, [login]);

    // useEffect(() => {
    //     const verifyPass = PASSWORD_REGEX.test(pass);
    //     setIsValidPass(verifyPass);
    //     setErrPass('');
    // }, [pass]);

    // useEffect(() => {
    //     setErrName('');
    // }, [name, surname]);


    useEffect(() => {
        const getSettings = async () => {
            const result = await axiosPrivateIntercept.get('/settings/get-settings');
            const filteredRoles = result.data.map(item => item.roles).filter(Boolean)[0];
            const roles = filteredRoles.reduce((acc, role, index) => {
                acc[role] = user?.roles[index] ? true : false;
                return acc;
            }, {});
            const filteredDepartments = result.data.map(item => item.departments).filter(Boolean)[0];
            const filteredPermissions = result.data.map(item => item.permissions).filter(Boolean)[0];

            const columnsDB = result.data.map(item => item.columns).filter(Boolean)[0];
            const userColumns = [...user.columns];

            const departments = filteredDepartments.reduce((acc, dep, index) => {
                acc[dep] = user?.departments[dep] ? true : false;
                return acc;
            }, {});

            const permissions = filteredPermissions.reduce((acc, perm, index) => {
                acc[perm] = user?.permissions[perm] ? true : false;
                return acc;
            }, {});

            const modifiedColumnsDB = columnsDB.map(col => {
                const userColMatch = userColumns.find(userCol => isEqual(col, userCol));
                return { ...col, checked: !!userColMatch };
            });
            setPermissions(permissions);
            setDepartments(departments);
            setRoles(roles);
            setColumns(modifiedColumnsDB);
        };
        getSettings();
    }, []);


    return (
        <section className='edit_system_settings'>
            <section className='edit_system_change'>

                <section className='edit_system_settings--column'>
                    {columns.length && < UserTableColumns user={user} columns={columns} />}

                </section>

                <section className='edit_system_settings--table'>

                    {roles && Object.keys(roles).length > 0 && <UserChangeRoles user={user} roles={roles} />}

                    {permissions && Object.keys(permissions).length > 0 && <UserChangePermissions user={user} permissions={permissions} />}

                    {departments && Object.keys(departments).length > 0 && <UserChangeDepartments user={user} departments={departments} />}

                </section>

                <section className='edit_system_settings--user'>

                    <UserChangeName user={user} />
                    <UserChangePass user={user} />
                    <UserChangeLogin user={user} />
                    {/* <section className='edit_system_change--name__container'>
                        <h3 className='edit_system_change--name__container--title'>{!errName ? "Zmień imię i nazwisko użytkownika" : errName}</h3>
                        <input
                            className='edit_system_change--name__container--edit'
                            type="text"
                            placeholder={user.username}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            className='edit_system_change--name__container--edit'
                            type="text"
                            placeholder={user.usersurname}
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                        />
                        <button className='user-change-roles--button' disabled={!name || !surname} onClick={handleChangeNameSurname}>Zmień</button>
                    </section> */}

                    {/*     <section className='edit_system_change--name__container'>
                        <h3 className='edit_system_change--name__container--title'>{!errLogin ? "Zmień login użytkownika" : errLogin}</h3>
                        <input
                            className='edit_system_change--name__container--edit'
                            type="text"
                            placeholder={user.userlogin}
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
                        >{user.userlogin}</p>
                        {!confirmDelete ? <button className='edit_system_change--delete__container--button' onClick={() => setConfirmDelete(true)}>Usuń użytkownika</button> :
                            <section className='edit_system_change--delete__container-confirm'>
                                <button className='edit_system_change--delete__container--button edit_system_change--delete__container--cancel' onClick={() => setConfirmDelete(false)}>Anuluj</button>
                                <button className='edit_system_change--delete__container--button edit_system_change--delete__container--confirm' onClick={handleConfirmDeleteUser}>Usuń użytkownika</button>
                            </section>}
                    </section> */}
                </section>
            </section>
            {/* <section className='edit_system_confirm'>
                <button>OK</button>
            </section> */}
            <FiX className='edit_system_settings-close-button' onClick={() => setEdit(false)} />
        </section>
    );
};

export default EditSystemSettings;;;