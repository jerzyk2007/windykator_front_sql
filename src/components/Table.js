// import { useEffect, useMemo, useState } from "react";
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from "material-react-table";
// import { MRT_Localization_PL } from "material-react-table/locales/pl";
// import { ThemeProvider, useTheme } from "@mui/material";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import "dayjs/locale/pl";
// import { plPL } from "@mui/x-date-pickers/locales";
// import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
// import useData from "./hooks/useData";
// import useWindowSize from "./hooks/useWindow";
// // import { TfiSave } from "react-icons/tfi";
// // import { SiMicrosoftexcel } from "react-icons/si";
// import QuickTableNote from "./QuickTableNote";
// import EditRowTable from "./EditRowTable";
// import PleaseWait from "./PleaseWait";
// import * as xlsx from "xlsx";
// import {
//   Box,
//   Button,
//   ListItemIcon,
//   MenuItem,
//   Typography,
//   lighten,
// } from "@mui/material";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";

// import "./Table.css";

// const Table = ({ info }) => {
//   const theme = useTheme();

//   const axiosPrivateIntercept = useAxiosPrivateIntercept();
//   const { pleaseWait, setPleaseWait, auth } = useData();
//   const { height } = useWindowSize();

//   const [documents, setDocuments] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [columnSizing, setColumnSizing] = useState({});
//   const [density, setDensity] = useState("");
//   const [columnOrder, setColumnOrder] = useState([]);
//   const [columnPinning, setColumnPinning] = useState({});
//   const [columns, setColumns] = useState([]);
//   const [tableSize, setTableSize] = useState(500);
//   const [pagination, setPagination] = useState({});

//   const [sorting, setSorting] = useState([
//     { id: "ILE_DNI_PO_TERMINIE", desc: false },
//   ]);

//   const [quickNote, setQuickNote] = useState("");
//   const [dataRowTable, setDataRowTable] = useState("");

//   const muiTableBodyCellProps = {
//     align: "center",
//     sx: {
//       fontSize: "16px",
//       borderRight: "1px solid #000",
//       borderBottom: "1px solid #000",
//       fontFamily: "Calibri",
//       padding: "5px",
//       fontWeight: "500",
//       minHeight: "2rem",
//       // maxHeight: "8rem",
//       textWrap: "balance",
//       whiteSpace: "pre-wrap",
//     },
//   };

//   const plLocale =
//     plPL.components.MuiLocalizationProvider.defaultProps.localeText;

//   const prepareColumns = (columnsData, data) => {
//     const changeColumn = columnsData.map((item) => {
//       const modifiedItem = { ...item };

//       modifiedItem.muiTableBodyCellProps = muiTableBodyCellProps;

//       if (item.filterVariant === "startsWith") {
//         modifiedItem.filterFn = "startsWith";
//       }

//       if (item.filterVariant === "date-range") {
//         modifiedItem.accessorFn = (originalRow) =>
//           new Date(originalRow[item.accessorKey]);
//         modifiedItem.Cell = ({ cell }) =>
//           cell.getValue().toLocaleDateString("pl-PL", {
//             useGrouping: true,
//           });
//       }

//       if (item.accessorKey === "UWAGI_ASYSTENT") {
//         modifiedItem.Cell = ({ cell }) => {
//           const cellValue = cell.getValue();
//           if (Array.isArray(cellValue) && cellValue.length > 0) {
//             let numberOfObjects = cellValue.length;
//             return (
//               <div style={{ whiteSpace: "pre-wrap" }}>
//                 {numberOfObjects > 1 && (
//                   <p>{`Liczba wpisów wcześniejszych: ${
//                     numberOfObjects - 1
//                   }`}</p>
//                 )}
//                 {cellValue.map((item, index) => (
//                   <p key={index}>
//                     {
//                       index === cellValue.length - 1 // Sprawdzanie czy to ostatni element w tablicy
//                         ? item.length > 200 // Sprawdzenie długości tekstu
//                           ? item.slice(0, 200) + "..." // Jeśli tekst jest dłuższy niż 150 znaków, obetnij i dodaj trzy kropki na końcu
//                           : item // W przeciwnym razie, wyświetl pełny tekst
//                         : null // W przeciwnym razie, nie wyświetlaj nic
//                     }
//                   </p>
//                 ))}
//               </div>
//             );
//           }
//         };

