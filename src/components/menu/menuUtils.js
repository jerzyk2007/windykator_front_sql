// menuUtils.js lub menuConfig.js
import { menuItems } from "./menuConfig";

export const getSecurityForPath = (path) => {
  // Funkcja pomocnicza do przeszukiwania rekurencyjnego
  const findItem = (items) => {
    for (const item of items) {
      // Jeśli ścieżka się zgadza, zwróć zabezpieczenia
      if (item.path === path) {
        return { roles: item.roles || [], company: item.company || [] };
      }
      // Jeśli ma submenu, szukaj głębiej
      if (item.submenu) {
        const found = findItem(item.submenu);
        if (found) return found;
      }
      // Jeśli ma sideMenu, szukaj głębiej
      if (item.sideMenu) {
        const found = findItem(item.sideMenu);
        if (found) return found;
      }
    }
    return null;
  };

  return findItem(menuItems);
};
