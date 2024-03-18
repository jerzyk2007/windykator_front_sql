import { useState, useEffect } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import './UserTableColumns.css';

const UserTableColumns = ({ user, columns }) => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [userColumns, setUserColumns] = useState(columns);
    const [errMsg, setErrMsg] = useState('');

    const columnsItem = userColumns.map((col, index) => {
        return (
            <section key={index} className='user-table-columns__item'>
                <section className='user-table-columns__item-name'>
                    <section className='user-table-columns__item-DB'>
                        <span className='user-table-columns__item-accessorKey'>
                            Nazwa w DB: </span>
                        <span className='user-table-columns__item-header'>
                            {col.accessorKey}</span>
                    </section>
                    <section className='user-table-columns__item-DB'>
                        <span className='user-table-columns__item-accessorKey'>
                            Nazwa w tabeli: </span>
                        <span className='user-table-columns__item-header'>
                            {col.header}</span>
                    </section>
                </section>
                <section className='user-table-columns__item-check'>
                    <input
                        className='user-table-columns__item-check--box'
                        type='checkbox'
                        checked={col.checked ? col.checked : false}
                        onChange={() => {
                            setUserColumns(prev => {
                                const modifiedColumns = prev.map(item => {
                                    if (col.accessorKey === item.accessorKey) {
                                        return {
                                            ...item,
                                            checked: !item.checked
                                        };
                                    } else {
                                        return item;
                                    }
                                });
                                return modifiedColumns;
                            });
                        }}
                    />
                </section>
            </section>
        );
    });

    const handleChangeChecked = (info) => {
        setUserColumns(userColumns.map(col => ({ ...col, checked: info === 'all' })));
    };

    const handleSaveUserColumns = async () => {
        const modifiedColumns = userColumns.map(col => {
            if (col.checked) {
                const { checked, ...rest } = col;
                return rest;
            }
        }).filter(Boolean);

        try {
            const result = await axiosPrivateIntercept.patch(`/user/change-columns/${user._id}`, { columns: modifiedColumns });
            setErrMsg('Sukces.');
        }
        catch (err) {
            setErrMsg('Dane nie zostały zmienione.');
            console.log(err);
        }
    };

    useEffect(() => {
        setErrMsg('');
    }, [userColumns]);

    return (
        <section className='user-table-columns'>
            <section className='user-table-columns__title'>
                <h3 className='user-table-columns__title--name'>
                    {!errMsg ? 'Dostęp do danych w tabeli' : errMsg}
                </h3>
                <section className='user-table-columns__select'>
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
            <section className='user-table-columns__container'>
                {columnsItem}
            </section>
            <Button
                variant='contained'
                onClick={handleSaveUserColumns}
                size='small'
            >Zmień</Button>
        </section>
    );
};

export default UserTableColumns;;