//         const changeMuiTableBodyCellProps = { ...muiTableBodyCellProps };
//         changeMuiTableBodyCellProps.align = "left";
//         const updatedSx = { ...changeMuiTableBodyCellProps.sx };
//         updatedSx.backgroundColor = "rgba(248, 255, 152, .2)";
//         changeMuiTableBodyCellProps.sx = updatedSx;
//         modifiedItem.muiTableBodyCellProps = changeMuiTableBodyCellProps;
//       }

//       if (item.accessorKey === "UWAGI_Z_FAKTURY") {
//         modifiedItem.Cell = ({ cell }) => {
//           const cellValue = cell.getValue();
//           if (Array.isArray(cellValue) && cellValue.length > 0) {
//             return (
//               <div style={{ whiteSpace: "pre-wrap" }}>
//                 {cellValue.map((item, index) => (
//                   <p key={index}>{item}</p>
//                 ))}
//               </div>
//             );
//           }
//         };
//         const changeMuiTableBodyCellProps = { ...muiTableBodyCellProps };
//         changeMuiTableBodyCellProps.align = "left";
//         modifiedItem.muiTableBodyCellProps = changeMuiTableBodyCellProps;
//       }

//       if (item.accessorKey === "KONTRAHENT") {
//         modifiedItem.muiTableBodyCellProps = ({ cell }) => {
//           const cellValue = cell.getValue();
//           const checkClient = cell.row.original.ZAZNACZ_KONTRAHENTA;

//           return {
//             align: "left",
//             sx: {
//               ...muiTableBodyCellProps.sx,
//               backgroundColor:
//                 cell.column.id === "KONTRAHENT" && checkClient === "Tak"
//                   ? "#7fffd4"
//                   : "white",
//             },
//           };
//         };
//       }

//       if (item.accessorKey === "ZAZNACZ_KONTRAHENTA") {
//         modifiedItem.Cell = ({ cell, row }) => {
//           const cellValue = cell.getValue();

//           return <span>{cellValue}</span>;
//         };
//       }

//       if (item.accessorKey === "ILE_DNI_PO_TERMINIE") {
//         modifiedItem.muiTableBodyCellProps = ({ cell }) => ({
//           ...muiTableBodyCellProps,
//           sx: {
//             ...muiTableBodyCellProps.sx,
//             backgroundColor:
//               cell.column.id === "ILE_DNI_PO_TERMINIE" && cell.getValue() > 0
//                 ? "rgb(250, 136, 136)"
//                 : "white",
//           },
//         });
//       }

//       if (item.accessorKey === "DO_ROZLICZENIA") {
//         modifiedItem.muiTableBodyCellProps = ({ cell }) => ({
//           ...muiTableBodyCellProps,
//           sx: {
//             ...muiTableBodyCellProps.sx,
//             backgroundColor: "rgba(248, 255, 152, .2)",
//           },
//         });
//       }

//       if (item.accessorKey === "50_VAT") {
//         modifiedItem.muiTableBodyCellProps = ({ cell }) => {
//           const cellValue = cell.getValue();
//           const dorozliczValue = cell.row.original.DO_ROZLICZENIA;

//           return {
//             ...muiTableBodyCellProps,
//             sx: {
//               ...muiTableBodyCellProps.sx,
//               backgroundColor:
//                 cell.column.id === "50_VAT" &&
//                 Math.abs(cellValue - dorozliczValue) <= 1
//                   ? "rgb(250, 136, 136)"
//                   : "white",
//             },
//           };
//         };
//       }

