import { useState, useEffect, useRef } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { LiaEditSolid } from "react-icons/lia";
import PleaseWait from './PleaseWait';
import EditSystemSettings from './EditSystemSettings';
import './SettingsSystem.css';

const SettingsSystem = () => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();
    // const searchRef = useRef();

    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState([]);
    const [edit, setEdit] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await axiosPrivateIntercept.get('/user/get-userdata/', { params: { search } });
            setUsers(result.data);
            setIsLoading(false);
        }
        catch (err) {
            console.log(err);
        }
    };
    const handleEdit = (data) => {
        setUser(data);
        setEdit(true);
    };

    const userItem = users.map((userItem, index) => {
        return (
            <section className='settings_system__result' key={index}>
                <p className='settings_system__result--name'>{userItem.userlogin}</p>
                <LiaEditSolid className="settings_system__result--edit" onClick={() => handleEdit(userItem)} />
            </section>
        );
    });

    useEffect(() => {
        setSearch('');
    }, [edit]);

    // useEffect(() => {
    //     searchRef.current.focus();
    // }, []);

    return (
        <section className='settings_system'>
            {!edit ? <section className='settings_system__container'>
                <section className='settings_system__search'>
                    <form className="settings_system__search-form" onSubmit={handleSubmit}>
                        <input
                            className="settings_system__search-text"
                            type="text"
                            // ref={searchRef}
                            placeholder="Wyszukaj użytkownika - min 5 znaków"
                            value={search}
                            onChange={(e) => setSearch((e.target.value).toLocaleLowerCase())}
                        />
                        <button className="settings_system__search-button" type="submit" disabled={search.length < 5 ? true : false}>Szukaj</button>
                    </form>
                </section>
                {search && userItem}

            </section> : <EditSystemSettings user={user} setEdit={setEdit} />}
            {isLoading && <PleaseWait />}
        </section>
    );
};

export default SettingsSystem;