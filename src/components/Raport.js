import { useState, useEffect, useMemo } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from "./hooks/useData";
import useWindowSize from './hooks/useWindow';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_PL } from 'material-react-table/locales/pl';
import PleaseWait from './PleaseWait';
import { TfiSave } from "react-icons/tfi";

import './Raport.css';

const Raport = () => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();
    const { pleaseWait, setPleaseWait, auth } = useData();
    const { height } = useWindowSize();

    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnSizing, setColumnSizing] = useState({});
    const [density, setDensity] = useState('');
    const [columnOrder, setColumnOrder] = useState([]);
    const [columnPinning, setColumnPinning] = useState({});
    const [tableSize, setTableSize] = useState(400);
    const [raportData, setRaportData] = useState([]);
    const [permission, setPermission] = useState('');
    const [departments, setDepartments] = useState([]);
    const [raport, setRaport] = useState([]);
    const [minMaxDateGlobal, setMinMaxDateGlobal] = useState({
        minGlobalDate: '',
        maxGlobalDate: '',
    });
    const [raportDate, setRaportDate] = useState({
        minRaportDate: '',
        maxRaportDate: ''
    });


    const checkMinMaxDateGlobal = (documents) => {
        let maxDate = '2024-01-01';
        let minDate = '2024-01-01';

        // Iteracja przez wszystkie obiekty w tablicy;
        documents.forEach(obj => {
            // Porównanie daty z aktualnymi maksymalną i minimalną datą
            if (obj.DATAFV > maxDate) {
                maxDate = obj.DATAFV;
            }
            if (obj.DATAFV < minDate) {
                minDate = obj.DATAFV;
            }
        });
        setMinMaxDateGlobal(
            {
                minGlobalDate: minDate,
                maxGlobalDate: maxDate,
            }
        );
        setRaportDate({
            minRaportDate: minDate,
            maxRaportDate: maxDate
        });
    };

    const addedAllToRaports = (generatingRaport) => {
        if (generatingRaport.length > 1) {
            const sumOfAllItems = generatingRaport.reduce((acc, currentItem) => {
                acc.DocumentsCounter += currentItem.DocumentsCounter;
                acc.DocumentsCounterExpired += currentItem.DocumentsCounterExpired;
                acc.DocumentsCounterExpiredWithoutPandL += currentItem.DocumentsCounterExpiredWithoutPandL;
                acc.ExpiredPayments += currentItem.ExpiredPayments;
                acc.ExpiredPaymentsWithoutPandL += currentItem.ExpiredPaymentsWithoutPandL;
                acc.NotExpiredPayment += currentItem.NotExpiredPayment;
                acc.NotExpiredPaymentWithoutPandL += currentItem.NotExpiredPaymentWithoutPandL;
                acc.TotalDocumentsValue += currentItem.TotalDocumentsValue;
                acc.UnderPayment += currentItem.UnderPayment;
                return acc;
            }, {
                DocumentsCounter: 0,
                DocumentsCounterExpired: 0,
                DocumentsCounterExpiredWithoutPandL: 0,
                ExpiredPayments: 0,
                ExpiredPaymentsWithoutPandL: 0,
                NotExpiredPayment: 0,
                NotExpiredPaymentWithoutPandL: 0,
                TotalDocumentsValue: 0,
                UnderPayment: 0
            });

            const expiredPaymentsValue = sumOfAllItems.ExpiredPayments;
            const notExpiredPaymentValue = sumOfAllItems.NotExpiredPayment;
            sumOfAllItems.Objective = (expiredPaymentsValue / (notExpiredPaymentValue + expiredPaymentsValue) * 100);

            // Oblicz wartość ObjectiveWithoutPandL
            const expiredPaymentsWithoutPandLValue = sumOfAllItems.ExpiredPaymentsWithoutPandL;
            const notExpiredPaymentWithoutPandLValue = sumOfAllItems.NotExpiredPaymentWithoutPandL;
            sumOfAllItems.ObjectiveWithoutPandL = (expiredPaymentsWithoutPandLValue / (notExpiredPaymentWithoutPandLValue + expiredPaymentsWithoutPandLValue) * 100);

            sumOfAllItems.Department = 'Całość';

            //dodaję "Całość" jako pierwszy obiekt, żeby w tabeli wyświetlał się jako pierwszy
            generatingRaport.unshift(sumOfAllItems);


            setRaport(generatingRaport);

        } else {
            setRaport(generatingRaport);
        }
    };

    const grossTotal = () => {
        // suma Brutto
        let sumOfGross = new Map();

        //ile faktur
        let howManyElements = new Map();

        //ile faktur przeterminowanych
        let howManyExpiredElements = new Map();

        //ile faktur przeterminowanych bez PZU/LINK4
        let howManyExpiredElementsWithoutPandL = new Map();

        //ile niedopłaty
        let underPayment = new Map();

        //przeterminowane płatności
        let expiredPayments = new Map();

        //przeterminowane płatności bez PZU i LINK4
        let expiredPaymentsWithoutPandL = new Map();

        //nieprzeterminowane
        let notExpiredPayment = new Map();

        //nieprzeterminowane bez PZU i LINK4
        let notExpiredPaymentWithoutPandL = new Map();

        let generatingRaport = [];

        departments.forEach(dep => {
            sumOfGross.set(dep, 0);
            howManyElements.set(dep, 0);
            howManyExpiredElements.set(dep, 0);
            howManyExpiredElementsWithoutPandL.set(dep, 0);
            underPayment.set(dep, 0);
            expiredPayments.set(dep, 0);
            notExpiredPayment.set(dep, 0);
            expiredPaymentsWithoutPandL.set(dep, 0);
            notExpiredPaymentWithoutPandL.set(dep, 0);

            raportData.forEach(item => {
                // Sprawdzenie, czy obiekt zawiera klucz DZIAL, który pasuje do aktualnego działu
                // oraz czy data mieści się w przedziale

                // pobranie daty dokumnetu
                let documentDate = new Date(item.DATAFV);

                // pobranie daty terminu płatności
                let afterDeadlineDate = new Date(item.TERMIN);

                let minDate = new Date(raportDate.minRaportDate);
                let maxDate = new Date(raportDate.maxRaportDate);
                let todayDate = new Date();

                if (item.DZIAL === dep && documentDate >= minDate && documentDate <= maxDate) {
                    sumOfGross.set(dep, sumOfGross.get(dep) + item.BRUTTO);
                    howManyElements.set(dep, howManyElements.get(dep) + 1);
                    underPayment.set(dep, underPayment.get(dep) + item.DOROZLICZ);
                }

                if (item.DZIAL === dep && afterDeadlineDate < todayDate && documentDate >= minDate && documentDate <= maxDate) {
                    expiredPayments.set(dep, expiredPayments.get(dep) + item.DOROZLICZ);
                    howManyExpiredElements.set(dep, howManyExpiredElements.get(dep) + 1);
                }

                if (item.DZIAL === dep && afterDeadlineDate > todayDate && documentDate >= minDate && documentDate <= maxDate) {
                    notExpiredPayment.set(dep, notExpiredPayment.get(dep) + item.DOROZLICZ);
                }

                if (item.DZIAL === dep && (item.JAKAKANCELARIA !== "ROK-KONOPA" && item.JAKAKANCELARIA !== "CNP") && afterDeadlineDate < todayDate && documentDate >= minDate && documentDate <= maxDate) {
                    expiredPaymentsWithoutPandL.set(dep, expiredPaymentsWithoutPandL.get(dep) + item.DOROZLICZ);
                    howManyExpiredElementsWithoutPandL.set(dep, howManyExpiredElementsWithoutPandL.get(dep) + 1);
                }

                if (item.DZIAL === dep && (item.JAKAKANCELARIA !== "ROK-KONOPA" && item.JAKAKANCELARIA !== "CNP") && afterDeadlineDate > todayDate && documentDate >= minDate && documentDate <= maxDate) {
                    notExpiredPaymentWithoutPandL.set(dep, notExpiredPaymentWithoutPandL.get(dep) + item.DOROZLICZ);
                }
            });
        });



        departments.forEach(dep => {
            // zabezpieczenie przed dzieleniem przez zero odtąd 
            let expiredPaymentsValue = expiredPayments.get(dep);
            let notExpiredPaymentValue = notExpiredPayment.get(dep);
            let expiredPaymentsWithoutPandLValue = expiredPaymentsWithoutPandL.get(dep);
            let notExpiredPaymentWithoutPandLValue = notExpiredPaymentWithoutPandL.get(dep);

            let objective = 0;
            if (notExpiredPaymentValue + expiredPaymentsValue !== 0) {
                (objective = (((expiredPaymentsValue) / (notExpiredPaymentValue + expiredPaymentsValue)) * 100).toFixed(2));
            }

            let objectiveWithoutPandL = 0;
            if (notExpiredPaymentWithoutPandLValue + expiredPaymentsWithoutPandLValue !== 0) {
                objectiveWithoutPandL = (((expiredPaymentsWithoutPandLValue) / (notExpiredPaymentWithoutPandLValue + expiredPaymentsWithoutPandLValue)) * 100).toFixed(2);
            }
            // zabezpieczenie przed dzieleniem przez zero dodtąd 


            let departmentObj = {
                Department: dep,
                TotalDocumentsValue: Number(sumOfGross.get(dep).toFixed(2)),
                DocumentsCounter: howManyElements.get(dep),
                UnderPayment: Number(underPayment.get(dep).toFixed(2)),
                ExpiredPayments: Number(expiredPaymentsValue.toFixed(2)),
                NotExpiredPayment: Number(notExpiredPaymentValue.toFixed(2)),
                ExpiredPaymentsWithoutPandL: Number(expiredPaymentsWithoutPandLValue.toFixed(2)),
                NotExpiredPaymentWithoutPandL: Number(notExpiredPaymentWithoutPandLValue.toFixed(2)),
                Objective: Number(objective),
                ObjectiveWithoutPandL: Number(objectiveWithoutPandL),
                DocumentsCounterExpired: howManyExpiredElements.get(dep),
                DocumentsCounterExpiredWithoutPandL: howManyExpiredElementsWithoutPandL.get(dep)
            };
            generatingRaport.push(departmentObj);
        });

        addedAllToRaports(generatingRaport);
    };



    const createDataRaport = () => {
        if (permission === "Standard") {
            let uniqueDepartments = [];
            raportData.forEach(item => {
                if (item.DZIAL && typeof item.DZIAL === 'string') {
                    if (!uniqueDepartments.includes(item.DZIAL)) {
                        uniqueDepartments.push(item.DZIAL);
                    }
                }
            });
            setDepartments(uniqueDepartments);
            // checkMinMaxDateGlobal();
            grossTotal();

        }
        // else if (permission === "Basic") {
        //     console.log(raportData);
        // }
    };


    const getData = async () => {
        try {
            setPleaseWait(true);
            const resultData = await axiosPrivateIntercept.get(`/raport/get-data/${auth._id}`);
            setRaportData(resultData.data.data);
            setPermission(resultData.data.permission);
            checkMinMaxDateGlobal(resultData.data.data);

            const [settingsRaportUser] = await Promise.all([
                axiosPrivateIntercept.get(`/user/get-raport-settings/${auth._id}`),
            ]);

            setColumnVisibility(settingsRaportUser?.data?.visible || {});
            setColumnSizing(settingsRaportUser?.data?.size || {});
            setDensity(settingsRaportUser?.data?.density || 'comfortable');
            setColumnOrder(settingsRaportUser?.data?.order?.map(order => order) || []);
            setColumnPinning(settingsRaportUser?.data?.pinning || { left: [], right: [] });

            setPleaseWait(false);

        }
        catch (err) {
            console.log(err);
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'Department',
                header: 'Dział',
                size: columnSizing?.Department ? columnSizing.Department : 150
            },
            {
                accessorKey: 'Objective',
                header: 'Cel całość',
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    const formattedSalary = value !== undefined && value !== null
                        ? value.toLocaleString('pl-PL', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            useGrouping: true,
                        }) + " %"
                        : '0,00'; // Zastąp puste pola zerem

                    return `${formattedSalary}`;
                },
            },
            {
                accessorKey: 'ObjectiveWithoutPandL',
                header: 'Cel bez PZU/LINK4',
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    const formattedSalary = value !== undefined && value !== null
                        ? value.toLocaleString('pl-PL', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            useGrouping: true,
                        }) + " %"
                        : '0,00'; // Zastąp puste pola zerem

                    return `${formattedSalary}`;
                },
            },
            {
                accessorKey: 'ExpiredPayments',
                header: 'Przeterminowane',
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    const formattedSalary = value !== undefined && value !== null
                        ? value.toLocaleString('pl-PL', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            useGrouping: true,
                        })
                        : '0,00'; // Zastąp puste pola zerem

                    return `${formattedSalary}`;
                },
            },

            {
                accessorKey: 'DocumentsCounterExpired',
                header: 'Ilość faktur przeter.',
            },
            {
                accessorKey: 'ExpiredPaymentsWithoutPandL',
                header: 'Przeterminowane bez PZU/LINK4',
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    const formattedSalary = value !== undefined && value !== null
                        ? value.toLocaleString('pl-PL', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            useGrouping: true,
                        })
                        : '0,00'; // Zastąp puste pola zerem

                    return `${formattedSalary}`;
                },
            },
            {
                accessorKey: 'DocumentsCounterExpiredWithoutPandL',
                header: 'Ilość faktur przet. bez PZU/LINK4',
            },
            {
                accessorKey: 'UnderPayment',
                header: 'Kwota faktur nierozl.',
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    const formattedSalary = value !== undefined && value !== null
                        ? value.toLocaleString('pl-PL', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            useGrouping: true,
                        })
                        : '0,00';

                    return `${formattedSalary}`;
                },
                enableGlobalFilter: false

            },
            {
                accessorKey: 'DocumentsCounter',
                header: 'Ilość faktur',
            },
        ],
        [raport]
    );
    const table = useMaterialReactTable({
        columns,
        data: raport,
        enableStickyHeader: true,
        enableGlobalFilter: false,
        enableGlobalFilterModes: false,
        enableColumnFilters: false,
        enableColumnPinning: true,
        enableColumnResizing: true,
        enableColumnOrdering: true,
        // layoutMode: "grid",
        enablePagination: false,
        localization: MRT_Localization_PL,
        onColumnVisibilityChange: setColumnVisibility,
        onDensityChange: setDensity,
        onColumnSizingChange: setColumnSizing,
        onColumnOrderChange: setColumnOrder,
        onColumnPinningChange: setColumnPinning,
        state: {
            columnVisibility,
            density,
            columnOrder,
            columnPinning,
            columnSizing
        },

        defaultColumn: {
            maxSize: 400,
            minSize: 100,
            // size: 160, //default size is usually 180
        },
        // wyłącza wszytskie ikonki nad tabelą 
        // enableToolbarInternalActions: false,



        muiTableHeadCellProps: () => ({
            align: "left",
            sx: {
                fontWeight: "bold",
                fontSize: "14px",
                color: "black",
                backgroundColor: "#a7d3f7",
                padding: "15px",
                paddingTop: "0",
                paddingBottom: "0",
                minHeight: "2rem",
                display: "flex",
                justifyContent: "center",
                border: '1px solid rgba(81, 81, 81, .2)'
            },
        }),

        muiTableBodyCellProps: ({ column, cell }) => ({
            align: "center",
            sx: {
                borderRight: "1px solid #c9c7c7",
                fontSize: "14px",
                fontWeight: 'bold',
                padding: "2px",
                minHeight: '3rem'
            },
        }),
        muiTableContainerProps: { sx: { maxHeight: tableSize } }
    });

    const handleSaveSettings = async () => {
        const raportSettings = { size: { ...columnSizing }, visible: { ...columnVisibility }, density, order: columnOrder, pinning: columnPinning };
        try {
            const result = await axiosPrivateIntercept.patch(`/user/save-raport-settings/${auth._id}`,
                { raportSettings }
            );
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        createDataRaport();
    }, [raportData, permission, raportDate]);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        setTableSize(height - 285);
    }, [height]);


    return (
        <section className='raport'>
            <section className='raport-date'>
                <h3>Wybierz przedział dat dla raportu</h3>
                <h3>od: </h3>
                <input
                    className='raport-date-select'
                    name='minDate'
                    type="date"
                    min={minMaxDateGlobal.minGlobalDate}
                    max={minMaxDateGlobal.maxGlobalDate}
                    value={raportDate.minRaportDate}
                    onChange={(e) => setRaportDate(prev => {
                        return {
                            ...prev,
                            minRaportDate: e.target.value
                        };
                    })}
                />
                <h3>do: </h3>

                <input
                    className='raport-date-select'
                    name='maxDate'
                    type="date"
                    min={minMaxDateGlobal.minGlobalDate}
                    max={minMaxDateGlobal.maxGlobalDate}
                    value={raportDate.maxRaportDate}
                    onChange={(e) => setRaportDate(prev => {
                        return {
                            ...prev,
                            maxRaportDate: e.target.value
                        };
                    })}
                />
            </section>
            {pleaseWait ? <PleaseWait /> : <MaterialReactTable
                className="raport-table"
                table={table} />}
            <TfiSave className='raport-save-settings' onClick={handleSaveSettings} />
        </section>
    );
};

export default Raport;