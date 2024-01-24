import { createContext, useState, useEffect } from "react";
import { axiosPrivate } from '../../api/axios';
const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    // const [contactsData, setContactsData] = useState([]);
    const [auth, setAuth] = useState({});
    const [pleaseWait, setPleaseWait] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    // const getContacts = async () => {
    //     try {
    //         const result = await axiosPrivate.get('/contacts/getAllContacts');
    //         setContactsData(result.data);
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };

    return (
        <DataContext.Provider value={{
            auth, setAuth,
            pleaseWait, setPleaseWait,
            errorMessage, setErrorMessage
        }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;