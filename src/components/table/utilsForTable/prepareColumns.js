import { format } from "date-fns";

// export const muiTableBodyCellProps = {
const muiTableBodyCellProps = {
  align: "center",

  sx: {
    fontFamily: "Calibri, sans-serif",
    fontSize: "15px",
    borderRight: "1px solid rgba(99, 99, 99, .8)",
    borderTop: "1px solid rgba(99, 99, 99, .8)",
    fontWeight: "500",
    minHeight: "65px",
    textWrap: "balance",
    whiteSpace: "pre-wrap",
    backgroundColor: null,
  },
};

// funkcja dla przekształcenia danychj z kolumn KANAL_KOMUNIKACJI
const kanalKomunikacjiColumnConfig = (muiTableBodyCellProps = {}) => ({
  accessorFn: (originalRow) => {
    const arrayData = originalRow?.KANAL_KOMUNIKACJI;
    if (!arrayData) return "";

    try {
      let dzialania;

      if (!Array.isArray(arrayData) || arrayData.length === 0) {
        dzialania = "";
      } else if (arrayData.length === 1) {
        const e = arrayData[0];
        dzialania = [e.date, e.username, e.note].filter(Boolean).join(" - ");
      } else {
        const last = arrayData[arrayData.length - 1];

        const lastLine = [
          last.date ? `${last.date} -` : "",
          last.username ? `${last.username} -` : "",
          last.note || "",
        ]
          .filter(Boolean)
          .join(" ");

        dzialania =
          `Liczba wcześniejszych wpisów: ${arrayData.length - 1}\n` + lastLine;
      }

      let maxEnters = 2;
      let countEnters = 0;
      let truncated = "";

      for (let char of dzialania) {
        if (char === "\n") {
          countEnters++;
          if (countEnters > maxEnters) break;
        }
        if (truncated.length >= 150) break;
        truncated += char;
      }

      return truncated.length < dzialania.length ? truncated + " …" : truncated;
    } catch {
      return "Brak wpisów";
    }
  },

  muiTableBodyCellProps: {
    align: "left",
    sx: {
      ...muiTableBodyCellProps.sx,
      textWrap: "none",
    },
  },
});

