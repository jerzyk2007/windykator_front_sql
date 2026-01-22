import { menuItems } from "./menuConfig";

export const getSecurityForPath = (path) => {
  const allConfigs = [];

  const search = (items) => {
    for (const item of items) {
      if (item.path === path) {
        allConfigs.push({
          roles: item.roles || [],
          company: item.company || [],
        });
      }
      if (item.submenu) search(item.submenu);
      if (item.sideMenu) search(item.sideMenu);
    }
  };

  search(menuItems);
  return allConfigs; // Zwraca tablicę konfiguracji (może być ich kilka dla "/" )
};
