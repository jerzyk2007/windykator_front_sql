import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";

const OrgStrItemComponent = ({ data, info, title, multiCompany }) => {
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
    oldName: "",
    newName: "",
    oldMail: "",
    newMail: "",
    company: "",
    oldCompany: "",
  });
  const [checkMail, setCheckMail] = useState(false);
  const [company, setCompany] = useState([]);
  const [addItemCompany, setAddItemCompany] = useState([]);
  const [changeCompany, setChangeCompany] = useState(
    multiCompany.length > 1
      ? "ALL"
      : multiCompany.length === 1
      ? multiCompany[0]
      : ""
  );

  const MAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleActiveItem = (index) => {
    if (!editIndex) {
      setDuplicate(false);
      setMailDuplicate(false);
      setEditIndex(index);
    }
  };

  const handleEditCancel = (id) => {
    const update = newDataItem.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          newName: item.oldName,
          newMail: item.oldMail,
          company: item.oldCompany,
        };
      }
      return item;
    });
    setNewDataItem(update);
    setEditIndex(null);
  };

  const handleDeleteCancel = () => {
    setDeleteActive(false);
    setEditIndex(null);
  };

  const handleDeleteItems = async (id) => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.delete(
        `/structure/delete-item/${id}/${info}`
      );
      if (result) {
        setNewDataItem((prev) => prev.filter((item) => item.id !== id));
        setStartData((prev) =>
          prev.filter((item) => item[`id_${info.toLowerCase()}_items`] !== id)
        );
      }
      setDeleteActive(false);
      setEditIndex(null);
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error.message);
    } finally {
      setPleaseWait(false);
    }
  };

  const handleAddCancel = () => {
    setAddActive(false);
    setAddItem({
      oldName: "",
      newName: "",
      oldMail: "",
      newMail: "",
      company: "",
      oldCompany: "",
    });
  };

  const handleEdit = (e, id, type) => {
    const newValue = e.target.value;
    let update = [...newDataItem];
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

    const currentItem = update.find((item) => item.id === id);
    const name = type === "name" ? newValue : currentItem.oldName;
    const comp = type === "company" ? newValue : currentItem.company;

    const checkDuplicate =
      info !== "AREA"
        ? startData.some(
            (item) =>
              item.COMPANY === comp &&
              item[info].toLowerCase() === name.toLowerCase()
          )
        : startData.some(
            (item) => item[info].toLowerCase() === name.toLowerCase()
          );
    setDuplicate(checkDuplicate);

    if (info === "OWNER") {
      const currentMail = currentItem.newMail || currentItem.oldMail;
      if (currentMail) {
        const checkMailDuplicate = update.some(
          (item) =>
            item.id !== id &&
            item.oldMail?.toLowerCase() === currentMail.toLowerCase() &&
            item.company === comp
        );
        setMailDuplicate(checkMailDuplicate);
      }
    }
  };

  const handleEditMail = (e, id) => {
    const newValue = e.target.value;
    const currentItem = newDataItem.find((item) => item.id === id);
    const currentCompany = currentItem ? currentItem.company : "";

    const checkDuplicate = newDataItem.some(
      (item) =>
        item.id !== id &&
        item.oldMail?.toLowerCase() === newValue.toLowerCase() &&
        item.company === currentCompany
    );
    setMailDuplicate(checkDuplicate);
    setCheckMail(MAIL_REGEX.test(newValue));

    const update = newDataItem.map((item) =>
      item.id === id ? { ...item, newMail: newValue } : item
    );
    setNewDataItem(update);
  };

  const handleUpdateItem = async (updateData) => {
    setPleaseWait(true);
    try {
      const result = await axiosPrivateIntercept.patch(
        `/structure/change-item/${updateData.id}/${info}`,
        { updateData }
      );
      if (result) {
        setNewDataItem(
          newDataItem.map((item) =>
            item.id === updateData.id
              ? {
                  ...item,
                  oldName: item.newName,
                  oldCompany: item.company,
                  oldMail: item.newMail,
                }
              : item
          )
        );
        setStartData(
          startData.map((item) => {
            if (item[`id_${info.toLowerCase()}_items`] === updateData.id) {
              return {
                ...item,
                [info]: updateData.newName,
                COMPANY: updateData.company,
                ...(info === "OWNER" && { OWNER_MAIL: updateData.newMail }),
              };
            }
            return item;
          })
        );
      }
      setEditIndex(null);
    } catch (error) {
      console.error(error);
    } finally {
      setPleaseWait(false);
    }
  };

  const handleAddItem = (e, type) => {
    const newValue = e.target.value;
    let nextName = addItem.oldName;
    let nextCompany = addItem.company;

    if (type === "name") {
      nextName = newValue;
      setAddItem((prev) => ({
        ...prev,
        oldName: newValue,
        newName: newValue,
        company: info === "AREA" ? "ALL" : prev.company,
      }));
    } else if (type === "company") {
      nextCompany = newValue;
      setAddItem((prev) => ({
        ...prev,
        company: newValue,
        oldCompany: newValue,
      }));
    }

    const checkDuplicate =
      info !== "AREA"
        ? startData.some(
            (item) =>
              item.COMPANY === nextCompany &&
              item[info].toLowerCase() === nextName.toLowerCase()
          )
        : startData.some(
            (item) => item[info].toLowerCase() === nextName.toLowerCase()
          );
    setDuplicate(checkDuplicate);
  };

  const handleAddMail = (e) => {
    const newValue = e.target.value;
    setAddItem((prev) => ({ ...prev, oldMail: newValue, newMail: newValue }));
    setMailDuplicate(
      newDataItem.some(
        (item) =>
          item.oldMail?.toLowerCase() === newValue.toLowerCase() &&
          item.company === addItem.company
      )
    );
    setCheckMail(MAIL_REGEX.test(newValue));
  };

  const handleAcceptNewItem = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.post(
        `/structure/new-item/${info}`,
        { data: addItem }
      );
      if (result) {
        setStartData(result.data);
      }
      setAddItem({
        oldName: "",
        newName: "",
        oldMail: "",
        newMail: "",
        company: "",
        oldCompany: "",
      });
      setCheckMail(false);
      setAddActive(false);
    } catch (error) {
      console.error(error);
    } finally {
      setPleaseWait(false);
    }
  };

  const filteredData = (companyName) => {
    if (!startData?.length) return [];
    return companyName === "ALL"
      ? startData
      : startData.filter((item) => item.COMPANY === companyName);
  };

  const sortedData = (dataset) => {
    if (!dataset?.length) {
      setNewDataItem([]);
      return;
    }
    const update = dataset
      .map((item) => ({
        id: item[`id_${info.toLowerCase()}_items`],
        oldName: item[info],
        newName: item[info],
        company: item.COMPANY,
        oldCompany: item.COMPANY,
        ...(info === "OWNER" && {
          oldMail: item.OWNER_MAIL,
          newMail: item.OWNER_MAIL,
        }),
      }))
      .sort((a, b) => a.newName.localeCompare(b.newName));
    setNewDataItem(update);
  };

  useEffect(() => {
    if (addActive) setEditIndex(null);
  }, [addActive]);
  useEffect(() => {
    setCompany(
      multiCompany.length > 1 ? ["ALL", ...multiCompany] : multiCompany
    );
    setAddItemCompany(multiCompany);
  }, [multiCompany]);

  useEffect(() => {
    sortedData(filteredData(changeCompany));
    setEditIndex(null);
    handleAddCancel();
  }, [changeCompany, startData]);

  const arrayItems = newDataItem.map((item, index) => (
    // <section key={item.id || index} className="org-str-item__row">
    //   {editIndex !== index ? (
    //     <>
    //       <span className="org-str-item__row-counter">{index + 1}.</span>
    //       <span className="org-str-item__row-name">{item.oldName}</span>
    //       {info !== "AREA" && (
    //         <span className="org-str-item__row-company">{item.company}</span>
    //       )}
    //       {!addActive && (
    //         <section className="org-str-item__row-actions">
    //           <i
    //             className="fa-regular fa-pen-to-square org-str-item__icon--edit"
    //             onClick={() => handleActiveItem(index)}
    //           ></i>
    //           <i
    //             className="fa-regular fa-trash-can org-str-item__icon--delete"
    //             onDoubleClick={() => {
    //               handleActiveItem(index);
    //               setDeleteActive(true);
    //             }}
    //           ></i>
    //         </section>
    //       )}
    //     </>
    //   ) : !deleteActive ? (
    //     <section className="org-str-item__form">
    //       <div className="org-str-item__form-inputs">
    //         <input
    //           className={`org-str-item__input ${
    //             duplicate ? "org-str-item__input--error" : ""
    //           }`}
    //           type="text"
    //           value={item.newName}
    //           onChange={(e) => handleEdit(e, item.id, "name")}
    //         />
    //         {info !== "AREA" && (
    //           <select
    //             className="org-str-item__input"
    //             value={item.company}
    //             onChange={(e) => handleEdit(e, item.id, "company")}
    //           >
    //             {multiCompany.map((option, idx) => (
    //               <option key={idx} value={option}>
    //                 {option}
    //               </option>
    //             ))}
    //           </select>
    //         )}
    //         {info === "OWNER" && (
    //           <input
    //             className={`org-str-item__input ${
    //               mailDuplicate ? "org-str-item__input--error" : ""
    //             }`}
    //             type="text"
    //             value={item.newMail || ""}
    //             onChange={(e) => handleEditMail(e, item.id)}
    //           />
    //         )}
    //       </div>
    //       <div className="org-str-item__form-actions">
    //         <Button
    //           variant="contained"
    //           color="error"
    //           size="small"
    //           onClick={() => handleEditCancel(item.id)}
    //         >
    //           Anuluj
    //         </Button>
    //         <Button
    //           variant="contained"
    //           color="success"
    //           size="small"
    //           disabled={
    //             info === "OWNER"
    //               ? mailDuplicate || !checkMail
    //               : !item.newName || duplicate
    //           }
    //           onClick={() => handleUpdateItem(item)}
    //         >
    //           Zatwierdź
    //         </Button>
    //       </div>
    //     </section>
    //   ) : (
    //     <section className="org-str-item__form">
    //       <div className="org-str-item__form-inputs">
    //         <span className="org-str-item__message">Potwierdź usunięcie</span>
    //         <span className="org-str-item__message--bold">{item.newName}</span>
    //       </div>
    //       <div className="org-str-item__form-actions">
    //         <Button
    //           variant="contained"
    //           color="error"
    //           size="small"
    //           onClick={handleDeleteCancel}
    //         >
    //           Anuluj
    //         </Button>
    //         <Button
    //           variant="contained"
    //           color="success"
    //           size="small"
    //           onClick={() => handleDeleteItems(item.id)}
    //         >
    //           USUŃ
    //         </Button>
    //       </div>
    //     </section>
    //   )}
    // </section>
    <section
      key={item.id || index}
      className={`org-str-item__row ${
        editIndex === index ? "org-str-item__row--active" : ""
      }`}
    >
      {editIndex !== index ? (
        <>
          <span className="org-str-item__row-counter">{index + 1}.</span>
          <span className="org-str-item__row-name">{item.oldName}</span>
          {info !== "AREA" && (
            <span className="org-str-item__row-company">{item.company}</span>
          )}
          {!addActive && (
            <section className="org-str-item__row-actions">
              {/* Nowe ikony: fa-pen i fa-trash-can */}
              <i
                className="fa-solid fa-pen org-str-item__icon--edit-trigger"
                onClick={() => handleActiveItem(index)}
                title="Edytuj"
              ></i>
              <i
                className="fa-solid fa-trash org-str-item__icon--delete-trigger"
                onDoubleClick={() => {
                  handleActiveItem(index);
                  setDeleteActive(true);
                }}
                title="Double click aby usunąć"
              ></i>
            </section>
          )}
        </>
      ) : !deleteActive ? (
        /* NOWOCZESNY PANEL EDYCJI */
        <div className="org-str-item__mode-panel org-str-item__mode-panel--edit">
          <div className="org-str-item__mode-header">
            <i className="fa-solid fa-pen-to-square"></i>
            <span>Edycja elementu</span>
          </div>
          <div className="org-str-item__form-inputs">
            <input
              className={`org-str-item__input ${
                duplicate ? "org-str-item__input--error" : ""
              }`}
              type="text"
              value={item.newName}
              onChange={(e) => handleEdit(e, item.id, "name")}
              autoFocus
            />
            {info !== "AREA" && (
              <select
                className="org-str-item__input"
                value={item.company}
                onChange={(e) => handleEdit(e, item.id, "company")}
              >
                {multiCompany.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {info === "OWNER" && (
              <input
                className={`org-str-item__input ${
                  mailDuplicate ? "org-str-item__input--error" : ""
                }`}
                type="text"
                placeholder="Email"
                value={item.newMail || ""}
                onChange={(e) => handleEditMail(e, item.id)}
              />
            )}
          </div>
          <div className="org-str-item__form-actions">
            <Button
              variant="text"
              size="small"
              onClick={() => handleEditCancel(item.id)}
            >
              Anuluj
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={
                info === "OWNER"
                  ? mailDuplicate || !checkMail
                  : !item.newName || duplicate
              }
              onClick={() => handleUpdateItem(item)}
            >
              Zapisz
            </Button>
          </div>
        </div>
      ) : (
        /* NOWOCZESNY PANEL USUWANIA */
        <div className="org-str-item__mode-panel org-str-item__mode-panel--delete">
          <div className="org-str-item__mode-header">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>Potwierdź usunięcie</span>
          </div>
          <div className="org-str-item__message-content">
            Czy na pewno chcesz usunąć <strong>{item.newName}</strong>?
          </div>
          <div className="org-str-item__form-actions">
            <Button variant="text" size="small" onClick={handleDeleteCancel}>
              Anuluj
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDeleteItems(item.id)}
            >
              Usuń trwale
            </Button>
          </div>
        </div>
      )}
    </section>
  ));

  return (
    <section className="org-str-item">
      {!pleaseWait && (
        <>
          <header className="org-str-item__header">
            <div className="org-str-item__count-badge">
              <span>{newDataItem?.length || 0}</span>
            </div>
            <div className="org-str-item__title">
              <span>{title}</span>
              {info !== "AREA" && multiCompany.length > 1 && (
                <select
                  className="org-str-item__select-filter"
                  value={changeCompany}
                  onChange={(e) => setChangeCompany(e.target.value)}
                >
                  {company.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="org-str-item__add-btn">
              {!addActive && (
                <i
                  className="fa-solid fa-plus"
                  onClick={() => setAddActive(true)}
                ></i>
              )}
            </div>
          </header>

          {addActive && (
            <section className="org-str-item__form org-str-item__form--new">
              <div className="org-str-item__form-inputs">
                <input
                  className={`org-str-item__input ${
                    duplicate ? "org-str-item__input--error" : ""
                  }`}
                  type="text"
                  placeholder={
                    info === "OWNER" || info === "GUARDIAN"
                      ? "nazwisko i imię"
                      : "Nazwa"
                  }
                  value={addItem.newName}
                  onChange={(e) => handleAddItem(e, "name")}
                />
                {info !== "AREA" && (
                  <select
                    className="org-str-item__input"
                    value={addItem.company}
                    onChange={(e) => handleAddItem(e, "company")}
                  >
                    <option value="" disabled hidden>
                      -- Wybierz firmę --
                    </option>
                    {addItemCompany.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {info === "OWNER" && (
                  <input
                    className={`org-str-item__input ${
                      mailDuplicate ? "org-str-item__input--error" : ""
                    }`}
                    type="text"
                    placeholder="adres mailowy"
                    value={addItem.newMail}
                    onChange={handleAddMail}
                  />
                )}
              </div>
              <div className="org-str-item__form-actions">
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={handleAddCancel}
                >
                  Anuluj
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  disabled={
                    info === "OWNER"
                      ? !(
                          checkMail &&
                          !mailDuplicate &&
                          !duplicate &&
                          addItem.newMail &&
                          addItem.company
                        )
                      : !addItem.newName || !addItem.company || duplicate
                  }
                  onClick={handleAcceptNewItem}
                >
                  Dodaj
                </Button>
              </div>
            </section>
          )}

          <section className="org-str-item__list">{arrayItems}</section>
        </>
      )}
    </section>
  );
};

export default OrgStrItemComponent;
