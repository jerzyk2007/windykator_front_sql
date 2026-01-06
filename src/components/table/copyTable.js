import { useEffect, useMemo, useState } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_PL } from "material-react-table/locales/pl";
import { ThemeProvider, useTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/pl";
import { plPL } from "@mui/x-date-pickers/locales";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { pl } from "date-fns/locale";

import useData from "../hooks/useData";
import useWindowSize from "../hooks/useWindow";
// import QuickTableNote from "./profileInsider/QuickTableNote";
import EditRowTable from "./profileInsider/EditRowTable";
import { Box, Button } from "@mui/material";
import {
  getAllDataRaport,
  lawPartnerRaport,
  insuranceRaport,
} from "./utilsForTable/excelFilteredTable";
import TableButtonInfo from "./TableButtonInfo";
import EditRowTablePro from "./editDocument/EditRowTablePro";
import PleaseWait from "../PleaseWait";
import { basePath } from "./utilsForTable/tableFunctions";

import "./Table.css";

const clearRowTable = {
  edit: false,
  singleDoc: {},
  controlDoc: {},
  lawPartner: [],
};

const MAX_EXPORT_ROWS = 30000;

const Table = ({
  documents,
  setDocuments,
  columns,
  settings,
  handleSaveSettings,
  roles,
  profile,
  info,
}) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const theme = useTheme();
  const { auth, setExcelFile } = useData();
  const { height } = useWindowSize();
  const [pleaseWait, setPleaseWait] = useState(false);

  // --- ŁATKA: Blokada błędu ResizeObserver ---
  useEffect(() => {
    const handleResizeError = (e) => {
      if (e.message && e.message.includes("ResizeObserver")) {
        const overlay = document.getElementById(
          "webpack-dev-server-client-overlay"
        );
        if (overlay) overlay.style.display = "none";
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener("error", handleResizeError);
    return () => window.removeEventListener("error", handleResizeError);
  }, []);

  const [columnVisibility, setColumnVisibility] = useState(settings.visible);
  const [columnSizing, setColumnSizing] = useState(settings.size);
  const [columnOrder, setColumnOrder] = useState(settings.order);
  const [columnPinning, setColumnPinning] = useState(settings.pinning);
  const [pagination, setPagination] = useState(
    settings?.pagination ? settings.pagination : { pageIndex: 0, pageSize: 10 }
  );
  const [tableSize, setTableSize] = useState(500);

  // OPTYMALIZACJA: useMemo dla danych
  const data = useMemo(() => documents, [documents]);

  const [dataRowTable, setDataRowTable] = useState({
    edit: false,
    singleDoc: {},
    controlDoc: {},
    lawPartner: [],
  });

  // --- Stan do zapamiętywania pozycji scrolla (dla edycji) ---
  const [scrollPosition, setScrollPosition] = useState(0);

  const [sorting, setSorting] = useState(() => {
    const has = (key) => columns.some((c) => c.accessorKey === key);
    if (profile === "insider" && has("ILE_DNI_PO_TERMINIE")) {
      return [{ id: "ILE_DNI_PO_TERMINIE", desc: false }];
    }
    if (profile === "partner" && has("DATA_PRZEKAZANIA_SPRAWY")) {
      return [{ id: "DATA_PRZEKAZANIA_SPRAWY", desc: true }];
    }
    if (profile === "insurance" && has("DATA_PRZEKAZANIA")) {
      return [{ id: "DATA_PRZEKAZANIA", desc: false }];
    }
    return [];
  });

  const [nextDoc, setNextDoc] = useState([]);

  const plLocale =
    plPL.components.MuiLocalizationProvider.defaultProps.localeText;

  const handleExportExel = async (data, type) => {
    setExcelFile(true);
    await new Promise((resolve) => setTimeout(resolve, 0));
    try {
      const rowData = data.map((item) => item.original);
      const arrayOrder = columnOrder.filter(
        (item) => columnVisibility[item] !== false
      );
      const newColumns = columns
        .map((item) => {
          const matching = arrayOrder.find(
            (match) => match === item.accessorKey
          );
          if (matching)
            return { accessorKey: item.accessorKey, header: item.header };
        })
        .filter(Boolean);
      const newOrder = arrayOrder.map((key) => {
        const matchedColumn = newColumns.find(
          (column) => column.accessorKey === key
        );
        return matchedColumn ? matchedColumn.header : key;
      });
      const updateData = rowData.map((item) => {
        const filteredKeys = Object.keys(item).filter((key) =>
          arrayOrder.includes(key)
        );
        return filteredKeys.reduce((obj, key) => {
          obj[key] = item[key];
          return obj;
        }, {});
      });
      const orderColumns = { columns: newColumns, order: newOrder };
      getAllDataRaport(updateData, orderColumns, type);
    } catch (error) {
      console.error(error);
    } finally {
      setExcelFile(false);
    }
  };

  const handleExportExcelPartner = async (data, type) => {
    setExcelFile(true);
    await new Promise((resolve) => setTimeout(resolve, 0));
    try {
      const rowData = data.map((item) => item.original);
      const arrayOrder = columnOrder.filter(
        (item) => columnVisibility[item] !== false
      );
      const newColumns = columns
        .map((item) => {
          const matching = arrayOrder.find(
            (match) => match === item.accessorKey
          );
          if (matching)
            return { accessorKey: item.accessorKey, header: item.header };
        })
        .filter(Boolean);
      const newOrder = arrayOrder.map((key) => {
        const matchedColumn = newColumns.find(
          (column) => column.accessorKey === key
        );
        return matchedColumn ? matchedColumn.header : key;
      });
      const updateData = rowData.map((item) => {
        const filteredKeys = Object.keys(item).filter((key) =>
          arrayOrder.includes(key)
        );
        return filteredKeys.reduce((obj, key) => {
          obj[key] = item[key];
          return obj;
        }, {});
      });
      const orderColumns = { columns: newColumns, order: newOrder };
      profile === "partner"
        ? lawPartnerRaport(updateData, orderColumns, type)
        : insuranceRaport(updateData, orderColumns, type);
    } catch (error) {
      console.error(error);
    } finally {
      setExcelFile(false);
    }
  };

  const getSingleRow = async (id, type) => {
    const getRow = documents.filter((row) => row.id_document === id);
    if (getRow.length > 0) {
      try {
        setPleaseWait(true);

        const response = await axiosPrivateIntercept.get(
          `${basePath[profile]}/get-single-document/${id}`
        );
        if (profile === "insider") {
          setDataRowTable({
            edit: true,
            singleDoc: response?.data?.singleDoc || {},
            controlDoc: response?.data?.controlDoc || {},
            lawPartner: response?.data?.lawPartner || [],
          });
        } else {
          setDataRowTable({
            edit: true,
            singleDoc: response?.data || {},
            controlDoc: {},
            lawPartner: [],
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
    const newDocuments = documents.map((item) =>
      item.id_document === editRowData.id_document ? editRowData : item
    );
    setDocuments(newDocuments);
  };

  const removeDocuments = (id) => {
    const newDocuments = documents.filter((item) => item.id_document !== id);
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
    enableRowVirtualization: true,
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
      columnVisibility: columnVisibility || {},
      columnOrder: columnOrder || [],
      columnPinning: columnPinning || {},
      pagination,
      sorting,
    },
    localization: MRT_Localization_PL,
    enableGlobalFilterModes: true,
    globalFilterModeOptions: ["fuzzy", "contains", "startsWith"],
    globalFilterFn: "contains",
    positionGlobalFilter: "left",
    enableFacetedValues: true,
    enableColumnActions: false,
    autoResetPageIndex: false,
    muiTableContainerProps: {
      sx: { maxHeight: tableSize },
    },
    columnFilterDisplayMode: "popover",
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
        "& .Mui-TableHeadCell-Content-Labels": { padding: 0 },
        "& .Mui-TableHeadCell-Content-Actions": { display: "none" },
        "& .Mui-TableHeadCell-ResizeHandle-Wrapper": {
          borderWidth: "1px",
          background: "none",
          marginRight: "-9px",
          borderColor: "rgba(75, 75, 75, .1)",
        },
      },
    }),

    muiTableBodyCellProps: ({ row }) => ({
      onDoubleClick: () => {
        // Zapisujemy pozycję scrolla przed wejściem w edycję
        const tableContainer = table.refs.tableContainerRef.current;
        if (tableContainer) {
          setScrollPosition(tableContainer.scrollTop);
        }
        getSingleRow(row.original.id_document, "full");
      },
    }),

    renderTopToolbarCustomActions: ({ table }) => {
      const currentRows = table.getPrePaginationRowModel().rows;
      const rowCount = currentRows.length;
      const isExportable = rowCount > 0 && rowCount <= MAX_EXPORT_ROWS;

      return (
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
          {profile === "insider" && (
            <TableButtonInfo
              className="table_excel"
              disabled={!isExportable}
              onClick={() => handleExportExel(currentRows, "Zestawienie")}
              tooltipText={`Za dużo danych do exportu (> ${MAX_EXPORT_ROWS}). Spróbuj założyć filtry.`}
            >
              <i
                className="fa-regular fa-file-excel table-export-excel"
                style={!isExportable ? { color: "rgba(129,129,129,0.3)" } : {}}
              ></i>
            </TableButtonInfo>
          )}
          {profile === "partner" && info !== "no-accept" && (
            <TableButtonInfo
              className="table_excel"
              disabled={!isExportable}
              onClick={() =>
                handleExportExcelPartner(currentRows, "Zestawienie")
              }
              tooltipText={`Za dużo danych do exportu (> ${MAX_EXPORT_ROWS}). Spróbuj założyć filtry.`}
            >
              <i
                className="fa-regular fa-file-excel table-export-excel"
                style={!isExportable ? { color: "rgba(129,129,129,0.3)" } : {}}
              ></i>
            </TableButtonInfo>
          )}
          {profile === "insurance" && (
            <TableButtonInfo
              className="table_excel"
              disabled={!isExportable}
              onClick={() => handleExportExcelPartner(currentRows, "Polisy")}
              tooltipText={`Za dużo danych do exportu (> ${MAX_EXPORT_ROWS}). Spróbuj założyć filtry.`}
            >
              <i
                className="fa-regular fa-file-excel table-export-excel"
                style={!isExportable ? { color: "rgba(129,129,129,0.3)" } : {}}
              ></i>
            </TableButtonInfo>
          )}
        </Box>
      );
    },
  });

  useEffect(() => {
    setTableSize(height - 151);
  }, [height]);

  useEffect(() => {
    const visibleData = table
      .getPrePaginationRowModel()
      .rows.map((row) => row.original.id_document);
    setNextDoc(visibleData);
  }, [table.getPrePaginationRowModel().rows, columnVisibility]);

  // --- Przywracanie scrolla po wyjściu z edycji ---
  useEffect(() => {
    if (!dataRowTable.edit && scrollPosition > 0) {
      setTimeout(() => {
        const tableContainer = table.refs.tableContainerRef.current;
        if (tableContainer) {
          tableContainer.scrollTop = scrollPosition;
        }
      }, 0);
    }
  }, [dataRowTable.edit, scrollPosition, table.refs.tableContainerRef]);

  // --- NOWE: Przewijanie do góry przy zmianie paginacji ---
  useEffect(() => {
    if (table.refs.tableContainerRef.current) {
      table.refs.tableContainerRef.current.scrollTop = 0;
    }
  }, [pagination.pageIndex, pagination.pageSize, table.refs.tableContainerRef]);

  return (
    <section
      className="table"
      style={dataRowTable.edit ? { display: "flex" } : null}
    >
      {dataRowTable.edit ? (
        pleaseWait ? (
          <PleaseWait />
        ) : [110, 120, 350, 500, 2000].some((role) =>
            auth?.roles?.includes(role)
          ) ? (
          // <EditRowTablePro
          //   dataRowTable={dataRowTable}
          //   setDataRowTable={setDataRowTable}
          //   updateDocuments={updateDocuments}
          //   roles={roles}
          //   nextDoc={nextDoc}
          //   getSingleRow={getSingleRow}
          //   clearRowTable={clearRowTable}
          //   info={info}
          // />

          <EditRowTablePro
            dataRowTable={dataRowTable}
            setDataRowTable={setDataRowTable}
            updateDocuments={updateDocuments}
            removeDocuments={removeDocuments}
            nextDoc={nextDoc}
            getSingleRow={getSingleRow}
            clearRowTable={clearRowTable}
            roles={roles}
            info={info}
            profile={profile}
          />
        ) : null
      ) : (
        <ThemeProvider theme={theme}>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={pl}
            localeText={plLocale}
          >
            <MaterialReactTable table={table} />
          </LocalizationProvider>
        </ThemeProvider>
      )}
    </section>
  );
};

export default Table;
