import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { MRT_Localization_PL } from 'material-react-table/locales/pl';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import { plPL } from '@mui/material/locale';
import useData from './hooks/useData';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { addPrefiksDepartment } from './TableFilters/TableFilters';
import { TfiSave } from "react-icons/tfi";
import PleaseWait from './PleaseWait';

import './ActualTable.css';

const ActualTable = ({ info }) => {
    const theme = useTheme();
    const axiosPrivateIntercept = useAxiosPrivateIntercept();
    const { pleaseWait, setPleaseWait, auth } = useData();

    const [documents, setDocuments] = useState([]);
    const [customFilter, setCustomFilter] = useState([]);

    const [columnVisibility, setColumnVisibility] = useState({
        // NUMER: true,
        // KONTRAHENT: true,
        // DZIAL: true,
        // NRNADWOZIA: true,
        // W_BRUTTO: true,
        // DOROZLICZ_: true,
        // PRZYGOTOWAL: true,
        // PLATNOSC: true,
        // NRREJESTRACYJNY: true,
        // UWAGI: true,
    });
    const [columnSize, setColumnSize] = useState({
        // NUMER: 200,
        // KONTRAHENT: 200,
        // DZIAL: 200,
        // NRNADWOZIA: 200,
        // W_BRUTTO: 200,
        // DOROZLICZ_: 200,
        // PRZYGOTOWAL: 200,
        // PLATNOSC: 200,
        // NRREJESTRACYJNY: 200,
        // UWAGI: 200,
    });
    const [densityChange, setDensityChange] = useState('compact');

    const [columnsOrder, setColumnsOrder] = useState([
        // 'NUMER', 'UWAGI', 'KONTRAHENT', 'DZIAL', 'DOROZLICZ_', 'PRZYGOTOWAL', 'PLATNOSC', 'NRREJESTRACYJNY'
        // , 'NRNADWOZIA', 'W_BRUTTO', 'mrt-row-select'
    ]);



    const prepareTable = async () => {
        try {
            setPleaseWait(true);
            const result = await axiosPrivateIntercept.get(`/getAllDocuments/${info}`);
            setDocuments(result.data);
            setCustomFilter(addPrefiksDepartment(result.data));
            const settingsTable = await axiosPrivateIntercept.get('/user/get-table-settings/', { params: { userlogin: auth.userlogin } });
            setColumnVisibility(settingsTable?.data?.visible ? settingsTable.data.visible : {});
            setColumnSize(settingsTable?.data?.size ? settingsTable.data.size : {});
            setDensityChange(settingsTable?.data?.density ? settingsTable.data.density : 'comfortable');
            setColumnsOrder(settingsTable?.data?.order ? (settingsTable.data.order).map(order => order) : []);
            setPleaseWait(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSize = (columnSize) => {

        const _ref2 = '';
        const columnInfo = columnSize(_ref2);
        const name = Object.keys(columnInfo)[0];
        const size = columnInfo[name];
        if (name && size) {
            setColumnSize(prev => {
                return {
                    ...prev,
                    [name]: size
                };
            });
        }
    };

    const handleSaveSettings = async () => {
        const tableSettings = { size: { ...columnSize }, visible: { ...columnVisibility }, density: densityChange, order: columnsOrder };


        try {
            const result = await axiosPrivateIntercept.patch('/user/save-table-settings/',
                { tableSettings, userlogin: auth.userlogin }
            );
        }
        catch (err) {
            console.log(err);
        }
    };

    const handleVisibilityChange = (visibility) => {
        const columnInfo = visibility();
        const name = Object.keys(columnInfo)[0];
        const visible = columnInfo[name];

        setColumnVisibility(prev => {
            return {
                ...prev,
                [name]: visible
            };
        });
    };

    const handleDensityChange = () => {
        const densityOptions = ['comfortable', 'compact', 'spacious'];
        const currentIndex = densityOptions.indexOf(densityChange);
        const nextIndex = (currentIndex + 1) % densityOptions.length;

        setDensityChange(densityOptions[nextIndex]);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'NUMER',
                header: 'Faktura',
                // filterVariant: 'text',
                // filterVariant: 'autocomplete',
                filterVariant: 'contains',
                enableResizing: true,
                enableHiding: false,
                enablePinning: false,
                minSize: 100,
                maxSize: 400,
                size: columnSize?.NUMER ? columnSize.NUMER : 180,
            },
            {
                accessorKey: 'KONTRAHENT',
                header: 'Kontrahent',
                filterVariant: 'text',
                minSize: 100,
                maxSize: 400,
                size: columnSize?.KONTRAHENT ? columnSize.KONTRAHENT : 180,
            },
            {
                accessorKey: 'DZIAL',
                header: 'Dział',
                filterVariant: 'multi-select',
                filterSelectOptions: customFilter,
                minSize: 100,
                maxSize: 400,
                size: columnSize?.DZIAL ? columnSize.DZIAL : 120,
            },
            {
                accessorKey: 'NRNADWOZIA',
                header: 'VIN',
                minSize: 100,
                maxSize: 400,
                size: columnSize?.NRNADWOZIA ? columnSize.NRNADWOZIA : 120,
            },
            {
                accessorKey: 'W_BRUTTO',
                header: 'Brutto',
                Cell: ({ cell }) => {
                    const formattedSalary = cell.getValue().toLocaleString('pl-PL', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                    });
                    return `${formattedSalary}`;
                },
                minSize: 100,
                maxSize: 400,
                size: columnSize?.W_BRUTTO ? columnSize.W_BRUTTO : 140,
            },
            {
                accessorKey: 'DOROZLICZ_',
                header: 'Brakuje',
                Cell: ({ cell }) => {
                    const formattedSalary = cell.getValue().toLocaleString('pl-PL', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                    });
                    return `${formattedSalary}`;
                },
                minSize: 100,
                maxSize: 400,
                size: columnSize?.DOROZLICZ_ ? columnSize.DOROZLICZ_ : 140,
            },
            {
                accessorKey: 'PRZYGOTOWAL',
                header: 'Przygował',
                minSize: 100,
                maxSize: 400,
                size: columnSize?.PRZYGOTOWAL ? columnSize.PRZYGOTOWAL : 140,
            },
            {
                accessorKey: 'PLATNOSC',
                header: 'Płatność',
                minSize: 100,
                maxSize: 400,
                size: columnSize?.PLATNOSC ? columnSize.PLATNOSC : 140,
            },
            {
                accessorKey: 'NRREJESTRACYJNY',
                header: 'Nr rej',
                minSize: 100,
                maxSize: 400,
                size: columnSize?.NRREJESTRACYJNY ? columnSize.NRREJESTRACYJNY : 140,
            },
            {
                accessorKey: 'UWAGI',
                header: 'Uwagi',
                minSize: 100,
                maxSize: 400,
                size: columnSize?.UWAGI ? columnSize.UWAGI : 140,
            },
        ],
        [customFilter, documents, columnSize, columnVisibility, densityChange],
    );


    useEffect(() => {
        prepareTable();
    }, [info]);


    return (
        <section className='actual_table'>
            {pleaseWait ? <PleaseWait /> :
                <>  <ThemeProvider
                    theme={createTheme(theme, plPL)} >
                    <MaterialReactTable
                        className='actual_table__table'
                        // table={table}
                        columns={columns}
                        data={documents}
                        enableColumnFilterModes
                        // enableColumnOrdering
                        enableStickyHeader
                        enableStickyFooter
                        // enableEditing
                        enableColumnPinning
                        enableColumnResizing
                        onColumnSizingChange={handleSize}
                        // onColumnVisibilityChange={(visibility) => handleVisibilityChange(visibility)}
                        onColumnVisibilityChange={handleVisibilityChange}
                        onDensityChange={handleDensityChange}
                        onColumnOrderChange={(order) => setColumnsOrder(order)}
                        enableColumnOrdering


                        // onGlobalFilterChange={handleTest}

                        // globalFilterModeOptions={['fuzzy', 'startsWith']}
                        globalFilterFn={'contains'}
                        // enableRowActions
                        // enableRowSelection
                        enableSelectAll={false}
                        initialState={{
                            showColumnFilters: false,
                            showGlobalFilter: true,
                            // columnVisibility: { KONTRAHENT: columnSettings?.KONTRAHENT?.visible ? columnSettings.KONTRAHENT.visible : true },
                            // columnVisibility: { KONTRAHENT: true },

                            columnPinning: { left: ['NUMER'] }
                        }}
                        localization={MRT_Localization_PL}
                        state={{
                            columnVisibility: columnVisibility,
                            density: densityChange,
                            columnOrder: columnsOrder
                            // [
                            //     'NUMER', 'UWAGI', 'KONTRAHENT', 'DZIAL', 'DOROZLICZ_', 'PRZYGOTOWAL', 'PLATNOSC', 'NRREJESTRACYJNY'
                            //     , 'NRNADWOZIA', 'W_BRUTTO', 'mrt-row-select']
                            //     ,
                        }}
                        // muiTableBodyCellProps={{
                        //     sx: {
                        //         borderRight: "1px solid #c9c7c7", //add a border between columns
                        //         fontSize: "16px",
                        //         fontFamily: "Calibri",
                        //         padding: "15px",
                        //     },
                        // }}

                        // odczytanie danych po kliknięciu w wiersz



                        // muiSearchTextFieldProps={{
                        //     placeholder: "Szukaj wszędzie",
                        //     sx: { minWidth: "18rem" },
                        //     variant: "outlined",
                        // }}

                        // muiTableBodyProps={{
                        //     sx: {
                        //         "& tr:nth-of-type(odd)": {
                        //             backgroundColor: "red",
                        //         },
                        //     },
                        // }}

                        muiPaginationProps={{
                            color: 'secondary',
                            rowsPerPageOptions: [10, 20, 30, 50],
                            shape: 'rounded',
                            variant: 'outlined',
                        }}

                        muiTableHeadCellProps={() => ({
                            align: "left",
                            sx: {
                                fontWeight: "bold",
                                fontSize: "14px",
                                color: "black",
                                backgroundColor: "#a5f089",
                                // borderRadius: "5px",
                                // boxShadow: "2px 2px 2px #757575",
                                // borderRight: "1px solid #000",

                            },
                        })}

                        // odczytanie danych po kliknięciu w wiersz
                        muiTableBodyCellProps={({ column, cell }) => ({
                            onClick: () => {
                                if (column.id === "UWAGI") { console.log(cell.row._valuesCache.UWAGI); }
                            },
                            sx: {
                                borderRight: "1px solid #c9c7c7", //add a border between columns
                                fontSize: "16px",
                                fontFamily: "Calibri",
                                padding: "15px",
                            },
                        })}
                    />
                    {/* <Example /> */}
                </ThemeProvider>
                    <TfiSave className='table-save-settings' onClick={handleSaveSettings} />
                </>}
        </section>
    );
};

export default ActualTable;


{/* <ThemeProvider theme={createTheme(theme, plPL)}>
                {/* <Example />

                <MaterialReactTable
                    columns={columns}
                    data={data}
                    enableColumnFilterModes
                    enableColumnOrdering
                    // enableEditing
                    enableColumnPinning
                    enableRowActions
                    // enableRowSelection
                    enableSelectAll={false}
                    initialState={{ showColumnFilters: false, showGlobalFilter: true }}
                    localization={MRT_Localization_PL}

                    // obramowanie i styl komórki
                    muiTableBodyCellProps={{
                        sx: {
                            borderRight: "1px dashed #e0e0e0", //add a border between columns
                            fontSize: "16px",
                            fontFamily: "Calibri",
                            // padding: "8px",
                        },
                    }}

                    // obramowanie i styl header
                    muiTableHeadCellProps={{
                        //simple styling with the `sx` prop, works just like a style prop in this example
                        sx: {
                            fontWeight: 'bold',
                            fontSize: '20px',
                        }
                    }}

                />

            </ThemeProvider> */};