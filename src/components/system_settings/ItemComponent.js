import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";

import "./ItemComponent.css";

const FKItemComponent = ({ data, info, title, multiCompany }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [startData, setStartData] = useState(data || []);
  const [pleaseWait, setPleaseWait] = useState(false);
  const [newDataItem, setNewDataItem] = useState([]);
  const [duplicate, setDuplicate] = useState(false);
  const [mailDuplicate, setMailDuplicate] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [addActive, setAddActive] = useState(false);
  const [deleteActive, setDeleteActive] = useState(false);
  const [addItem, setAddItem] = useState({
    oldName: "", newName: "",
    oldMail: "", newMail: "",
    company: "", oldCompany: ""
  });
  const [checkMail, setCheckMail] = useState(false);
  const [company, setCompany] = useState([]);
  const [addItemCompany, setAddItemCompany] = useState([]);
  const [changeCompany, setChangeCompany] = useState(multiCompany.length > 1 ? "ALL" : multiCompany.length === 1 ? multiCompany[0] : '');

  //sprawdzenie czy zapis ma formę adresu mailowego
  const MAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //włącza możliwość edycji
  const handleActiveItem = (index) => {
    if (!editIndex) {
      setDuplicate(true);
      setMailDuplicate(true);
      setEditIndex(index);
    }
  };

  // wyjście z edycji
  const handleEditCancel = (id) => {
    const updateNewDataIltem = [...newDataItem];
    const update = updateNewDataIltem.map((item, index) => {
      if (item.id === id) {
        return {
          ...item,
          newName: item.oldName,
          newMail: item.oldMail,
          company: item.oldCompany
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
      // const result = true;
      if (result) {
        setNewDataItem(prevItems => prevItems.filter(item => item.id !== id));
        setStartData(prevItems => prevItems.filter(item => item[`id_${info.toLowerCase()}_items`] !== id));
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
      newMail: "",
      company: "",
      oldCompany: ""
    });
  };

  // funkcja wywoływana podczas pisania w input - edycja tekstu
  const handleEdit = (e, id, type) => {
    const newValue = e.target.value;
    let update = [...newDataItem];

    const newFilterData = [...newDataItem];
    if (type === "name") {
      update = update.map((item) =>
        item.id === id ? { ...item, newName: newValue } : item
      );
    } else if (type === "company") {
      update = update.map((item) =>
        item.id === id ? { ...item, company: newValue } : item
      );
    }

    setNewDataItem(update);

    const nameFilter = newFilterData.filter(item => item.id === id);
    const name = type === 'name' ? newValue : nameFilter[0].oldName;
    const company = type === 'company' ? newValue : nameFilter[0].company;

    const checkDuplicate = info !== "AREA" ? startData.some(
      (item) =>
        (item[`id_${info.toLowerCase()}_items`] !== id && item.COMPANY === company && item[info].toLowerCase() === name.toLowerCase()) ||
        (item[`id_${info.toLowerCase()}_items`] === id && item.COMPANY === company && item[info].toLowerCase() === name.toLowerCase())

    ) : startData.some(
      (item) =>
        (item[`id_${info.toLowerCase()}_items`] !== id && item[info].toLowerCase() === name.toLowerCase()) ||
        (item[`id_${info.toLowerCase()}_items`] === id && item[info].toLowerCase() === name.toLowerCase())

    );
    setDuplicate(checkDuplicate);

  };

  const handleEditMail = (e, id) => {
    const newValue = e.target.value;
    const updateNewDataIltem = [...newDataItem];
    const checkDuplicate = newDataItem.some(
      (item) =>
        item.oldMail === newValue.toLowerCase()

    );
    setMailDuplicate(checkDuplicate);

    const mailVerify = MAIL_REGEX.test(newValue);
    setCheckMail(mailVerify);

    const update = updateNewDataIltem.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          newMail: newValue,
        };
      } else {
        return item;
      }
    });

    setNewDataItem(update);
  };

  // // zatwierdzenie danych po edycji
  const handleUpdateItem = async (updateData) => {
    setPleaseWait(true);
    try {
      const result = await axiosPrivateIntercept.patch(`/items/change-item/${updateData.id}/${info}`, {
        updateData
      });

      // const result = true;
      if (result) {
        const update = newDataItem.map((item) => {
          if (item.id === updateData.id) {
            return {
              ...item,
              oldName: item.newName,
              oldCompany: item.company
            };
          }
          else {
            return item;
          }
        });

        setNewDataItem(update);
        const updateStartData = startData.map(item => {
          if (item[`id_${info.toLowerCase()}_items`] === updateData.id && info !== "OWNER") {
            return {
              ...item,
              [info]: updateData.newName,
              COMPANY: updateData.company,
            };

          } else if (item[`id_${info.toLowerCase()}_items`] === updateData.id && info === "OWNER") {
            return {
              ...item,
              [info]: updateData.newName,
              COMPANY: updateData.company,
              OWNER_MAIL: updateData.newMail,
            };
          }

          else {
            return item;
          }
        });

        setStartData(updateStartData);
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
  const handleAddItem = (e, type) => {
    const newValue = e.target.value;
    if (type === "name") {
      setAddItem(prev => {
        return {
          ...prev,
          oldName: newValue,
          newName: newValue,
          company: info === "AREA" ? "ALL" : prev.company,
          oldCompany: info === "AREA" ? "ALL" : prev.oldCompany,
        };
      });
    } else if (type === "company") {
      setAddItem(prev => {
        return {
          ...prev,
          company: newValue,
          oldCompany: newValue,
        };
      });
    }

    const name = type === 'name' ? newValue : addItem.oldName;
    const company = type === 'company' ? newValue : addItem.company;

    // const checkDuplicate1 = startData.some(
    //   (item) =>
    //     (item.COMPANY === company && item[info].toLowerCase() === name.toLowerCase())
    // );
    const checkDuplicate = info !== "AREA" ? startData.some(
      (item) =>
        (item.COMPANY === company && item[info].toLowerCase() === name.toLowerCase())
    ) : startData.some(
      (item) =>
        (item[info].toLowerCase() === name.toLowerCase())
    );
    setDuplicate(checkDuplicate);

  };

  // // funkcja wywoływana w inpucie dodawania nowego wpisu
  const handleAddMail = (e) => {
    const newValue = e.target.value;

    setAddItem(prev => {
      return {
        ...prev,
        oldMail: newValue,
        newMail: newValue
      };

    });

    const checkDuplicate = newDataItem.some(
      (item) =>
        item.oldMail === newValue.toLowerCase()

    );

    setMailDuplicate(checkDuplicate);
    const mailVerify = MAIL_REGEX.test(newValue);
    setCheckMail(mailVerify);



  };

  // funkcja zatwierdzająca nowe dane
  const handleAcceptNewItem = async () => {
    try {
      setPleaseWait(true);
      if (addItem) {
        const result = await axiosPrivateIntercept.post(`/items/new-item/${info}`
          , {
            data: addItem,
          }
        );
        // const result = true;
        if (result) {
          const update = [...newDataItem, addItem];
          setNewDataItem(update);
          setStartData(result.data);
        }
      }

      setAddItem({
        oldName: "", newName: "",
        oldMail: '', newMail: "", company: "", oldCompany: ""
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
            {info !== "AREA" && <span className="item_component-items__columns--company">
              {item.company}
            </span>}
            {!addActive && (
              <section className="item_component-items__columns--panel">
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
              </section>
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
                onChange={(e) => handleEdit(e, item.id, 'name')}
              />

              {info !== "AREA" && <select
                className="item_component-title__container-data--text"
                value={item.company}
                onChange={(e) => handleEdit(e, item.id, 'company')}
              >

                {multiCompany.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>}

              {info === "OWNER" &&
                <input
                  style={mailDuplicate ? { color: "red", fontWeight: "bold" } : null}
                  className="item_component-title__container-data--text"
                  type="text"
                  value={item.newMail ? item.newMail : ""}
                  onChange={(e) => handleEditMail(e, item.id)}
                />

              }
            </section>
            <section className="item_component-title__container-add--panel">
              < Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleEditCancel(item.id)}
              >
                Anuluj
              </Button>
              < Button
                variant="contained"
                color="success"
                size="small"
                // disabled={info === "owner" ? (!mailDuplicate || !duplicate) : !duplicate ? false : true}
                // disabled={!duplicate ? false : true}
                disabled={info === "OWNER" ? (mailDuplicate || !checkMail) : !duplicate && item.newName ? false : true}
                onClick={() => handleUpdateItem(item)}
              >
                Zatwierdź
              </Button>
            </section>
          </section>
        )}
        {editIndex === index && deleteActive &&

          (<section className="item_component-title__container-add">
            <section className="item_component-title__container-data">

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

  const filteredData = (companyName) => {
    if (startData?.length) {
      if (companyName === "ALL") {
        return (startData);
      } else {

        return startData.filter(item => item.COMPANY === companyName);
      }
    } else return [];
  };

  const sortedData = (dataset) => {
    if (dataset?.length) {
      if (info !== "OWNER") {

        const update = dataset.map((item) => {
          return {
            id: item[`id_${info.toLowerCase()}_items`],
            // id: index,
            oldName: item[info],
            newName: item[info],
            company: item.COMPANY,
            oldCompany: item.COMPANY,
          };
        }).sort((a, b) => a.newName.localeCompare(b.newName));
        setNewDataItem(update);
      }
      else {
        const update = dataset.map((item) => {
          return {
            // id: `id_${info.toLowerCase()}_items`,
            id: item[`id_${info.toLowerCase()}_items`],
            oldName: item[info],
            newName: item[info],
            oldMail: item.OWNER_MAIL,
            newMail: item.OWNER_MAIL,
            company: item.COMPANY,
            oldCompany: item.COMPANY,
          };
        }).sort((a, b) => a.newName.localeCompare(b.newName));
        setNewDataItem(update);
      }

    } else {
      setNewDataItem([]);
    }
  };


  useEffect(() => {
    if (addActive) {
      setEditIndex(null);
    }
  }, [addActive]);

  useEffect(() => {

    setCompany(multiCompany.length > 1 ? ['ALL', ...multiCompany] : multiCompany.length === 1 ? multiCompany : []);
    setAddItemCompany(multiCompany.length ? [...multiCompany] : []);
  }, [multiCompany]);

  useEffect(() => {
    const newData = filteredData(changeCompany);
    sortedData(newData);
    setEditIndex(null);
    handleAddCancel();
  }, [company, changeCompany, startData]);


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
            {info !== "AREA" ? multiCompany.length > 1 ? <select
              className="edit_doc--select"
              value={changeCompany}
              onChange={(e) => setChangeCompany(e.target.value)}
            >
              {company.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select> : <span>{multiCompany}</span> : null}
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
                onChange={(e) => handleAddItem(e, "name")}
              />
              {info !== "AREA" && <select
                className="item_component-title__container-data--text"
                value={addItem.company}
                onChange={(e) => handleAddItem(e, 'company')}
              >
                <option value="" disabled hidden>
                  -- Wybierz firmę --
                </option>
                {addItemCompany.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>}
              {info === "OWNER" && <input
                style={mailDuplicate ? { color: "red", fontWeight: "bold" } : null}
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
              < Button
                variant="contained"
                color="success"
                size="small"
                disabled={info === "OWNER"
                  ? !(checkMail && !mailDuplicate && !duplicate && addItem.newMail ? true : false && addItem.company ? true : false && addItem.newMail ? true : false)
                  : addItem.newName && addItem.company && !duplicate ? false : true}

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
