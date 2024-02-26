import { useState, useEffect } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { TfiSave } from "react-icons/tfi";

import './TableSettings.css';

const TableSettings = () => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    // const [columns, setColumns] = useState(
    //     [{
    //         accessorKey: 'NUMER',
    //         header: 'Faktura',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'contains',
    //         type: "text"
    //     },
    //     {
    //         accessorKey: 'KONTRAHENT',
    //         header: 'Kontrahent',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'contains',
    //         type: "text"
    //     },
    //     {
    //         accessorKey: 'DZIAL',
    //         header: 'Dział',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'multi-select',
    //         type: "text"
    //     },
    //     {
    //         accessorKey: 'NRNADWOZIA',
    //         header: 'VIN',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'contains',
    //         type: "text"
    //     },
    //     {
    //         accessorKey: 'W_BRUTTO',
    //         header: 'Brutto',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'range-slider',
    //         type: "money"
    //     },
    //     {
    //         accessorKey: 'DOROZLICZ_',
    //         header: 'Brakuje',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'range-slider',
    //         type: "money"
    //     },
    //     {
    //         accessorKey: 'PRZYGOTOWAL',
    //         header: 'Przygował',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'multi-select',
    //         type: "text"
    //     },
    //     {
    //         accessorKey: 'PLATNOSC',
    //         header: 'Płatność',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'multi-select',
    //         type: "text"
    //     },
    //     {
    //         accessorKey: 'NRREJESTRACYJNY',
    //         header: 'Nr rej',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'contains',
    //         type: "text"
    //     },
    //     {
    //         accessorKey: 'UWAGI',
    //         header: 'Uwagi',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'contains',
    //         type: "text"
    //     }]
    // );
    // const [columns, setColumns] = useState(
    //     [{
    //         accessorKey: 'NUMER',
    //         header: 'Faktura',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'contains',
    //         enableHiding: true,
    //         enablePinning: true,
    //         minSize: 100,
    //         maxSize: 400,
    //         type: "text"
    //     },
    //     {
    //         accessorKey: 'KONTRAHENT',
    //         header: 'Kontrahent',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'contains',
    //         enableHiding: true,
    //         enablePinning: true,
    //         minSize: 100,
    //         maxSize: 400,
    //         type: "text"
    //     },
    //     {
    //         accessorKey: 'DZIAL',
    //         header: 'Dział',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'multi-select',
    //         enableHiding: true,
    //         enablePinning: true,
    //         minSize: 100,
    //         maxSize: 400,
    //         type: "text"
    //     },
    //     {
    //         accessorKey: 'NRNADWOZIA',
    //         header: 'VIN',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'contains',
    //         enableHiding: true,
    //         enablePinning: true,
    //         minSize: 100,
    //         maxSize: 400,
    //         type: "text"
    //     },
    //     {
    //         accessorKey: 'W_BRUTTO',
    //         header: 'Brutto',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'range-slider',
    //         enableHiding: true,
    //         enablePinning: true,
    //         minSize: 100,
    //         maxSize: 400,
    //         type: "money"
    //     },
    //     {
    //         accessorKey: 'DOROZLICZ_',
    //         header: 'Brakuje',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'range-slider',
    //         enableHiding: true,
    //         enablePinning: true,
    //         minSize: 100,
    //         maxSize: 400,
    //         type: "money"
    //     },
    //     {
    //         accessorKey: 'PRZYGOTOWAL',
    //         header: 'Przygował',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'multi-select',
    //         enableHiding: true,
    //         enablePinning: true,
    //         minSize: 100,
    //         maxSize: 400,
    //         type: "text"
    //     },
    //     {
    //         accessorKey: 'PLATNOSC',
    //         header: 'Płatność',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'multi-select',
    //         enableHiding: true,
    //         enablePinning: true,
    //         minSize: 100,
    //         maxSize: 400,
    //         type: "text"
    //     },
    //     {
    //         accessorKey: 'NRREJESTRACYJNY',
    //         header: 'Nr rej',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'contains',
    //         enableHiding: true,
    //         enablePinning: true,
    //         minSize: 100,
    //         maxSize: 400,
    //         type: "text"
    //     },
    //     {
    //         accessorKey: 'UWAGI',
    //         header: 'Uwagi',
    //         enableColumnFilterModes: false,
    //         filterVariant: 'contains',
    //         enableHiding: true,
    //         enablePinning: true,
    //         minSize: 100,
    //         maxSize: 400,
    //         type: "text"
    //     }]
    // );

    const [columns, setColumns] = useState([]);
    const [columnsName, setColumnsName] = useState([]);

    const handleHeaderChange = (index, field, newValue) => {
        setColumns((prevColumns) => {
            const updatedColumns = [...prevColumns];

            updatedColumns[index] = {
                ...updatedColumns[index],
                [field]: newValue,
            };

            return updatedColumns;
        });
    };

    const columnItems = columns.map((col, index) => {
        return (
            <section className='table_settings-table__columns' key={index}>
                <section className='columns-item'>
                    <span className='columns-item-header'>Nazwa w DB:</span>
                    <span className='columns-item-choice'>{col.accessorKey}</span>
                </section>
                <section className='columns-item'>
                    <span className='columns-item-header'>Podaj swoją nazwę:</span>
                    <span className='columns-item-choice'>
                        <input
                            className='item-choice'
                            type="text"
                            value={col.header}
                            onChange={(e) => handleHeaderChange(index, 'header', e.target.value)}
                        />
                    </span>
                </section>
                <section className='columns-item'>
                    <span className='columns-item-header'>Wybierz filtr:</span>
                    <span className='columns-item-choice'>

                        <select
                            className='item-choice'
                            value={col.filterVariant}
                            onChange={(e) => handleHeaderChange(index, 'filterVariant', e.target.value)}
                        >
                            <option value="none">Brak</option>
                            <option value="startsWith">Dokładne wyszukanie</option>
                            <option value="text">Zbliżone wyszukanie</option>
                            <option value="multi-select">Zaznacz wiele</option>
                            <option value="select">Zaznacz jeden</option>
                            <option value="range-slider">Suwak do kwot</option>
                            <option value="range">Od - do</option>
                            <option value="date-range">Filtr date-range</option>
                            <option value="date">Data</option>
                        </select>
                    </span>
                </section>
                <section className='columns-item'>
                    <span className='columns-item-header'>Wybierz typ danych:</span>
                    <span className='columns-item-choice'>
                        <select
                            className='item-choice'
                            value={col.type}
                            onChange={(e) => handleHeaderChange(index, 'type', e.target.value)}
                        >
                            <option value="text">tekst</option>
                            <option value="money">waluta</option>
                        </select>
                    </span>
                </section>


            </section>
        );
    });

    const handleSaveColumnsSetinngs = async () => {
        try {
            const result = await axiosPrivateIntercept.patch('/settings/change-columns', { columns });
        }
        catch (err) {
            console.log(err);
        }
    };

    const handleGetColums = async () => {
        try {
            const documentsColumn = await axiosPrivateIntercept.get('/documents/get-columns');
            const filteredArray = (documentsColumn.data).filter(item => item !== '__v');
            setColumnsName(filteredArray);
        }
        catch (err) {
            console.log(err);
        }
    };

    const createColumns = async () => {
        try {
            const settingsColumn = await axiosPrivateIntercept.get('/settings/get-columns');
            const newColumns = columnsName.map(colName => {
                const matchingColumn = settingsColumn.data.find(column => column.accessorKey === colName);

                if (matchingColumn) {
                    return {
                        accessorKey: matchingColumn.accessorKey,
                        header: matchingColumn.header,
                        filterVariant: matchingColumn.filterVariant,
                        type: matchingColumn.type
                    };
                } else {
                    return {
                        accessorKey: colName,
                        header: colName,
                        filterVariant: "contains",
                        type: "text"
                    };
                }
            });

            setColumns(newColumns);
        } catch (error) {
            console.error('Błąd podczas pobierania kolumn: ', error);
        }
    };


    useEffect(() => {
        handleGetColums();
    }, []);


    useEffect(() => {
        createColumns();
    }, [columnsName]);

    return (
        <section className='table_settings'>
            <section className='table_settings-table'>
                <section className='table_settings-table--title'>
                    <h3 className='table_settings-table--name'>Ustawienia kolumn tabeli</h3>
                    <TfiSave className='table_settings-table--save' onClick={handleSaveColumnsSetinngs} />
                </section>
                <section className='table_settings-table__container'>
                    {columnItems}
                </section>
            </section>
            <section className='table_settings-raport'>
                <section className='table_settings-table--title'>
                    <h3 className='table_settings-table--name'>Ustawienia kolumn raportu</h3>
                    <TfiSave className='table_settings-table--save' />
                </section>

            </section>
        </section>
    );
};

export default TableSettings;