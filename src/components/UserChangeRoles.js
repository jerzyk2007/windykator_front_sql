import { useState, useEffect } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";

import './UserChangeRoles.css';

const UserChangeRoles = ({ user, roles }) => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [userRoles, setUserRoles] = useState(roles);
    const [errMsg, setErrMsg] = useState('');

    const rolesItem = Object.entries(userRoles).map(([role, isChecked], index) => (
        <section key={index} className='user-change-roles__container'>
            <label className='user-change-roles__container--info' id={`role${index}`}>
                <span className='user-change-roles__container--text' >{role}
                    {role === "User" && <span className='edit_system_change--roles__container--information'> - przeglądanie</span>}
                    {role === "Editor" && <span className='edit_system_change--roles__container--information'> - edytowanie tabel i raportów</span>}
                    {role === "Admin" && <span className='edit_system_change--roles__container--information'> - uprawnienia użytkownika</span>}
                </span>
                <input
                    className='edit_system_change--roles__container--check'
                    name={`role${index}`}
                    type="checkbox"
                    checked={isChecked || role === 'User'}
                    onChange={() => {
                        // Jeśli rola to 'User', nie zmieniaj wartości
                        if (role === 'User') return;
                        setUserRoles(prevRoles => {
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
        </section>
    ));

    const handleChangeRoles = async () => {
        try {
            const arrayRoles = Object.entries(userRoles).map(([role, isChecked]) => {
                if (isChecked) {
                    return role;
                }
            }).filter(Boolean);
            const result = await axiosPrivateIntercept.patch(`/user/change-roles/${user._id}`, { roles: arrayRoles });
            setErrMsg('Sukces.');
        }
        catch (err) {
            setErrMsg('Dostęp nie został zmieniony.');
            console.log(err);
        }
    };

    useEffect(() => {
        setErrMsg('');
    }, [userRoles]);

    return (
        <section className='user-change-roles'>
            <section className='user-change-roles__title'>
                <h3 className='user-change-roles__title--name'>
                    {!errMsg ? 'Zmień uprawnienia użytkownika' : errMsg}
                </h3>
            </section>
            {rolesItem}
            <button className='user-change-roles--button' onClick={handleChangeRoles} >Zmień</button>

        </section>
    );
};

export default UserChangeRoles;