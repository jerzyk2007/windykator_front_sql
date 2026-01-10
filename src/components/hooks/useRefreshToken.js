import axios from "../../api/axios";
import useData from "./useData";
import useLogout from "./useLogout";

const useRefreshToken = () => {
  const { setAuth } = useData();
  const logout = useLogout();

  const refresh = async () => {
    try {
      const response = await axios.get("/refresh", {
        withCredentials: true,
      });
      setAuth((prev) => {
        return {
          ...prev,
          userlogin: response.data.userlogin,
          username: response.data.username,
          usersurname: response.data.usersurname,
          roles: response.data.roles,
          company: response.data.company,
          accessToken: response.data.accessToken,
          permissions: response.data.permissions,
          id_user: response.data.id_user,
        };
      });
      return response.data.accessToken;
    } catch (err) {
      await logout();
      console.error(err);
    }
  };
  return refresh;
};

export default useRefreshToken;
