import { useState } from 'react';
import './TableSettings.css';

const TableSettings = () => {
    const [columns, setColumns] = useState([
        {
            accessorKey: 'NUMER',
            header: 'Faktura',
            filterVariant: 'contains',
            enableHiding: false,
            enablePinning: false,
        },
        {
            accessorKey: 'KONTRAHENT',
            header: 'Kontrahent',
            filterVariant: 'text',
            enableHiding: true,
            enablePinning: true,
        },
        {
            accessorKey: 'DZIAL',
            header: 'Dział',
            filterVariant: 'multi-select',
            // filterSelectOptions: customFilter,
            enableHiding: true,
            enablePinning: true,
        },
        {
            accessorKey: 'NRNADWOZIA',
            header: 'VIN',
            filterVariant: 'text',
            enableHiding: true,
            enablePinning: true,
        },
        {
            accessorKey: 'W_BRUTTO',
            header: 'Brutto',
            filterVariant: 'text',
            enableHiding: true,
            enablePinning: true,
        },
        {
            accessorKey: 'DOROZLICZ_',
            header: 'Brakuje',
            filterVariant: 'text',
            enableHiding: true,
            enablePinning: true,
        },
        {
            accessorKey: 'PRZYGOTOWAL',
            header: 'Przygował',
            filterVariant: 'text',
            enableHiding: true,
            enablePinning: true,
        },
        {
            accessorKey: 'PLATNOSC',
            header: 'Płatność',
            filterVariant: 'text',
            enableHiding: true,
            enablePinning: true,
        },
        {
            accessorKey: 'NRREJESTRACYJNY',
            header: 'Nr rej',
            filterVariant: 'text',
            enableHiding: true,
            enablePinning: true,
        },
        {
            accessorKey: 'UWAGI',
            header: 'Uwagi',
            filterVariant: 'text',
            enableHiding: true,
            enablePinning: true,
        },
    ]);
    return (
        <section className='table_settings'>
            <section className='table_settings-table'>
                <h2>Ustawienia kolumn tabeli</h2>

            </section>
            <section className='table_settings-raport'>
                <h2>Ustawienia kolumn raportu</h2>
            </section>
        </section>
    );
};

export default TableSettings;