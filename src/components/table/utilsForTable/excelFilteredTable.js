import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const getAllDataRaport = async (allData, orderColumns, info) => {
  const sanitize = (text) => {
    if (!text) return " ";
    return text.replace(
      /[^\x20-\x7EąćęłńóśżźĄĆĘŁŃÓŚŻŹ,.\-+@()$%&"';:/\\!?=\[\]{}<>_\n\r]/g,
      " "
    );
  };

  const sanitizeSheetName = (name) => {
    if (!name || typeof name !== "string") return "Arkusz";
    return name
      .replace(/[:\\\/\?\*\[\]]/g, " ")
      .trim()
      .substring(0, 31);
  };

  const usedNames = new Set();

  const getUniqueSheetName = (base) => {
    let name = sanitizeSheetName(base);
    let counter = 1;
    while (usedNames.has(name)) {
      name = sanitizeSheetName(base).substring(0, 28) + `_${counter++}`;
    }
    usedNames.add(name);
    return name;
  };

  const cleanData = allData.map((item) => {
    let dzialania = "";

    if (Array.isArray(item.UWAGI_ASYSTENT)) {
      const len = item.UWAGI_ASYSTENT.length;
      if (len === 0) {
        dzialania = "";
      } else if (len === 1) {
        dzialania = sanitize(item.UWAGI_ASYSTENT[0]);
      } else {
        dzialania = `Liczba wcześniejszych wpisów: ${len - 1}\n${sanitize(
          item.UWAGI_ASYSTENT[len - 1]
        )}`;
      }
    } else {
      dzialania = "";
    }

    return {
      ...item,
      UWAGI_ASYSTENT: dzialania,
    };
  });

  const startRow = 2;

  try {
    const groupedByDzial = {};
    cleanData.forEach((item) => {
      const dzial = item.DZIAL || "Brak działu";
      if (!groupedByDzial[dzial]) {
        groupedByDzial[dzial] = [];
      }
      groupedByDzial[dzial].push(item);
    });

    const changeNameColumns = cleanData.map((doc) => {
      const newItem = {};
      for (const column of orderColumns.columns) {
        const value = doc[column.accessorKey];
        newItem[column.header] =
          value !== undefined ? value : doc[column.accessorKey];
      }
      return newItem;
    });

    const groupedSheets = [
      {
        name: getUniqueSheetName(info),
        data: changeNameColumns,
      },
    ];

    const sortedDzialNames = Object.keys(groupedByDzial).sort((a, b) =>
      a.localeCompare(b)
    );

    sortedDzialNames.forEach((dzialName) => {
      const mappedGroup = groupedByDzial[dzialName].map((doc) => {
        const newItem = {};
        for (const column of orderColumns.columns) {
          const value = doc[column.accessorKey];
          newItem[column.header] =
            value !== undefined ? value : doc[column.accessorKey];
        }
        return newItem;
      });

      groupedSheets.push({
        name: getUniqueSheetName(dzialName),
        data: mappedGroup,
      });
    });

    const workbook = new ExcelJS.Workbook();

    groupedSheets.forEach((sheet) => {
      const worksheet = workbook.addWorksheet(sheet.name);

      if (!sheet.data?.length) return;

      for (let i = 0; i < startRow - 1; i++) worksheet.addRow([]);

      const headers = orderColumns.order.filter((column) =>
        sheet.data[0].hasOwnProperty(column)
      );

      worksheet.addRow(["Lp", ...headers]);

      sheet.data.forEach((row, index) => {
        const rowData = [
          index + 1,
          ...headers.map((header) => row[header] || ""),
        ];
        worksheet.addRow(rowData);
      });

      const headerRow = worksheet.getRow(startRow);
      headerRow.font = { bold: true, size: 10 };
      headerRow.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "cacaca" },
        };
      });

      worksheet.getColumn(1).width = 10;
      worksheet.getColumn(1).alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      headers.forEach((header, columnIndex) => {
        const colIndex = columnIndex + 2;
        const column = worksheet.getColumn(colIndex);
        const columnLetter = String.fromCharCode(64 + colIndex);
        const startDataRow = startRow + 1;
        const endDataRow = worksheet.rowCount;

        column.width = 15;
        column.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };

        const sumCell = worksheet.getCell(startRow - 1, colIndex);
        const border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        if (header === "Faktura") {
          column.width = 25;
          sumCell.value = {
            formula: `SUBTOTAL(103,${columnLetter}${startDataRow}:${columnLetter}${endDataRow})`,
          };
          sumCell.numFmt = "0";
        } else if (
          header === "Brutto" ||
          header === "Netto" ||
          header === "Do rozl." ||
          header === "Do rozl Symfonia"
        ) {
          column.numFmt = "#,##0.00";
          for (
            let rowIndex = startDataRow;
            rowIndex <= endDataRow;
            rowIndex++
          ) {
            const cell = worksheet.getCell(`${columnLetter}${rowIndex}`);
            if (!cell.value || isNaN(parseFloat(cell.value))) cell.value = 0;
          }
          sumCell.value = {
            formula: `SUBTOTAL(109,${columnLetter}${startDataRow}:${columnLetter}${endDataRow})`,
          };
          sumCell.numFmt = "#,##0.00 zł";
        } else if (header === "Podjęte działania") {
          column.width = 35;
        } else if (header === "Ile") {
          for (
            let rowIndex = startDataRow;
            rowIndex <= endDataRow;
            rowIndex++
          ) {
            const cell = worksheet.getCell(`${columnLetter}${rowIndex}`);
            if (!cell.value || isNaN(parseFloat(cell.value))) cell.value = 0;
          }
        }

        if (sumCell.value) {
          sumCell.font = { bold: true };
          sumCell.alignment = { horizontal: "center", vertical: "middle" };
          sumCell.border = border;
          sumCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFF00" },
          };
        }
      });

      headers.forEach((header, columnIndex) => {
        const colIndex = columnIndex + 2;
        const column = worksheet.getColumn(colIndex);
        let maxLength = header.length;
        worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
          if (rowIndex >= startRow) {
            const cellValue = row.getCell(colIndex).value;
            if (cellValue) {
              const len = cellValue.toString().length;
              if (len > maxLength) maxLength = len;
            }
          }
        });
        column.width = Math.max(15, Math.min(maxLength, 40));
      });

      worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
        if (rowIndex >= startRow) {
          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.font = { size: 10 };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
        }
      });

      worksheet.autoFilter = {
        from: `A${startRow}`,
        to: worksheet.getColumn(headers.length + 1).letter + `${startRow}`,
      };

      worksheet.views = [
        {
          state: "frozen",
          xSplit: 2,
          ySplit: startRow,
          topLeftCell: `C${startRow + 1}`,
          activeCell: `C${startRow + 1}`,
        },
      ];
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${sanitizeSheetName(info)}.xlsx`);
  } catch (err) {
    console.error(err);
  }
};

export const dataRaport = async (allData, orderColumns, info) => {
  const cleanData = allData.map((item) => {
    const limitText = (text, maxLength = 42) =>
      text && text.length > maxLength
        ? text.slice(0, maxLength) + "..."
        : text || " ";

    const dzialania =
      Array.isArray(item.UWAGI_ASYSTENT) && item.UWAGI_ASYSTENT.length > 0
        ? limitText(item.UWAGI_ASYSTENT[item.UWAGI_ASYSTENT.length - 1])
        : "BRAK";

    // }
    return {
      ...item,
      UWAGI_ASYSTENT: dzialania ? dzialania : "BRAK",
    };
  });

  const startRow = 1;
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
      },
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
        worksheet.addRow(["Lp", ...headers]);

        // Dodaj dane z każdego obiektu jako wiersze, zaczynając od 1 w kolumnie 'Lp'
        sheet.data.forEach((row, index) => {
          const rowData = [
            index + 1,
            ...headers.map((header) => row[header] || ""),
          ]; // Dodaj numer porządkowy

          worksheet.addRow(rowData);
        });

        // Stylizowanie nagłówków
        const headerRow = worksheet.getRow(startRow);
        headerRow.font = { bold: true, size: 10 }; // Ustawienie pogrubionej czcionki o rozmiarze 10
        headerRow.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        headerRow.eachCell((cell) => {
          cell.font = { bold: true, size: 10 };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "cacaca" }, // Kolor tła (np. żółty)
          };
        });

        // Stylizacja dla kolumny 'Lp'
        const lpColumn = worksheet.getColumn(1); // Kolumna 'Lp' to zawsze pierwsza kolumna
        lpColumn.width = 10; // Szerokość kolumny
        lpColumn.alignment = { horizontal: "center", vertical: "middle" }; // Wyśrodkowanie

        // Stylizowanie kolumn na podstawie ich nazw, pomijając 'Lp'
        headers.forEach((header, columnIndex) => {
          const column = worksheet.getColumn(columnIndex + 2); // Kolumna 'Lp' ma indeks 1, więc zaczynamy od 2
          const headerCell = worksheet.getCell(startRow, columnIndex + 2);
          headerCell.font = { bold: true }; // Pogrubienie czcionki
          headerCell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };
          const excelStartRow = startRow + 1;
          const excelEndRow = worksheet.rowCount;
          column.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };
          column.width = 15;

          const extraCellBorder = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };

          if (header === "Dział") {
            headerCell.alignment = { horizontal: "center", vertical: "middle" };
            headerCell.font = { bold: true }; // Pogrubienie czcionki
            column.width = 20;
          } else if (
            header === "Stan należności w % - BL" ||
            header === "Stan wszystkich należności w %" ||
            header === "Stan  należności bez kancelarii w %" ||
            header.includes("Cele na") ||
            header === "Stan należności w %"
          ) {
            column.numFmt = "0%";

            // Upewniamy się, że wartości w tej kolumnie to liczby z zakresu 0–1
            for (
              let rowIndex = excelStartRow;
              rowIndex <= excelEndRow;
              rowIndex++
            ) {
              const cell = worksheet.getCell(rowIndex, columnIndex + 2);
              const rawValue = cell.value;

              if (typeof rawValue === "string" && rawValue.includes("%")) {
                const number = parseFloat(
                  rawValue.replace("%", "").trim().replace(",", ".")
                );
                if (!isNaN(number)) {
                  cell.value = number / 100; // Przekształcamy np. 26% → 0.26
                }
              } else if (typeof rawValue === "number" && rawValue > 1) {
                cell.value = rawValue / 100;
              }

              cell.numFmt = "0%"; // Wymuszenie formatu procentowego
            }
          } else if (
            header === "Kwota przeterminowanych fv - BL" ||
            header === "Kwota nieprzeterminowanych FV - BL" ||
            header === "Kwota wszystkich przeterminowanych fv" ||
            header === "Kwota wszystkich nieprzeterminowanych fv" ||
            header === "Kwota przeterminowanych fv bez kancelarii" ||
            header ===
              "Kwota wszystkich nieprzeterminowanych fv bez kancelarii" ||
            header ===
              "Kwota nierozliczonych fv - błędy Doradcy i dokumentacji" ||
            header === "Kwota niepobranych VAT'ów" ||
            header === "Kwota przeterminowanych FV" ||
            header === "Kwota nieprzeterminowanych FV"
          ) {
            column.numFmt = "#,##0.00";
          } else if (
            header === "Ilość przeterminowanych FV - BL" ||
            header === "Ilość wszystkich faktur przeterminowanych" ||
            header === "Ilość faktur przeterminowanych bez kancelarii" ||
            header === "Ilość niepobranych VAT'ów" ||
            header ===
              "Ilość nierozliczonych fv - błędy Doradcy i dokumentacji" ||
            header === "Ilość przeterminowanych FV" ||
            header === "Kwota niepobranych VAT'ów"
          ) {
            column.numFmt = "#,##0";
            for (let i = excelStartRow; i <= excelEndRow; i++) {
              const cell = worksheet.getCell(i, columnIndex + 2);
              const value = cell.value;
              if (typeof value === "string") {
                const numericValue = parseInt(value);
                if (!isNaN(numericValue)) {
                  cell.value = numericValue;
                }
              }
            }
          }
        });

        headers.forEach((header, columnIndex) => {
          const column = worksheet.getColumn(columnIndex + 2); // Kolumna 'Lp' ma indeks 1, więc zaczynamy od 2
          const headerCell = worksheet.getCell(startRow, columnIndex + 2);

          headerCell.font = { bold: true };
          headerCell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };

          column.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };

          // Pobranie maksymalnej długości tekstu w kolumnie (uwzględniając nagłówek)
          let maxLength = header.length;

          worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
            if (rowIndex >= startRow) {
              // Pomijamy nagłówki
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
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            });
          }
        });

        headerRow.eachCell((cell) => {
          cell.font = { bold: true, size: 10 };
          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };
        });

        // Ustawienie autofiltrowania od wiersza 6 (nagłówki) dla całego zakresu
        worksheet.autoFilter = {
          from: `A${startRow}`, // Pierwsza kolumna (Lp)
          to: worksheet.getColumn(headers.length + 1).letter + `${startRow}`, // Ostatnia kolumna na podstawie liczby kolumn
        };

        // Blokowanie 5 pierwszych wierszy, aby wiersz 6 (nagłówki) został widoczny
        worksheet.views = [
          {
            state: "frozen",
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
