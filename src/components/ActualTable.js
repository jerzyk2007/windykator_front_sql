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


import './ActualTable.css';

const ActualTable = ({ info }) => {
    const theme = useTheme();

    const axiosPrivateIntercept = useAxiosPrivateIntercept();
    const { pleaseWait, setPleaseWait, auth } = useData();
    const { height } = useWindowSize();

    const [documents, setDocuments] = useState([]);
    // const [customFilter, setCustomFilter] = useState({});
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

            // if (item.accessorKey === "KONTRAHENT" || item.accessorKey !== "UWAGI") {
            if (item.accessorKey === "KONTRAHENT" || item.accessorKey === "UWAGI" || item.accessorKey === "KOMENTARZKANCELARIA") {
                modifiedItem.muiTableBodyCellProps = {
                    align: 'left',
                };
            } else {
                modifiedItem.muiTableBodyCellProps = {
                    align: 'center',
                };
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
            enableColumnFilterModes: true,
            minSize: 50,
            maxSize: 400,
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
            // Zabezpiecz przed aktualizacją stanu komponentu po odmontowaniu
            isMounted = false;
        };
    }, []);


    return (
        <section className='actual_table'>
            {pleaseWait ? <PleaseWait /> :
                <>  <ThemeProvider
                    theme={createTheme(theme, plPL)} >
                    <MaterialReactTable
                        className='actual_table__table'
                        columns={columnsItem}
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
                        onPaginationChange={setPagination}
                        // globalFilterFn={'contains'}
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
                            columnPinning,
                            pagination
                        }}

                        // icons={{ SearchIcon: () => <input /> }}

                        enableColumnActions={false}

                        muiTableContainerProps={{ sx: { maxHeight: tableSize } }}
                        // wyświetla filtry nad komórką - 
                        // columnFilterDisplayMode={'popover'}

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
                                padding: "15px",
                                textAlign: "center",
                                // borderRadius: "5px",
                                // boxShadow: "2px 2px 2px #757575",
                                // border: ".5px solid #c9c7c7",
                                border: '1px solid rgba(81, 81, 81, .2)'
                            },
                        })}

                        // odczytanie danych po kliknięciu w wiersz
                        muiTableBodyCellProps={({ column, cell }) => ({
                            onClick: () => {
                                if (column.id === "UWAGI") { console.log(cell.row._valuesCache.UWAGI); }
                            },
                            sx: {
                                borderRight: "1px solid #c9c7c7", //add a border between columns
                                fontSize: "14px",
                                fontFamily: "Calibri",
                                padding: "5px",
                                // textAlign: "center"
                            },
                        })}
                    />
                </ThemeProvider>
                    <TfiSave className='table-save-settings' onClick={handleSaveSettings} />
                </>}
        </section>
    );
};

export default ActualTable;
