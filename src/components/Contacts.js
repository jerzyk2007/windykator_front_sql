import { useEffect, useState, useRef } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from './hooks/useData';
import PleaseWait from './PleaseWait';
import ContactItem from './ContactItem';
import { LiaEditSolid } from "react-icons/lia";
import './Contacts.css';

const Contacts = () => {
    const { pleaseWait, setPleaseWait } = useData();
    const searchRef = useRef();
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [contactsData, setContactsData] = useState([]);
    const [search, setSearch] = useState('');
    const [conctactItemData, setContactItemData] = useState({});




    const contactsItem = contactsData.map((contact, index) => {
        return (
            <section className="contacts__container" key={index}>
                <section className="contacts__container--item" >
                    <section className='contacts__title'></section>
                    <section className='contacts-context'>
                        <p className='contacts__container--text'>{contact.name}</p>
                    </section>
                    <section className='contacts__settings'></section>
                </section>
                {
                    contact.NIP &&
                    <section className="contacts__container--item" >
                        <section className='contacts__title'>
                            <span className='contacts__container--name'>NIP:</span>
                        </section>
                        <section className='contacts-context'>
                            <p className='contacts__container--text'>{contact.NIP}</p>
                        </section>
                        <section className='contacts__settings'></section>
                    </section>
                }
                {
                    contact.emails.length > 0 &&
                    <section className="contacts__container--item" >
                        <section className='contacts__title'>
                            <span className='contacts__container--name'>Email:</span>
                        </section>
                        <section className='contacts-context'>
                            {contact.emails.map((email, index) =>
                                <p className='contacts__container--text' key={index}>{email.email}</p>
                            )}

                        </section>
                        <section className='contacts__settings'>
                            {contact.emails.map((email, index) =>
                                <input
                                    className='contacts__settings--checkbox'
                                    key={index}
                                    type="checkbox"
                                    checked={email.verify}
                                    readOnly />
                            )}
                        </section>
                    </section>
                }
                {
                    contact.phones.length > 0 &&
                    <section className="contacts__container--item" >
                        <section className='contacts__title'>
                            <span className='contacts__container--name'>Telefon:</span>
                        </section>
                        {/* zamiana 9 cyfrowego numeru na 111-222-333 */}
                        <section className='contacts-context'>
                            {contact.phones.map((phone, index) =>
                                <p className='contacts__container--text' key={index}>
                                    {`${phone.phone.toString().substring(0, 3)}-${phone.phone.toString().substring(3, 6)}-${phone.phone.toString().substring(6, 9)}`}
                                </p>
                            )}

                        </section>

                        <section className='contacts__settings'>
                            {contact.phones.map((phone, index) =>
                                <input
                                    className='contacts__settings--checkbox'
                                    key={index}
                                    type="checkbox"
                                    checked={phone.verify}
                                    readOnly />
                            )}
                        </section>
                    </section>
                }
                {
                    contact.comment &&
                    <section className="contacts__container--item" >
                        <section className='contacts__title'>
                            <span className='contacts__container--name'>Uwagi:</span>
                        </section>
                        <section className='contacts-context'>
                            <p className='contacts__container--text'>{contact.comment}</p>
                        </section>
                        <section className='contacts__settings'></section>
                    </section>
                }
                <LiaEditSolid className="contacts__container--edit" onClick={() => setContactItemData(contact)} />
            </section>);
    });

    const searchResult = async (e) => {
        e.preventDefault();
        if (search.length > 2) {
            setPleaseWait(true);
            const result = await axiosPrivateIntercept.get(`/contacts/getSearch/${search}`,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            setContactsData(result.data);
            setPleaseWait(false);
        }
    };

    useEffect(() => {
        setContactsData([]);
    }, [search]);

    useEffect(() => {
        searchRef.current.focus();
    }, []);


    return (

        pleaseWait ? <PleaseWait /> : conctactItemData.name ? <ContactItem conctactItemData={conctactItemData} setContactItemData={setContactItemData} setContactsData={setContactsData} contactsData={contactsData} /> :
            <section className='contacts'>
                <form
                    className="contacts-search"
                    onSubmit={searchResult}
                >
                    <input
                        className='contacts-search-text'
                        autoComplete='off'
                        id="search"
                        type="text"
                        ref={searchRef}
                        name="uniqueNameForThisField" //wyłącza w chrome autouzupełnianie 
                        placeholder="Wyszukaj kontakt (min 3 znaki)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
                {contactsItem}
            </section>

    );
};

export default Contacts;

