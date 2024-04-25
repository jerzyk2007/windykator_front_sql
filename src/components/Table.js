import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_PL } from "material-react-table/locales/pl";
import { ThemeProvider, useTheme } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/pl";
import { plPL } from "@mui/x-date-pickers/locales";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from "./hooks/useData";
import useWindowSize from "./hooks/useWindow";
import QuickTableNote from "./QuickTableNote";
import EditRowTable from "./EditRowTable";
import PleaseWait from "./PleaseWait";
import * as xlsx from "xlsx";

import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { prepareColumns } from "./utilsForTable/prepareColumns";
import { handleExportRows } from "./utilsForTable/excelFilteredTable";

import "./Table.css";

const Table = ({ info }) => {
  const theme = useTheme();

  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { pleaseWait, setPleaseWait, auth } = useData();
  const { height } = useWindowSize();

  const [documents, setDocuments] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnSizing, setColumnSizing] = useState({});
  // const [density, setDensity] = useState("");
  const [columnOrder, setColumnOrder] = useState([]);
  const [columnPinning, setColumnPinning] = useState({});
  const [columns, setColumns] = useState([]);
  const [tableSize, setTableSize] = useState(500);
  const [pagination, setPagination] = useState({});

  const [sorting, setSorting] = useState([
    { id: "ILE_DNI_PO_TERMINIE", desc: false },
  ]);

  const [quickNote, setQuickNote] = useState("");
  const [dataRowTable, setDataRowTable] = useState("");

  const plLocale =
    plPL.components.MuiLocalizationProvider.defaultProps.localeText;

  const handleSaveSettings = async () => {
    const tableSettings = {
      size: { ...columnSizing },
      visible: { ...columnVisibility },
      // density,
      order: columnOrder,
      pinning: columnPinning,
      pagination,
    };
    try {
      await axiosPrivateIntercept.patch(
        `/user/save-table-settings/${auth._id}`,
        { tableSettings }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleExportExcel = async () => {
    const result = await axiosPrivateIntercept.get(
      `/documents/get-all/${auth._id}/${info}`
    );

    const cleanData = result.data.map((doc) => {
      const { _id, __v, UWAGI_ASYSTENT, UWAGI_Z_FAKTURY, ...cleanDoc } = doc;
      if (Array.isArray(UWAGI_ASYSTENT)) {
        cleanDoc.UWAGI_ASYSTENT = UWAGI_ASYSTENT.join(", ");
      }
      if (Array.isArray(UWAGI_Z_FAKTURY)) {
        cleanDoc.UWAGI_Z_FAKTURY = UWAGI_Z_FAKTURY.join(", ");
      }
      return cleanDoc;
    });

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(cleanData);
    xlsx.utils.book_append_sheet(wb, ws, "Faktury");
    xlsx.writeFile(wb, "Faktury.xlsx");
  };

  const columnsItem = useMemo(
    () =>
      columns.map((column) => ({
        ...column,
        size: columnSizing?.[column.accessorKey]
          ? columnSizing[column.accessorKey]
          : column.size,
        // enableHiding: true,
        // enablePinning: true,
        enableColumnFilterModes: false,
        minSize: 50,
        maxSize: 400,
      })),
    [columns, columnSizing]
  );

  useEffect(() => {
    setTableSize(height - 180);
  }, [height]);

  useEffect(() => {
    let isMounted = true;

    const prepareTable = async () => {
      try {
        setPleaseWait(true);
        const [result, settingsUser, getColumns] = await Promise.all([
          axiosPrivateIntercept.get(`/documents/get-all/${auth._id}/${info}`),
          axiosPrivateIntercept.get(`/user/get-table-settings/${auth._id}`),
          axiosPrivateIntercept.get(`/user/get-columns/${auth._id}`),
        ]);
        const modifiedColumns = prepareColumns(getColumns.data, result.data);
        if (isMounted) {
          setDocuments(result.data);
          setColumnVisibility(settingsUser?.data?.visible || {});
          setColumnSizing(settingsUser?.data?.size || {});
          // setDensity(settingsUser?.data?.density || 'comfortable');
          setColumnOrder(
            settingsUser?.data?.order?.map((order) => order) || []
          );
          setColumnPinning(
            settingsUser?.data?.pinning || { left: [], right: [] }
          );
          setPagination(
            settingsUser?.data?.pagination || { pageIndex: 0, pageSize: 10 }
          );
          setColumns(modifiedColumns);
          setPleaseWait(false);
        }
      } catch (err) {
        console.error(err);
      }
    };
    setQuickNote("");
    setDataRowTable("");
    prepareTable();

    return () => {
      isMounted = false;
    };
  }, [info, auth._id, setPleaseWait, axiosPrivateIntercept]);

  return (
    <section className="actual_table">
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <>
          <ThemeProvider theme={theme}>
            {quickNote && (
              <QuickTableNote
                quickNote={quickNote}
                setQuickNote={setQuickNote}
                documents={documents}
                setDocuments={setDocuments}
              />
            )}

            {auth?.roles?.includes(200 || 300 || 500) && dataRowTable && (
              <EditRowTable
                dataRowTable={dataRowTable}
                setDataRowTable={setDataRowTable}
                documents={documents}
                setDocuments={setDocuments}
              />
            )}

            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pl"
              localeText={plLocale}
            >
              <MaterialReactTable
                className="actual_table__table"
                columns={columnsItem}
                data={documents}
                enableClickToCopy
                enableColumnFilterModes
                enableStickyHeader
                enableStickyFooter
                enableSorting
                enableColumnResizing
                onColumnSizingChange={setColumnSizing}
                onColumnVisibilityChange={setColumnVisibility}
                // onDensityChange={setDensity}
                onColumnOrderChange={setColumnOrder}
                enableColumnOrdering
                enableColumnPinning
                onColumnPinningChange={setColumnPinning}
                onPaginationChange={setPagination}
                onSortingChange={setSorting}
                enableDensityToggle={false}
                enableSelectAll={false}
                initialState={{
                  showColumnFilters: false,
                  showGlobalFilter: true,
                  density: "compact",
                }}
                localization={MRT_Localization_PL}
                state={{
                  columnVisibility,
                  // density,
                  columnOrder,
                  columnPinning,
                  pagination,
                  sorting,
                }}
                // filterFns={'equals'}
                enableGlobalFilterModes
                globalFilterModeOptions={["fuzzy", "contains", "startsWith"]}
                // globalFilterFn={info === "actual" ? "contains" : "fuzzy"}
                globalFilterFn="contains"
                positionGlobalFilter="left"
                // opcja wyszukuje zbiory do select i multi-select
                enableFacetedValues
                // rowCount={data.length}

                // wyłącza filtr (3 kropki) w kolumnie
                enableColumnActions={false}
                // nie odświeża tabeli po zmianie danych
                autoResetPageIndex={false}
                // enableColumnVirtualization

                muiTableContainerProps={{ sx: { maxHeight: tableSize } }}
                // wyświetla filtry nad komórką -
                columnFilterDisplayMode={"popover"}
                //filtr nad headerem - popover
                muiFilterTextFieldProps={{
                  // sx: { m: '0.5rem 0', width: '100%' },
                  sx: { m: "0", width: "300px" },
                  variant: "outlined",
                }}
                muiPaginationProps={{
                  rowsPerPageOptions: [10, 20, 30, 50, 100],
                  // rowsPerPageOptions: [10, 20, 30, 50, 100, { value: 10000, label: 'Całość' }],
                  shape: "rounded",
                  variant: "outlined",
                }}
                muiTableHeadCellProps={() => ({
                  align: "left",
                  sx: {
                    fontWeight: "700",
                    fontFamily: "Calibri, sans-serif",
                    fontSize: "15px",
                    color: "black",
                    backgroundColor: "#a7d3f7",
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
                    "& .Mui-TableHeadCell-Content-Actions": {
                      display: "none",
                    },
                  },
                })}
                // odczytanie danych po kliknięciu w wiersz
                muiTableBodyCellProps={({ column, row, cell }) => ({
                  onDoubleClick: () => {
                    if (column.id === "UWAGI_ASYSTENT") {
                      setQuickNote(row.original);
                    } else {
                      setDataRowTable(row.original);
                    }
                  },
                  sx: {
                    // position: "relative"
                  },
                })}
                renderTopToolbarCustomActions={({ table }) => (
                  <Box
                    sx={{
                      display: "flex",
                      gap: "16px",
                      padding: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      disabled={table.getRowModel().rows.length === 0}
                      //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                      //   onClick={() => handleExportRows(table.getRowModel().rows)}
                      onClick={() =>
                        handleExportRows(
                          table.getPrePaginationRowModel().rows,
                          columnOrder,
                          columnVisibility,
                          columnPinning,
                          columns
                        )
                      }
                      startIcon={<FileDownloadIcon />}
                    >
                      Pobierz wyfiltrowane dane
                    </Button>
                  </Box>
                )}
              />
            </LocalizationProvider>
          </ThemeProvider>
          <section className="table-icons-panel">
            <i
              className="fas fa-save table-save-settings"
              onClick={handleSaveSettings}
            ></i>
            <i
              className="fa-regular fa-file-excel table-export-excel"
              onClick={handleExportExcel}
            ></i>
          </section>
        </>
      )}
    </section>
  );
};

export default Table;
