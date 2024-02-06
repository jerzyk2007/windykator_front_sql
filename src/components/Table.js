import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { MRT_Localization_PL } from 'material-react-table/locales/pl';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import { plPL } from '@mui/material/locale';
import useData from './hooks/useData';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { TfiSave } from "react-icons/tfi";
import PleaseWait from './PleaseWait';
import useWindowSize from './hooks/useWindow';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/pl';
import { plPL as plText } from '@mui/x-date-pickers/locales';

import './Table.css';

const ActualTable = ({ info }) => {

    const plLocale = plText.components.MuiLocalizationProvider.defaultProps.localeText;

    const theme = useTheme();

    const axiosPrivateIntercept = useAxiosPrivateIntercept();
    const { pleaseWait, setPleaseWait, auth } = useData();
    const { height } = useWindowSize();

    const [documents, setDocuments] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnSizing, setColumnSizing] = useState({});
    const [density, setDensity] = useState('');
    const [columnOrder, setColumnOrder] = useState([]);
    const [columnPinning, setColumnPinning] = useState({});
    const [columns, setColumns] = useState([]);
    const [tableSize, setTableSize] = useState(500);
    const [pagination, setPagination] = useState({});

    const prepareColumns = (columnsData, data) => {
        const changeColumn = columnsData.map(item => {
            const modifiedItem = { ...item };

            if (item.filterVariant === 'multi-select' || item.filterVariant === 'select') {
                const uniqueValues = Array.from(new Set(data.map(filtr => filtr[item.accessorKey])));
                modifiedItem.filterSelectOptions = uniqueValues;
            }

            if (item.filterVariant === 'date-range') {
                // const uniqueValues = Array.from(new Set(data.map(filtr => filtr[item.accessorKey])));
                // delete modifiedItem.accessorKey;
                modifiedItem.accessorFn = (originalRow) => new Date(originalRow[item.accessorKey]);
                modifiedItem.Cell = ({ cell }) => cell.getValue().toLocaleDateString('pl-PL', {
                    useGrouping: true,
                });
            }

            // if (item.filterVariant === 'date-range') {
            //     // const uniqueValues = Array.from(new Set(data.map(filtr => filtr[item.accessorKey])));
            //     // delete modifiedItem.accessorKey;
            //     modifiedItem.accessorFn = (originalRow) => new Date(originalRow[item.accessorKey]);
            //     modifiedItem.Cell = ({ cell }) => cell.getValue().toLocaleDateString('pl-PL', {
            //         useGrouping: true,
            //     });
            // }


            // if (item.filterVariant === 'date-range') {
            //     modifiedItem.accessorFn = (originalRow) => {
            //         const date = new Date(originalRow[item.accessorKey]);
            //         return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            //     };
            //     modifiedItem.Cell = ({ cell }) => {
            //         const dateString = cell.getValue();
            //         const date = new Date(dateString);

            //         if (!isNaN(date.getTime())) {
            //             // Sprawdzamy, czy data jest poprawna
            //             return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            //         } else {
            //             return ''; // lub inna obsługa w przypadku, gdy wartość nie jest datą
            //         }
            //     };
            // }

            // Cell: ({ cell }) => cell.getValue().toLocaleDateString(),

            // if (item.accessorKey === "KONTRAHENT" || item.accessorKey !== "UWAGI") {
            if (item.accessorKey === "KONTRAHENT" || item.accessorKey === "UWAGI") {

                modifiedItem.enableClickToCopy = false;
                modifiedItem.muiTableBodyCellProps = {
                    align: 'left',
                    sx: {
                        // backgroundColor: 'rgba(110, 228, 246, 0.1)',
                        borderRight: '1px solid rgba(224,224,224,1)',
                        borderRight: "1px solid #c9c7c7", //add a border between columns
                        fontSize: "14px",
                        fontFamily: "Calibri",
                        padding: "2px",
                        maxHeight: "10rem",
                    }
                };
            } else {
                modifiedItem.muiTableBodyCellProps = {
                    align: 'center',
                    sx: {
                        // backgroundColor: 'rgba(110, 228, 246, 0.1)',
                        borderRight: '1px solid rgba(224,224,224,1)',
                        borderRight: "1px solid #c9c7c7", //add a border between columns
                        fontSize: "14px",
                        fontFamily: "Calibri",
                        padding: "2px"
                    }
                };
            }

            if (item.accessorKey === "ILEDNIPOTERMINIE") {
                modifiedItem.muiTableBodyCellProps = ({ cell }) => ({
                    sx: {
                        borderRight: "1px solid #c9c7c7",
                        textAlign: "center",
                        backgroundColor: cell.column.id === 'ILEDNIPOTERMINIE' && cell.getValue() > 0 ? 'rgb(250, 136, 136)' : "white",
                        // color: cell.column.id === 'ILEDNIPOTERMINIE' && cell.getValue() > 0 ? 'white' : "black",
                        // fontWeight: cell.column.id === 'ILEDNIPOTERMINIE' && cell.getValue() > 0 ? 'bold' : 'normal'
                        fontSize: "14px",
                        fontFamily: "Calibri",
                    },
                    align: 'center',
                });
            }

            if (item.accessorKey === "50VAT") {
                modifiedItem.muiTableBodyCellProps = ({ cell }) => {
                    const cellValue = cell.getValue();
                    const dorozliczValue = cell.row.original.DOROZLICZ;

                    return {
                        sx: {
                            borderRight: "1px solid #c9c7c7",
                            textAlign: "center",
                            backgroundColor: cell.column.id === '50VAT' && Math.abs(cellValue - dorozliczValue) <= 1
                                ? 'rgb(250, 136, 136)' : "white",
                            fontSize: "14px",
                            fontFamily: "Calibri",
                        },
                        align: 'center',
                    };
                };
            }

            if (item.accessorKey === "100VAT") {
                modifiedItem.muiTableBodyCellProps = ({ cell }) => {
                    const cellValue = cell.getValue();
                    const dorozliczValue = cell.row.original.DOROZLICZ;

                    return {
                        sx: {
                            borderRight: "1px solid #c9c7c7",
                            textAlign: "center",
                            backgroundColor: cell.column.id === '100VAT' && Math.abs(cellValue - dorozliczValue) <= 1
                                ? 'rgb(250, 136, 136)' : "white",
                            fontSize: "14px",
                            fontFamily: "Calibri",
                        },
                        align: 'center',
                    };
                };
            }

            // sprawdzenie edycji tabeli
            // if (item.accessorKey === "UWAGI") {
            //     modifiedItem.enableEditing = true;
            // } else {
            //     modifiedItem.enableEditing = false;
            // }
            // if (item.accessorKey === "ILEDNIPOTERMINIE") {
            //     modifiedItem.muiTableBodyCellProps = ({ cell }) => ({
            //         sx: {
            //             backgroundColor: cell.getValue < number > () > 40 ? 'rgba(22, 184, 44, 0.5)' : undefined,
            //             fontWeight: cell.column.id === 'ILEDNIPOTERMINIE' && cell.getValue < number > () > 40 ? '700' : '400'
            //         }
            //     });
            // }






            if (item.filterVariant === "none") {
                modifiedItem.enableColumnFilter = false;
                delete modifiedItem.filterVariant;
            }
            // enableColumnFilters

            if (item.filterVariant === "range-slider") {
                modifiedItem.muiFilterSliderProps = {
                    marks: true,
                    max: data.reduce((max, key) => Math.max(max, key[item.accessorKey]), Number.NEGATIVE_INFINITY),
                    min: data.reduce((min, key) => Math.min(min, key[item.accessorKey]), Number.POSITIVE_INFINITY),
                    step: 100,
                    valueLabelFormat: (value) =>
                        value.toLocaleString('pl-PL', {
                            style: 'currency',
                            currency: 'PLN',
                        }),
                };
            }

            // if (item.type === 'money') {
            //     modifiedItem.Cell = ({ cell }) => {
            //         const formattedSalary = cell.getValue().toLocaleString('pl-PL', {
            //             minimumFractionDigits: 2,
            //             maximumFractionDigits: 2,
            //             useGrouping: true,
            //         });
            //         return `${formattedSalary}`;
            //     };
            // }

            if (item.type === 'money') {
                modifiedItem.Cell = ({ cell }) => {
                    const value = cell.getValue();
                    const formattedSalary = value !== undefined && value !== null
                        ? value.toLocaleString('pl-PL', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            useGrouping: true,
                        })
                        : '0,00'; // Zastąp puste pola zerem

                    return `${formattedSalary}`;
                };
            }

            delete modifiedItem.type;

            return modifiedItem;
        });
        return changeColumn;
    };


    // const prepareTable = async () => {
    //     try {
    //         setPleaseWait(true);

    //         const result = await axiosPrivateIntercept.get(`/documents/get-all/${auth._id}/${info}`);
    //         setDocuments(result.data);
    //         const settingsUser = await axiosPrivateIntercept.get(`/user/get-table-settings/${auth._id}`);
    //         setColumnVisibility(settingsUser?.data?.visible ? settingsUser.data.visible : {});
    //         setColumnSizing(settingsUser?.data?.size ? settingsUser.data.size : {});
    //         setDensity(settingsUser?.data?.density ? settingsUser.data.density : 'comfortable');
    //         setColumnOrder(settingsUser?.data?.order ? (settingsUser.data.order).map(order => order) : []);
    //         setColumnPinning(settingsUser?.data?.pinning ? (settingsUser.data.pinning) : { left: [], right: [] });
    //         setPagination(settingsUser?.data?.pagination ? settingsUser.data.pagination : { pageIndex: 0, pageSize: 10, });
    //         const getColumns = await axiosPrivateIntercept.get(`/user/get-columns/${auth._id}`);
    //         const modifiedColumns = prepareColumns(getColumns.data, result.data);
    //         setColumns(modifiedColumns);
    //         setPleaseWait(false);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    const handleSaveSettings = async () => {
        const tableSettings = { size: { ...columnSizing }, visible: { ...columnVisibility }, density, order: columnOrder, pinning: columnPinning, pagination };
        try {
            const result = await axiosPrivateIntercept.patch(`/user/save-table-settings/${auth._id}`,
                { tableSettings }
            );
        }
        catch (err) {
            console.log(err);
        }
    };

    const columnsItem = useMemo(
        () => columns.map(column => ({
            ...column,
            size: columnSizing?.[column.accessorKey] ? columnSizing[column.accessorKey] : column.size,
            enableHiding: true,
            enablePinning: true,
            enableColumnFilterModes: false,
            minSize: 50,
            maxSize: 400,
            // columnFilterModeOptions: ['fuzzy', 'contains', 'startsWith'],
        })),
        [columnSizing, columnVisibility, density, columnPinning, columns]
    );

    useEffect(() => {
        setTableSize(height - 220);
    }, [height]);

    // useEffect(() => {
    //     let isMounted = true;

    //     const prepareTable = async () => {
    //         try {
    //             setPleaseWait(true);

    //             const result = await axiosPrivateIntercept.get(`/documents/get-all/${auth._id}/${info}`);
    //             const settingsUser = await axiosPrivateIntercept.get(`/user/get-table-settings/${auth._id}`);
    //             const getColumns = await axiosPrivateIntercept.get(`/user/get-columns/${auth._id}`);
    //             const modifiedColumns = prepareColumns(getColumns.data, result.data);
    //             if (isMounted) {
    //                 setDocuments(result.data);
    //                 setColumnVisibility(settingsUser?.data?.visible ? settingsUser.data.visible : {});
    //                 setColumnSizing(settingsUser?.data?.size ? settingsUser.data.size : {});
    //                 setDensity(settingsUser?.data?.density ? settingsUser.data.density : 'comfortable');
    //                 setColumnOrder(settingsUser?.data?.order ? (settingsUser.data.order).map(order => order) : []);
    //                 setColumnPinning(settingsUser?.data?.pinning ? (settingsUser.data.pinning) : { left: [], right: [] });
    //                 setPagination(settingsUser?.data?.pagination ? settingsUser.data.pagination : { pageIndex: 0, pageSize: 10, });
    //                 setColumns(modifiedColumns);
    //                 setPleaseWait(false);
    //             }
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     prepareTable();
    //     return () => {
    //         // Zabezpiecz przed aktualizacją stanu komponentu po odmontowaniu
    //         isMounted = false;
    //     };
    // }, []);

    useEffect(() => {
        let isMounted = true;

        const prepareTable = async () => {
            try {
                setPleaseWait(true);
                const [result, settingsUser, getColumns] = await Promise.all([
                    axiosPrivateIntercept.get(`/documents/get-all/${auth._id}/${info}`),
                    axiosPrivateIntercept.get(`/user/get-table-settings/${auth._id}`),
                    axiosPrivateIntercept.get(`/user/get-columns/${auth._id}`)
                ]);

                const modifiedColumns = prepareColumns(getColumns.data, result.data);
                if (isMounted) {
                    setDocuments(result.data);
                    setColumnVisibility(settingsUser?.data?.visible || {});
                    setColumnSizing(settingsUser?.data?.size || {});
                    setDensity(settingsUser?.data?.density || 'comfortable');
                    setColumnOrder(settingsUser?.data?.order?.map(order => order) || []);
                    setColumnPinning(settingsUser?.data?.pinning || { left: [], right: [] });
                    setPagination(settingsUser?.data?.pagination || { pageIndex: 0, pageSize: 10 });
                    setColumns(modifiedColumns);
                    setPleaseWait(false);
                }
            } catch (err) {
                console.error(err);
            }
        };

        prepareTable();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className='actual_table'>
            {pleaseWait ? <PleaseWait /> :
                <>  <ThemeProvider
                    theme={createTheme(theme, plPL)} >

                    <LocalizationProvider dateAdapter={AdapterDayjs}
                        adapterLocale="pl"
                        localeText={plLocale}
                    >
                        <MaterialReactTable
                            className='actual_table__table'
                            columns={columnsItem}
                            data={documents}
                            enableClickToCopy
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
                            onPaginationChange={setPagination}
                            enableSelectAll={false}
                            initialState={{
                                showColumnFilters: false,
                                showGlobalFilter: true,
                            }}
                            localization={MRT_Localization_PL}
                            state={{
                                columnVisibility,
                                density,
                                columnOrder,
                                columnPinning,
                                pagination
                            }}
                            enableGlobalFilterModes
                            globalFilterModeOptions={['contains']}
                            positionGlobalFilter="left"

                            muiTableContainerProps={{ sx: { maxHeight: tableSize } }}
                            // wyświetla filtry nad komórką - 
                            columnFilterDisplayMode={'popover'}

                            //filtr nad headerem - popover
                            muiFilterTextFieldProps={{
                                // sx: { m: '0.5rem 0', width: '100%' },
                                sx: { m: '0', width: '300px' },
                                variant: 'outlined',
                            }}

                            // editDisplayMode={'cell'}

                            muiPaginationProps={{
                                color: 'secondary',
                                rowsPerPageOptions: [10, 20, 30, 50, 100],
                                shape: 'rounded',
                                variant: 'outlined',
                            }}

                            muiTableHeadCellProps={() => ({
                                align: "left",
                                sx: {
                                    fontWeight: "bold",
                                    fontSize: "12px",
                                    color: "black",
                                    backgroundColor: "#a5f089",
                                    padding: "5px",
                                    paddingTop: "0",
                                    paddingBottom: "0",
                                    minHeight: "3rem",
                                    display: "flex",
                                    justifyContent: "center",
                                    border: '1px solid rgba(81, 81, 81, .2)'
                                },
                            })}

                        // odczytanie danych po kliknięciu w wiersz
                        // muiTableBodyCellProps={({ column, cell }) => ({
                        //     onClick: () => {
                        //         if (column.id === "UWAGI") { console.log(cell.row._valuesCache.UWAGI); }
                        //     },
                        //     sx: {
                        //         borderRight: "1px solid #c9c7c7", //add a border between columns
                        //         fontSize: "14px",
                        //         fontFamily: "Calibri",
                        //         padding: "2px",
                        //         // textAlign: "center"
                        //     },
                        // })}
                        />
                    </LocalizationProvider>

                </ThemeProvider>
                    <TfiSave className='table-save-settings' onClick={handleSaveSettings} />
                </>}
        </section >
    );
};

export default ActualTable;
