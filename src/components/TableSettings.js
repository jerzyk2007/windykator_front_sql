import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from "./hooks/useData";
import PleaseWait from "./PleaseWait";

import "./TableSettings.css";

const TableSettings = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [columns, setColumns] = useState([]);

  const handleHeaderChange = (index, field, newValue) => {
    setColumns((prevColumns) => {
      const updatedColumns = [...prevColumns];

      updatedColumns[index] = {
        ...updatedColumns[index],
        [field]: newValue,
      };

      return updatedColumns;
    });
  };

  const columnItems = columns.map((col, index) => {
    return (
      <section className="table_settings-table__columns" key={index}>
        <section className="columns-item">
          <span className="columns-item-header">Nazwa w DB:</span>
          <span className="columns-item-choice">{col.accessorKey}</span>
        </section>
        <section className="columns-item">
          <span className="columns-item-header">Podaj swoją nazwę:</span>
          <span className="columns-item-choice">
            <input
              className="item-choice"
              type="text"
              value={col.header}
              onChange={(e) =>
                handleHeaderChange(index, "header", e.target.value)
              }
            />
          </span>
        </section>
        <section className="columns-item">
          <span className="columns-item-header">Wybierz filtr:</span>
          <span className="columns-item-choice">
            <select
              className="item-choice"
              value={col.filterVariant}
              onChange={(e) =>
                handleHeaderChange(index, "filterVariant", e.target.value)
              }
            >
              <option value="none">Brak</option>
              <option value="startsWith">Dokładne wyszukanie</option>
              <option value="text">Zbliżone wyszukanie</option>
              <option value="multi-select">Zaznacz wiele</option>
              <option value="select">Zaznacz jeden</option>
              <option value="range-slider">Suwak do kwot</option>
              <option value="range">Od - do</option>
              <option value="date-range">Data od - do</option>
              {/* <option value="date">Data</option> */}
            </select>
          </span>
        </section>
        <section className="columns-item">
          <span className="columns-item-header">Wybierz typ danych:</span>
          <span className="columns-item-choice">
            <select
              className="item-choice"
              value={col.type}
              onChange={(e) =>
                handleHeaderChange(index, "type", e.target.value)
              }
            >
              <option value="text">tekst</option>
              <option value="money">waluta</option>
            </select>
          </span>
        </section>
      </section>
    );
  });

  const handleSaveColumnsSetinngs = async () => {
    try {
      await axiosPrivateIntercept.patch("/settings/change-columns", {
        columns,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // pobiera wszytskie nazwy kolumn z pierwszego dokumnetu w DB
  const handleGetColums = async () => {
    try {
      setPleaseWait(true);
      // const documentsColumn = await axiosPrivateIntercept.get(
      //   "/documents/get-columns"
      // );
      const documentsColumn = await axiosPrivateIntercept.get(
        `/documents/get-all/${auth._id}/actual`
      );
      const firstDocument = documentsColumn.data[0];

      const keysArray = Object.keys(firstDocument);
      const newArray = keysArray.filter(
        (item) => item !== "_id" && item !== "__v"
      );

      createColumns(newArray);
    } catch (err) {
      console.log(err);
    }
  };

  //tworzy kolumny na podstawie już zapisanych danych w DB i sprawdza czy są jakies nowe kolumny dzięki handleGetColums
  const createColumns = async (columnsName) => {
    try {
      const settingsColumn = await axiosPrivateIntercept.get(
        "/settings/get-columns"
      );
      const newColumns = columnsName.map((colName) => {
        const matchingColumn = settingsColumn.data.find(
          (column) => column.accessorKey === colName
        );

        if (matchingColumn) {
          return {
            accessorKey: matchingColumn.accessorKey,
            header: matchingColumn.header,
            filterVariant: matchingColumn.filterVariant,
            type: matchingColumn.type,
          };
        } else {
          return {
            accessorKey: colName,
            header: colName,
            filterVariant: "contains",
            type: "text",
          };
        }
      });

      setColumns(newColumns);
      setPleaseWait(false);
    } catch (error) {
      console.error("Błąd podczas pobierania kolumn: ", error);
    }
  };

  useEffect(() => {
    handleGetColums();
  }, []);

  // useEffect(() => {
  //   createColumns();
  // }, [columnsName]);

  return (
    <section className="table_settings">
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <>
          <section className="table_settings-table">
            <section className="table_settings-table--title">
              <h3 className="table_settings-table--name">
                Ustawienia kolumn tabeli
              </h3>
              <i
                className="fas fa-save table_settings-table--save"
                onClick={handleSaveColumnsSetinngs}
              ></i>
            </section>
            <section className="table_settings-table__container">
              {columnItems}
            </section>
          </section>
          <section className="table_settings-raport">
            <section className="table_settings-table--title">
              <h3 className="table_settings-table--name">
                Ustawienia kolumn raportu
              </h3>
              <i className="fas fa-save table_settings-table--save"></i>
            </section>
          </section>
        </>
      )}
    </section>
  );
};

export default TableSettings;
