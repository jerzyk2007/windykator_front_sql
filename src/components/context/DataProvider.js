import { createContext, useState, useEffect } from "react";
import { axiosPrivate } from '../../api/axios';
const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [contactsData, setContactsData] = useState([]);

    const getContacts = async () => {
        try {
            const result = await axiosPrivate.get('/contacts/getAllContacts');
            setContactsData(result.data);
            console.log(result.data);
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