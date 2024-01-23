// import { useState } from 'react';
// import MaterialTable from 'material-table';

// import './ActualTable.css';

// const ActualTable = () => {

//     const [tableData, setTableData] = useState([]);

//     const columns = [
//         { title: "name", field: "name" },
//         { title: "Email", field: "email" },
//         { title: "Phone Number", field: "phone" },
//         { title: "Age", field: "age" },
//         { title: "Gender", field: "gender" },
//         { title: "City", field: "city" },

//     ];

//     return (
//         <section className="actual-table">
//             <MaterialTable
//                 columns={columns}
//                 data={tableData}
//                 options={{
//                     search: false,
//                     sorting: false,
//                 }}
//                 localization={{
//                     body: {
//                         emptyDataSourceMessage: 'No records to display',
//                     },
//                 }}
//             />
//         </section >
//     );
// };

// export default ActualTable;

import { useState } from 'react';
import MaterialTable from 'material-table';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import './MUIActualTable.css';
polski;
const MUIActualTable = () => {

    const [tableData, setTableData] = useState(
        [
            { name: "Raj", email: "Raj@gmail.com", phone: 7894561230, age: null, gender: "M", city: "Chennai", fee: 78456 },
            { name: "Mohan", email: "mohan@gmail.com", phone: 7845621590, age: 35, gender: "M", city: "Delhi", fee: 456125 },
            { name: "Sweety", email: "sweety@gmail.com", phone: 741852912, age: 17, gender: "F", city: "Noida", fee: 458796 },
            { name: "Vikas", email: "vikas@gmail.com", phone: 9876543210, age: 20, gender: "M", city: "Mumbai", fee: 874569 },
            { name: "Neha", email: "neha@gmail.com", phone: 7845621301, age: 25, gender: "F", city: "Patna", fee: 748521 },
            { name: "Mohan", email: "mohan@gmail.com", phone: 7845621590, age: 35, gender: "M", city: "Delhi", fee: 456125 },
            { name: "Sweety", email: "sweety@gmail.com", phone: 741852912, age: 17, gender: "F", city: "Noida", fee: 458796 },
            { name: "Vikas", email: "vikas@gmail.com", phone: 9876543210, age: 20, gender: "M", city: "Mumbai", fee: 874569 },
            { name: "Raj", email: "Raj@gmail.com", phone: 7894561230, age: null, gender: "M", city: "Chennai", fee: 78456 },
            { name: "Mohan", email: "mohan@gmail.com", phone: 7845621590, age: 35, gender: "M", city: "Delhi", fee: 456125 },
            { name: "Sweety", email: "sweety@gmail.com", phone: 741852912, age: 17, gender: "F", city: "Noida", fee: 458796 },
            { name: "Vikas", email: "vikas@gmail.com", phone: 9876543210, age: 20, gender: "M", city: "Mumbai", fee: 874569 },
        ]
    );

    const columns = [
        { title: "Name", field: "name" },
        { title: "Email", field: "email" },
        { title: "Phone Number", field: "phone" },
        { title: "Age", field: "age" },
        { title: "Gender", field: "gender" },
        { title: "City", field: "city" },
    ];

    const theme = createTheme(); // Tworzymy temat (theme) MUI

    return (
        <section className="actual-table">
            <ThemeProvider theme={theme}> {/* Przekazujemy temat do MaterialTable */}
                <MaterialTable
                    title=""
                    columns={columns}
                    data={tableData}
                    options={{
                        search: true,
                        sorting: true,
                    }}
                    localization={{
                        body: {
                            emptyDataSourceMessage: 'Brak danych do wyświetlenia',
                        },
                        toolbar: {
                            searchTooltip: 'Szukaj',
                            searchPlaceholder: 'Szukaj',
                        },
                        pagination: {
                            labelRowsPerPage: 'Liczba wierszy na stronie',
                            labelRowsSelect: 'wierszy',
                            labelDisplayedRows: '{from}-{to} z {count}',
                            firstAriaLabel: 'Pierwsza strona',
                            firstTooltip: 'Pierwsza strona',
                            previousAriaLabel: 'Poprzednia strona',
                            previousTooltip: 'Poprzednia strona',
                            nextAriaLabel: 'Następna strona',
                            nextTooltip: 'Następna strona',
                            lastAriaLabel: 'Ostatnia strona',
                            lastTooltip: 'Ostatnia strona',
                        },
                    }}
                />
            </ThemeProvider>
        </section>
    );
};

export default MUIActualTable;
