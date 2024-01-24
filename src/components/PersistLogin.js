import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "./hooks/useRefreshToken";
import useData from "./hooks/useData";
import PleaseWait from './PleaseWait';
// import './PersistLogin.css';


const PersistLogin = () => {
    const refresh = useRefreshToken();


    const { auth } = useData();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        };
        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, []);

    return (
        <>
            {isLoading
                ? < PleaseWait />
                : <Outlet />}
        </>
    );
};

export default PersistLogin;;