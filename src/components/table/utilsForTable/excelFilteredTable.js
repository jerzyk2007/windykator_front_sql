import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Funkcja do oczyszczania wartości (usuwa specjalne znaki i zamienia obiekty/tablice na JSON string)
const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    // Usuwanie znaków specjalnych
    return value.replace(/[&<>]/g, '');
  } else if (Array.isArray(value)) {
    // Zamiana tablicy na tekst z elementami oddzielonymi nową linią
    return value.join('\n');
  } else if (typeof value === 'object') {
    // Zamiana obiektu na JSON string
    return JSON.stringify(value);
  }
  return value;
};

export const getAllDataRaport = async (allData, orderColumns, info) => {
  const cleanData = allData.map(item => {
    return {
      ...item,
      UWAGI_ASYSTENT: Array.isArray(item.UWAGI_ASYSTENT)
        ? item.UWAGI_ASYSTENT.join("\n\n")
        : " ",
    };
  });
  const startRow = 2;
  try {
    const changeNameColumns = cleanData.map((doc) => {
      // const update = doc.map((item) => {
      const newItem = {};
      for (const column of orderColumns.columns) {
        if (doc[column.accessorKey] !== undefined) {
          newItem[column.header] = doc[column.accessorKey];
        } else {
          newItem[column.accessorKey] = doc[column.accessorKey];
        }
      }
      return newItem;
      // });
      // return {
      //   name: 'info1',
      //   data: newItem,
      // };
    });
    const newData = [
      {
        name: info,
        data: changeNameColumns,
      }
    ];

    const workbook = new ExcelJS.Workbook();

    newData.forEach((sheet) => {
      const worksheet = workbook.addWorksheet(sheet.name);

      if (sheet.data && sheet.data.length > 0) {
        // Dodaj 5 pustych wierszy na początku arkusza
        for (let i = 0; i < startRow - 1; i++) {
          worksheet.addRow([]);
        }

        // Użyj tablicy columnsOrder, aby uporządkować nagłówki
        const headers = orderColumns.order.filter((column) =>
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

          if (header === 'Faktura') {
            headerCell.alignment = { horizontal: 'center', vertical: 'middle' };
            headerCell.font = { bold: true }; // Pogrubienie czcionki
            column.width = 25;

            const sumCell = worksheet.getCell(startRow - 1, column.number); // Wiersz 4, odpowiednia kolumna

            const countCell = worksheet.getCell(startRow - 1, column.number);
            // countCell.value = { formula: `SUBTOTAL(103,B${excelStartRow}:B${excelEndRow})` };

            const columnIndex = headers.indexOf('Faktura') + 2; // Znajduje indeks kolumny (Excel używa numeracji od 1)
            const columnLetter = String.fromCharCode(64 + columnIndex); // Konwersja na literę kolumny

            sumCell.value = { formula: `SUBTOTAL(103,${columnLetter}${excelStartRow}:${columnLetter}${excelEndRow})` };

            countCell.numFmt = '0'; // Formatowanie liczby
            countCell.font = { bold: true }; // Pogrubienie tekstu
            countCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Wyrównanie tekstu
            countCell.border = extraCellBorder;
            countCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFF00' }, // Żółte tło dla wyróżnienia
            };

          }
          else if (header === 'Brutto') {
            column.numFmt = '#,##0.00';

            const sumCell = worksheet.getCell(startRow - 1, column.number); // Wiersz 4, odpowiednia kolumna
            // sumCell.value = { formula: `SUBTOTAL(109,F${excelStartRow}:F${excelEndRow})` };// 

            const columnIndex = headers.indexOf('Brutto') + 2; // Znajduje indeks kolumny (Excel używa numeracji od 1)
            const columnLetter = String.fromCharCode(64 + columnIndex); // Konwersja na literę kolumny

            sumCell.value = { formula: `SUBTOTAL(109,${columnLetter}${excelStartRow}:${columnLetter}${excelEndRow})` };

            //Ustawienie wartości sumy
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
          else if (header === 'Do rozl.') {
            column.numFmt = '#,##0.00';

            const sumCell = worksheet.getCell(startRow - 1, column.number); // Wiersz 4, odpowiednia kolumna
            // sumCell.value = { formula: `SUBTOTAL(109,F${excelStartRow}:F${excelEndRow})` };// 

            const columnIndex = headers.indexOf('Do rozl.') + 2; // Znajduje indeks kolumny (Excel używa numeracji od 1)
            const columnLetter = String.fromCharCode(64 + columnIndex); // Konwersja na literę kolumny

            sumCell.value = { formula: `SUBTOTAL(109,${columnLetter}${excelStartRow}:${columnLetter}${excelEndRow})` };

            //Ustawienie wartości sumy
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

        });

        headers.forEach((header, columnIndex) => {
          const column = worksheet.getColumn(columnIndex + 2); // Kolumna 'Lp' ma indeks 1, więc zaczynamy od 2
          const headerCell = worksheet.getCell(startRow, columnIndex + 2);

          headerCell.font = { bold: true };
          headerCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

          column.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

          // Pobranie maksymalnej długości tekstu w kolumnie (uwzględniając nagłówek)
          let maxLength = header.length;

          worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
            if (rowIndex >= startRow) { // Pomijamy nagłówki
              const cellValue = row.getCell(columnIndex + 2).value;
              if (cellValue) {
                const cellText = cellValue.toString();
                if (cellText.length > maxLength) {
                  maxLength = cellText.length;
                }
              }
            }
          });

          // Ustawienie szerokości kolumny w zakresie 15–25
          column.width = Math.max(15, Math.min(maxLength, 40));
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
          from: `A${startRow}`, // Pierwsza kolumna (Lp)
          to: worksheet.getColumn(headers.length + 1).letter + `${startRow}`, // Ostatnia kolumna na podstawie liczby kolumn
          // to: worksheet.getColumn(headers.length + 1).letter + '1', // Ostatnia kolumna na podstawie liczby kolumn
        };

        // Blokowanie 5 pierwszych wierszy, aby wiersz 6 (nagłówki) został widoczny
        worksheet.views = [
          {
            state: 'frozen',
            xSplit: 2,
            ySplit: startRow, // Zablokowanie do wiersza 6, aby nagłówki zostały widoczne
            topLeftCell: `C${startRow + 1}`,
            activeCell: `C${startRow + 1}`,
          },
        ];
      }
    });

    // Zapisz plik Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), `${info}.xlsx`);
    });

  } catch (err) {
    console.error(err);
  }
};
// export const getAllDataRaport = async (allData, orderColumns, info) => {

