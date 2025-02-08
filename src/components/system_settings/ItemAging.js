import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";

import "./ItemAging.css";

const FKItemAging = ({ data, info, title }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [dataItem, setDataItem] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteActive, setDeleteActive] = useState(false);
  const [updateItem, setUpdateItem] = useState({
    id: "",
    firstValue: "",
    secondValue: "",
    title: "",
    type: "some",
  });
  const [addActive, setAddActive] = useState(false);
  const [addItem, setAddItem] = useState({
    firstValue: "",
    secondValue: "",
    title: "",
  });

  //funkcja do sortowania danych tylko środkowych wg pierwszej liczby
  const sorted = (items) => {
    const sortedAgingObject = items?.slice().sort((a, b) => {
      // Sprawdź pierwszy warunek - type: "first" zawsze pierwszy
      if (a.TYPE === "first" && b.TYPE !== "first") return -1;
      if (a.TYPE !== "first" && b.TYPE === "first") return 1;

      // Sprawdź drugi warunek - type: "last" zawsze ostatni
      if (a.TYPE === "last" && b.TYPE !== "last") return 1;
      if (a.TYPE !== "last" && b.TYPE === "last") return -1;

      // Sprawdź trzeci warunek - sortowanie reszty obiektów wg wartości firstValue
      if (a.FROM_TIME !== undefined && b.FROM_TIME !== undefined) {
        return a.FROM_TIME - b.FROM_TIME;
      }

      // W przypadku, gdy któryś obiekt nie ma firstValue, nie zmieniaj ich kolejności
      return 0;
    });
    return sortedAgingObject;
  };

  const handleActiveItem = (index) => {
    setEditIndex(index);

    const update = {
      id: dataItem[index].id_aging_items,
      firstValue: dataItem[index].FROM_TIME,
      secondValue: dataItem[index].TO_TIME,
      title: dataItem[index].TITLE,
      type: dataItem[index].TYPE,
    };

    setUpdateItem(update);
  };

  const handleDelete = async (id) => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.delete(`/items/delete-item/${id}/${info}`);
      if (result) {
        setDataItem(prevItems => prevItems.filter(item => item.id_aging_items !== id));
      }
      setDeleteActive(false);
      setEditIndex(false);
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setPleaseWait(false);

    }
  };

  const handleDeleteCancel = () => {
    setEditIndex(null);
    setDeleteActive(false);
  };

  const handleAddItem = (e, info) => {
    const newValue = e.target.value;

    if (info === "first") {
      setAddItem((prev) => {
        return {
          ...prev,
          firstValue: newValue,
        };
      });
    } else if (info === "second") {
      setAddItem((prev) => {
        return {
          ...prev,
          secondValue: newValue,
        };
      });
    }
  };

  const cancelAddItem = () => {
    setAddActive(false);
    setAddItem({
      firstValue: "",
      secondValue: "",
    });
  };

  // wyjście z edycji
  const handleEditCancel = () => {
    setEditIndex(null);
  };

  // funkcja wywoływana podczas pisania w input - edycja tekstu dla wartosci pośrednich
  const handleSomeEdit = (e, id, info) => {
    const newValue = Number(e.target.value);

    const filteredData = dataItem.filter(item => item.id_aging_items === id);

    const update = {
      id_aging_items: filteredData[0].id_aging_items,
      FROM_TIME: info === 'first' ? newValue : filteredData[0].FROM_TIME,  // Zachowaj starą wartość
      TO_TIME: info === 'second' ? newValue : filteredData[0].TO_TIME, // Zachowaj starą wartość
      TITLE: info === 'first'
        ? `${newValue} - ${filteredData[0].TO_TIME}`
        : `${filteredData[0].FROM_TIME} - ${newValue}`,
      TYPE: 'some'
    };

    const newData = dataItem.map(item => {
      if (item.id_aging_items === id) {
        return update;
      }
      return item;
    });

    setDataItem(newData);

  };

  // funkcja wywoływana podczas pisania w input - edycja tekstu dla pierwszej i ostatniej wartości
  const handleFLEdit = (e, id, info) => {
    const newValue = Number(e.target.value);

    const update = {
      id_aging_items: updateItem.id,
      FROM_TIME: info === 'first' ? newValue : updateItem.firstValue,
      TO_TIME: info === 'last' ? newValue : updateItem.secondValue,
      TITLE: info === 'first' ? `< ${newValue}` : `> ${newValue}`,
      TYPE: info === 'first' ? 'first' : 'last'
    };
    const newData = dataItem.map(item => {
      if (item.id_aging_items === id) {
        return update;
      }
      return item;
    });

    setDataItem(newData);
  };

  // zatwierdzenie danych po edycji
  const handleUpdateItem = async (id) => {
    setPleaseWait(true);
    try {
      const filteredItem = dataItem.filter(item => item.id_aging_items === id);

      await axiosPrivateIntercept.patch(`/items/change-item/${id}/${info}`, {
        data: filteredItem[0]
      });

      setEditIndex(null);
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setPleaseWait(false);
    }
  };

  const arrayItems = dataItem.map((item, index) => {
    return (
      <section key={index} className="item_component-items__columns">
        {editIndex !== index && (
          <>
            <span className="item_component-items__columns--counter">
              {index + 1}.
            </span>
            <span className="item_component-items__columns--item">
              {item.TITLE}
            </span>
            <i
              className="fa-regular fa-pen-to-square item_component--fa-pen-to-square"
              onClick={() => handleActiveItem(index)}
            ></i>

            {item.TYPE === "some" && (
              <i
                className="fa-regular fa-trash-can item_component--fa-trash-can"
                onDoubleClick={() => {
                  setEditIndex(index);
                  setDeleteActive(true);
                }

                }
              ></i>
            )}
            {item.TYPE !== "some" && (
              <i className="item_aging--fa-trash-can"></i>
            )}
          </>
        )
        }

        {editIndex === index && !deleteActive && item.TYPE === "some" && (
          <section className="item_component-title__container-add">

            <section className="item_aging-title__container-number">
              <input
                className="item_aging-title__container-add--edit"
                type="number"
                value={item.FROM_TIME}
                onChange={(e) => handleSomeEdit(e, item.id_aging_items, "first")}
              />
              <input
                className="item_aging-title__container-add--edit"
                type="number"
                value={item.TO_TIME}
                onChange={(e) => handleSomeEdit(e, item.id_aging_items, "second")}
              />
            </section>
            {/* <i
              className="fa-solid fa-xmark item_component--fa-xmark"
              onClick={handleEditCancel}
            ></i>
            <i
              className="fa-solid fa-check item_component--fa-check"
              onClick={handleUpdateItem}
            ></i> */}
            <section className="item_component-title__container-add--panel">
              < Button
                variant="contained"
                color="error"
                size="small"
                onClick={handleEditCancel}
              >
                Anuluj
              </Button>
              < Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => handleUpdateItem(item.id_aging_items)}
              >
                Zatwierdź
              </Button>
            </section>
          </section>

        )}

        {
          editIndex === index && !deleteActive && item.TYPE !== "some" && (
            <section className="item_component-title__container-add">

              <section className="item_aging-title__container-number">
                {item.TYPE === "first" && (
                  <>
                    <span>{"<"}</span>
                    <input
                      className="item_aging-title__container-add--edit"
                      type="number"
                      value={item.FROM_TIME}
                      onChange={(e) => handleFLEdit(e, item.id_aging_items, "first")}
                    />
                  </>
                )}
                {item.TYPE === "last" && (
                  <>
                    <span>{">"}</span>

                    <input
                      className="item_aging-title__container-add--edit"
                      type="number"
                      value={item.TO_TIME}
                      onChange={(e) => handleFLEdit(e, item.id_aging_items, "last")}
                    />
                  </>
                )}
              </section>
              <section className="item_component-title__container-add--panel">
                < Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={handleEditCancel}
                >
                  Anuluj
                </Button>
                < Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => handleUpdateItem(item.id_aging_items)}
                >
                  Zatwierdź
                </Button>
              </section>
            </section>
          )
        }
        {
          editIndex === index && deleteActive &&
          <section className="item_component-title__container-add">
            <section className="item_component-title__container-data">
              <span className="item_component-message">Potwierdź usunięcie</span>
              <span className="item_component-message">{item.TITLE}</span>
            </section>
            <section className="item_component-title__container-add--panel">
              < Button
                variant="contained"
                color="error"
                size="small"
                onClick={handleDeleteCancel}
              >
                Anuluj
              </Button>
              < Button
                variant="contained"
                color="success"
                size="small"
                // disabled={info === "owner" ? !checkMail : !duplicate ? false : true}
                onClick={() => handleDelete(item.id_aging_items)}
              >
                USUŃ
              </Button>
            </section>
          </section>
        }
      </section >
    );
  });

  // funkcja zatwierdzająca nowe dane
  const handleAcceptNewItem = async () => {
    try {
      if (addItem) {
        setPleaseWait(true);
        const title = `${addItem.firstValue} - ${addItem.secondValue}`;

        const newItem = {
          FROM_TIME: addItem.firstValue,
          TO_TIME: addItem.secondValue,
          TITLE: title,
          TYPE: "some",
        };
        await axiosPrivateIntercept.post(`/items/new-item/${info}`
          , {
            data: newItem,
          }
        );
        const updateItems = [...dataItem, newItem];
        const sortedItems = sorted(updateItems);

        setDataItem(sortedItems);
      }

      setAddItem((prev) => {
        return {
          ...prev,
          firstValue: "",
          secondValue: "",
        };
      });
      setAddActive(false);
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setPleaseWait(false);
    }
  };


  useEffect(() => {
    const sortedData = sorted(data);
    setDataItem(sortedData);
  }, []);

  return (
    <section className="item_component">

      {!pleaseWait ? <>
        <section className="item_component-title__container">
          <section className="item_component--counter">
            <span className="item_component--counter-info">
              {dataItem ? dataItem.length : ""}
            </span>
          </section>
          <section className="item_component--title">
            <span >{title}</span>
          </section>


          <section className="item_component--choice">

            {!addActive && (
              <i
                className="fa-solid fa-plus item_component--title--fa-plus"
                onClick={() => setAddActive(true)}
              ></i>
            )}
          </section>
        </section>
        {addActive && (
          <section className="item_component-title__container-add">
            <section className="item_aging-title__container-number">
              <input
                className="item_aging-title__container-add--edit"
                type="number"
                value={addItem.firstValue}
                onChange={(e) => handleAddItem(e, "first")}
              />
              <input
                className="item_aging-title__container-add--edit"
                type="number"
                value={addItem.secondValue}
                onChange={(e) => handleAddItem(e, "second")}
              />
            </section>

            <section className="item_component-title__container-add--panel">
              < Button
                variant="contained"
                color="error"
                size="small"
                onClick={cancelAddItem}
              >
                Anuluj
              </Button>

              < Button
                variant="contained"
                color="success"
                size="small"
                onClick={handleAcceptNewItem}
              >
                Zatwierdź
              </Button>
            </section>
          </section>
        )}

        <section className="item_component-items__container">{arrayItems}</section>
      </> : null}

    </section>


  );
};

export default FKItemAging;
