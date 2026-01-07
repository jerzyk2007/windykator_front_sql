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
import { Box, Button } from "@mui/material";
import {
  getAllDataRaport,
  lawPartnerRaport,
  insuranceRaport,
} from "./utilsForTable/excelFilteredTable";
import TableButtonInfo from "./TableButtonInfo";
import EditRowTablePro from "./editDocument/EditRowTablePro";
import PleaseWait from "../PleaseWait";

import "./Table.css";

const clearRowTable = {
  edit: false,
  singleDoc: {},
  controlDoc: {},
  lawPartner: [],
};

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

  const [columnVisibility, setColumnVisibility] = useState(settings.visible);
  const [columnSizing, setColumnSizing] = useState(settings.size);
  const [columnOrder, setColumnOrder] = useState(settings.order);
  const [columnPinning, setColumnPinning] = useState(settings.pinning);
  const [pagination, setPagination] = useState(
    settings?.pagination ? settings.pagination : { pageIndex: 0, pageSize: 10 }
  );
  const [tableSize, setTableSize] = useState(500);
  const [data, setData] = useState([]);

  const [dataRowTable, setDataRowTable] = useState({
    edit: false,
    singleDoc: {},
    controlDoc: {},
    lawPartner: [],
  });

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
  const [dataTableCounter, setDataTableCounter] = useState(false);

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
        const filteredKeys = Object.keys(item).filter((key) =>
          arrayOrder.includes(key)
        );
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
        const filteredKeys = Object.keys(item).filter((key) =>
          arrayOrder.includes(key)
        );
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
    setPleaseWait(true);
    // NATYCHMIAST CZYŚCIMY DANE, ALE ZOSTAWIAMY TRYB EDYCJI
    setDataRowTable((prev) => ({
      ...prev,
      edit: true,
      singleDoc: {}, // To usuwa "ducha" starego dokumentu
      controlDoc: {},
      lawPartner: [],
    }));
    const getRow = documents.filter((row) => row.id_document === id);

    if (getRow.length > 0) {
      try {
        // setPleaseWait(true);
        if (profile === "insider") {
          const response = await axiosPrivateIntercept.get(
            `/documents/get-single-document/${id}`
          );
          setDataRowTable({
            edit: true,
            singleDoc: response?.data?.singleDoc ? response.data.singleDoc : {},
            controlDoc: response?.data?.controlDoc
              ? response.data.controlDoc
              : {},
            lawPartner: response?.data?.lawPartner
              ? response.data.lawPartner
              : [],
          });
        } else if (profile === "partner") {
          const response = await axiosPrivateIntercept.get(
            `/law-partner/get-single-document/${id}`
          );
          setDataRowTable({
            edit: true,
            singleDoc: response?.data ? response.data : {},
            controlDoc: {},
            lawPartner: [],
          });
        } else if (profile === "insurance") {
          const response = await axiosPrivateIntercept.get(
            `/insurance/get-single-document/${id}`
          );
          setDataRowTable({
            edit: true,
            singleDoc: response?.data ? response.data : {},
            controlDoc: {},
            lawPartner: [],
          });
        }
      } catch (error) {
        console.error("Error fetching data from the server:", error);
      } finally {
        // setPleaseWait(false);
        setTimeout(() => {
          setPleaseWait(false);
        }, 100);
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
    enableFacetedValues: true,
    enableColumnActions: false,
    autoResetPageIndex: false,
    muiTableContainerProps: { sx: { maxHeight: tableSize } },
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
        fontSize: ".9rem",
        color: "black",
        background: "rgba(233, 245, 255, 1)",
        borderRight: "1px solid #eeededff",
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
      className: "mrt-custom-body-cell",
      onDoubleClick: () => {
        // 1. Sprawdzamy, czy którakolwiek z wymaganych ról znajduje się w tablicy auth.roles
        const hasAccess = [110, 120, 350, 500, 2000].some((role) =>
          auth?.roles?.includes(role)
        );

        // 2. Jeśli ma dostęp, wywołujemy funkcję
        if (hasAccess) {
          getSingleRow(row.original.id_document, "full");
        }
      },
    }),

    renderTopToolbarCustomActions: ({ table }) => (
      <Box className="table-toolbar-actions">
        {/* PRZYCISK ZAPISZ WIDOK */}
        <Button
          className="table-action-btn save"
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
          <i className="fas fa-save"></i>
          <span>Zapisz widok</span>
        </Button>

        {/* PRZYCISK EXCEL */}
        {["insider", "partner", "insurance"].includes(profile) && (
          <TableButtonInfo
            className={`table-action-btn excel ${
              !dataTableCounter ? "disabled" : ""
            }`}
            disabled={!dataTableCounter}
            onClick={() => {
              const type = profile === "insurance" ? "Polisy" : "Zestawienie";
              profile === "insider"
                ? handleExportExel(table.getPrePaginationRowModel().rows, type)
                : handleExportExcelPartner(
                    table.getPrePaginationRowModel().rows,
                    type
                  );
            }}
            tooltipText="Za dużo danych do exportu. Spróbuj założyć filtry."
          >
            <i className="fa-regular fa-file-excel"></i>
            <span>Eksport Excel</span>
          </TableButtonInfo>
        )}
      </Box>
    ),
  });

  const tableDataSize = (dataSize) => {
    if (!dataSize || dataSize.length === 0) {
      setDataTableCounter(false);
      return;
    }

    const rowData = dataSize.map((item) => item.original);
    const arrayOrder = columnOrder.filter(
      (item) => columnVisibility[item] !== false
    );

    const updateData = rowData.map((item) => {
      const filteredKeys = Object.keys(item).filter((key) =>
        arrayOrder.includes(key)
      );
      const updatedItem = filteredKeys.reduce((obj, key) => {
        obj[key] = item[key];
        return obj;
      }, {});
      return updatedItem;
    });

    const json = JSON.stringify(updateData);
    const size = new TextEncoder().encode(json).length;

    setDataTableCounter(size >= 1 && size <= 30000000); // limit 30MB
  };

  useEffect(() => {
    setTableSize(height - 151);
  }, [height]);

  useEffect(() => {
    setData(documents);
  }, [documents]);

  useEffect(() => {
    const visibleData = table
      .getPrePaginationRowModel()
      .rows.map((row) => row.original.id_document);

    setNextDoc(visibleData);
    tableDataSize(table.getPrePaginationRowModel().rows);
  }, [table.getPrePaginationRowModel().rows, columnVisibility, columnOrder]);

  // --- NOWE: Przewijanie do góry przy zmianie paginacji ---
  useEffect(() => {
    if (table.refs.tableContainerRef.current) {
      table.refs.tableContainerRef.current.scrollTop = 0;
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  return (
    <section
      className="table"
      style={dataRowTable.edit ? { display: "flex" } : null}
    >
      <ThemeProvider theme={theme}>
        {dataRowTable.edit &&
          (pleaseWait ? (
            <PleaseWait />
          ) : (
            <EditRowTablePro
              // key={dataRowTable.singleDoc?.id_document || "loading"}
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
          ))}

        <div style={dataRowTable.edit ? { display: "none" } : null}>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={pl}
            localeText={plLocale}
          >
            <MaterialReactTable table={table} />
          </LocalizationProvider>
        </div>
      </ThemeProvider>
    </section>
  );
};

export default Table;
