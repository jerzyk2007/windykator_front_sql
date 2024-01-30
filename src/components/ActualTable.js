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
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnSizing, setColumnSizing] = useState({});
    const [density, setDensity] = useState('');
    const [columnOrder, setColumnOrder] = useState([]);
    const [columnPinning, setColumnPinning] = useState({});

    const prepareTable = async () => {
        try {
            setPleaseWait(true);
            const result = await axiosPrivateIntercept.get(`/getAllDocuments/${info}`);
            setDocuments(result.data);
            setCustomFilter(addPrefiksDepartment(result.data));
            const settingsTable = await axiosPrivateIntercept.get('/user/get-table-settings/', { params: { userlogin: auth.userlogin } });
            setColumnVisibility(settingsTable?.data?.visible ? settingsTable.data.visible : {});
            setColumnSizing(settingsTable?.data?.size ? settingsTable.data.size : {});
            setDensity(settingsTable?.data?.density ? settingsTable.data.density : 'comfortable');
            setColumnOrder(settingsTable?.data?.order ? (settingsTable.data.order).map(order => order) : []);
            setColumnPinning(settingsTable?.data?.pinning ? (settingsTable.data.pinning) : { left: [], right: [] });
            setPleaseWait(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSaveSettings = async () => {
        const tableSettings = { size: { ...columnSizing }, visible: { ...columnVisibility }, density, order: columnOrder, pinning: columnPinning };


        try {
            const result = await axiosPrivateIntercept.patch('/user/save-table-settings/',
                { tableSettings, userlogin: auth.userlogin }
            );
        }
        catch (err) {
            console.log(err);
        }
    };


    const columns = useMemo(
        () => [
            {
                accessorKey: 'NUMER',
                header: 'Faktura',
                // filterVariant: 'text',
                // filterVariant: 'autocomplete',
                filterVariant: 'contains',
                // enableResizing: true,
                // enableHiding: false,
                // enablePinning: false,
                minSize: 100,
                maxSize: 400,
                size: columnSizing?.NUMER ? columnSizing.NUMER : 180,
            },
            {
                accessorKey: 'KONTRAHENT',
                header: 'Kontrahent',
                filterVariant: 'text',
                minSize: 100,
                maxSize: 400,
                size: columnSizing?.KONTRAHENT ? columnSizing.KONTRAHENT : 180,
            },
            {
                accessorKey: 'DZIAL',
                header: 'Dział',
                filterVariant: 'multi-select',
                filterSelectOptions: customFilter,
                minSize: 100,
                maxSize: 400,
                size: columnSizing?.DZIAL ? columnSizing.DZIAL : 120,
            },
            {
                accessorKey: 'NRNADWOZIA',
                header: 'VIN',
                minSize: 100,
                maxSize: 400,
                size: columnSizing?.NRNADWOZIA ? columnSizing.NRNADWOZIA : 120,
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
                size: columnSizing?.W_BRUTTO ? columnSizing.W_BRUTTO : 180,
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
                size: columnSizing?.DOROZLICZ_ ? columnSizing.DOROZLICZ_ : 140,
            },
            {
                accessorKey: 'PRZYGOTOWAL',
                header: 'Przygował',
                minSize: 100,
                maxSize: 400,
                size: columnSizing?.PRZYGOTOWAL ? columnSizing.PRZYGOTOWAL : 140,
            },
            {
                accessorKey: 'PLATNOSC',
                header: 'Płatność',
                minSize: 100,
                maxSize: 400,
                size: columnSizing?.PLATNOSC ? columnSizing.PLATNOSC : 140,
            },
            {
                accessorKey: 'NRREJESTRACYJNY',
                header: 'Nr rej',
                minSize: 100,
                maxSize: 400,
                size: columnSizing?.NRREJESTRACYJNY ? columnSizing.NRREJESTRACYJNY : 140,
            },
            {
                accessorKey: 'UWAGI',
                header: 'Uwagi',
                minSize: 100,
                maxSize: 400,
                size: columnSizing?.UWAGI ? columnSizing.UWAGI : 140,
            },
        ],
        [customFilter, documents, columnSizing, columnVisibility, density, columnPinning],
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
                        enableStickyHeader
                        enableStickyFooter
                        enableColumnResizing
                        onColumnSizingChange={setColumnSizing}
                        onColumnVisibilityChange={setColumnVisibility}
                        onDensityChange={setDensity}
                        onColumnOrderChange={setColumnOrder}
                        enableColumnOrdering
                        enableColumnPinning
                        onColumnPinningChange={setColumnPinning}
                        globalFilterFn={'contains'}
                        enableSelectAll={false}
                        initialState={{
                            showColumnFilters: false,
                            showGlobalFilter: true,
                        }}
                        localization={MRT_Localization_PL}
                        state={{
                            columnVisibility: columnVisibility,
                            density,
                            columnOrder,
                            columnPinning
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