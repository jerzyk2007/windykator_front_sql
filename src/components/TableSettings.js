import { useState } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import './TableSettings.css';

const TableSettings = () => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [columns, setColumns] = useState(
        [{
            accessorKey: 'NUMER',
            header: 'Faktura',
            enableColumnFilterModes: false,
            filterVariant: 'contains',
            enableHiding: false,
            enablePinning: false,
            minSize: 100,
            maxSize: 400,
            type: "text"
        },
        {
            accessorKey: 'KONTRAHENT',
            header: 'Kontrahent',
            enableColumnFilterModes: false,
            filterVariant: 'contains',
            enableHiding: true,
            enablePinning: true,
            minSize: 100,
            maxSize: 400,
            type: "text"
        },
        {
            accessorKey: 'DZIAL',
            header: 'Dział',
            enableColumnFilterModes: false,
            filterVariant: 'multi-select',
            enableHiding: true,
            enablePinning: true,
            minSize: 100,
            maxSize: 400,
            type: "text"
        },
        {
            accessorKey: 'NRNADWOZIA',
            header: 'VIN',
            enableColumnFilterModes: false,
            filterVariant: 'contains',
            enableHiding: true,
            enablePinning: true,
            minSize: 100,
            maxSize: 400,
            type: "text"
        },
        {
            accessorKey: 'W_BRUTTO',
            header: 'Brutto',
            enableColumnFilterModes: false,
            filterVariant: 'range-slider',
            enableHiding: true,
            enablePinning: true,
            minSize: 100,
            maxSize: 400,
            type: "money"
        },
        {
            accessorKey: 'DOROZLICZ_',
            header: 'Brakuje',
            enableColumnFilterModes: false,
            filterVariant: 'range-slider',
            enableHiding: true,
            enablePinning: true,
            minSize: 100,
            maxSize: 400,
            type: "money"
        },
        {
            accessorKey: 'PRZYGOTOWAL',
            header: 'Przygował',
            enableColumnFilterModes: false,
            filterVariant: 'multi-select',
            enableHiding: true,
            enablePinning: true,
            minSize: 100,
            maxSize: 400,
            type: "text"
        },
        {
            accessorKey: 'PLATNOSC',
            header: 'Płatność',
            enableColumnFilterModes: false,
            filterVariant: 'multi-select',
            enableHiding: true,
            enablePinning: true,
            minSize: 100,
            maxSize: 400,
            type: "text"
        },
        {
            accessorKey: 'NRREJESTRACYJNY',
            header: 'Nr rej',
            enableColumnFilterModes: false,
            filterVariant: 'contains',
            enableHiding: true,
            enablePinning: true,
            minSize: 100,
            maxSize: 400,
            type: "text"
        },
        {
            accessorKey: 'UWAGI',
            header: 'Uwagi',
            enableColumnFilterModes: false,
            filterVariant: 'contains',
            enableHiding: true,
            enablePinning: true,
            minSize: 100,
            maxSize: 400,
            type: "text"
        }]
    );

    const handleSaveColumnsSetinngs = async () => {
        try {
            const result = await axiosPrivateIntercept.patch('/settings/change-columns', { columns });
            console.log(result.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    const handleGetColums = async () => {
        try {
            const result = await axiosPrivateIntercept.get('/settings/get-columns');
            console.log(result.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    return (
        <section className='table_settings'>
            <section className='table_settings-table'>
                <h2>Ustawienia kolumn tabeli</h2>
                <button onClick={handleSaveColumnsSetinngs}>Zapis</button>
                <button onClick={handleGetColums}>Pobierz</button>
            </section>
            <section className='table_settings-raport'>
                <h2>Ustawienia kolumn raportu</h2>
            </section>
        </section>
    );
};

export default TableSettings;