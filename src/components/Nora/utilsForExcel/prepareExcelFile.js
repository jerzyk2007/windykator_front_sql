import XLSX from "xlsx-js-style";

// wersja bez dodatkowych wierszy nad tabelą

export const getExcelRaport = (cleanData, settingsColumn) => {
  try {
    const wb = XLSX.utils.book_new();
    try {
      cleanData.forEach((obj) => {
        const reorderedData = obj.data.map((item) => {
          const reorderedItem = {};
          settingsColumn.forEach((key) => {
            reorderedItem[key] = item[key] !== undefined ? item[key] : "";
          });
          return reorderedItem;
        });

        const ws = XLSX.utils.json_to_sheet(reorderedData, {
          header: settingsColumn,
        });

        XLSX.utils.book_append_sheet(wb, ws, obj.name);

        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cell = XLSX.utils.encode_cell({ r: 0, c: col });
          ws[cell].s = { ...ws[cell].s, font: { bold: true } };
        }

        // Ustawienie szerokości kolumny
        for (let i = range.s.c; i <= range.e.c; i++) {
          ws["!cols"] = ws["!cols"] || [];
          ws["!cols"][i] = { wch: 22 };
        }

        // Ustawienie szerokości kolumny na 30, jeśli zawartość komórki wymaga zawijania tekstu
        for (let row = range.s.r; row <= range.e.r; row++) {
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cell = XLSX.utils.encode_cell({ r: row, c: col });
            if (ws[cell] && ws[cell].v && typeof ws[cell].v === "string") {
              const cellWidth = ws[cell].v.length * 8;
              if (cellWidth > 240) {
                ws["!cols"][col] = { wch: 30 };
              }
            }
          }
        }

        ws["!autofilter"] = { ref: XLSX.utils.encode_range(range) };

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
          };
        }

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
                numFmt: "#,##0.00",
                // numFmt: "# ##0.00",
              };
            }
          }
        }
      });

      XLSX.writeFile(wb, "Raport Nora Kody.xlsx");
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
};
