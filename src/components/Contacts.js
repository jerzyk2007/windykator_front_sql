import { useEffect, useState } from 'react';
import axios from 'axios';

import './Contacts.css';

const Contacts = () => {
    const [contactsData, setContactsData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState('');

    const contactsItem = contactsData.map((contact, index) => {
        return (
            <section key={index} className="contacts__container">
                <p className='contacts__container--name'>{contact.name}</p>
                {contact.mail.length > 0 && (
                    <section className='contacts__container--mail'>
                        <span className='contacts__container--title'>Email:</span>
                        <section className='contacts__container-item'>
                            {contact.mail.map((email, index) => (
                                <span key={index} className='contacts__container-item--context'>
                                    <span > {email.email}</span>
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
        const importData = async () => {
            try {
                const result = await axios.get('http://localhost:3100/contacts');

                const processMailAndKeys = result.data.map(contact => {
                    // Sprawdzanie i dodawanie brakujących kluczy
                    const processedContact = {
                        name: contact.kontrahent || null,
                        mail: contact.mail || [],
                        phone: contact.telefon || null,
                        NIP: contact.NIP || null,
                        comments: contact.uwagi || null,
                        verify: contact.weryfikacja || false
                    };
                    // Przetwarzanie maili
                    if (processedContact.mail && typeof processedContact.mail === 'string') {
                        const emails = processedContact.mail.split(';').map((email) => email.trim());
                        // processedContact.mail = emails;
                        processedContact.mail = emails.map(email => {
                            return {
                                email,
                                verify: contact.weryfikacja
                            };
                        });
                    } else {
                        processedContact.mail = [];
                    }
                    if (processedContact.phone) {
                        processedContact.phone = [{
                            phone: processedContact.phone,
                            verify: contact.weryfikacja
                        }];
                    }
                    else {
                        processedContact.phone = null;
                    }
                    return processedContact;
                });
                setContactsData(processMailAndKeys);
                setFilteredData(processMailAndKeys);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        importData();
    }, []);

    useEffect(() => {
        const filteredResults = filteredData.filter(item =>
            ((item.name).toLowerCase()).includes(search.toLowerCase())
            // || ((item.mail).toLowerCase()).includes(search.toLowerCase())
        );

        setContactsData(filteredResults);
    }, [search]);

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

