import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
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
import { prepareDataTable } from "./utilsForTable/prepareDataTable";
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
      console.error(err);
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
        enableColumnFilterModes: false,
        minSize: 50,
        maxSize: 400,
      })),
    [columns, columnSizing]
  );

  useEffect(() => {
    console.log(columns);
  }, [columns, columnSizing]);

  const columnsItem2 = useMemo(
    () => [
      {
        accessorKey: "NUMER_FV",
        header: "NUMER_FV",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "50_VAT",
        header: "50_VAT",
        // filterVariant: "multi-select",
      },
      {
        accessorKey: "100_VAT",
        header: "100_VAT",
        // filterVariant: "multi-select",
      },
      {
        accessorKey: "ASYSTENTKA",
        header: "ASYSTENTKA",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "BLAD_DORADCY",
        header: "BLAD_DORADCY",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "BLAD_W_DOKUMENTACJI",
        header: "BLAD_W_DOKUMENTACJI",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "BRUTTO",
        header: "BRUTTO",
        // filterVariant: "multi-select",
      },
      {
        accessorKey: "DATA_FV",
        header: "DATA_FV",
        filterVariant: "date-range",
        accessorFn: (originalRow) => new Date(originalRow.DATA_FV),
        // accessorFn: (originalRow) => console.log(originalRow.DATA_FV),
        // Cell: ({ cell }) => {
        //   // Parsowanie wartości komórki jako data
        //   const date = new Date(cell.getValue());
        //   // console.log(cell.getValue());
        //   // Sprawdzenie, czy data jest prawidłowa
        //   if (!isNaN(date)) {
        //     // Jeśli data jest prawidłowa, zwracamy ją jako lokalizowaną datę w formacie pl-PL
        //     return date.toLocaleDateString("pl-PL", {
        //       useGrouping: true,
        //     });
        //   } else {
        //     // Jeśli data jest nieprawidłowa, zwracamy pusty string lub inny komunikat błędu
        //     return "brak danych";
        //   }
        // },
        Cell: ({ cell }) => cell.getValue().toLocaleDateString(),
      },
      // {
      //   accessorKey: "DATA_FV",
      //   header: "DATA_FV",
      //   filterVariant: "date-range",
      //   Cell: ({ cell }) => {
      //     // Parsowanie wartości komórki jako data
      //     const date = new Date(cell.getValue());
      //     // Sprawdzenie, czy data jest prawidłowa
      //     if (!isNaN(date)) {
      //       // Jeśli data jest prawidłowa, zwracamy ją jako lokalizowaną datę w formacie pl-PL
      //       return date.toLocaleDateString("pl-PL", {
      //         useGrouping: true,
      //       });
      //     } else {
      //       // Jeśli data jest nieprawidłowa, zwracamy pusty string lub inny komunikat błędu
      //       return "brak danych";
      //     }
      //   },
      // },
      {
        accessorKey: "DATA_KOMENTARZA_BECARED",
        header: "DATA_KOMENTARZA_BECARED",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "DORADCA",
        header: "DORADCA",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "DO_ROZLICZENIA",
        header: "DO_ROZLICZENIA",
        // filterVariant: "multi-select",
      },
      {
        accessorKey: "DZIAL",
        header: "DZIAL",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "DZIALANIA",
        header: "DZIALANIA",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "ILE_DNI_PO_TERMINIE",
        header: "ILE_DNI_PO_TERMINIE",
        // filterVariant: "multi-select",
        // Cell: ({ cell }) =>
        //   cell.getValue() ? cell.getValue()?.toString() : "null",
      },
      {
        accessorKey: "JAKA_KANCELARIA",
        header: "JAKA_KANCELARIA",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "KOMENTARZ_KANCELARIA_BECARED",
        header: "KOMENTARZ_KANCELARIA_BECARED",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "KONTRAHENT",
        header: "KONTRAHENT",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "KWOTA_WINDYKOWANA_BECARED",
        header: "KWOTA_WINDYKOWANA_BECARED",
        // filterVariant: "multi-select",
      },
      {
        accessorKey: "NETTO",
        header: "NETTO",
        // filterVariant: "multi-select",
        // Cell: ({ cell }) =>
        //   cell.getValue() ? cell.getValue()?.toString() : "null",
      },
      {
        accessorKey: "NR_REJESTRACYJNY",
        header: "NR_REJESTRACYJNY",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "NR_SZKODY",
        header: "NR_SZKODY",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "NUMER_SPRAWY_BECARED",
        header: "NUMER_SPRAWY_BECARED",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "POBRANO_VAT",
        header: "POBRANO_VAT",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "STATUS_SPRAWY_KANCELARIA",
        header: "STATUS_SPRAWY_KANCELARIA",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "STATUS_SPRAWY_WINDYKACJA",
        header: "STATUS_SPRAWY_WINDYKACJA",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "TERMIN",
        header: "TERMIN",
        // filterVariant: "date-range",
        // Cell: ({ cell }) => {
        //   // Parsowanie wartości komórki jako data
        //   const date = new Date(cell.getValue());
        //   // console.log(cell.getValue());
        //   // Sprawdzenie, czy data jest prawidłowa
        //   if (!isNaN(date)) {
        //     // Jeśli data jest prawidłowa, zwracamy ją jako lokalizowaną datę w formacie pl-PL
        //     return date.toLocaleDateString("pl-PL", {
        //       useGrouping: true,
        //     });
        //   } else {
        //     // Jeśli data jest nieprawidłowa, zwracamy pusty string lub inny komunikat błędu
        //     return "brak danych";
        //   }
        // },
      },
      {
        accessorKey: "UWAGI_ASYSTENT",
        header: "UWAGI_ASYSTENT",
        // filterVariant: "multi-select",
      },
      {
        accessorKey: "UWAGI_Z_FAKTURY",
        header: "UWAGI_Z_FAKTURY",
        // filterVariant: "multi-select",
      },
      {
        accessorKey: "ZAZNACZ_KONTRAHENTA",
        header: "ZAZNACZ_KONTRAHENTA",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "CZY_PRZETERMINOWANE",
        header: "CZY_PRZETERMINOWANE",
        filterVariant: "multi-select",
      },
    ],
    [columns, columnSizing]
  );

  const table = useMaterialReactTable({
    columns: columnsItem,
    data: documents,
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
      columnVisibility,
      columnOrder,
      columnPinning,
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
      // sx: { m: '0.5rem 0', width: '100%' },
      sx: { m: "0", width: "300px" },
      variant: "outlined",
    },
    muiPaginationProps: {
      rowsPerPageOptions: [10, 20, 30, 50, 100],
      // rowsPerPageOptions: [10, 20, 30, 50, 100, { value: 10000, label: 'Całość' }],
      shape: "rounded",
      variant: "outlined",
    },
    muiTableHeadCellProps: () => ({
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
    }),
    // odczytanie danych po kliknięciu w wiersz
    muiTableBodyCellProps: ({ column, row, cell }) => ({
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
    }),

    renderTopToolbarCustomActions: ({ table }) => (
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
    ),
  });

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
        // const modifiedColumns = prepareColumns(getColumns.data, result.data);
        if (isMounted) {
          const updateDocuments = prepareDataTable(result.data);
          setDocuments(updateDocuments);
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
          const modifiedColumns = prepareColumns(
            getColumns.data,
            updateDocuments
          );
          console.log(modifiedColumns);
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
              <MaterialReactTable table={table} />
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
