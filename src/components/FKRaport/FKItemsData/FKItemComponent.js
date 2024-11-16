import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";

import "./FKItemComponent.css";

const FKItemComponent = ({ data, info, title }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  // const [dataItem, setDataItem] = useState([]);
  const [newDataItem, setNewDataItem] = useState([]);
  const [duplicate, setDuplicate] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  // const [updateItem, setUpdateItem] = useState([]);
  const [addActive, setAddActive] = useState(false);
  const [addItem, setAddItem] = useState({ oldName: "", newName: "" });

  //sortowanie z uwzględnieniem polskich znaków
  const sorted = (items) => {
    const collator = new Intl.Collator("pl", { sensitivity: "base" });

    // Sortowanie tablicy obiektów na podstawie klucza 'oldName'
    const dataSort = items.sort((a, b) =>
      collator.compare(a.oldName, b.oldName)
    );

    return dataSort;
  };

  //włącza możliwość edycji
  const handleActiveItem = (index) => {
    setDuplicate(true);
    setEditIndex(index);
    // setUpdateItem(dataItem);
  };

  // wyjście z edycji
  const handleEditCancel = (id) => {
    const updateNewDataIltem = [...newDataItem];

    const update = updateNewDataIltem.map((item, index) => {
      if (index === id) {
        return {
          ...item,
          newName: item.oldName,
        };
      } else {
        return item;
      }
    });
    setNewDataItem(update);
    setEditIndex(null);
  };

  // wyjście z dodawanie nowych danych
  const handleAddCancel = () => {
    setAddActive(false);
    setAddItem({
      oldName: "",
      newName: "",
    });
  };

  // funkcja wywoływana podczas pisania w input - edycja tekstu
  const handleEdit = (e, id) => {
    const newValue = e.target.value;
    const updateNewDataIltem = [...newDataItem];
    const checkDuplicate = newDataItem.some(
      (item) => item.oldName.toLowerCase() === newValue.toLowerCase()
    );
    if (checkDuplicate) {
      setDuplicate(true);
    } else {
      setDuplicate(false);
    }

    const update = updateNewDataIltem.map((item, index) => {
      if (index === id) {
        return {
          ...item,
          newName: newValue,
        };
      } else {
        return item;
      }
    });
    setNewDataItem(update);
  };

  // usuwa dane pole
  const handleDelete = (id) => {
    const deleteItem = newDataItem.filter((item, index) => index !== id);
    setNewDataItem(deleteItem);
  };

  // zatwierdzenie danych po edycji
  const handleUpdateItem = async (id) => {
    let updateDB = {
      oldName: "",
      newName: "",
    };
    const update = newDataItem.map((item, index) => {
      if (index === id) {
        updateDB = {
          oldName: item.oldName,
          newName: item.newName,
        };
        return {
          ...item,
          oldName: item.newName,
        };
      } else {
        return item;
      }
    });
    setNewDataItem(update);
    setEditIndex(null);
  };

  // funkcja wywoływana w inpucie dodawania nowego wpisu
  const handleAddItem = (e) => {
    setAddItem({
      oldName: e.target.value,
      newName: e.target.value,
    });
    const newValue = e.target.value;
    // const updateNewDataIltem = [...newDataItem];
    const checkDuplicate = newDataItem.some(
      (item) => item.oldName.toLowerCase() === newValue.toLowerCase()
    );
    if (checkDuplicate) {
      setDuplicate(true);
    } else {
      setDuplicate(false);
    }
  };

  // funkcja zatwierdzająca nowe dane
  const handleAcceptNewItem = () => {
    if (addItem) {
      const update = [...newDataItem, addItem];
      const sortedData = sorted(update);
      setNewDataItem(sortedData);
    }

    setAddItem({
      oldName: "",
      newName: "",
    });
    setAddActive(false);
  };

  // zapis do bazy danych
  const saveData = async () => {
    const newNamesArray = newDataItem.map((item) => item.newName);
    await axiosPrivateIntercept.patch(`/fk/save-items-data/${info}`, {
      [info]: newNamesArray,
    });
  };

  const arrayItems = newDataItem.map((item, index) => {
    return (
      <section key={index} className="fk_item_component-items__columns">
        <span className="fk_item_component-items__columns--counter">
          {index + 1}.
        </span>
        {editIndex !== index && (
          <>
            <span className="fk_item_component-items__columns--item">
              {item.oldName}
            </span>
            {!addActive && (
              <>
                <i
                  className="fa-regular fa-pen-to-square fk_item_component--fa-pen-to-square"
                  onClick={() => handleActiveItem(index)}
                ></i>

                <i
                  className="fa-regular fa-trash-can fk_item_component--fa-trash-can "
                  onDoubleClick={() => handleDelete(index)}
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
              value={item.newName}
              onChange={(e) => handleEdit(e, index)}
            />
            <i
              className="fa-solid fa-xmark fk_item_component--fa-xmark"
              onClick={() => handleEditCancel(index)}
            ></i>
            {/* <i
              className="fa-solid fa-check fk_item_component--fa-check"
              onClick={() => handleUpdateItem(index)}
              style={duplicate ? { display: "none" } : null}
            ></i> */}
            <i
              className="fas fa-check fk_item_component--item--fa-save"
              style={duplicate ? { display: "none" } : null}
              onClick={() => handleUpdateItem(index)}
            ></i>
          </>
        )}
      </section>
    );
  });

  useEffect(() => {
    if (data?.length) {
      const dataSorted = sorted(data);
      const update = dataSorted.map((item) => {
        return {
          oldName: item,
          newName: item,
        };
      });
      setNewDataItem(update);
      // setDataItem(dataSorted);
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
        <section className="fk_item_component--counter">
          <span className="fk_item_component--counter-info">
            {newDataItem ? newDataItem.length : ""}
          </span>
        </section>
        <section className="fk_item_component--title">
          <span >{title}</span>
        </section>

        <section className="fk_item_component--choice">
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
      </section>
      {addActive && (
        <section className="fk_item_component-title__container-add">
          <input
            style={duplicate ? { color: "red", fontWeight: "bold" } : null}
            className="fk_item_component-title__container-add--edit"
            type="text"
            value={addItem.newName}
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
