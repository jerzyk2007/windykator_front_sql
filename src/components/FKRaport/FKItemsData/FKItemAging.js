import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";

import "./FKItemAging.css";

const FKItemAging = ({ data, info, title }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [dataItem, setDataItem] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [updateItem, setUpdateItem] = useState({
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
      if (a.type === "first" && b.type !== "first") return -1;
      if (a.type !== "first" && b.type === "first") return 1;

      // Sprawdź drugi warunek - type: "last" zawsze ostatni
      if (a.type === "last" && b.type !== "last") return 1;
      if (a.type !== "last" && b.type === "last") return -1;

      // Sprawdź trzeci warunek - sortowanie reszty obiektów wg wartości firstValue
      if (a.firstValue !== undefined && b.firstValue !== undefined) {
        return a.firstValue - b.firstValue;
      }

      // W przypadku, gdy któryś obiekt nie ma firstValue, nie zmieniaj ich kolejności
      return 0;
    });
    return sortedAgingObject;
  };

  const handleActiveItem = (index) => {
    setEditIndex(index);
    setUpdateItem(dataItem);
  };

  const handleDelete = (name) => {
    const deleteItem = dataItem.filter((item) => item.title !== name);
    setDataItem(deleteItem);
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
    const newValue = e.target.value;
    const update = updateItem.map((item, index) => {
      if (index === id) {
        if (info === "first") {
          return {
            ...item,
            firstValue: newValue,
            title: `${newValue}-${item.secondValue}`,
          };
        }
        if (info === "second") {
          return {
            ...item,
            secondValue: newValue,
            title: `${item.firstValue}-${newValue}`,
          };
        }
      }
      return item;
    });
    const sortedUpdate = sorted(update);
    setUpdateItem(sortedUpdate);
  };

  // funkcja wywoływana podczas pisania w input - edycja tekstu dla pierwszej i ostatniej wartości
  const handleFLEdit = (e, id, info) => {
    const newValue = e.target.value;
    const update = updateItem.map((item, index) => {
      if (index === id) {
        if (info === "first") {
          return {
            ...item,
            firstValue: newValue,
            title: `<${newValue}`,
          };
        }
        if (info === "last") {
          return {
            ...item,
            secondValue: newValue,
            title: `>${newValue}`,
          };
        }
      }
      return item;
    });
    setUpdateItem(update);
  };

  // zatwierdzenie danych po edycji
  const handleUpdateItem = () => {
    if (updateItem.length) {
      setDataItem(updateItem);
    }
    setEditIndex(null);
  };

  const arrayItems = dataItem.map((item, index) => {
    return (
      <section key={index} className="fk_item_aging-items__columns">
        <span className="fk_item_aging-items__columns--counter">
          {index + 1}.
        </span>
        {editIndex !== index && (
          <>
            <span className="fk_item_aging-items__columns--item">
              {item.title}
            </span>
            <i
              className="fa-regular fa-pen-to-square fk_item_aging--fa-pen-to-square"
              onClick={() => handleActiveItem(index)}
            ></i>

            {item.type === "some" && (
              <i
                className="fa-regular fa-trash-can fk_item_aging--fa-trash-can"
                onDoubleClick={() => handleDelete(item.title)}
              ></i>
            )}
            {item.type !== "some" && (
              <i className="fk_item_aging--fa-trash-can"></i>
            )}
          </>
        )}

        {editIndex === index && item.type === "some" && (
          <>
            <section className="fk_item_aging-title__container-number">
              <input
                className="fk_item_aging-title__container-add--edit"
                type="number"
                value={updateItem[index].firstValue}
                onChange={(e) => handleSomeEdit(e, index, "first")}
              />
              <input
                className="fk_item_aging-title__container-add--edit"
                type="number"
                value={updateItem[index].secondValue}
                onChange={(e) => handleSomeEdit(e, index, "second")}
              />
            </section>
            <i
              className="fa-solid fa-xmark fk_item_component--fa-xmark"
              onClick={handleEditCancel}
            ></i>
            <i
              className="fa-solid fa-check fk_item_component--fa-check"
              onClick={handleUpdateItem}
            ></i>
          </>
        )}

        {editIndex === index && item.type !== "some" && (
          <>
            <section className="fk_item_aging-title__container-number">
              {item.type === "first" && (
                <>
                  <span>{"<"}</span>
                  <input
                    className="fk_item_aging-title__container-add--edit"
                    type="number"
                    value={updateItem[index].firstValue}
                    onChange={(e) => handleFLEdit(e, index, "first")}
                  />
                </>
              )}
              {item.type === "last" && (
                <>
                  <span>{">"}</span>

                  <input
                    className="fk_item_aging-title__container-add--edit"
                    type="number"
                    value={updateItem[index].secondValue}
                    onChange={(e) => handleFLEdit(e, index, "last")}
                  />
                </>
              )}
            </section>
            <i
              className="fa-solid fa-xmark fk_item_component--fa-xmark"
              onClick={handleEditCancel}
            ></i>
            <i
              className="fa-solid fa-check fk_item_component--fa-check"
              onClick={handleUpdateItem}
            ></i>
          </>
        )}
      </section>
    );
  });

  // funkcja zatwierdzająca nowe dane
  const handleAcceptNewItem = () => {
    if (addItem) {
      const title = `${addItem.firstValue} - ${addItem.secondValue}`;
      const newItem = {
        firstValue: addItem.firstValue,
        secondValue: addItem.secondValue,
        title,
        type: "some",
      };
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
  };

  const saveData = async () => {
    await axiosPrivateIntercept.patch(`/fk/save-items-data/${info}`, {
      [info]: dataItem,
    });
  };

  useEffect(() => {
    const sortedData = sorted(data);
    setDataItem(sortedData);
  }, [data]);

  return (
    <section className="fk_item_aging">
      <section className="fk_item_aging-title__container">
        <span className="fk_item_aging--title">{title}</span>
        <span className="fk_item_aging--counter">
          {dataItem ? dataItem.length : ""}
        </span>
        {!addActive && (
          <>
            <i
              className="fa-solid fa-plus fk_item_aging--title--fa-plus"
              onClick={() => setAddActive(true)}
            ></i>
            <i
              className="fas fa-save fk_item_aging--title--fa-save"
              onClick={saveData}
            ></i>
          </>
        )}
      </section>
      {addActive && (
        <section className="fk_item_aging-title__container-add">
          <section className="fk_item_aging-title__container-number">
            <input
              className="fk_item_aging-title__container-add--edit"
              type="number"
              value={addItem.firstValue}
              onChange={(e) => handleAddItem(e, "first")}
            />
            <input
              className="fk_item_aging-title__container-add--edit"
              type="number"
              value={addItem.secondValue}
              onChange={(e) => handleAddItem(e, "second")}
            />
          </section>

          <section className="fk_item_aging-title__container-add--panel">
            <i
              className="fa-solid fa-xmark fk_item_aging--fa-xmark"
              onClick={cancelAddItem}
            ></i>
            <i
              className="fa-solid fa-check fk_item_aging--fa-check"
              onClick={handleAcceptNewItem}
            ></i>
          </section>
        </section>
      )}
      <section className="fk_item_aging-items__container">{arrayItems}</section>
    </section>
  );
};

export default FKItemAging;
