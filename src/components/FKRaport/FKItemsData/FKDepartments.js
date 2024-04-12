import { useState, useEffect } from "react";
import "./FKDepartments.css";

const FKDepartments = ({ data }) => {
  const [departments, setDepartments] = useState([]);
  const [duplicate, setDuplicate] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [updateDep, setUpdateDep] = useState([]);
  const [addDepActive, setAddDepActive] = useState(false);
  const [addDep, setAddDep] = useState("");

  const handleActiveDep = (index) => {
    setEditIndex(index);
    setUpdateDep(departments);
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  const handleEdit = (e, index) => {
    const newValue = e.target.value.toUpperCase();
    const update = [...departments];
    update[index] = newValue;
    setUpdateDep(update);
    if (!departments.includes(newValue)) {
      setDuplicate(false);
    } else {
      setDuplicate(true);
    }
  };

  const handleDelete = (name) => {
    const deleteDep = departments.filter((dep) => dep !== name);
    setDepartments(deleteDep);
  };

  const handleChangeDep = () => {
    if (updateDep.length && !duplicate) {
      setDepartments(updateDep);
    }
    setEditIndex(null);
  };

  const handleAddDep = (e) => {
    const newValue = e.target.value.toUpperCase();
    setAddDep(newValue);
    if (!departments.includes(newValue)) {
      setDuplicate(false);
    } else {
      setDuplicate(true);
    }
  };

  const updateDepartments = (info) => {
    if (info === "add") {
      const update = [...departments, addDep];
      update.sort();
      setDepartments(update);
      setAddDep("");
      setAddDepActive(false);
    }
  };

  const saveDepartments = async () => {
    console.log("save");
  };

  const depItems = departments.map((dep, index) => {
    return (
      <section key={index} className="fk_departments-items__columns">
        <span className="fk_departments-items__columns--counter">
          {index + 1}.
        </span>
        {editIndex !== index && (
          <>
            <span className="fk_departments-items__columns--dep">{dep}</span>
            {!addDepActive && (
              <>
                <i
                  className="fa-regular fa-pen-to-square fk_departments--fa-pen-to-square"
                  onClick={() => handleActiveDep(index)}
                ></i>
                <i
                  className="fa-regular fa-trash-can fk_departments--fa-trash-can"
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
              className="fk_departments--edit"
              type="text"
              value={updateDep.length ? updateDep[index] : ""}
              onChange={(e) => handleEdit(e, index)}
            />
            <i
              className="fa-solid fa-xmark fk_departments--fa-xmark"
              onClick={handleCancel}
            ></i>
            <i
              className="fa-solid fa-check fk_departments--fa-check"
              onClick={handleChangeDep}
              style={duplicate ? { display: "none" } : null}
            ></i>
          </>
        )}
      </section>
    );
  });

  useEffect(() => {
    setDepartments(data);
  }, [data]);

  useEffect(() => {
    if (addDepActive) {
      setEditIndex(null);
    }
  }, [addDepActive]);

  return (
    <section className="fk_departments">
      <section className="fk_departments-title__container">
        <span className="fk_departments--title">Działy</span>
        <span className="fk_departments--counter">
          {departments ? departments.length : ""}
        </span>
        {!addDepActive && (
          <>
            <i
              className="fa-solid fa-plus fk_departments--title--fa-plus"
              onClick={() => setAddDepActive(true)}
            ></i>
            <i
              className="fas fa-save fk_departments--title--fa-save"
              onClick={saveDepartments}
            ></i>
          </>
        )}
      </section>
      {addDepActive && (
        <section className="fk_departments-title__container-add">
          <input
            style={duplicate ? { color: "red", fontWeight: "bold" } : null}
            className="fk_departments-title__container-add--edit"
            type="text"
            value={addDep}
            onChange={(e) => handleAddDep(e)}
          />
          <section className="fk_departments-title__container-add--panel">
            <i
              className="fa-solid fa-xmark fk_departments--fa-xmark"
              onClick={() => setAddDepActive(false)}
            ></i>
            {!duplicate && (
              <i
                className="fa-solid fa-check fk_departments--fa-check"
                onClick={() => updateDepartments("add")}
              ></i>
            )}
          </section>
        </section>
      )}
      <section className="fk_departments-items__container">
        {depItems.sort()}
      </section>
    </section>
  );
};

export default FKDepartments;
