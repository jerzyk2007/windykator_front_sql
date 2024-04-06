import { useState, useMemo, useEffect } from "react";
import {
  MaterialReactTable, //import alternative sub-component if we do not want toolbars
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_PL } from "material-react-table/locales/pl";
import useWindowSize from "../hooks/useWindow";
import Button from "@mui/material/Button";
import "./FKTable.css";

const FKTable = ({ tableData, setShowTable }) => {
  const { height } = useWindowSize();
  const [data, setData] = useState(tableData);
  const [tableSize, setTableSize] = useState(500);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, //customize the default page size
  });

  //   const columns = useMemo(
  //     () => [
  //       {
  //         accessorKey: "TYP DOK.",
  //         header: "TYP DOK.",
  //       },
  //       {
  //         accessorKey: "NR. DOKUMENTU",
  //         header: "NR. DOKUMENTU",
  //       },
  //       {
  //         accessorKey: "DZIAŁ",
  //         header: "DZIAŁ",
  //       },
  //       {
  //         accessorKey: "Kontrahent",
  //         header: "KONTRAHENT",
  //       },
  //       {
  //         accessorKey: "RODZAJ KONTA",
  //         header: "RODZAJ KONTA",
  //       },
  //       {
  //         accessorKey: " KWOTA DO ROZLICZENIA FK ",
  //         header: "KWOTA DO ROZLICZENIA FK",
  //         Cell: ({ cell }) => {
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
  //         },
  //       },
  //       {
  //         accessorKey: " DO ROZLICZENIA AS3 (2024-02-20) ",
  //         header: "DO ROZLICZENIA AS3 (2024-02-20)",
  //         Cell: ({ cell }) => {
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
  //         },
  //       },
  //       {
  //         accessorKey: "RÓŻNICE ",
  //         header: "RÓŻNICE",
  //         Cell: ({ cell }) => {
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
  //         },
  //       },

  //       //   {
  //       //     accessorKey: " DATA ROZLICZENIA W AS3 ",
  //       //     header: "DATA ROZLICZENIA W AS3",
  //       //     //     Cell: ({ cell }) =>
  //       //     //       cell.getValue().toLocaleDateString("pl-PL", {
  //       //     //         useGrouping: true,
  //       //     //       }),
  //       //   },
  //     ],
  //     [data]
  //   );

  const columns = useMemo(() => {
    const firstObject = data.length > 0 ? tableData[0] : {};
    const keys = Object.keys(firstObject);

    const generatedColumns = keys.map((key) => {
      return {
        accessorKey: [key],
        header: [key],
        size: 50,
        // header: firstObject[key] !== null && firstObject[key] !== undefined ? key : '' //
        //  Sprawdź, czy wartość nie jest null ani undefined
      };
    });

    return generatedColumns;
  }, [data]);

  useEffect(() => {
    setTableSize(height - 107);
  }, [height]);

  const table = useMaterialReactTable({
    columns,
    data,
    enableGlobalFilter: false,
    enableGlobalFilterModes: false,
    enableColumnFilters: false,
    enableColumnResizing: false,
    enableColumnOrdering: false,
    enableColumnActions: false,
    enablePagination: true,
    enableTopToolbar: false,

    enableSorting: true,
    enableStickyHeader: true,
    muiPaginationProps: {
      rowsPerPageOptions: [10, 20, 50, 100],
      showFirstButton: false,
      showLastButton: false,
    },

    muiTableContainerProps: { sx: { maxHeight: tableSize } },

    localization: MRT_Localization_PL,
    muiTableBodyRowProps: { hover: false },

    muiTableHeadCellProps: {
      align: "center",
      sx: {
        borderTop: "1px solid rgba(81, 81, 81, .5)",
        borderRight: "1px solid rgba(81, 81, 81, .5)",
        fontFamily: "Calibri",
        fontWeight: "700",
        backgroundColor: "#ddd",
        lineHeight: "1rem",
      },
    },
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

  return (
    <section className="fk_table">
      <MaterialReactTable table={table} />
      <Button
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
