import { useState, useEffect } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import './UserChangeDepartments.css';

const UserChangeDepartments = ({ user, departments }) => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();


    const [userDepartments, setUserDepartments] = useState(departments);
    const [errMsg, setErrMsg] = useState('');

    const departmentsItem = Object.entries(userDepartments).map(([dep, isChecked], index) => (
        <label key={index} className='user_change_departments__container--info' id={`dep${index}`}>
            <span className='user_change_departments__container--text'>{dep}</span>
            <input
                className='user_change_departments__container--check'
                name={`dep${index}`}
                type="checkbox"
                onChange={() => setUserDepartments(prev => {
                    return {
                        ...prev,
                        [dep]: !isChecked
                    };
                }
                )}
                checked={isChecked}
            />
        </label>
    ));

    const handleChangeChecked = (info) => {
        const updatedUserDepartments = {};
        Object.keys(userDepartments).forEach(depKey => {
            updatedUserDepartments[depKey] = info === 'all';
        });
        setUserDepartments(updatedUserDepartments);
    };

    const handleSaveUserDepartments = async () => {
        const filteredObject = Object.keys(userDepartments)
            .filter(key => userDepartments[key] !== false)
            .reduce((acc, key) => {
                acc[key] = userDepartments[key];
                return acc;
            }, {});
        try {
            const result = await axiosPrivateIntercept.patch(`/user/change-departments/${user._id}`, {
                departments: filteredObject
            });
            setErrMsg(`Sukces.`);
        }
        catch (err) {
            setErrMsg(`Zmiana się nie powiodła.`);
            console.log(err);
        }
    };

    useEffect(() => {
        setErrMsg('');
    }, [userDepartments]);

    return (
        <section className='user_change_departments'>
            <section className='user_change_departments__title'>
                <h3 className='user_change_departments--name'>
                    {!errMsg ? 'Dostęp do działów' : errMsg}
                </h3>
                <section className='user_change_departments__select'>
                    <Button
                        variant='contained'
                        onClick={() => handleChangeChecked('all')}
                        size='small'
                        color='secondary'
                    >Zaznacz</Button>

                    <Button
                        variant='outlined'
                        onClick={() => handleChangeChecked('none')}
                        size='small'
                        color='secondary'
                    >Odznacz</Button>
                </section>
            </section>
            <section className='user_change_departments__container'>
                {departmentsItem}
            </section>
            <Button
                variant='contained'
                onClick={handleSaveUserDepartments}
                size='small'
            >Zmień</Button>
        </section>
    );
};

export default UserChangeDepartments;