//       if (item.accessorKey === "100_VAT") {
//         modifiedItem.muiTableBodyCellProps = ({ cell }) => {
//           const cellValue = cell.getValue();
//           const dorozliczValue = cell.row.original.DO_ROZLICZENIA;
//           return {
//             ...muiTableBodyCellProps,
//             sx: {
//               ...muiTableBodyCellProps.sx,
//               backgroundColor:
//                 cell.column.id === "100_VAT" &&
//                 Math.abs(cellValue - dorozliczValue) <= 1
//                   ? "rgb(250, 136, 136)"
//                   : "white",
//             },
//           };
//         };
//       }

//       if (item.filterVariant === "none") {
//         modifiedItem.enableColumnFilter = false;
//         delete modifiedItem.filterVariant;
//       }

//       if (item.filterVariant === "range-slider") {
//         modifiedItem.muiFilterSliderProps = {
//           marks: true,
//           max: data.reduce(
//             (max, key) => Math.max(max, key[item.accessorKey]),
//             Number.NEGATIVE_INFINITY
//           ),
//           min: data.reduce(
//             (min, key) => Math.min(min, key[item.accessorKey]),
//             Number.POSITIVE_INFINITY
//           ),
//           step: 100,
//           valueLabelFormat: (value) =>
//             value.toLocaleString("pl-PL", {
//               style: "currency",
//               currency: "PLN",
//             }),
//         };
//       }

//       if (item.type === "money") {
//         modifiedItem.Cell = ({ cell }) => {
//           const value = cell.getValue();
//           const formattedSalary =
//             value !== undefined && value !== null
//               ? value.toLocaleString("pl-PL", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                   useGrouping: true,
//                 })
//               : "0,00"; // Zastąp puste pola zerem

//           return `${formattedSalary}`;
//         };
//       }

//       delete modifiedItem.type;

//       return modifiedItem;
//     });
//     return changeColumn;
//   };

