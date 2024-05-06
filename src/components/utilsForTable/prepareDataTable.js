export const prepareDataTable = (tableData) => {
  const update = tableData.map((item) => {
    // const dateObj = new Date(item.DATA_FV);
    // const day = dateObj.getDate().toString().padStart(2, "0");
    // const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Dodajemy 1, bo miesiące są numerowane od 0 do 11
    // const year = dateObj.getFullYear();
    // const formattedDate = `${day}.${month}.${year}`;
    // item.DATA_FV = formattedDate;
    // console.log(formattedDate);

    // item.DATA_FV = new Date(item.DATA_FV);

    // item.TERMIN = localizedDate;

    if (!item.DATA_FV) {
      //   console.log(item);
    }
    // return {
    //   NUMER_FV: item.NUMER_FV,
    //   "50_VAT": item["50_VAT"],
    //   "100_VAT": item["100_VAT"],
    //   ASYSTENTKA: item.ASYSTENTKA,
    //   DATA_FV: item.DATA_FV,
    //   TERMIN: item.TERMIN,
    //   DZIAL: item.DZIAL,
    //   //   BLAD_DORADCY: item.BLAD_DORADCY,
    //   //   BLAD_W_DOKUMENTACJI: item.BLAD_W_DOKUMENTACJI,
    //   //   BRUTTO: item.BRUTTO,
    // };
    // console.log(item);
    // item.ASYSTENTKA = "test";
    // if (!item.ASYSTENTKA || item.ASYSTENTKA === "") {
    //   //   item.DO_ROZLICZENIA_AS = "NULL";
    //   console.log(item);
    // }

    // if (item.JAKA_KANCELARIA === " ") {
    //   item.JAKA_KANCELARIA = "NIE DOTYCZY";
    // }

    // if (item.KWOTA_WPS) {
    //   item.KWOTA_WPS = Number(item.KWOTA_WPS);
    // }

    // if (!item.KWOTA_WPS) {
    //   item.KWOTA_WPS = 0;
    // }

    // if (item.RODZAJ_KONTA) {
    //   item.RODZAJ_KONTA = String(item.RODZAJ_KONTA);
    // }

    // if (!item.ROZNICA) {
    //   item.ROZNICA = 0;
    // }

    // if (item.DATA_WYSTAWIENIA_FV === "1900-01-01") {
    //   item.DATA_WYSTAWIENIA_FV = "brak danych";
    // }
    // if (item.DATA_WYSTAWIENIA_FV) {
    //   item.DATA_WYSTAWIENIA_FV = new Date(item.DATA_WYSTAWIENIA_FV);
    // }
    // if (item.TERMIN_PLATNOSCI_FV) {
    //   item.TERMIN_PLATNOSCI_FV = new Date(item.TERMIN_PLATNOSCI_FV);
    // }

    // if (item.OWNER) {
    //   // Jeśli item.OWNER istnieje i nie jest pusty, możemy przeprowadzić odpowiednie formatowanie
    //   const cellValue = item.OWNER;

    //   // Sprawdzamy, czy wartość jest tablicą i czy zawiera co najmniej jeden element
    //   if (Array.isArray(cellValue) && cellValue.length > 0) {
    //     // Tworzymy pojedynczy ciąg tekstu, łącząc wszystkie elementy tablicy
    //     const combinedText = cellValue.join(" - ");
    //     // Aktualizujemy wartość item.OWNER na sformatowany ciąg tekstu
    //     item.OWNER = combinedText;
    //   }
    //   // Jeśli wartość item.OWNER nie jest tablicą lub jest pusta, nie zmieniamy jej
    // }

    // if (item.OPIEKUN_OBSZARU_CENTRALI) {
    //   // Jeśli item.OWNER istnieje i nie jest pusty, możemy przeprowadzić odpowiednie formatowanie
    //   const cellValue = item.OPIEKUN_OBSZARU_CENTRALI;

    //   // Sprawdzamy, czy wartość jest tablicą i czy zawiera co najmniej jeden element
    //   if (Array.isArray(cellValue) && cellValue.length > 0) {
    //     // Tworzymy pojedynczy ciąg tekstu, łącząc wszystkie elementy tablicy
    //     const combinedText = cellValue.join(" - ");
    //     // Aktualizujemy wartość item.OWNER na sformatowany ciąg tekstu
    //     item.OPIEKUN_OBSZARU_CENTRALI = combinedText;
    //   }
    //   // Jeśli wartość item.OWNER nie jest tablicą lub jest pusta, nie zmieniamy jej
    // }

    return item;
  });
  return update;
};
