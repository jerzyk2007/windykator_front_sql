import { useState, useEffect } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { Button } from "@mui/material";
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
                <p className='user_delete__container--edit'
                >{user.userlogin}</p>
            </section>

            {!confirmDelete ?
                <Button
                    className='user_delete--button'
                    variant='contained'
                    onClick={() => setConfirmDelete(true)}
                    size='small'
                >Usuń użytkownika</Button>
                : <section className='user_delete__confirm'>
                    <Button
                        className='user_delete__confirm--cancel'
                        variant='contained'
                        onClick={() => setConfirmDelete(false)}
                        size='small'
                    >Anuluj</Button>
                    <Button
                        className='user_delete__confirm--confirm'
                        variant='contained'
                        onClick={handleConfirmDeleteUser}
                        size='small'
                        color='error'
                    >Usuń użytkownika</Button>
                </section>}
        </section>
    );
};

export default UserDelete;