export const muiTableBodyCellProps = {
  align: "center",
  sx: {
    fontSize: "16px",
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000",
    fontFamily: "Calibri",
    padding: "5px",
    fontWeight: "500",
    minHeight: "2rem",
    // maxHeight: "8rem",
    textWrap: "balance",
    whiteSpace: "pre-wrap",
  },
};

export const preparedFKColumns = [
  {
    accessorKey: "CZY_SAMOCHOD_WYDANY_AS",
    header: "CZY_SAMOCHOD_WYDANY_AS",
    filterVariant: "multi-select",
  },
  {
    accessorKey: "CZY_W_KANCELARI",
    header: "CZY_W_KANCELARI",
    filterVariant: "multi-select",
  },
  {
    accessorKey: "DATA_ROZLICZENIA_AS",
    header: "DATA_ROZLICZENIA_AS",
    // filterVariant: "multi-select",
  },
  {
    accessorKey: "DATA_WYDANIA_AUTA",
    header: "DATA_WYDANIA_AUTA",
    filterVariant: "multi-select",
  },
  {
    accessorKey: "DATA_WYSTAWIENIA_FV",
    header: "DATA WYSTAWIENIA FV",
    filterVariant: "date-range",
    Cell: ({ cell }) => {
      // Parsowanie wartości komórki jako data
      const date = new Date(cell.getValue());

      // Sprawdzenie, czy data jest prawidłowa
      if (!isNaN(date)) {
        // Jeśli data jest prawidłowa, zwracamy ją jako lokalizowaną datę w formacie pl-PL
        return date.toLocaleDateString("pl-PL", {
          useGrouping: true,
        });
      } else {
        // Jeśli data jest nieprawidłowa, zwracamy pusty string lub inny komunikat błędu
        return "brak danych";
      }
    },
  },
  {
    accessorKey: "DO_ROZLICZENIA_AS",
    header: "DO_ROZLICZENIA_AS",
    filterVariant: "range",
    Cell: ({ cell }) => {
      const value = cell.getValue();
      const formattedSalary =
        value !== undefined && value !== null
          ? value.toLocaleString("pl-PL", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              useGrouping: true,
            })
          : "NULL"; // Zastąp puste pola zerem

      return `${formattedSalary}`;
    },
  },

  {
    accessorKey: "DZIAL",
    header: "Dział",
    filterVariant: "multi-select",
  },

  {
    accessorKey: "ETAP_SPRAWY",
    header: "ETAP_SPRAWY",
    filterVariant: "multi-select",
  },
  {
    accessorKey: "ILE_DNI_NA_PLATNOSC_FV",
    header: "ILE_DNI_NA_PLATNOSC_FV",
    filterVariant: "range",
  },

  {
    accessorKey: "JAKA_KANCELARIA",
    header: "JAKA_KANCELARIA",
    filterVariant: "multi-select",
  },
  {
    accessorKey: "KONTRAHENT",
    header: "KONTRAHENT",
    filterVariant: "text",
  },
  {
    accessorKey: "KWOTA_DO_ROZLICZENIA_FK",
    header: "KWOTA_DO_ROZLICZENIA_FK",
    filterVariant: "range",
    Cell: ({ cell }) => {
      const value = cell.getValue();
      const formattedSalary =
        value !== undefined && value !== null
          ? value.toLocaleString("pl-PL", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              useGrouping: true,
            })
          : "0,00"; // Zastąp puste pola zerem

      return `${formattedSalary}`;
    },
  },

  {
    accessorKey: "KWOTA_WPS",
    header: "KWOTA_WPS",
    filterVariant: "range",
    // filterVariant: "multi-select",
    Cell: ({ cell }) => {
      const value = cell.getValue();
      const formattedSalary =
        value !== undefined && value !== null && value !== 0
          ? value.toLocaleString("pl-PL", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              useGrouping: true,
            })
          : "NULL"; // Zastąp puste pola zerem

      return `${formattedSalary}`;
    },
  },
  {
    accessorKey: "LOKALIZACJA",
    header: "LOKALIZACJA",
    filterVariant: "multi-select",
  },
  {
    accessorKey: "NR_DOKUMENTU",
    header: "NR_DOKUMENTU",
    filterVariant: "text",
  },

  {
    accessorKey: "NR_KLIENTA",
    header: "NR_KLIENTA",
    filterVariant: "text",
  },
  {
    accessorKey: "OBSZAR",
    header: "OBSZAR",
    filterVariant: "multi-select",
  },
  {
    accessorKey: "OPIEKUN_OBSZARU_CENTRALI",
    header: "OPIEKUN_OBSZARU_CENTRALI",
    filterVariant: "multi-select",
  },
  {
    accessorKey: "OPIS_ROZRACHUNKU",
    header: "OPIS_ROZRACHUNKU",
    // filterVariant: "multi-select",
    Cell: ({ cell }) => {
      const cellValue = cell.getValue();
      if (Array.isArray(cellValue) && cellValue.length > 0) {
        return (
          <div
            style={{ whiteSpace: "pre-wrap", textAlign: "left", width: "100%" }}
          >
            {cellValue.map((item, index) => (
              <p key={index} style={{ textAlign: "left" }}>
                {item.length > 200 && index !== cellValue.length - 1
                  ? item.slice(0, 200) + "..."
                  : item}
              </p>
            ))}
          </div>
        );
      } else {
        return null;
      }
    },
  },
  {
    accessorKey: "OWNER",
    header: "OWNER",
    filterVariant: "multi-select",
  },
  {
    accessorKey: "PRZEDZIAL_WIEKOWANIE",
    header: "PRZEDZIAL_WIEKOWANIE",
    filterVariant: "multi-select",
  },
  {
    accessorKey: "PRZETER_NIEPRZETER",
    header: "PRZETER_NIEPRZETER",
    filterVariant: "select",
  },
  {
    accessorKey: "RODZAJ_KONTA",
    header: "RODZAJ_KONTA",
    filterVariant: "select",
  },
  {
    accessorKey: "ROZNICA",
    header: "ROZNICA",
    filterVariant: "range",
    Cell: ({ cell }) => {
      const value = cell.getValue();
      const formattedSalary =
        value !== undefined && value !== null && value !== 0
          ? value.toLocaleString("pl-PL", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              useGrouping: true,
            })
          : "NULL"; // Zastąp puste pola zerem

      return `${formattedSalary}`;
    },
  },
  {
    accessorKey: "TERMIN_PLATNOSCI_FV",
    header: "TERMIN_PLATNOSCI_FV",
    filterVariant: "date-range",
    Cell: ({ cell }) => {
      // Parsowanie wartości komórki jako data
      const date = new Date(cell.getValue());
      // Sprawdzenie, czy data jest prawidłowa
      if (!isNaN(date)) {
        // Jeśli data jest prawidłowa, zwracamy ją jako lokalizowaną datę w formacie pl-PL
        return date.toLocaleDateString("pl-PL", {
          useGrouping: true,
        });
      } else {
        // Jeśli data jest nieprawidłowa, zwracamy pusty string lub inny komunikat błędu
        return "brak danych";
      }
    },
  },
  {
    accessorKey: "TYP_DOKUMENTU",
    header: "TYP_DOKUMENTU",
    filterVariant: "multi-select",
    muiTableBodyCellProps: {
      align: "center",
    },
  },
];

