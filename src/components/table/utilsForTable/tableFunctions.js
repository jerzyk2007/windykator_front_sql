// wybór ściezki do zapisu w zależności od profilu użytkownika
export const basePath = {
  insider: "/documents",
  partner: "/law-partner",
  insurance: "/insurance",
  vindex: "/vindex",
};

// tworzy notaktę dla LogAndChat
export const createNoteObject = (info, auth) => {
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${date.getFullYear()}`;
  // const formattedDate = `${date.getFullYear()}-${String(
  //   date.getMonth() + 1
  // ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  return {
    date: formattedDate,
    note: info,
    profile: auth.permissions,
    userlogin: auth.userlogin,
    username: auth.usersurname,
  };
};

// funckje dla przygotowania danych dla tabeli po wyjściu z EditRowTablePro
const filteredArrayManagement = (data) => {
  const filteredData =
    data !== "BRAK"
      ? (() => {
          const lastString = data[data.length - 1]; // Ostatni element

          return lastString.length > 50
            ? lastString.slice(0, 50) + "..."
            : lastString; // Ograniczenie do 100 znaków z "..."
        })()
      : data;

  return filteredData;
};

// dla zmiany  danych w tabeli Insider
export const changeSingleDoc = (data) => {
  data.JAKA_KANCELARIA = data.JAKA_KANCELARIA ? data.JAKA_KANCELARIA : "BRAK";
  data.JAKA_KANCELARIA_TU = data.JAKA_KANCELARIA_TU
    ? data.JAKA_KANCELARIA_TU
    : "BRAK";
  data.BLAD_DORADCY = data.BLAD_DORADCY ? data.BLAD_DORADCY : "NIE";
  data.DZIALANIA = data.DZIALANIA ? data.DZIALANIA : "BRAK";
  data.POBRANO_VAT = data.POBRANO_VAT ? data.POBRANO_VAT : "Nie dotyczy";
  // data.INFORMACJA_ZARZAD = Array.isArray(data.INFORMACJA_ZARZAD)
  //   ? filteredArrayManagement(data.INFORMACJA_ZARZAD)
  //   : "BRAK";
  data.OSTATECZNA_DATA_ROZLICZENIA = data.OSTATECZNA_DATA_ROZLICZENIA
    ? data.OSTATECZNA_DATA_ROZLICZENIA
    : "BRAK";
  data.DATA_KOMENTARZA_BECARED = data.DATA_KOMENTARZA_BECARED
    ? data.DATA_KOMENTARZA_BECARED
    : "BRAK";
  data.KOMENTARZ_KANCELARIA_BECARED = data.KOMENTARZ_KANCELARIA_BECARED
    ? data.KOMENTARZ_KANCELARIA_BECARED
    : "BRAK";
  data.NUMER_SPRAWY_BECARED = data.NUMER_SPRAWY_BECARED
    ? data.NUMER_SPRAWY_BECARED
    : "BRAK";
  data.STATUS_SPRAWY_KANCELARIA = data.STATUS_SPRAWY_KANCELARIA
    ? data.STATUS_SPRAWY_KANCELARIA
    : "BRAK";
  data.STATUS_SPRAWY_WINDYKACJA = data.STATUS_SPRAWY_WINDYKACJA
    ? data.STATUS_SPRAWY_WINDYKACJA
    : "BRAK";
  data.STATUS_AKTUALNY = data.STATUS_AKTUALNY ? data.STATUS_AKTUALNY : "BRAK";
  return data;
};

// dla zmiany  danych w tabeli Partner
export const changeSingleDocLawPartner = (data) => {
  data.OPIS_DOKUMENTU = data?.OPIS_DOKUMENTU ? data.OPIS_DOKUMENTU : "BRAK";
  data.KANAL_KOMUNIKACJI = data?.KANAL_KOMUNIKACJI
    ? data.KANAL_KOMUNIKACJI
    : "BRAK";
  return data;
};

//styl dla panelu informacji i logów do zmiany koloru daty i użytkownika
export const spanInfoStyle = (profile, info = "name") => {
  const dateColor = "rgba(47, 173, 74, 1)";
  return profile === "Pracownik"
    ? {
        color: info === "name" ? "rgba(42, 4, 207, 1)" : dateColor,
        fontWeight: "bold",
      }
    : profile === "Kancelaria"
    ? {
        color: info === "name" ? "rgba(192, 112, 8, 1)" : dateColor,
        fontWeight: "bold",
      }
    : {
        color: info === "name" ? "rgba(255, 14, 203, 1)" : dateColor,
        fontWeight: "bold",
      };
};

//formatowanie nip
export const formatNip = (nip) => {
  if (!nip) return "";
  return nip.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1-$2-$3-$4");
};

export const commonTableHeadCellProps = {
  align: "left",
  sx: {
    fontWeight: "500",
    fontFamily: "'Source Sans 3', Calibri, sans-serif",
    fontSize: ".9rem",
    color: "black",
    // background: "rgba(233, 245, 255, 1)",
    background: "rgb(216, 237, 253)",
    borderRight: "1px solid #eeededff",
    minHeight: "3rem",
    maxHeight: "4rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",

    "& .Mui-TableHeadCell-Content": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      textWrap: "balance",
    },
    "& .Mui-TableHeadCell-Content-Labels": { padding: 0 },
    "& .Mui-TableHeadCell-Content-Actions": { display: "none" },
    "& .Mui-TableHeadCell-ResizeHandle-Wrapper": {
      borderWidth: "1px",
      background: "none",
      marginRight: "-10px",
      borderColor: "rgba(75, 75, 75, .1)",
    },
  },
};
