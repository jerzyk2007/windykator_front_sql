import { useState, useMemo, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_PL } from "material-react-table/locales/pl";
import useWindowSize from "../hooks/useWindow";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { plPL } from "@mui/x-date-pickers/locales";
import { ThemeProvider, useTheme } from "@mui/material";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import {
  preparedFKColumns,
  muiTableBodyCellProps,
  preparedData,
} from "./utilsForFKTable/prepareFKColumns";
import { getAllDataRaport } from "../utilsForTable/excelFilteredTable";

import "./FKTable.css";

const FKTable = ({ tableData, setShowTable }) => {
  const theme = useTheme();
  const { height } = useWindowSize();
  const [data, setData] = useState([]);
  const [tableSize, setTableSize] = useState("");
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [columnItems, setColumnItems] = useState(preparedFKColumns);

  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnSizing, setColumnSizing] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);
  const [columnPinning, setColumnPinning] = useState({});
  const [pagination, setPagination] = useState({});

  const plLocale =
    plPL.components.MuiLocalizationProvider.defaultProps.localeText;

  const columns = useMemo(
    () =>
      columnItems.map((column) => ({
        ...column,
        size: columnSizing?.[column.accessorKey]
          ? columnSizing[column.accessorKey]
          : column.size,
        minSize: 50,
        maxSize: 400,
      })),
    [columnItems, columnSizing]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGlobalFilter: true,
    // globalFilterModeOptions: ["fuzzy", "contains", "startsWith"],
    globalFilterFn: "contains",
    // globalFilterFn: "fuzzy",
    enableFullScreenToggle: false,
    positionGlobalFilter: "left",
    enableGlobalFilterModes: true,
    enableColumnFilters: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableColumnPinning: true,
    // wyłacza 3 kropki w
    enableColumnActions: false,
    enablePagination: true,
    enableDensityToggle: false,

    //wyświetla się górne menu tabeli, wyszukiwanie, order itp
    enableTopToolbar: true,

    // nie odświeża tabeli po zmianie danych
    autoResetPageIndex: false,

    enableSorting: true,
    enableStickyHeader: true,
    muiPaginationProps: {
      rowsPerPageOptions: [10, 20, 30, 50],
      showFirstButton: true,
      showLastButton: true,
    },

    muiTableContainerProps: { sx: { maxHeight: tableSize } },

    localization: MRT_Localization_PL,
    muiTableBodyRowProps: { hover: false },
    // wyświetla filtry nad komórką -
    columnFilterDisplayMode: "popover",
    //filtr nad headerem - popover
    muiFilterTextFieldProps: {
      // sx: { m: '0.5rem 0', width: '100%' },
      sx: { m: "0", width: "300px" },
      variant: "outlined",
    },

    // opcja wyszukuje zbiory do select i multi-select
    enableFacetedValues: true,

    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onPaginationChange: setPagination,

    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      density: "comfortable",
    },
    state: {
      columnVisibility,
      // density,
      columnOrder,
      columnPinning,
      pagination,
    },

    muiTableHeadCellProps: {
      align: "left",
      sx: {
        borderTop: "1px solid rgba(81, 81, 81, .5)",
        borderRight: "1px solid rgba(81, 81, 81, .5)",
        fontSize: ".9rem",
        fontFamily: "Calibri",
        fontWeight: "700",
        backgroundColor: "#ddd",

        "& .Mui-TableHeadCell-Content": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          textWrap: "balance",
        },
        //wyłącza ikone zmiane kolejności kolumn - tylko w kolumnie
        "& .Mui-TableHeadCell-Content-Actions": {
          display: "none",
        },

        //wyłącza ikone sortowania - tylko w kolumnie
        // "& .MuiTableSortLabel-root": {
        //   display: "none",
        // },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        borderTop: "1px solid rgba(81, 81, 81, .5)",
        borderRight: "1px solid rgba(81, 81, 81, .5)",
        padding: "5px",
        fontSize: "1rem",
        fontFamily: "Calibri",
        textAlign: "center",
      },
    },

    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Button
          // className="fk_table-exit--fk"
          variant="contained"
          color="error"
          onClick={() => setShowTable(false)}
        >
          Wyjście
        </Button>
        <i
          className="fas fa-save fk-table-save-settings"
          onClick={handleSaveSettings}
        ></i>
        <button
          className="fk-table__container--excel"
          disabled={table.getRowModel().rows.length === 0}
        >
          <i
            className="fa-regular fa-file-excel fk-table-export-excel"
            onClick={() =>
              handleExportRows(
                table.getPrePaginationRowModel().rows,
                columnOrder,
                columnVisibility,
                columns
              )
            }
          ></i>
        </button>
      </Box>
    ),
  });

  const handleSaveSettings = async () => {
    const tableSettings = {
      size: { ...columnSizing },
      visible: { ...columnVisibility },
      order: columnOrder,
      pinning: columnPinning,
      pagination,
    };
    try {
      await axiosPrivateIntercept.patch(`/fk/save-table-settings`, {
        tableSettings,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getColumnSettings = async () => {
    try {
      const settingsColumn = await axiosPrivateIntercept.get("/fk/get-columns");
      const updateColumns = columnItems.map((item) => {
        const matching = settingsColumn.data.find(
          (match) => match.accessorKey === item.accessorKey
        );
        if (matching) {
          return {
            ...item,
            header: matching.header,
            muiTableBodyCellProps: muiTableBodyCellProps,
          };
        }
        return item;
      });
      setColumnItems(updateColumns);

      const getTableSettings = await axiosPrivateIntercept.get(
        "/fk/get-table-settings"
      );
      setColumnVisibility(getTableSettings?.data?.visible || {});
      setColumnSizing(getTableSettings?.data?.size || {});
      setColumnOrder(
        getTableSettings?.data?.order?.map((order) => order) || []
      );
      setColumnPinning(
        getTableSettings?.data?.pinning || { left: [], right: [] }
      );
      setPagination(
        getTableSettings?.data?.pagination || { pageIndex: 0, pageSize: 10 }
      );
      // setPagination({ pageIndex: 0, pageSize: 10 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportRows = (rows, columnOrder, columnVisibility, columns) => {
    const rowDataTable = rows.map((row) => row.original);

    const rowData = rowDataTable.map((item) => {
      if (item.DATA_WYSTAWIENIA_FV) {
        item.DATA_WYSTAWIENIA_FV = new Date(
          item.DATA_WYSTAWIENIA_FV
        ).toLocaleDateString("pl-PL", {
          useGrouping: true,
        });
      }
      if (item.TERMIN_PLATNOSCI_FV) {
        item.TERMIN_PLATNOSCI_FV = new Date(
          item.TERMIN_PLATNOSCI_FV
        ).toLocaleDateString("pl-PL", {
          useGrouping: true,
        });
      }
      return item;
    });

    const arrayOrder = columnOrder.filter(
      (item) => columnVisibility[item] !== false
    );

    const newColumns = columns
      .map((item) => {
        const matching = arrayOrder.find((match) => match === item.accessorKey);
        if (matching) {
          return {
            accessorKey: item.accessorKey,
            header: item.header,
          };
        }
      })
      .filter(Boolean);

    const newOrder = arrayOrder.map((key) => {
      const matchedColumn = newColumns.find(
        (column) => column.accessorKey === key
      );
      return matchedColumn ? matchedColumn.header : key;
    });

    // Aktualizacja danych
    const updateData = rowData.map((item) => {
      // Filtracja kluczy obiektu na podstawie arrayOrder
      const filteredKeys = Object.keys(item).filter((key) =>
        arrayOrder.includes(key)
      );
      // Tworzenie nowego obiektu z wybranymi kluczami
      const updatedItem = filteredKeys.reduce((obj, key) => {
        obj[key] = item[key];
        return obj;
      }, {});
      return updatedItem;
    });

    const orderColumns = {
      columns: newColumns,
      order: newOrder,
    };

    const dataToString = updateData.map((item) => {
      if (item.ILE_DNI_NA_PLATNOSC_FV) {
        item.ILE_DNI_NA_PLATNOSC_FV = String(item.ILE_DNI_NA_PLATNOSC_FV);
      }
      if (item.KWOTA_WPS === 0) {
        item.KWOTA_WPS = "";
      }
      item.RODZAJ_KONTA = String(item.RODZAJ_KONTA);
      return item;
    });
    getAllDataRaport(dataToString, orderColumns, "Filtr");
  };

  useEffect(() => {
    setTableSize(height - 200);
  }, [height]);

  useEffect(() => {
    const update = preparedData(tableData);
    setData(update);
    getColumnSettings();
  }, [tableData]);

  return (
    <section className="fk_table">
      <ThemeProvider theme={theme}>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="pl"
          localeText={plLocale}
        >
          <MaterialReactTable table={table} />
        </LocalizationProvider>
      </ThemeProvider>
    </section>
  );
};

export default FKTable;
