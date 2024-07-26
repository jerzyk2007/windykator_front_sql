import { subDays, format, parseISO } from "date-fns";

// Funkcja do konwersji daty z formatu Excel na "yyyy-mm-dd"
const excelDateToISODate = (excelDate) => {
  // const date = new Date((excelDate - (25567 + 1)) * 86400 * 1000); // Konwersja z formatu Excel do milisekund
  const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000); // Konwersja z formatu Excel do milisekund
  return date.toISOString().split("T")[0]; // Pobranie daty w formacie "yyyy-mm-dd"
};

// funkcja wykonuje sprawdzenie czy data jest sformatowana w excelu czy zwykły string
const isExcelDate = (value) => {
  // Sprawdź, czy wartość jest liczbą i jest większa od zera (Excelowa data to liczba większa od zera)
  if (typeof value === "number" && value > 0) {
    // Sprawdź, czy wartość mieści się w zakresie typowych wartości dat w Excelu
    return value >= 0 && value <= 2958465; // Zakres dat w Excelu: od 0 (1900-01-01) do 2958465 (9999-12-31)
  }
  return false;
};

//pobieram dane które zostały już dodane z innych plików excel (wiekowanie, wydania itp)
export const getPreparedData = async (axiosPrivateIntercept) => {
  try {
    const result = await axiosPrivateIntercept.get("/fk/get-prepared-data");
    return result.data;
  } catch (err) {
    console.error(err);
  }
};

// funkcja dla pliku wiekowanie, dekoduje nazwy działów i przypisuje wstępne defaultowe dane
export const preparedAccountancyData = async (axiosPrivateIntercept, rows) => {
  try {
    const result = await axiosPrivateIntercept.get("/fk/prepared-items");

    // jeśli nie będzie możliwe dopasowanie ownerów, lokalizacji to wyskoczy bład we froncie
    let errorDepartments = [];

    const generateDocuments = rows.map((row) => {
      const indexD = row["Nr. dokumentu"].lastIndexOf("D");
      let DZIAL_NR = "";
      if (
        indexD === -1 ||
        indexD === row["Nr. dokumentu"].length - 1 ||
        isNaN(parseInt(row["Nr. dokumentu"][indexD + 1]))
      ) {
        DZIAL_NR = "KSIĘGOWOŚĆ";
      } else {
        DZIAL_NR = row["Nr. dokumentu"].substring(indexD);
        if (DZIAL_NR.includes("/")) {
          // Jeśli tak, to usuwamy znak '/' i wszystko co po nim
          DZIAL_NR = DZIAL_NR.split("/")[0];
        }
      }

      //zmieniam długość nazwy działu na 4 znakowy, np D8 na D008
      let newNumber;

      if (DZIAL_NR && DZIAL_NR.startsWith("D") && DZIAL_NR.length < 4) {
        let number = DZIAL_NR.substring(1); // Pobieramy cyfry po literze 'D'

        // Sprawdzamy długość numeru i wstawiamy odpowiednią liczbę zer
        if (number.length === 1) {
          newNumber = "00" + number;
        } else if (number.length === 2) {
          newNumber = "0" + number;
        }

        // Zmieniamy wartość klucza 'DZIAL' na nową wartość z dodanymi zerami
        if (newNumber) {
          DZIAL_NR = "D" + newNumber;
        }
      }

      let NR_KLIENTA = 0;
      if (!isNaN(row["Nr kontrahenta"])) {
        NR_KLIENTA = Number(row["Nr kontrahenta"]);
      }

      // nadaję typ dokumentu np korekta
      let TYP_DOKUMENTU = "";
      if (row["Nr. dokumentu"].includes("KF/ZAL")) {
        TYP_DOKUMENTU = "Korekta zaliczki";
      } else if (row["Nr. dokumentu"].includes("KF/")) {
        TYP_DOKUMENTU = "Korekta";
      } else if (row["Nr. dokumentu"].includes("KP/")) {
        TYP_DOKUMENTU = "KP";
      } else if (row["Nr. dokumentu"].includes("NO/")) {
        TYP_DOKUMENTU = "Nota";
      } else if (row["Nr. dokumentu"].includes("PP/")) {
        TYP_DOKUMENTU = "Paragon";
      } else if (row["Nr. dokumentu"].includes("PK")) {
        TYP_DOKUMENTU = "PK";
      } else if (row["Nr. dokumentu"].includes("IP/")) {
        TYP_DOKUMENTU = "Karta Płatnicza";
      } else if (row["Nr. dokumentu"].includes("FV/ZAL")) {
        TYP_DOKUMENTU = "Faktura zaliczkowa";
      } else if (row["Nr. dokumentu"].includes("FV/")) {
        TYP_DOKUMENTU = "Faktura";
      } else {
        TYP_DOKUMENTU = "Inne";
      }

      // dopasowanie ownerów, lokalizacji itp
      const matchingDepItem = result.data.find(
        (preparedItem) => preparedItem.department === DZIAL_NR
      );
      let LOKALIZACJA = "";
      let OBSZAR = "";
      let OWNER = [];
      let OPIEKUN_OBSZARU_CENTRALI = [];

      if (matchingDepItem) {
        OWNER = matchingDepItem.owner;
        LOKALIZACJA = matchingDepItem.localization;
        OBSZAR = matchingDepItem.area;
        OPIEKUN_OBSZARU_CENTRALI = matchingDepItem.guardian;
      } else {
        return errorDepartments.push(DZIAL_NR);
      }

      return {
        BRAK_DATY_WYSTAWIENIA_FV: " ",
        CZY_SAMOCHOD_WYDANY_AS: " ",
        CZY_W_KANCELARI: "NIE",
        DATA_ROZLICZENIA_AS: "-",
        DATA_WYDANIA_AUTA: " ",
        DATA_WYSTAWIENIA_FV: "2000-01-01",
        DO_ROZLICZENIA_AS: 0,
        DZIAL: DZIAL_NR,
        ETAP_SPRAWY: " ",
        ILE_DNI_NA_PLATNOSC_FV: 0,
        JAKA_KANCELARIA: " ",
        KONTRAHENT: row["Kontrahent"],
        KWOTA_DO_ROZLICZENIA_FK: Number(row["Płatność"]),
        KWOTA_WPS: " ",
        LOKALIZACJA,
        NR_DOKUMENTU: row["Nr. dokumentu"],
        NR_KLIENTA,
        OBSZAR,
        OPIEKUN_OBSZARU_CENTRALI,
        OPIS_ROZRACHUNKU: [],
        OWNER,
        PRZEDZIAL_WIEKOWANIE: "-",
        PRZETER_NIEPRZETER: "NIE",
        RODZAJ_KONTA: Number(row["Synt."]),
        ROZNICA: 0,
        TERMIN_PLATNOSCI_FV: excelDateToISODate(row["Data płatn."]),
        TYP_DOKUMENTU,
      };
    });
    return { errorDepartments, generateDocuments };
  } catch (err) {
    console.error(err);
  }
};

