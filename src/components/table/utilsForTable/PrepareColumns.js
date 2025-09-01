import { format } from "date-fns";

export const muiTableBodyCellProps = {
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
  },
};

export const prepareColumns = (columnsData, data) => {
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

    if (item.accessorKey === "UWAGI_ASYSTENT") {
      modifiedItem.Cell = ({ cell }) => {
        const cellValue = cell.getValue();
        if (Array.isArray(cellValue) && cellValue.length > 0) {
          let numberOfObjects = cellValue.length;
          return (
            <div style={{ whiteSpace: "pre-wrap" }}>
              {numberOfObjects > 1 && (
                <p>{`Liczba wpisów wcześniejszych: ${numberOfObjects - 1}`}</p>
              )}
              {cellValue.map((item, index) => (
                <p key={index}>
                  {
                    index === cellValue.length - 1 // Sprawdzanie czy to ostatni element w tablicy
                      ? item.length > 200 // Sprawdzenie długości tekstu
                        ? item.slice(0, 200) + "..." // Jeśli tekst jest dłuższy niż 150 znaków, obetnij i dodaj trzy kropki na końcu
                        : item // W przeciwnym razie, wyświetl pełny tekst
                      : null // W przeciwnym razie, nie wyświetlaj nic
                  }
                </p>
              ))}
            </div>
          );
        } else {
          <p>Brak</p>;
        }
      };

      const changeMuiTableBodyCellProps = { ...muiTableBodyCellProps };
      changeMuiTableBodyCellProps.align = "left";
      const updatedSx = { ...changeMuiTableBodyCellProps.sx };
      updatedSx.backgroundColor = "rgba(248, 255, 152, .2)";
      changeMuiTableBodyCellProps.sx = updatedSx;
      modifiedItem.muiTableBodyCellProps = changeMuiTableBodyCellProps;
      modifiedItem.enableClickToCopy = false;
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
    // if (item.accessorKey === "UWAGI_Z_FAKTURY") {
    //   modifiedItem.Cell = ({ cell }) => {
    //     const cellValue = cell.getValue();
    //     if (Array.isArray(cellValue) && cellValue.length > 0) {
    //       return (
    //         <div style={{ whiteSpace: "pre-wrap" }}>
    //           {cellValue.map((item, index) => (
    //             <p key={index}>{item}</p>
    //           ))}
    //         </div>
    //       );
    //     }
    //   };
    //   const changeMuiTableBodyCellProps = { ...muiTableBodyCellProps };
    //   changeMuiTableBodyCellProps.align = "left";
    //   modifiedItem.muiTableBodyCellProps = changeMuiTableBodyCellProps;
    // }

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
    }

    // if (item.accessorKey === "ZAZNACZ_KONTRAHENTA") {
    //   modifiedItem.Cell = ({ cell, row }) => {
    //     const cellValue = cell.getValue();

    //     return <span>{cellValue}</span>;
    //   };
    // }

    if (item.accessorKey === "ZAZNACZ_KONTRAHENTA") {
      modifiedItem.Cell = ({ cell, row }) => {
        const cellValue = cell.getValue();

        // Jeśli wartość komórki jest null, wyświetl "NIE", w przeciwnym razie wyświetl wartość
        const displayValue = cellValue === null ? "NIE" : cellValue;

        return <span>{displayValue}</span>;
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

    if (item.accessorKey === "50_VAT") {
      modifiedItem.muiTableBodyCellProps = ({ cell }) => {
        const cellValue = cell.getValue();
        const dorozliczValue = cell.row.original.DO_ROZLICZENIA;

        return {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor:
              cell.column.id === "50_VAT" &&
              Math.abs(cellValue - dorozliczValue) <= 1
                ? "rgb(250, 136, 136)"
                : "white",
          },
        };
      };
    }

    if (item.accessorKey === "100_VAT") {
      modifiedItem.muiTableBodyCellProps = ({ cell }) => {
        const cellValue = cell.getValue();
        const dorozliczValue = cell.row.original.DO_ROZLICZENIA;
        return {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor:
              cell.column.id === "100_VAT" &&
              Math.abs(cellValue - dorozliczValue) <= 1
                ? "rgb(250, 136, 136)"
                : "white",
          },
        };
      };
    }

    if (item.filterVariant === "none") {
      modifiedItem.enableColumnFilter = false;
      delete modifiedItem.filterVariant;
    }

    if (item.filterVariant === "range-slider") {
      modifiedItem.muiFilterSliderProps = {
        marks: true,
        max: data.reduce(
          (max, key) => Math.max(max, key[item.accessorKey]),
          Number.NEGATIVE_INFINITY
        ),
        min: data.reduce(
          (min, key) => Math.min(min, key[item.accessorKey]),
          Number.POSITIVE_INFINITY
        ),
        step: 100,
        valueLabelFormat: (value) =>
          value.toLocaleString("pl-PL", {
            style: "currency",
            currency: "PLN",
          }),
      };
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

    // if (item.accessorKey === "KWOTA_WINDYKOWANA_BECARED") {
    //   modifiedItem.accessorFn = (originalRow) => {
    //     return originalRow[item.accessorKey]
    //       ? originalRow[item.accessorKey]
    //       : " ";
    //   };
    //   modifiedItem.Cell = ({ cell }) => {
    //     const value = cell.getValue();
    //     const formattedSalary =
    //       value !== undefined && value !== null && value !== 0
    //         ? value.toLocaleString("pl-PL", {
    //           minimumFractionDigits: 2,
    //           maximumFractionDigits: 2,
    //           useGrouping: true,
    //         })
    //         : "0,00"; // Zastąp puste pola zerem

    //     return `${formattedSalary}`;
    //   };
    // }
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

        return <span>{formattedValue}</span>; // Zwracamy sformatowaną wartość
      };
    }

    delete modifiedItem.type;
    return modifiedItem;
  });
  return update;
};
