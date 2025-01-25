import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const columnsOrder = [
    "Nr faktury",
    "Ile dni - PRZELEW",
    "Ile po terminie",
    "Kwota brutto",
    "Do rozliczenia",
    "Kontrahent",
    "Dział",
    "Nr szkody",
    "Uwagi do sprawy",
    "Upoważnienie",
    "Ośw o VAT",
    "Płatność VAT",
    "Prawo jazdy",
    "Dowód rej.",
    "Polisa AC",
    "Fv w SVCloud",
    "Czy jest odpowiedzilność",
];

const columnsName = [
    {
        accessorKey: "BRUTTO",
        header: "Kwota brutto"
    },
    {
        accessorKey: "CONTROL_DOW_REJ",
        header: "Dowód rej."
    },
    {
        accessorKey: "CONTROL_FV",
        header: "Fv w SVCloud"
    },
    {
        accessorKey: "CONTROL_ODPOWIEDZIALNOSC",
        header: "Czy jest odpowiedzilność"
    },
    {
        accessorKey: "CONTROL_OSW_VAT",
        header: "Ośw o VAT"
    },
    {
        accessorKey: "CONTROL_PLATNOSC_VAT",
        header: "Płatność VAT"
    },
    {
        accessorKey: "CONTROL_POLISA",
        header: "Polisa AC"
    },
    {
        accessorKey: "CONTROL_PR_JAZ",
        header: "Prawo jazdy"
    },
    {
        accessorKey: "CONTROL_UPOW",
        header: "Upoważnienie"
    },
    {
        accessorKey: "CONTROL_UWAGI",
        header: "Uwagi do sprawy"
    },
    {
        accessorKey: "DZIAL",
        header: "Dział"
    },
    {
        accessorKey: "KONTRAHENT",
        header: "Kontrahent"
    },
    {
        accessorKey: "NALEZNOSC",
        header: "Do rozliczenia"
    },
    {
        accessorKey: "NR_DOKUMENTU",
        header: "Nr faktury"
    },
    {
        accessorKey: "NR_SZKODY",
        header: "Nr szkody"
    },
    {
        accessorKey: "ILE_DNI_NA_PLATNOSC",
        header: "Ile dni - PRZELEW"
    },
    {
        accessorKey: "ILE_DNI_PO_TERMINIE",
        header: "Ile po terminie"
    },

];


