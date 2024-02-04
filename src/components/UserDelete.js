import { useState, useEffect } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import './UserDelete.css';

const UserDelete = ({ user, setEdit }) => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const handleConfirmDeleteUser = async () => {
        try {
            const result = await axiosPrivateIntercept.delete(`/user/delete-user/${user._id}`, {
                userlogin: user.userlogin
            });
            setEdit(false);
        }
        catch (err) {
            setErrMsg('Użytkownik nie został usunięty.');
            console.log(err);
        }
    };

    return (
        <section className='user_delete'>
            <section className='user_delete__title'>
                {!confirmDelete && <h3 className='user_delete__title--name'>{!errMsg ? "Usuń użytkownika" : errMsg}</h3>}
                {confirmDelete && <h3 className='user_delete__title--name'>Potwierdź, tej operacji nie można cofnąć !</h3>}
            </section>
            <section className='user_delete__container'>
                <p className='edit_system_change--delete__container--edit'
                >{user.userlogin}</p>
            </section>

            {!confirmDelete ?
                <button className='user_delete--button' onClick={() => setConfirmDelete(true)}>Usuń użytkownika</button>
                : <section className='user_delete__confirm'>
                    <button className='user_delete__confirm--cancel' onClick={() => setConfirmDelete(false)}>Anuluj</button>
                    <button className='user_delete__confirm--confirm' onClick={handleConfirmDeleteUser}>Usuń użytkownika</button>
                </section>}
        </section>
    );
};

export default UserDelete;