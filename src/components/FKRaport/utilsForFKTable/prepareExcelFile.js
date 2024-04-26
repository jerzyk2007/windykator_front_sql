export const getExcelRaport = async (
  buttonArea,
  XLSX,
  axiosPrivateIntercept
) => {
  const cleanData = buttonArea.map((doc) => {
    const update = doc.data.map((item) => {
      const { OPIEKUN_OBSZARU_CENTRALI, OPIS_ROZRACHUNKU, OWNER, ...cleanDoc } =
        item;

      return {
        ...cleanDoc,
        OPIEKUN_OBSZARU_CENTRALI: Array.isArray(OPIEKUN_OBSZARU_CENTRALI)
          ? OPIEKUN_OBSZARU_CENTRALI.join(", ")
          : OPIEKUN_OBSZARU_CENTRALI,
        OPIS_ROZRACHUNKU: Array.isArray(OPIS_ROZRACHUNKU)
          ? OPIS_ROZRACHUNKU.join(", ")
          : OPIS_ROZRACHUNKU,
        OWNER: Array.isArray(OWNER) ? OWNER.join(", ") : OWNER,
      };
    });
    return {
      name: doc.name,
      data: update,
    };
  });
  try {
    const settingsColumn = await axiosPrivateIntercept.get(
      "/fk/get-columns-order"
    );

    const changeNameColumns = cleanData.map((doc) => {
      const update = doc.data.map((item) => {
        const newItem = {};
        for (const column of settingsColumn.data.columns) {
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
          settingsColumn.data.order.forEach((key) => {
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
            fill: { fgColor: { rgb: "FFFF00" } },
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
            }; // Zawijanie wierszy
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
          const rowObject = XLSX.utils.encode_row(row);
          ws["!rows"] = ws["!rows"] || [];
          ws["!rows"][rowObject] = {
            hpt: rowHeight * 0.75, // Konwersja pikseli na punkty (1 piksel ≈ 0.75 punkta)
            hpx: rowHeight,
          };
        }
      });

      // Zapisywanie arkusza roboczego do pliku
      XLSX.writeFile(wb, "Raport.xlsx");
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
};
