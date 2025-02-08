import XLSX from "xlsx-js-style";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";


const columnsOrder = [
  "TYP DOKUMENTU",
  "NR DOKUMENTU",
  "DZIAŁ",
  "LOKALIZACJA",
  "KONTRAHENT",
  "KONTROLA",
  "POZOSTAŁA KWOTA DO ROZLICZENIA W FK",
  "POZOSTAŁA KWOTA DO ROZLICZENIA W AS3",
  "RÓŻNICA MIĘDZY FK A AS3",
  "HISTORIA DECYZJI",
  "DECYZJA BIZNES",
  "OSTATECZNA DATA ROZLICZENIA",
  "ILE ZMIAN OST DATY ROZL.",
  "DATA ROZLICZENIA AS",
  "OPIS ROZRACHUNKU",
  "DATA WYSTAWIENIA FAKTURY",
  "BRAK DATY WYSTAWIENIA FV",
  "TERMIN PŁATNOŚCI FV",
  "PRZEDZIAŁ WIEKOWANIE",
  "ILE DNI NA PLATNOŚĆ NA FV",
  "KONTO",
  "PRZETERMINOWANE / NIEPRZETERMINOWANE",
  "JAKA KANCELARIA",
  "ETAP SPRAWY",
  "KWOTA WPS",
  "CZY KANCELARIA TAK/ NIE",
  "OBSZAR",
  "NR VIN",
  "CZY SAMOCHÓD WYDANY TAK/NIE",
  "DATA WYDANIA AUTA W AS3",
  "OWNER",
  "NR KLIENTA",
  "OPIEKUN OBSZARU CENTRALI",
];

const columnsName = [
  {
    accessorKey: "TYP_DOKUMENTU",
    header: "TYP DOKUMENTU"
  },
  {
    accessorKey: "NR_DOKUMENTU",
    header: "NR DOKUMENTU"
  },
  {
    accessorKey: "DZIAL",
    header: "DZIAŁ"
  },
  {
    accessorKey: "LOKALIZACJA",
    header: "LOKALIZACJA"
  },
  {
    accessorKey: "KONTRAHENT",
    header: "KONTRAHENT"
  },
  {
    accessorKey: "KWOTA_DO_ROZLICZENIA_FK",
    header: "POZOSTAŁA KWOTA DO ROZLICZENIA W FK"
  },
  {
    accessorKey: "DO_ROZLICZENIA_AS",
    header: "POZOSTAŁA KWOTA DO ROZLICZENIA W AS3"
  },
  {
    accessorKey: "ROZNICA",
    header: "RÓŻNICA MIĘDZY FK A AS3"
  },
  {
    accessorKey: "KONTROLA_DOC",
    header: "KONTROLA"
  },
  {
    accessorKey: "INFORMACJA_ZARZAD",
    header: "DECYZJA BIZNES"
  },
  {
    accessorKey: "OSTATECZNA_DATA_ROZLICZENIA",
    header: "OSTATECZNA DATA ROZLICZENIA"
  },
  {
    accessorKey: "HISTORIA_ZMIANY_DATY_ROZLICZENIA",
    header: "ILE ZMIAN OST DATY ROZL."
  },
  {
    accessorKey: "DATA_ROZLICZENIA_AS",
    header: "DATA ROZLICZENIA AS"
  },
  {
    accessorKey: "OPIS_ROZRACHUNKU",
    header: "OPIS ROZRACHUNKU"
  },
  {
    accessorKey: "DATA_WYSTAWIENIA_FV",
    header: "DATA WYSTAWIENIA FAKTURY"
  },
  {
    accessorKey: "BRAK_DATY_WYSTAWIENIA_FV",
    header: "BRAK DATY WYSTAWIENIA FV"
  },
  {
    accessorKey: "TERMIN_PLATNOSCI_FV",
    header: "TERMIN PŁATNOŚCI FV"
  },
  {
    accessorKey: "PRZEDZIAL_WIEKOWANIE",
    header: "PRZEDZIAŁ WIEKOWANIE"
  },
  {
    accessorKey: "ILE_DNI_NA_PLATNOSC_FV",
    header: "ILE DNI NA PLATNOŚĆ NA FV"
  },
  {
    accessorKey: "RODZAJ_KONTA",
    header: "KONTO"
  },
  {
    accessorKey: "PRZETER_NIEPRZETER",
    header: "PRZETERMINOWANE / NIEPRZETERMINOWANE"
  },
  {
    accessorKey: "JAKA_KANCELARIA",
    header: "JAKA KANCELARIA"
  },
  {
    accessorKey: "ETAP_SPRAWY",
    header: "ETAP SPRAWY"
  },
  {
    accessorKey: "KWOTA_WPS",
    header: "KWOTA WPS"
  },
  {
    accessorKey: "CZY_W_KANCELARI",
    header: "CZY KANCELARIA TAK/ NIE"
  },
  {
    accessorKey: "OBSZAR",
    header: "OBSZAR"
  },
  {
    accessorKey: "VIN",
    header: "NR VIN"
  },
  {
    accessorKey: "CZY_SAMOCHOD_WYDANY_AS",
    header: "CZY SAMOCHÓD WYDANY TAK/NIE"
  },
  {
    accessorKey: "DATA_WYDANIA_AUTA",
    header: "DATA WYDANIA AUTA W AS3"
  },
  {
    accessorKey: "OWNER",
    header: "OWNER"
  },
  {
    accessorKey: "NR_KLIENTA",
    header: "NR KLIENTA"
  },
  {
    accessorKey: "OPIEKUN_OBSZARU_CENTRALI",
    header: "OPIEKUN OBSZARU CENTRALI"
  },
  {
    accessorKey: "HISTORIA_WPISÓW_W_RAPORCIE",
    header: "HISTORIA DECYZJI"
  },
];

