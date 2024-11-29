import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";
import useWindowSize from "../hooks/useWindow";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_PL } from "material-react-table/locales/pl";
import { Box } from "@mui/material";
import PleaseWait from "../PleaseWait";
import {
  columnsAdv,
  grossTotalAdv,
} from "./utilsForRaportTable/prepareDataToRaport";
// import { getAllDataRaport } from "./pliki_do_usuniecia/utilsForTable/excelFilteredTable";
import { getAllDataRaport } from "../table/utilsForTable/excelFilteredTable";

import "./RaportAdvisers.css";

const RaportAdvisers = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();
  const { height } = useWindowSize();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnSizing, setColumnSizing] = useState({});
  const [density, setDensity] = useState("");
  const [columnOrder, setColumnOrder] = useState([]);
  const [columnPinning, setColumnPinning] = useState({});
  const [pagination, setPagination] = useState({});
  const [tableSize, setTableSize] = useState(500);
  const [sorting, setSorting] = useState([
    { id: "DORADCA", desc: false },
    // { id: "DO_ROZLICZENIA", desc: true },
  ]);
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

  const checkMinMaxDateGlobal = (documents) => {
    let maxDate = documents[0].DATA_FV;
    let minDate = documents[0].DATA_FV;

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
    columns: columnsAdv,
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
    // automatycznie pobiera dane dla select i multi- select
    enableFacetedValues: true,
    initialState: {
      density: "compact",
    },
    state: {
      columnVisibility,
      density,
      columnOrder,
      columnPinning,
      columnSizing,
      pagination,
      sorting,
    },

    defaultColumn: {
      maxSize: 400,
      minSize: 100,
    },
    // wyłącza wszytskie ikonki nad tabelą
    // enableToolbarInternalActions: false,

    muiTableHeadCellProps: () => ({
      align: "left",
      sx: {
        fontWeight: "700",
        fontSize: "14px",
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
          whiteSpace: "wrap",
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
        // borderRight: "1px solid #c9c7c7",
        borderRight: "1px solid #000",
        borderBottom: "1px solid #000",
        fontSize: "14px",
        fontWeight: "bold",
        padding: "2px",
        minHeight: "3rem",
      },
    }),
    muiTableContainerProps: { sx: { maxHeight: tableSize } },
    columnFilterDisplayMode: "popover",

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
          <section className="raport_advisers-date">
            <section className="raport_advisers-date__title">
              <h3>Wybierz przedział dat dla raportu</h3>
            </section>
            <section className="raport_advisers-date__content">
              <h3 className="raport_advisers-date__content-name">od: </h3>
              <input
                className="raport_advisers-date-select"
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
              <h3 className="raport_advisers-date__content-name">do: </h3>

              <input
                className="raport_advisers-date-select"
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
          <section className="raport_advisers-panel">
            <i
              className="fa-regular fa-file-excel raport_advisers-export-excel"
              onClick={() =>
                handleExportExcel(
                  table.getPrePaginationRowModel().rows,
                  "Doradca"
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
    const raportAdvisers = {
      size: { ...columnSizing },
      visible: { ...columnVisibility },
      density,
      order: columnOrder,
      pinning: columnPinning,
      pagination,
    };
    try {
      await axiosPrivateIntercept.patch(
        `/user/save-raport-advisers-settings/${auth.id_user}`,
        { raportAdvisers }
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

    if (type === "Doradca" && rowData.length > 0) {
      arrayOrder = [...columnOrder];

      // rowData = [...data];
    } else if (type === "Filtr") {
      arrayOrder = columnOrder.filter(
        (item) => columnVisibility[item] !== false
      );
    }

    let newColumns = [];
    if (type === "Doradca") {
      newColumns = columnsAdv
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

    const update = updateData.map((item) => {
      const CEL_BEZ_PZU_LINK4 = Number(item.CEL_BEZ_PZU_LINK4).toLocaleString(
        "pl-PL",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      );
      // const CEL_BEZ_KANCELARII = Number(item.CEL_BEZ_KANCELARII).toLocaleString(
      //   "pl-PL",
      //   { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      // );
      // const CEL_CALOSC = Number(item.CEL_CALOSC).toLocaleString("pl-PL", {
      //   minimumFractionDigits: 2,
      //   maximumFractionDigits: 2,
      // });

      const ILE_BLEDOW_DORADCY_I_DOKUMENTACJI = Number(
        item.ILE_BLEDOW_DORADCY_I_DOKUMENTACJI
      ).toFixed(0);

      const ILE_NIEPOBRANYCH_VAT = Number(item.ILE_NIEPOBRANYCH_VAT).toFixed(0);

      const ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4 = Number(
        item.ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4
      ).toFixed(0);

      return {
        ...item,
        CEL_BEZ_PZU_LINK4: String(`${CEL_BEZ_PZU_LINK4} %`),
        ILE_BLEDOW_DORADCY_I_DOKUMENTACJI,
        ILE_NIEPOBRANYCH_VAT,
        ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4,
      };
    });

    const orderColumns = {
      columns: newColumns,
      order: newOrder,
    };
    getAllDataRaport(update, orderColumns, type);
  };

  useEffect(() => {
    const createDataRaport = () => {
      if (permission === "Standard") {
        let uniqueAdvisersAndDepartments = [];
        raportData.forEach((item) => {
          if (
            item.DORADCA &&
            typeof item.DORADCA === "string" &&
            item.DZIAL &&
            typeof item.DZIAL === "string"
          ) {
            const addUniqueAdvisersAndDepartments = {
              merge: `${item.DORADCA}-${item.DZIAL}`,
              adviser: item.DORADCA,
              department: item.DZIAL,
            };
            const isObjectExists = uniqueAdvisersAndDepartments.some(
              (item) =>
                JSON.stringify(item) ===
                JSON.stringify(addUniqueAdvisersAndDepartments)
            );
            if (!isObjectExists) {
              uniqueAdvisersAndDepartments.push(
                addUniqueAdvisersAndDepartments
              );
            }
          }
        });
        const sortedData = [...uniqueAdvisersAndDepartments].sort((a, b) => {
          const adviserA = a.adviser.toLowerCase();
          const adviserB = b.adviser.toLowerCase();
          if (adviserA < adviserB) return -1;
          if (adviserA > adviserB) return 1;
          return 0;
        });
        setDepartments(sortedData);
      } else if (permission === "Basic") {
        let uniqueAdvisersAndDepartments = [];
        raportData.forEach((item) => {
          if (
            item.DORADCA &&
            typeof item.DORADCA === "string" &&
            item.DZIAL &&
            typeof item.DZIAL === "string"
          ) {
            const addUniqueAdvisersAndDepartments = {
              merge: `${item.DORADCA}-${item.DZIAL}`,
              adviser: item.DORADCA,
              department: item.DZIAL,
            };
            const isObjectExists = uniqueAdvisersAndDepartments.some(
              (item) =>
                JSON.stringify(item) ===
                JSON.stringify(addUniqueAdvisersAndDepartments)
            );
            if (!isObjectExists) {
              uniqueAdvisersAndDepartments.push(
                addUniqueAdvisersAndDepartments
              );
            }
          }
        });

        setDepartments(uniqueAdvisersAndDepartments);
      }
    };
    createDataRaport();
  }, [raportData, permission, raportDate]);

  useEffect(() => {
    const update = grossTotalAdv(departments, raportData, raportDate);
    setRaport(update);
  }, [departments]);

  useEffect(() => {
    const getData = async () => {
      try {
        setPleaseWait(true);
        const resultData = await axiosPrivateIntercept.get(
          `/raport/get-data/${auth.id_user}`
        );
        if (resultData.data.data.length === 0) {
          setPleaseWait(false);
          return;
        }
        setRaportData(resultData.data.data);
        setPermission(resultData.data.permission);
        checkMinMaxDateGlobal(resultData.data.data);

        const [settingsRaportUserAdvisers] = await Promise.all([
          axiosPrivateIntercept.get(
            `/user/get-raport-advisers-settings/${auth.id_user}`
          ),
        ]);

        setColumnVisibility(settingsRaportUserAdvisers?.data?.visible || {});
        setColumnSizing(settingsRaportUserAdvisers?.data?.size || {});
        setDensity(settingsRaportUserAdvisers?.data?.density || "comfortable");
        setColumnOrder(
          settingsRaportUserAdvisers?.data?.order?.map((order) => order) || []
        );
        setColumnPinning(
          settingsRaportUserAdvisers?.data?.pinning || { left: [], right: [] }
        );
        setPagination(
          settingsRaportUserAdvisers?.data?.pagination || {
            pageIndex: 0,
            pageSize: 20,
          }
        );
        setPleaseWait(false);
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  }, [auth.id_user, axiosPrivateIntercept, setPleaseWait]);

  useEffect(() => {
    setTableSize(height - 151);
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

  return (
    <section className="raport_advisers">
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <MaterialReactTable className="raport_advisers-table" table={table} />
      )}
    </section>
  );
};

export default RaportAdvisers;
