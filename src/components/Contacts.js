import { useEffect, useState, useRef } from 'react';
import axios, { axiosPrivate } from '../api/axios';
import useData from './hooks/useData';
import PleaseWait from './PleaseWait';
import ContactItem from './ContactItem';
import { LiaEditSolid } from "react-icons/lia";
import './Contacts.css';

const Contacts = () => {
    const { pleaseWait, setPleaseWait } = useData();
    const searchRef = useRef();

    const [contactsData, setContactsData] = useState([]);
    const [search, setSearch] = useState('');
    const [conctactItemData, setContactItemData] = useState({});




    const contactsItem = contactsData.map((contact, index) => {
        return (
            <section key={index} className="contacts__container" >
                <p className='contacts__container--name'>{contact.name}</p>
                {contact.NIP && <section className='contacts__container--NIP'>
                    <span className='contacts__container--title'>NIP:</span>
                    <span className='contacts__container-item--context'>{contact.NIP}</span>
                </section>}
                {contact.emails.length > 0 && <section className='contacts__container--mail' >
                    <span className='contacts__container--title'>Email:</span>
                    <section className='contacts__container-item'>
                        {contact.emails.map((email, index) => (
                            <span key={index} className='contacts__container-item--context'>
                                <p > {email.email}</p>
                                <input
                                    type="checkbox"
                                    checked={email.verify}
                                    readOnly />
                            </span>
                        ))}
                    </section>
                </section>}
                {contact.phones.length > 0 && (
                    <section className='contacts__container--phone'>
                        <span className='contacts__container--title'>Telefon:</span>
                        <section className='contacts__container-item'>
                            {contact.phones.map((phone, index) => (
                                <span key={index} className='contacts__container-item--context'>
                                    <span > {phone.phone}</span>
                                    <input
                                        type="checkbox"
                                        checked={phone.verify}
                                        readOnly />
                                </span>
                            ))}
                        </section>
                    </section>)
                }


                {contact.comment && <section className='contacts__container--comment'>
                    <span className='contacts__container--title'>Uwagi:</span>
                    <span className='contacts__container-item--context' style={{ marginLeft: "20px" }}>{contact.comment}</span>
                </section>}
                <LiaEditSolid className="contacts__container--edit" onClick={() => setContactItemData(contact)} />
            </section>
        );
    });

    const searchResult = async (e) => {
        e.preventDefault();
        if (search.length > 2) {
            setPleaseWait(true);
            const result = await axios.get(`/contacts/getSearch/${search}`);
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

        pleaseWait ? <PleaseWait /> : conctactItemData.name ? <ContactItem conctactItemData={conctactItemData} setContactItemData={setContactItemData} setContactsData={setContactsData} contactsData={contactsData} /> : <section className='contacts'>
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

