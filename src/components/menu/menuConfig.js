export const menuItems = [
  {
    title: "Tabelka",
    roles: [100, 2000], // Role, które mogą widzieć ten element menu
    submenu: [
      { label: "Aktualne", path: "/actual-table", roles: [100, 2000] },
      { label: "Pilne", path: "/critical-table", roles: [100, 2000] },
      { label: "Zobowiązania", path: "/obligations-table", roles: [100, 2000] },
      { label: "Archiwum", path: "/archive-table", roles: [100, 2000] },
      { label: "Kpl dane", path: "/all-data-table", roles: [100, 2000] },
      // { label: "Różnice AS - Symfonia", path: "/different-AS-FK", roles: [1000] }, // Zakomentowane jak w oryginale
      { label: "KRD", path: "/krd", roles: [150, 2000] },
      {
        label: "Dokumenty Raportu FK",
        path: "/fk-documents-table",
        roles: [110, 120, 1000, 2000],
      },
      {
        label: "Wyłączenia Raportu FK",
        path: "/fk-disabled-documents-table",
        roles: [200, 201, 202, 2000],
      },
    ],
  },
  {
    title: "Raporty",
    roles: [100, 200, 201, 202, 300, 400, 1000, 2000],
    submenu: [
      {
        label: "Dział - Doradca",
        roles: [100, 2000],
        sideMenu: [
          {
            label: " Dział",
            path: "/raport-departments",
            // permission: "Standard",
          },
          {
            label: "Doradca",
            path: "/raport-advisers",
            roles: [100, 2000],
          },
          // { label: "Raport wg obszarów", path: "/raport-areas", roles: [2000] }, // Zakomentowane jak w oryginale
        ],
      },
      {
        label: "Raporty - FK",
        roles: [200, 201, 202, 2000],
        sideMenu: [
          {
            label: "Generuj raport KRT",
            path: "/generate-raport-fk-KRT",
            roles: [200, 2000],
          },
          {
            label: "Generuj raport KEM",
            path: "/generate-raport-fk-KEM",
            roles: [201, 2000],
          },
          {
            label: "Generuj raport RAC",
            path: "/generate-raport-fk-RAC",
            roles: [202, 2000],
          },
        ],
      },
      {
        label: "Kontrola dokumentacji",
        roles: [120, 2000],
        sideMenu: [
          {
            label: "Dokumenty kontroli BL",
            path: "/control-bl-documents-table",
            roles: [120, 2000],
          },
          {
            label: "Raport kontroli BL",
            action: "controlRaportBL",
            roles: [120, 2000],
          },
        ],
      },
      { label: "Raport - Nora", path: "/raport-nora", roles: [300, 2000] },
      {
        label: "Struktura organizacji",
        action: "organizationStructure",
        roles: [200, 201, 202, 150, 2000],
      },
      {
        label: "Raport różnic AS - FK",
        action: "differenceAs_Fk",
        roles: [400, 2000],
      },
      {
        label: "Zestawienie wpłat - kancelarie",
        action: "lawStatement",
        roles: [150, 2000],
      },
    ],
  },
  {
    title: "System",
    roles: [1000, 200, 201, 202, 2000],
    submenu: [
      {
        label: "Uprawnienia użytkownika",
        path: "/user-settings",
        roles: [1000, 2000],
      },
      {
        label: "Dodaj dane",
        path: "/add-data",
        roles: [1000, 200, 201, 202, 2000],
      },
      {
        label: "Ustawienia",
        roles: [1000, 200, 201, 202, 2000],
        sideMenu: [
          { label: "Tabela - kolumny", path: "/table-settings", roles: [2000] },
          {
            label: "Dane struktury organizacji",
            path: "/change-items",
            roles: [1000, 200, 201, 202, 2000],
          },
          {
            label: "Zmiana struktury organizacji",
            path: "/dept-mapper",
            roles: [1000, 200, 201, 202, 2000],
          },
        ],
      },
    ],
  },
  {
    title: "Użytkownik",
    roles: [1, 2000],
    submenu: [
      { label: "Aktualizacja danych", path: "/", roles: [1, 2000] },
      {
        label: "Instrukcja obsługi",
        path: "/instruction",
        roles: [1, 2000],
      }, // Dodałem 1000 dla spójności
      { label: "Dodaj użytkownika", path: "/register", roles: [1000, 2000] },
      {
        label: "Zmień hasło",
        path: "/change-password",
        roles: [1, 2000],
      }, // Dodałem 1000 dla spójności
      { label: "Wyloguj", action: "logout" },
    ],
  },
];
