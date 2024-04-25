// import { useState, useMemo, useEffect } from "react";
// import {
//   MaterialReactTable, //import alternative sub-component if we do not want toolbars
//   useMaterialReactTable,
// } from "material-react-table";
// import { ThemeProvider, useTheme } from "@mui/material";
// import { MRT_Localization_PL } from "material-react-table/locales/pl";
// import useWindowSize from "../hooks/useWindow";
// import Button from "@mui/material/Button";
// import { prepareColumns } from "../utilsForTable/PrepareColumns";
// import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";

// import "./FKTable.css";

// const FKTable = ({ tableData, setShowTable }) => {
//   const { height } = useWindowSize();
//   const [data, setData] = useState(tableData);
//   const axiosPrivateIntercept = useAxiosPrivateIntercept();
//   const theme = useTheme();

//   const [tableSize, setTableSize] = useState(500);
//   const [columns, setColumns] = useState([]);

//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 10, //customize the default page size
//   });

//   const columnsItem = useMemo(
//     () => [
//       {
//         accessorKey: "TYP_DOK",
//         header: "TYP_DOK",
//         filterVariant: "multi-select",
//       },
//       {
//         accessorKey: "DZIAL",
//         header: "Dział",
//         filterVariant: "multi-select",
//       },
//     ],

//     [columns]
//   );

//   // const columnsItem = useMemo(
//   //   () =>
//   //     columns.map((column) => ({
//   //       ...column,
//   //       // size: columnSizing?.[column.accessorKey]
//   //       //   ? columnSizing[column.accessorKey]
//   //       //   : column.size,
//   //       // // enableHiding: true,
//   //       // // enablePinning: true,
//   //       // enableColumnFilterModes: true,
//   //       // minSize: 50,
//   //       // maxSize: 400,
//   //     })),
//   //   [columns]
//   // );

//   // const columns = useMemo(() => {
//   //   const firstObject = data.length > 0 ? tableData[0] : {};
//   //   const keys = Object.keys(firstObject);

//   //   const generatedColumns = keys.map((key) => {
//   //     return {
//   //       accessorKey: [key],
//   //       header: [key],
//   //       size: 50,
//   //     };
//   //   });

//   //   return generatedColumns;
//   // }, [data]);

//   const table = useMaterialReactTable({
//     columns: columnsItem,
//     data,
//     enableColumnFilterModes: true,
//     enableColumnOrdering: true,
//     enableGrouping: true,
//     enableColumnPinning: true,
//     enableFacetedValues: true,

//     muiPaginationProps: {
//       rowsPerPageOptions: [10, 20, 50, 100],
//       showFirstButton: false,
//       showLastButton: false,
//     },

//     muiTableContainerProps: { sx: { maxHeight: tableSize } },

//     localization: MRT_Localization_PL,
//     muiTableBodyRowProps: { hover: false },

//     columnFilterDisplayMode: "popover",
//     // opcja wyszukuje zbiory do select i multi-select
//     enableFacetedValues: true,

//     // muiTableHeadCellProps: {
//     //   // align: "left",
//     //   sx: {
//     //     borderTop: "1px solid rgba(81, 81, 81, .5)",
//     //     borderRight: "1px solid rgba(81, 81, 81, .5)",
//     //     fontFamily: "Calibri",
//     //     fontWeight: "700",
//     //     backgroundColor: "#ddd",
//     //     // lineHeight: "1rem",
//     //     "& .Mui-TableHeadCell-stickyHeader": {
//     //       display: "flex",
//     //       alignItems: "center",
//     //       justifyContent: "center",
//     //       textAlign: "center",
//     //       textWrap: "balance",
//     //     },
//     //   },
//     // },
//     muiTableBodyCellProps: {
//       sx: {
//         borderTop: "1px solid rgba(81, 81, 81, .5)",
//         borderRight: "1px solid rgba(81, 81, 81, .5)",
//         padding: "5px",
//         fontFamily: "Calibri",
//         textAlign: "center",
//       },
//     },
//   });

//   useEffect(() => {
//     setTableSize(height - 165);
//   }, [height]);

//   useEffect(() => {
//     const getData = async () => {
//       const settingsColumn = await axiosPrivateIntercept.get("/fk/get-columns");
//       const columnsData = prepareColumns(settingsColumn.data);
//       console.log(columnsData);
//       setColumns(columnsData);
//     };

//     getData();
//   }, [tableData]);

//   return (
//     // <section className="fk_table">
//     <section className="fk_table">
//       <ThemeProvider theme={theme}>
//         <MaterialReactTable table={table} />
//       </ThemeProvider>
//       <Button
//         className="fk_table-exit"
//         variant="contained"
//         color="error"
//         onClick={() => setShowTable(false)}
//       >
//         Wyjście
//       </Button>
//     </section>
//   );
// };

// export default FKTable;
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

import "./FKTable.css";