const generateExcel = async (cleanData) => {

    // od którego wiersza mają się zaczynać dane w arkuszu
    const startRow = 1;
    try {
        const changeNameColumns = cleanData.map((doc) => {
            const update = doc.data.map((item) => {
                const newItem = {};
                for (const column of columnsName) {
                    if (item[column.accessorKey] !== undefined) {
                        newItem[column.header] = item[column.accessorKey];
                    } else {
                        newItem[column.accessorKey] = item[column.accessorKey];
                    }
                }
                return newItem;
            });
            return {
                name: doc.name,
                data: update,
            };
        });

        const workbook = new ExcelJS.Workbook();

        changeNameColumns.forEach((sheet) => {
            const worksheet = workbook.addWorksheet(sheet.name);

            if (sheet.data && sheet.data.length > 0) {
                // Dodaj 5 pustych wierszy na początku arkusza
                for (let i = 0; i < startRow - 1; i++) {
                    worksheet.addRow([]);
                }

                // Użyj tablicy columnsOrder, aby uporządkować nagłówki
                const headers = columnsOrder.filter((column) =>
                    sheet.data[0].hasOwnProperty(column)
                );

                // Dodaj nagłówki w 6. wierszu, z kolumną 'Lp' na początku
                worksheet.addRow(['Lp', ...headers]);

                // Dodaj dane z każdego obiektu jako wiersze, zaczynając od 1 w kolumnie 'Lp'
                sheet.data.forEach((row, index) => {
                    const rowData = [index + 1, ...headers.map((header) => row[header] || '')]; // Dodaj numer porządkowy
                    worksheet.addRow(rowData);
                });

                // Stylizowanie nagłówków
                const headerRow = worksheet.getRow(startRow);
                headerRow.font = { bold: true, size: 10 }; // Ustawienie pogrubionej czcionki o rozmiarze 10
                headerRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                headerRow.eachCell((cell) => {
                    cell.font = { bold: true, size: 10 };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'cacaca' }, // Kolor tła (np. żółty)
                    };
                });


                // Stylizacja dla kolumny 'Lp'
                const lpColumn = worksheet.getColumn(1); // Kolumna 'Lp' to zawsze pierwsza kolumna
                lpColumn.width = 10; // Szerokość kolumny
                lpColumn.alignment = { horizontal: 'center', vertical: 'middle' }; // Wyśrodkowanie

                // Stylizowanie kolumn na podstawie ich nazw, pomijając 'Lp'
                headers.forEach((header, columnIndex) => {
                    const column = worksheet.getColumn(columnIndex + 2); // Kolumna 'Lp' ma indeks 1, więc zaczynamy od 2
                    const headerCell = worksheet.getCell(startRow, columnIndex + 2);
                    headerCell.font = { bold: true }; // Pogrubienie czcionki
                    headerCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                    const excelStartRow = startRow + 1;
                    const excelEndRow = worksheet.rowCount;
                    column.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                    column.width = 15;

                    const extraCellBorder = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    };

                    if (header === 'Nr faktury') {
                        headerCell.alignment = { horizontal: 'center', vertical: 'middle' };
                        headerCell.font = { bold: true }; // Pogrubienie czcionki
                        column.width = 25;
                        // Wstawienie liczby dokumentów w wierszu 4 tej kolumny
                        // const countCell = worksheet.getCell(5, column.number);
                        // countCell.value = { formula: `SUBTOTAL(103,G${excelStartRow}:G${excelEndRow})` };
                        // countCell.numFmt = '0'; // Formatowanie liczby
                        // countCell.font = { bold: true }; // Pogrubienie tekstu
                        // countCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Wyrównanie tekstu
                        // countCell.border = extraCellBorder;
                        // countCell.fill = {
                        //     type: 'pattern',
                        //     pattern: 'solid',
                        //     fgColor: { argb: 'FFFF00' }, // Żółte tło dla wyróżnienia
                        // };

                    }
                    else if (header === 'Kwota brutto') {
                        column.numFmt = '#,##0.00';
                    }
                    else if (header === 'Do rozliczenia') {
                        column.numFmt = '#,##0.00';

                        // zamienia wartość null, undefined na 0
                        worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
                            if (rowIndex > startRow) { // Pomijamy nagłówki
                                const cell = row.getCell(columnIndex + 2); // Kolumna "Do rozliczenia"
                                const cellValue = cell.value;

                                // Sprawdzenie, czy wartość nie jest liczbą
                                if (typeof cellValue !== 'number' || isNaN(cellValue)) {
                                    cell.value = 0; // Zamiana na 0
                                }
                            }
                        });
                    }
                    else if (header === 'Kontrahent') {
                        column.width = 30;
                    }
                    else if (header === 'Nr szkody') {
                        column.width = 25;
                    }
                    else if (header === 'Uwagi do sprawy') {
                        column.width = 35;
                    }
                });

                worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
                    // Sprawdzamy, czy jesteśmy w wierszach od 6 w górę
                    if (rowIndex >= startRow) {
                        row.eachCell({ includeEmpty: true }, (cell) => {
                            // Jeśli to nie jest wiersz nagłówka (np. 6), zastosuj standardową stylizację
                            cell.font = { size: 10 }; // Ustawienie czcionki na rozmiar 10

                            // Ustawienie cienkiego obramowania dla każdej komórki
                            cell.border = {
                                top: { style: 'thin' },
                                left: { style: 'thin' },
                                bottom: { style: 'thin' },
                                right: { style: 'thin' },
                            };

                        });
                    }
                });
                headerRow.eachCell((cell) => {
                    cell.font = { bold: true, size: 10 };
                    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

                });


                // Ustawienie autofiltrowania od wiersza 6 (nagłówki) dla całego zakresu
                worksheet.autoFilter = {
                    from: 'A1', // Pierwsza kolumna (Lp)
                    to: worksheet.getColumn(headers.length + 1).letter + '1', // Ostatnia kolumna na podstawie liczby kolumn
                };

                // Blokowanie 5 pierwszych wierszy, aby wiersz 6 (nagłówki) został widoczny
                worksheet.views = [
                    {
                        state: 'frozen',
                        xSplit: 2,
                        ySplit: startRow, // Zablokowanie do wiersza 6, aby nagłówki zostały widoczne
                        topLeftCell: 'C2',
                        activeCell: 'C2',
                    },
                ];
            }
        });

        // Zapisz plik Excel
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer]), 'Raport kontroli BL.xlsx');
        });
    } catch (err) {
        console.error(err);
    }
};


