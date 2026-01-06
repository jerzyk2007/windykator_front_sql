import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const SelectPanel = ({ rowData, roles, changePanel, setChangePanel }) => {
  // 1. Najpierw budujemy listę dostępnych opcji jako dane (obiekt z value i label)
  const options = [{ value: "doc-actions", label: "PANEL AKCJI" }];

  if (rowData.AREA === "BLACHARNIA") {
    options.push({ value: "becared", label: "KANCELARIA TU / BL" });
  }

  if ((roles.includes(110) || roles.includes(120)) && rowData.MARK_FK) {
    options.push({ value: "management", label: "RAPORT FK" });
  }

  if (
    (roles.includes(120) || roles.includes(2000)) &&
    rowData.AREA === "BLACHARNIA"
  ) {
    options.push({ value: "control-bl", label: "KONTROLA BL" });
  }

  // if (roles.includes(150) && !rowData.DATA_PRZEKAZANIA_SPRAWY_DO_KANCELARII) {
  if (roles.includes(150)) {
    options.push({
      value: "law-partner",
      label: "PRZEKAŻ SPRAWĘ DO KANCELARII",
    });
  }

  // 2. Jeśli jest tylko 1 opcja, nie renderujemy nic (zgodnie z Twoją logiką)
  if (options.length <= 1) {
    return null;
  }

  // 3. Sprawdzamy, czy aktualny changePanel jest na liście dostępnych opcji.
  // Jeśli tak -> używamy go. Jeśli nie -> wracamy do domyślnego "doc-actions".
  const selectedValue = options.some((opt) => opt.value === changePanel)
    ? changePanel
    : "doc-actions";

  return (
    <Select
      value={selectedValue ?? ""} // Tutaj przekazujemy bezpieczną wartość
      onChange={(e) => setChangePanel(e.target.value)}
      displayEmpty
      inputProps={{ "aria-label": "Without label" }}
      MenuProps={{
        PaperProps: {
          sx: {
            backgroundColor: "rgb(255, 255, 255)",
            color: "#000",
            borderRadius: "5px",
            border: "1px solid rgba(189, 67, 211, 1)",
            "& .MuiMenuItem-root": {
              justifyContent: "center",
              textAlign: "center",
              "&:hover": {
                backgroundColor: "rgba(189, 67, 211, 0.15)",
              },
              "&.Mui-selected": {
                backgroundColor: "rgba(189, 67, 211, 1) !important",
                color: "#fff",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "rgba(189, 67, 211, 0.35) !important",
              },
            },
          },
        },
      }}
      sx={{
        width: "70%",
        padding: "2px 0",
        fontFamily: "Roboto",
        backgroundColor: "rgb(156, 39, 176)",
        color: "#fff",
        borderRadius: "5px",
        fontSize: "0.9rem",
        fontWeight: 500,
        textAlign: "center",
        "& .MuiSelect-select": {
          color: "#fff",
          padding: "8px 12px",
        },
        "& fieldset": { border: "none" },
      }}
    >
      {/* Generujemy MenuItem na podstawie przygotowanej tablicy options */}
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SelectPanel;
