import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";

import "./FKLocalization.css";

const FKLocalizaton = ({ data }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [localization, setLocalization] = useState([]);
  const [duplicate, setDuplicate] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [updateDep, setUpdateDep] = useState([]);
  const [addDepActive, setAddDepActive] = useState(false);
  const [addDep, setAddDep] = useState("");

  const handleActiveDep = (index) => {
    setEditIndex(index);
    setUpdateDep(localization);
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  const handleEdit = (e, index) => {
    const newValue = e.target.value.toUpperCase();
    const update = [...localization];
    update[index] = newValue;
    setUpdateDep(update);
    if (!localization.includes(newValue)) {
      setDuplicate(false);
    } else {
      setDuplicate(true);
    }
  };

  const handleDelete = (name) => {
    const deleteDep = localization.filter((dep) => dep !== name);
    setLocalization(deleteDep);
  };

  const handleChangeDep = () => {
    if (updateDep.length && !duplicate) {
      setLocalization(updateDep);
    }
    setEditIndex(null);
  };

  const handleAddDep = (e) => {
    const newValue = e.target.value.toUpperCase();
    setAddDep(newValue);
    if (!localization.includes(newValue)) {
      setDuplicate(false);
    } else {
      setDuplicate(true);
    }
  };

  const updateLocalization = (info) => {
    if (info === "add") {
      const update = [...localization, addDep];
      update.sort();
      setLocalization(update);
      setAddDep("");
      setAddDepActive(false);
    }
  };

  const saveLocalization = async () => {
    const result = await axiosPrivateIntercept.patch(
      `/fk/save-items-data/localization`,
      {
        localization,
      }
    );
  };

  const depItems = localization.map((dep, index) => {
    return (
      <section key={index} className="fk_localization-items__columns">
        <span className="fk_localization-items__columns--counter">
          {index + 1}.
        </span>
        {editIndex !== index && (
          <>
            <span className="fk_localization-items__columns--dep">{dep}</span>
            {!addDepActive && (
              <>
                <i
                  className="fa-regular fa-pen-to-square fk_localization--fa-pen-to-square"
                  onClick={() => handleActiveDep(index)}
                ></i>
                <i
                  className="fa-regular fa-trash-can fk_localization--fa-trash-can"
                  onDoubleClick={() => handleDelete(dep)}
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
              value={updateDep.length ? updateDep[index] : ""}
              onChange={(e) => handleEdit(e, index)}
            />
            <i
              className="fa-solid fa-xmark fk_localization--fa-xmark"
              onClick={handleCancel}
            ></i>
            <i
              className="fa-solid fa-check fk_localization--fa-check"
              onClick={handleChangeDep}
              style={duplicate ? { display: "none" } : null}
            ></i>
          </>
        )}
      </section>
    );
  });

  useEffect(() => {
    setLocalization(data);
  }, [data]);

  useEffect(() => {
    if (addDepActive) {
      setEditIndex(null);
    }
  }, [addDepActive]);

  return (
    <section className="fk_localization">
      <section className="fk_localization-title__container">
        <span className="fk_localization--title">Lokalizacje</span>
        <span className="fk_localization--counter">
          {localization ? localization.length : ""}
        </span>
        {!addDepActive && (
          <>
            <i
              className="fa-solid fa-plus fk_localization--title--fa-plus"
              onClick={() => setAddDepActive(true)}
            ></i>
            <i
              className="fas fa-save fk_localization--title--fa-save"
              onClick={saveLocalization}
            ></i>
          </>
        )}
      </section>
      {addDepActive && (
        <section className="fk_localization-title__container-add">
          <input
            style={duplicate ? { color: "red", fontWeight: "bold" } : null}
            className="fk_localization-title__container-add--edit"
            type="text"
            value={addDep}
            onChange={(e) => handleAddDep(e)}
          />
          <section className="fk_localization-title__container-add--panel">
            <i
              className="fa-solid fa-xmark fk_localization--fa-xmark"
              onClick={() => setAddDepActive(false)}
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
        {depItems.sort()}
      </section>
    </section>
  );
};

export default FKLocalizaton;