// przygotowanie kolumn tabeli dla permissions=Pracownik
export const prepareColumnsInsider = (columnsData) => {
  const update = columnsData.map((item) => {
    const modifiedItem = { ...item };

    modifiedItem.muiTableBodyCellProps = muiTableBodyCellProps;

    if (item.filterVariant === "date-range") {
      modifiedItem.accessorFn = (originalRow) => {
        const date = new Date(originalRow[item.accessorKey]);
        // ustaw godzinę na początek dnia, by uniknąć problemów z filtrowaniem
        date.setHours(0, 0, 0, 0);
        return date;
      };

      modifiedItem.Cell = ({ cell }) => {
        // Parsowanie wartości komórki jako data
        const date = new Date(cell.getValue());
        // Sprawdzenie, czy data jest prawidłowa
        if (!isNaN(date)) {
          return format(date, "yyyy-MM-dd");
        } else {
          // Jeśli data jest nieprawidłowa, zwracamy pusty string lub inny komunikat błędu
          return "brak danych";
        }
      };
    }

    if (
      item.accessorKey === "UWAGI_Z_FAKTURY" ||
      item.accessorKey === "STATUS_SPRAWY_KANCELARIA" ||
      item.accessorKey === "OPIS_ROZRACHUNKU"
    ) {
      modifiedItem.Cell = ({ cell }) => {
        const cellValue = cell.getValue();
        if (typeof cellValue === "string" && cellValue.length > 150) {
          return cellValue.slice(0, 150) + " ...";
        }
        return cellValue;
      };
    }

    if (item.accessorKey === "KONTRAHENT") {
      modifiedItem.muiTableBodyCellProps = ({ cell }) => {
        // const cellValue = cell.getValue();
        const checkClient = cell.row.original.ZAZNACZ_KONTRAHENTA;

        return {
          align: "left",
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor:
              cell.column.id === "KONTRAHENT" && checkClient === "TAK"
                ? "#7fffd4"
                : "white",
          },
        };
      };
      modifiedItem.filterFn = "contains";
    }

    if (item.accessorKey === "ZAZNACZ_KONTRAHENTA") {
      modifiedItem.Cell = ({ cell, row }) => {
        const cellValue = cell.getValue();

        // Jeśli wartość komórki jest null, wyświetl "NIE", w przeciwnym razie wyświetl wartość
        const displayValue = cellValue === null ? "NIE" : cellValue;

        return displayValue;
      };
    }

    if (item.accessorKey === "ILE_DNI_PO_TERMINIE") {
      modifiedItem.muiTableBodyCellProps = ({ cell }) => ({
        ...muiTableBodyCellProps,
        sx: {
          ...muiTableBodyCellProps.sx,
          backgroundColor:
            cell.column.id === "ILE_DNI_PO_TERMINIE" && cell.getValue() > 0
              ? "rgb(250, 136, 136)"
              : "white",
        },
      });
    }

    if (item.accessorKey === "DO_ROZLICZENIA") {
      modifiedItem.muiTableBodyCellProps = ({ cell }) => ({
        ...muiTableBodyCellProps,
        sx: {
          ...muiTableBodyCellProps.sx,
          backgroundColor: "rgba(248, 255, 152, .2)",
        },
      });
    }

    if (item.accessorKey === "OSTATECZNA_DATA_ROZLICZENIA") {
      modifiedItem.accessorFn = (originalRow) => {
        return originalRow[item.accessorKey]
          ? originalRow[item.accessorKey]
          : "BRAK";
      };
    }

    if (item.accessorKey === "NR_SZKODY") {
      modifiedItem.accessorFn = (originalRow) => {
        return originalRow[item.accessorKey]
          ? originalRow[item.accessorKey]
          : "";
      };
    }

    if (item.accessorKey === "NR_REJESTRACYJNY") {
      modifiedItem.accessorFn = (originalRow) => {
        return originalRow[item.accessorKey]
          ? originalRow[item.accessorKey]
          : "";
      };
    }

    if (item.accessorKey === "KRD") {
      modifiedItem.accessorFn = (originalRow) => {
        return originalRow[item.accessorKey]
          ? originalRow[item.accessorKey]
          : "BRAK";
      };
    }
    if (item.accessorKey === "VAT_50") {
      console.log(item);
      modifiedItem.muiTableBodyCellProps = ({ cell }) => {
        const cellValue = cell.getValue();
        const dorozliczValue = cell.row.original.DO_ROZLICZENIA;

        return {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor:
              cell.column.id === "VAT_50" &&
              Math.abs(cellValue - dorozliczValue) <= 1
                ? "rgb(250, 136, 136)"
                : "white",
          },
        };
      };
    }
    console.log(item);

    if (item.accessorKey === "VAT_100") {
      modifiedItem.muiTableBodyCellProps = ({ cell }) => {
        const cellValue = cell.getValue();
        const dorozliczValue = cell.row.original.DO_ROZLICZENIA;
        return {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor:
              cell.column.id === "VAT_100" &&
              Math.abs(cellValue - dorozliczValue) <= 1
                ? "rgb(250, 136, 136)"
                : "white",
          },
        };
      };
    }

    if (item.accessorKey === "INFORMACJA_ZARZAD") {
      modifiedItem.accessorFn = (originalRow) => {
        const arrayData = originalRow.INFORMACJA_ZARZAD;

        if (!Array.isArray(arrayData) || arrayData.length === 0) return "BRAK";

        const last = arrayData[arrayData.length - 1];
        return typeof last === "string"
          ? last.length > 90
            ? last.slice(0, 90) + " …"
            : last
          : "BRAK";
      };
    }

    if (item.accessorKey === "KANAL_KOMUNIKACJI") {
      const kanalConfig = kanalKomunikacjiColumnConfig(muiTableBodyCellProps);

      modifiedItem.accessorFn = kanalConfig.accessorFn;
      modifiedItem.muiTableBodyCellProps = kanalConfig.muiTableBodyCellProps;
    }

    if (item.filterVariant === "none") {
      modifiedItem.enableColumnFilter = false;
      delete modifiedItem.filterVariant;
    }

    if (item.type === "money") {
      modifiedItem.Cell = ({ cell }) => {
        const value = cell.getValue();

        const formattedSalary =
          value !== undefined && value !== null && value !== 0
            ? value.toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })
            : "0,00";

        return formattedSalary;
      };
    }
    if (item.accessorKey === "KWOTA_WINDYKOWANA_BECARED") {
      modifiedItem.accessorFn = (originalRow) => {
        return originalRow[item.accessorKey] !== null &&
          originalRow[item.accessorKey] !== undefined
          ? originalRow[item.accessorKey]
          : ""; // Jeżeli wartość jest null lub undefined, zwracamy 'BRAK'
      };

      modifiedItem.Cell = ({ cell }) => {
        const value = cell.getValue();

        // Sprawdzenie, czy wartość jest liczbą
        const formattedValue =
          typeof value === "number"
            ? value.toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })
            : value; // Wartość pozostaje bez zmian, jeśli to nie liczba (np. 'BRAK')

        return formattedValue; // Zwracamy sformatowaną wartość
      };
    }
    modifiedItem.columnFilterModeOptions = [];
    delete modifiedItem.type;
    return modifiedItem;
  });
  return update;
};

