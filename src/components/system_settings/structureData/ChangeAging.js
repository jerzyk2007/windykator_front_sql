import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";

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

  const sorted = (items) => {
    return items?.slice().sort((a, b) => {
      if (a.TYPE === "first" && b.TYPE !== "first") return -1;
      if (a.TYPE !== "first" && b.TYPE === "first") return 1;
      if (a.TYPE === "last" && b.TYPE !== "last") return 1;
      if (a.TYPE !== "last" && b.TYPE === "last") return -1;
      if (a.FROM_TIME !== undefined && b.FROM_TIME !== undefined) {
        return a.FROM_TIME - b.FROM_TIME;
      }
      return 0;
    });
  };

  const handleActiveItem = (index) => {
    setEditIndex(index);
    setUpdateItem({
      id: dataItem[index].id_aging_items,
      firstValue: dataItem[index].FROM_TIME,
      secondValue: dataItem[index].TO_TIME,
      title: dataItem[index].TITLE,
      type: dataItem[index].TYPE,
    });
  };

  const handleDelete = async (id) => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.delete(
        `/structure/delete-item/${id}/${info}`
      );
      if (result) {
        setDataItem((prev) =>
          prev.filter((item) => item.id_aging_items !== id)
        );
      }
      setDeleteActive(false);
      setEditIndex(null);
    } catch (error) {
      console.error(error);
    } finally {
      setPleaseWait(false);
    }
  };

  const handleDeleteCancel = () => {
    setEditIndex(null);
    setDeleteActive(false);
  };

  const handleAddItem = (e, info) => {
    const newValue = Number(e.target.value);
    setAddItem((prev) => ({
      ...prev,
      [info === "first" ? "firstValue" : "secondValue"]: newValue,
    }));
  };

  const cancelAddItem = () => {
    setAddActive(false);
    setAddItem({ firstValue: "", secondValue: "", title: "" });
  };

  const handleEditCancel = () => setEditIndex(null);

  const handleSomeEdit = (e, id, info) => {
    const newValue = Number(e.target.value);
    const filteredData = dataItem.find((item) => item.id_aging_items === id);

    const updatedObj = {
      ...filteredData,
      FROM_TIME: info === "first" ? newValue : filteredData.FROM_TIME,
      TO_TIME: info === "second" ? newValue : filteredData.TO_TIME,
      TITLE:
        info === "first"
          ? `${newValue} - ${filteredData.TO_TIME}`
          : `${filteredData.FROM_TIME} - ${newValue}`,
    };

    setDataItem(
      dataItem.map((item) => (item.id_aging_items === id ? updatedObj : item))
    );
  };

  const handleFLEdit = (e, id, info) => {
    const newValue = Number(e.target.value);
    const updatedObj = {
      id_aging_items: updateItem.id,
      FROM_TIME: info === "first" ? newValue : updateItem.firstValue,
      TO_TIME: info === "last" ? newValue : updateItem.secondValue,
      TITLE: info === "first" ? `< ${newValue}` : `> ${newValue}`,
      TYPE: info === "first" ? "first" : "last",
    };
    setDataItem(
      dataItem.map((item) => (item.id_aging_items === id ? updatedObj : item))
    );
  };

  const handleUpdateItem = async (id) => {
    setPleaseWait(true);
    try {
      const filteredItem = dataItem.find((item) => item.id_aging_items === id);
      await axiosPrivateIntercept.patch(
        `/structure/change-item/${id}/${info}`,
        { updateData: filteredItem }
      );
      setEditIndex(null);
    } catch (error) {
      console.error(error);
    } finally {
      setPleaseWait(false);
    }
  };

  const handleAcceptNewItem = async () => {
    try {
      setPleaseWait(true);
      const titleStr = `${addItem.firstValue} - ${addItem.secondValue}`;
      const newItem = {
        FROM_TIME: addItem.firstValue,
        TO_TIME: addItem.secondValue,
        TITLE: titleStr,
        TYPE: "some",
      };
      const result = await axiosPrivateIntercept.post(
        `/structure/new-item/${info}`,
        { data: newItem }
      );
      if (result) {
        setDataItem(sorted(result.data));
      }
      setAddItem({ firstValue: "", secondValue: "", title: "" });
      setAddActive(false);
    } catch (error) {
      console.error(error);
    } finally {
      setPleaseWait(false);
    }
  };

  useEffect(() => {
    setDataItem(sorted(data));
  }, [data]);

  return (
    <section className="org-str-aging">
      {!pleaseWait ? (
        <>
          <header className="org-str-aging__header">
            <div className="org-str-aging__count-badge">
              <span>{dataItem?.length || 0}</span>
            </div>
            <div className="org-str-aging__title">
              <span>{title}</span>
            </div>
            <div className="org-str-aging__add-btn">
              {!addActive && (
                <i
                  className="fa-solid fa-plus"
                  onClick={() => setAddActive(true)}
                ></i>
              )}
            </div>
          </header>

          {addActive && (
            <section className="org-str-aging__form org-str-aging__form--new">
              <div className="org-str-aging__form-inputs--row">
                <input
                  className="org-str-aging__input"
                  type="number"
                  placeholder="Od"
                  value={addItem.firstValue}
                  onChange={(e) => handleAddItem(e, "first")}
                />
                <input
                  className="org-str-aging__input"
                  type="number"
                  placeholder="Do"
                  value={addItem.secondValue}
                  onChange={(e) => handleAddItem(e, "second")}
                />
              </div>
              <div className="org-str-aging__form-actions">
                <Button variant="text" size="small" onClick={cancelAddItem}>
                  Anuluj
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={handleAcceptNewItem}
                >
                  Dodaj
                </Button>
              </div>
            </section>
          )}

          <section className="org-str-aging__list">
            {dataItem.map((item, index) => (
              <div
                key={item.id_aging_items || index}
                className={`org-str-aging__row ${
                  editIndex === index ? "org-str-aging__row--active" : ""
                }`}
              >
                {editIndex !== index ? (
                  <>
                    <span className="org-str-aging__row-counter">
                      {index + 1}.
                    </span>
                    <span className="org-str-aging__row-name">
                      {item.TITLE}
                    </span>
                    <section className="org-str-aging__row-actions">
                      <i
                        className="fa-solid fa-pen org-str-aging__icon--edit-trigger"
                        onClick={() => handleActiveItem(index)}
                      ></i>
                      {item.TYPE === "some" ? (
                        <i
                          className="fa-solid fa-trash org-str-aging__icon--delete-trigger"
                          onDoubleClick={() => {
                            setEditIndex(index);
                            setDeleteActive(true);
                          }}
                        ></i>
                      ) : (
                        <i className="org-str-aging__icon--placeholder"></i>
                      )}
                    </section>
                  </>
                ) : !deleteActive ? (
                  /* PANEL EDYCJI */
                  <div className="org-str-aging__mode-panel org-str-aging__mode-panel--edit">
                    <div className="org-str-aging__mode-header">
                      <i className="fa-solid fa-pen-to-square"></i>
                      <span>Edycja wiekowania</span>
                    </div>
                    <div className="org-str-aging__form-inputs--row">
                      {item.TYPE === "some" ? (
                        <>
                          <input
                            className="org-str-aging__input"
                            type="number"
                            value={item.FROM_TIME}
                            onChange={(e) =>
                              handleSomeEdit(e, item.id_aging_items, "first")
                            }
                          />
                          <input
                            className="org-str-aging__input"
                            type="number"
                            value={item.TO_TIME}
                            onChange={(e) =>
                              handleSomeEdit(e, item.id_aging_items, "second")
                            }
                          />
                        </>
                      ) : (
                        <div className="org-str-aging__fl-edit-group">
                          <span>{item.TYPE === "first" ? "<" : ">"}</span>
                          <input
                            className="org-str-aging__input"
                            type="number"
                            value={
                              item.TYPE === "first"
                                ? item.FROM_TIME
                                : item.TO_TIME
                            }
                            onChange={(e) =>
                              handleFLEdit(
                                e,
                                item.id_aging_items,
                                item.TYPE === "first" ? "first" : "last"
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div className="org-str-aging__form-actions">
                      <Button
                        variant="text"
                        size="small"
                        onClick={handleEditCancel}
                      >
                        Anuluj
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleUpdateItem(item.id_aging_items)}
                      >
                        Zapisz
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* PANEL USUWANIA */
                  <div className="org-str-aging__mode-panel org-str-aging__mode-panel--delete">
                    <div className="org-str-aging__mode-header">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                      <span>Potwierdź usunięcie</span>
                    </div>
                    <div className="org-str-aging__message-content">
                      Czy usunąć zakres <strong>{item.TITLE}</strong>?
                    </div>
                    <div className="org-str-aging__form-actions">
                      <Button
                        variant="text"
                        size="small"
                        onClick={handleDeleteCancel}
                      >
                        Anuluj
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(item.id_aging_items)}
                      >
                        Usuń
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        </>
      ) : null}
    </section>
  );
};

export default FKItemAging;
