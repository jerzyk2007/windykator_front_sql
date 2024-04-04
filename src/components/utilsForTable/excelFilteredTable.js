import * as xlsx from "xlsx";

// Funkcja sortująca
const sortColumns = (columns, pinning) => {
  const leftPinned = pinning.left || [];
  const rightPinned = pinning.right || [];

  const sortedColumns = [...columns];

  // Sortowanie kolumn przypiętych z lewej strony
  sortedColumns.sort((a, b) => {
    const aIndex = leftPinned.indexOf(a);
    const bIndex = leftPinned.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    } else if (aIndex !== -1) {
      return -1;
    } else if (bIndex !== -1) {
      return 1;
    }
    return 0;
  });

  // Sortowanie kolumn przypiętych z prawej strony
  sortedColumns.sort((a, b) => {
    const aIndex = rightPinned.indexOf(a);
    const bIndex = rightPinned.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    } else if (aIndex !== -1) {
      return 1;
    } else if (bIndex !== -1) {
      return -1;
    }
    return 0;
  });

  return sortedColumns;
};

export const handleExportRows = (
  rows,
  columnOrder,
  columnVisibility,
  columnPinning,
  columns
) => {
  const rowData = rows.map((row) => row.original);

  const orderColumns = [...columnOrder].filter(
    (item) => item !== "mrt-row-spacer"
  );

  const arrayColumns = orderColumns.filter(
    (item) => columnVisibility[item] !== false
  );

  const cleanData = rowData.map((doc) => {
    const { _id, __v, UWAGI_ASYSTENT, UWAGI_Z_FAKTURY, ...cleanDoc } = doc;
    if (Array.isArray(UWAGI_ASYSTENT)) {
      cleanDoc.UWAGI_ASYSTENT = UWAGI_ASYSTENT.join(", ");
    }
    if (Array.isArray(UWAGI_Z_FAKTURY)) {
      cleanDoc.UWAGI_Z_FAKTURY = UWAGI_Z_FAKTURY.join(", ");
    }
    return cleanDoc;
  });

  // wywołanie funkcji która posortuje kolumny wg ustaiweń usera, order/pining
  const sortedColumns = sortColumns(arrayColumns, columnPinning);

  // funkcja usuwa z danych kolumny które nie sa widoczne
  const filteredData = cleanData.map((obj) => {
    return Object.keys(obj)
      .filter((key) => arrayColumns.includes(key))
      .reduce((acc, key) => {
        // Sprawdź, czy klucz znajduje się w mapowaniu
        const mappedKey = columns.find((col) => col.accessorKey === key);
        // Jeśli klucz został znaleziony, użyj nowej nazwy klucza (header)
        const newKey = mappedKey ? mappedKey.header : key;

        acc[newKey] = obj[key];
        return acc;
      }, {});
  });

  // Utwórz nową tablicę z nagłówkami zamiast kluczy w sortedColumns
  const newSortedColumns = sortedColumns.map((key) => {
    const column = columns.find((col) => col.accessorKey === key);
    return column ? column.header : key;
  });

  //   // Stwórz nowy arkusz Excel
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet([newSortedColumns]);

  //   Przetwórz każdy obiekt i dodaj wiersze do arkusza w odpowiedniej kolejności
  filteredData.forEach((rowData) => {
    const newRow = newSortedColumns.map((col) => {
      return rowData[col];
    });
    xlsx.utils.sheet_add_aoa(ws, [newRow], { origin: -1 });
  });
  xlsx.utils.book_append_sheet(wb, ws, "Tabela");
  xlsx.writeFile(wb, "Tabela.xlsx");
};
