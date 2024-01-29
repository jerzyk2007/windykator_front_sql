import { useState, useEffect, useRef } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { LiaEditSolid } from "react-icons/lia";
import PleaseWait from './PleaseWait';
import EditUserSettings from './EditUserSettings';
import './UserSettings.css';

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
            <section className='user_settings__result' key={index}>
                <p className='user_settings__result--name'>{userItem.userlogin}</p>
                <LiaEditSolid className="user_settings__result--edit" onClick={() => handleEdit(userItem)} />
            </section>
        );
    });

    useEffect(() => {
        setUsers([]);
        setSearch('');
    }, [edit]);

    return (
        <section className='user_settings'>
            {!edit ? <section className='user_settings__container'>
                <section className='user_settings__search'>
                    <form className="user_settings__search-form" onSubmit={handleSubmit}>
                        <input
                            className="user_settings__search-text"
                            type="text"
                            // ref={searchRef}
                            placeholder="Wyszukaj użytkownika - min 5 znaków"
                            value={search}
                            onChange={(e) => setSearch((e.target.value).toLocaleLowerCase())}
                        />
                        <button className="user_settings__search-button" type="submit" disabled={search.length < 5 ? true : false}>Szukaj</button>
                    </form>
                </section>
                {search && userItem}

            </section> : <EditUserSettings user={user} setEdit={setEdit} />}
            {isLoading && <PleaseWait />}
        </section>
    );
};

export default SettingsSystem;