// przygotowanie kolumn tabeli dla permissions=Kancelaria
export const prepareColumnsPartner = (columnsData) => {
  const update = columnsData.map((item) => {
    const modifiedItem = { ...item };
    modifiedItem.muiTableBodyCellProps = muiTableBodyCellProps;

    if (item.filterVariant === "date-range") {
      modifiedItem.accessorFn = (originalRow) => {
        if (originalRow[item.accessorKey]) {
          const date = new Date(originalRow[item.accessorKey]);
          // ustaw godzinę na początek dnia, by uniknąć problemów z filtrowaniem
          date.setHours(0, 0, 0, 0);
          return date;
        }
        return null;
      };

      modifiedItem.Cell = ({ cell }) => {
        // Parsowanie wartości komórki jako data
        if (cell.getValue()) {
          const date = new Date(cell.getValue());
          // Sprawdzenie, czy data jest prawidłowa
          if (!isNaN(date)) {
            return format(date, "yyyy-MM-dd");
          }
        }
        return null;
      };
    }

    if (item.accessorKey === "KANAL_KOMUNIKACJI") {
      const kanalConfig = kanalKomunikacjiColumnConfig(muiTableBodyCellProps);

      modifiedItem.accessorFn = kanalConfig.accessorFn;
      modifiedItem.muiTableBodyCellProps = kanalConfig.muiTableBodyCellProps;
    }

    if (item.accessorKey === "KONTRAHENT") {
      modifiedItem.muiTableBodyCellProps = ({ cell }) => {
        return {
          align: "left",
          sx: {
            ...muiTableBodyCellProps.sx,
          },
        };
      };
      modifiedItem.filterFn = "contains";
    }

    if (item.accessorKey === "KWOTA_ROSZCZENIA_DO_KANCELARII") {
      modifiedItem.muiTableBodyCellProps = ({ cell }) => ({
        ...muiTableBodyCellProps,
        sx: {
          ...muiTableBodyCellProps.sx,
          backgroundColor: "rgba(248, 255, 152, .2)",
        },
      });
    }

    if (item.accessorKey === "ODDZIAL") {
      modifiedItem.accessorFn = (originalRow) => {
        return `${originalRow?.ODDZIAL?.LOKALIZACJA || ""} ${
          originalRow?.ODDZIAL?.DZIAL || ""
        } ${originalRow?.ODDZIAL?.OBSZAR || ""}`.trim();
      };
    }
    if (item.accessorKey === "OPIS_DOKUMENTU") {
      modifiedItem.accessorFn = (originalRow) => {
        return originalRow[item.accessorKey]
          ? originalRow[item.accessorKey]
          : "BRAK";
      };
    }

    if (item.accessorKey === "WYKAZ_SPLACONEJ_KWOTY_FK") {
      modifiedItem.accessorFn = (originalRow) => {
        return originalRow?.WYKAZ_SPLACONEJ_KWOTY_FK || [];
      };
      modifiedItem.muiTableBodyCellProps = {
        align: "left",
        sx: {
          ...muiTableBodyCellProps.sx,
        },
      };
      modifiedItem.enableClickToCopy = false;
      modifiedItem.Cell = ({ cell }) => {
        const wykaz = cell.getValue() || [];

        if (!wykaz.length) {
          return "BRAK";
        }

        // funkcja do formatowania kwoty
        const formatKwota = (kwota) =>
          kwota !== undefined && kwota !== null && kwota !== 0
            ? kwota.toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })
            : "0,00";

        // bierzemy pierwszy wpis
        const first = wykaz[0];

        const firstFormatted = (
          <>
            <span style={{ color: "blue", fontWeight: 600 }}>{first.data}</span>
            {" - "}
            <span style={{ color: "rgb(162, 0, 255)", fontWeight: 600 }}>
              {formatKwota(first.kwota)}
            </span>
            {" - "}
            <span>{first.symbol}</span>
          </>
        );

        // jeśli więcej niż 1 wpłata → wyświetlamy licznik + pierwszy wpis
        if (wykaz.length > 1) {
          return (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 700 }}>
                Łączna liczba wpłat: {wykaz.length}
              </span>
              <div>Ostatnia wpłata:</div>
              <div>{firstFormatted}</div>
            </div>
          );
        }

        // jeśli tylko 1 wpis → wyświetlamy normalnie
        return <div>{firstFormatted}</div>;
      };
    }

    if (item.filterVariant === "none") {
      modifiedItem.enableColumnFilter = false;
      delete modifiedItem.filterVariant;
    }

    if (item.type === "money") {
      modifiedItem.Cell = ({ cell }) => {
        const value = cell.getValue();

        const formattedSalary =
          value !== undefined && value !== null && value !== 0
            ? value.toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })
            : "0,00";

        return formattedSalary;
      };
    }

    modifiedItem.columnFilterModeOptions = [];
    delete modifiedItem.type;
    return modifiedItem;
  });
  return update;
};

