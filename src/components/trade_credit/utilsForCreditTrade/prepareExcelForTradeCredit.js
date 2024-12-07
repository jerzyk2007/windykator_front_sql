import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Funkcja do mapowania oznaczenia komórki na wiersz i kolumnę
// const cellToIndex = (cell) => {
//   const col = cell.replace(/[0-9]/g, "");
//   const row = parseInt(cell.replace(/[A-Z]/g, ""), 10);
//   return {
//     col:
//       col
//         .split("")
//         .reduce(
//           (acc, char) => acc * 26 + char.charCodeAt(0) - "A".charCodeAt(0) + 1,
//           0
//         ) - 1,
//     row: row - 1,
//   };
// };

// const numberToLetter = (number) => {
//   if (number < 1) {
//     throw new Error("Number must be greater than or equal to 1.");
//   }

//   let result = "";
//   while (number > 0) {
//     // Zamień liczbę na literę (z uwagi na indeksowanie od 1, musisz odjąć 1)
//     number--;
//     const charCode = (number % 26) + "A".charCodeAt(0);
//     result = String.fromCharCode(charCode) + result;
//     number = Math.floor(number / 26);
//   }

//   return result;
// };

export const getExcelRaport = async (
  cleanData,
  settingsColumn,
  columnsContractor
) => {
  try {
    const workbook = new ExcelJS.Workbook();

    for (const obj of cleanData) {
      if (obj.name !== "NOWY KONTRAHENT") {
        const worksheet = workbook.addWorksheet(obj.name);

        /// od którego wiersza ma się zaczynać tabela
        const headerRow = worksheet.getRow(1);
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

        // Zmiana koloru nagłówków w kolumnach G, H, I, J i K
        // const columnsToChange = ["G", "H", "I", "J", "K"]; // Lista kolumn do zmiany
        const columnsToChange = ["G", "K", "L", "N", "O"]; // Lista kolumn do zmiany

        columnsToChange.forEach((columnName) => {
          const headerCell = worksheet.getCell(`${columnName}1`); // Odwołanie do nagłówka (pierwsza komórka w danej kolumnie)
          headerCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "efc179" }, // Kolor tła
          };
          headerCell.font = {
            bold: true,
            color: { argb: "000000" }, // Kolor tekstu
          };
        });
        // Dodaj dane
        obj.data.forEach((item, rowIndex) => {
          const row = worksheet.getRow(2 + rowIndex); // Tabela zaczyna się od wiersza 2
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
              row.getCell(colIndex + 1).numFmt = "#,##0"; // Formatowanie liczb
            }
          });
          row.commit(); // Po dodaniu danych do wiersza musisz je zapisać
        });

        // Lista wartości dla listy rozwijanej
        // const formOfPayment = [
        //   "GOTÓWKA",
        //   "PRZELEW",
        //   "KARTA PŁATNICZA",
        //   "POBRANIE",
        //   "VOUCHER",
        //   "KOMPENSATA",
        //   "BLIK",
        //   "ALLEGRO",
        //   "PAYU",
        //   "PAYPAL",
        // ];
        const formOfPayment = ["PRZELEW", "BRAK PRZELEWU", "KOMPENSATA"];
        const daysPayment = [
          "BRAK",
          "0 - 7",
          "8 - 14",
          "15 - 30",
          "31 - 90",
          "91 - 180",
          "181 - 360",
        ];

        const businessPayment = ["TAK", "NIE"];

        settingsColumn.forEach((_, index) => {
          let maxLength = 0;

          // Iterujemy przez wszystkie wiersze, aby znaleźć najdłuższą wartość w kolumnie
          worksheet.eachRow((row) => {
            // zmiana zabzepieczenia arkusza
            row.eachCell((cell) => {
              cell.protection = { locked: true }; // Oznacz wszystkie komórki jako niezablokowane
              // cell.protection = { locked: true, sort: true }; // Oznacz wszystkie komórki jako niezablokowane
            });

            // Ustawienie nagłówków jako niezablokowane
            // const headerRow = worksheet.getRow(1); // Przyjmujemy, że nagłówki są w pierwszym wierszu
            // headerRow.eachCell((cell) => {
            //   cell.protection = { locked: false }; // Oznacz nagłówki jako niezablokowane
            // });

            // koniec zmiany
            const cellValue = row.getCell(index + 1).value;
            if (cellValue) {
              const cellLength = cellValue.toString().length;
              if (cellLength > maxLength) {
                maxLength = cellLength;
              }
            }
          });

          // Dopasowanie szerokości kolumny: nie węższa niż 10, nie szersza niż 25
          worksheet.getColumn(index + 1).width = Math.max(
            Math.min(maxLength + 5, 25),
            8
          );

          // // Zmienna do sortowania przed dodaniem do arkusza
          // obj.data.sort((a, b) => b[settingsColumn[9]] - a[settingsColumn[9]]); // Zakładając, że kolumna K jest 11. kolumną (indeks 10)

          obj.data.sort((a, b) => {
            // Najpierw sortowanie na podstawie wartości w kolumnie 5 ("PRZELEW" najpierw)
            if (
              a[settingsColumn[5]] === "PRZELEW" &&
              b[settingsColumn[5]] !== "PRZELEW"
            ) {
              return -1;
            }
            if (
              a[settingsColumn[5]] !== "PRZELEW" &&
              b[settingsColumn[5]] === "PRZELEW"
            ) {
              return 1;
            }

            // Jeśli oba wiersze mają "PRZELEW" lub oba "BRAK PRZELEWU", sortuj na podstawie kolumny 9 (malejąco)
            return b[settingsColumn[9]] - a[settingsColumn[9]];
          });

          // obj.data.sort((a, b) => {
          //   // Pobieranie pierwszych wartości z tablicy w kolumnie 5
          //   const aValue = a[settingsColumn[5]][0]; // Pierwszy element w tablicy a[settingsColumn[5]]
          //   const bValue = b[settingsColumn[5]][0]; // Pierwszy element w tablicy b[settingsColumn[5]]

          //   // Najpierw sortowanie na podstawie wartości w kolumnie 5 ("PRZELEW" najpierw)
          //   if (aValue === "PRZELEW" && bValue !== "PRZELEW") {
          //     return -1;
          //   }
          //   if (aValue !== "PRZELEW" && bValue === "PRZELEW") {
          //     return 1;
          //   }

          //   // Jeśli oba wiersze mają "PRZELEW" lub oba "BRAK PRZELEWU", sortuj na podstawie kolumny 9 (malejąco)
          //   return b[settingsColumn[9]] - a[settingsColumn[9]];
          // });

          // // Zmienna do sortowania przed dodaniem do arkusza, sortuje po pierwszej wartości w tablicy i zamianie na Number
          // obj.data.sort((a, b) => {
          //   // Sprawdź, czy a[settingsColumn[10]] i b[settingsColumn[10]] są tablicami
          //   const valueA =
          //     Array.isArray(a[settingsColumn[10]]) &&
          //     a[settingsColumn[10]].length > 0
          //       ? Number(a[settingsColumn[10]][0])
          //       : 0;
          //   const valueB =
          //     Array.isArray(b[settingsColumn[10]]) &&
          //     b[settingsColumn[10]].length > 0
          //       ? Number(b[settingsColumn[10]][0])
          //       : 0;

          //   return valueB - valueA; // Sortowanie malejące
          // });

          // Dodaj dane bez zmian w stylu
          // Wstaw dane do arkusza, pominając kolumnę A
          obj.data.forEach((item, rowIndex) => {
            const row = worksheet.getRow(2 + rowIndex); // Tabela zaczyna się od wiersza 2
            settingsColumn.forEach((col, colIndex) => {
              // Pomiń kolumnę A, czyli indeks 0
              if (colIndex > 0) {
                row.getCell(colIndex + 1).value =
                  item[col] !== undefined ? item[col] : "";
              }
            });
            row.commit(); // Po dodaniu danych do wiersza musisz je zapisać
          });

          if (worksheet.getColumn("G")) {
            worksheet.getColumn("G").width = 20;

            worksheet
              .getColumn("G")
              .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                if (rowNumber > 1) {
                  const cellValue = cell.value;
                  const [displayValue, isValid] = cellValue;
                  // Ustawiamy wyświetlaną wartość tylko na pierwszy element tablicy
                  cell.value = displayValue;

                  cell.dataValidation = {
                    type: "list",
                    allowBlank: false,
                    operator: "equal",
                    formulae: [`"${formOfPayment.join(",")}"`],
                    showErrorMessage: true,
                    errorStyle: "stop",
                    errorTitle: "Nieprawidłowa wartość",
                    error: "Wartość musi zostać wybrana z listy",
                  };

                  // Ustawiamy odpowiedni kolor na podstawie drugiego elementu tablicy
                  cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {
                      argb: isValid ? "ADD8E6" : "efc179", // Jasnoniebieski, gdy true, pomarańczowy, gdy false
                    },
                  };

                  cell.protection = {
                    locked: false, // Oznacza komórkę jako niezablokowaną
                  };
                }
              });
          }

          // if (worksheet.getColumn("H")) {
          //   // Iteracja przez komórki, zaczynając od drugiego wiersza
          //   worksheet
          //     .getColumn("H")
          //     .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
          //       // Sprawdzamy, czy to nie jest pierwszy wiersz (nagłówek)
          //       if (rowNumber > 1) {
          //         const cellValue = cell.value;
          //         const [displayValue, isValid] = cellValue;

          //         cell.value = displayValue;

          //         cell.dataValidation = {
          //           type: "list",
          //           allowBlank: false,
          //           operator: "equal",
          //           formulae: [`"${daysPayment.join(",")}"`],
          //           showErrorMessage: true,
          //           errorStyle: "stop",
          //           errorTitle: "Nieprawidłowa wartość",
          //           error: "Wartość musi zostać wybrana z listy",
          //         };

          //         cell.fill = {
          //           type: "pattern",
          //           pattern: "solid",
          //           fgColor: {
          //             argb: isValid ? "ADD8E6" : "efc179",
          //           },
          //         };

          //         // Blokowanie komórki
          //         cell.protection = {
          //           locked: false, // Oznacza komórkę jako zablokowaną
          //         };
          //       }
          //     });
          // }

          // if (worksheet.getColumn("I")) {
          //   // Iteracja przez komórki, zaczynając od drugiego wiersza
          //   worksheet
          //     .getColumn("I")
          //     .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
          //       // Sprawdzamy, czy to nie jest pierwszy wiersz (nagłówek)
          //       if (rowNumber > 1) {
          //         const cellValue = cell.value;
          //         const [displayValue, isValid] = cellValue;

          //         cell.value = displayValue;

          //         cell.dataValidation = {
          //           type: "list",
          //           allowBlank: false,
          //           operator: "equal",
          //           formulae: [`"${businessPayment.join(",")}"`],
          //           showErrorMessage: true,
          //           errorStyle: "stop",
          //           errorTitle: "Nieprawidłowa wartość",
          //           error: "Wartość musi zostać wybrana z listy",
          //         };

          //         cell.fill = {
          //           type: "pattern",
          //           pattern: "solid",
          //           fgColor: {
          //             argb: isValid ? "ADD8E6" : "efc179",
          //           },
          //         };

          //         // Blokowanie komórki
          //         cell.protection = {
          //           locked: false, // Oznacza komórkę jako zablokowaną
          //         };
          //       }
          //     });
          // }

          // if (worksheet.getColumn("J")) {
          //   // Iteracja przez komórki, zaczynając od drugiego wiersza
          //   worksheet
          //     .getColumn("J")
          //     .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
          //       // Sprawdzamy, czy to nie jest pierwszy wiersz (nagłówek)
          //       if (rowNumber > 1) {
          //         // const cellValue = cell.value;
          //         // const [displayValue, isValid] = cellValue;

          //         // cell.value = displayValue;

          //         cell.fill = {
          //           type: "pattern",
          //           pattern: "solid",
          //           fgColor: {
          //             argb: "efc179",
          //           },
          //         };
          //         // Blokowanie komórki
          //         cell.protection = {
          //           locked: false, // Oznacza komórkę jako zablokowaną
          //         };

          //         cell.numFmt = "#,##0";

          //         cell.dataValidation = {
          //           type: "whole", // Możliwe wartości: 'whole', 'decimal', 'list', 'date', 'time', 'textLength', 'custom'
          //           operator: "between", // Możliwe wartości: 'between', 'notBetween', 'equal', 'notEqual', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'
          //           formula1: 0, // Minimalna wartość
          //           formula2: 1000000, // Maksymalna wartość (możesz ustawić na wartość, którą potrzebujesz)
          //           showErrorMessage: true,
          //           errorTitle: "Nieprawidłowa wartość",
          //           error:
          //             "Proszę wprowadzić wartość liczbową (tylko liczby, bez przecinka).",
          //         };
          //       }
          //     });
          // }

          if (worksheet.getColumn("K")) {
            worksheet.getColumn("K").width = 20;
            // Iteracja przez komórki, zaczynając od drugiego wiersza
            worksheet
              .getColumn("K")
              .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                // Sprawdzamy, czy to nie jest pierwszy wiersz (nagłówek)
                if (rowNumber > 1) {
                  const cellValue = cell.value;
                  const [displayValue, isValid] = cellValue;

                  cell.value = displayValue;

                  cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {
                      argb: isValid ? "ADD8E6" : "efc179",
                    },
                  };

                  cell.numFmt = "#,##0";

                  cell.dataValidation = {
                    type: "whole", // Możliwe wartości: 'whole', 'decimal', 'list', 'date', 'time', 'textLength', 'custom'
                    operator: "between", // Możliwe wartości: 'between', 'notBetween', 'equal', 'notEqual', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'
                    formula1: 0, // Minimalna wartość
                    formula2: 365, // Maksymalna wartość (możesz ustawić na wartość, którą potrzebujesz)
                    showErrorMessage: true,
                    errorTitle: "Nieprawidłowa wartość",
                    error:
                      "Proszę wprowadzić wartość liczbową (tylko liczby, bez przecinka).",
                  };

                  // Blokowanie komórki
                  cell.protection = {
                    locked: false, // Oznacza komórkę jako zablokowaną
                  };
                }
              });
          }

          if (worksheet.getColumn("L")) {
            worksheet.getColumn("L").width = 30;
            worksheet
              .getColumn("L")
              .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                if (rowNumber > 1) {
                  cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {
                      argb: "efc179",
                    },
                  };
                  cell.protection = {
                    locked: false, // Oznacza komórkę jako zablokowaną
                  };
                }
              });
          }

          if (worksheet.getColumn("M")) {
            worksheet
              .getColumn("M")
              .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                if (rowNumber > 1) {
                  cell.value = {
                    // formula: `H${rowNumber}/365*K${rowNumber}`,

                    formula: `
                  IF(ISBLANK(K${rowNumber}), "",
                  IF(H${rowNumber}/365*K${rowNumber}=0, 0,
                  IF(H${rowNumber}/365*K${rowNumber}<10, 10,
                  IF(H${rowNumber}/365*K${rowNumber}<100, 100,
                  IF(H${rowNumber}/365*K${rowNumber}<500, 500,
                  IF(H${rowNumber}/365*K${rowNumber}<1000, CEILING(H${rowNumber}/365*K${rowNumber}, 100),
                  IF(H${rowNumber}/365*K${rowNumber}<10000, CEILING(H${rowNumber}/365*K${rowNumber}, 100),
                  IF(H${rowNumber}/365*K${rowNumber}<100000, CEILING(H${rowNumber}/365*K${rowNumber}, 1000),
                  CEILING(H${rowNumber}/365*K${rowNumber}, 10000)))))))))`,
                  };
                  // cell.fill = {
                  //   type: "pattern",
                  //   pattern: "solid",
                  //   fgColor: {
                  //     argb: "ADD8E6",
                  //   },
                  // };
                  cell.numFmt = "#,##0";
                }
              });
          }

          if (worksheet.getColumn("N")) {
            worksheet.getColumn("N").width = 20;
            // Iteracja przez komórki, zaczynając od drugiego wiersza
            worksheet
              .getColumn("N")
              .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                // Sprawdzamy, czy to nie jest pierwszy wiersz (nagłówek)
                if (rowNumber > 1) {
                  cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {
                      argb: "efc179",
                    },
                  };

                  cell.numFmt = "#,##0";

                  cell.dataValidation = {
                    type: "whole", // Możliwe wartości: 'whole', 'decimal', 'list', 'date', 'time', 'textLength', 'custom'
                    operator: "between", // Możliwe wartości: 'between', 'notBetween', 'equal', 'notEqual', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'
                    formula1: 0, // Minimalna wartość
                    formula2: 365, // Maksymalna wartość (możesz ustawić na wartość, którą potrzebujesz)
                    showErrorMessage: true,
                    errorTitle: "Nieprawidłowa wartość",
                    error:
                      "Proszę wprowadzić wartość liczbową (tylko liczby, bez przecinka).",
                  };

                  // Blokowanie komórki
                  cell.protection = {
                    locked: false, // Oznacza komórkę jako zablokowaną
                  };
                }
              });
          }

          if (worksheet.getColumn("O")) {
            worksheet.getColumn("O").width = 30;
            worksheet
              .getColumn("O")
              .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                if (rowNumber > 1) {
                  cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {
                      argb: "efc179",
                    },
                  };
                  cell.protection = {
                    locked: false, // Oznacza komórkę jako zablokowaną
                  };
                }
              });
          }
        });

        // Dodanie autofilter
        worksheet.autoFilter = {
          from: { row: 1, column: 1 },
          to: { row: 1, column: settingsColumn.length },
        };

        // Zamrożenie pierwszej kolumny i pierwszych 2 wierszy
        worksheet.views = [{ state: "frozen", xSplit: 1, ySplit: 1 }];

        // Ochrona arkusza, aby zablokowane komórki były faktycznie chronione
        worksheet.protect("windykacja", {
          selectLockedCells: true, // Umożliwia zaznaczanie zablokowanych komórek
          selectUnlockedCells: true, // Umożliwia zaznaczanie niezablokowanych komórek
          formatCells: false, // Zakaz formatowania komórek
          formatColumns: false, // Zakaz formatowania kolumn
          formatRows: false, // Zakaz formatowania wierszy
          insertColumns: false, // Zakaz wstawiania kolumn
          insertRows: false, // Zakaz wstawiania wierszy
          deleteColumns: false, // Zakaz usuwania kolumn
          deleteRows: false, // Zakaz usuwania wierszy
          autoFilter: true, // Umożliwia korzystanie z autofilter
          sort: true, // Umożliwia sortowanie
        });
      } else {
        const worksheet = workbook.addWorksheet(obj.name);

        /// od którego wiersza ma się zaczynać tabela
        const headerRow = worksheet.getRow(1);
        columnsContractor.forEach((col, index) => {
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
          const row = worksheet.getRow(2 + rowIndex); // Tabela zaczyna się od wiersza 2
          columnsContractor.forEach((col, colIndex) => {
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
              row.getCell(colIndex + 1).numFmt = "#,##0"; // Formatowanie liczb
            }
          });
          row.commit(); // Po dodaniu danych do wiersza musisz je zapisać
        });

        const areas = [
          "BLACHARNIA",
          "CZĘŚCI",
          "F&I",
          "SAMOCHODY NOWE",
          "SAMOCHODY UŻYWANE",
          "SERWIS",
        ];
        const formOfPayment = ["PRZELEW", "KOMPENSATA"];

        columnsContractor.forEach((_, index) => {
          let maxLength = 0;

          // Iterujemy przez wszystkie wiersze, aby znaleźć najdłuższą wartość w kolumnie
          worksheet.eachRow((row) => {
            // zmiana zabzepieczenia arkusza
            row.eachCell((cell) => {
              cell.protection = { locked: false }; // Oznacz wszystkie komórki jako niezablokowane
            });

            // koniec zmiany
            const cellValue = row.getCell(index + 1).value;
            if (cellValue) {
              const cellLength = cellValue.toString().length;
              if (cellLength > maxLength) {
                maxLength = cellLength;
              }
            }
          });

          // Dopasowanie szerokości kolumny: nie węższa niż 10, nie szersza niż 25
          worksheet.getColumn(index + 1).width = Math.max(
            Math.min(maxLength + 5, 25),
            8
          );
          const totalRows = worksheet.rowCount; // Pobierz liczbę wierszy w arkuszu
          const rowHeight = 25; // Ustaw wysokość, na jaką chcesz ustawić wiersze

          for (let i = 2; i <= totalRows; i++) {
            worksheet.getRow(i).height = rowHeight; // Ustaw wysokość dla każdego wiersza
          }
          // // Zmienna do sortowania przed dodaniem do arkusza
          // obj.data.sort((a, b) => b[columnsContractor[9]] - a[columnsContractor[9]]); // Zakładając, że kolumna K jest 11. kolumną (indeks 10)

          // // Zmienna do sortowania przed dodaniem do arkusza, sortuje po pierwszej wartości w tablicy i zamianie na Number
          // obj.data.sort((a, b) => {
          //   // Sprawdź, czy a[columnsContractor[10]] i b[columnsContractor[10]] są tablicami
          //   const valueA =
          //     Array.isArray(a[columnsContractor[10]]) &&
          //     a[columnsContractor[10]].length > 0
          //       ? Number(a[columnsContractor[10]][0])
          //       : 0;
          //   const valueB =
          //     Array.isArray(b[columnsContractor[10]]) &&
          //     b[columnsContractor[10]].length > 0
          //       ? Number(b[columnsContractor[10]][0])
          //       : 0;

          //   return valueB - valueA; // Sortowanie malejące
          // });

          // Dodaj dane bez zmian w stylu
          // Wstaw dane do arkusza, pominając kolumnę A
          obj.data.forEach((item, rowIndex) => {
            const row = worksheet.getRow(2 + rowIndex); // Tabela zaczyna się od wiersza 2
            columnsContractor.forEach((col, colIndex) => {
              // Pomiń kolumnę A, czyli indeks 0
              if (colIndex > 0) {
                row.getCell(colIndex + 1).value =
                  item[col] !== undefined ? item[col] : "";
              }
            });
            row.commit(); // Po dodaniu danych do wiersza musisz je zapisać
          });

          if (worksheet.getColumn("A")) {
            // Iteracja przez komórki, zaczynając od drugiego wiersza
            worksheet
              .getColumn("A")
              .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                // Sprawdzamy, czy to nie jest pierwszy wiersz (nagłówek)
                if (rowNumber > 1) {
                  // cell.numFmt = "#,##0";

                  // cell.dataValidation = {
                  //   type: "whole", // Możliwe wartości: 'whole', 'decimal', 'list', 'date', 'time', 'textLength', 'custom'
                  //   operator: "between", // Możliwe wartości: 'between', 'notBetween', 'equal', 'notEqual', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'
                  //   formula1: 0, // Minimalna wartość
                  //   formula2: 1000000, // Maksymalna wartość (możesz ustawić na wartość, którą potrzebujesz)
                  //   showErrorMessage: true,
                  //   errorTitle: "Nieprawidłowa wartość",
                  //   error:
                  //     "Proszę wprowadzić wartość liczbową (tylko liczby, bez przecinka).",
                  // };

                  cell.protection = {
                    locked: true, // Oznacza komórkę jako zablokowaną
                  };
                }
              });
          }
          if (worksheet.getColumn("B")) {
            // Iteracja przez komórki, zaczynając od drugiego wiersza
            worksheet
              .getColumn("B")
              .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                // Sprawdzamy, czy to nie jest pierwszy wiersz (nagłówek)
                if (rowNumber > 1) {
                  // cell.numFmt = "#,##0";

                  cell.dataValidation = {
                    type: "whole", // Możliwe wartości: 'whole', 'decimal', 'list', 'date', 'time', 'textLength', 'custom'
                    operator: "between", // Możliwe wartości: 'between', 'notBetween', 'equal', 'notEqual', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'
                    formula1: 0, // Minimalna wartość
                    formula2: 1000000, // Maksymalna wartość (możesz ustawić na wartość, którą potrzebujesz)
                    showErrorMessage: true,
                    errorTitle: "Nieprawidłowa wartość",
                    error:
                      "Proszę wprowadzić wartość liczbową (tylko liczby, bez przecinka).",
                  };
                }
              });
          }

          if (worksheet.getColumn("E")) {
            worksheet.getColumn("E").width = 20;

            worksheet
              .getColumn("E")
              .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                if (rowNumber > 1) {
                  cell.dataValidation = {
                    type: "list",
                    allowBlank: false,
                    operator: "equal",
                    formulae: [`"${areas.join(",")}"`],
                    showErrorMessage: true,
                    errorStyle: "stop",
                    errorTitle: "Nieprawidłowa wartość",
                    error: "Wartość musi zostać wybrana z listy",
                  };
                }
              });
          }
          if (worksheet.getColumn("F")) {
            worksheet.getColumn("F").width = 20;

            worksheet
              .getColumn("F")
              .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                if (rowNumber > 1) {
                  // const cellValue = cell.value;
                  // const [displayValue, isValid] = cellValue;
                  // // Ustawiamy wyświetlaną wartość tylko na pierwszy element tablicy
                  // cell.value = displayValue;

                  cell.dataValidation = {
                    type: "list",
                    allowBlank: false,
                    operator: "equal",
                    formulae: [`"${formOfPayment.join(",")}"`],
                    showErrorMessage: true,
                    errorStyle: "stop",
                    errorTitle: "Nieprawidłowa wartość",
                    error: "Wartość musi zostać wybrana z listy",
                  };
                }
              });
          }

          if (worksheet.getColumn("G")) {
            // Iteracja przez komórki, zaczynając od drugiego wiersza
            worksheet
              .getColumn("G")
              .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                // Sprawdzamy, czy to nie jest pierwszy wiersz (nagłówek)
                if (rowNumber > 1) {
                  cell.numFmt = "#,##0";

                  cell.dataValidation = {
                    type: "whole", // Możliwe wartości: 'whole', 'decimal', 'list', 'date', 'time', 'textLength', 'custom'
                    operator: "between", // Możliwe wartości: 'between', 'notBetween', 'equal', 'notEqual', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'
                    formula1: 0, // Minimalna wartość
                    formula2: 1000000, // Maksymalna wartość (możesz ustawić na wartość, którą potrzebujesz)
                    showErrorMessage: true,
                    errorTitle: "Nieprawidłowa wartość",
                    error:
                      "Proszę wprowadzić wartość liczbową (tylko liczby, bez przecinka).",
                  };
                }
              });
          }
          if (worksheet.getColumn("I")) {
            // Iteracja przez komórki, zaczynając od drugiego wiersza
            worksheet
              .getColumn("I")
              .eachCell({ includeEmpty: true }, (cell, rowNumber) => {
                // Sprawdzamy, czy to nie jest pierwszy wiersz (nagłówek)
                if (rowNumber > 1) {
                  cell.numFmt = "#,##0";

                  cell.dataValidation = {
                    type: "whole", // Możliwe wartości: 'whole', 'decimal', 'list', 'date', 'time', 'textLength', 'custom'
                    operator: "between", // Możliwe wartości: 'between', 'notBetween', 'equal', 'notEqual', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'
                    formula1: 0, // Minimalna wartość
                    formula2: 1000000, // Maksymalna wartość (możesz ustawić na wartość, którą potrzebujesz)
                    showErrorMessage: true,
                    errorTitle: "Nieprawidłowa wartość",
                    error:
                      "Proszę wprowadzić wartość liczbową (tylko liczby, bez przecinka).",
                  };
                }
              });
          }
        });

        // Dodanie autofilter
        worksheet.autoFilter = {
          from: { row: 1, column: 1 },
          to: { row: 1, column: columnsContractor.length },
        };

        // Zamrożenie pierwszej kolumny i pierwszych 2 wierszy
        worksheet.views = [{ state: "frozen", xSplit: 1, ySplit: 1 }];

        // Ochrona arkusza, aby zablokowane komórki były faktycznie chronione
        worksheet.protect("windykacja", {
          selectLockedCells: true, // Umożliwia zaznaczanie zablokowanych komórek
          selectUnlockedCells: true, // Umożliwia zaznaczanie niezablokowanych komórek
          formatCells: false, // Zakaz formatowania komórek
          formatColumns: false, // Zakaz formatowania kolumn
          formatRows: false, // Zakaz formatowania wierszy
          insertColumns: false, // Zakaz wstawiania kolumn
          insertRows: false, // Zakaz wstawiania wierszy
          deleteColumns: false, // Zakaz usuwania kolumn
          deleteRows: false, // Zakaz usuwania wierszy
          autoFilter: true, // Umożliwia korzystanie z autofilter
          sort: true, // Umożliwia sortowanie
        });
      }
    }

    // Zapisz plik
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "Kredyt Kupiecki.xlsx");
  } catch (err) {
    console.error(err);
  }
};
