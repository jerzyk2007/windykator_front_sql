import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import useData from "../hooks/useData";
import "./FKTableSettings.css";

const FKTableSettings = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { pleaseWait, setPleaseWait } = useData();

  const [columns, setColumns] = useState([]);
  //   const [columnsName, setColumnsName] = useState([]);

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
      <section className="fk_table_settings-table__columns" key={index}>
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
              <option value="date-range">Data od - do</option>
              <option value="date">Data</option>
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
      const result = await axiosPrivateIntercept.patch("/fk/change-columns", {
        columns,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // pobiera wszytskie nazwy kolumn z pierwszego dokumnetu w DB danych FK
  const handleGetNewColums = async () => {
    setPleaseWait(true);
    try {
      const documentsColumn = await axiosPrivateIntercept.get(
        "/fk/get-new-columns"
      );
      await createColumns(documentsColumn.data);
      setPleaseWait(false);
    } catch (err) {
      console.log(err);
    }
  };

  //tworzy kolumny na podstawie już zapisanych danych w DB i sprawdza czy są jakies nowe kolumny dzięki handleGetNewColums
  const createColumns = async (columnsData) => {
    try {
      const settingsColumn = await axiosPrivateIntercept.get("/fk/get-columns");
      const newColumns = columnsData.map((colName) => {
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
    } catch (error) {
      console.error("Błąd podczas pobierania kolumn: ", error);
    }
  };

  useEffect(() => {
    handleGetNewColums();
  }, []);

  //   useEffect(() => {
  //     createColumns();
  //   }, [columnsName]);

  return (
    <>
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <section className="fk_table_settings">
          <section className="fk_table_settings-table">
            <section className="fk_table_settings-table--title">
              <h3 className="fk_table_settings-table--name">
                Ustawienia kolumn tabeli{" "}
                <span style={{ color: "red" }}>FK</span>
              </h3>
              <i
                className="fas fa-save fk_table_settings-table--save"
                onClick={handleSaveColumnsSetinngs}
              ></i>
            </section>
            <section className="fk_table_settings-table__container">
              {columnItems}
            </section>
          </section>
          <section className="fk_table_settings-raport">
            {/* <section className="fk_table_settings-table--title">
          <h3 className="fk_table_settings-table--name">
            Ustawienia kolumn raportu
          </h3>
          <i className="fas fa-save fk_table_settings-table--save"></i>
        </section> */}
          </section>
        </section>
      )}
    </>
  );
};

export default FKTableSettings;