//   try {
//     // Tworzenie mapowania między accessorKey a header
//     const keyMapping = orderColumns.columns.reduce((acc, column) => {
//       acc[column.accessorKey] = column.header;
//       return acc;
//     }, {});

//     // Tworzenie nowego workbooka
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Dane');

//     // Pobierz wszystkie unikalne klucze z obiektów, ale z uwzględnieniem zamiany nazw
//     const allKeys = [...new Set(allData.flatMap(Object.keys))]; // Unikalne klucze jako nagłówki

//     // Mapowanie kluczy na ich nagłówki
//     const mappedHeaders = allKeys.map(key => keyMapping[key] || key); // Jeśli klucz istnieje w mapie, podmienia na header, w przeciwnym razie zostaje bez zmian

//     // Określenie kolejności kolumn na podstawie order
//     const orderedHeaders = orderColumns.order.filter(header => mappedHeaders.includes(header));

//     // Dodaj nagłówki kolumn w odpowiedniej kolejności
//     worksheet.addRow(orderedHeaders);

//     // Dodaj wiersze z danymi, zastępując brakujące wartości pustym tekstem
//     allData.forEach((data) => {
//       const row = orderedHeaders.map((header) => {
//         // Znalezienie klucza odpowiadającego nagłówkowi
//         const key = Object.keys(keyMapping).find(k => keyMapping[k] === header) || header;
//         let value = data[key] !== null && data[key] !== undefined ? data[key] : ""; // Zastąpienie null/undefined pustym tekstem
//         value = sanitizeValue(value); // Oczyszczenie wartości
//         if (typeof value === 'string' && value.length > 255) {
//           value = value.substring(0, 255); // Ograniczenie długości tekstu
//         }
//         return value;
//       });
//       worksheet.addRow(row);
//     });

//     // Formatowanie nagłówków
//     orderedHeaders.forEach((header, index) => {
//       const column = worksheet.getColumn(index + 1);
//       column.width = header.length < 22 ? 22 : header.length; // Ustaw szerokość kolumn
//       column.font = { size: 10 }; // Nagłówki pogrubione
//       column.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
//       column.numFmt = '#,##0.00';


//       if (header === 'Ile') {
//         column.numFmt = '0';
//       }
//     });

//     // Stylizacja komórek
//     worksheet.eachRow((row, rowNumber) => {
//       row.eachCell((cell) => {
//         cell.border = {
//           top: { style: "thin" },
//           left: { style: "thin" },
//           bottom: { style: "thin" },
//           right: { style: "thin" },
//         };
//         cell.font = { bold: false };

//         // Sprawdzenie, czy komórka zawiera string w formacie 'yyyy-mm-dd'
//         if (typeof cell.value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(cell.value)) {
//           // Sprawdzenie, czy string jest poprawną datą
//           const parsedDate = new Date(cell.value);

//           // Sprawdzamy, czy data jest prawidłowa
//           if (!isNaN(parsedDate)) {
//             // Ustawiamy komórkę jako datę
//             cell.value = parsedDate;
//             cell.numFmt = 'yyyy-mm-dd'; // Format daty
//           }
//         }
//       });

//       if (rowNumber === 1) {
//         row.height = 25;
//         row.eachCell((cell) => {
//           cell.fill = {
//             type: "pattern",
//             pattern: "solid",
//             fgColor: { argb: "FFD3D3D3" }, // Szary kolor tła dla nagłówków
//           };
//           cell.font = { bold: true };

//         });
//       }
//     });

//     // Dodanie autofilter do całego zakresu danych (od wiersza 1 do ostatniego wiersza z danymi)
//     worksheet.autoFilter = {
//       from: { row: 1, column: 1 },
//       to: { row: allData.length + 1, column: orderedHeaders.length }, // Zakres obejmujący wszystkie dane
//     };

//     // blokowanie komórek - przewijanie
//     worksheet.views = [{ state: "frozen", xSplit: 1, ySplit: 1 }];

//     // Eksport do pliku
//     const buffer = await workbook.xlsx.writeBuffer();
//     const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
//     saveAs(blob, `${info}.xlsx`);

//   } catch (err) {
//     console.error(err);
//   }
// };
