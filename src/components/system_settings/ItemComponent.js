import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";

import "./ItemComponent.css";

const FKItemComponent = ({ data, info, title, setPleaseWait }) => {

  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [newDataItem, setNewDataItem] = useState([]);
  const [duplicate, setDuplicate] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [addActive, setAddActive] = useState(false);
  // const [addItem, setAddItem] = useState({ oldName: "", newName: "" });
  const [addItem, setAddItem] = useState({
    oldName: "", newName: "",
    oldMail: '', newMail: ""
  });
  const [checkMail, setCheckMail] = useState(false);

  //sprawdzenie czy zapis ma formę adresu mailowego
  const USER_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      oldMail: '',
      newMail: ""
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

  const handleEditMail = (e, id) => {
    const newValue = e.target.value;
    const updateNewDataIltem = [...newDataItem];
    const checkDuplicate = newDataItem.some(
      (item) =>
        item.oldMail === newValue.toLowerCase()

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
          newMail: newValue,
        };
      } else {
        return item;
      }
    });

    const mailVerify = USER_REGEX.test(e.target.value);
    setCheckMail(mailVerify);
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
    setAddItem(prev => {
      return {
        ...prev,
        oldName: e.target.value,
        newName: e.target.value,
      };
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

  // funkcja wywoływana w inpucie dodawania nowego wpisu
  const handleAddMail = (e) => {
    setAddItem(prev => {
      return {
        ...prev,
        oldMail: e.target.value,
        newMail: e.target.value,
      };

    });
    const mailVerify = USER_REGEX.test(e.target.value);
    setCheckMail(mailVerify);
  };

  // funkcja zatwierdzająca nowe dane
  const handleAcceptNewItem = () => {
    if (addItem) {
      const update = [...newDataItem, addItem];
      const sortedData = sorted(update);
      setNewDataItem(sortedData);
    }

    setAddItem({
      oldName: "", newName: "",
      oldMail: '', newMail: ""
    });
    setCheckMail(false);

    setAddActive(false);
  };

  // zapis do bazy danych
  const saveData = async () => {

    const newNamesArray = info !== "owners" ? newDataItem.map((item) => item.newName) : newDataItem;
    setPleaseWait(true);
    await axiosPrivateIntercept.patch(`/fk/save-items-data/${info}`, {
      [info]: newNamesArray,
    });
    setPleaseWait(false);

  };

  const arrayItems = newDataItem.map((item, index) => {
    return (
      <section key={index} className="item_component-items__columns">
        {editIndex !== index && (
          <>
            <span className="item_component-items__columns--counter">
              {index + 1}.
            </span>

            <span className="item_component-items__columns--item">
              {item.oldName}
            </span>
            {!addActive && (
              <>
                <i
                  className="fa-regular fa-pen-to-square item_component--fa-pen-to-square"
                  onClick={() => handleActiveItem(index)}
                ></i>

                <i
                  className="fa-regular fa-trash-can item_component--fa-trash-can "
                  onDoubleClick={() => handleDelete(index)}
                ></i>
              </>
            )}
          </>
        )}

        {editIndex === index && (
          <section className="item_component-title__container-add">
            <section className="item_component-title__container-data">

              <input
                style={duplicate ? { color: "red", fontWeight: "bold" } : null}
                className="item_component-title__container-data--text"
                type="text"
                value={item.newName}
                onChange={(e) => handleEdit(e, index)}
              />

              {info === "owners" && <input
                style={duplicate ? { color: "red", fontWeight: "bold" } : null}
                className="item_component-title__container-data--text"
                type="text"
                value={item.newMail ? item.newMail : ""}
                onChange={(e) => handleEditMail(e, index)}
              />}
            </section>
            <section className="item_component-title__container-add--panel">
              < Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleEditCancel(index)}
              >
                Anuluj
              </Button>
              < Button
                variant="contained"
                color="success"
                size="small"
                disabled={info === "owners" ? !checkMail : !duplicate ? false : true}
                onClick={() => handleUpdateItem(index)}
              >
                Zatwierdź
              </Button>
            </section>
          </section>
        )}
      </section>
    );
  });

  useEffect(() => {
    if (data?.length) {
      if (info !== "owners") {
        const dataSorted = sorted(data);
        const update = dataSorted.map((item) => {
          return {
            oldName: item,
            newName: item,
          };
        });
        setNewDataItem(update);
      } else {
        const update = data.map((item) => {
          return {
            oldName: item.owner,
            newName: item.owner,
            oldMail: item.owner_mail,
            newMail: item.owner_mail,
          };
        }).sort((a, b) => a.newName.localeCompare(b.newName));
        setNewDataItem(update);
      }

    }
  }, [data]);

  useEffect(() => {
    if (addActive) {
      setEditIndex(null);
    }
  }, [addActive]);

  return (
    <section className="item_component">
      <section className="item_component-title__container">
        <section className="item_component--counter">
          <span className="item_component--counter-info">
            {newDataItem ? newDataItem.length : ""}
          </span>
        </section>
        <section className="item_component--title">
          <span >{title}</span>
        </section>

        <section className="item_component--choice">
          {!addActive && (
            <>
              <i
                className="fa-solid fa-plus item_component--title--fa-plus"
                onClick={() => setAddActive(true)}
              ></i>
              <i
                className="fas fa-save item_component--title--fa-save"
                onClick={saveData}
              ></i>
            </>
          )}

        </section>
      </section>
      {addActive && (
        <section className="item_component-title__container-add">

          <section className="item_component-title__container-data">
            <input
              style={duplicate ? { color: "red", fontWeight: "bold" } : null}
              className="item_component-title__container-data--text"
              type="text"
              placeholder={(info === "owners" || info === "guardians") ? "nazwisko i imię" : ""}
              value={addItem.newName}
              onChange={(e) => handleAddItem(e)}
            />
            {info === "owners" && <input
              style={duplicate ? { color: "red", fontWeight: "bold" } : null}
              className="item_component-title__container-data--text"
              type="text"
              placeholder="adres mailowy"
              value={addItem.newMail}
              onChange={(e) => handleAddMail(e)}
            />}
          </section>


          <section className="item_component-title__container-add--panel">

            < Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleAddCancel}
            >
              Anuluj
            </Button>
            {/* {!duplicate && ( */}
            < Button
              variant="contained"
              color="success"
              size="small"
              disabled={info === "owners" ? !checkMail : addItem.newName && !duplicate ? false : true}
              onClick={handleAcceptNewItem}
            >
              Zatwierdź
            </Button>
            {/* )} */}
          </section>
        </section>
      )
      }
      <section className="item_component-items__container">
        {arrayItems.sort()}
      </section>
    </section >
  );
};

export default FKItemComponent;