//   const handleSaveSettings = async () => {
//     const tableSettings = {
//       size: { ...columnSizing },
//       visible: { ...columnVisibility },
//       density,
//       order: columnOrder,
//       pinning: columnPinning,
//       pagination,
//     };
//     try {
//       const result = await axiosPrivateIntercept.patch(
//         `/user/save-table-settings/${auth._id}`,
//         { tableSettings }
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleExportExcel = async () => {
//     const result = await axiosPrivateIntercept.get(
//       `/documents/get-all/${auth._id}/${info}`
//     );

//     // console.log(columns);

//     const cleanData = result.data.map((doc) => {
//       const { _id, __v, UWAGI_ASYSTENT, UWAGI_Z_FAKTURY, ...cleanDoc } = doc;
//       if (Array.isArray(UWAGI_ASYSTENT)) {
//         cleanDoc.UWAGI_ASYSTENT = UWAGI_ASYSTENT.join(", ");
//       }
//       if (Array.isArray(UWAGI_Z_FAKTURY)) {
//         cleanDoc.UWAGI_Z_FAKTURY = UWAGI_Z_FAKTURY.join(", ");
//       }
//       return cleanDoc;
//     });

//     const wb = xlsx.utils.book_new();
//     const ws = xlsx.utils.json_to_sheet(cleanData);
//     xlsx.utils.book_append_sheet(wb, ws, "Faktury");
//     xlsx.writeFile(wb, "Faktury.xlsx");
//   };

//   const columnsItem = useMemo(
//     () => [
//       {
//         accessorKey: "DZIAL",
//         header: "DZIAL",
//         filterVariant: "multi-select",
//       },
//       {
//         accessorKey: "50_VAT",
//         header: "50_VAT",
//       },
//       {
//         accessorKey: "100_VAT",
//         header: "100_VAT",
//       },
//       {
//         accessorKey: "ASYSTENTKA",
//         header: "ASYSTENTKA",
//       },
//       {
//         accessorKey: "BLAD_DORADCY",
//         header: "BLAD_DORADCY",
//       },
//       {
//         accessorKey: "BLAD_W_DOKUMENTACJI",
//         header: "BLAD_W_DOKUMENTACJI",
//       },
//       {
//         accessorKey: "BRUTTO",
//         header: "BRUTTO",
//       },
//       {
//         accessorKey: "CZY_PRZETERMINOWANE",
//         header: "CZY_PRZETERMINOWANE",
//       },
//       {
//         accessorKey: "DATA_FV",
//         header: "DATA_FV",
//       },
//       {
//         accessorKey: "DATA_KOMENTARZA_BECARED",
//         header: "DATA_KOMENTARZA_BECARED",
//       },
//       {
//         accessorKey: "DORADCA",
//         header: "DORADCA",
//       },
//       {
//         accessorKey: "DO_ROZLICZENIA",
//         header: "DO_ROZLICZENIA",
//       },

//       {
//         accessorKey: "DZIALANIA",
//         header: "DZIALANIA",
//       },
//       {
//         accessorKey: "ILE_DNI_PO_TERMINIE",
//         header: "ILE_DNI_PO_TERMINIE",
//       },
//       {
//         accessorKey: "JAKA_KANCELARIA",
//         header: "JAKA_KANCELARIA",
//       },

//       {
//         accessorKey: "KOMENTARZ_KANCELARIA_BECARED",
//         header: "KOMENTARZ_KANCELARIA_BECARED",
//       },
//       {
//         accessorKey: "KONTRAHENT",
//         header: "KONTRAHENT",
//       },
//       {
//         accessorKey: "KWOTA_WINDYKOWANA_BECARED",
//         header: "KWOTA_WINDYKOWANA_BECARED",
//       },
//       {
//         accessorKey: "NETTO",
//         header: "NETTO",
//       },
//       {
//         accessorKey: "NR_REJESTRACYJNY",
//         header: "NR_REJESTRACYJNY",
//       },

//       {
//         accessorKey: "NR_SZKODY",
//         header: "NR_SZKODY",
//       },
//       {
//         accessorKey: "NUMER_FV",
//         header: "NUMER_FV",
//       },
//       {
//         accessorKey: "NUMER_SPRAWY_BECARED",
//         header: "NUMER_SPRAWY_BECARED",
//       },

//       {
//         accessorKey: "POBRANO_VAT",
//         header: "POBRANO_VAT",
//       },
//       {
//         accessorKey: "STATUS_SPRAWY_KANCELARIA",
//         header: "STATUS_SPRAWY_KANCELARIA",
//       },
//       {
//         accessorKey: "STATUS_SPRAWY_WINDYKACJA",
//         header: "STATUS_SPRAWY_WINDYKACJA",
//       },

//       {
//         accessorKey: "TERMIN",
//         header: "TERMIN",
//       },
//       {
//         accessorKey: "UWAGI_ASYSTENT",
//         header: "UWAGI_ASYSTENT",
//       },

//       {
//         accessorKey: "UWAGI_Z_FAKTURY",
//         header: "UWAGI_Z_FAKTURY",
//       },
//       {
//         accessorKey: "ZAZNACZ_KONTRAHENTA",
//         header: "ZAZNACZ_KONTRAHENTA",
//       },
//     ],
//     [documents]
//   );

//   //   useEffect(() => {
//   //     console.log(documents);
//   //   }, [documents]);

//   useEffect(() => {
//     setTableSize(height - 165);
//   }, [height]);

//   useEffect(() => {
//     let isMounted = true;

//     const prepareTable = async () => {
//       try {
//         setPleaseWait(true);
//         const [result, settingsUser, getColumns] = await Promise.all([
//           axiosPrivateIntercept.get(`/documents/get-all/${auth._id}/${info}`),
//           axiosPrivateIntercept.get(`/user/get-table-settings/${auth._id}`),
//           axiosPrivateIntercept.get(`/user/get-columns/${auth._id}`),
//         ]);
//         const modifiedColumns = prepareColumns(getColumns.data, result.data);
//         if (isMounted) {
//           setDocuments(result.data);
//           setColumnVisibility(settingsUser?.data?.visible || {});
//           setColumnSizing(settingsUser?.data?.size || {});
//           // setDensity(settingsUser?.data?.density || 'comfortable');
//           setColumnOrder(
//             settingsUser?.data?.order?.map((order) => order) || []
//           );
//           setColumnPinning(
//             settingsUser?.data?.pinning || { left: [], right: [] }
//           );
//           setPagination(
//             settingsUser?.data?.pagination || { pageIndex: 0, pageSize: 10 }
//           );
//           setColumns(modifiedColumns);
//           setPleaseWait(false);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     setQuickNote("");
//     setDataRowTable("");
//     prepareTable();

//     return () => {
//       isMounted = false;
//     };
//   }, [info]);

//   const handleExportRows = (rows) => {
//     const rowData = rows.map((row) => row.original);
//     console.log(rowData);
//     // console.log(rows);
//   };

//   const table = useMaterialReactTable({
//     columns: columnsItem,
//     data: documents,
//     enableColumnOrdering: true,
//     columnFilterDisplayMode: "popover",
//     enableFacetedValues: true,
//     renderTopToolbarCustomActions: ({ table }) => (
//       <Box
//         sx={{
//           display: "flex",
//           gap: "16px",
//           padding: "8px",
//           flexWrap: "wrap",
//         }}
//       >
//         <Button
//           disabled={table.getRowModel().rows.length === 0}
//           //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
//           //   onClick={() => handleExportRows(table.getRowModel().rows)}
//           onClick={() =>
//             handleExportRows(table.getPrePaginationRowModel().rows)
//           }
//           startIcon={<FileDownloadIcon />}
//         >
//           Export Page Rows
//         </Button>
//       </Box>
//     ),
//   });

//   return (
//     <section className="actual_table">
//       {pleaseWait ? (
//         <PleaseWait />
//       ) : (
//         <>
//           <ThemeProvider theme={theme}>
//             {quickNote && (
//               <QuickTableNote
//                 quickNote={quickNote}
//                 setQuickNote={setQuickNote}
//                 documents={documents}
//                 setDocuments={setDocuments}
//               />
//             )}

//             {auth?.roles?.includes(200 || 300 || 500) && dataRowTable && (
//               <EditRowTable
//                 dataRowTable={dataRowTable}
//                 setDataRowTable={setDataRowTable}
//                 documents={documents}
//                 setDocuments={setDocuments}
//               />
//             )}

//             <LocalizationProvider
//               dateAdapter={AdapterDayjs}
//               adapterLocale="pl"
//               localeText={plLocale}
//             >
//               {/* <MaterialReactTable
//                 className="actual_table__table"
//                 columns={columnsItem}
//                 data={documents}
//                 enableClickToCopy
//                 enableColumnFilterModes
//                 enableStickyHeader
//                 enableStickyFooter
//                 enableSorting
//                 enableColumnResizing
//                 onColumnSizingChange={setColumnSizing}
//                 onColumnVisibilityChange={setColumnVisibility}
//                 // onDensityChange={setDensity}
//                 onColumnOrderChange={setColumnOrder}
//                 enableColumnOrdering
//                 enableColumnPinning
//                 onColumnPinningChange={setColumnPinning}
//                 onPaginationChange={setPagination}
//                 onSortingChange={setSorting}
//                 enableDensityToggle={false}
//                 enableSelectAll={false}
//                 initialState={{
//                   showColumnFilters: false,
//                   showGlobalFilter: true,
//                   density: "compact",
//                 }}
//                 localization={MRT_Localization_PL}
//                 state={{
//                   columnVisibility,
//                   // density,
//                   columnOrder,
//                   columnPinning,
//                   pagination,
//                   sorting,
//                 }}
//                 // filterFns={'equals'}
//                 enableGlobalFilterModes
//                 globalFilterModeOptions={["contains", "fuzzy", "startsWith"]}
//                 globalFilterFn="contains"
//                 positionGlobalFilter="left"
//                 // opcja wyszukuje zbiory do select i multi-select
//                 enableFacetedValues
//                 // rowCount={data.length}

//                 // wyłącza filtr (3 kropki) w kolumnie
//                 enableColumnActions={false}
//                 // nie odświeża tabeli po zmianie danych
//                 autoResetPageIndex={false}
//                 // enableColumnVirtualization

//                 muiTableContainerProps={{ sx: { maxHeight: tableSize } }}
//                 // wyświetla filtry nad komórką -
//                 columnFilterDisplayMode={"popover"}
//                 //filtr nad headerem - popover
//                 muiFilterTextFieldProps={{
//                   // sx: { m: '0.5rem 0', width: '100%' },
//                   sx: { m: "0", width: "300px" },
//                   variant: "outlined",
//                 }}
//                 muiPaginationProps={{
//                   rowsPerPageOptions: [10, 20, 30, 50, 100],
//                   // rowsPerPageOptions: [10, 20, 30, 50, 100, { value: 10000, label: 'Całość' }],
//                   shape: "rounded",
//                   variant: "outlined",
//                 }}
//                 muiTableHeadCellProps={() => ({
//                   align: "left",
//                   sx: {
//                     fontWeight: "700",
//                     fontFamily: "Calibri, sans-serif",
//                     fontSize: "15px",
//                     color: "black",
//                     backgroundColor: "#a7d3f7",
//                     borderRight: "1px solid #c9c7c7",
//                     minHeight: "3rem",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     "& .Mui-TableHeadCell-Content": {
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       textAlign: "center",
//                       textWrap: "balance",
//                     },
//                     "& .Mui-TableHeadCell-Content-Actions": {
//                       display: "none",
//                     },
//                   },
//                 })}
//                 // odczytanie danych po kliknięciu w wiersz
//                 muiTableBodyCellProps={({ column, row, cell }) => ({
//                   onDoubleClick: () => {
//                     if (column.id === "UWAGI_ASYSTENT") {
//                       setQuickNote(row.original);
//                     } else {
//                       setDataRowTable(row.original);
//                     }
//                   },
//                   sx: {
//                     // position: "relative"
//                   },
//                 })}
//               /> */}
//               <MaterialReactTable table={table} />
//             </LocalizationProvider>
//           </ThemeProvider>
//           <section className="table-icons-panel">
//             <i
//               className="fas fa-save table-save-settings"
//               onClick={handleSaveSettings}
//             ></i>
//             <i
//               className="fa-regular fa-file-excel table-export-excel"
//               onClick={handleExportExcel}
//             ></i>
//           </section>
//         </>
//       )}
//     </section>
//   );
// };

// export default Table;

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
// import { TfiSave } from "react-icons/tfi";
// import { SiMicrosoftexcel } from "react-icons/si";
import QuickTableNote from "./QuickTableNote";
import EditRowTable from "./EditRowTable";
import PleaseWait from "./PleaseWait";
import * as xlsx from "xlsx";

import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  Typography,
  lighten,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import "./Table.css";

const Table = ({ info }) => {
  const theme = useTheme();

  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { pleaseWait, setPleaseWait, auth } = useData();
  const { height } = useWindowSize();

  const [documents, setDocuments] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnSizing, setColumnSizing] = useState({});
  const [density, setDensity] = useState("");
  const [columnOrder, setColumnOrder] = useState([]);
  const [columnPinning, setColumnPinning] = useState({});
  const [columns, setColumns] = useState([]);
  const [tableSize, setTableSize] = useState(500);
  const [pagination, setPagination] = useState({});
  const [filteredColumns, setFilteredColumns] = useState([]);

  const [sorting, setSorting] = useState([
    { id: "ILE_DNI_PO_TERMINIE", desc: false },
  ]);

  const [quickNote, setQuickNote] = useState("");
  const [dataRowTable, setDataRowTable] = useState("");

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

  const plLocale =
    plPL.components.MuiLocalizationProvider.defaultProps.localeText;

  const prepareColumns = (columnsData, data) => {
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
                  <p>{`Liczba wpisów wcześniejszych: ${
                    numberOfObjects - 1
                  }`}</p>
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
      //   console.log(modifiedItem);
      //   setFilteredColumns((prev) => {
      //     return { ...prev, modifiedItem };
      //   });

      return modifiedItem;
    });
    return changeColumn;
  };

  const handleSaveSettings = async () => {
    const tableSettings = {
      size: { ...columnSizing },
      visible: { ...columnVisibility },
      density,
      order: columnOrder,
      pinning: columnPinning,
      pagination,
    };
    try {
      const result = await axiosPrivateIntercept.patch(
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
    setTableSize(height - 165);
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
  }, [info]);

  // Funkcja do usuwania niepotrzebnych kluczy z obiektów JSON
  //   const filterKeys = (data, keys) => {
  //     return data.map((obj) => {
  //       return Object.keys(obj)
  //         .filter((key) => keys.includes(key))
  //         .reduce((acc, key) => {
  //           acc[key] = obj[key];
  //           return acc;
  //         }, {});
  //     });
  //   };

  // Funkcja sortująca
  const sortColumns = (columns, pinning) => {
    const leftPinned = pinning.left || [];
    const rightPinned = pinning.right || [];

    const sortedColumns = [...columns];

    // Sortowanie kolumn przypiętych z lewej strony
    sortedColumns.sort((a, b) => {
      const aIndex = leftPinned.indexOf(a);
      const bIndex = leftPinned.indexOf(b);
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      } else if (aIndex !== -1) {
        return -1;
      } else if (bIndex !== -1) {
        return 1;
      }
      return 0;
    });

    // Sortowanie kolumn przypiętych z prawej strony
    sortedColumns.sort((a, b) => {
      const aIndex = rightPinned.indexOf(a);
      const bIndex = rightPinned.indexOf(b);
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      } else if (aIndex !== -1) {
        return 1;
      } else if (bIndex !== -1) {
        return -1;
      }
      return 0;
    });

    return sortedColumns;
  };

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);

    const orderColumns = [...columnOrder].filter(
      (item) => item !== "mrt-row-spacer"
    );

    const arrayColumns = orderColumns.filter(
      (item) => columnVisibility[item] !== false
    );

    // wywołanie funkcji która posortuje kolumny wg ustaiweń usera, order/pining
    const sortedColumns = sortColumns(arrayColumns, columnPinning);

    const filteredData = rowData.map((obj) => {
      return Object.keys(obj)
        .filter((key) => arrayColumns.includes(key))
        .reduce((acc, key) => {
          // Sprawdź, czy klucz znajduje się w mapowaniu
          const mappedKey = columns.find((col) => col.accessorKey === key);
          // Jeśli klucz został znaleziony, użyj nowej nazwy klucza (header)
          const newKey = mappedKey ? mappedKey.header : key;

          acc[newKey] = obj[key];
          return acc;
        }, {});
    });

    console.log(filteredData);
    console.log(sortedColumns);

    // const filteredData = rowData.map((obj) => {
    //   const orderedObj = {};
    //   arrayColumns.forEach((key) => {
    //     if (obj.hasOwnProperty(key)) {
    //       orderedObj[key] = obj[key];
    //     }
    //   });
    //   return orderedObj;
    // });

    // const cleanData = filteredData.map((doc) => {
    //   const { _id, __v, UWAGI_ASYSTENT, UWAGI_Z_FAKTURY, ...cleanDoc } = doc;
    //   if (Array.isArray(UWAGI_ASYSTENT)) {
    //     cleanDoc.UWAGI_ASYSTENT = UWAGI_ASYSTENT.join(", ");
    //   }
    //   if (Array.isArray(UWAGI_Z_FAKTURY)) {
    //     cleanDoc.UWAGI_Z_FAKTURY = UWAGI_Z_FAKTURY.join(", ");
    //   }
    //   return cleanDoc;
    // });

    // const wb = xlsx.utils.book_new();
    // const ws = xlsx.utils.json_to_sheet(cleanData);
    // xlsx.utils.book_append_sheet(wb, ws, "Tabela");
    // xlsx.writeFile(wb, "Tabela.xlsx");
  };

  //   useEffect(() => {
  //     console.log(columnOrder);
  //   }, [columnOrder, columns]);

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
                globalFilterModeOptions={["contains", "fuzzy", "startsWith"]}
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
                        handleExportRows(table.getPrePaginationRowModel().rows)
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