// funkcja pobierająca dane z pliku "wydane auta"
export const preparedCarData = (rows, preparedData, setCarReleased) => {
  setCarReleased("Filtrowanie danych.");

  // usuwanie zbędnych danych, których nie ma w pliku wiekowanie
  const filteredRows = rows.filter((row) => {
    return preparedData.some((data) => data.NR_DOKUMENTU === row["NR FAKTURY"]);
  });

  //   let previousProgress = 0; // Zmienna do śledzenia poprzedniego postępu

  let counter = 0; // dopasowywanie danych po nr faktury

  const preparedDataReleasedCars = preparedData.map((item, index) => {
    const matchingItems = filteredRows.find(
      (preparedItem) => preparedItem["NR FAKTURY"] === item.NR_DOKUMENTU
    );

    // // Obliczanie postępu
    // const progress = Math.floor((index + 1) / (preparedData.length / 10)) * 10;

    // // Wyświetlanie komunikatu postępu tylko raz na każdy 10%
    // if (progress !== previousProgress && progress % 10 === 0) {
    //   setCarReleased(`Wykonano ${progress}%`);
    //   previousProgress = progress; // Aktualizacja poprzedniego postępu
    // }

    if (
      matchingItems &&
      (item.OBSZAR === "SAMOCHODY NOWE" || item.OBSZAR === "SAMOCHODY UŻYWANE")
    ) {
      const checkDate = isExcelDate(matchingItems["WYDANO"]);
      counter++;
      return {
        ...item,
        DATA_WYDANIA_AUTA: checkDate
          ? excelDateToISODate(matchingItems["WYDANO"]).toString()
          : "NULL",
        CZY_SAMOCHOD_WYDANY_AS: matchingItems["WYDANO"] ? "TAK" : " ",
      };
    } else {
      return item;
    }
  });
  return { preparedDataReleasedCars, counter };
};

