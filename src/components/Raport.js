import { useState, useEffect, useMemo } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from "./hooks/useData";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_PL } from 'material-react-table/locales/pl';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import { plPL } from '@mui/material/locale';

import './Raport.css';

const Raport = () => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();
    const { auth } = useData();

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


    const checkMinMaxDateGlobal = () => {
        let maxDate = raportData[0].DATAFV;
        let minDate = raportData[0].DATAFV;

        // Iteracja przez wszystkie obiekty w tablicy;
        raportData.forEach(obj => {
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

    // suma brutto wszytskich elementów danego działu lub pracownika
    // const grossTotal = () => {
    //     let sumOfGross = new Map();
    //     let howManyElements = new Map();
    //     let Brutto = [];

    //     departments.forEach(dep => {
    //         // Inicjalizacja sumy i liczby kluczy BRUTTO dla danego działu
    //         sumOfGross.set(dep, 0);
    //         howManyElements.set(dep, 0);

    //         // Iteracja po obiektach w raportData
    //         raportData.forEach(item => {
    //             // Sprawdzenie, czy obiekt zawiera klucz DZIAL, który pasuje do aktualnego działu
    //             if (item.DZIAL === dep) {
    //                 // Jeśli tak, dodajemy wartość klucza BRUTTO do sumy i zwiększamy licznik kluczy BRUTTO
    //                 sumOfGross.set(dep, sumOfGross.get(dep) + item.BRUTTO);
    //                 howManyElements.set(dep, howManyElements.get(dep) + 1);
    //             }
    //         });
    //     });
    //     // departments.forEach(dep => {
    //     //     console.log(`Dział: ${dep}, Suma BRUTTO: ${sumOfGross.get(dep)}, Liczba kluczy BRUTTO: ${howManyElements.get(dep)}`);
    //     // });
    //     departments.forEach(dep => {
    //         // Obiekt zawierający sumę i liczbę kluczy BRUTTO dla danego działu
    //         let departmentObj = {};
    //         departmentObj[dep] = {
    //             Brutto: sumOfGross.get(dep).toFixed(2),
    //             Counter: howManyElements.get(dep)
    //         };
    //         Brutto.push(departmentObj);
    //     });
    //     // console.log(Brutto);
    // };

    const grossTotal = () => {
        // suma Brutto
        let sumOfGross = new Map();

        //ile faktur
        let howManyElements = new Map();

        //ile faktur przeterminowanych
        let howManyExpiredElements = new Map();

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
                    // Jeśli tak, dodajemy wartość klucza BRUTTO do sumy i zwiększamy licznik kluczy BRUTTO
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
                NotExpiredPayment: notExpiredPaymentValue.toFixed(2),
                ExpiredPaymentsWithoutPandL: expiredPaymentsWithoutPandLValue.toFixed(2),
                NotExpiredPaymentWithoutPandL: notExpiredPaymentWithoutPandLValue.toFixed(2),
                Objective: Number(objective),
                ObjectiveWithoutPandL: Number(objectiveWithoutPandL),
                DocumentsCounterExpired: howManyExpiredElements.get(dep)
            };
            generatingRaport.push(departmentObj);
        });

        setRaport(generatingRaport);
        console.log(generatingRaport);
    };



    const createDataRapor = () => {
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
            checkMinMaxDateGlobal();
            grossTotal();

        } else if (permission === "Basic") {
            console.log(raportData);
        }
    };


    const getData = async () => {
        try {
            const result = await axiosPrivateIntercept.get(`/raport/get-data/${auth._id}`);
            setRaportData(result.data.data);
            setPermission(result.data.permission);
        }
        catch (err) {
            console.log(err);
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'Department', //access nested data with dot notation
                header: 'Dział',
                size: 150,
            },
            {
                accessorKey: 'TotalDocumentsValue',
                header: 'Kwota faktur',
                size: 150,
                // Cell: ({ cell }) => cell.getValue()?.toLocaleString(),
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
                }
                // Cell: ({ cell }) =>
                //     cell.getValue().toLocaleString('pl-PL', {
                //         style: 'currency',
                //         currency: 'PLN',
                //     }),
            },
            {
                accessorKey: 'DocumentsCounter',
                header: 'Ilość faktur',
                size: 150,
            },
            {
                accessorKey: 'ExpiredPayments',
                header: 'Przeterminowane',
                size: 150,
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
                }
            },
            {
                accessorKey: 'DocumentsCounterExpired',
                header: 'Ilość faktur przeterminowanych',
                size: 150,
            },
            {
                accessorKey: 'Objective',
                header: 'Cel całość',
                size: 150,
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
                }
            },
            {
                accessorKey: 'ObjectiveWithoutPandL',
                header: 'Cel bez PZU/LINK4',
                size: 150,
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
                }
            },
        ],
        [raport]
    );
    const table = useMaterialReactTable({
        columns,
        data: raport
    });

    useEffect(() => {
        grossTotal();
    }, [raportDate]);

    useEffect(() => {
        createDataRapor();
    }, [raportData, permission]);

    useEffect(() => {
        getData();
    }, []);

    return (
        <section className='raport'>Raport
            <section className='raport-date'>
                <input
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
                <input
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
            <MaterialReactTable table={table} />;
        </section>
    );
};

export default Raport;