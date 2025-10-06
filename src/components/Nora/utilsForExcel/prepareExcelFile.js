import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Funkcja do mapowania oznaczenia komórki na wiersz i kolumnę
const cellToIndex = (cell) => {
  const col = cell.replace(/[0-9]/g, "");
  const row = parseInt(cell.replace(/[A-Z]/g, ""), 10);

  return {
    col:
      col
        .split("")
        .reduce(
          (acc, char) => acc * 26 + char.charCodeAt(0) - "A".charCodeAt(0) + 1,
          0
        ) - 1,
    row: row - 1,
  };
};

const numberToLetter = (number) => {
  if (number < 1) {
    throw new Error("Number must be greater than or equal to 1.");
  }

  let result = "";
  while (number > 0) {
    // Zamień liczbę na literę (z uwagi na indeksowanie od 1, musisz odjąć 1)
    number--;
    const charCode = (number % 26) + "A".charCodeAt(0);
    result = String.fromCharCode(charCode) + result;
    number = Math.floor(number / 26);
  }

  return result;
};

export const getExcelRaport = async (
  cleanData,
  settingsColumn,
  newKeys,
  orderColumn
) => {
  const filteredSettingsColumn = settingsColumn.filter(
    (col) => !orderColumn.includes(col)
  );

  try {
    const workbook = new ExcelJS.Workbook();

    for (const obj of cleanData) {
      const worksheet = workbook.addWorksheet(obj.name);

      const totalAmount = (data, key) => {
        return data.reduce((sum, item) => {
          let amount = item[key];
          if (typeof amount === "string") {
            amount = amount.replace(",", "."); // Zamiana przecinków na kropki
            amount = parseFloat(amount);
          }
          if (!isNaN(amount)) {
            sum += amount;
          }
          return sum;
        }, 0);
      };

      const customData = filteredSettingsColumn.map((item) => {
        const index = settingsColumn.indexOf(item);
        const letter = numberToLetter(index + 1);
        const findItem = newKeys.filter((prev) => prev.newName === item);

        let value = 0;
        if (findItem.length) {
          const first = totalAmount(obj.data, String(findItem[0].maxKey));
          const second = totalAmount(obj.data, String(findItem[0].name));
          if (findItem[0].type === "minus") {
            value = first - second;
          } else if (findItem[0].type === "percentage") {
            value = (first - second) / second;
          }
        } else {
          value = findItem.length ? item : totalAmount(obj.data, item);
        }

        return {
          cell: `${letter}1`,
          value: value,
          format:
            findItem[0]?.type === "percentage" ? "#,##0.00 %" : "#,##0.00 zł",
        };
      });

      // Dodanie customData na górze arkusza
      customData.forEach(({ cell, value, format }) => {
        const { col, row } = cellToIndex(cell);
        // Upewnij się, że wiersz istnieje
        const rowObj = worksheet.getRow(row + 1); // ExcelJS jest 1-indeksowany
        rowObj.getCell(col + 1).value =
          typeof value === "function" ? value() : value;
        if (format) {
          rowObj.getCell(col + 1).numFmt = format;
        }
        rowObj.getCell(col + 1).font = { bold: true };
        rowObj.getCell(col + 1).alignment = { horizontal: "center" };
      });

      // Dodanie danych z ustawioną kolejnością kolumn
      const headerRow = worksheet.getRow(2);
      settingsColumn.forEach((col, index) => {
        headerRow.getCell(index + 1).value = col;
        headerRow.getCell(index + 1).font = { bold: true };
        headerRow.getCell(index + 1).alignment = {
          horizontal: "center",
          vertical: "center",
          wrapText: true,
        };
        headerRow.getCell(index + 1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "B8B8B8" },
        };
        headerRow.getCell(index + 1).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Dodaj dane
      obj.data.forEach((item, rowIndex) => {
        const row = worksheet.getRow(3 + rowIndex); // Tabela zaczyna się od wiersza 3
        settingsColumn.forEach((col, colIndex) => {
          row.getCell(colIndex + 1).value =
            item[col] !== undefined ? item[col] : "";
          row.getCell(colIndex + 1).alignment = {
            wrapText: true,
            horizontal: "center",
            vertical: "center",
          };
          row.getCell(colIndex + 1).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          if (typeof item[col] === "number") {
            row.getCell(colIndex + 1).numFmt = "#,##0.00";
          }
        });
        row.commit(); // Po dodaniu danych do wiersza musisz je zapisać
      });

      // Ustawienie szerokości kolumn
      settingsColumn.forEach((_, index) => {
        worksheet.getColumn(index + 1).width = 22;
      });

      // Dodanie autofilter
      worksheet.autoFilter = {
        from: { row: 2, column: 1 },
        to: { row: 2, column: settingsColumn.length },
      };

      // Zamrożenie pierwszej kolumny i pierwszych 2 wierszy
      worksheet.views = [{ state: "frozen", xSplit: 1, ySplit: 2 }];
    }

    // Zapisz plik
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Raport Nora Kody.xlsx");
  } catch (err) {
    console.error(err);
  }
};