export const useControlRaportBL = () => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const controlRaportBL = async () => {
        try {
            const result = await axiosPrivateIntercept.get("/fk/get-data-raports-control-BL");

            const filteredData = result.data.map(item => {
                return {
                    BRUTTO: item.BRUTTO ? item.BRUTTO : 0,
                    CONTROL_DOW_REJ: item.CONTROL_DOW_REJ ? item.CONTROL_DOW_REJ : " ",
                    CONTROL_FV: item.CONTROL_FV ? item.CONTROL_FV : " ",
                    CONTROL_ODPOWIEDZIALNOSC: item.CONTROL_ODPOWIEDZIALNOSC ? item.CONTROL_ODPOWIEDZIALNOSC : " ",
                    CONTROL_PLATNOSC_VAT: item.CONTROL_PLATNOSC_VAT ? item.CONTROL_PLATNOSC_VAT : " ",
                    CONTROL_POLISA: item.CONTROL_POLISA ? item.CONTROL_POLISA : " ",
                    CONTROL_PR_JAZ: item.CONTROL_PR_JAZ ? item.CONTROL_PR_JAZ : " ",
                    CONTROL_UPOW: item.CONTROL_UPOW ? item.CONTROL_UPOW : " ",
                    CONTROL_UWAGI: Array.isArray(item.CONTROL_UWAGI)
                        ? item.CONTROL_UWAGI.join("\n\n")
                        : " ",
                    DZIAL: item.DZIAL ? item.DZIAL : " ",
                    ILE_DNI_NA_PLATNOSC: item.ILE_DNI_NA_PLATNOSC ? item.ILE_DNI_NA_PLATNOSC : " ",
                    ILE_DNI_PO_TERMINIE: item.ILE_DNI_PO_TERMINIE ? item.ILE_DNI_PO_TERMINIE : " ",
                    KONTRAHENT: item.KONTRAHENT ? item.KONTRAHENT : " ",
                    NALEZNOSC: item.NALEZNOSC ? item.NALEZNOSC : 0,
                    NR_DOKUMENTU: item.NR_DOKUMENTU ? item.NR_DOKUMENTU : " ",
                    NR_SZKODY: item.NR_SZKODY ? item.NR_SZKODY : " ",


                };
            });

            const resultArray = filteredData.reduce((acc, item) => {
                let area = item.DZIAL; // Pobieramy wartość DZIAL z obiektu

                // Zamieniamy wszystkie '/' na '-'
                area = area.replace(/\//g, '-');  // Zastępujemy '/' myślnikiem

                // Sprawdzamy, czy już mamy obiekt z takim DZIAL w wynikowej tablicy
                const existingGroup = acc.find(group => group.name === area);

                if (existingGroup) {
                    // Jeśli grupa już istnieje, dodajemy obiekt do tej grupy
                    existingGroup.data.push(item);
                } else {
                    // Jeśli grupa nie istnieje, tworzymy nową z danym DZIAL
                    acc.push({ name: area, data: [item] });
                }

                return acc;
            }, []);

            const addObject = [{ name: "Blacharnie", data: filteredData }, ...resultArray];

            generateExcel(addObject);
        } catch (error) {
            console.error(error);
        }
    };

    return controlRaportBL;
};