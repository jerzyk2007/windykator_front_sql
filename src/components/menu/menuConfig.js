export const menuItems = [
  {
    title: "Tabelka",
    roles: [100, 2000],
    company: [],
    submenu: [
      {
        label: "Aktualne",
        path: "/actual-table",
        roles: [100, 2000],
        company: [],
      },
      {
        label: "Pilne",
        path: "/critical-table",
        roles: [100, 2000],
        company: [],
      },
      {
        label: "Zobowiązania",
        path: "/obligations-table",
        roles: [100, 2000],
        company: [],
      },
      {
        label: "Archiwum",
        path: "/archive-table",
        roles: [100, 2000],
        company: [],
      },
      {
        label: "Kpl dane",
        path: "/all-data-table",
        roles: [100, 2000],
        company: [],
      },
      { label: "KRD", path: "/krd", roles: [150, 1000, 2000], company: [] },
      {
        label: "Dokumenty Raportu FK",
        path: "/fk-documents-table",
        roles: [110, 120, 1000, 2000],
        company: [],
      },
      {
        label: "Wyłączenia Raportu FK",
        path: "/fk-disabled-documents-table",
        roles: [200, 201, 202, 1000, 2000],
        company: [],
      },
    ],
  },
  {
    title: "Kancelaria",
    roles: [150, 500],
    company: [],

    submenu: [
      {
        label: "W realizacji",
        path: "/actual-law-table",
        roles: [500],
        company: [],
      },
      {
        label: "Sprawy do przyjęcia",
        path: "/no-accept-table",
        roles: [500],
        company: [],
      },
    ],
  },
  {
    title: "Polisy",
    roles: [150, 350],
    company: [],
    submenu: [
      {
        label: "W windykacji",
        path: "/actual-insurance-table",
        roles: [150, 350],
        company: [],
      },
      {
        label: "Zakończone",
        path: "/completed-insurance-table",
        roles: [150, 350],
        company: [],
      },
      {
        label: "Wszystkie",
        path: "/all-insurance-table",
        roles: [150, 350],
        company: [],
      },
      {
        label: "OW - rozliczone",
        path: "/settled-collection-charges",
        roles: [150],
        company: [],
      },
      {
        label: "OW - nierozliczone",
        path: "/pending-collection-charges",
        roles: [150, 350],
        company: [],
      },
      {
        label: "Dodaj kolejny dokument",
        path: "/add-insurance-document",
        roles: [150],
        company: [],
      },
      {
        label: "Edytuj dokument",
        path: "/edit-insurance-document",
        roles: [150],
        company: [],
      },
    ],
  },
  {
    title: "KEM",
    roles: [150],
    company: ["KEM"],

    submenu: [
      {
        label: "Zablokowane",
        path: "/",
        roles: [150],
        company: ["KEM"],
      },
      {
        label: "Przed windykacją",
        path: "/",
        roles: [150],
        company: ["KEM"],
      },
      {
        label: "Windykacja oddział",
        path: "/",
        roles: [150],
        company: ["KEM"],
      },
    ],
  },
  {
    title: "Raporty",
    roles: [100, 200, 201, 202, 300, 400, 1000, 2000],
    company: [],
    submenu: [
      {
        label: "Dział - Doradca",
        roles: [100, 110, 2000],
        company: [],
        sideMenu: [
          { label: " Dział", path: "/raport-departments" },
          { label: "Doradca", path: "/raport-advisers" },
        ],
      },
      {
        label: "Raporty - FK",
        roles: [200, 201, 202, 2000],
        company: [],
        sideMenu: [
          {
            label: "Generuj raport KRT",
            path: "/generate-raport-fk-KRT",
            roles: [200],
            company: [],
          },
          {
            label: "Generuj raport KEM",
            path: "/generate-raport-fk-KEM",
            roles: [201],
            company: [],
          },
          {
            label: "Generuj raport RAC",
            path: "/generate-raport-fk-RAC",
            roles: [202],
            company: [],
          },
        ],
      },
      {
        label: "Kontrola dokumentacji",
        roles: [120, 2000],
        company: [],
        sideMenu: [
          {
            label: "Dokumenty kontroli BL",
            path: "/control-bl-documents-table",
            roles: [100, 2000],
            company: ["KRT"],
          },
          {
            label: "Raport kontroli BL",
            action: "controlRaportBL",
            roles: [120, 2000],
            company: [],
          },
        ],
      },
      {
        label: "Raport - Nora",
        roles: [300, 2000],
        company: [],
        sideMenu: [
          {
            label: "Nora",
            path: "/raport-nora",
            roles: [300, 2000],
            company: [],
          },
        ],
      },
      {
        label: "Systemowe",
        roles: [200, 201, 202, 150, 2000],
        company: [],
        sideMenu: [
          {
            label: "Struktura organizacji",
            action: "organizationStructure",
            roles: [200, 201, 202, 150, 2000],
            company: [],
          },
        ],
      },
      {
        label: "AS - Symfonia",
        roles: [400, 2000],
        company: [],
        sideMenu: [
          {
            label: "Raport różnic AS - FK",
            action: "differenceAs_Fk",
            roles: [400, 2000],
            company: [],
          },
          {
            label: "Zestawienie wpłat - kancelarie",
            action: "lawStatement",
            roles: [150, 2000],
            company: [],
          },
        ],
      },
    ],
  },
  {
    title: "System",
    roles: [150, 200, 201, 202, 2000],
    company: [],
    submenu: [
      {
        label: "Uprawnienia użytkownika",
        path: "/user-settings",
        roles: [1000, 2000],
        company: [],
      },
      {
        label: "Dodaj dane",
        path: "/add-data",
        roles: [1000, 200, 201, 202, 2000],
        company: [],
      },
      {
        label: "Ustawienia",
        roles: [1000, 200, 201, 202, 2000],
        company: [],
        sideMenu: [
          {
            label: "Tabela - kolumny",
            path: "/table-settings",
            roles: [1000, 2000],
            company: [],
          },
          {
            label: "Dane struktury organizacji",
            path: "/change-org-str",
            roles: [1000, 200, 201, 202, 2000],
            company: [],
          },
          {
            label: "Zmiana struktury organizacji",
            path: "/create-org-str",
            roles: [1000, 200, 201, 202, 2000],
            company: [],
          },
        ],
      },
    ],
  },
  {
    title: "Użytkownik",
    roles: [1, 100, 110, 2000],
    company: [],
    submenu: [
      {
        label: "Aktualizacja danych",
        path: "/",
        roles: [1, 100, 110, 2000],
        company: [],
      },
      {
        label: "Instrukcja obsługi",
        path: "/instruction",
        roles: [1, 2000],
        company: [],
      },
      {
        label: "Dodaj użytkownika",
        path: "/register",
        roles: [1000, 2000],
        company: [],
      },
      {
        label: "Zmień hasło",
        path: "/change-password",
        roles: [1, 2000],
        company: [],
      },
      { label: "Wyloguj", action: "logout" },
    ],
  },
];