// wersja bez dodatkowych wierszy nad tabelą
export const getExcelRaport = async (cleanData, settingsColumn) => {
  try {

    const changeNameColumns = cleanData.map((doc) => {
      const update = doc.data.map((item) => {
        const newItem = {};
        // for (const column of settingsColumn.columns) {
        for (const column of columnsName) {
          // Sprawdzanie, czy klucz w obiekcie z cleanData.data odpowiada kluczowi accessorKey z obiektu z settingsColumn.data
          if (item[column.accessorKey] !== undefined) {
            // Jeśli klucze są zgodne, podmień nazwę klucza na header z obiektu z settingsColumn.data
            newItem[column.header] = item[column.accessorKey];
          } else {
            // Jeśli klucz nie istnieje w obiekcie z cleanData.data, kopiuj go do nowego obiektu bez zmian
            newItem[column.accessorKey] = item[column.accessorKey];
          }
        }
        return newItem;
      });
      return {
        name: doc.name,
        data: update,
      };
    });

    const wb = XLSX.utils.book_new();
    try {
      changeNameColumns.forEach((obj) => {
        // Przearanżowanie kolumn w odpowiedniej kolejności
        const reorderedData = obj.data.map((item) => {
          const reorderedItem = {};
          columnsOrder.forEach((key) => {
            if (item[key] !== undefined) {
              reorderedItem[key] = item[key];
            }
          });
          return reorderedItem;
        });
        // Tworzenie arkusza kalkulacyjnego z przearanżowanymi danymi
        const ws = XLSX.utils.json_to_sheet(reorderedData);

        // Dodawanie arkusza kalkulacyjnego do arkusza roboczego
        XLSX.utils.book_append_sheet(wb, ws, obj.name);

        // Zastosowanie filtrów do wszystkich kolumn
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cell = XLSX.utils.encode_cell({ r: 0, c: col });
          ws[cell].s = { ...ws[cell].s, font: { bold: true } }; // Dodanie pogrubienia do nagłówków kolumn
        }

        // Ustawienie szerokości kolumny
        for (let i = range.s.c; i <= range.e.c; i++) {
          const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
          ws["!cols"] = ws["!cols"] || [];
          ws["!cols"][i] = { wch: 22 }; // Ustawienie szerokości kolumny domyślnie na 20
        }

        // Ustawienie szerokości kolumny na 30, jeśli zawartość komórki wymaga zawijania tekstu
        for (let row = range.s.r; row <= range.e.r; row++) {
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cell = XLSX.utils.encode_cell({ r: row, c: col });
            if (ws[cell] && ws[cell].v && typeof ws[cell].v === "string") {
              const cellWidth = ws[cell].v.length * 8; // Przybliżona szerokość znaku
              if (cellWidth > 240) {
                // 240 to przybliżona szerokość dla 30 znaków
                ws["!cols"][col] = { wch: 30 }; // Ustawienie szerokości kolumny na 30
              }
            }
          }
        }

        // Dodanie filtrów
        ws["!autofilter"] = { ref: XLSX.utils.encode_range(range) };

        // Ustawienie koloru żółtego dla pierwszego wiersza
        const firstRowRange = XLSX.utils.decode_range(ws["!ref"]);
        for (let col = firstRowRange.s.c; col <= firstRowRange.e.c; col++) {
          const cell = XLSX.utils.encode_cell({ r: 0, c: col });
          ws[cell].s = {
            ...ws[cell].s,
            fill: { fgColor: { rgb: "B8B8B8" } },
            alignment: {
              wrapText: true,
              vertical: "center",
              horizontal: "center",
            },
            border: {
              top: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
              bottom: { style: "thin" },
            },
          }; // Ustawienie koloru żółtego
        }

        // Dodanie obramowania dla wszystkich komórek z danymi
        // for (let row = range.s.r + 1; row <= range.e.r; row++) {
        //   for (let col = range.s.c; col <= range.e.c; col++) {
        //     const cell = XLSX.utils.encode_cell({ r: row, c: col });
        //     ws[cell].s = {
        //       ...ws[cell].s,
        //       border: {
        //         top: { style: "thin" },
        //         left: { style: "thin" },
        //         bottom: { style: "thin" },
        //         right: { style: "thin" },
        //       },
        //       alignment: {
        //         wrapText: true,
        //         vertical: "center",
        //         horizontal: "center",
        //       },
        //       numFmt: "# ##0.00 zł",
        //     };
        //     // ws[cell].s = {
        //     //   ...ws[cell].s,
        //     //   alignment: {
        //     //     wrapText: true,
        //     //     vertical: "center",
        //     //     horizontal: "center",
        //     //   },
        //     //   numFmt: "# ##0.00 zł",
        //     // };
        //   }
        // }

        // Dodanie obramowania dla wszystkich komórek z danymi
        for (let row = range.s.r + 1; row <= range.e.r; row++) {
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cell = XLSX.utils.encode_cell({ r: row, c: col });
            if (ws[cell]) {
              ws[cell].s = {
                ...ws[cell].s,
                border: {
                  top: { style: "thin" },
                  left: { style: "thin" },
                  bottom: { style: "thin" },
                  right: { style: "thin" },
                },
                alignment: {
                  wrapText: true,
                  vertical: "center",
                  horizontal: "center",
                },
                // numFmt: "# ##0.00 zł",
                numFmt: "#,##0.00 zł"
              };
            }
          }
        }
        //test
        // Przechodzenie przez wszystkie wiersze i sprawdzanie długości tekstu w komórkach
        for (let row = range.s.r; row <= range.e.r; row++) {
          let rowHeight = 45; // Domyślna wysokość wiersza
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cell = XLSX.utils.encode_cell({ r: row, c: col });
            if (ws[cell] && ws[cell].v && typeof ws[cell].v === "string") {
              const cellWidth = ws[cell].v.length * 8; // Przybliżona szerokość znaku
              if (cellWidth > 240) {
                // Jeśli szerokość tekstu przekracza 240 (przybliżona szerokość dla 30 znaków), zwiększ wysokość wiersza
                rowHeight = 30; // Ustawienie większej wysokości
                break; // Przerwanie pętli, gdy tylko jeden warunek zostanie spełniony
              }
            }
          }
          // Ustawienie wysokości wiersza dla danego wiersza
          // const rowObject = XLSX.utils.encode_row(row);
          // ws["!rows"] = ws["!rows"] || [];
          // ws["!rows"][rowObject] = {
          //   // hpt: rowHeight * 0.75, // Konwersja pikseli na punkty (1 piksel ≈ 0.75 punkta)
          //   // hpt: rowHeight, // Konwersja pikseli na punkty (1 piksel ≈ 0.75 punkta)
          //   // hpx: rowHeight * 2,
          // };
        }
      });

      // Zapisywanie arkusza roboczego do pliku
      XLSX.writeFile(wb, "Raport.xlsx", { compression: true });
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
};

