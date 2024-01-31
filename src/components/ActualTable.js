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
    const [customFilter, setCustomFilter] = useState({});
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnSizing, setColumnSizing] = useState({});
    const [density, setDensity] = useState('');
    const [columnOrder, setColumnOrder] = useState([]);
    const [columnPinning, setColumnPinning] = useState({});
    const [columns, setColumns] = useState([]);
    const [tableSize, setTableSize] = useState(500);

    const prepareColumns = (columnsData, data) => {
        const changeColumn = columnsData.map(item => {
            const modifiedItem = { ...item };

            if (item.filterVariant === 'multi-select') {
                const uniqueValues = Array.from(new Set(data.map(filtr => filtr[item.accessorKey])));
                modifiedItem.filterSelectOptions = uniqueValues;
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
                    const formattedSalary = cell.getValue().toLocaleString('pl-PL', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                    });
                    return `${formattedSalary}`;
                };
            }

            delete modifiedItem.type;

            return modifiedItem;
        });
        return changeColumn;
    };


    const prepareTable = async () => {
        try {
            setPleaseWait(true);

            const result = await axiosPrivateIntercept.get(`/documents/get-all/${info}`);
            setDocuments(result.data);
            const settingsTable = await axiosPrivateIntercept.get('/user/get-table-settings/', { params: { userlogin: auth.userlogin } });
            setColumnVisibility(settingsTable?.data?.visible ? settingsTable.data.visible : {});
            setColumnSizing(settingsTable?.data?.size ? settingsTable.data.size : {});
            setDensity(settingsTable?.data?.density ? settingsTable.data.density : 'comfortable');
            setColumnOrder(settingsTable?.data?.order ? (settingsTable.data.order).map(order => order) : []);
            setColumnPinning(settingsTable?.data?.pinning ? (settingsTable.data.pinning) : { left: [], right: [] });
            const getColumns = await axiosPrivateIntercept.get('/settings/get-columns');
            const modifiedColumns = prepareColumns(getColumns.data, result.data);
            setColumns(modifiedColumns);
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

    const columnsItem = useMemo(
        () => columns.map(column => ({
            ...column,
            size: columnSizing?.[column.accessorKey] ? columnSizing[column.accessorKey] : column.size,
        })),
        [columnSizing, columnVisibility, density, columnPinning, columns]
    );

    useEffect(() => {
        setTableSize(height - 220);
    }, [height]);

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

                        muiTableContainerProps={{ sx: { maxHeight: tableSize } }}

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
                </ThemeProvider>
                    <TfiSave className='table-save-settings' onClick={handleSaveSettings} />
                </>}
        </section>
    );
};

export default ActualTable;
