import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from "./hooks/useData";
import useWindowSize from "./hooks/useWindow";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_PL } from "material-react-table/locales/pl";
import { Box } from "@mui/material";
import PleaseWait from "./PleaseWait";
import {
  grossTotalDepartments,
  columnsDepartments,
} from "./utilsForRaportTable/prepareDataToRaport";
import { getAllDataRaport } from "./utilsForTable/excelFilteredTable";

import "./RaportDepartments.css";

const RaportDepartments = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();
  const { height } = useWindowSize();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnSizing, setColumnSizing] = useState({});
  const [density, setDensity] = useState("");
  const [columnOrder, setColumnOrder] = useState([]);
  const [columnPinning, setColumnPinning] = useState({});
  const [tableSize, setTableSize] = useState(400);
  const [raportData, setRaportData] = useState([]);
  const [permission, setPermission] = useState("");
  const [departments, setDepartments] = useState([]);
  const [raport, setRaport] = useState([]);
  const [minMaxDateGlobal, setMinMaxDateGlobal] = useState({
    minGlobalDate: "",
    maxGlobalDate: "",
  });
  const [raportDate, setRaportDate] = useState({
    minRaportDate: "",
    maxRaportDate: "",
  });
  const [errRaportDate, errSetRaportDate] = useState(false);
  const [percentTarget, setPercentTarget] = useState({});
  const [columnsDep, setColumnsDep] = useState(columnsDepartments);

  const checkMinMaxDateGlobal = (documents) => {
    let maxDate = documents[0].DATA_FV;
    let minDate = documents[0].DATA_FV;

    // Iteracja przez wszystkie obiekty w tablicy;
    documents.forEach((obj) => {
      // Porównanie daty z aktualnymi maksymalną i minimalną datą
      if (obj.DATA_FV > maxDate) {
        maxDate = obj.DATA_FV;
      }
      if (obj.DATA_FV < minDate) {
        minDate = obj.DATA_FV;
      }
    });
    setMinMaxDateGlobal({
      minGlobalDate: minDate,
      maxGlobalDate: maxDate,
    });
    setRaportDate({
      minRaportDate: minDate,
      maxRaportDate: maxDate,
    });
  };

  const table = useMaterialReactTable({
    columns: columnsDep,
    data: raport,
    enableStickyHeader: true,
    enableGlobalFilter: false,
    enableGlobalFilterModes: false,
    enableColumnFilters: false,
    enableColumnPinning: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableDensityToggle: false,
    enableColumnActions: false,
    enablePagination: false,
    localization: MRT_Localization_PL,
    onColumnVisibilityChange: setColumnVisibility,
    onDensityChange: setDensity,
    onColumnSizingChange: setColumnSizing,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    // opcja wyszukuje zbiory do select i multi-select
    // enableFacetedValues: true,
    // wyświetla filtry nad komórką -
    // columnFilterDisplayMode: "popover",
    initialState: {
      density: "compact",
    },
    state: {
      columnVisibility,
      density,
      columnOrder,
      columnPinning,
      columnSizing,
    },

    defaultColumn: {
      maxSize: 400,
      minSize: 100,
      // size: 160, //default size is usually 180
    },
    // wyłącza wszytskie ikonki nad tabelą
    // enableToolbarInternalActions: false,

    muiTableHeadCellProps: () => ({
      align: "left",
      sx: {
        fontFamily: "Calibri, sans-serif",
        fontWeight: "700",
        fontSize: "16px",
        color: "black",
        backgroundColor: "#a7d3f7",
        padding: "15px",
        paddingTop: "0",
        paddingBottom: "0",
        minHeight: "2rem",
        whiteSpace: "wrap",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid rgba(81, 81, 81, .2)",
        "& .Mui-TableHeadCell-Content": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          textWrap: "balance",
          // whiteSpace: "wrap",
        },
        "& .Mui-TableHeadCell-Content-Wrapper": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          whiteSpace: "wrap",
        },
        "& .Mui-TableHeadCell-Content-Actions": {
          display: "none",
        },
      },
    }),

    muiTableBodyCellProps: ({ column, cell }) => ({
      align: "center",
      sx: {
        borderRight: "1px solid #000",
        borderBottom: "1px solid #000",
        fontSize: "14px",
        fontWeight: "bold",
        padding: "2px",
        minHeight: "3rem",
      },
    }),

    muiTableContainerProps: { sx: { maxHeight: tableSize } },

    renderTopToolbarCustomActions: ({ table }) => {
      return (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0px",
            margin: "auto 0",
            flexWrap: "wrap",
          }}
        >
          <section className="raport_departments-date">
            <section className="raport_departments-date__title">
              <h3>Wybierz przedział dat dla raportu</h3>
            </section>
            <section className="raport_departments-date__content">
              <h3 className="raport_departments-date__content-name">od: </h3>
              <input
                className="raport_departments-date-select"
                style={errRaportDate ? { backgroundColor: "red" } : null}
                name="minDate"
                type="date"
                min={minMaxDateGlobal.minGlobalDate}
                max={minMaxDateGlobal.maxGlobalDate}
                value={raportDate.minRaportDate}
                onChange={(e) =>
                  setRaportDate((prev) => {
                    return {
                      ...prev,
                      minRaportDate: e.target.value
                        ? e.target.value
                        : minMaxDateGlobal.minGlobalDate,
                    };
                  })
                }
              />
              <h3 className="raport_departments-date__content-name">do: </h3>

              <input
                className="raport_departments-date-select"
                style={errRaportDate ? { backgroundColor: "red" } : null}
                name="maxDate"
                type="date"
                min={minMaxDateGlobal.minGlobalDate}
                max={minMaxDateGlobal.maxGlobalDate}
                value={raportDate?.maxRaportDate}
                onChange={(e) =>
                  setRaportDate((prev) => {
                    return {
                      ...prev,
                      maxRaportDate: e.target.value
                        ? e.target.value
                        : minMaxDateGlobal.maxGlobalDate,
                    };
                  })
                }
              />
            </section>
          </section>
          <section className="raport_departments-panel">
            <i
              className="fa-regular fa-file-excel raport_departments-export-excel"
              onClick={() =>
                handleExportExcel(
                  table.getPrePaginationRowModel().rows,
                  "Dział"
                )
              }
            ></i>
            <i
              className="fas fa-save raport_departments-save-settings"
              onClick={handleSaveSettings}
            ></i>
          </section>
        </Box>
      );
    },
  });

  const handleSaveSettings = async () => {
    const raportDepartments = {
      size: { ...columnSizing },
      visible: { ...columnVisibility },
      density,
      order: columnOrder,
      pinning: columnPinning,
    };
    try {
      await axiosPrivateIntercept.patch(
        `/user/save-raport-departments-settings/${auth.id_user}`,
        { raportDepartments }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportExcel = (data, type) => {
    const rowData = data.map((item) => {
      return item.original;
    });
    let arrayOrder = [];

    if (type === "Dział" && rowData.length > 0) {
      arrayOrder = [...columnOrder];
      // rowData = [...data];
    } else if (type === "Filtr") {
      arrayOrder = columnOrder.filter(
        (item) => columnVisibility[item] !== false
      );
    }
    let newColumns = [];

    if (type === "Dział") {
      newColumns = columnsDep
        .map((item) => {
          const matching = arrayOrder.find(
            (match) => match === item.accessorKey
          );
          if (matching) {
            return {
              accessorKey: item.accessorKey,
              header: item.header,
            };
          }
        })
        .filter(Boolean);
    }
    const newOrder = arrayOrder.map((key) => {
      const matchedColumn = newColumns.find(
        (column) => column.accessorKey === key
      );
      return matchedColumn ? matchedColumn.header : key;
    });

    const updateData = rowData.map((item) => {
      // Filtracja kluczy obiektu na podstawie arrayOrder
      const filteredKeys = Object.keys(item).filter((key) =>
        arrayOrder.includes(key)
      );
      // Tworzenie nowego obiektu z wybranymi kluczami
      const updatedItem = filteredKeys.reduce((obj, key) => {
        obj[key] = item[key];
        return obj;
      }, {});
      return updatedItem;
    });

    // przerabiam dane aby w excelu wyświetlały sie zgodnie z oczekiwaniem, jeśli liczba jest Number to wyświetlana jest jako waluta, w przypadku String mogę sam ustalić sposób wyświetlania
    const update = updateData.map((item) => {
      const CEL_BEZ_PZU_LINK4 = Number(item.CEL_BEZ_PZU_LINK4).toLocaleString(
        "pl-PL",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      );
      const CEL_BEZ_KANCELARII = Number(item.CEL_BEZ_KANCELARII).toLocaleString(
        "pl-PL",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      );
      const CEL_CALOSC = Number(item.CEL_CALOSC).toLocaleString("pl-PL", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const ILE_BLEDOW_DORADCY_I_DOKUMENTACJI = Number(
        item.ILE_BLEDOW_DORADCY_I_DOKUMENTACJI
      ).toFixed(0);

      const ILE_NIEPOBRANYCH_VAT = Number(item.ILE_NIEPOBRANYCH_VAT).toFixed(0);

      const ILOSC_PRZETERMINOWANYCH_FV = Number(
        item.ILOSC_PRZETERMINOWANYCH_FV
      ).toFixed(0);

      const ILOSC_PRZETERMINOWANYCH_FV_BEZ_KANCELARII = Number(
        item.ILOSC_PRZETERMINOWANYCH_FV_BEZ_KANCELARII
      ).toFixed(0);

      const ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4 = Number(
        item.ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4
      ).toFixed(0);

      return {
        ...item,
        CEL: item.DZIALY !== "Całość" ? String(`${item.CEL} %`) : "",
        CEL_BEZ_PZU_LINK4: String(`${CEL_BEZ_PZU_LINK4} %`),
        CEL_BEZ_KANCELARII: String(`${CEL_BEZ_KANCELARII} %`),
        CEL_CALOSC: String(`${CEL_CALOSC} %`),
        ILE_BLEDOW_DORADCY_I_DOKUMENTACJI,
        ILE_NIEPOBRANYCH_VAT,
        ILOSC_PRZETERMINOWANYCH_FV,
        ILOSC_PRZETERMINOWANYCH_FV_BEZ_KANCELARII,
        ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4,
      };
    });

    const orderColumns = {
      columns: newColumns,
      order: newOrder,
    };

    // getAllDataRaport(updateData, orderColumns, type);
    getAllDataRaport(update, orderColumns, type);
  };

  useEffect(() => {
    const createDataRaport = () => {
      if (permission === "Standard") {
        let uniqueDepartments = [];
        raportData.forEach((item) => {
          if (item.DZIAL && typeof item.DZIAL === "string") {
            if (!uniqueDepartments.includes(item.DZIAL)) {
              uniqueDepartments.push(item.DZIAL);
            }
          }
        });
        setDepartments(uniqueDepartments);
      }
    };
    createDataRaport();
  }, [raportData, permission, raportDate]);

  useEffect(() => {
    const update = grossTotalDepartments(
      departments,
      raportData,
      raportDate,
      percentTarget
    );
    setRaport(update);
  }, [departments]);

  useEffect(() => {
    setTableSize(height - 115);
  }, [height]);

  useEffect(() => {
    let minDate = new Date(raportDate.minRaportDate);
    let maxDate = new Date(raportDate.maxRaportDate);
    if (minDate > maxDate || maxDate < minDate) {
      errSetRaportDate(true);
    } else {
      errSetRaportDate(false);
    }
  }, [raportDate]);

  useEffect(() => {
    const getData = async () => {
      try {
        setPleaseWait(true);
        const resultData = await axiosPrivateIntercept.get(
          `/raport/get-data/${auth.id_user}`
        );

        const resultDepartments = await axiosPrivateIntercept.get(
          "/settings/get-departments"
        );

        setPercentTarget(resultDepartments.data.target);

        const preprareColumnsDep = columnsDepartments.map((item) => {
          if (item.header === "Cele na bez R-K i CNP") {
            return {
              ...item,
              header: `Cele na ${resultDepartments.data.target.time.Q} kwartał bez R-K i CNP`,
            };
          } else return item;
        });
        setColumnsDep(preprareColumnsDep);

        setRaportData(resultData.data.data);
        setPermission(resultData.data.permission);
        checkMinMaxDateGlobal(resultData.data.data);

        const [settingsRaportUserDepartments] = await Promise.all([
          axiosPrivateIntercept.get(
            `/user/get-raport-departments-settings/${auth.id_user}`
          ),
        ]);

        setColumnVisibility(settingsRaportUserDepartments?.data?.visible || {});
        setColumnSizing(settingsRaportUserDepartments?.data?.size || {});
        setDensity(
          settingsRaportUserDepartments?.data?.density || "comfortable"
        );
        setColumnOrder(
          settingsRaportUserDepartments?.data?.order?.map((order) => order) ||
            []
        );
        setColumnPinning(
          settingsRaportUserDepartments?.data?.pinning || {
            left: [],
            right: [],
          }
        );

        setPleaseWait(false);
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  }, [auth.id_user, axiosPrivateIntercept, setPleaseWait]);

  return (
    <section className="raport_departments">
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <MaterialReactTable
          className="raport_departments-table"
          table={table}
        />
      )}
    </section>
  );
};

export default RaportDepartments;
