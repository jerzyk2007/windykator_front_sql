


const processAndExportData = (data) => {
    const dodajPrefixDoDzialow = (data) => {
        // Pobierz unikalne nazwy z tablicy
        const uniqueDzialNames = Array.from(new Set(data.map(item => item.DZIAL)));
        return uniqueDzialNames;
    };

    return dodajPrefixDoDzialow(data);
};

const nowaFunkcja = () => { };

export { processAndExportData, nowaFunkcja };
