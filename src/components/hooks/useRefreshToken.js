import axios from "../../api/axios";
import useData from "./useData";
import useLogout from "./useLogout";

const useRefreshToken = () => {
    const { setAuth } = useData();
    const logout = useLogout();

    const refresh = async () => {
        try {

            const response = await axios.get('/refresh', {
                withCredentials: true
            });
            setAuth(prev => {
                return {
                    ...prev,
                    userlogin: response.data.userlogin,
                    username: response.data.username,
                    usersurname: response.data.usersurname,
                    roles: response.data.roles,
                    accessToken: response.data.accessToken
                };
            });
            return response.data.accessToken;
        }
        catch (err) {
            await logout();
            console.error(err);
        }
    };
    return refresh;
};

export default useRefreshToken;