// funkcja pobierająca dane z pliku Rubicon oraz z danych raportu BL
export const preparedRubiconData = async (
  rows,
  preparedData,
  setRubiconData,
  axiosPrivateIntercept
) => {
  setRubiconData("Przetwarzanie danych z pliku Rubicom.");

  // usuwanie zbędnych danych, których nie ma w pliku wiekowanie
  const filteredRows = rows.filter((row) => {
    return preparedData.some((data) => data.NR_DOKUMENTU === row["Faktura nr"]);
  });

  let counter = 0; //licznik ile spraw jest znalezionych
  const preparedCaseStatus = preparedData.map((item) => {
    const matchingSettlemnt = filteredRows.find(
      (preparedItem) => preparedItem["Faktura nr"] === item.NR_DOKUMENTU
    );

    if (matchingSettlemnt && item.OBSZAR !== "BLACHARNIA") {
      counter++;
      const status =
        matchingSettlemnt["Status aktualny"] !== "Brak działań" &&
        matchingSettlemnt["Status aktualny"] !== "Rozliczona" &&
        matchingSettlemnt["Status aktualny"] !== "sms/mail +3" &&
        matchingSettlemnt["Status aktualny"] !== "sms/mail -2" &&
        matchingSettlemnt["Status aktualny"] !== "Zablokowana" &&
        matchingSettlemnt["Status aktualny"] !== "Zablokowana BL" &&
        matchingSettlemnt["Status aktualny"] !== "Zablokowana KF" &&
        matchingSettlemnt["Status aktualny"] !== "Zablokowana KF BL"
          ? matchingSettlemnt["Status aktualny"]
          : "BRAK";

      return {
        ...item,
        ETAP_SPRAWY: status !== "BRAK" ? status : item.ETAP_SPRAWY,
        KWOTA_WPS:
          item.DO_ROZLICZENIA_AS && status !== "BRAK"
            ? item.DO_ROZLICZENIA_AS
              ? Number(item.DO_ROZLICZENIA_AS)
              : " "
            : " ",
        JAKA_KANCELARIA:
          status !== "BRAK"
            ? matchingSettlemnt["Firma zewnętrzna"]
            : item.JAKA_KANCELARIA,
        CZY_W_KANCELARI: status !== "BRAK" ? "TAK" : "NIE",
        DATA_WYSTAWIENIA_FV: matchingSettlemnt["Data faktury"]
          ? matchingSettlemnt["Data faktury"]
          : item.DATA_WYSTAWIENIA_FV,
      };
    } else if (matchingSettlemnt) {
      return {
        ...item,
        DATA_WYSTAWIENIA_FV: matchingSettlemnt["Data faktury"]
          ? matchingSettlemnt["Data faktury"]
          : item.DATA_WYSTAWIENIA_FV,
      };
    } else return item;
  });
  setRubiconData("Przetwarzanie danych z raportu BL");
  const dataFromBL = await axiosPrivateIntercept.get("/fk/get-documents-BL");

  // usuwanie zbędnych danych, których nie ma w  BL
  const filteredRowsBL = dataFromBL.data.filter((row) => {
    return preparedCaseStatus.some(
      (data) => data.NR_DOKUMENTU === row.NUMER_FV
    );
  });

  const preparedCaseStatusBL = preparedCaseStatus.map((item) => {
    const matchingSettlemnt = filteredRowsBL.find(
      (preparedItem) => preparedItem.NUMER_FV === item.NR_DOKUMENTU
    );

    if (
      matchingSettlemnt &&
      item.OBSZAR === "BLACHARNIA"
      // &&
      // (matchingSettlemnt.JAKA_KANCELARIA === "ROK-KONOPA" ||
      //   matchingSettlemnt.JAKA_KANCELARIA === "CNP" ||
      //   matchingSettlemnt.JAKA_KANCELARIA === "KRAUZE")
    ) {
      counter++;

      return {
        ...item,
        ETAP_SPRAWY:
          matchingSettlemnt.STATUS_SPRAWY_KANCELARIA &&
          matchingSettlemnt.JAKA_KANCELARIA !== "BRAK"
            ? matchingSettlemnt.STATUS_SPRAWY_KANCELARIA
            : " ",
        JAKA_KANCELARIA:
          matchingSettlemnt.JAKA_KANCELARIA !== "BRAK"
            ? matchingSettlemnt.JAKA_KANCELARIA
            : " ",
        // : "NIE DOTYCZY",
        CZY_W_KANCELARI:
          matchingSettlemnt.JAKA_KANCELARIA !== "BRAK" ? "TAK" : "NIE",
        KWOTA_WPS:
          matchingSettlemnt.KWOTA_WINDYKOWANA_BECARED &&
          matchingSettlemnt.JAKA_KANCELARIA !== "BRAK"
            ? matchingSettlemnt.KWOTA_WINDYKOWANA_BECARED
              ? Number(matchingSettlemnt.KWOTA_WINDYKOWANA_BECARED)
              : " "
            : " ",
        DATA_WYSTAWIENIA_FV: matchingSettlemnt.DATA_FV
          ? matchingSettlemnt.DATA_FV
          : item.DATA_FV,
      };
    } else {
      return item;
    }
  });

  return { preparedCaseStatusBL, counter };
};

