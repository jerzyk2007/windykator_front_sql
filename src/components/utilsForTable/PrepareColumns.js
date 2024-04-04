const muiTableBodyCellProps = {
  align: "center",
  sx: {
    fontSize: "16px",
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000",
    fontFamily: "Calibri",
    padding: "5px",
    fontWeight: "500",
    minHeight: "2rem",
    // maxHeight: "8rem",
    textWrap: "balance",
    whiteSpace: "pre-wrap",
  },
};

export const prepareColumns = (columnsData, data) => {
  const changeColumn = columnsData.map((item) => {
    const modifiedItem = { ...item };

    modifiedItem.muiTableBodyCellProps = muiTableBodyCellProps;

    if (item.filterVariant === "startsWith") {
      modifiedItem.filterFn = "startsWith";
    }

    if (item.filterVariant === "date-range") {
      modifiedItem.accessorFn = (originalRow) =>
        new Date(originalRow[item.accessorKey]);
      modifiedItem.Cell = ({ cell }) =>
        cell.getValue().toLocaleDateString("pl-PL", {
          useGrouping: true,
        });
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
        }
      };

      const changeMuiTableBodyCellProps = { ...muiTableBodyCellProps };
      changeMuiTableBodyCellProps.align = "left";
      const updatedSx = { ...changeMuiTableBodyCellProps.sx };
      updatedSx.backgroundColor = "rgba(248, 255, 152, .2)";
      changeMuiTableBodyCellProps.sx = updatedSx;
      modifiedItem.muiTableBodyCellProps = changeMuiTableBodyCellProps;
    }

    if (item.accessorKey === "UWAGI_Z_FAKTURY") {
      modifiedItem.Cell = ({ cell }) => {
        const cellValue = cell.getValue();
        if (Array.isArray(cellValue) && cellValue.length > 0) {
          return (
            <div style={{ whiteSpace: "pre-wrap" }}>
              {cellValue.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          );
        }
      };
      const changeMuiTableBodyCellProps = { ...muiTableBodyCellProps };
      changeMuiTableBodyCellProps.align = "left";
      modifiedItem.muiTableBodyCellProps = changeMuiTableBodyCellProps;
    }

    if (item.accessorKey === "KONTRAHENT") {
      modifiedItem.muiTableBodyCellProps = ({ cell }) => {
        const cellValue = cell.getValue();
        const checkClient = cell.row.original.ZAZNACZ_KONTRAHENTA;

        return {
          align: "left",
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor:
              cell.column.id === "KONTRAHENT" && checkClient === "Tak"
                ? "#7fffd4"
                : "white",
          },
        };
      };
    }

    if (item.accessorKey === "ZAZNACZ_KONTRAHENTA") {
      modifiedItem.Cell = ({ cell, row }) => {
        const cellValue = cell.getValue();

        return <span>{cellValue}</span>;
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
          value !== undefined && value !== null
            ? value.toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })
            : "0,00"; // Zastąp puste pola zerem

        return `${formattedSalary}`;
      };
    }

    delete modifiedItem.type;
    return modifiedItem;
  });
  return changeColumn;
};
