import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { MRT_Localization_PL } from 'material-react-table/locales/pl';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import { plPL } from '@mui/material/locale';
import useData from './hooks/useData';
import { axiosPrivate } from '../api/axios';
import { processAndExportData, nowaFunkcja } from './TableSettings/Filter';
import { TfiSave } from "react-icons/tfi";
import PleaseWait from './PleaseWait';

import './ActualTable.css';

const ActualTable = ({ info }) => {
    const theme = useTheme();
    const { pleaseWait, setPleaseWait } = useData();
    const [documents, setDocuments] = useState([]);
    const [customFilter, setCustomFilter] = useState([]);
    const [columnSettings, setColumnSettings] = useState({});
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

    const prepareTable = async () => {
        try {
            setPleaseWait(true);
            const result = await axiosPrivate.get(`/getAllDocuments/${info}`);
            setDocuments(result.data);
            const settings = await axiosPrivate.get('/settings/getSettings');
            setColumnVisibility(settings?.data?.columnSettings?.visible ? settings.data.columnSettings.visible : {});
            setColumnSize(settings?.data?.columnSettings?.size ? settings.data.columnSettings.size : {});
            setDensityChange(settings?.data?.columnSettings?.density ? settings.data.columnSettings.density : 'comfortable');
            const processedData = processAndExportData(result.data);
            setCustomFilter(processedData);
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
            // setTimeout(() => {
            setColumnSize(prev => {
                return {
                    ...prev,
                    [name]: size
                };
            });

            // }, 200);
        }
        // console.log(info);
        // console.log(txt);
    };

    const handleSaveSettings = async () => {
        const columnSettings = { size: { ...columnSize }, visible: { ...columnVisibility }, density: densityChange };

        try {
            const result = await axiosPrivate.post('/settings/saveSettings/',
                JSON.stringify({ columnSettings }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
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

        // const _ref2 = '';
        // const columnInfo = columnSize(_ref2);
        // const name = Object.keys(columnInfo)[0];
        // const size = columnInfo[name];
        // if (name && size) {
        //     // setTimeout(() => {
        //     setColumnSettings(prev => {
        //         return {
        //             ...prev,
        //             [name]: {
        //                 // ...prev[name],
        //                 size,
        //                 visible: true,
        //             },
        //         };
        //     });

        // setColumnSettings(prev => {
        //     return prev.map(item => {
        //         if (item.key === txt) {
        //             // Zaktualizuj pole 'value' dla konkretnego klucza
        //             return { ...item, [txt]: info };
        //         }
        //         // Zachowaj pozostałe elementy bez zmian
        //         return item;
        //     });
        // });
    };

    // useEffect(() => {
    //     console.log(xcolumnSettings);
    // },
    //     [xcolumnSettings]);

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
                filterVariant: 'text', // default
                // pining: 'left',
                // size: 'auto',
                enableResizing: true,
                enableHiding: false,
                enablePinning: false,
                enableEditing: false,
                minSize: 100, //allow columns to get smaller than default
                maxSize: 400, //allow columns to get larger than default
                size: columnSize?.NUMER ? columnSize.NUMER : 180, //make columns wider by default
                // Header: ({ header }) => handleTest(header.getSize(), header.column.columnDef.accessorKey)
                // enableColumnResizing: true,
            },
            {
                accessorKey: 'KONTRAHENT',
                header: 'Kontrahent',
                // Cell: ({ cell }) =>
                //     cell.getValue().toLocaleString('pln-PL', {
                //         style: 'currency',
                //         currency: 'pln',
                //     }),

                // brak symbolu waluty
                //    {     Cell: ({ cell }) => {
                //             const formattedSalary = cell.getValue().toLocaleString('pl-PL', {
                //                 minimumFractionDigits: 2,
                //                 maximumFractionDigits: 2,
                //             });
                //             return `${formattedSalary}`;
                //         },
                //         filterVariant: 'range-slider',
                //         filterFn: 'betweenInclusive', // default (or between)
                //         muiFilterSliderProps: {
                //             //no need to specify min/max/step if using faceted values
                //             marks: true,
                //             max: 200000, //custom max (as opposed to faceted max)
                //             min: 30000, //custom min (as opposed to faceted min)
                //             step: 10000,
                //             valueLabelFormat: (value) =>
                //                 value.toLocaleString('pln-PL', {
                //                     style: 'currency',
                //                     currency: 'PLN',
                //                 }),
                //         },}

                enableEditing: false,

                minSize: 100, //allow columns to get smaller than default
                maxSize: 400, //allow columns to get larger than default
                size: columnSize?.KONTRAHENT ? columnSize.KONTRAHENT : 180, //make columns wider by default
                // Header: ({ column }) => handleSize(column.getSize(), column.columnDef.accessorKey),
            },
            {
                accessorKey: 'DZIAL',
                header: 'Dział',
                filterVariant: 'multi-select',
                filterSelectOptions: customFilter,
                enableEditing: false,

                minSize: 100, //allow columns to get smaller than default
                maxSize: 400, //allow columns to get larger than default

                size: columnSize?.DZIAL ? columnSize.DZIAL : 120, //make columns wider by default
                // Header: ({ column }) => setxColumnSettings(column.getSize(), column.columnDef.accessorKey),
                // Header: ({ header }) => setxColumnSettings(header.getSize(), header.columnDef.accessorKey),
                // Header: (e) => setTimeout(() => { console.log(e); }, 20),


            },
            {
                accessorKey: 'NRNADWOZIA',
                header: 'VIN',
                // filterVariant: 'multi-select',
                // filterSelectOptions: citiesList,
                enableEditing: false,

                minSize: 100, //allow columns to get smaller than default
                maxSize: 400, //allow columns to get larger than default
                size: columnSize?.NRNADWOZIA ? columnSize.NRNADWOZIA : 120, //make columns wider by default
                // Header: ({ column }) => handleSize(column.getSize(), column.columnDef.accessorKey),


            },

            {
                accessorKey: 'W_BRUTTO',
                header: 'Brutto',
                Cell: ({ cell }) => {
                    const formattedSalary = cell.getValue().toLocaleString('pl-PL', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true, // Add this option to include thousands grouping
                    });
                    return `${formattedSalary}`;
                },
                enableEditing: false,

                minSize: 100, //allow columns to get smaller than default
                maxSize: 400, //allow columns to get larger than default
                size: columnSize?.W_BRUTTO ? columnSize.W_BRUTTO : 140, //make columns wider by default
                // Header: ({ column }) => handleSize(column.getSize(), column.columnDef.accessorKey),
                enableEditing: true,

            }

            // {
            //     accessorKey: 'W_BRUTTO',
            //     header: 'Brutto',
            //     // filterVariant: 'multi-select',
            //     // filterSelectOptions: usStateList,
            //     Cell: ({ cell }) => {
            //         const formattedSalary = cell.getValue().toLocaleString('pl-PL', {
            //             minimumFractionDigits: 2,
            //             maximumFractionDigits: 2,
            //         });
            //         return `${formattedSalary}`;
            //     },

            //     // Cell: ({ cell }) =>
            //     //     cell.getValue().toLocaleString('pln-PL', {
            //     //         style: 'currency',
            //     //         currency: 'pln',
            //     //     }),

            //     size: 300,
            // }

            ,
            {
                accessorKey: 'DOROZLICZ_',
                header: 'Brakuje',
                // filterVariant: 'multi-select',
                // filterSelectOptions: usStateList,
                Cell: ({ cell }) => {
                    const formattedSalary = cell.getValue().toLocaleString('pl-PL', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true, // Add this option to include thousands grouping
                    });
                    return `${formattedSalary}`;
                },
                enableEditing: false,

                minSize: 100, //allow columns to get smaller than default
                maxSize: 400, //allow columns to get larger than default
                size: columnSize?.DOROZLICZ_ ? columnSize.DOROZLICZ_ : 140, //make columns wider by default
                // Header: ({ column }) => handleSize(column.getSize(), column.columnDef.accessorKey),

            },
            {
                accessorKey: 'PRZYGOTOWAL',
                header: 'Przygował',
                // filterVariant: 'multi-select',
                // filterSelectOptions: usStateList,
                enableEditing: false,

                minSize: 100, //allow columns to get smaller than default
                maxSize: 400, //allow columns to get larger than default
                size: columnSize?.PRZYGOTOWAL ? columnSize.PRZYGOTOWAL : 140, //make columns wider by default
                // Header: ({ column }) => handleSize(column.getSize(), column.columnDef.accessorKey),

            },
            {
                accessorKey: 'PLATNOSC',
                header: 'Płatność',
                // filterVariant: 'multi-select',
                // filterSelectOptions: usStateList,
                enableEditing: false,

                minSize: 100, //allow columns to get smaller than default
                maxSize: 400, //allow columns to get larger than default
                size: columnSize?.PLATNOSC ? columnSize.PLATNOSC : 140, //make columns wider by default
                // Header: ({ column }) => handleSize(column.getSize(), column.columnDef.accessorKey),

            },
            {
                accessorKey: 'NRREJESTRACYJNY',
                header: 'Nr rej',
                // filterVariant: 'multi-select',
                // filterSelectOptions: usStateList,
                enableEditing: false,

                minSize: 100, //allow columns to get smaller than default
                maxSize: 400, //allow columns to get larger than default
                size: columnSize?.NRREJESTRACYJNY ? columnSize.NRREJESTRACYJNY : 140, //make columns wider by default
                // Header: ({ column }) => handleSize(column.getSize(), column.columnDef.accessorKey),

            },
            {
                accessorKey: 'UWAGI',
                header: 'Uwagi',

                // filterVariant: 'multi-select',
                // filterSelectOptions: usStateList,
                minSize: 100, //allow columns to get smaller than default
                maxSize: 400, //allow columns to get larger than default
                size: columnSize?.UWAGI ? columnSize.UWAGI : 140, //make columns wider by default
                // Header: ({ column }) => handleSize(column.getSize(), column.columnDef.accessorKey),

            },
        ],
        [customFilter, documents, columnSize],
    );

    // const handleColumnSizingChange = (info) => {
    //     const _ref2 = 100;
    //     const test = info(_ref2);
    //     console.log(test);
    // };

    useEffect(() => {
        prepareTable();
    }, [info]);

    // const table = useMaterialReactTable({
    //     columns,
    //     data,
    //     initialState: { columnVisibility: { address: false } },
    // });


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
                            density: densityChange
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