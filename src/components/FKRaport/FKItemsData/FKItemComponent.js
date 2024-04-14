import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";

import "./FKItemComponent.css";

const FKItemComponent = ({ data, type, title }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [dataItem, setDataItem] = useState([]);
  const [duplicate, setDuplicate] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [updateItem, setUpdateItem] = useState([]);
  const [addActive, setAddActive] = useState(false);
  const [addItem, setAddItem] = useState("");

  const sorted = (items) => {
    const collator = new Intl.Collator("pl", { sensitivity: "base" });
    const dataSort = items.sort(collator.compare);
    return dataSort;
  };

  //włącza możliwość edycji
  const handleActiveItem = (index) => {
    setEditIndex(index);
    setUpdateItem(dataItem);
  };

  // wyjście z edycji
  const handleEditCancel = () => {
    setEditIndex(null);
  };

  // wyjście z dodawanie nowych danych
  const handleAddCancel = () => {
    setAddActive(false);
    setAddItem("");
  };

  // funkcja wywoływana podczas pisania w input - edycja tekstu
  const handleEdit = (e, index) => {
    const newValue = e.target.value;
    const update = [...dataItem];
    update[index] = newValue;
    setUpdateItem(update);
    if (
      !dataItem
        .map((item) => item.toLowerCase())
        .includes(newValue.toLowerCase())
    ) {
      setDuplicate(false);
    } else {
      setDuplicate(true);
    }
  };

  // usuwa dane pole
  const handleDelete = (name) => {
    const deleteItem = dataItem.filter((item) => item !== name);
    setDataItem(deleteItem);
  };

  // zatwierdzenie danych po edycji
  const handleUpdateItem = () => {
    if (updateItem.length && !duplicate) {
      const sortedData = sorted(updateItem);
      setDataItem(sortedData);
    }
    setEditIndex(null);
  };

  // funkcja wywoływana w inpucie dodawania nowego wpisu
  const handleAddItem = (e) => {
    setAddItem(e.target.value);
    const newValue = e.target.value.toLowerCase(); // Konwersja na małe litery
    if (!dataItem.map((item) => item.toLowerCase()).includes(newValue)) {
      // Konwersja wszystkich elementów tablicy do małych liter
      setDuplicate(false);
    } else {
      setDuplicate(true);
    }
  };

  // funkcja zatwierdzająca nowe dane
  const handleAcceptNewItem = () => {
    if (addItem) {
      const update = [...dataItem, addItem];
      const sortedData = sorted(update);

      setDataItem(sortedData);
    }

    setAddItem("");
    setAddActive(false);
  };

  // zapis do bazy danych
  const saveData = async () => {
    const result = await axiosPrivateIntercept.patch(
      `/fk/save-items-data/${type}`,
      {
        [type]: dataItem,
      }
    );
  };

  const arrayItems = dataItem.map((item, index) => {
    return (
      <section key={index} className="fk_item_component-items__columns">
        <span className="fk_item_component-items__columns--counter">
          {index + 1}.
        </span>
        {editIndex !== index && (
          <>
            <span className="fk_item_component-items__columns--item">
              {item}
            </span>
            {!addActive && (
              <>
                <i
                  className="fa-regular fa-pen-to-square fk_item_component--fa-pen-to-square"
                  onClick={() => handleActiveItem(index)}
                ></i>
                <i
                  className="fa-regular fa-trash-can fk_item_component--fa-trash-can"
                  onDoubleClick={() => handleDelete(item)}
                ></i>
              </>
            )}
          </>
        )}

        {editIndex === index && (
          <>
            <input
              style={duplicate ? { color: "red", fontWeight: "bold" } : null}
              className="fk_item_component--edit"
              type="text"
              value={updateItem.length ? updateItem[index] : ""}
              onChange={(e) => handleEdit(e, index)}
            />
            <i
              className="fa-solid fa-xmark fk_item_component--fa-xmark"
              onClick={handleEditCancel}
            ></i>
            <i
              className="fa-solid fa-check fk_item_component--fa-check"
              onClick={handleUpdateItem}
              style={duplicate ? { display: "none" } : null}
            ></i>
          </>
        )}
      </section>
    );
  });

  useEffect(() => {
    if (data?.length) {
      const update = sorted(data);
      setDataItem(update);
    }
  }, [data]);

  useEffect(() => {
    if (addActive) {
      setEditIndex(null);
    }
  }, [addActive]);

  return (
    <section className="fk_item_component">
      <section className="fk_item_component-title__container">
        <span className="fk_item_component--title">{title}</span>
        <span className="fk_item_component--counter">
          {dataItem ? dataItem.length : ""}
        </span>
        {!addActive && (
          <>
            <i
              className="fa-solid fa-plus fk_item_component--title--fa-plus"
              onClick={() => setAddActive(true)}
            ></i>
            <i
              className="fas fa-save fk_item_component--title--fa-save"
              onClick={saveData}
            ></i>
          </>
        )}
      </section>
      {addActive && (
        <section className="fk_item_component-title__container-add">
          <input
            style={duplicate ? { color: "red", fontWeight: "bold" } : null}
            className="fk_item_component-title__container-add--edit"
            type="text"
            value={addItem}
            onChange={(e) => handleAddItem(e)}
          />
          <section className="fk_item_component-title__container-add--panel">
            <i
              className="fa-solid fa-xmark fk_item_component--fa-xmark"
              onClick={handleAddCancel}
            ></i>
            {!duplicate && (
              <i
                className="fa-solid fa-check fk_item_component--fa-check"
                onClick={handleAcceptNewItem}
              ></i>
            )}
          </section>
        </section>
      )}
      <section className="fk_item_component-items__container">
        {arrayItems.sort()}
      </section>
    </section>
  );
};

export default FKItemComponent;