// funkcja pobirająca dane z pliku rozlas - opis i daty rozrachunków
export const preparedSettlementData = (
  rows,
  preparedData,
  setSettlementNames
) => {
  setSettlementNames("Filtrowanie danych.");

  // usuwanie zbędnych danych, których nie ma w pliku wiekowanie
  const filteredRows = rows.filter((row) => {
    return preparedData.some((data) => data.NR_DOKUMENTU === row.NUMER);
  });

  let counter = 0;

  const preparedSettlementName = preparedData.map((item) => {
    let dateAndName = [];
    let dateSettlement = "";
    let dateFinishSettlement = "";

    const rows = filteredRows.filter((preparedItem) => {
      if (
        preparedItem.NUMER === item.NR_DOKUMENTU &&
        preparedItem.OPIS !== "NULL"
      ) {
        let currentDateFinishSettlement = isExcelDate(
          preparedItem.DataRozlAutostacja
        )
          ? excelDateToISODate(preparedItem.DataRozlAutostacja)
          : "NULL";
        const checkDate = isExcelDate(preparedItem.DataOperacji);
        const date =
          preparedItem.DataOperacji === "NULL"
            ? "BRAK"
            : checkDate
            ? excelDateToISODate(preparedItem.DataOperacji)
            : "BRAK";

        if (date !== "BRAK" && /\d{4}-\d{2}-\d{2}/.test(date)) {
          if (
            dateSettlement === "" ||
            new Date(date) > new Date(dateSettlement)
          ) {
            dateSettlement = date; // Aktualizacja dateSettlement
          }
        }

        // Sprawdzenie i przypisanie najnowszej daty do dateFinishSettlement
        if (
          currentDateFinishSettlement !== "NULL" &&
          (dateFinishSettlement === "" ||
            new Date(currentDateFinishSettlement) >
              new Date(dateFinishSettlement))
        ) {
          dateFinishSettlement = currentDateFinishSettlement;
        }

        const name = preparedItem.OPIS === "NULL" ? "BRAK" : preparedItem.OPIS;

        dateAndName.push({ date, name }); // Dodajemy obiekt do tablicy dateAndName
        return false; // Usunięcie obiektu preparedItem z tablicy rows
      }
      return true; // Zachowaj obiekt preparedItem w tablicy rows
    });

    // Sortowanie tablicy dateAndName
    dateAndName.sort((a, b) => {
      // Najpierw sortujemy obiekty bez daty lub z datą "BRAK" / "NULL" na początek
      if (a.date === "BRAK" || a.date === "NULL") return -1;
      if (b.date === "BRAK" || b.date === "NULL") return 1;

      // Sortowanie dat od najstarszej do najmłodszej
      return new Date(a.date) - new Date(b.date);
    });

    // Przekształcanie obiektów z powrotem do stringów
    dateAndName = dateAndName.map((entry) => `${entry.date} - ${entry.name}`);

    if (dateAndName.length > 0) {
      counter++;
      // Jeśli tablica nie jest pusta, przypisujemy ją do OPIS_ROZRACHUNKU
      return {
        ...item,
        OPIS_ROZRACHUNKU: dateAndName,
        DATA_ROZLICZENIA_AS: dateFinishSettlement,
      };
    } else {
      // Jeśli tablica jest pusta, przypisujemy pustą tablicę do OPIS_ROZRACHUNKU
      return {
        ...item,
        OPIS_ROZRACHUNKU: ["NULL"],
      };
    }

    // let dateAndName = [];
    // let dateSettlement = "";
    // let dateFinishSettlement = "";

    // const rows = filteredRows.filter((preparedItem) => {
    //   if (
    //     preparedItem.NUMER === item.NR_DOKUMENTU &&
    //     preparedItem.OPIS !== "NULL"
    //   ) {
    //     let currentDateFinishSettlement = isExcelDate(
    //       preparedItem.DataRozlAutostacja
    //     )
    //       ? excelDateToISODate(preparedItem.DataRozlAutostacja)
    //       : "NULL";
    //     const checkDate = isExcelDate(preparedItem.DataOperacji);
    //     const date =
    //       preparedItem.DataOperacji === "NULL"
    //         ? "BRAK"
    //         : checkDate
    //         ? excelDateToISODate(preparedItem.DataOperacji)
    //         : "BRAK";

    //     if (date !== "BRAK" && /\d{4}-\d{2}-\d{2}/.test(date)) {
    //       // Jeśli dateSettlement jest puste lub data jest większa niż dateSettlement
    //       if (
    //         dateSettlement === "" ||
    //         new Date(date) > new Date(dateSettlement)
    //       ) {
    //         dateSettlement = date; // Aktualizacja dateSettlement
    //       }
    //     }

    //     // Sprawdzenie i przypisanie najnowszej daty do dateFinishSettlement
    //     if (
    //       currentDateFinishSettlement !== "NULL" &&
    //       (dateFinishSettlement === "" ||
    //         new Date(currentDateFinishSettlement) >
    //           new Date(dateFinishSettlement))
    //     ) {
    //       dateFinishSettlement = currentDateFinishSettlement;
    //     }

    //     const name = preparedItem.OPIS === "NULL" ? "BRAK" : preparedItem.OPIS;

    //     dateAndName.push(`${date} - ${name}`); // Dodajemy do tablicy dateAndName
    //     return false; // Usunięcie obiektu preparedItem z tablicy rows
    //   }
    //   return true; // Zachowaj obiekt preparedItem w tablicy rows
    // });

    // if (dateAndName.length > 0) {
    //   counter++;
    //   // Jeśli tablica nie jest pusta, przypisujemy ją do OPIS_ROZRACHUNKU
    //   console.log(dateAndName);
    //   return {
    //     ...item,
    //     OPIS_ROZRACHUNKU: dateAndName,
    //     DATA_ROZLICZENIA_AS: dateFinishSettlement,
    //   };
    // } else {
    //   // Jeśli tablica jest pusta, przypisujemy pustą tablicę do OPIS_ROZRACHUNKU
    //   return {
    //     ...item,
    //     OPIS_ROZRACHUNKU: ["NULL"],
    //   };
    // }

    // let dateAndName = [];
    // let dateSettlement = "";
    // let dateFinishSettlement = "";

    // const rows = filteredRows.filter((preparedItem) => {
    //   if (
    //     preparedItem.NUMER === item.NR_DOKUMENTU &&
    //     preparedItem.OPIS !== "NULL"
    //   ) {
    //     dateFinishSettlement = isExcelDate(preparedItem.DataRozlAutostacja)
    //       ? excelDateToISODate(preparedItem.DataRozlAutostacja)
    //       : "NULL";
    //     const checkDate = isExcelDate(preparedItem.DataOperacji);
    //     const date =
    //       preparedItem.DataOperacji === "NULL"
    //         ? "BRAK"
    //         : checkDate
    //         ? excelDateToISODate(preparedItem.DataOperacji)
    //         : "BRAK";

    //     if (date !== "BRAK" && /\d{4}-\d{2}-\d{2}/.test(date)) {
    //       // Jeśli dateSettlement jest puste lub data jest większa niż dateSettlement
    //       if (
    //         dateSettlement === "" ||
    //         new Date(date) > new Date(dateSettlement)
    //       ) {
    //         dateSettlement = date; // Aktualizacja dateSettlement
    //       }
    //     }

    //     const name = preparedItem.OPIS === "NULL" ? "BRAK" : preparedItem.OPIS;

    //     dateAndName.push(`${date} - ${name}`); // Dodajemy do tablicy dateAndName
    //     return false; // Usunięcie obiektu preparedItem z tablicy rows
    //   }
    //   return true; // Zachowaj obiekt preparedItem w tablicy rows
    // });

    // if (dateAndName.length > 0) {
    //   counter++;
    //   // Jeśli tablica nie jest pusta, przypisujemy ją do OPIS_ROZRACHUNKU
    //   return {
    //     ...item,
    //     OPIS_ROZRACHUNKU: dateAndName,
    //     DATA_ROZLICZENIA_AS: dateFinishSettlement,
    //   };
    // } else {
    //   // Jeśli tablica jest pusta, przypisujemy pustą tablicę do OPIS_ROZRACHUNKU
    //   return {
    //     ...item,
    //     OPIS_ROZRACHUNKU: ["NULL"],
    //   };
    // }
  });

  const preparedSettlementDate = preparedSettlementName.map((item) => {
    const matchingSettlemnt = filteredRows.find(
      (preparedItem) => preparedItem.NUMER === item.NR_DOKUMENTU
    );
    if (matchingSettlemnt) {
      const checkDate = isExcelDate(matchingSettlemnt.DATA_WYSTAWIENIA);
      return {
        ...item,
        DATA_WYSTAWIENIA_FV:
          checkDate && matchingSettlemnt.DATA_WYSTAWIENIA
            ? excelDateToISODate(matchingSettlemnt.DATA_WYSTAWIENIA)
            : item.DATA_WYSTAWIENIA,
      };
    } else {
      return item;
    }
  });

  return { preparedSettlementDate, counter };
};

