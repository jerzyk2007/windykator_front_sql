import { useLocation, Navigate, Outlet } from "react-router-dom";
import useData from "./hooks/useData";
import { getSecurityForPath } from "./menu/menuUtils";

const ProtectedRoute = () => {
  const { auth } = useData();
  const location = useLocation();
  const configs = getSecurityForPath(location.pathname);

  // 1. Sprawdzenie czy użytkownik jest zalogowany (skoro samo 'auth' to dane)
  // Zakładamy, że jeśli auth ma role, to użytkownik jest zalogowany
  const isLoggedIn = auth && auth.roles;

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Jeśli ścieżka nie jest zdefiniowana w menuConfig - wpuszczamy (np. strony bez zabezpieczeń)
  if (configs.length === 0) {
    return <Outlet />;
  }

  // 3. Sprawdzamy, czy użytkownik spełnia uprawnienia dla CHOCIAŻ JEDNEJ konfiguracji tego adresu
  const hasAccess = configs.some((config) => {
    const roleAccess =
      config.roles.length === 0 ||
      auth?.roles?.some((role) => config.roles.includes(role));

    const userCompanies = Array.isArray(auth?.company) ? auth.company : [];
    const companyAccess =
      config.company.length === 0 ||
      config.company.every((comp) => userCompanies.includes(comp));

    return roleAccess && companyAccess;
  });

  if (hasAccess) {
    return <Outlet />;
  }

  // 4. Jeśli brak uprawnień - ZABEZPIECZENIE PRZED PĘTLĄ
  if (location.pathname === "/") {
    // Jeśli użytkownik nie ma uprawnień nawet do strony głównej, nie możemy go tam przekierować
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Brak uprawnień</h2>
        <p>Twoje konto nie ma uprawnień do wyświetlenia strony głównej.</p>
      </div>
    );
  }

  // Jeśli brak uprawnień do podstrony (np. /user-settings), wyrzuć go na stronę główną
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