// wersja bez dodatkowych wierszy nad tabelą

// export const getExcelRaportV2 = async (cleanData) => {
//   try {
//     const changeNameColumns = cleanData.map((doc) => {
//       const update = doc.data.map((item) => {
//         const newItem = {};
//         for (const column of columnsName) {
//           if (item[column.accessorKey] !== undefined) {
//             newItem[column.header] = item[column.accessorKey];
//           } else {
//             newItem[column.accessorKey] = item[column.accessorKey];
//           }
//         }
//         return newItem;
//       });
//       return {
//         name: doc.name,
//         data: update,
//       };
//     });

//     const workbook = new ExcelJS.Workbook();

//     changeNameColumns.forEach((sheet) => {
//       const worksheet = workbook.addWorksheet(sheet.name);

//       if (sheet.data && sheet.data.length > 0) {
//         // Dodaj 5 pustych wierszy na początku arkusza
//         for (let i = 0; i < 5; i++) {
//           worksheet.addRow([]);
//         }

//         // Użyj tablicy columnsOrder, aby uporządkować nagłówki
//         const headers = columnsOrder.filter((column) =>
//           sheet.data[0].hasOwnProperty(column)
//         );

//         // Dodaj nagłówki w 6. wierszu, z kolumną 'Lp' na początku
//         worksheet.addRow(['Lp', ...headers]);

//         // Dodaj dane z każdego obiektu jako wiersze, zaczynając od 1 w kolumnie 'Lp'
//         sheet.data.forEach((row, index) => {
//           const rowData = [index + 1, ...headers.map((header) => row[header] || '')]; // Dodaj numer porządkowy
//           worksheet.addRow(rowData);
//         });

//         // Stylizowanie nagłówków
//         worksheet.getRow(6).font = { bold: true };



//         // Stylizowanie kolumn na podstawie ich nazw, pomijając 'Lp'
//         headers.forEach((header, columnIndex) => {
//           const column = worksheet.getColumn(columnIndex + 2); // Kolumna 'Lp' ma indeks 1, więc zaczynamy od 2
//           if (header === 'Lp') {
//             return; // Ignorujemy kolumnę 'Lp' przy stylizacji
//           }
//           // Przykładowe stylizowanie kolumn na podstawie nazw
//           // if (header === 'TYP DOKUMENTU') {
//           //   column.font = { bold: true, color: { argb: 'FF0000' } }; // Czerwony tekst, pogrubiony
//           //   column.alignment = { horizontal: 'center' };
//           //   column.width = 20;
//           // }
//           if (header === 'TYP DOKUMENTU') {
//             // Czerwony tekst, pogrubiony
//             column.alignment = { horizontal: 'center' };
//             column.width = 20;
//           }

