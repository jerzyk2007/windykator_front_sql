import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const columnsOrder = [
    "Dział",
    "Lokalizacja",
    "Obszar",
    "Owner",
    "Opiekun",
    "Mail"
];

const columnsName = [
    {
        accessorKey: "department",
        header: "Dział"
    },
    {
        accessorKey: "area",
        header: "Obszar"
    },
    {
        accessorKey: "localization",
        header: "Lokalizacja"
    },
    {
        accessorKey: "owner",
        header: "Owner"
    },
    {
        accessorKey: "guardian",
        header: "Opiekun"
    },
    {
        accessorKey: "mail",
        header: "Mail"
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
                    column.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                    column.width = 25;
                    if (header === "Mail") {
                        column.width = 40; // np. dla kolumny 'Lokalizacja'
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
            saveAs(new Blob([buffer]), 'Struktura organizacji.xlsx');
        });
    } catch (err) {
        console.error(err);
    }
};


export const useOrganizationStructureL = () => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();
    const organizationStructure = async () => {
        try {
            // dane od lini 180 do 192 przeniesione z innego komponentu, moze czasem tzreba będzie połączyć te dane :)
            // const createAccounts = await axiosPrivateIntercept.get(`/repair/get-accounts-data`);

            // const filteredData = createAccounts.data.existUser.map(item => {
            //   return {
            //     "nazwisko": item.usersurname,
            //     "imię": item.username,
            //     "mail / login": item.userlogin,
            //     "działy": item.dzial,
            //     "hasło": item.haslo
            //   };
            // });
            // generateExcel(filteredData);

            const result = await axiosPrivateIntercept.get("/fk/get-organization-structure");

            const cleanData = result.data.map(item => {
                return {
                    ...item,
                    owner: Array.isArray(item.owner)
                        ? item.owner.join("\n")
                        : item.owner,
                    guardian: Array.isArray(item.guardian)
                        ? item.guardian.join("\n")
                        : item.guardian,
                    mail: Array.isArray(item.mail)
                        ? item.mail.join("\n")
                        : item.mail,
                };
            });

            const addObject = [{ name: "struktura", data: cleanData }];

            // console.log(addObject);
            generateExcel(addObject);
        } catch (error) {
            console.error(error);
        }
    };

    return organizationStructure;
};