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
    const limitText = (text, maxLength = 42) =>
      text && text.length > maxLength ? text.slice(0, maxLength) + "..." : text || "";

    const dzialania = Array.isArray(item.UWAGI_ASYSTENT) && item.UWAGI_ASYSTENT.length > 0
      ? item.AREA === 'BLACHARNIA' ? limitText(item.UWAGI_ASYSTENT[item.UWAGI_ASYSTENT.length - 1]) : item.UWAGI_ASYSTENT[item.UWAGI_ASYSTENT.length - 1]
      : "";


    return {
      ...item,
      UWAGI_ASYSTENT: dzialania ? dzialania : ''
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
        // Dodaj x pustych wierszy na początku arkusza
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

            for (let rowIndex = excelStartRow; rowIndex <= excelEndRow; rowIndex++) {
              const cell = worksheet.getCell(`${columnLetter}${rowIndex}`);

              // Jeśli wartość jest pusta lub nie jest liczbą, ustaw wartość na 0
              if (!cell.value || isNaN(parseFloat(cell.value))) {
                cell.value = 0;
              }
            }

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
          else if (header === 'Podjęte działania') {
            column.width = 35;

          }
          else if (header === 'Ile') {
            const columnIndex = headers.indexOf('Ile') + 2; // Znajduje indeks kolumny (Excel używa numeracji od 1)
            const columnLetter = String.fromCharCode(64 + columnIndex); // Konwersja na literę kolumny
            for (let rowIndex = excelStartRow; rowIndex <= excelEndRow; rowIndex++) {
              const cell = worksheet.getCell(`${columnLetter}${rowIndex}`);

              // Jeśli wartość jest pusta lub nie jest liczbą, ustaw wartość na 0
              if (!cell.value || isNaN(parseFloat(cell.value))) {
                cell.value = 0;
              }
            }
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