//   // usuwanie zbędnych danych, których nie ma w pliku wiekowanie
//wersja działająca do 26-07-2024
//   const filteredRows = rows.filter((row) => {
//     return preparedData.some((data) => data.NR_DOKUMENTU === row.NUMER);
//   });

//   let counter = 0;

//   const preparedSettlementName = preparedData.map((item) => {
//     let dateAndName = [];
//     let dateSettlement = "";
//     let dateFinishSettlement = "";

//     const rows = filteredRows.filter((preparedItem) => {
//       if (
//         preparedItem.NUMER === item.NR_DOKUMENTU &&
//         preparedItem.OPIS !== "NULL"
//       ) {
//         dateFinishSettlement = isExcelDate(preparedItem.DataRozlAutostacja)
//           ? excelDateToISODate(preparedItem.DataRozlAutostacja)
//           : "NULL";
//         const checkDate = isExcelDate(preparedItem.DataOperacji);
//         const date =
//           preparedItem.DataOperacji === "NULL"
//             ? "BRAK"
//             : checkDate
//             ? excelDateToISODate(preparedItem.DataOperacji)
//             : "BRAK";

//         if (date !== "BRAK" && /\d{4}-\d{2}-\d{2}/.test(date)) {
//           // Jeśli dateSettlement jest puste lub data jest większa niż dateSettlement
//           if (
//             dateSettlement === "" ||
//             new Date(date) > new Date(dateSettlement)
//           ) {
//             dateSettlement = date; // Aktualizacja dateSettlement
//           }
//         }