const FKTable = ({ tableData, setShowTable }) => {
  const theme = useTheme();
  const { height } = useWindowSize();
  const [data, setData] = useState([]);
  const [tableSize, setTableSize] = useState(500);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, //customize the default page size
  });

  const plLocale =
    plPL.components.MuiLocalizationProvider.defaultProps.localeText;
  // const columns = useMemo(() => {
  //   const firstObject = data.length > 0 ? tableData[0] : {};
  //   const keys = Object.keys(firstObject);

  //   const generatedColumns = keys.map((key) => ({
  //     accessorKey: [key],
  //     header: [key],
  //     size: 120,
  //     filterVariant: "multi-select",
  //     // header: firstObject[key] !== null && firstObject[key] !== undefined ? key : '' //
  //     //  Sprawdź, czy wartość nie jest null ani undefined
  //   }));

  //   return generatedColumns;
  // }, [data]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "CZY_SAMOCHOD_WYDANY_AS",
        header: "CZY_SAMOCHOD_WYDANY_AS",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "CZY_W_KANCELARI",
        header: "CZY_W_KANCELARI",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "DATA_WYDANIA_AUTA",
        header: "DATA_WYDANIA_AUTA",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "DATA_WYSTAWIENIA_FV",
        header: "DATA WYSTAWIENIA FV",
        filterVariant: "date-range",
        Cell: ({ cell }) => {
          // Parsowanie wartości komórki jako data
          const date = new Date(cell.getValue());
          // Sprawdzenie, czy data jest prawidłowa
          if (!isNaN(date)) {
            // Jeśli data jest prawidłowa, zwracamy ją jako lokalizowaną datę w formacie pl-PL
            return date.toLocaleDateString("pl-PL", {
              useGrouping: true,
            });
          } else {
            // Jeśli data jest nieprawidłowa, zwracamy pusty string lub inny komunikat błędu
            return "brak danych";
          }
        },
      },
      {
        accessorKey: "DO_ROZLICZENIA_AS",
        header: "DO_ROZLICZENIA_AS",
        filterVariant: "range",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const formattedSalary =
            value !== undefined && value !== null
              ? value.toLocaleString("pl-PL", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })
              : "NULL"; // Zastąp puste pola zerem

          return `${formattedSalary}`;
        },
      },

      {
        accessorKey: "DZIAL",
        header: "Dział",
        filterVariant: "multi-select",
      },

      {
        accessorKey: "ETAP_SPRAWY",
        header: "ETAP_SPRAWY",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "ILE_DNI_NA_PLATNOSC_FV",
        header: "ILE_DNI_NA_PLATNOSC_FV",
        filterVariant: "range",
      },

      {
        accessorKey: "JAKA_KANCELARIA",
        header: "JAKA_KANCELARIA",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "KONTRAHENT",
        header: "KONTRAHENT",
        // filterVariant: "multi-select",
      },
      {
        accessorKey: "KWOTA_DO_ROZLICZENIA_FK",
        header: "KWOTA_DO_ROZLICZENIA_FK",
        filterVariant: "range",
        Cell: ({ cell }) => {
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
        },
      },

      {
        accessorKey: "KWOTA_WPS",
        header: "KWOTA_WPS",
        filterVariant: "range",
        // filterVariant: "multi-select",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const formattedSalary =
            value !== undefined && value !== null && value !== 0
              ? value.toLocaleString("pl-PL", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })
              : "NULL"; // Zastąp puste pola zerem

          return `${formattedSalary}`;
        },
      },
      {
        accessorKey: "LOKALIZACJA",
        header: "LOKALIZACJA",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "NR_DOKUMENTU",
        header: "NR_DOKUMENTU",
        filterVariant: "text",
      },

      {
        accessorKey: "NR_KLIENTA",
        header: "NR_KLIENTA",
        // filterVariant: "multi-select",
      },
      {
        accessorKey: "OBSZAR",
        header: "OBSZAR",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "OPIEKUN_OBSZARU_CENTRALI",
        header: "OPIEKUN_OBSZARU_CENTRALI",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "OPIS_ROZRACHUNKU",
        header: "OPIS_ROZRACHUNKU",
        // filterVariant: "multi-select",
        Cell: ({ cell }) => {
          const cellValue = cell.getValue();
          if (Array.isArray(cellValue) && cellValue.length > 0) {
            return (
              <div style={{ whiteSpace: "pre-wrap" }}>
                {cellValue.map((item, index) => (
                  <p key={index} style={{ textAlign: "left" }}>
                    {item.length > 200 && index !== cellValue.length - 1
                      ? item.slice(0, 200) + "..."
                      : item}
                  </p>
                ))}
              </div>
            );
          } else {
            return null;
          }
        },
      },
      {
        accessorKey: "OWNER",
        header: "OWNER",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "PRZEDZIAL_WIEKOWANIE",
        header: "PRZEDZIAL_WIEKOWANIE",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "PRZETER_NIEPRZETER",
        header: "PRZETER_NIEPRZETER",
        filterVariant: "select",
      },
      {
        accessorKey: "RODZAJ_KONTA",
        header: "RODZAJ_KONTA",
        filterVariant: "select",
      },
      {
        accessorKey: "ROZNICA",
        header: "ROZNICA",
        filterVariant: "range",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const formattedSalary =
            value !== undefined && value !== null && value !== 0
              ? value.toLocaleString("pl-PL", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })
              : "NULL"; // Zastąp puste pola zerem

          return `${formattedSalary}`;
        },
      },
      {
        accessorKey: "TERMIN_PLATNOSCI_FV",
        header: "TERMIN_PLATNOSCI_FV",
        filterVariant: "date-range",
        Cell: ({ cell }) => {
          // Parsowanie wartości komórki jako data
          const date = new Date(cell.getValue());
          // Sprawdzenie, czy data jest prawidłowa
          if (!isNaN(date)) {
            // Jeśli data jest prawidłowa, zwracamy ją jako lokalizowaną datę w formacie pl-PL
            return date.toLocaleDateString("pl-PL", {
              useGrouping: true,
            });
          } else {
            // Jeśli data jest nieprawidłowa, zwracamy pusty string lub inny komunikat błędu
            return "brak danych";
          }
        },
      },
      {
        accessorKey: "TYP_DOKUMENTU",
        header: "TYP_DOKUMENTU",
        filterVariant: "multi-select",
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ],

    [data]
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
        fontSize: ".8rem",
        fontFamily: "Calibri",
        fontWeight: "700",
        backgroundColor: "#ddd",
        height: "10vh",

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

  useEffect(() => {
    setTableSize(height - 200);
  }, [height]);

  useEffect(() => {
    const update = tableData.map((item) => {
      if (!item.DO_ROZLICZENIA_AS) {
        item.DO_ROZLICZENIA_AS = "NULL";
      }

      if (item.JAKA_KANCELARIA === " ") {
        item.JAKA_KANCELARIA = "NIE DOTYCZY";
      }

      if (item.KWOTA_WPS) {
        item.KWOTA_WPS = Number(item.KWOTA_WPS);
      }

      if (!item.KWOTA_WPS) {
        item.KWOTA_WPS = 0;
      }

      if (item.RODZAJ_KONTA) {
        item.RODZAJ_KONTA = String(item.RODZAJ_KONTA);
      }

      if (!item.ROZNICA) {
        item.ROZNICA = 0;
      }

      if (item.DATA_WYSTAWIENIA_FV === "1900-01-01") {
        item.DATA_WYSTAWIENIA_FV = "brak danych";
      }
      if (item.DATA_WYSTAWIENIA_FV) {
        item.DATA_WYSTAWIENIA_FV = new Date(item.DATA_WYSTAWIENIA_FV);
      }
      if (item.TERMIN_PLATNOSCI_FV) {
        item.TERMIN_PLATNOSCI_FV = new Date(item.TERMIN_PLATNOSCI_FV);
      }

      if (item.OWNER) {
        // Jeśli item.OWNER istnieje i nie jest pusty, możemy przeprowadzić odpowiednie formatowanie
        const cellValue = item.OWNER;

        // Sprawdzamy, czy wartość jest tablicą i czy zawiera co najmniej jeden element
        if (Array.isArray(cellValue) && cellValue.length > 0) {
          // Tworzymy pojedynczy ciąg tekstu, łącząc wszystkie elementy tablicy
          const combinedText = cellValue.join(" - ");
          // Aktualizujemy wartość item.OWNER na sformatowany ciąg tekstu
          item.OWNER = combinedText;
        }
        // Jeśli wartość item.OWNER nie jest tablicą lub jest pusta, nie zmieniamy jej
      }

      if (item.OPIEKUN_OBSZARU_CENTRALI) {
        // Jeśli item.OWNER istnieje i nie jest pusty, możemy przeprowadzić odpowiednie formatowanie
        const cellValue = item.OPIEKUN_OBSZARU_CENTRALI;

        // Sprawdzamy, czy wartość jest tablicą i czy zawiera co najmniej jeden element
        if (Array.isArray(cellValue) && cellValue.length > 0) {
          // Tworzymy pojedynczy ciąg tekstu, łącząc wszystkie elementy tablicy
          const combinedText = cellValue.join(" - ");
          // Aktualizujemy wartość item.OWNER na sformatowany ciąg tekstu
          item.OPIEKUN_OBSZARU_CENTRALI = combinedText;
        }
        // Jeśli wartość item.OWNER nie jest tablicą lub jest pusta, nie zmieniamy jej
      }

      return item;
    });
    setData(update);
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
      {/* <Button
        className="fk_table-exit"
        variant="contained"
        color="error"
        onClick={() => setShowTable(false)}
      >
        Wyjście
      </Button> */}
    </section>
  );
};

export default FKTable;
