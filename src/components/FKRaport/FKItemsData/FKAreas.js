import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";

import "./FKAreas.css";

const FKAreas = ({ data }) => {
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
    if (!dataItem.includes(newValue)) {
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
    const newValue = e.target.value;
    setAddItem(newValue);
    if (!dataItem.includes(newValue)) {
      setDuplicate(false);
    } else {
      setDuplicate(true);
    }
  };

  const updateLocalization = (info) => {
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
      `/fk/save-items-data/areas`,
      {
        areas: dataItem,
      }
    );
  };

  const arrayItems = dataItem.map((item, index) => {
    return (
      <section key={index} className="fk_localization-items__columns">
        <span className="fk_localization-items__columns--counter">
          {index + 1}.
        </span>
        {editIndex !== index && (
          <>
            <span className="fk_localization-items__columns--item">{item}</span>
            {!addActive && (
              <>
                <i
                  className="fa-regular fa-pen-to-square fk_localization--fa-pen-to-square"
                  onClick={() => handleActiveItem(index)}
                ></i>
                <i
                  className="fa-regular fa-trash-can fk_localization--fa-trash-can"
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
              className="fk_localization--edit"
              type="text"
              value={updateItem.length ? updateItem[index] : ""}
              onChange={(e) => handleEdit(e, index)}
            />
            <i
              className="fa-solid fa-xmark fk_localization--fa-xmark"
              onClick={handleCancel}
            ></i>
            <i
              className="fa-solid fa-check fk_localization--fa-check"
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
    <section className="fk_localization">
      <section className="fk_localization-title__container">
        <span className="fk_localization--title">Obszary</span>
        <span className="fk_localization--counter">
          {dataItem ? dataItem.length : ""}
        </span>
        {!addActive && (
          <>
            <i
              className="fa-solid fa-plus fk_localization--title--fa-plus"
              onClick={() => setAddActive(true)}
            ></i>
            <i
              className="fas fa-save fk_localization--title--fa-save"
              onClick={saveData}
            ></i>
          </>
        )}
      </section>
      {addActive && (
        <section className="fk_localization-title__container-add">
          <input
            style={duplicate ? { color: "red", fontWeight: "bold" } : null}
            className="fk_localization-title__container-add--edit"
            type="text"
            value={addItem}
            onChange={(e) => handleAddItem(e)}
          />
          <section className="fk_localization-title__container-add--panel">
            <i
              className="fa-solid fa-xmark fk_localization--fa-xmark"
              onClick={() => setAddActive(false)}
            ></i>
            {!duplicate && (
              <i
                className="fa-solid fa-check fk_localization--fa-check"
                onClick={() => updateLocalization("add")}
              ></i>
            )}
          </section>
        </section>
      )}
      <section className="fk_localization-items__container">
        {arrayItems.sort()}
      </section>
    </section>
  );
};

export default FKAreas;