//           else if (header === 'NR DOKUMENTU') {
//             // Zielony tekst, kursywa
//             column.alignment = { horizontal: 'left' };
//             column.width = 25;
//           } else if (header === 'DATA ROZLICZENIA AS') {
//             column.numFmt = 'yyyy-mm-dd'; // Formatowanie daty
//             column.alignment = { horizontal: 'center' };
//             column.width = 18;
//           } else if (header === 'KONTRAHENT') {

//             column.alignment = {
//               horizontal: 'center',
//               wrapText: true // Dodaj zawijanie tekstu
//             };
//             column.width = 30;
//           }

//           else {
//             column.alignment = { horizontal: 'left' };
//             column.width = 15;
//           }
//         });

//         // Blokowanie 5 pierwszych wierszy, aby wiersz 6 (nagłówki) został widoczny
//         worksheet.views = [
//           {
//             state: 'frozen',
//             xSplit: 0,
//             ySplit: 6, // Zablokowanie do wiersza 6, aby nagłówki zostały widoczne
//             topLeftCell: 'A7',
//             activeCell: 'A7',
//           },
//         ];
//       }
//     });

//     // Zapisz plik Excel
//     workbook.xlsx.writeBuffer().then((buffer) => {
//       saveAs(new Blob([buffer]), 'example.xlsx');
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };


