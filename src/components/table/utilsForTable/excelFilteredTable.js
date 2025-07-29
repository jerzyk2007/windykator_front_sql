import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const getAllDataRaport = async (allData, orderColumns, info) => {
  const cleanData = allData.map(item => {
    const sanitize = (text) => {
      if (!text) return " ";
      return text.replace(
        /[^\x20-\x7EąćęłńóśżźĄĆĘŁŃÓŚŻŹ,.\-+@()$%&"';:/\\!?=\[\]{}<>_\n\r]/g,
        ' '
      );
    };

    let dzialania = "";

    if (Array.isArray(item.UWAGI_ASYSTENT)) {
      const len = item.UWAGI_ASYSTENT.length;
      if (len === 0) {
        dzialania = "";
      } else if (len === 1) {
        dzialania = sanitize(item.UWAGI_ASYSTENT[0]);
      } else {
        dzialania = `Liczba wcześniejszych wpisów: ${len - 1}\n${sanitize(item.UWAGI_ASYSTENT[len - 1])}`;
      }
    } else {
      dzialania = "";
    }

    return {
      ...item,
      UWAGI_ASYSTENT: dzialania
    };
  });

  const startRow = 2;

  try {
    // Grupowanie cleanData po DZIAL (przed zmianą nazw kolumn)
    const groupedByDzial = {};
    cleanData.forEach(item => {
      const dzial = item.DZIAL || "Brak działu";
      if (!groupedByDzial[dzial]) {
        groupedByDzial[dzial] = [];
      }
      groupedByDzial[dzial].push(item);
    });

    // Arkusz zbiorczy
    const changeNameColumns = cleanData.map((doc) => {
      const newItem = {};
      for (const column of orderColumns.columns) {
        const value = doc[column.accessorKey];
        newItem[column.header] = value !== undefined ? value : doc[column.accessorKey];
      }
      return newItem;
    });

    const groupedSheets = [
      {
        name: info,
        data: changeNameColumns,
      },
    ];

    // Pozostałe arkusze – posortowane alfabetycznie
    const sortedDzialNames = Object.keys(groupedByDzial).sort((a, b) => a.localeCompare(b));

    sortedDzialNames.forEach(dzialName => {
      const mappedGroup = groupedByDzial[dzialName].map((doc) => {
        const newItem = {};
        for (const column of orderColumns.columns) {
          const value = doc[column.accessorKey];
          newItem[column.header] = value !== undefined ? value : doc[column.accessorKey];
        }
        return newItem;
      });

      groupedSheets.push({
        name: dzialName.substring(0, 30),
        data: mappedGroup,
      });
    });

    // Tworzenie arkuszy
    const workbook = new ExcelJS.Workbook();

    groupedSheets.forEach((sheet) => {
      const worksheet = workbook.addWorksheet(sheet.name);

      if (!sheet.data?.length) return;

      for (let i = 0; i < startRow - 1; i++) worksheet.addRow([]);

      const headers = orderColumns.order.filter((column) =>
        sheet.data[0].hasOwnProperty(column)
      );

      worksheet.addRow(['Lp', ...headers]);

      sheet.data.forEach((row, index) => {
        const rowData = [index + 1, ...headers.map((header) => row[header] || '')];
        worksheet.addRow(rowData);
      });

      const headerRow = worksheet.getRow(startRow);
      headerRow.font = { bold: true, size: 10 };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'cacaca' },
        };
      });

      // Formatowanie kolumn
      worksheet.getColumn(1).width = 10;
      worksheet.getColumn(1).alignment = { horizontal: 'center', vertical: 'middle' };

      headers.forEach((header, columnIndex) => {
        const colIndex = columnIndex + 2;
        const column = worksheet.getColumn(colIndex);
        const columnLetter = String.fromCharCode(64 + colIndex);
        const startDataRow = startRow + 1;
        const endDataRow = worksheet.rowCount;

        column.width = 15;
        column.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

        const sumCell = worksheet.getCell(startRow - 1, colIndex);
        const border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        if (header === 'Faktura') {
          column.width = 25;
          sumCell.value = { formula: `SUBTOTAL(103,${columnLetter}${startDataRow}:${columnLetter}${endDataRow})` };
          sumCell.numFmt = '0';
        } else if (header === 'Brutto' || header === 'Do rozl.') {
          column.numFmt = '#,##0.00';
          for (let rowIndex = startDataRow; rowIndex <= endDataRow; rowIndex++) {
            const cell = worksheet.getCell(`${columnLetter}${rowIndex}`);
            if (!cell.value || isNaN(parseFloat(cell.value))) cell.value = 0;
          }
          sumCell.value = { formula: `SUBTOTAL(109,${columnLetter}${startDataRow}:${columnLetter}${endDataRow})` };
          sumCell.numFmt = '#,##0.00 zł';
        } else if (header === 'Podjęte działania') {
          column.width = 35;
        } else if (header === 'Ile') {
          for (let rowIndex = startDataRow; rowIndex <= endDataRow; rowIndex++) {
            const cell = worksheet.getCell(`${columnLetter}${rowIndex}`);
            if (!cell.value || isNaN(parseFloat(cell.value))) cell.value = 0;
          }
        }

        if (sumCell.value) {
          sumCell.font = { bold: true };
          sumCell.alignment = { horizontal: 'center', vertical: 'middle' };
          sumCell.border = border;
          sumCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
        }
      });

      // Auto-szerokość kolumn
      headers.forEach((header, columnIndex) => {
        const colIndex = columnIndex + 2;
        const column = worksheet.getColumn(colIndex);
        let maxLength = header.length;
        worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
          if (rowIndex >= startRow) {
            const cellValue = row.getCell(colIndex).value;
            if (cellValue) {
              const len = cellValue.toString().length;
              if (len > maxLength) maxLength = len;
            }
          }
        });
        column.width = Math.max(15, Math.min(maxLength, 40));
      });

      worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
        if (rowIndex >= startRow) {
          row.eachCell({ includeEmpty: true }, (cell) => {
            cell.font = { size: 10 };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        }
      });

      worksheet.autoFilter = {
        from: `A${startRow}`,
        to: worksheet.getColumn(headers.length + 1).letter + `${startRow}`,
      };

      worksheet.views = [{
        state: 'frozen',
        xSplit: 2,
        ySplit: startRow,
        topLeftCell: `C${startRow + 1}`,
        activeCell: `C${startRow + 1}`,
      }];
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${info}.xlsx`);
  } catch (err) {
    console.error(err);
  }
};