//         const name = preparedItem.OPIS === "NULL" ? "BRAK" : preparedItem.OPIS;

//         dateAndName.push(`${date} - ${name}`); // Dodajemy do tablicy dateAndName
//         return false; // Usunięcie obiektu preparedItem z tablicy rows
//       }
//       return true; // Zachowaj obiekt preparedItem w tablicy rows
//     });

//     if (dateAndName.length > 0) {
//       counter++;
//       // Jeśli tablica nie jest pusta, przypisujemy ją do OPIS_ROZRACHUNKU
//       return {
//         ...item,
//         OPIS_ROZRACHUNKU: dateAndName,
//         DATA_ROZLICZENIA_AS: dateFinishSettlement,
//       };
//     } else {
//       // Jeśli tablica jest pusta, przypisujemy pustą tablicę do OPIS_ROZRACHUNKU
//       return {
//         ...item,
//         OPIS_ROZRACHUNKU: ["NULL"],
//       };
//     }
//   });

//   const preparedSettlementDate = preparedSettlementName.map((item) => {
//     const matchingSettlemnt = filteredRows.find(
//       (preparedItem) => preparedItem.NUMER === item.NR_DOKUMENTU
//     );
//     if (matchingSettlemnt) {
//       const checkDate = isExcelDate(matchingSettlemnt.DATA_WYSTAWIENIA);
//       return {
//         ...item,
//         DATA_WYSTAWIENIA_FV:
//           checkDate && matchingSettlemnt.DATA_WYSTAWIENIA
//             ? excelDateToISODate(matchingSettlemnt.DATA_WYSTAWIENIA)
//             : item.DATA_WYSTAWIENIA,
//       };
//     } else {
//       return item;
//     }
//   });

//   return { preparedSettlementDate, counter };
// };
// export const preparedSettlementData = (
//   rows,
//   preparedData,
//   setSettlementNames
// ) => {
//   setSettlementNames("Filtrowanie danych.");

//   // usuwanie zbędnych danych, których nie ma w pliku wiekowanie
//   const filteredRows = rows.filter((row) => {
//     return preparedData.some((data) => data.NR_DOKUMENTU === row.NUMER);
//   });

//   let counter = 0;

//   const preparedSettlementName = preparedData.map((item) => {
//     let dateAndName = [];
//     let dateSettlement = "";
//     let dateFinishSettlement = '';
//     // console.log(item.DataOperacji);

//     const rows = filteredRows.filter((preparedItem) => {
//       if (
//         preparedItem.NUMER === item.NR_DOKUMENTU &&
//         preparedItem.OPIS !== "NULL"
//       ) {
//         const checkDate = isExcelDate(preparedItem.DataRozlAutostacja);
//         const date =
//           preparedItem.DataRozlAutostacja === "NULL"
//             ? "BRAK"
//             : checkDate
//             ? excelDateToISODate(preparedItem.DataRozlAutostacja)
//             : "BRAK";

//         if (date !== "BRAK" && /\d{4}-\d{2}-\d{2}/.test(date)) {
//           // Jeśli dateSettlement jest puste lub data jest większa niż dateSettlement
//           if (
//             dateSettlement === "" ||
//             new Date(date) > new Date(dateSettlement)
//           ) {
//             dateSettlement = date; // Aktualizacja dateSettlement
//           }
//         }

//         const name = preparedItem.OPIS === "NULL" ? "BRAK" : preparedItem.OPIS;

//         dateAndName.push(`${date} - ${name}`); // Dodajemy do tablicy dateAndName
//         return false; // Usunięcie obiektu preparedItem z tablicy rows
//       }
//       return true; // Zachowaj obiekt preparedItem w tablicy rows
//     });

//     if (dateAndName.length > 0) {
//       counter++;
//       // Jeśli tablica nie jest pusta, przypisujemy ją do OPIS_ROZRACHUNKU
//       return {
//         ...item,
//         OPIS_ROZRACHUNKU: dateAndName,
//         DATA_ROZLICZENIA_AS: dateSettlement ? dateSettlement : "-",
//       };
//     } else {
//       // Jeśli tablica jest pusta, przypisujemy pustą tablicę do OPIS_ROZRACHUNKU
//       return {
//         ...item,
//         OPIS_ROZRACHUNKU: ["NULL"],
//       };
//     }
//   });

//   const preparedSettlementDate = preparedSettlementName.map((item) => {
//     const matchingSettlemnt = filteredRows.find(
//       (preparedItem) => preparedItem.NUMER === item.NR_DOKUMENTU
//     );
//     if (matchingSettlemnt) {
//       const checkDate = isExcelDate(matchingSettlemnt.DATA_WYSTAWIENIA);
//       return {
//         ...item,
//         DATA_WYSTAWIENIA_FV:
//           checkDate && matchingSettlemnt.DATA_WYSTAWIENIA
//             ? excelDateToISODate(matchingSettlemnt.DATA_WYSTAWIENIA)
//             : item.DATA_WYSTAWIENIA,
//       };
//     } else {
//       return item;
//     }
//   });

