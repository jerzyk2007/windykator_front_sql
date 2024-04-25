import { useState, useMemo, useEffect } from "react";
import {
  MaterialReactTable, //import alternative sub-component if we do not want toolbars
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

import "./FKTable.css";

const FKTable = ({ tableData, setShowTable }) => {
  const theme = useTheme();
  const { height } = useWindowSize();
  const [data, setData] = useState([]);
  const [tableSize, setTableSize] = useState(500);
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [columnItems, setColumnItems] = useState(preparedFKColumns);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, //customize the default page size
  });

  const plLocale =
    plPL.components.MuiLocalizationProvider.defaultProps.localeText;

  const columns = useMemo(
    () =>
      columnItems.map((column) => ({
        ...column,
      })),
    [columnItems]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGlobalFilter: true,
    // globalFilterModeOptions: ["fuzzy", "contains", "startsWith"],
    globalFilterFn: "contains",
    // globalFilterFn: "fuzzy",
    positionGlobalFilter: "left",
    enableGlobalFilterModes: true,
    enableColumnFilters: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableColumnPinning: true,
    // wyłacza 3 kropki w
    enableColumnActions: false,
    enablePagination: true,

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

    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      density: "comfortable",
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
          alignItems: "left",
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
        {/* <Button
          disabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          //   onClick={() => handleExportRows(table.getRowModel().rows)}
          // onClick={() =>
          //   handleExportRows(
          //     table.getPrePaginationRowModel().rows,
          //     columnOrder,
          //     columnVisibility,
          //     columnPinning,
          //     columns
          //   )
          // }
          startIcon={<FileDownloadIcon />}
        >
          Pobierz wyfiltrowane dane
        </Button> */}
      </Box>
    ),
  });

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
    } catch (err) {
      console.log(err);
    }
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
