import { useLocation, Navigate, Outlet } from "react-router-dom";
import useData from "./hooks/useData";
import { getSecurityForPath } from "./menu/menuUtils";

const ProtectedRoute = () => {
  const { auth } = useData();
  const location = useLocation();
  const security = getSecurityForPath(location.pathname);

  // Jeśli ścieżka nie istnieje w menuConfig (a powinna być chroniona),
  // możesz tu ustawić domyślne zachowanie
  if (!security) {
    console.warn(
      `Brak konfiguracji zabezpieczeń dla ścieżki: ${location.pathname}`
    );
    return <Outlet />;
  }

  const { roles: allowedRoles, company: allowedCompanies } = security;

  // 1. Sprawdzanie ról
  const hasRole =
    allowedRoles.length === 0 ||
    auth?.roles?.some((role) => allowedRoles.includes(role));

  // 2. Sprawdzanie firm (identyczna logika jak w Twoim NavMenu)
  const userCompanies = Array.isArray(auth?.company) ? auth.company : [];
  const hasCompany =
    allowedCompanies.length === 0 ||
    allowedCompanies.every((comp) => userCompanies.includes(comp));

  if (hasRole && hasCompany) {
    console.log(hasRole);
    console.log(hasCompany);
    return <Outlet />;
  } else {
    // Jeśli zalogowany, ale brak uprawnień -> idź na home, jeśli nie zalogowany -> login
    return auth?.user ? (
      <Navigate to="/" state={{ from: location }} replace />
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }
};

export default ProtectedRoute;
