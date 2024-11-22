import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";

import "./TableColumns.css";

const TableColumns = () => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();
    const [pleaseWait, setPleaseWait] = useState(false);

    const [columns, setColumns] = useState([]);
    const [newData, setNewData] = useState(false);

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

    const handleAddRow = () => {
        const clearAreas = columns[0].areas.map(item => {
            return {
                ...item,
                available: false,
                hide: false
            };
        });
        const clearData = {
            accessorKey: "",
            header: "",
            filterVariant: "",
            type: "",
            description: null,
            areas: clearAreas,
            edit: true
        };
        setNewData(true);

        setColumns(prevColumns => [clearData, ...prevColumns]);

        // setColumns(columns.push(clearData));

    };

    const handleDelete = (index) => {
        const deleteCol = columns.filter(col => col.id_table_columns !== index);
        setColumns(deleteCol);
    };

    const handleChangeChecked = (col, select, type) => {
        const changeColumn = columns.map(item => {
            if (item.accessorKey === col.accessorKey) {
                const newTypeArea = item.areas.map(area => {
                    return {
                        ...area,
                        [type]: select === "all" ? true : false// Zamiana wartości na przeciwną
                    };
                });
                return {
                    ...item,
                    areas: newTypeArea
                };
            } else {
                return item;
            }
        });
        setColumns(changeColumn);
    };

    const changeArea = (area, col, type) => {
        if (type in area) {
            area[type] = !area[type];
        }
        col.typeArea = col.areas.map(item =>
            item.name === area.name ? { ...area } : item
        );

        const changeColumns = columns.map(item => {
            if (item.accessorKey === col.accessorKey) {
                return col;
            } else {
                return item;
            }
        });

        setColumns(changeColumns);

    };


    const createArea = (nameDB) => {
        const areaItems = nameDB.areas.map((area, index) => {
            return (
                <section className="table_column__areas--item" key={index}>
                    <span style={{ color: "blue" }}>{area.name}</span>
                    <section className="table_column__areas--available">
                        <span style={{ color: "green" }}>Dostęp:</span>
                        <input
                            className="table_column__areas--check"
                            type="checkbox"
                            checked={area.available}
                            onChange={() => changeArea(area, nameDB, "available")}
                        />
                    </section>
                    {/* <section className="table_column__areas--available">
                        <span style={{ color: "#800091" }}>Widoczny:</span>
                        <input
                            className="table_column__areas--check"
                            type="checkbox"
                            checked={area.hide}
                            onChange={() => changeArea(area, nameDB, "hide")}
                        />

                    </section> */}

                </section>
            );
        });
        return areaItems;
    };

    const columnItems = columns.map((col, index) => {
        return (
            <section className="table_column__wrapper" key={index}>
                <section className="table_column__columns" >
                    <section className="table_column__columns-item">
                        <section className="table_column__columns-item-header">
                            <i
                                className="fa-regular fa-trash-can item_component--fa-trash-can "
                                onDoubleClick={() => handleDelete(col.id_table_columns)}
                            ></i>
                            <span >
                                Nazwa w DB:
                            </span>
                        </section>


                        <span className="table_column__columns-item-choice">
                            {!col?.edit && <input
                                style={{ color: "black" }}
                                className="table_column__columns-item-choice--text"
                                type="text"
                                value={col.accessorKey}
                                // onChange={(e) =>
                                //     handleHeaderChange(index, "header", e.target.value)
                                // }
                                // readOnly={newData}
                                // disabled={newData}
                                readOnly
                                disabled
                            />}
                            {col?.edit && <input
                                style={{ color: "black" }}
                                className="table_column__columns-item-choice--text"
                                type="text"
                                value={col.accessorKey}
                                onChange={(e) =>
                                    handleHeaderChange(index, "accessorKey", e.target.value)
                                }
                            // readOnly={newData}
                            // disabled={newData}
                            // readOnly
                            // disabled
                            />}
                        </span>
                    </section>
                    <section className="table_column__columns-item">
                        <span className="table_column__columns-item-header">
                            Podaj swoją nazwę:
                        </span>
                        <span className="table_column__columns-item-choice">
                            <input
                                className="table_column__columns-item-choice--select"
                                type="text"
                                value={col.header}
                                onChange={(e) =>
                                    handleHeaderChange(index, "header", e.target.value)
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
                    <section className="table_column__columns-item">
                        <span className="table_column__columns-item-header">
                            Wybierz typ danych:
                        </span>
                        <span className="table_column__columns-item-choice">
                            <select
                                className="table_column__columns-item-choice--select"
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
                <section className="table_column__areas__container" >
                    <section className="table_column__areas--wrapper">
                        <section className="table_column__areas--available">
                            <Button
                                variant="contained"
                                onClick={() => handleChangeChecked(col, "all", "available")}
                                size="small"
                                color="success"
                            >
                                Zaznacz
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleChangeChecked(col, "null", "available")}
                                size="small"
                                color="success"
                            >
                                Odznacz
                            </Button>
                        </section>
                        {/* <section className="table_column__areas--hide">
                            <Button
                                variant="contained"
                                onClick={() => handleChangeChecked(col, "all", "hide")}

                                size="small"
                                color="secondary"
                            >
                                Zaznacz
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleChangeChecked(col, "null", "hide")}
                                size="small"
                                color="secondary"
                            >
                                Odznacz
                            </Button>
                        </section> */}
                    </section>
                    <section className="table_column__areas">
                        {createArea(col)}
                    </section>
                </section>
            </section>
        );
    });

    const handleSaveColumnsSetinngs = async () => {
        try {
            setNewData(false);
            setPleaseWait(true);
            await axiosPrivateIntercept.patch("/settings/change-columns", {
                columns,
            });
            setPleaseWait(false);

        } catch (err) {
            console.error(err);
        }
    };


    // pobiera wszytskie nazwy kolumn z pierwszego dokumnetu w DB
    const handleGetData = async () => {
        try {
            setPleaseWait(true);
            const settingsColumn = await axiosPrivateIntercept.get(
                "/settings/get-columns"
            );

            const addColumns = settingsColumn.data.columns
                .sort((a, b) => a.accessorKey.localeCompare(b.accessorKey)) // Sortowanie według accessorKey
                .map(item => {
                    // 1. Sprawdź brakujące obszary do item.areas
                    const nonMatchingAreas = settingsColumn.data.areas.filter(areaItem =>
                        !item.areas.some(area => area.name === areaItem)
                    );

                    // 2. Dodaj brakujące obszary
                    nonMatchingAreas.forEach(areaItem => {
                        item.areas.push({ name: areaItem, available: false, hide: false });
                    });

                    // 3. Usuń nadmiarowe obszary z item.areas
                    item.areas = item.areas.filter(area =>
                        settingsColumn.data.areas.includes(area.name)
                    );

                    // 4. Posortuj item.areas zgodnie z kolejnością w settingsColumn.data.areas
                    item.areas = item.areas.sort((a, b) => {
                        const indexA = settingsColumn.data.areas.indexOf(a.name);
                        const indexB = settingsColumn.data.areas.indexOf(b.name);
                        return indexA - indexB;
                    });

                    return item;
                });


            setColumns(addColumns);

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
                    <section className="table_columns--title">
                        <i
                            style={newData ? { color: "transparent" } : null}
                            className="fas fa-plus table_columns--save"
                            onClick={!newData ? handleAddRow : null}
                            disabled
                        ></i>
                        <h3 className="table_columns--name">
                            Ustawienia kolumn tabeli
                        </h3>
                        <i
                            className="fas fa-save table_columns--save"
                            onClick={handleSaveColumnsSetinngs}
                        ></i>
                    </section>
                    <section className="table_columns__container">
                        {columnItems}
                    </section>
                </>
            )
            }
        </section >
    );
};

