import { useEffect, useMemo, useState } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_PL } from "material-react-table/locales/pl";
import { ThemeProvider, useTheme } from "@mui/material";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/pl";
import { plPL } from "@mui/x-date-pickers/locales";

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { pl } from 'date-fns/locale';

import useData from "../hooks/useData";
import useWindowSize from "../hooks/useWindow";
import QuickTableNote from "./QuickTableNote";
import EditRowTable from "./EditRowTable";
import { Box, Button } from "@mui/material";
import { getAllDataRaport } from "./utilsForTable/excelFilteredTable";
import PleaseWait from "../PleaseWait";

import "./Table.css";

const Table = ({
  documents,
  setDocuments,
  columns,
  settings,
  handleSaveSettings,
  roles
}) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const theme = useTheme();
  const { auth } = useData();
  const { height } = useWindowSize();
  const [pleaseWait, setPleaseWait] = useState(false);

  const [columnVisibility, setColumnVisibility] = useState(settings.visible);
  const [columnSizing, setColumnSizing] = useState(settings.size);
  const [columnOrder, setColumnOrder] = useState(settings.order);
  const [columnPinning, setColumnPinning] = useState(settings.pinning);
  const [pagination, setPagination] = useState(
    settings.pagination ? settings.pagination : { pageIndex: 0, pageSize: 10 }
  );
  const [tableSize, setTableSize] = useState(500);
  const [data, setData] = useState([]);
  const [quickNote, setQuickNote] = useState("");
  const [dataRowTable, setDataRowTable] = useState({
    edit: false,
    singleDoc: {},
    controlDoc: {},
  });
  const [sorting, setSorting] = useState([
    { id: "ILE_DNI_PO_TERMINIE", desc: false },
  ]);
  const [nextDoc, setNextDoc] = useState([]);

  const plLocale =
    plPL.components.MuiLocalizationProvider.defaultProps.localeText;

  const handleExportExel = (data, type) => {
    let rowData = [];
    let arrayOrder = [];

    if (type === "Całość" && data.length > 0) {
      arrayOrder = [...columnOrder];
      rowData = [...data];
    } else if (type === "Filtr") {
      arrayOrder = columnOrder.filter(
        (item) => columnVisibility[item] !== false
      );
      rowData = data.map((item) => {
        return item.original;
      });
    }
    let newColumns = [];
    newColumns = columns
      .map((item) => {
        const matching = arrayOrder.find(
          (match) => match === item.accessorKey
        );
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


    getAllDataRaport(updateData, orderColumns, type);
  };

  const getSingleRow = async (id, type) => {
    const getRow = documents.filter((row) => row.id_document === id);

    if (getRow.length > 0) {

      try {
        setPleaseWait(true);
        const response = await axiosPrivateIntercept.get(
          `/documents/get-single-document/${id}`
        );
        if (type === "quick") {
          setQuickNote(response.data.singleDoc);
        }
        if (type === "full") {

          setDataRowTable({
            edit: true,
            singleDoc: response?.data?.singleDoc ? response.data.singleDoc : {},
            controlDoc: response?.data?.controlDoc ? response.data.controlDoc : {},
          });
        }

      } catch (error) {
        console.error("Error fetching data from the server:", error);
      } finally {
        setPleaseWait(false);

      }
    } else {
      console.error("No row found with the specified ID");
    }
  };

  const updateDocuments = (editRowData) => {
    const newDocuments = documents.map((item) => {
      if (item.id_document === editRowData.id_document) {
        return editRowData;
      } else {
        return item;
      }
    });
    setDocuments(newDocuments);
  };

  const columnsItem = useMemo(
    () =>
      columns.map((column) => ({
        ...column,
        size: columnSizing?.[column.accessorKey]
          ? columnSizing[column.accessorKey]
          : column.size,
        enableColumnFilterModes: true,
        minSize: 50,
        maxSize: 400,
      })),
    [columnSizing, columns]
  );

  const table = useMaterialReactTable({
    columns: columnsItem,
    data,
    enableClickToCopy: true,
    enableColumnFilterModes: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableSorting: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableColumnPinning: true,
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableDensityToggle: false,
    enableSelectAll: false,
    initialState: {
      showColumnFilters: false,
      showGlobalFilter: true,
      density: "compact",
    },
    state: {
      columnVisibility: columnVisibility ? columnVisibility : {},
      columnOrder: columnOrder ? columnOrder : [],
      columnPinning: columnPinning ? columnPinning : {},
      pagination,
      sorting,
    },
    localization: MRT_Localization_PL,
    enableGlobalFilterModes: true,
    globalFilterModeOptions: ["fuzzy", "contains", "startsWith"],
    globalFilterFn: "contains",
    positionGlobalFilter: "left",
    // opcja wyszukuje zbiory do select i multi-select
    enableFacetedValues: true,
    // wyłącza filtr (3 kropki) w kolumnie
    enableColumnActions: false,
    // nie odświeża tabeli po zmianie danych
    autoResetPageIndex: false,
    muiTableContainerProps: { sx: { maxHeight: tableSize } },
    // wyświetla filtry nad komórką -
    columnFilterDisplayMode: "popover",
    //filtr nad headerem - popover
    muiFilterTextFieldProps: {
      sx: { m: "0", width: "250px" },
      variant: "outlined",
    },
    muiPaginationProps: {
      rowsPerPageOptions: [10, 20, 30, 50, 100],
      shape: "rounded",
      variant: "outlined",
    },
    muiTableHeadCellProps: () => ({
      align: "left",
      sx: {
        fontWeight: "600",
        fontFamily: "'Source Sans 3', Calibri, sans-serif",
        fontSize: ".95rem",
        color: "black",
        backgroundColor: "#bfe2ff",
        borderRight: "1px solid #c9c7c7",
        minHeight: "3rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        "& .Mui-TableHeadCell-Content": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          textWrap: "balance",
        },
        "& .Mui-TableHeadCell-Content-Labels": {
          padding: 0,
        },
        "& .Mui-TableHeadCell-Content-Actions": {
          display: "none",
        },
        "& .Mui-TableHeadCell-ResizeHandle-Wrapper": {
          borderWidth: "1px",
          background: "none",
          marginRight: "-9px",
          borderColor: "rgba(75, 75, 75, .1)"
        },
      },
    }),
    // odczytanie danych po kliknięciu w wiersz
    muiTableBodyCellProps: ({ column, row, cell }) => ({
      onDoubleClick: () => {
        if (column.id === "UWAGI_ASYSTENT") {
          getSingleRow(row.original.id_document, "quick");
        } else {
          getSingleRow(row.original.id_document, "full");
        }

      },
    }),

    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          gap: "16px",
          padding: "0px",
          flexWrap: "wrap",
        }}
      >
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportExel(documents, "Całość")}
        >
          <i className="fa-regular fa-file-excel table-export-excel"></i>
        </Button>
        <Button
          onClick={() =>
            handleSaveSettings(
              columnSizing,
              columnVisibility,
              columnOrder,
              columnPinning,
              pagination
            )
          }
        >
          <i className="fas fa-save table-save-settings"></i>
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          style={
            table.getRowModel().rows.length === 0 ? { display: "none" } : null
          }
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() =>
            handleExportExel(table.getPrePaginationRowModel().rows, "Filtr")
          }
        >
          <i className="fa-solid fa-filter table_fa-filter"></i>
        </Button>
      </Box>
    ),
  });



  useEffect(() => {
    setTableSize(height - 151);
  }, [height]);

  useEffect(() => {
    setData(documents);
  }, [documents]);

  useEffect(() => {
    const visibleData = table.getPrePaginationRowModel().rows.map((row) => row.original.id_document);
    setNextDoc(visibleData);
  }, [table.getPrePaginationRowModel().rows]);

  return (
    <section className="table">
      <ThemeProvider theme={theme}>
        {quickNote && (
          <QuickTableNote
            quickNote={quickNote}
            setQuickNote={setQuickNote}
            updateDocuments={updateDocuments}
          />
        )}

        {/* {auth?.roles?.includes(110 || 120 || 1100) && dataRowTable.edit && (
          <EditRowTable
            dataRowTable={dataRowTable}
            setDataRowTable={setDataRowTable}
            updateDocuments={updateDocuments}
            roles={roles}
            nextDoc={nextDoc}
            getSingleRow={getSingleRow}
          />
        )} */}

        {
          pleaseWait ? (
            <PleaseWait />
          ) : (
            [110, 120, 1100].some(role => auth?.roles?.includes(role)) && dataRowTable.edit && (
              <EditRowTable
                dataRowTable={dataRowTable}
                setDataRowTable={setDataRowTable}
                updateDocuments={updateDocuments}
                roles={roles}
                nextDoc={nextDoc}
                getSingleRow={getSingleRow}


              />
            )
          )
        }


        <LocalizationProvider
          // dateAdapter={AdapterDayjs}
          // adapterLocale="pl"
          // localeText={plLocale}

          dateAdapter={AdapterDateFns}
          adapterLocale={pl}
          localeText={plLocale}

        >
          <MaterialReactTable table={table} />
        </LocalizationProvider>
      </ThemeProvider>
    </section>
  );
};

export default Table;