export const getExcelRaportV2 = async (cleanData, raportInfo) => {

  // od którego wiersza mają się zaczynać dane w arkuszu
  const startRow = 6;
  try {
    const changeNameColumns = cleanData.map((doc) => {
      const update = doc.data.map((item) => {
        const newItem = {};
        for (const column of columnsName) {
          if (item[column.accessorKey] !== undefined) {
            newItem[column.header] = item[column.accessorKey];
          } else {
            newItem[column.accessorKey] = item[column.accessorKey];
          }
        }
        return newItem;
      });
      return {
        name: doc.name,
        data: update,
      };
    });

    const workbook = new ExcelJS.Workbook();

    changeNameColumns.forEach((sheet) => {
      const worksheet = workbook.addWorksheet(sheet.name);

      if (sheet.data && sheet.data.length > 0) {
        // Dodaj 5 pustych wierszy na początku arkusza
        for (let i = 0; i < startRow - 1; i++) {
          worksheet.addRow([]);
        }

        // Użyj tablicy columnsOrder, aby uporządkować nagłówki
        const headers = columnsOrder.filter((column) =>
          sheet.data[0].hasOwnProperty(column)
        );

        // Dodaj nagłówki w 6. wierszu, z kolumną 'Lp' na początku
        worksheet.addRow(['Lp', ...headers]);

        // Dodaj dane z każdego obiektu jako wiersze, zaczynając od 1 w kolumnie 'Lp'
        sheet.data.forEach((row, index) => {
          const rowData = [index + 1, ...headers.map((header) => row[header] || '')]; // Dodaj numer porządkowy
          worksheet.addRow(rowData);
        });

        // Stylizowanie nagłówków
        const headerRow = worksheet.getRow(startRow);
        headerRow.font = { bold: true, size: 10 }; // Ustawienie pogrubionej czcionki o rozmiarze 10
        headerRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        headerRow.eachCell((cell) => {
          cell.font = { bold: true, size: 10 };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'cacaca' }, // Kolor tła (np. żółty)
          };
        });


        // Stylizacja dla kolumny 'Lp'
        const lpColumn = worksheet.getColumn(1); // Kolumna 'Lp' to zawsze pierwsza kolumna
        lpColumn.width = 10; // Szerokość kolumny
        lpColumn.alignment = { horizontal: 'center', vertical: 'middle' }; // Wyśrodkowanie

        // Stylizowanie kolumn na podstawie ich nazw, pomijając 'Lp'
        headers.forEach((header, columnIndex) => {
          const column = worksheet.getColumn(columnIndex + 2); // Kolumna 'Lp' ma indeks 1, więc zaczynamy od 2
          const headerCell = worksheet.getCell(startRow, columnIndex + 2);
          headerCell.font = { bold: true }; // Pogrubienie czcionki
          headerCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          const excelStartRow = startRow + 1;
          const excelEndRow = worksheet.rowCount;
          column.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          column.width = 15;

          const extraCellBorder = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };

          // Stylizacja dla różnych kolumn
          if (header === 'TYP DOKUMENTU') {
            column.width = 20;
            const countCell1 = worksheet.getCell(1, column.number);
            countCell1.value = "Data zestawienia:";
            countCell1.border = extraCellBorder;

            const countCell2 = worksheet.getCell(2, column.number);
            countCell2.value = "Wiekowanie na dzień:";
            countCell2.border = extraCellBorder;

            const countCell3 = worksheet.getCell(3, column.number);
            countCell3.value = "Nazwa zestawienia:";
            countCell3.border = extraCellBorder;
          }

          else if (header === 'NR DOKUMENTU') {
            headerCell.alignment = { horizontal: 'center', vertical: 'middle' };
            headerCell.font = { bold: true }; // Pogrubienie czcionki
            column.width = 25;
            // Wstawienie liczby dokumentów w wierszu 4 tej kolumny
            const countCell = worksheet.getCell(5, column.number);
            countCell.value = { formula: `SUBTOTAL(103,G${excelStartRow}:G${excelEndRow})` };
            countCell.numFmt = '0'; // Formatowanie liczby
            countCell.font = { bold: true }; // Pogrubienie tekstu
            countCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Wyrównanie tekstu
            countCell.border = extraCellBorder;
            countCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFF00' }, // Żółte tło dla wyróżnienia
            };

            const countCell1 = worksheet.getCell(1, column.number);
            countCell1.value = raportInfo.reportDate;
            countCell1.alignment = { horizontal: 'center', vertical: 'middle' };
            countCell1.border = extraCellBorder;

            const countCell2 = worksheet.getCell(2, column.number);
            countCell2.value = raportInfo.agingDate;
            countCell2.alignment = { horizontal: 'center', vertical: 'middle' };
            countCell2.border = extraCellBorder;

            const countCell3 = worksheet.getCell(3, column.number);
            countCell3.value = raportInfo.reportName;
            countCell3.alignment = { horizontal: 'center', vertical: 'middle' };
            countCell3.border = extraCellBorder;

          }
          else if (header === 'LOKALIZACJA') {
            column.width = 18;
          }
          else if (header === 'KONTRAHENT') {
            column.width = 30;
          }
          else if (header === 'POZOSTAŁA KWOTA DO ROZLICZENIA W FK') {
            column.width = 20;
            column.numFmt = '#,##0.00';
            headerCell.fill = {
              type: 'pattern', // Wzór wypełnienia
              pattern: 'solid', // Wypełnienie jednolite
              fgColor: { argb: '8ac777' },
            };

            // Wstawienie sumy w wierszu 4 tej kolumny
            const sumCell = worksheet.getCell(5, column.number); // Wiersz 4, odpowiednia kolumna
            sumCell.value = { formula: `SUBTOTAL(109,G${excelStartRow}:G${excelEndRow})` };// Ustawienie wartości sumy
            sumCell.numFmt = '#,##0.00 zł'; // Formatowanie liczby
            sumCell.font = { bold: true }; // Pogrubienie tekstu
            sumCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Wyrównanie tekstu
            sumCell.border = extraCellBorder;
            sumCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFF00' }, // Żółte tło dla wyróżnienia
            };
          }
          else if (header === 'KONTROLA') {

            headerCell.fill = {
              type: 'pattern', // Wzór wypełnienia
              pattern: 'solid', // Wypełnienie jednolite
              fgColor: { argb: 'fd87f7' },
            };
          }
          else if (header === 'POZOSTAŁA KWOTA DO ROZLICZENIA W AS3') {
            // column.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }; // Zawijanie tekstu
            column.width = 20;
            column.numFmt = '#,##0.00';
            headerCell.fill = {
              type: 'pattern', // Wzór wypełnienia
              pattern: 'solid', // Wypełnienie jednolite
              fgColor: { argb: '77a3c7' },
            };

            // Wstawienie sumy w wierszu 4 tej kolumny
            const sumCell = worksheet.getCell(5, column.number); // Wiersz 4, odpowiednia kolumna
            // sumCell.value = sum; // Ustawienie wartości sumy
            sumCell.value = { formula: `SUBTOTAL(109,H${excelStartRow}:H${excelEndRow})` };
            sumCell.numFmt = '#,##0.00 zł'; // Formatowanie liczby
            sumCell.font = { bold: true }; // Pogrubienie tekstu
            sumCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Wyrównanie tekstu
            sumCell.border = extraCellBorder;
            sumCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFF00' }, // Żółte tło dla wyróżnienia
            };
          }
          else if (header === 'RÓŻNICA MIĘDZY FK A AS3') {
            // column.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }; // Zawijanie tekstu
            column.width = 20;
            column.numFmt = '#,##0.00';
            headerCell.fill = {
              type: 'pattern', // Wzór wypełnienia
              pattern: 'solid', // Wypełnienie jednolite
              fgColor: { argb: 'ff0000' },
            };

            // Wstawienie sumy w wierszu 4 tej kolumny
            const sumCell = worksheet.getCell(5, column.number); // Wiersz 4, odpowiednia kolumna
            // sumCell.value = sum; // Ustawienie wartości sumy
            sumCell.value = { formula: `SUBTOTAL(109,I${excelStartRow}:I${excelEndRow})` };
            sumCell.numFmt = '#,##0.00 zł'; // Formatowanie liczby
            sumCell.font = { bold: true }; // Pogrubienie tekstu
            sumCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Wyrównanie tekstu
            sumCell.border = extraCellBorder;
            sumCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFF00' }, // Żółte tło dla wyróżnienia
            };
          }

          else if (header === 'HISTORIA DECYZJI') {
            column.width = 40;
            headerCell.fill = {
              type: 'pattern', // Wzór wypełnienia
              pattern: 'solid', // Wypełnienie jednolite
              fgColor: { argb: 'fd87f7' },
            };
          }
          else if (header === 'DECYZJA BIZNES') {
            column.width = 45;
            headerCell.fill = {
              type: 'pattern', // Wzór wypełnienia
              pattern: 'solid', // Wypełnienie jednolite
              fgColor: { argb: 'ff5b63' },
            };
          }
          else if (header === 'DATA ROZLICZENIA AS') {
            column.numFmt = 'yyyy-mm-dd'; // Formatowanie daty
            column.width = 18;
          }
          else if (header === 'OPIS ROZRACHUNKU') {
            column.width = 35;
          }

          else if (header === 'DATA WYSTAWIENIA FAKTURY') {
            column.numFmt = 'yyyy-mm-dd'; // Formatowanie daty
          }
          else if (header === 'TERMIN PŁATNOŚCI FV') {
            column.numFmt = 'yyyy-mm-dd'; // Formatowanie daty
          }
          else if (header === 'ILE DNI NA PLATNOŚĆ NA FV') {
            column.numFmt = '0';
          }
          else if (header === 'KONTO') {
            column.numFmt = '0';
          }
          else if (header === 'PRZETERMINOWANE / NIEPRZETERMINOWANE') {
            column.width = 20;
          }
          else if (header === 'KWOTA WPS') {
            column.numFmt = '0';
          }
          else if (header === 'DATA WYDANIA AUTA W AS3') {
            column.numFmt = 'yyyy-mm-dd'; // Formatowanie daty
          }
          else if (header === 'NR VIN') {
            column.width = 20;
          }
          else if (header === 'OWNER') {
            column.width = 20;
          }
          else if (header === 'OPIEKUN OBSZARU CENTRALI') {
            column.width = 30;
          }
        });

        worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
          // Sprawdzamy, czy jesteśmy w wierszach od 6 w górę
          if (rowIndex >= startRow) {
            row.eachCell({ includeEmpty: true }, (cell) => {
              // Jeśli to nie jest wiersz nagłówka (np. 6), zastosuj standardową stylizację
              cell.font = { size: 10 }; // Ustawienie czcionki na rozmiar 10

              // Ustawienie cienkiego obramowania dla każdej komórki
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
              };
            });
          }
        });
        headerRow.eachCell((cell) => {
          cell.font = { bold: true, size: 10 };
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

        });


        // Ustawienie autofiltrowania od wiersza 6 (nagłówki) dla całego zakresu
        worksheet.autoFilter = {
          from: 'A6', // Pierwsza kolumna (Lp)
          to: worksheet.getColumn(headers.length + 1).letter + '6', // Ostatnia kolumna na podstawie liczby kolumn
        };

        // Blokowanie 5 pierwszych wierszy, aby wiersz 6 (nagłówki) został widoczny
        worksheet.views = [
          {
            state: 'frozen',
            xSplit: 3,
            ySplit: startRow, // Zablokowanie do wiersza 6, aby nagłówki zostały widoczne
            topLeftCell: 'D7',
            activeCell: 'D7',
          },
        ];
      }
    });

    // Zapisz plik Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), 'Raport_wiekowanie_201_203.xlsx');
    });
  } catch (err) {
    console.error(err);
  }
};




