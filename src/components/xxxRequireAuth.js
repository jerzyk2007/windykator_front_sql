// import { useLocation, Navigate, Outlet } from "react-router-dom";
// import useData from "./hooks/useData";

// const RequireAuth = ({ allowedRoles }) => {
//   const { auth } = useData();
//   const location = useLocation();
//   return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
//     <Outlet />
//   ) : auth?.accessToken ? ( //changed from user to accessToken to persist login after refresh
//     // ? <Navigate to="/unauthorized" state={{ from: location }} replace />
//     <Navigate to="/login" state={{ from: location }} replace />
//   ) : (
//     <Navigate to="/login" state={{ from: location }} replace />
//   );
// };

// export default RequireAuth;

import { useLocation, Navigate, Outlet } from "react-router-dom";
import useData from "./hooks/useData";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useData();
  const location = useLocation();

  // Sprawdzamy, czy jakakolwiek rola użytkownika znajduje się w liście dozwolonych
  const isAllowed = auth?.roles?.some((role) => allowedRoles?.includes(role));

  return isAllowed ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
