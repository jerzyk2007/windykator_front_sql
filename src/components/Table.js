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
import QuickTableNote from './QuickTableNote';

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

    const [sorting, setSorting] = useState([]);


    const [quickNote, setQuickNote] = useState('');

    // const fontSize = 13.5;
    // const border = "1px solid #c8c8c8";
    // const fontFamily = "Arial";
    // const boxShadow = '0 0 0 1px black';
    // const fontWeight = 300;
    const fontSize = '13px';
    const borderRight = "1px solid #c9c7c7";
    const border = "1px solid #c8c8c8";
    const fontFamily = "Arial";
    const boxShadow = '0 0 0 1px black';
    const padding = "2px 5px";
    const fontWeight = '500';
    const minHeight = '2rem';
    const maxHeight = "100%";


    const prepareColumns = (columnsData, data) => {
        const changeColumn = columnsData.map(item => {
            const modifiedItem = { ...item };

            if (item.filterVariant === 'multi-select' || item.filterVariant === 'select') {
                const uniqueValues = Array.from(new Set(data.map(filtr => filtr[item.accessorKey])));
                modifiedItem.filterSelectOptions = uniqueValues;
            }

            if (item.filterVariant === 'date-range') {
                modifiedItem.accessorFn = (originalRow) => new Date(originalRow[item.accessorKey]);
                modifiedItem.Cell = ({ cell }) => cell.getValue().toLocaleDateString('pl-PL', {
                    useGrouping: true,
                });
            }

            if (item.accessorKey === "KONTRAHENT") {

                modifiedItem.enableClickToCopy = false;
                modifiedItem.muiTableBodyCellProps = {
                    align: 'left',
                    sx: {
                        borderRight,
                        fontSize,
                        minHeight,
                        maxHeight,
                        fontFamily,
                        padding,
                        fontWeight,
                    }
                };
            } else {
                modifiedItem.muiTableBodyCellProps = {
                    align: 'center',
                    sx: {
                        borderRight,
                        fontSize,
                        minHeight,
                        maxHeight,
                        fontFamily,
                        padding,
                        fontWeight,
                    }
                };
            }
            if (item.accessorKey === "UWAGI") {

                modifiedItem.enableClickToCopy = false;
                modifiedItem.Cell = ({ cell }) => {
                    const cellValue = cell.getValue();
                    if (Array.isArray(cellValue) && cellValue.length > 0) {
                        return (
                            <div>
                                {cellValue.map((item, index) => (
                                    <p key={index}>{item}</p>
                                ))}
                            </div>
                        );
                    }
                    // else {
                    //     return "Brak danych"; // Wyświetl ten komunikat, gdy tablica UWAGI jest pusta
                    // }

                };
                modifiedItem.muiTableBodyCellProps = {
                    align: 'left',
                    sx: {
                        borderRight,
                        fontSize,
                        minHeight,
                        maxHeight,
                        fontFamily,
                        padding,
                        fontWeight,
                    }
                };
            }

            if (item.accessorKey === "ILEDNIPOTERMINIE") {
                modifiedItem.muiTableBodyCellProps = ({ cell }) => ({
                    sx: {
                        borderRight,
                        fontSize,
                        minHeight,
                        maxHeight,
                        fontFamily,
                        padding,
                        fontWeight,
                        backgroundColor: cell.column.id === 'ILEDNIPOTERMINIE' && cell.getValue() > 0 ? 'rgb(250, 136, 136)' : "white",

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
                            borderRight,
                            fontSize,
                            minHeight,
                            maxHeight,
                            fontFamily,
                            padding,
                            fontWeight,
                            backgroundColor: cell.column.id === '50VAT' && Math.abs(cellValue - dorozliczValue) <= 1
                                ? 'rgb(250, 136, 136)' : "white",
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
                            borderRight,
                            fontSize,
                            minHeight,
                            maxHeight,
                            fontFamily,
                            padding,
                            fontWeight,
                            backgroundColor: cell.column.id === '100VAT' && Math.abs(cellValue - dorozliczValue) <= 1
                                ? 'rgb(250, 136, 136)' : "white",

                        },
                        align: 'center',
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
        })),
        [columnSizing, columnVisibility, density, columnPinning, columns]
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
        setQuickNote('');
        prepareTable();

        return () => {
            isMounted = false;
        };
    }, [info]);


    // useEffect(() => {
    //     console.log(pagination);
    // }, [pagination]);


    return (
        <section className='actual_table'>
            {/* {quickNote && documents &&
                <QuickTableNote
                    quickNote={quickNote}
                    setQuickNote={setQuickNote}
                    notePosition={notePosition}
                    setNotePosition={setNotePosition}
                    documents={documents}
                    setDocuments={setDocuments}
                />} */}
            {pleaseWait ? <PleaseWait /> :
                <>
                    <ThemeProvider
                        theme={theme} >
                        {/* theme={createTheme(theme, plPL)} > */}
                        {quickNote &&
                            <QuickTableNote
                                quickNote={quickNote}
                                setQuickNote={setQuickNote}
                                documents={documents}
                                setDocuments={setDocuments}
                            />}

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
                                enableSorting
                                enableColumnResizing
                                onColumnSizingChange={setColumnSizing}
                                onColumnVisibilityChange={setColumnVisibility}
                                onDensityChange={setDensity}
                                onColumnOrderChange={setColumnOrder}
                                enableColumnOrdering
                                enableColumnPinning
                                onColumnPinningChange={setColumnPinning}
                                onPaginationChange={setPagination}
                                onSortingChange={setSorting}
                                enableSelectAll={false}
                                initialState={{
                                    showColumnFilters: false,
                                    showGlobalFilter: true,
                                    // pagination: { pageIndex: 2, pageSize: 30 }
                                    // pagination: manualPagination

                                }}
                                localization={MRT_Localization_PL}
                                state={{
                                    columnVisibility,
                                    density,
                                    columnOrder,
                                    columnPinning,
                                    pagination,
                                    sorting,
                                }}
                                enableGlobalFilterModes
                                globalFilterModeOptions={['contains']}
                                positionGlobalFilter="left"

                                // wyłącza filtr (3 kropki) w kolumnie
                                enableColumnActions={false}

                                // nie odświeża tabeli po zmianie danych
                                autoResetPageIndex={false}

                                // enableColumnVirtualization

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
                                layoutMode="grid"

                                muiPaginationProps={{
                                    rowsPerPageOptions: [10, 20, 30, 50, 100],
                                    shape: 'rounded',
                                    variant: 'outlined',
                                }}


                                muiTableHeadCellProps={() => ({
                                    align: "left",
                                    sx: {
                                        fontWeight: "700",
                                        fontSize: "12px",
                                        color: "black",
                                        // backgroundColor: "#a5f089",
                                        backgroundColor: "#a7d3f7",

                                        // padding: "5",
                                        // paddingTop: "0",
                                        // paddingBottom: "0",
                                        // minHeight: "3rem",
                                        // display: "flex",
                                        // justifyContent: "center",
                                        // alignItems: "center",
                                        // border: '1px solid rgba(81, 81, 81, .2)'
                                        borderRight,
                                        '& .Mui-TableHeadCell-Content': {
                                            justifyContent: 'center',
                                            // flexDirection: "column",
                                            // padding: "5",
                                            textWrap: "balance"
                                        },
                                    },
                                })}



                                // odczytanie danych po kliknięciu w wiersz
                                muiTableBodyCellProps={({ column, row, cell }) => ({
                                    onDoubleClick: () => {
                                        // if (column.id === "UWAGI") { console.log(cell.row._valuesCache.UWAGI); }
                                        if (column.id === "UWAGI") {
                                            // console.log(e);
                                            // setNotePosition(e);
                                            setQuickNote(row.original);
                                        }
                                    },
                                    sx: {
                                        position: "relative"
                                    }
                                    // sx: {
                                    //     borderRight: "1px solid #c9c7c7", //add a border between columns
                                    //     fontSize: "14px",
                                    //     fontFamily: "Calibri",
                                    //     padding: "2px",
                                    //     // textAlign: "center"
                                    // },
                                })}
                            />
                        </LocalizationProvider>

                    </ThemeProvider>
                    <TfiSave className='table-save-settings' onClick={handleSaveSettings} />
                </>}
        </section >
    );
};

export default ActualTable;