export default TableColumns;
// import { useState, useEffect } from "react";
// import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
// import PleaseWait from "../PleaseWait";

// import "./TableColumns.css";

// const TableColumns = () => {
//     const axiosPrivateIntercept = useAxiosPrivateIntercept();
//     const [pleaseWait, setPleaseWait] = useState(false);

//     const [columns, setColumns] = useState([]);

//     const handleHeaderChange = (index, field, newValue) => {
//         setColumns((prevColumns) => {
//             const updatedColumns = [...prevColumns];

//             updatedColumns[index] = {
//                 ...updatedColumns[index],
//                 [field]: newValue,
//             };

//             return updatedColumns;
//         });
//     };

//     const columnItems = columns.map((col, index) => {
//         return (
//             <section className="table_column__columns" key={index}>
//                 <section className="table_column__columns-item">
//                     <span className="table_column__columns-item-header">
//                         Nazwa w DB:
//                     </span>
//                     <span
//                         className="table_column__columns-item-choice"
//                         style={{ color: "black" }}
//                     >
//                         {col.accessorKey}
//                     </span>
//                 </section>
//                 <section className="table_column__columns-item">
//                     <span className="table_column__columns-item-header">
//                         Podaj swoją nazwę:
//                     </span>
//                     <span className="table_column__columns-item-choice">
//                         <input
//                             className="table_column__columns-item-choice--select"
//                             type="text"
//                             value={col.header}
//                             onChange={(e) =>
//                                 handleHeaderChange(index, "header", e.target.value)
//                             }
//                         />
//                     </span>
//                 </section>
//                 <section className="table_column__columns-item">
//                     <span className="table_column__columns-item-header">
//                         Wybierz filtr:
//                     </span>
//                     <span className="table_column__columns-item-choice">
//                         <select
//                             className="table_column__columns-item-choice--select"
//                             value={col.filterVariant}
//                             onChange={(e) =>
//                                 handleHeaderChange(index, "filterVariant", e.target.value)
//                             }
//                         >
//                             <option value="none">Brak</option>
//                             <option value="startsWith">Dokładne wyszukanie</option>
//                             <option value="text">Zbliżone wyszukanie</option>
//                             <option value="multi-select">Zaznacz wiele</option>
//                             <option value="select">Zaznacz jeden</option>
//                             <option value="range-slider">Suwak do kwot</option>
//                             {/* <option value="range">Od - do</option> */}
//                             <option value="date-range">Data od - do</option>
//                             {/* <option value="date">Data</option> */}
//                         </select>
//                     </span>
//                 </section>
//                 <section className="table_column__columns-item">
//                     <span className="table_column__columns-item-header">
//                         Wybierz typ danych:
//                     </span>
//                     <span className="table_column__columns-item-choice">
//                         <select
//                             className="table_column__columns-item-choice--select"
//                             value={col.type}
//                             onChange={(e) =>
//                                 handleHeaderChange(index, "type", e.target.value)
//                             }
//                         >
//                             <option value="text">tekst</option>
//                             <option value="money">waluta</option>
//                         </select>
//                     </span>
//                 </section>
//             </section>
//         );
//     });

