import axios from "../../api/axios";
import useData from "./useData";

const useLogout = () => {
    const { setAuth } = useData();

    const logout = async () => {
        setAuth({});
        try {
            await axios('/logout', {
                withCredentials: true
            });
        }
        catch (err) {
            console.error(err);
        }
    };
    return logout;
};

export default useLogout;