import { useState, useEffect } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
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

    // const columnItems = columns.map((col, index) => {
    //     return (
    //         <section className='table_settings-table__columns' key={index}>
    //             <p >{col}</p>
    //             <p>Podaj nazwe</p>
    //             <p>Podaj filtr</p>
    //             <p>Podaj typ danych</p>

    //         </section>
    //     );
    // });

    const handleSaveColumnsSetinngs = async () => {
        try {
            const result = await axiosPrivateIntercept.patch('/settings/change-columns', { columns });
            console.log(result.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    const handleGetColumsFromDocuments = async () => {
        try {
            const result = await axiosPrivateIntercept.get('/documents/get-columns');
            setColumnsName(result.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    const createColumns = () => {
        const newColumns = columnsName.map(col => {
            return {
                accessorKey: col,
                header: col,
                enableColumnFilterModes: false,
                filterVariant: 'contains',
                type: "text"
            };
        });
        setColumns(newColumns);
        console.log((newColumns));
    };

    useEffect(() => {
        handleGetColumsFromDocuments();
    }, []);

    useEffect(() => {
        createColumns();
    }, [columnsName]);

    return (
        <section className='table_settings'>
            <section className='table_settings-table'>
                <h2>Ustawienia kolumn tabeli</h2>
                <button onClick={handleSaveColumnsSetinngs}>Zapis</button>
                {/* <button onClick={handleGetColumsFromDocuments}>Pobierz</button> */}
                <section className='table_settings-table__container'>
                    {/* {columnItems} */}
                </section>
            </section>
            <section className='table_settings-raport'>
                <h2>Ustawienia kolumn raportu</h2>
            </section>
        </section>
    );
};

export default TableSettings;