//     const handleSaveColumnsSetinngs = async () => {
//         try {
//             await axiosPrivateIntercept.patch("/settings/change-columns", {
//                 columns,
//             });
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     //tworzy kolumny na podstawie już zapisanych danych w DB i sprawdza czy są jakies nowe kolumny dzięki handleGetData;
//     const createColumns = async (columnsName) => {
//         try {
//             const settingsColumn = await axiosPrivateIntercept.get(
//                 "/settings/get-columns"
//             );
//             const newColumns = columnsName.map((colName) => {
//                 const matchingColumn = settingsColumn.data.find(
//                     (column) => column.accessorKey === colName
//                 );

//                 if (matchingColumn) {
//                     return {
//                         accessorKey: matchingColumn.accessorKey,
//                         header: matchingColumn.header,
//                         filterVariant: matchingColumn.filterVariant,
//                         type: matchingColumn.type,
//                     };
//                 } else {
//                     return {
//                         accessorKey: colName,
//                         header: colName,
//                         filterVariant: "contains",
//                         type: "text",
//                     };
//                 }
//             });
//             setColumns(newColumns);
//         } catch (error) {
//             console.error("Błąd podczas pobierania kolumn: ", error);
//         }
//     };

//     // pobiera wszytskie nazwy kolumn z pierwszego dokumnetu w DB
//     const handleGetData = async () => {
//         try {
//             setPleaseWait(true);

//             const documentsColumn = await axiosPrivateIntercept.get(
//                 `/documents/get-columns-name`
//             );

//             await createColumns(documentsColumn.data);

//             setPleaseWait(false);
//         } catch (err) {
//             console.error(err);
//         }
//     };
//     useEffect(() => {
//         handleGetData();
//     }, []);

//     return (
//         <section className="table_columns">
//             {pleaseWait ? (
//                 <PleaseWait />
//             ) : (
//                 <>
//                     <section className="table_column">
//                         <section className="table_column--title">
//                             <h3 className="table_column--name">
//                                 Ustawienia kolumn tabeli
//                             </h3>
//                             <i
//                                 className="fas fa-save table_column--save"
//                                 onClick={handleSaveColumnsSetinngs}
//                             ></i>
//                         </section>
//                         <section className="table_column__container">
//                             {columnItems}
//                         </section>
//                     </section>
//                 </>
//             )}
//         </section>
//     );
// };

// export default TableColumns;
