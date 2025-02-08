import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";

import "./ItemComponent.css";

const FKItemComponent = ({ data, info, title }) => {

  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [newDataItem, setNewDataItem] = useState([]);
  const [duplicate, setDuplicate] = useState(false);
  const [mailDuplicate, setMailDuplicate] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [addActive, setAddActive] = useState(false);
  const [deleteActive, setDeleteActive] = useState(false);
  // const [addItem, setAddItem] = useState({ oldName: "", newName: "" });
  const [addItem, setAddItem] = useState({
    oldName: "", newName: "",
    oldMail: '', newMail: ""
  });
  const [checkMail, setCheckMail] = useState(false);

  //sprawdzenie czy zapis ma formę adresu mailowego
  const MAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    setMailDuplicate(true);
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
          newMail: item.oldMail
        };
      } else {
        return item;
      }
    });
    setNewDataItem(update);
    setEditIndex(null);
  };

  //anulowanie usunięcia
  const handleDeleteCancel = () => {
    setDeleteActive(false);
    setEditIndex(null);
  };

  // usuwanie pojedyńczego elementu
  const handleDeleteItems = async (id) => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.delete(`/items/delete-item/${id}/${info}`);

      if (result) {
        setNewDataItem(prevItems => prevItems.filter(item => item.id !== id));
      }

      setDeleteActive(false);
      setEditIndex(null);

    }
    catch (error) {
      console.error('Delete Error:', error.response?.data || error.message);
    }
    finally {
      setPleaseWait(false);
    }
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
      setMailDuplicate(true);
    } else {
      setMailDuplicate(false);
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

    const mailVerify = MAIL_REGEX.test(e.target.value);
    setCheckMail(mailVerify);
    setNewDataItem(update);

  };

  // // zatwierdzenie danych po edycji
  const handleUpdateItem = async (data, id) => {
    setPleaseWait(true);


    try {
      const result = await axiosPrivateIntercept.patch(`/items/change-item/${data.id}/${info}`, {
        data
      });

      if (result) {
        const update = newDataItem.map((item, index) => {
          if (index === id) {
            return {
              ...data,
              oldName: data.newName
            };
          }
          else {
            return item;
          }
        });
        setNewDataItem(update);

      }
      setEditIndex(null);
    }


    catch (error) {
      console.error(error);
    }
    finally {
      setPleaseWait(false);
    }
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

  // // funkcja wywoływana w inpucie dodawania nowego wpisu
  const handleAddMail = (e) => {
    setAddItem(prev => {
      return {
        ...prev,
        oldMail: e.target.value,
        newMail: e.target.value,
      };

    });
    const mailVerify = MAIL_REGEX.test(e.target.value);
    setCheckMail(mailVerify);
  };

  // funkcja zatwierdzająca nowe dane
  const handleAcceptNewItem = async () => {
    try {
      setPleaseWait(true);
      if (addItem) {
        await axiosPrivateIntercept.post(`/items/new-item/${info}`
          , {
            // [info]: addItem,
            data: addItem,
          }
        );
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
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setPleaseWait(false);
    }
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
                  onDoubleClick={() => {
                    handleActiveItem(index);
                    setDeleteActive(true);
                  }}
                ></i>
              </>
            )}
          </>
        )}
        {editIndex === index && !deleteActive && (
          <section className="item_component-title__container-add">
            <section className="item_component-title__container-data">

              <input
                style={duplicate ? { color: "red", fontWeight: "bold" } : null}
                className="item_component-title__container-data--text"
                type="text"
                value={item.newName}
                onChange={(e) => handleEdit(e, index)}
              />

              {info === "OWNER" && <input
                style={mailDuplicate ? { color: "red", fontWeight: "bold" } : null}
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
                // disabled={info === "owner" ? (!mailDuplicate || !duplicate) : !duplicate ? false : true}
                // disabled={!duplicate ? false : true}
                disabled={info === "OWNER" ? (mailDuplicate && duplicate) : !duplicate && item.newName ? false : true}
                onClick={() => handleUpdateItem(item, index)}
              >
                Zatwierdź
              </Button>
            </section>
          </section>
        )}
        {editIndex === index && deleteActive &&

          (<section className="item_component-title__container-add">
            <section className="item_component-title__container-data">

              {/* <input
                style={duplicate ? { color: "red", fontWeight: "bold" } : null}
                className="item_component-title__container-data--text"
                type="text"
                value={item.newName}
              // onChange={(e) => handleEdit(e, index)}
              /> */}
              <span className="item_component-message">Potwierdź usunięcie</span>
              <span className="item_component-message">{item.newName}</span>

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
                onClick={() => handleDeleteItems(item.id)}
              >
                USUŃ
              </Button>
            </section>
          </section>)

        }
      </section>
    );
  });


  useEffect(() => {
    if (data?.length) {
      if (info !== "OWNER") {
        const update = data.map((item) => {
          return {
            id: item[`id_${info.toLowerCase()}_items`],
            oldName: item[info],
            newName: item[info],
          };
        }).sort((a, b) => a.newName.localeCompare(b.newName));
        setNewDataItem(update);
      }
      else {
        const update = data.map((item) => {
          return {
            id: item[`id_${info.toLowerCase()}_items`],
            oldName: item[info],
            newName: item[info],
            oldMail: item.OWNER_MAIL,
            newMail: item.OWNER_MAIL,
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
      {!pleaseWait ? <>
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
              <i
                className="fa-solid fa-plus item_component--title--fa-plus"
                onClick={() => setAddActive(true)}
              ></i>
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
                placeholder={(info === "OWNER" || info === "GUARDIAN") ? "nazwisko i imię" : ""}
                value={addItem.newName}
                onChange={(e) => handleAddItem(e)}
              />
              {info === "OWNER" && <input
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
                disabled={info === "OWNER" ? !checkMail : addItem.newName && !duplicate ? false : true}
                onClick={handleAcceptNewItem}
              >
                Dodaj
              </Button>
              {/* )} */}
            </section>
          </section>
        )
        }

        <section className="item_component-items__container">
          {arrayItems.sort()}
        </section>
      </> : <></>}
    </section >
  );
};

export default FKItemComponent;