export const getAllDataRaport = async (allData, XLSX, orderColumns, info) => {
  try {
    const cleanData = allData.map((item) => {
      if (item.OPIEKUN_OBSZARU_CENTRALI) {
        item.OPIEKUN_OBSZARU_CENTRALI = Array.isArray(
          item.OPIEKUN_OBSZARU_CENTRALI
        )
          ? item.OPIEKUN_OBSZARU_CENTRALI.join(", ")
          : item.OPIEKUN_OBSZARU_CENTRALI;
      }
      if (item.OPIS_ROZRACHUNKU) {
        item.OPIS_ROZRACHUNKU = Array.isArray(item.OPIS_ROZRACHUNKU)
          ? item.OPIS_ROZRACHUNKU.join(", ")
          : item.OPIS_ROZRACHUNKU;
      }
      if (item.OWNER) {
        item.OWNER = Array.isArray(item.OWNER)
          ? item.OWNER.join(", ")
          : item.OWNER;
      }
      return item;
    });

    const changeNameColumns = cleanData.map((item) => {
      const updatedItem = {};
      Object.keys(item).forEach((key) => {
        const column = orderColumns.columns.find(
          (col) => col.accessorKey === key
        );
        if (column) {
          updatedItem[column.header] = item[key];
        } else {
          updatedItem[key] = item[key];
        }
      });
      return updatedItem; // Zwracanie zaktualizowanego obiektu
    });

    const wb = XLSX.utils.book_new();

    try {
      // Przygotowanie arkusza kalkulacyjnego
      const ws = XLSX.utils.json_to_sheet(changeNameColumns);

      // Przearanżowanie kolejności kolumn
      const reorderColumns = (ws, orderColumn) => {
        const header = [];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        // Pobranie nagłówków kolumn
        if (data.length > 0) {
          for (let col = 0; col < data[0].length; col++) {
            header.push(data[0][col]);
          }

          // Przearanżowanie kolumn według orderColumn
          const reorderedHeader = orderColumn.filter((col) =>
            header.includes(col)
          );
          const reorderedData = data.map((row) => {
            const newRow = [];
            reorderedHeader.forEach((col) => {
              newRow.push(row[header.indexOf(col)]);
            });
            return newRow;
          });

          // Aktualizacja arkusza kalkulacyjnego
          XLSX.utils.sheet_add_aoa(ws, [reorderedHeader], { origin: 0 });
          reorderedData.shift(); // Usunięcie pierwszego wiersza z danymi, aby uniknąć duplikacji
          XLSX.utils.sheet_add_aoa(ws, reorderedData, { origin: 1 });
        }
      };

      // Przearanżowanie kolejności kolumn na arkuszu
      reorderColumns(ws, orderColumns.order);

      // Zastosowanie filtrów do wszystkich kolumn
      const range = XLSX.utils.decode_range(ws["!ref"]);
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell = XLSX.utils.encode_cell({ r: 0, c: col });
        ws[cell].s = { ...ws[cell].s, font: { bold: true } }; // Dodanie pogrubienia do nagłówków kolumn
      }

      // Ustawienie szerokości kolumn
      for (let i = range.s.c; i <= range.e.c; i++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
        ws["!cols"] = ws["!cols"] || [];
        ws["!cols"][i] = { wch: 22 }; // Ustawienie szerokości kolumny domyślnie na 20
      }

      // Ustawienie szerokości kolumny na 30, jeśli zawartość komórki wymaga zawijania tekstu
      for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cell = XLSX.utils.encode_cell({ r: row, c: col });
          if (ws[cell] && ws[cell].v && typeof ws[cell].v === "string") {
            const cellWidth = ws[cell].v.length * 8; // Przybliżona szerokość znaku
            if (cellWidth > 240) {
              // 240 to przybliżona szerokość dla 30 znaków
              ws["!cols"][col] = { wch: 30 }; // Ustawienie szerokości kolumny na 30
            }
          }
        }
      }

      // Dodanie filtrów
      ws["!autofilter"] = { ref: XLSX.utils.encode_range(range) };

      // Ustawienie koloru żółtego dla pierwszego wiersza
      const firstRowRange = XLSX.utils.decode_range(ws["!ref"]);
      for (let col = firstRowRange.s.c; col <= firstRowRange.e.c; col++) {
        const cell = XLSX.utils.encode_cell({ r: 0, c: col });
        ws[cell].s = {
          ...ws[cell].s,
          fill: { fgColor: { rgb: "FFFF00" } },
          alignment: {
            wrapText: true,
            vertical: "center",
            horizontal: "center",
          },
          border: {
            top: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
          },
        }; // Ustawienie koloru żółtego
      }

      // Dodanie obramowania dla wszystkich komórek z danymi
      for (let row = range.s.r + 1; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cell = XLSX.utils.encode_cell({ r: row, c: col });
          ws[cell].s = {
            ...ws[cell].s,
            border: {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            },
          };
          ws[cell].s = {
            ...ws[cell].s,
            alignment: {
              wrapText: true,
              vertical: "center",
              horizontal: "center",
            },
          };
        }
      }

      // Przechodzenie przez wszystkie wiersze i dostosowanie wysokości wiersza
      for (let row = range.s.r; row <= range.e.r; row++) {
        let rowHeight = 45; // Domyślna wysokość wiersza
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cell = XLSX.utils.encode_cell({ r: row, c: col });
          if (ws[cell] && ws[cell].v && typeof ws[cell].v === "string") {
            const cellWidth = ws[cell].v.length * 8; // Przybliżona szerokość znaku
            if (cellWidth > 240) {
              // Jeśli szerokość tekstu przekracza 240 (przybliżona szerokość dla 30 znaków), zwiększ wysokość wiersza
              rowHeight = 30; // Ustawienie większej wysokości
              break; // Przerwanie pętli, gdy tylko jeden warunek zostanie spełniony
            }
          }
        }
        // Ustawienie wysokości wiersza dla danego wiersza
        // const rowObject = XLSX.utils.encode_row(row);
        // ws["!rows"] = ws["!rows"] || [];
        // ws["!rows"][rowObject] = {
        //   hpt: rowHeight, // Konwersja pikseli na punkty (1 piksel ≈ 0.75 punkta)
        //   hpx: rowHeight * 2,
        // };
      }

      // Dodanie arkusza kalkulacyjnego do arkusza roboczego
      XLSX.utils.book_append_sheet(wb, ws, info);

      // Zapisanie arkusza roboczego do pliku
      XLSX.writeFile(wb, `${info}.xlsx`);
    } catch (err) {
      console.error(err);
    }

    // const wb = XLSX.utils.book_new();

    // try {
    //   // Tworzenie arkusza kalkulacyjnego
    //   const ws = XLSX.utils.json_to_sheet(changeNameColumns);

    //   // Zastosowanie filtrów do wszystkich kolumn
    //   const range = XLSX.utils.decode_range(ws["!ref"]);
    //   for (let col = range.s.c; col <= range.e.c; col++) {
    //     const cell = XLSX.utils.encode_cell({ r: 0, c: col });
    //     ws[cell].s = { ...ws[cell].s, font: { bold: true } }; // Dodanie pogrubienia do nagłówków kolumn
    //   }

    //   // Ustawienie szerokości kolumny
    //   for (let i = range.s.c; i <= range.e.c; i++) {
    //     const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
    //     ws["!cols"] = ws["!cols"] || [];
    //     ws["!cols"][i] = { wch: 22 }; // Ustawienie szerokości kolumny domyślnie na 20
    //   }

    //   // Ustawienie szerokości kolumny na 30, jeśli zawartość komórki wymaga zawijania tekstu
    //   for (let row = range.s.r; row <= range.e.r; row++) {
    //     for (let col = range.s.c; col <= range.e.c; col++) {
    //       const cell = XLSX.utils.encode_cell({ r: row, c: col });
    //       if (ws[cell] && ws[cell].v && typeof ws[cell].v === "string") {
    //         const cellWidth = ws[cell].v.length * 8; // Przybliżona szerokość znaku
    //         if (cellWidth > 240) {
    //           // 240 to przybliżona szerokość dla 30 znaków
    //           ws["!cols"][col] = { wch: 30 }; // Ustawienie szerokości kolumny na 30
    //         }
    //       }
    //     }
    //   }

    //   // Dodanie filtrów
    //   ws["!autofilter"] = { ref: XLSX.utils.encode_range(range) };

    //   // Ustawienie koloru żółtego dla pierwszego wiersza
    //   const firstRowRange = XLSX.utils.decode_range(ws["!ref"]);
    //   for (let col = firstRowRange.s.c; col <= firstRowRange.e.c; col++) {
    //     const cell = XLSX.utils.encode_cell({ r: 0, c: col });
    //     ws[cell].s = {
    //       ...ws[cell].s,
    //       fill: { fgColor: { rgb: "FFFF00" } },
    //     }; // Ustawienie koloru żółtego
    //   }

    //   // Dodanie obramowania dla wszystkich komórek z danymi
    //   for (let row = range.s.r + 1; row <= range.e.r; row++) {
    //     for (let col = range.s.c; col <= range.e.c; col++) {
    //       const cell = XLSX.utils.encode_cell({ r: row, c: col });
    //       ws[cell].s = {
    //         ...ws[cell].s,
    //         border: {
    //           top: { style: "thin" },
    //           left: { style: "thin" },
    //           bottom: { style: "thin" },
    //           right: { style: "thin" },
    //         },
    //       };
    //       ws[cell].s = {
    //         ...ws[cell].s,
    //         alignment: {
    //           wrapText: true,
    //           vertical: "center",
    //           horizontal: "center",
    //         },
    //       };
    //     }
    //   }

    //   // Przechodzenie przez wszystkie wiersze i dostosowanie wysokości wiersza
    //   for (let row = range.s.r; row <= range.e.r; row++) {
    //     let rowHeight = 45; // Domyślna wysokość wiersza
    //     for (let col = range.s.c; col <= range.e.c; col++) {
    //       const cell = XLSX.utils.encode_cell({ r: row, c: col });
    //       if (ws[cell] && ws[cell].v && typeof ws[cell].v === "string") {
    //         const cellWidth = ws[cell].v.length * 8; // Przybliżona szerokość znaku
    //         if (cellWidth > 240) {
    //           // Jeśli szerokość tekstu przekracza 240 (przybliżona szerokość dla 30 znaków), zwiększ wysokość wiersza
    //           rowHeight = 30; // Ustawienie większej wysokości
    //           break; // Przerwanie pętli, gdy tylko jeden warunek zostanie spełniony
    //         }
    //       }
    //     }
    //     // Ustawienie wysokości wiersza dla danego wiersza
    //     const rowObject = XLSX.utils.encode_row(row);
    //     ws["!rows"] = ws["!rows"] || [];
    //     ws["!rows"][rowObject] = {
    //       hpt: rowHeight * 0.75, // Konwersja pikseli na punkty (1 piksel ≈ 0.75 punkta)
    //       hpx: rowHeight,
    //     };
    //   }

    //   // Dodanie arkusza kalkulacyjnego do arkusza roboczego
    //   XLSX.utils.book_append_sheet(wb, ws, info);

    //   // Zapisywanie arkusza roboczego do pliku
    //   XLSX.writeFile(wb, `${info}.xlsx`);
    // } catch (err) {
    //   console.error(err);
    // }
  } catch (err) {
    console.error(err);
  }
};

