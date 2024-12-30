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
