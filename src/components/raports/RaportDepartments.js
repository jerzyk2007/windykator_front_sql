import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";
import useWindowSize from "../hooks/useWindow";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_PL } from "material-react-table/locales/pl";
import { Box, Button } from "@mui/material";
import PleaseWait from "../PleaseWait";
import {
  grossTotalDepartments,
  columnsDepartments,
  columnsAdv,
  grossTotalAdv,
} from "./utilsForRaportTable/prepareDataToRaport";
import { dataRaport } from "../table/utilsForTable/excelFilteredTable";
import { commonTableHeadCellProps } from "../table/utilsForTable/tableFunctions";

import "./RaportDepartments.css";

const RaportDepartments = ({ profile, reportType }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();
  const { height } = useWindowSize();

  // --- STANY ---
  const [pleaseWait, setPleaseWait] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnSizing, setColumnSizing] = useState({});
  const [density, setDensity] = useState("");
  const [columnOrder, setColumnOrder] = useState([]);
  const [columnPinning, setColumnPinning] = useState({});
  const [pagination, setPagination] = useState({});
  const [tableSize, setTableSize] = useState(500);
  const [sorting, setSorting] = useState(
    reportType === "departments"
      ? [{ id: "DZIALY", desc: false }]
      : reportType === "advisers"
      ? [{ id: "DORADCA", desc: false }]
      : []
  );
  const [raportData, setRaportData] = useState([]);
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

  // --- KONFIGURACJA ZALEŻNA OD TYPU ---
  const isDep = reportType === "departments";
  const currentColumns = isDep ? columnsDep : columnsAdv;
  const excelTitle = isDep ? "Raport Działy" : "Raport Doradca";

  // --- FUNKCJE POMOCNICZE ---
  const checkMinMaxDateGlobal = (documents) => {
    if (!documents.length) return;
    let maxDate = documents[0].DATA_FV;
    let minDate = documents[0].DATA_FV;

    documents.forEach((obj) => {
      if (obj.DATA_FV > maxDate) maxDate = obj.DATA_FV;
      if (obj.DATA_FV < minDate) minDate = obj.DATA_FV;
    });

    setMinMaxDateGlobal({ minGlobalDate: minDate, maxGlobalDate: maxDate });
    setRaportDate({ minRaportDate: minDate, maxRaportDate: maxDate });
  };

  const handleSaveSettings = async () => {
    const settingsObj = {
      size: { ...columnSizing },
      visible: { ...columnVisibility },
      density,
      order: columnOrder,
      pinning: columnPinning,
      pagination,
    };

    const endpoint = isDep ? "departments" : "advisers";
    const payload = isDep
      ? { raportDepartments: settingsObj }
      : { raportAdvisers: settingsObj };

    try {
      await axiosPrivateIntercept.patch(
        `/user/save-raport-${endpoint}-settings/${auth.id_user}`,
        payload
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportExcel = (data, type) => {
    const rowData = data.map((item) => item.original);
    let arrayOrder = [];

    if (type === excelTitle && rowData.length > 0) {
      arrayOrder = [...columnOrder];
    } else if (type === "Filtr") {
      arrayOrder = columnOrder.filter(
        (item) => columnVisibility[item] !== false
      );
    }

    let newColumns = [];
    if (type === excelTitle) {
      newColumns = currentColumns
        .map((item) => {
          const matching = arrayOrder.find(
            (match) => match === item.accessorKey
          );
          return matching
            ? { accessorKey: item.accessorKey, header: item.header }
            : null;
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
      const filteredKeys = Object.keys(item).filter((key) =>
        arrayOrder.includes(key)
      );
      return filteredKeys.reduce((obj, key) => {
        obj[key] = item[key];
        return obj;
      }, {});
    });

    const update = updateData.map((item) => {
      const formatNum = (val) =>
        Number(val).toLocaleString("pl-PL", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

      const baseUpdates = {
        ...item,
        CEL_BEZ_PZU_LINK4: String(`${formatNum(item.CEL_BEZ_PZU_LINK4)} %`),
        ILE_BLEDOW_DORADCY_I_DOKUMENTACJI: Number(
          item.ILE_BLEDOW_DORADCY_I_DOKUMENTACJI
        ).toFixed(0),
        ILE_NIEPOBRANYCH_VAT: Number(item.ILE_NIEPOBRANYCH_VAT).toFixed(0),
        ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4: Number(
          item.ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4
        ).toFixed(0),
      };

      if (isDep) {
        return {
          ...baseUpdates,
          CEL:
            item.DZIALY === "Całość"
              ? ""
              : item.CEL
              ? `${item.CEL} %`
              : "Brak %",
          CEL_BEZ_KANCELARII: String(`${formatNum(item.CEL_BEZ_KANCELARII)} %`),
          CEL_CALOSC: String(`${formatNum(item.CEL_CALOSC)} %`),
          ILOSC_PRZETERMINOWANYCH_FV: Number(
            item.ILOSC_PRZETERMINOWANYCH_FV
          ).toFixed(0),
          ILOSC_PRZETERMINOWANYCH_FV_BEZ_KANCELARII: Number(
            item.ILOSC_PRZETERMINOWANYCH_FV_BEZ_KANCELARII
          ).toFixed(0),
        };
      }
      return baseUpdates;
    });

    dataRaport(update, { columns: newColumns, order: newOrder }, type);
  };

  // --- MATERIAL REACT TABLE CONFIG ---
  const table = useMaterialReactTable({
    columns: currentColumns,
    data: raport,
    enableStickyHeader: true,
    enableGlobalFilter: false,
    enableGlobalFilterModes: false,
    enableColumnFilters: true,
    enableColumnPinning: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableDensityToggle: false,
    enableColumnActions: false,
    enablePagination: true,
    enableSorting: true,
    localization: MRT_Localization_PL,
    onColumnVisibilityChange: setColumnVisibility,
    onDensityChange: setDensity,
    onColumnSizingChange: setColumnSizing,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableFacetedValues: true,
    columnFilterDisplayMode: "popover",
    initialState: { density: "compact" },
    state: {
      columnVisibility,
      density,
      columnOrder,
      columnPinning,
      columnSizing,
      pagination,
      sorting,
    },
    defaultColumn: { maxSize: 400, minSize: 100 },
    // muiTableHeadCellProps: () => ({
    //   // align: "left",
    //   // sx: {
    //   //   fontWeight: "500",
    //   //   fontFamily: "'Source Sans 3', Calibri, sans-serif",
    //   //   fontSize: ".9rem",
    //   //   color: "black",
    //   //   background: "rgba(233, 245, 255, 1)",
    //   //   borderRight: "1px solid #eeededff",
    //   //   minHeight: "2rem",
    //   //   display: "flex",
    //   //   justifyContent: "center",
    //   //   alignItems: "center",
    //   //   "& .Mui-TableHeadCell-Content": {
    //   //     display: "flex",
    //   //     alignItems: "center",
    //   //     justifyContent: "center",
    //   //     textAlign: "center",
    //   //     textWrap: "balance",
    //   //   },
    //   //   "& .Mui-TableHeadCell-Content-Labels": { padding: 0 },
    //   //   "& .Mui-TableHeadCell-Content-Actions": { display: "none" },
    //   //   "& .Mui-TableHeadCell-ResizeHandle-Wrapper": {
    //   //     borderWidth: "1px",
    //   //     background: "none",
    //   //     marginRight: "-9px",
    //   //     borderColor: "rgba(75, 75, 75, .1)",
    //   //   },
    //   // },
    //   align: "left",
    //   sx: {
    //     fontWeight: "600",
    //     fontFamily: "'Source Sans 3', Calibri, sans-serif",
    //     fontSize: ".9rem",
    //     color: "black",
    //     background: "rgba(233, 245, 255, 1)",
    //     borderRight: "1px solid #eeededff",
    //     minHeight: "3rem",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     "& .Mui-TableHeadCell-Content": {
    //       display: "flex",
    //       alignItems: "center",
    //       justifyContent: "center",
    //       textAlign: "center",
    //       textWrap: "balance",
    //     },
    //     "& .Mui-TableHeadCell-Content-Labels": { padding: 0 },
    //     "& .Mui-TableHeadCell-Content-Actions": { display: "none" },
    //     "& .Mui-TableHeadCell-ResizeHandle-Wrapper": {
    //       borderWidth: "1px",
    //       background: "none",
    //       marginRight: "-9px",
    //       borderColor: "rgba(75, 75, 75, .1)",
    //     },
    //   },
    // }),
    // muiTableHeadCellProps: () => ({
    //   sx: {
    //     "& .Mui-TableHeadCell-ResizeHandle-Wrapper": {
    //       borderWidth: "1px",
    //       background: "none",
    //       marginRight: "-19px",
    //       borderColor: "rgba(75, 75, 75, .1)",
    //     },
    //   },
    // }),
    // muiTableHeadCellProps: commonTableHeadCellProps,

    muiTableHeadCellProps: {
      ...commonTableHeadCellProps, // 1. Kopiujemy align, fonty, tło itp.
      sx: {
        ...commonTableHeadCellProps.sx, // 2. Kopiujemy wszystkie istniejące style sx
        "& .Mui-TableHeadCell-ResizeHandle-Wrapper": {
          // 3. Nadpisujemy konkretny element
          borderWidth: "2px",
          // background: "none",
          marginRight: "-18px", // Twoja nowa wartość
          borderColor: "rgba(77, 76, 76, 0.1)",
        },
      },
    },
    muiTableBodyCellProps: () => ({
      // className: "raport_departments-cell",
      className: "mrt-custom-body-cell",
      align: "center",
    }),
    muiTableContainerProps: { sx: { maxHeight: tableSize } },

    renderTopToolbarCustomActions: ({ table }) => {
      const hasData = table.getPrePaginationRowModel().rows.length > 0;

      return (
        <Box className="raport_departments-toolbar">
          <section className="raport_departments-toolbar-date">
            <div className="raport_departments-toolbar-date-title">
              <h3>Wybierz przedział dat</h3>
            </div>
            <div className="raport_departments-toolbar-date-inputs">
              <span className="raport_departments-toolbar-label">od:</span>
              <input
                className={`raport_departments-toolbar-input ${
                  errRaportDate ? "raport_departments-toolbar-input--error" : ""
                }`}
                name="minDate"
                type="date"
                min={minMaxDateGlobal.minGlobalDate}
                max={minMaxDateGlobal.maxGlobalDate}
                value={raportDate.minRaportDate}
                onChange={(e) =>
                  setRaportDate((prev) => ({
                    ...prev,
                    minRaportDate:
                      e.target.value || minMaxDateGlobal.minGlobalDate,
                  }))
                }
              />
              <span className="raport_departments-toolbar-label">do:</span>
              <input
                className={`raport_departments-toolbar-input ${
                  errRaportDate ? "raport_departments-toolbar-input--error" : ""
                }`}
                name="maxDate"
                type="date"
                min={minMaxDateGlobal.minGlobalDate}
                max={minMaxDateGlobal.maxGlobalDate}
                value={raportDate.maxRaportDate}
                onChange={(e) =>
                  setRaportDate((prev) => ({
                    ...prev,
                    maxRaportDate:
                      e.target.value || minMaxDateGlobal.maxGlobalDate,
                  }))
                }
              />
            </div>
          </section>

          <Box className="raport_departments-toolbar-actions">
            <Button
              className="table-action-btn save"
              onClick={handleSaveSettings}
            >
              <i className="fas fa-save"></i>
              <span>Zapisz widok</span>
            </Button>

            <Button
              className={`table-action-btn excel ${!hasData ? "disabled" : ""}`}
              disabled={!hasData}
              onClick={() =>
                handleExportExcel(
                  table.getPrePaginationRowModel().rows,
                  excelTitle
                )
              }
            >
              <i className="fa-regular fa-file-excel"></i>
              <span>Eksport Excel</span>
            </Button>
          </Box>
        </Box>
      );
    },
  });

  // --- EFFECTS ---
  useEffect(() => {
    const createDataRaport = () => {
      let uniqueItems = [];
      if (isDep) {
        raportData.forEach((item) => {
          if (item.DZIAL && typeof item.DZIAL === "string") {
            if (!uniqueItems.includes(item.DZIAL)) uniqueItems.push(item.DZIAL);
          }
        });
      } else {
        raportData.forEach((item) => {
          if (item.DORADCA && item.DZIAL) {
            const entry = {
              merge: `${item.DORADCA}-${item.DZIAL}`,
              adviser: item.DORADCA,
              department: item.DZIAL,
            };
            if (!uniqueItems.some((i) => i.merge === entry.merge))
              uniqueItems.push(entry);
          }
        });
        uniqueItems.sort((a, b) =>
          a.adviser.toLowerCase().localeCompare(b.adviser.toLowerCase())
        );
      }
      setDepartments(uniqueItems);
    };
    createDataRaport();
  }, [raportData, reportType]);

  useEffect(() => {
    const update = isDep
      ? grossTotalDepartments(
          departments,
          raportData,
          raportDate,
          percentTarget
        )
      : grossTotalAdv(departments, raportData, raportDate);
    setRaport(update);
  }, [departments, raportData, raportDate, percentTarget, reportType]);

  useEffect(() => {
    setTableSize(height - 172);
  }, [height]);

  useEffect(() => {
    let minD = new Date(raportDate.minRaportDate);
    let maxD = new Date(raportDate.maxRaportDate);
    errSetRaportDate(minD > maxD || maxD < minD);
  }, [raportDate]);

  useEffect(() => {
    const getData = async () => {
      try {
        setPleaseWait(true);
        const resultData = await axiosPrivateIntercept.get(
          `/raport/get-data/${auth.id_user}/${profile}`
        );

        if (resultData.data.data.length === 0) {
          setPleaseWait(false);
          return;
        }

        if (isDep) {
          const resultDepartments = await axiosPrivateIntercept.get(
            "/settings/get-departments"
          );
          setPercentTarget(resultDepartments.data.target);
          setColumnsDep(
            columnsDepartments.map((item) =>
              item.header === "Cele na kwartał"
                ? {
                    ...item,
                    header: `Cele na ${resultDepartments.data.target.time.Q} kwartał`,
                  }
                : item
            )
          );
        }

        setRaportData(resultData.data.data);
        checkMinMaxDateGlobal(resultData.data.data);

        const endpoint = isDep ? "departments" : "advisers";
        const settings = await axiosPrivateIntercept.get(
          `/user/get-raport-${endpoint}-settings/${auth.id_user}`
        );

        setColumnVisibility(settings?.data?.visible || {});
        setColumnSizing(settings?.data?.size || {});
        setDensity(settings?.data?.density || "comfortable");
        setColumnOrder(settings?.data?.order || []);
        setColumnPinning(settings?.data?.pinning || { left: [], right: [] });
        setPagination(
          settings?.data?.pagination || { pageIndex: 0, pageSize: 20 }
        );
      } catch (err) {
        console.error(err);
      } finally {
        setPleaseWait(false);
      }
    };
    getData();
  }, [auth.id_user, profile, reportType]);

  return (
    <main className="raport_departments">
      {pleaseWait ? <PleaseWait /> : <MaterialReactTable table={table} />}
    </main>
  );
};

export default RaportDepartments;