export const preparedData = (tableData) => {
  const update = tableData.map((item) => {
    if (!item.DO_ROZLICZENIA_AS) {
      item.DO_ROZLICZENIA_AS = "NULL";
    }

    if (item.JAKA_KANCELARIA === " ") {
      item.JAKA_KANCELARIA = "NIE DOTYCZY";
    }

    if (item.KWOTA_WPS) {
      item.KWOTA_WPS = Number(item.KWOTA_WPS);
    }

    if (!item.KWOTA_WPS) {
      item.KWOTA_WPS = 0;
    }

    if (item.RODZAJ_KONTA) {
      item.RODZAJ_KONTA = String(item.RODZAJ_KONTA);
    }

    if (!item.ROZNICA) {
      item.ROZNICA = 0;
    }

    if (item.DATA_WYSTAWIENIA_FV === "1900-01-01") {
      item.DATA_WYSTAWIENIA_FV = "brak danych";
    }
    if (item.DATA_WYSTAWIENIA_FV) {
      item.DATA_WYSTAWIENIA_FV = new Date(item.DATA_WYSTAWIENIA_FV);
    }
    if (item.TERMIN_PLATNOSCI_FV) {
      item.TERMIN_PLATNOSCI_FV = new Date(item.TERMIN_PLATNOSCI_FV);
    }

    if (item.OWNER) {
      // Jeśli item.OWNER istnieje i nie jest pusty, możemy przeprowadzić odpowiednie formatowanie
      const cellValue = item.OWNER;

      // Sprawdzamy, czy wartość jest tablicą i czy zawiera co najmniej jeden element
      if (Array.isArray(cellValue) && cellValue.length > 0) {
        // Tworzymy pojedynczy ciąg tekstu, łącząc wszystkie elementy tablicy
        const combinedText = cellValue.join(" - ");
        // Aktualizujemy wartość item.OWNER na sformatowany ciąg tekstu
        item.OWNER = combinedText;
      }
      // Jeśli wartość item.OWNER nie jest tablicą lub jest pusta, nie zmieniamy jej
    }

    if (item.OPIEKUN_OBSZARU_CENTRALI) {
      // Jeśli item.OWNER istnieje i nie jest pusty, możemy przeprowadzić odpowiednie formatowanie
      const cellValue = item.OPIEKUN_OBSZARU_CENTRALI;

      // Sprawdzamy, czy wartość jest tablicą i czy zawiera co najmniej jeden element
      if (Array.isArray(cellValue) && cellValue.length > 0) {
        // Tworzymy pojedynczy ciąg tekstu, łącząc wszystkie elementy tablicy
        const combinedText = cellValue.join(" - ");
        // Aktualizujemy wartość item.OWNER na sformatowany ciąg tekstu
        item.OPIEKUN_OBSZARU_CENTRALI = combinedText;
      }
      // Jeśli wartość item.OWNER nie jest tablicą lub jest pusta, nie zmieniamy jej
    }

    return item;
  });
  return update;
};
