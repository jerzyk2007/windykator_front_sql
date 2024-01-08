import { createContext, useState, useEffect } from "react";
import axios from "axios";
const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [contactsData, setContactsData] = useState([]);

    const getContacts = async () => {
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
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <DataContext.Provider value={{ contactsData, setContactsData, getContacts }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;