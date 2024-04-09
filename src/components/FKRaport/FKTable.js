import { useState, useMemo, useEffect } from "react";
import {
  MaterialReactTable, //import alternative sub-component if we do not want toolbars
  useMaterialReactTable,
} from "material-react-table";
import { ThemeProvider, useTheme } from "@mui/material";
import { MRT_Localization_PL } from "material-react-table/locales/pl";
import useWindowSize from "../hooks/useWindow";
import Button from "@mui/material/Button";
import { prepareColumns } from "../utilsForTable/PrepareColumns";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";

import "./FKTable.css";

const FKTable = ({ tableData, setShowTable }) => {
  const { height } = useWindowSize();
  const [data, setData] = useState(tableData);
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const theme = useTheme();

  const [tableSize, setTableSize] = useState(500);
  const [columns, setColumns] = useState([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, //customize the default page size
  });

  const columnsItem = useMemo(
    () => [
      {
        accessorKey: "TYP_DOK",
        header: "TYP_DOK",
        filterVariant: "multi-select",
      },
      {
        accessorKey: "DZIAL",
        header: "Dział",
        filterVariant: "multi-select",
      },
    ],

    [columns]
  );

  // const columnsItem = useMemo(
  //   () =>
  //     columns.map((column) => ({
  //       ...column,
  //       // size: columnSizing?.[column.accessorKey]
  //       //   ? columnSizing[column.accessorKey]
  //       //   : column.size,
  //       // // enableHiding: true,
  //       // // enablePinning: true,
  //       // enableColumnFilterModes: true,
  //       // minSize: 50,
  //       // maxSize: 400,
  //     })),
  //   [columns]
  // );

  // const columns = useMemo(() => {
  //   const firstObject = data.length > 0 ? tableData[0] : {};
  //   const keys = Object.keys(firstObject);

  //   const generatedColumns = keys.map((key) => {
  //     return {
  //       accessorKey: [key],
  //       header: [key],
  //       size: 50,
  //     };
  //   });

  //   return generatedColumns;
  // }, [data]);

  const table = useMaterialReactTable({
    columns: columnsItem,
    data,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,

    muiPaginationProps: {
      rowsPerPageOptions: [10, 20, 50, 100],
      showFirstButton: false,
      showLastButton: false,
    },

    muiTableContainerProps: { sx: { maxHeight: tableSize } },

    localization: MRT_Localization_PL,
    muiTableBodyRowProps: { hover: false },

    columnFilterDisplayMode: "popover",
    // opcja wyszukuje zbiory do select i multi-select
    enableFacetedValues: true,

    // muiTableHeadCellProps: {
    //   // align: "left",
    //   sx: {
    //     borderTop: "1px solid rgba(81, 81, 81, .5)",
    //     borderRight: "1px solid rgba(81, 81, 81, .5)",
    //     fontFamily: "Calibri",
    //     fontWeight: "700",
    //     backgroundColor: "#ddd",
    //     // lineHeight: "1rem",
    //     "& .Mui-TableHeadCell-stickyHeader": {
    //       display: "flex",
    //       alignItems: "center",
    //       justifyContent: "center",
    //       textAlign: "center",
    //       textWrap: "balance",
    //     },
    //   },
    // },
    muiTableBodyCellProps: {
      sx: {
        borderTop: "1px solid rgba(81, 81, 81, .5)",
        borderRight: "1px solid rgba(81, 81, 81, .5)",
        padding: "5px",
        fontFamily: "Calibri",
        textAlign: "center",
      },
    },
  });

  useEffect(() => {
    setTableSize(height - 165);
  }, [height]);

  useEffect(() => {
    const getData = async () => {
      const settingsColumn = await axiosPrivateIntercept.get("/fk/get-columns");
      const columnsData = prepareColumns(settingsColumn.data);
      console.log(columnsData);
      setColumns(columnsData);
    };

    getData();
  }, [tableData]);

  return (
    // <section className="fk_table">
    <section className="fk_table">
      <ThemeProvider theme={theme}>
        <MaterialReactTable table={table} />
      </ThemeProvider>
      <Button
        className="fk_table-exit"
        variant="contained"
        color="error"
        onClick={() => setShowTable(false)}
      >
        Wyjście
      </Button>
    </section>
  );
};

export default FKTable;
// import { useState, useMemo, useEffect } from 'react';
// import {
//     MaterialReactTable, //import alternative sub-component if we do not want toolbars
//     useMaterialReactTable,
// } from 'material-react-table';
// import { MRT_Localization_PL } from 'material-react-table/locales/pl';
// import useWindowSize from './hooks/useWindow';
// import Button from '@mui/material/Button';
// import './FKTable.css';

// const FKTable = ({ tableData, setShowTable }) => {
//     const { height } = useWindowSize();
//     const [data, setData] = useState(tableData);
//     const [tableSize, setTableSize] = useState(500);

//     const [pagination, setPagination] = useState({
//         pageIndex: 0,
//         pageSize: 10, //customize the default page size
//     });

//     const columns = useMemo(() => {
//         const firstObject = data.length > 0 ? tableData[0] : {};
//         const keys = Object.keys(firstObject);

//         const generatedColumns = keys.map(key => ({
//             accessorKey: [key],
//             header: [key],
//             size: 80
//             // header: firstObject[key] !== null && firstObject[key] !== undefined ? key : '' //
//             //  Sprawdź, czy wartość nie jest null ani undefined
//         }));

//         return generatedColumns;
//     }, [data]);

//     useEffect(() => {
//         setTableSize(height - 107);
//     }, [height]);

//     const table = useMaterialReactTable({
//         columns,
//         data,
//         enableGlobalFilter: false,
//         enableGlobalFilterModes: false,
//         enableColumnFilters: false,
//         enableColumnResizing: false,
//         enableColumnOrdering: false,
//         enableColumnActions: false,
//         enablePagination: true,
//         enableTopToolbar: false,

//         enableSorting: true,
//         enableStickyHeader: true,
//         muiPaginationProps: {
//             rowsPerPageOptions: [10, 20, 50, 100],
//             showFirstButton: false,
//             showLastButton: false,
//         },

//         muiTableContainerProps: { sx: { maxHeight: tableSize } },

//         localization: MRT_Localization_PL,
//         muiTableBodyRowProps: { hover: false },

//         muiTableHeadCellProps: {
//             sx: {
//                 borderTop: '1px solid rgba(81, 81, 81, .5)',
//                 borderRight: '1px solid rgba(81, 81, 81, .5)',
//                 fontFamily: "Calibri",
//                 fontWeight: '700',
//                 backgroundColor: "#ddd",
//             },
//         },
//         muiTableBodyCellProps: {
//             sx: {
//                 borderTop: '1px solid rgba(81, 81, 81, .5)',
//                 borderRight: '1px solid rgba(81, 81, 81, .5)',
//                 padding: "5px",
//                 fontFamily: "Calibri",
//                 textAlign: "center"
//             },
//         },
//     });

//     return (
//         <section className='fk_table'>
//             <MaterialReactTable table={table} />
//             <Button
//                 variant="contained"
//                 color="error"
//                 onClick={() => setShowTable(false)}
//             >
//                 Wyjście
//             </Button>
//         </section>
//     );
// };

// export default FKTable;