//   return { preparedSettlementDate, counter };
// };

export const prepareMissedDate = (rows, preparedData, setMissedDate) => {
  setMissedDate("Filtrowanie danych.");

  // usuwanie zbędnych danych, których nie ma w pliku wiekowanie
  const filteredRows = rows.filter((row) => {
    return preparedData.some((data) => data.NR_DOKUMENTU === row["NUMER"]);
  });

  let counter = 0;

  const preparedDate = preparedData.map((item, index) => {
    const matchingItems = filteredRows.find(
      (preparedItem) => preparedItem["NUMER"] === item.NR_DOKUMENTU
    );

    if (matchingItems) {
      const checkDate = isExcelDate(matchingItems["DATA_WYSTAWIENIA"]);
      counter++;
      return {
        ...item,
        DATA_WYSTAWIENIA_FV: checkDate
          ? excelDateToISODate(matchingItems["DATA_WYSTAWIENIA"]).toString()
          : item.DATA_WYSTAWIENIA_FV,
      };
    } else {
      return item;
    }
  });
  return { preparedDate, counter };
};

export const prepareDataRaport = (data) => {
  const preparedDataSettlements = data.dataFK.map((item) => {
    const matchingSettlement = data.settlements.find(
      (preparedItem) => preparedItem.NUMER_FV === item.NR_DOKUMENTU
    );
    if (matchingSettlement && item.OBSZAR !== "BLACHARNIA") {
      return {
        ...item,
        DO_ROZLICZENIA_AS:
          item.TYP_DOKUMENTU === "Korekta zaliczki" ||
          item.TYP_DOKUMENTU === "Korekta"
            ? matchingSettlement.ZOBOWIAZANIA
              ? -matchingSettlement.ZOBOWIAZANIA
              : matchingSettlement.DO_ROZLICZENIA
            : matchingSettlement.DO_ROZLICZENIA,
        ROZNICA:
          item.TYP_DOKUMENTU === "Korekta zaliczki" ||
          item.TYP_DOKUMENTU === "Korekta"
            ? matchingSettlement.ZOBOWIAZANIA
              ? -matchingSettlement.ZOBOWIAZANIA - item.KWOTA_DO_ROZLICZENIA_FK
              : item.KWOTA_DO_ROZLICZENIA_FK - matchingSettlement.DO_ROZLICZENIA
            : item.KWOTA_DO_ROZLICZENIA_FK - matchingSettlement.DO_ROZLICZENIA,
        KWOTA_WPS: matchingSettlement.DO_ROZLICZENIA
          ? matchingSettlement.DO_ROZLICZENIA
          : " ",
      };
    } else if (matchingSettlement && item.OBSZAR === "BLACHARNIA") {
      return {
        ...item,
        DO_ROZLICZENIA_AS:
          item.TYP_DOKUMENTU === "Korekta zaliczki" ||
          item.TYP_DOKUMENTU === "Korekta"
            ? matchingSettlement.ZOBOWIAZANIA
              ? -matchingSettlement.ZOBOWIAZANIA
              : matchingSettlement.DO_ROZLICZENIA
            : matchingSettlement.DO_ROZLICZENIA,
        ROZNICA:
          item.TYP_DOKUMENTU === "Korekta zaliczki" ||
          item.TYP_DOKUMENTU === "Korekta"
            ? matchingSettlement.ZOBOWIAZANIA
              ? -matchingSettlement.ZOBOWIAZANIA - item.KWOTA_DO_ROZLICZENIA_FK
              : item.KWOTA_DO_ROZLICZENIA_FK - matchingSettlement.DO_ROZLICZENIA
            : item.KWOTA_DO_ROZLICZENIA_FK - matchingSettlement.DO_ROZLICZENIA,
      };
    } else if (item.OBSZAR === "KSIĘGOWOŚĆ") {
      return {
        ...item,
        DO_ROZLICZENIA_AS: item.KWOTA_DO_ROZLICZENIA_FK,
        ROZNICA: "NULL",
      };
    } else {
      return {
        ...item,
        DO_ROZLICZENIA_AS: 0,
        ROZNICA: item.KWOTA_DO_ROZLICZENIA_FK,
      };
    }
  });
  // dodaję wiekowanie wg wcześniej przygotowanych opcji
  const preparedDataAging = preparedDataSettlements.map((item) => {
    const todayDate = new Date();
    const documentDate = new Date(item.DATA_WYSTAWIENIA_FV);
    const documentDatePayment = new Date(item.TERMIN_PLATNOSCI_FV);
    // Różnica w milisekundach
    const differenceInMilliseconds =
      todayDate.getTime() - documentDatePayment.getTime();

    // Konwersja różnicy na dni
    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    const differenceInMillisecondsDocument =
      documentDatePayment.getTime() - documentDate.getTime();

    const differenceInDaysDocument = Math.floor(
      differenceInMillisecondsDocument / (1000 * 60 * 60 * 24)
    );

    let title = "";
    let foundMatchingAging = false;
    const preparedAging = data.aging;

    for (const age of preparedAging) {
      if (age.type === "first" && Number(age.firstValue) >= differenceInDays) {
        title = age.title;
        foundMatchingAging = true;
        break;
      } else if (
        age.type === "last" &&
        Number(age.secondValue) <= differenceInDays
      ) {
        title = age.title;
        foundMatchingAging = true;
        break;
      } else if (
        age.type === "some" &&
        Number(age.firstValue) <= differenceInDays &&
        Number(age.secondValue) >= differenceInDays
      ) {
        title = age.title;
        foundMatchingAging = true;
        break;
      }
    }

    if (!foundMatchingAging) {
    }
    return {
      ...item,
      PRZEDZIAL_WIEKOWANIE: title,
      PRZETER_NIEPRZETER:
        differenceInDays > 0 ? "Przeterminowane" : "Nieprzeterminowane",
      ILE_DNI_NA_PLATNOSC_FV: Number(differenceInDaysDocument),
    };
  });

  // do danych z pliku księgowego przypisuję wcześniej przygotowane dane działów
  const preparedDataDep = preparedDataAging.map((item) => {
    const matchingDepItem = data.items.find(
      (preparedItem) => preparedItem.department === item.DZIAL
    );

    if (matchingDepItem) {
      const { _id, ...rest } = item;
      return {
        ...rest,
        OWNER: matchingDepItem.owner,
        LOKALIZACJA: matchingDepItem.localization,
        OBSZAR: matchingDepItem.area,
        OPIEKUN_OBSZARU_CENTRALI: matchingDepItem.guardian,
      };
    } else {
      return item;
    }
  });

  const prepareDataToRaport = preparedDataDep.map((item) => {
    let KANCELARIA;

    if (item.JAKA_KANCELARIA === "M Legal Solutions") {
      KANCELARIA = "M_LEGAL";
    } else if (item.JAKA_KANCELARIA === "Inwest Inkaso") {
      KANCELARIA = "INWEST INKASO";
    } else {
      KANCELARIA = item.JAKA_KANCELARIA;
    }
    return {
      ...item,
      // CZY_SAMOCHOD_WYDANY_AS:
      //   item.CZY_SAMOCHOD_WYDANY_AS !== " "
      //     ? item.CZY_SAMOCHOD_WYDANY_AS
      //     : " ",

      //zmiana na prośbę Kasi Plewki, ma się zawsze pojawiać data rozliczenia
      DATA_ROZLICZENIA_AS:
        item.DATA_ROZLICZENIA_AS !== "-" ? item.DATA_ROZLICZENIA_AS : "NULL",
      DATA_WYDANIA_AUTA:
        item.DATA_WYDANIA_AUTA !== "-" ? item.DATA_WYDANIA_AUTA : "NULL",
      DO_ROZLICZENIA_AS:
        item.DO_ROZLICZENIA_AS !== 0 ? item.DO_ROZLICZENIA_AS : "NULL",
      JAKA_KANCELARIA: item.JAKA_KANCELARIA !== " " ? KANCELARIA : " ",
      KWOTA_WPS: item.CZY_W_KANCELARI === "NIE" ? " " : item.KWOTA_WPS,
      OPIS_ROZRACHUNKU:
        item.OPIS_ROZRACHUNKU.length > 0 ? item.OPIS_ROZRACHUNKU : ["NULL"],
      ROZNICA: item.ROZNICA !== 0 ? item.ROZNICA : "NULL",
    };
  });

  const prepareMissedDate = prepareDataToRaport.map((item) => {
    if (item.DATA_WYSTAWIENIA_FV === "2000-01-01") {
      const dateObject = parseISO(item.TERMIN_PLATNOSCI_FV);

      // Odejmij 14 dni
      const newDate = subDays(dateObject, 14);

      // Sformatuj datę z powrotem do stringa
      const formattedDate = format(newDate, "yyyy-MM-dd");

      return {
        ...item,
        BRAK_DATY_WYSTAWIENIA_FV: "TAK",
        DATA_WYSTAWIENIA_FV: formattedDate,
      };
    } else {
      return item;
    }
  });

  const convertToNumberIfPossible = (value) => {
    if (typeof value === "string" && !isNaN(value) && value.trim() !== "") {
      return parseFloat(value);
    }
    return value;
  };

  const kwotaWPSToNumber = prepareMissedDate.map((item) => {
    return {
      ...item,
      KWOTA_WPS: convertToNumberIfPossible(item.KWOTA_WPS),
    };
  });

  // return prepareMissedDate;
  return kwotaWPSToNumber;
};
