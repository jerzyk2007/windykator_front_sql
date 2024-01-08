import { useEffect, useState } from 'react';
import useData from './hooks/useData';

import './Contacts.css';

const Contacts = () => {
    const { contactsData, setContactsData, getContacts } = useData();

    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState('');

    const contactsItem = filteredData.map((contact, index) => {
        return (
            <section key={index} className="contacts__container">
                <p className='contacts__container--name'>{contact.name}</p>
                {contact.mail.length > 0 && (
                    <section className='contacts__container--mail'>
                        <span className='contacts__container--title'>Email:</span>
                        <section className='contacts__container-item'>
                            {contact.mail.map((email, index) => (
                                <span key={index} className='contacts__container-item--context'>
                                    <p > {email.email}</p>
                                    <input
                                        type="checkbox"
                                        checked={email.verify}
                                        readOnly />
                                </span>
                            ))}
                        </section>
                    </section>)
                }

                {contact.phone && (
                    <section className='contacts__container--phone'>
                        <span className='contacts__container--title'>Telefon:</span>
                        <section className='contacts__container-item'>
                            {contact.phone.map((phoneNumber, index) => (
                                <span key={index} className='contacts__container-item--context'>
                                    <span > {phoneNumber.phone}</span>
                                    <input
                                        type="checkbox"
                                        checked={phoneNumber.verify}
                                        readOnly />
                                </span>
                            ))}
                        </section>
                    </section>)
                }
                {contact.NIP && <section className='contacts__container--NIP'>
                    <span className='contacts__container--title'>NIP:</span>
                    <span className='contacts__container-item--context'>{contact.NIP}</span>
                </section>}
                {contact.comments && <section className='contacts__container--comment'>
                    <span className='contacts__container--title'>Uwagi:</span>
                    <span className='contacts__container-item--context' style={{ marginLeft: "20px" }}>{contact.comments}</span>
                </section>}
            </section>
        );
    });

    useEffect(() => {
        const filteredResults = contactsData.filter(item =>
            ((item.name).toLowerCase()).includes(search.toLowerCase())
            || (item.mail && (
                (Array.isArray(item.mail) && item.mail.length > 0 && item.mail.some(email => typeof email === 'string' && email.includes(search)))
                || (typeof item.mail === 'string' && item.mail.includes(search))
                || (Array.isArray(item.mail) && item.mail.length > 0 && item.mail.some(emailObj => emailObj.email && emailObj.email.includes(search)))
                || (typeof item.mail === 'object' && item.mail.email && item.mail.email.includes(search))
            ))

            || (item.comments && (item.comments).toLowerCase().includes(search.toLowerCase()))
            || (item.NIP && item.NIP.toString().includes(search))
        );
        setFilteredData(filteredResults);
    }, [search]);

    useEffect(() => {
        setFilteredData(contactsData);
    }, [contactsData]);

    useEffect(() => {
        getContacts();
    }, []);

    return (
        <section className='contacts'>
            <form
                className="contacts-search"
                onSubmit={(e) => e.preventDefault()}
            >
                <input
                    className='contacts-search-text'
                    autoComplete='off'
                    id="search"
                    type="text"
                    name="uniqueNameForThisField" //wyłącza w chrome autouzupełnianie 
                    placeholder="Wyszukaj kontakt"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </form>
            {contactsItem}
        </section>
    );
};

export default Contacts;