// przygotowanie kolumn tabeli dla polis
export const prepareColumnsInsurance = (columnsData) => {
  const update = columnsData.map((item) => {
    const modifiedItem = { ...item };
    modifiedItem.muiTableBodyCellProps = muiTableBodyCellProps;

    if (item.filterVariant === "date-range") {
      modifiedItem.accessorFn = (originalRow) => {
        if (originalRow[item.accessorKey]) {
          const date = new Date(originalRow[item.accessorKey]);
          // ustaw godzinę na początek dnia, by uniknąć problemów z filtrowaniem
          date.setHours(0, 0, 0, 0);
          return date;
        }
        return null;
      };

      modifiedItem.Cell = ({ cell }) => {
        // Parsowanie wartości komórki jako data
        if (cell.getValue()) {
          const date = new Date(cell.getValue());
          // Sprawdzenie, czy data jest prawidłowa
          if (!isNaN(date)) {
            return format(date, "yyyy-MM-dd");
          }
        }
        return null;
      };
    }

    if (item.accessorKey === "KANAL_KOMUNIKACJI") {
      const kanalConfig = kanalKomunikacjiColumnConfig(muiTableBodyCellProps);

      modifiedItem.accessorFn = kanalConfig.accessorFn;
      modifiedItem.muiTableBodyCellProps = kanalConfig.muiTableBodyCellProps;
    }

    if (item.accessorKey === "KONTRAHENT_NAZWA") {
      modifiedItem.muiTableBodyCellProps = ({ cell }) => {
        return {
          align: "left",
          sx: {
            ...muiTableBodyCellProps.sx,
          },
        };
      };
      modifiedItem.filterFn = "contains";
    }

    if (item.accessorKey === "NALEZNOSC") {
      modifiedItem.muiTableBodyCellProps = ({ cell }) => ({
        ...muiTableBodyCellProps,
        sx: {
          ...muiTableBodyCellProps.sx,
          backgroundColor: "rgba(248, 255, 152, .2)",
        },
      });
    }

    if (item.accessorKey === "ODDZIAL") {
      modifiedItem.accessorFn = (originalRow) => {
        return `${originalRow?.ODDZIAL?.LOKALIZACJA || ""} ${
          originalRow?.ODDZIAL?.DZIAL || ""
        } ${originalRow?.ODDZIAL?.OBSZAR || ""}`.trim();
      };
    }
    if (item.accessorKey === "OPIS_DOKUMENTU") {
      modifiedItem.accessorFn = (originalRow) => {
        return originalRow[item.accessorKey]
          ? originalRow[item.accessorKey]
          : "BRAK";
      };
    }

    if (item.accessorKey === "OSOBA_ZLECAJACA_WINDYKACJE") {
      modifiedItem.muiTableBodyCellProps = () => ({
        ...muiTableBodyCellProps,
        sx: {
          ...muiTableBodyCellProps.sx,
          wordBreak: " break-all",
        },
      });
    }

    if (item.filterVariant === "none") {
      modifiedItem.enableColumnFilter = false;
      delete modifiedItem.filterVariant;
    }

    if (item.type === "money") {
      modifiedItem.Cell = ({ cell }) => {
        const value = cell.getValue();

        const formattedSalary =
          value !== undefined && value !== null && value !== 0
            ? value.toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })
            : "0,00";

        return formattedSalary;
      };
    }

    modifiedItem.columnFilterModeOptions = [];
    delete modifiedItem.type;
    return modifiedItem;
  });
  return update;
};
