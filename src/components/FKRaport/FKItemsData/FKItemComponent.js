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

  const handleActiveItem = (index) => {
    setEditIndex(index);
    setUpdateItem(dataItem);
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

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

  const handleDelete = (name) => {
    const deleteItem = dataItem.filter((item) => item !== name);
    setDataItem(deleteItem);
  };

  const handleChangeItem = () => {
    if (updateItem.length && !duplicate) {
      setDataItem(updateItem);
    }
    setEditIndex(null);
  };

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

  const changeItem = (info) => {
    if (info === "add") {
      const update = [...dataItem, addItem];
      update.sort();
      setDataItem(update);
      setAddItem("");
      setAddActive(false);
    }
  };

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
              onClick={handleCancel}
            ></i>
            <i
              className="fa-solid fa-check fk_item_component--fa-check"
              onClick={handleChangeItem}
              style={duplicate ? { display: "none" } : null}
            ></i>
          </>
        )}
      </section>
    );
  });

  useEffect(() => {
    if (data?.length) {
      const collator = new Intl.Collator("pl", { sensitivity: "base" });
      const dataSort = data.sort(collator.compare);
      setDataItem(dataSort);
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
              onClick={() => setAddActive(false)}
            ></i>
            {!duplicate && (
              <i
                className="fa-solid fa-check fk_item_component--fa-check"
                onClick={() => changeItem("add")}
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
