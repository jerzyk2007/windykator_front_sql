import XLSX from "xlsx-js-style";
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
  // console.log(info);
  // console.log(orderColumns);
  try {
    // Tworzenie mapowania między accessorKey a header
    const keyMapping = orderColumns.columns.reduce((acc, column) => {
      acc[column.accessorKey] = column.header;
      return acc;
    }, {});

    // Tworzenie nowego workbooka
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Dane');

    // Pobierz wszystkie unikalne klucze z obiektów, ale z uwzględnieniem zamiany nazw
    const allKeys = [...new Set(allData.flatMap(Object.keys))]; // Unikalne klucze jako nagłówki

    // Mapowanie kluczy na ich nagłówki
    const mappedHeaders = allKeys.map(key => keyMapping[key] || key); // Jeśli klucz istnieje w mapie, podmienia na header, w przeciwnym razie zostaje bez zmian

    // Określenie kolejności kolumn na podstawie order
    const orderedHeaders = orderColumns.order.filter(header => mappedHeaders.includes(header));

    // Dodaj nagłówki kolumn w odpowiedniej kolejności
    worksheet.addRow(orderedHeaders);

    // Dodaj wiersze z danymi, zastępując brakujące wartości pustym tekstem
    allData.forEach((data) => {
      const row = orderedHeaders.map((header) => {
        // Znalezienie klucza odpowiadającego nagłówkowi
        const key = Object.keys(keyMapping).find(k => keyMapping[k] === header) || header;
        let value = data[key] !== null && data[key] !== undefined ? data[key] : ""; // Zastąpienie null/undefined pustym tekstem
        value = sanitizeValue(value); // Oczyszczenie wartości
        if (typeof value === 'string' && value.length > 255) {
          value = value.substring(0, 255); // Ograniczenie długości tekstu
        }
        return value;
      });
      worksheet.addRow(row);
    });

    // Formatowanie nagłówków
    orderedHeaders.forEach((header, index) => {
      const column = worksheet.getColumn(index + 1);
      column.width = header.length < 22 ? 22 : header.length; // Ustaw szerokość kolumn
      column.font = { size: 10 }; // Nagłówki pogrubione
      column.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      column.numFmt = '#,##0.00';


      if (header === 'Ile') {
        column.numFmt = '0';
      }
    });



    // Stylizacja komórek
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.font = { bold: false };

        // Sprawdzenie, czy komórka zawiera string w formacie 'yyyy-mm-dd'
        if (typeof cell.value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(cell.value)) {
          // Sprawdzenie, czy string jest poprawną datą
          const parsedDate = new Date(cell.value);

          // Sprawdzamy, czy data jest prawidłowa
          if (!isNaN(parsedDate)) {
            // Ustawiamy komórkę jako datę
            cell.value = parsedDate;
            cell.numFmt = 'yyyy-mm-dd'; // Format daty
          }
        }
      });

      if (rowNumber === 1) {
        row.height = 25;
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD3D3D3" }, // Szary kolor tła dla nagłówków
          };
          cell.font = { bold: true };

        });
      }
    });


    // Dodanie autofilter do całego zakresu danych (od wiersza 1 do ostatniego wiersza z danymi)
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: allData.length + 1, column: orderedHeaders.length }, // Zakres obejmujący wszystkie dane
    };

    // blokowanie komórek - przewijanie
    worksheet.views = [{ state: "frozen", xSplit: 1, ySplit: 1 }];

    // Eksport do pliku
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `${info}.xlsx`);

  } catch (err) {
    console.error(err);
  }
};



// export const getAllDataRaport = async (allData, orderColumns, info) => {
//   try {
//     const mergeArrayToString = (item) => {
//       // Sprawdź, czy wartość w polu jest tablicą
//       if (Array.isArray(item)) {
//         // Połącz elementy tablicy w jedną linię, oddzielając je przecinkiem
//         return item.join(", ");
//       } else {
//         // Jeśli wartość nie jest tablicą, zwróć ją bez zmiany
//         return item;
//       }
//     };
//     const cleanData = allData.map((item) => {
//       // Przejdź przez wszystkie pola w elemencie
//       Object.keys(item).forEach((key) => {
//         // Zastosuj funkcję mergeArrayToString do wszystkich pól
//         item[key] = mergeArrayToString(item[key]);
//       });
//       return item;
//     });

//     const changeNameColumns = cleanData.map((item) => {
//       const updatedItem = {};
//       Object.keys(item).forEach((key) => {
//         const column = orderColumns.columns.find(
//           (col) => col.accessorKey === key
//         );
//         if (column) {
//           updatedItem[column.header] = item[key];
//         } else {
//           updatedItem[key] = item[key];
//         }
//       });
//       return updatedItem; // Zwracanie zaktualizowanego obiektu
//     });

//     const wb = XLSX.utils.book_new();

//     try {
//       // Przygotowanie arkusza kalkulacyjnego
//       const ws = XLSX.utils.json_to_sheet(changeNameColumns);


//       // Przearanżowanie kolejności kolumn
//       const reorderColumns = (ws, orderColumn) => {
//         console.log(orderColumn);

//         const header = [];
//         const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

//         // Pobranie nagłówków kolumn
//         if (data.length > 0) {
//           for (let col = 0; col < data[0].length; col++) {
//             header.push(data[0][col]);
//           }

//           // Przearanżowanie kolumn według orderColumn
//           const reorderedHeader = orderColumn.filter((col) =>
//             header.includes(col)
//           );
//           const reorderedData = data.map((row) => {
//             const newRow = [];
//             reorderedHeader.forEach((col) => {
//               newRow.push(row[header.indexOf(col)]);
//             });
//             return newRow;
//           });

