
// do filtrywoania wszytskich nazw działów z tabelki
const addPrefiksDepartment = (data) => {
    // Pobierz unikalne nazwy z tablicy
    const uniqueDepartmentNames = Array.from(new Set(data.map(item => item.DZIAL)));
    return uniqueDepartmentNames;
};

const nowaFunkcja = () => { };

export { addPrefiksDepartment, nowaFunkcja };
