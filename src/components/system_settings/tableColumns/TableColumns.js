import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import PleaseWait from "../../PleaseWait";

import "./TableColumns.css";

const TableColumns = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [pleaseWait, setPleaseWait] = useState(false);

  const [newData, setNewData] = useState(false);
  const [editData, setEditData] = useState({});
  const [deleteCol, setDeleteCol] = useState(false);
  const [checkSave, setCheckSave] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  const [employeeData, setEmployeeData] = useState({});
  const [permissions, setPermissions] = useState({
    type: [],
    select: "Pracownik",
  });

  const filterName = {
    none: "Brak",
    startsWith: "Dokładne wyszukanie",
    text: "Zbliżone wyszukanie",
    "multi-select": "Zaznacz wiele",
    select: "Zaznacz jeden",
    range: "Od - do",
    "date-range": "Data od - do",
    contains: "Zawiera",
  };

  const typeData = {
    text: "tekst",
    money: "waluta",
  };

  const changeSingleColumn = async (type) => {
    try {
      if (type === "edit") {
        await axiosPrivateIntercept.patch("/table/change-table-columns", {
          type,
          permission: permissions.select,
          data: editData,
        });
        const changeData = employeeData[permissions.select]?.columns?.map(
          (item) => {
            if (item.id_table_columns === editData.id_table_columns) {
              return editData;
            }
            return item;
          }
        );
        employeeData[permissions.select].columns = changeData;

        const sorted = sortColumns({
          permissions: permissions.type,
          employees: employeeData,
        });
        setEmployeeData(sorted.employees);
        setEditData({});
      } else if (type === "new") {
        await axiosPrivateIntercept.patch("/table/change-table-columns", {
          type,
          permission: permissions.select,
          data: editData,
        });

        setNewData(false);
        setEditData({});

        await handleGetData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddRow = () => {
    const clearAreas = employeeData[permissions.select]?.areas.map((item) => {
      return {
        name: item,
        available: false,
      };
    });
    const clearData = {
      accessorKey: "",
      header: "",
      filterVariant: "none",
      type: "text",
      areas: clearAreas,
      employee: permissions?.select || "",
    };
    setNewData(true);
    setEditData(clearData);
    setEmployeeData((prev) => ({
      ...prev,
      [permissions.select]: {
        ...prev[permissions.select],
        columns: [clearData, ...(prev[permissions.select]?.columns || [])],
        areas: prev[permissions.select]?.areas || [],
      },
    }));
  };

  const handleDelete = async (index) => {
    await axiosPrivateIntercept.delete(
      `/table/delete-table-columns/${index}/${permissions.select}`
    );
    const deleteCol = employeeData[permissions.select].columns
      .map((item) => {
        if (item.id_table_columns !== index) {
          return item;
        }
      })
      .filter(Boolean);
    employeeData[permissions.select].columns = deleteCol;
    setEditData({});
    setDeleteCol(false);
  };

  // zaznacza lub odznacza wszytskie dostępy
  const handleChangeChecked = (type) => {
    const checked = editData?.areas.map((area) => {
      return {
        name: area.name,
        available: type,
      };
    });
    setEditData((prev) => {
      return {
        ...prev,
        areas: checked,
      };
    });
  };
  const handelCancel = () => {
    if (newData) {
      employeeData[permissions.select].columns = employeeData[
        permissions.select
      ].columns
        .map((item) => {
          if (item.id_table_columns) {
            return item;
          }
        })
        .filter(Boolean);
    }
    setEditData({});
    setNewData(false);
  };

  // zmienia pojedyńczy dostęp
  const changeArea = (areaName) => {
    const checked = editData?.areas.map((area) => {
      if (area.name === areaName.name) {
        return {
          name: area.name,
          available: !area.available,
        };
      } else {
        return area;
      }
    });
    setEditData((prev) => {
      return {
        ...prev,
        areas: checked,
      };
    });
  };

  const createArea = (nameDB, colIndex) =>
    Object.keys(editData).length && editData.id_table_columns === colIndex
      ? editData?.areas?.map((area, index) => (
          // <section className="table_column__areas--item" key={index}>
          //   <span className="table_column__areas--name">{area.name}</span>
          //   <section className="table_column__areas--available">
          //     <span>Dostęp:</span>
          //     <input
          //       className={
          //         editData.id_table_columns === colIndex
          //           ? "table_column__areas--check"
          //           : "table_column__areas--check-disabled"
          //       }
          //       type="checkbox"
          //       checked={area.available}
          //       onChange={() => changeArea(area)}
          //     />
          //   </section>
          // </section>
          <section className="table_column__areas--item" key={index}>
            <span className="table_column__areas--name">{area.name}</span>
            <section className="table_column__areas--available">
              <input
                className={
                  editData.id_table_columns === colIndex
                    ? "table_column__areas--check"
                    : "table_column__areas--check-disabled"
                }
                type="checkbox"
                checked={area.available}
                onChange={
                  editData.id_table_columns === colIndex
                    ? () => changeArea(area)
                    : () => {}
                }
                disabled={editData.id_table_columns !== colIndex} // nowoczesne wyłączenie
              />
            </section>
          </section>
        ))
      : nameDB.areas.map((area, index) => (
          <section className="table_column__areas--item" key={index}>
            <span className="table_column__areas--name">{area.name}</span>
            <section className="table_column__areas--available">
              <span>Dostęp:</span>
              <input
                className={
                  editData.id_table_columns === colIndex
                    ? "table_column__areas--check"
                    : "table_column__areas--check-disabled"
                }
                type="checkbox"
                checked={area.available}
                onChange={() => {}}
              />
            </section>
          </section>
        ));

  const columnItems = employeeData[permissions.select]?.columns?.map(
    (col, index) => {
      if (
        Object.keys(editData).length &&
        editData.id_table_columns === col.id_table_columns
      ) {
        return (
          // <section
          //   style={{ border: "4px solid #0035c7ff" }}
          //   className="table_column__wrapper "
          //   key={index}
          // >
          <section
            className="table_column__wrapper table_column__wrapper--active"
            style={{
              borderColor: "#2c7ba8",
              boxShadow: "0 0 0 3px rgba(44, 123, 168, 0.2)",
            }}
            key={index}
          >
            <section className="table_column__columns">
              <section className="table_column__columns-item">
                <section className="table_column__columns-item-header">
                  <span>Nazwa w DB:</span>
                </section>

                <span className="table_column__columns-item-choice">
                  <input
                    style={!duplicate ? { color: "black" } : { color: "red" }}
                    className="table_column__columns-item-choice--text"
                    type="text"
                    value={editData.accessorKey}
                    onChange={(e) =>
                      setEditData((prev) => {
                        return {
                          ...prev,
                          accessorKey: e.target.value,
                        };
                      })
                    }
                  />
                </span>
              </section>
              <section className="table_column__columns-item">
                <span className="table_column__columns-item-header">
                  Podaj swoją nazwę:
                </span>
                <span className="table_column__columns-item-choice">
                  <input
                    className="table_column__columns-item-choice--text"
                    style={!duplicate ? { color: "black" } : { color: "red" }}
                    type="text"
                    value={editData.header}
                    onChange={(e) =>
                      setEditData((prev) => {
                        return {
                          ...prev,
                          header: e.target.value,
                        };
                      })
                    }
                  />
                </span>
              </section>
              <section className="table_column__columns-item">
                <span className="table_column__columns-item-header">
                  Wybierz filtr:
                </span>
                <span className="table_column__columns-item-choice">
                  <select
                    className="table_column__columns-item-choice--select"
                    style={!duplicate ? { color: "black" } : { color: "red" }}
                    value={editData.filterVariant}
                    onChange={(e) =>
                      setEditData((prev) => {
                        return {
                          ...prev,
                          filterVariant: e.target.value,
                        };
                      })
                    }
                  >
                    <option value="none">Brak</option>
                    <option value="startsWith">Dokładne wyszukanie</option>
                    <option value="text">Zbliżone wyszukanie</option>
                    <option value="multi-select">Zaznacz wiele</option>
                    <option value="select">Zaznacz jeden</option>
                    <option value="range">Od - do</option>
                    <option value="date-range">Data od - do</option>
                  </select>
                </span>
              </section>
              <section className="table_column__columns-item">
                <span className="table_column__columns-item-header">
                  Wybierz typ danych:
                </span>
                <span className="table_column__columns-item-choice">
                  <select
                    className="table_column__columns-item-choice--select"
                    style={!duplicate ? { color: "black" } : { color: "red" }}
                    value={editData.type}
                    onChange={(e) =>
                      setEditData((prev) => {
                        return {
                          ...prev,
                          type: e.target.value,
                        };
                      })
                    }
                  >
                    <option value="text">tekst</option>
                    <option value="money">waluta</option>
                  </select>
                </span>
              </section>
            </section>
            <section className="table_column__areas__container">
              <section className="table_column__areas--wrapper">
                <section className="table_column__areas--available">
                  <Button
                    variant="contained"
                    // onClick={() => handleChangeChecked(col, "all", "available")}
                    onClick={() => handleChangeChecked(true)}
                    size="small"
                    color="success"
                  >
                    Zaznacz
                  </Button>
                  <Button
                    style={{ backgroundColor: "white" }}
                    variant="outlined"
                    onClick={() =>
                      // handleChangeChecked(col, "null", "available")
                      handleChangeChecked(false)
                    }
                    size="small"
                    color="success"
                  >
                    Odznacz
                  </Button>
                </section>
              </section>
              <section className="table_column__areas">
                {createArea(col, col.id_table_columns)}
              </section>
              {!deleteCol ? (
                <section className="table_column__panel">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handelCancel}
                  >
                    Anuluj
                  </Button>

                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => changeSingleColumn(newData ? "new" : "edit")}
                    disabled={checkSave}
                  >
                    Zapisz zmiany
                  </Button>
                  {!newData && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setDeleteCol(true)}
                    >
                      Usuń
                    </Button>
                  )}
                </section>
              ) : (
                <section className="table_column__panel">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(col.id_table_columns)}
                  >
                    Potwierdź usunięcie
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setDeleteCol(false)}
                  >
                    Anuluj
                  </Button>
                </section>
              )}
            </section>
          </section>
        );
      } else {
        return (
          <section
            className="table_column__wrapper"
            key={index}
            onDoubleClick={() => {
              if (Object.keys(editData).length === 0) {
                setEditData(col);
              }
            }}
          >
            <section className="table_column__columns">
              <section className="table_column__columns-item">
                <span className="table_column__columns-item-header">
                  Nazwa kolumny:
                </span>
                <span className="table_column__columns-item-choice">
                  {col.header}
                </span>
              </section>
              <section className="table_column__columns-item">
                <span className="table_column__columns-item-header">
                  Wybierz filtr:
                </span>
                <span className="table_column__columns-item-choice">
                  {filterName[col.filterVariant]}
                </span>
              </section>
              <section className="table_column__columns-item">
                <span className="table_column__columns-item-header">
                  Wybierz typ danych:
                </span>
                <span className="table_column__columns-item-choice">
                  {typeData[col.type]}
                </span>
              </section>
            </section>
            <section className="table_column__areas__container">
              <section className="table_column__areas">
                {createArea(col, col.id_table_columns)}
              </section>
            </section>
          </section>
        );
      }
    }
  );

  const sortColumns = (data) => {
    for (const permssion of data.permissions) {
      data.employees[permssion].columns = data.employees[
        permssion
      ].columns.sort((a, b) => a.header.localeCompare(b.header));
      data.employees[permssion].areas.sort();
    }
    return data;
  };
  // pobiera wszytskie nazwy kolumn z pierwszego dokumnetu w DB
  const handleGetData = async () => {
    try {
      setPleaseWait(true);
      const settingsColumn = await axiosPrivateIntercept.get(
        "/table/get-table-columns"
      );
      const matchData = {
        permissions: settingsColumn?.data?.permissions || [],
        employees: {},
      };

      settingsColumn?.data?.permissions?.forEach((item) => {
        const updatedColumns =
          settingsColumn?.data?.employees?.[item]?.columns?.map((col) => {
            // 1️⃣ Sprawdź brakujące obszary
            const allAreas =
              settingsColumn?.data?.employees?.[item]?.areas || [];
            const existingAreas = col.areas || [];

            const nonMatchingAreas = allAreas.filter(
              (areaItem) =>
                !existingAreas.some((area) => area.name === areaItem)
            );

            // 2️⃣ Dodaj brakujące obszary
            const newAreas = [
              ...existingAreas,
              ...nonMatchingAreas.map((areaItem) => ({
                name: areaItem,
                available: false,
              })),
            ];

            // 3️⃣ Usuń nadmiarowe obszary
            const filteredAreas = newAreas.filter((area) =>
              allAreas.includes(area.name)
            );

            // 4️⃣ Zwróć zaktualizowany obiekt kolumny
            return { ...col, areas: filteredAreas };
          }) || [];

        // 5️⃣ Zbuduj strukturę employees z zaktualizowanymi kolumnami
        matchData.employees[item] = {
          ...settingsColumn.data.employees[item],
          columns: updatedColumns,
        };
      });

      const sorted = sortColumns(matchData);

      setPermissions((prev) => {
        return {
          ...prev,
          type: sorted.permissions || [],
        };
      });
      setEmployeeData(sorted.employees);

      setPleaseWait(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    const normalize = (val) => val?.trim().toLowerCase() ?? "";

    const hasDuplicate = employeeData[permissions.select]?.columns?.some(
      (item) => {
        const sameAccessor =
          normalize(item?.accessorKey) === normalize(editData?.accessorKey);
        const sameHeader =
          normalize(item?.header) === normalize(editData?.header);

        // jeśli editData ma id_table_columns — wykluczamy ten sam rekord
        if (editData?.id_table_columns) {
          return (
            item?.id_table_columns !== editData.id_table_columns &&
            (sameAccessor || sameHeader)
          );
        }

        // jeśli id_table_columns nie ma — sprawdzamy tylko po kluczach
        return sameAccessor || sameHeader;
      }
    );

    // ✅ ustawienie duplikatu raz, na podstawie wyniku
    setDuplicate(hasDuplicate);

    // ✅ logika sprawdzania pól i duplikatu
    if (
      Object.keys(editData).length &&
      editData.header?.trim() &&
      editData.accessorKey?.trim() &&
      !hasDuplicate
    ) {
      setCheckSave(false);
    } else {
      setCheckSave(true);
    }
  }, [editData]);

  return (
    <section className="table_columns">
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <>
          <section className="table_columns--title">
            <section className="table_columns--select">
              <select
                style={!permissions.select ? { background: "#e2d628" } : null}
                value={permissions.select}
                onChange={(e) =>
                  setPermissions((prev) => {
                    return {
                      ...prev,
                      select: e.target.value,
                    };
                  })
                }
                disabled={newData}
              >
                <option value="" disabled hidden>
                  Wybierz:
                </option>
                {permissions?.type?.map((option, index) => {
                  return (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            </section>
            <h3 className="table_columns--name">Ustawienia kolumn tabeli</h3>
            <section className="table_columns--change">
              {permissions?.select && (
                <i
                  style={
                    Object.keys(editData).length
                      ? { color: "transparent" }
                      : null
                  }
                  className="fas fa-plus table_columns--save"
                  onClick={!newData ? handleAddRow : null}
                  disabled
                ></i>
              )}
              {/* {permissions?.select && (
                <i
                  className="fas fa-save table_columns--save"
                  onClick={handleSaveColumnsSetinngs}
                ></i>
              )} */}
            </section>
          </section>
          <section className="table_columns__container">{columnItems}</section>
        </>
      )}
    </section>
  );
};

export default TableColumns;