//           // Aktualizacja arkusza kalkulacyjnego
//           XLSX.utils.sheet_add_aoa(ws, [reorderedHeader], { origin: 0 });
//           reorderedData.shift(); // Usunięcie pierwszego wiersza z danymi, aby uniknąć duplikacji
//           XLSX.utils.sheet_add_aoa(ws, reorderedData, { origin: 1 });
//         }
//       };

//       // Przearanżowanie kolejności kolumn na arkuszu
//       reorderColumns(ws, orderColumns.order);

//       // Zastosowanie filtrów do wszystkich kolumn
//       const range = XLSX.utils.decode_range(ws["!ref"]);
//       for (let col = range.s.c; col <= range.e.c; col++) {
//         const cell = XLSX.utils.encode_cell({ r: 0, c: col });
//         ws[cell].s = { ...ws[cell].s, font: { bold: true } }; // Dodanie pogrubienia do nagłówków kolumn
//       }

//       // Ustawienie szerokości kolumn
//       for (let i = range.s.c; i <= range.e.c; i++) {
//         const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
//         ws["!cols"] = ws["!cols"] || [];
//         ws["!cols"][i] = { wch: 22 }; // Ustawienie szerokości kolumny domyślnie na 20
//       }

//       // Ustawienie szerokości kolumny na 30, jeśli zawartość komórki wymaga zawijania tekstu
//       for (let row = range.s.r; row <= range.e.r; row++) {
//         for (let col = range.s.c; col <= range.e.c; col++) {
//           const cell = XLSX.utils.encode_cell({ r: row, c: col });
//           if (ws[cell] && ws[cell].v && typeof ws[cell].v === "string") {
//             const cellWidth = ws[cell].v.length * 8; // Przybliżona szerokość znaku
//             if (cellWidth > 240) {
//               // 240 to przybliżona szerokość dla 30 znaków
//               ws["!cols"][col] = { wch: 30 }; // Ustawienie szerokości kolumny na 30
//             }
//           }
//         }
//       }

//       // Dodanie filtrów
//       ws["!autofilter"] = { ref: XLSX.utils.encode_range(range) };

//       // Ustawienie koloru żółtego dla pierwszego wiersza
//       const firstRowRange = XLSX.utils.decode_range(ws["!ref"]);

//       for (let col = firstRowRange.s.c; col <= firstRowRange.e.c; col++) {
//         const cell = XLSX.utils.encode_cell({ r: 0, c: col });
//         ws[cell].s = {
//           ...ws[cell].s,
//           fill: { fgColor: { rgb: "B8B8B8" } },
//           alignment: {
//             wrapText: true,
//             vertical: "center",
//             horizontal: "center",
//           },
//           border: {
//             top: { style: "thin" },
//             left: { style: "thin" },
//             right: { style: "thin" },
//             bottom: { style: "thin" },
//           },
//         }; // Ustawienie koloru żółtego
//       }

//       // Dodanie obramowania dla wszystkich komórek z danymi
//       for (let row = range.s.r + 1; row <= range.e.r; row++) {
//         for (let col = range.s.c; col <= range.e.c; col++) {
//           const cell = XLSX.utils.encode_cell({ r: row, c: col });
//           ws[cell].s = {
//             ...ws[cell].s,
//             border: {
//               top: { style: "thin" },
//               left: { style: "thin" },
//               bottom: { style: "thin" },
//               right: { style: "thin" },
//             },
//           };
//           ws[cell].s = {
//             ...ws[cell].s,
//             alignment: {
//               wrapText: true,
//               vertical: "center",
//               horizontal: "center",
//             },
//             numFmt: "# ##0.00 zł",
//           };
//         }
//       }

//       // Przechodzenie przez wszystkie wiersze i dostosowanie wysokości wiersza
//       for (let row = range.s.r; row <= range.e.r; row++) {
//         let rowHeight = 45; // Domyślna wysokość wiersza
//         for (let col = range.s.c; col <= range.e.c; col++) {
//           const cell = XLSX.utils.encode_cell({ r: row, c: col });
//           if (ws[cell] && ws[cell].v && typeof ws[cell].v === "string") {
//             const cellWidth = ws[cell].v.length * 8; // Przybliżona szerokość znaku
//             if (cellWidth > 240) {
//               // Jeśli szerokość tekstu przekracza 240 (przybliżona szerokość dla 30 znaków), zwiększ wysokość wiersza
//               rowHeight = 40; // Ustawienie większej wysokości
//               break; // Przerwanie pętli, gdy tylko jeden warunek zostanie spełniony
//             }
//           }
//         }
//         // Ustawienie wysokości wiersza dla danego wiersza
//         // const rowObject = XLSX.utils.encode_row(row);
//         // ws["!rows"] = ws["!rows"] || [];
//         // ws["!rows"][rowObject] = {
//         //   hpt: rowHeight, // Konwersja pikseli na punkty (1 piksel ≈ 0.75 punkta)
//         //   hpx: rowHeight * 2,
//         // };
//       }

//       // Dodanie arkusza kalkulacyjnego do arkusza roboczego
//       XLSX.utils.book_append_sheet(wb, ws, info);

//       // Zapisanie arkusza roboczego do pliku
//       XLSX.writeFile(wb, `${info}.xlsx`);
//     } catch (err) {
//       console.error(err);
//     }
//   } catch (err) {
//     console.error(err);
//   }
// };


