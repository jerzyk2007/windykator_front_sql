import { useState, useEffect, useMemo } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from "./hooks/useData";
import useWindowSize from './hooks/useWindow';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_PL } from 'material-react-table/locales/pl';
import PleaseWait from './PleaseWait';
import { TfiSave } from "react-icons/tfi";
import { SiMicrosoftexcel } from "react-icons/si";
import * as xlsx from 'xlsx';

import './RaportAdvisers.css';

const RaportAdvisers = () => {
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
    const [errRaportDate, errSetRaportDate] = useState(false);


    const checkMinMaxDateGlobal = (documents) => {
        let maxDate = documents[0].DATA_FV;
        let minDate = documents[0].DATA_FV;

        documents.forEach(obj => {
            // Porównanie daty z aktualnymi maksymalną i minimalną datą
            if (obj.DATA_FV > maxDate) {
                maxDate = obj.DATA_FV;
            }
            if (obj.DATA_FV < minDate) {
                minDate = obj.DATA_FV;
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

    // w przypadku jeśli Asystentka widzi wiecej niż jeden działa dodawany jest kolejny wiersz "Całość" jako łączny wynik doradców których widzi
    // const addedAllToRaports = (generatingRaport) => {
    //     if (generatingRaport.length > 1) {
    //         const sumOfAllItems = generatingRaport.reduce((acc, currentItem) => {
    //             acc.DocumentsCounter += currentItem.DocumentsCounter;
    //             acc.DocumentsCounterExpired += currentItem.DocumentsCounterExpired;
    //             acc.DocumentsCounterExpiredWithoutPandL += currentItem.DocumentsCounterExpiredWithoutPandL;
    //             acc.ExpiredPayments += currentItem.ExpiredPayments;
    //             acc.ExpiredPaymentsWithoutPandL += currentItem.ExpiredPaymentsWithoutPandL;
    //             acc.NotExpiredPayment += currentItem.NotExpiredPayment;
    //             acc.NotExpiredPaymentWithoutPandL += currentItem.NotExpiredPaymentWithoutPandL;
    //             acc.TotalDocumentsValue += currentItem.TotalDocumentsValue;
    //             acc.UnderPayment += currentItem.UnderPayment;
    //             return acc;
    //         }, {
    //             DocumentsCounter: 0,
    //             DocumentsCounterExpired: 0,
    //             DocumentsCounterExpiredWithoutPandL: 0,
    //             ExpiredPayments: 0,
    //             ExpiredPaymentsWithoutPandL: 0,
    //             NotExpiredPayment: 0,
    //             NotExpiredPaymentWithoutPandL: 0,
    //             TotalDocumentsValue: 0,
    //             UnderPayment: 0
    //         });

    //         const expiredPaymentsValue = sumOfAllItems.ExpiredPayments;
    //         const notExpiredPaymentValue = sumOfAllItems.NotExpiredPayment;

    //         // Oblicz wartość Objective
    //         //zabezpieczenie przed dzieleniem przez zero
    //         let objective = 0;
    //         if (notExpiredPaymentValue + expiredPaymentsValue !== 0) {
    //             objective = (expiredPaymentsValue / (notExpiredPaymentValue + expiredPaymentsValue) * 100);
    //         }
    //         sumOfAllItems.Objective = objective;


    //         const expiredPaymentsWithoutPandLValue = sumOfAllItems.ExpiredPaymentsWithoutPandL;
    //         const notExpiredPaymentWithoutPandLValue = sumOfAllItems.NotExpiredPaymentWithoutPandL;
    //         // Oblicz wartość ObjectiveWithoutPandL
    //         let objectiveWithoutPandL = 0;
    //         if (notExpiredPaymentWithoutPandLValue + expiredPaymentsWithoutPandLValue !== 0) {
    //             objectiveWithoutPandL = (expiredPaymentsWithoutPandLValue / (notExpiredPaymentWithoutPandLValue + expiredPaymentsWithoutPandLValue) * 100);
    //         }
    //         sumOfAllItems.ObjectiveWithoutPandL = objectiveWithoutPandL;

    //         sumOfAllItems.Department = 'Całość';

    //         //dodaję "Całość" jako pierwszy obiekt, żeby w tabeli wyświetlał się jako pierwszy
    //         generatingRaport.unshift(sumOfAllItems);


    //         setRaport(generatingRaport);

    //     } else {
    //         setRaport(generatingRaport);
    //     }
    // };

    // funkcja przygotowuje dane do raportu
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

        // przeterminowane kancelaria
        let legalExpired = new Map();

        // ilość faktur kancelaria
        let legalCounter = new Map();

        let generatingRaport = [];

        departments.forEach(dep => {
            sumOfGross.set(dep.merge, 0);
            howManyElements.set(dep.merge, 0);
            howManyExpiredElements.set(dep.merge, 0);
            howManyExpiredElementsWithoutPandL.set(dep.merge, 0);
            underPayment.set(dep.merge, 0);
            expiredPayments.set(dep.merge, 0);
            notExpiredPayment.set(dep.merge, 0);
            expiredPaymentsWithoutPandL.set(dep.merge, 0);
            notExpiredPaymentWithoutPandL.set(dep.merge, 0);
            legalExpired.set(dep.merge, 0);
            legalCounter.set(dep.merge, 0);

            raportData.forEach(item => {

                // Sprawdzenie, czy obiekt zawiera klucz DZIAL, który pasuje do aktualnego działu
                // oraz czy data mieści się w przedziale

                // pobranie daty dokumnetu
                let documentDate = new Date(item.DATA_FV);
                documentDate.setHours(0, 0, 0, 0);

                // // pobranie daty terminu płatności
                let afterDeadlineDate = new Date(item.TERMIN);
                afterDeadlineDate.setHours(0, 0, 0, 0);

                // najmniejsza data z danych
                let minDate = new Date(raportDate.minRaportDate);
                minDate.setHours(0, 0, 0, 0);

                // największa data z danych
                let maxDate = new Date(raportDate.maxRaportDate);
                minDate.setHours(0, 0, 0, 0);

                // dzisiejsza data
                let todayDate = new Date();
                todayDate.setHours(0, 0, 0, 0);

                if (item.DORADCA === dep.adviser && dep.merge === `${dep.adviser}-${item.DZIAL}` && documentDate >= minDate && documentDate <= maxDate) {
                    sumOfGross.set(dep.merge, sumOfGross.get(dep.merge) + item.BRUTTO);
                    howManyElements.set(dep.merge, howManyElements.get(dep.merge) + 1);
                    underPayment.set(dep.merge, underPayment.get(dep.merge) + item.DO_ROZLICZENIA);
                }

                if (item.DORADCA === dep.adviser && dep.merge === `${dep.adviser}-${item.DZIAL}` && afterDeadlineDate < todayDate && documentDate >= minDate && documentDate <= maxDate) {
                    expiredPayments.set(dep.merge, expiredPayments.get(dep.merge) + item.DO_ROZLICZENIA);
                    howManyExpiredElements.set(dep.merge, howManyExpiredElements.get(dep.merge) + 1);
                }

                if (item.DORADCA === dep.adviser && dep.merge === `${dep.adviser}-${item.DZIAL}` && afterDeadlineDate > todayDate && documentDate >= minDate && documentDate <= maxDate) {
                    notExpiredPayment.set(dep.merge, notExpiredPayment.get(dep.merge) + item.DO_ROZLICZENIA);
                }

                if (item.DORADCA === dep.adviser && dep.merge === `${dep.adviser}-${item.DZIAL}` && (item.JAKA_KANCELARIA !== "ROK-KONOPA" && item.JAKA_KANCELARIA !== "CNP") && afterDeadlineDate < todayDate && documentDate >= minDate && documentDate <= maxDate) {
                    expiredPaymentsWithoutPandL.set(dep.merge, expiredPaymentsWithoutPandL.get(dep.merge) + item.DO_ROZLICZENIA);
                    howManyExpiredElementsWithoutPandL.set(dep.merge, howManyExpiredElementsWithoutPandL.get(dep.merge) + 1);
                }

                if (item.DORADCA === dep.adviser && dep.merge === `${dep.adviser}-${item.DZIAL}` && (item.JAKA_KANCELARIA && item.JAKA_KANCELARIA !== "ROK-KONOPA" && item.JAKA_KANCELARIA !== "CNP") && afterDeadlineDate < todayDate && documentDate >= minDate && documentDate <= maxDate) {
                    legalExpired.set(dep.merge, legalExpired.get(dep.merge) + item.DO_ROZLICZENIA);
                    legalCounter.set(dep.merge, legalCounter.get(dep.merge) + 1);
                }

                if (item.DORADCA === dep.adviser && dep.merge === `${dep.adviser}-${item.DZIAL}` && (item.JAKA_KANCELARIA !== "ROK-KONOPA" && item.JAKA_KANCELARIA !== "CNP") && afterDeadlineDate > todayDate && documentDate >= minDate && documentDate <= maxDate) {
                    notExpiredPaymentWithoutPandL.set(dep.merge, notExpiredPaymentWithoutPandL.get(dep.merge) + item.DO_ROZLICZENIA);
                }
            });
        });


        departments.forEach(dep => {
            // zabezpieczenie przed dzieleniem przez zero odtąd 
            let expiredPaymentsValue = expiredPayments.get(dep.merge);
            let notExpiredPaymentValue = notExpiredPayment.get(dep.merge);
            let expiredPaymentsWithoutPandLValue = expiredPaymentsWithoutPandL.get(dep.merge);
            let notExpiredPaymentWithoutPandLValue = notExpiredPaymentWithoutPandL.get(dep.merge);

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
                DORADCA_DZIAL: dep.merge,
                DORADCA: dep.adviser,
                DZIAL: dep.department,
                CALKOWITA_WARTOSC_FV_BRUTTO: Number(sumOfGross.get(dep.merge)),
                KWOTA_NIEROZLICZONYCH_FV: Number(underPayment.get(dep.merge).toFixed(2)),
                PRZETERMINOWANE_FV: Number(expiredPaymentsValue.toFixed(2)),
                NIEPRZETERMINOWANE_FV: Number(notExpiredPaymentValue.toFixed(2)),
                PRZETERMINOWANE_BEZ_PZU_LINK4: Number(expiredPaymentsWithoutPandLValue.toFixed(2)),
                NIEPRZETERMINOWANE_FV_BEZ_PZU_LINK4: Number(notExpiredPaymentWithoutPandLValue.toFixed(2)),
                PRZETERMINOWANE_KANCELARIA: Number(legalExpired.get(dep.merge).toFixed(2)),
                CEL_CALOSC: Number(objective),
                CEL_BEZ_PZU_LINK4: Number(objectiveWithoutPandL),
                ILOSC_NIEROZLICZONYCH_FV: howManyElements.get(dep.merge),
                ILOSC_PRZETERMINOWANYCH_FV: howManyExpiredElements.get(dep.merge),
                ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4: howManyExpiredElementsWithoutPandL.get(dep.merge),
                ILOSC_FV_KANCELARIA: legalCounter.get(dep.merge),
            };

            if (
                departmentObj.CALKOWITA_WARTOSC_FV_BRUTTO
            ) {
                generatingRaport.push(departmentObj);
            }
        });
        setRaport(generatingRaport);
    };

    const createDataRaport = () => {
        if (permission === "Standard") {
            let uniqueAdvisersAndDepartments = [];
            raportData.forEach(item => {
                if (item.DORADCA && typeof item.DORADCA === 'string' && item.DZIAL && typeof item.DZIAL === 'string') {
                    const addUniqueAdvisersAndDepartments = {
                        merge: `${item.DORADCA}-${item.DZIAL}`,
                        adviser: item.DORADCA,
                        department: item.DZIAL
                    };
                    const isObjectExists = uniqueAdvisersAndDepartments.some(item => JSON.stringify(item) === JSON.stringify(addUniqueAdvisersAndDepartments));
                    if (!isObjectExists) {
                        uniqueAdvisersAndDepartments.push(addUniqueAdvisersAndDepartments);
                    }
                }
            });
            const sortedData = [...uniqueAdvisersAndDepartments].sort((a, b) => {
                const adviserA = a.adviser.toLowerCase();
                const adviserB = b.adviser.toLowerCase();
                if (adviserA < adviserB) return -1;
                if (adviserA > adviserB) return 1;
                return 0;
            });
            setDepartments(sortedData);

        } else if (permission === "Basic") {
            let uniqueAdvisersAndDepartments = [];
            raportData.forEach(item => {
                if (item.DORADCA && typeof item.DORADCA === 'string' && item.DZIAL && typeof item.DZIAL === 'string') {
                    const addUniqueAdvisersAndDepartments = {
                        merge: `${item.DORADCA}-${item.DZIAL}`,
                        adviser: item.DORADCA,
                        department: item.DZIAL
                    };
                    const isObjectExists = uniqueAdvisersAndDepartments.some(item => JSON.stringify(item) === JSON.stringify(addUniqueAdvisersAndDepartments));
                    if (!isObjectExists) {
                        uniqueAdvisersAndDepartments.push(addUniqueAdvisersAndDepartments);
                    }
                }
            });

            setDepartments(uniqueAdvisersAndDepartments);
        }
    };


    const getData = async () => {
        try {
            setPleaseWait(true);
            const resultData = await axiosPrivateIntercept.get(`/raport/get-data/${auth._id}`);
            setRaportData(resultData.data.data);
            setPermission(resultData.data.permission);
            checkMinMaxDateGlobal(resultData.data.data);

            const [settingsRaportUserAdvisers] = await Promise.all([
                axiosPrivateIntercept.get(`/user/get-raport-advisers-settings/${auth._id}`),
            ]);

            setColumnVisibility(settingsRaportUserAdvisers?.data?.visible || {});
            setColumnSizing(settingsRaportUserAdvisers?.data?.size || {});
            setDensity(settingsRaportUserAdvisers?.data?.density || 'comfortable');
            setColumnOrder(settingsRaportUserAdvisers?.data?.order?.map(order => order) || []);
            setColumnPinning(settingsRaportUserAdvisers?.data?.pinning || { left: [], right: [] });

            setPleaseWait(false);
        }
        catch (err) {
            console.log(err);
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'DORADCA',
                header: 'Doradca',
                size: columnSizing?.Department ? columnSizing.Department : 150,
                filterVariant: 'multi-select',
                filterSelectOptions: Array.from(new Set(raport.map(filtr => filtr['DORADCA'])))
            },
            {
                accessorKey: 'DZIAL',
                header: 'Dział',
                size: columnSizing?.Department ? columnSizing.Department : 150,
                filterVariant: 'multi-select',
                filterSelectOptions: Array.from(new Set(raport.map(filtr => filtr['DZIAL'])))
            },

            {
                accessorKey: 'CEL_BEZ_PZU_LINK4',
                header: 'Cel bez PZU/LINK4',
                enableColumnFilter: false,
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
                muiTableBodyCellProps: ({ cell }) => {
                    return {
                        sx: {
                            backgroundColor: "#ffe884",
                            borderRight: "1px solid #c9c7c7",
                            fontSize: "14px",
                            fontWeight: 'bold',
                            padding: "2px",
                            minHeight: '3rem'
                        },
                        align: 'center',
                    };
                }
            },
            {
                accessorKey: 'PRZETERMINOWANE_BEZ_PZU_LINK4',
                header: 'Przeterminowane bez PZU/LINK4',
                enableColumnFilter: false,
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
                muiTableBodyCellProps: () => {
                    return {
                        sx: {
                            backgroundColor: "#ffe884",
                            borderRight: "1px solid #c9c7c7",
                            fontSize: "14px",
                            fontWeight: 'bold',
                            padding: "2px",
                            minHeight: '3rem'
                        },
                        align: 'center',
                    };
                }
            },
            {
                accessorKey: 'ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4',
                header: 'Ilość faktur przet. bez PZU/LINK4',
                enableColumnFilter: false,
                muiTableBodyCellProps: ({ cell }) => {
                    return {
                        sx: {
                            backgroundColor: "#ffe884",
                            borderRight: "1px solid #c9c7c7",
                            fontSize: "14px",
                            fontWeight: 'bold',
                            padding: "2px",
                            minHeight: '3rem'
                        },
                        align: 'center',
                    };
                }
            },
            {
                accessorKey: 'CEL_CALOSC',
                header: 'Cel całość',
                enableColumnFilter: false,
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
                muiTableBodyCellProps: ({ cell }) => {
                    return {
                        sx: {
                            backgroundColor: "#caff84",
                            borderRight: "1px solid #c9c7c7",
                            fontSize: "14px",
                            fontWeight: 'bold',
                            padding: "2px",
                            minHeight: '3rem'
                        },
                        align: 'center',
                    };
                }
            },
            {
                accessorKey: 'PRZETERMINOWANE_FV',
                header: 'Przeterminowane fv',
                enableColumnFilter: false,
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
                muiTableBodyCellProps: ({ cell }) => {
                    return {
                        sx: {
                            backgroundColor: "#caff84",
                            borderRight: "1px solid #c9c7c7",
                            fontSize: "14px",
                            fontWeight: 'bold',
                            padding: "2px",
                            minHeight: '3rem'
                        },
                        align: 'center',
                    };
                }
            },

            {
                accessorKey: 'ILOSC_PRZETERMINOWANYCH_FV',
                header: 'Ilość faktur przeter.',
                enableColumnFilter: false,
                muiTableBodyCellProps: () => {
                    return {
                        sx: {
                            backgroundColor: "#caff84",
                            borderRight: "1px solid #c9c7c7",
                            fontSize: "14px",
                            fontWeight: 'bold',
                            padding: "2px",
                            minHeight: '3rem'
                        },
                        align: 'center',
                    };
                }
            },

            {
                accessorKey: 'KWOTA_NIEROZLICZONYCH_FV',
                header: 'Kwota faktur nierozl.',
                enableColumnFilter: false,
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
                accessorKey: 'ILOSC_NIEROZLICZONYCH_FV',
                header: 'Ilość faktur nierozliczonych',
                enableColumnFilter: false,
            },
            {
                accessorKey: 'PRZETERMINOWANE_KANCELARIA',
                header: 'Przeterm kancelarie',
                enableColumnFilter: false,
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
                accessorKey: 'ILOSC_FV_KANCELARIA',
                header: 'Ilość faktur',
                enableColumnFilter: false,
            },
        ],
        [raport]
    );
    const table = useMaterialReactTable({
        columns,
        data: raport,
        enableStickyHeader: true,
        enableGlobalFilter: true,
        enableGlobalFilterModes: false,
        enableColumnFilters: true,
        enableColumnPinning: true,
        enableColumnResizing: true,
        enableColumnOrdering: true,
        enableColumnActions: false,
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
        },
        // wyłącza wszytskie ikonki nad tabelą 
        // enableToolbarInternalActions: false,

        muiTableHeadCellProps: () => ({
            align: "center",
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
        muiTableContainerProps: { sx: { maxHeight: tableSize } },
        columnFilterDisplayMode: 'popover',
    });

    const handleSaveSettings = async () => {
        const raportAdvisers = { size: { ...columnSizing }, visible: { ...columnVisibility }, density, order: columnOrder, pinning: columnPinning };
        try {
            const result = await axiosPrivateIntercept.patch(`/user/save-raport-advisers-settings/${auth._id}`,
                { raportAdvisers }
            );
        }
        catch (err) {
            console.log(err);
        }
    };

    const handleExportExcel = async () => {

        const cleanData = (raport).map(doc => {
            const { DORADCA_DZIAL, ...cleanDoc } = doc;
            return cleanDoc;
        });

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(cleanData);
        xlsx.utils.book_append_sheet(wb, ws, "Doradcy");
        xlsx.writeFile(wb, "Raport-Doradca.xlsx");
    };

    useEffect(() => {
        createDataRaport();
    }, [raportData, permission, raportDate]);

    useEffect(() => {
        grossTotal();
    }, [departments]);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        setTableSize(height - 215);
    }, [height]);

    useEffect(() => {
        let minDate = new Date(raportDate.minRaportDate);
        let maxDate = new Date(raportDate.maxRaportDate);
        if (minDate > maxDate || maxDate < minDate) {
            errSetRaportDate(true);
        } else {
            errSetRaportDate(false);
        }
    },
        [raportDate]);


    return (
        <section className='raport_advisers'>
            <section className='raport_advisers-date'>
                <section className='raport_advisers-date__title'>
                    <h3>Wybierz przedział dat dla raportu</h3>
                </section>
                <section className='raport_advisers-date__content'>
                    <h3 className='raport_advisers-date__content-name'>od: </h3>
                    <input
                        className='raport_advisers-date-select'
                        style={errRaportDate ? { backgroundColor: "red" } : null}
                        name='minDate'
                        type="date"
                        min={minMaxDateGlobal.minGlobalDate}
                        max={minMaxDateGlobal.maxGlobalDate}
                        value={raportDate.minRaportDate}
                        onChange={(e) => setRaportDate(prev => {
                            return {
                                ...prev,
                                minRaportDate: e.target.value ? e.target.value : minMaxDateGlobal.minGlobalDate
                            };
                        })}
                    />
                    <h3 className='raport_advisers-date__content-name'>do: </h3>

                    <input
                        className='raport_advisers-date-select'
                        style={errRaportDate ? { backgroundColor: "red" } : null}
                        name='maxDate'
                        type="date"
                        min={minMaxDateGlobal.minGlobalDate}
                        max={minMaxDateGlobal.maxGlobalDate}
                        value={raportDate?.maxRaportDate}
                        onChange={(e) => setRaportDate(prev => {
                            return {
                                ...prev,
                                maxRaportDate: e.target.value ? e.target.value : minMaxDateGlobal.maxGlobalDate
                            };
                        })}
                    />
                </section>
            </section>
            {pleaseWait ? <PleaseWait /> : <MaterialReactTable
                className="raport_advisers-table"
                table={table} />}
            <section className='raport_advisers-panel'>
                <TfiSave className='raport_advisers-save-settings' onClick={handleSaveSettings} />
                <SiMicrosoftexcel className='raport_advisers-export-excel' onClick={handleExportExcel} />
            </section>
        </section>
    );
};

export default RaportAdvisers;