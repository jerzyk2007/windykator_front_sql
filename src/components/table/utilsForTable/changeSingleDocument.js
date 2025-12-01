export const filteredArrayManagement = (data) => {
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

export const changeSingleDoc = (data) => {
  data.JAKA_KANCELARIA = data.JAKA_KANCELARIA ? data.JAKA_KANCELARIA : "BRAK";
  data.JAKA_KANCELARIA_TU = data.JAKA_KANCELARIA_TU
    ? data.JAKA_KANCELARIA_TU
    : "BRAK";
  data.BLAD_DORADCY = data.BLAD_DORADCY ? data.BLAD_DORADCY : "NIE";
  data.DZIALANIA = data.DZIALANIA ? data.DZIALANIA : "BRAK";
  data.POBRANO_VAT = data.POBRANO_VAT ? data.POBRANO_VAT : "Nie dotyczy";
  data.INFORMACJA_ZARZAD = Array.isArray(data.INFORMACJA_ZARZAD)
    ? filteredArrayManagement(data.INFORMACJA_ZARZAD)
    : "BRAK";
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
  return data;
};

export const changeSingleDocLawPartner = (data) => {
  data.OPIS_DOKUMENTU = data?.OPIS_DOKUMENTU ? data.OPIS_DOKUMENTU : "BRAK";
  data.CZAT_KANCELARIA = data?.CZAT_KANCELARIA ? data.CZAT_KANCELARIA : "BRAK";
  return data;
};
