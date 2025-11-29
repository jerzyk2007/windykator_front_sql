export const menuItems = [
  {
    title: "Tabelka",
    roles: [100, 2000],
    submenu: [
      { label: "Aktualne", path: "/actual-table", roles: [100, 2000] },
      { label: "Pilne", path: "/critical-table", roles: [100, 2000] },
      { label: "Zobowiązania", path: "/obligations-table", roles: [100, 2000] },
      { label: "Archiwum", path: "/archive-table", roles: [100, 2000] },
      { label: "Kpl dane", path: "/all-data-table", roles: [100, 2000] },
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
    title: "Kancelaria",
    roles: [500],
    submenu: [
      { label: "W realizacji", path: "/actual-law-table", roles: [500] },
      { label: "Sprawy do przyjęcia", path: "/no-accept-table", roles: [500] },
      // { label: "Wszystkie", path: "/all-cases-law-table", roles: [500] },
    ],
  },
  {
    title: "Polisy",
    roles: [350],
    submenu: [
      {
        label: "W windykacji",
        path: "/actual-insurance-table",
        roles: [150, 350],
      },
      // { label: "Sprawy do przyjęcia", path: "/no-accept-table", roles: [150, 350] },
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
          },
          {
            label: "Doradca",
            path: "/raport-advisers",
            roles: [100, 2000],
          },
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
      {
        label: "Raport - Nora",
        roles: [300, 2000],
        sideMenu: [
          {
            label: "Nora",
            path: "/raport-nora",
            roles: [300, 2000],
          },
        ],
      },
      {
        label: "Systemowe",
        roles: [200, 201, 202, 150, 2000],
        sideMenu: [
          {
            label: "Struktura organizacji",
            action: "organizationStructure",
            roles: [200, 201, 202, 150, 2000],
          },
        ],
      },
      {
        label: "AS - Symfonia",
        roles: [400, 2000],
        sideMenu: [
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
            path: "/change-org-str",
            roles: [1000, 200, 201, 202, 2000],
          },
          {
            label: "Zmiana struktury organizacji",
            path: "/create-org-str",
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
      },
      { label: "Dodaj użytkownika", path: "/register", roles: [1000, 2000] },
      {
        label: "Zmień hasło",
        path: "/change-password",
        roles: [1, 2000],
      },
      { label: "Wyloguj", action: "logout" },
    ],
  },
];
