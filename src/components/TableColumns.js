import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import PleaseWait from "./PleaseWait";

import "./TableColumns.css";

const TableColumns = () => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();
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
            <section className="table_columns-table__columns" key={index}>
                <section className="table_columns-table__columns-item">
                    <span className="table_columns-table__columns-item-header">
                        Nazwa w DB:
                    </span>
                    <span
                        className="table_columns-table__columns-item-choice"
                        style={{ color: "black" }}
                    >
                        {col.accessorKey}
                    </span>
                </section>
                <section className="table_columns-table__columns-item">
                    <span className="table_columns-table__columns-item-header">
                        Podaj swoją nazwę:
                    </span>
                    <span className="table_columns-table__columns-item-choice">
                        <input
                            className="table_columns-table__columns-item-choice--select"
                            type="text"
                            value={col.header}
                            onChange={(e) =>
                                handleHeaderChange(index, "header", e.target.value)
                            }
                        />
                    </span>
                </section>
                <section className="table_columns-table__columns-item">
                    <span className="table_columns-table__columns-item-header">
                        Wybierz filtr:
                    </span>
                    <span className="table_columns-table__columns-item-choice">
                        <select
                            className="table_columns-table__columns-item-choice--select"
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
                            {/* <option value="range">Od - do</option> */}
                            <option value="date-range">Data od - do</option>
                            {/* <option value="date">Data</option> */}
                        </select>
                    </span>
                </section>
                <section className="table_columns-table__columns-item">
                    <span className="table_columns-table__columns-item-header">
                        Wybierz typ danych:
                    </span>
                    <span className="table_columns-table__columns-item-choice">
                        <select
                            className="table_columns-table__columns-item-choice--select"
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
            console.error(err);
        }
    };

    //tworzy kolumny na podstawie już zapisanych danych w DB i sprawdza czy są jakies nowe kolumny dzięki handleGetData;
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
        } catch (error) {
            console.error("Błąd podczas pobierania kolumn: ", error);
        }
    };

    // pobiera wszytskie nazwy kolumn z pierwszego dokumnetu w DB
    const handleGetData = async () => {
        try {
            setPleaseWait(true);

            const documentsColumn = await axiosPrivateIntercept.get(
                `/documents/get-columns-name`
            );

            await createColumns(documentsColumn.data);

            setPleaseWait(false);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        handleGetData();
    }, []);

    return (
        <section className="table_columns">
            {pleaseWait ? (
                <PleaseWait />
            ) : (
                <>
                    <section className="table_columns-table">
                        <section className="table_columns-table--title">
                            <h3 className="table_columns-table--name">
                                Ustawienia kolumn tabeli
                            </h3>
                            <i
                                className="fas fa-save table_columns-table--save"
                                onClick={handleSaveColumnsSetinngs}
                            ></i>
                        </section>
                        <section className="table_columns-table__container">
                            {columnItems}
                        </section>
                    </section>
                </>
            )}
        </section>
    );
};

export default TableColumns;
