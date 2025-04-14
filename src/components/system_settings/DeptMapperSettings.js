import { useState, useEffect } from "react";
import './DeptMapperSettings.css';

const DeptMapperSettings = ({
  id,
  dataItem,
  // style,
  handleSaveToDB,
  handleDeleteItem,
  localization,
  area,
  owner,
  guardian
}) => {
  // const [settingsItem, setSettingsItem] = useState([]);
  const [itemsValue, setItemsValue] = useState({});
  const [activeSave, setActiveSave] = useState(false);
  const [activeDelete, setActiveDelete] = useState(false);


  const handleLocalization = (e, info) => {
    const newValue = e.target.value;
    setItemsValue((prev) => {
      return {
        ...prev,
        [info]: newValue,
      };
    });
  };

  // usuwa nadplanowego ownera, ale zawsze zostanie jeden
  const handleDeleteOwner = (id) => {
    const updateOwner = [...itemsValue.owner];

    updateOwner.splice(id, 1);
    setItemsValue((prev) => {
      return {
        ...prev,
        owner: updateOwner,
      };
    });
  };

  //dodaje dodatkowego ownera
  const handleAddOwner = () => {
    const updateOwner = [...itemsValue.owner, ""];
    setItemsValue((prev) => {
      return {
        ...prev,
        owner: updateOwner,
      };
    });
  };

  // aktualizuję ownera po wyborze
  const handleUpdateOwner = (e, id) => {
    const newOwner = e.target.value;
    const ownArray = [...itemsValue.owner];
    if (ownArray.includes(newOwner)) return;
    ownArray[id] = newOwner;

    setItemsValue((prev) => {
      return {
        ...prev,
        owner: ownArray,
      };
    });
  };

  // tworzy obiekt ownera, z listą, dodawaniem, usuwaniem
  const ownerItems = itemsValue?.owner?.map((own, index) => {
    return (
      <section className="dept_mapper-owner-many" key={index}>
        <div className="dept_mapper-owner__container">
          <label className="dept_mapper_settings-label" htmlFor={`owner-select-${index}`}>
            {/* Owner */}
          </label>
          <select
            id={`owner-select-${index}`}
            className="dept_mapper_settings-select"
            value={itemsValue?.owner[index] ?? ""}
            onChange={(e) => handleUpdateOwner(e, index, "owner")}
          >
            <option value="" disabled hidden>
              -- Wybierz Ownera --
            </option>
            {owner?.map((ownItem, id) => (
              <option key={id} value={ownItem}>
                {ownItem}
              </option>
            ))}
          </select>
        </div>
        {index === 0 ? (
          <i
            className="fa-solid fa-plus dept_mapper--fa-plus"
            onClick={handleAddOwner}
          ></i>
        ) : (
          <i
            className="fa-solid fa-minus dept_mapper--fa-minus"
            onClick={() => handleDeleteOwner(index)}
          ></i>
        )}
      </section>
    );
  });

  // usuwa nadplanowego ownera, ale zawsze zostanie jeden
  const handleDeleteGuardian = (id) => {
    const updateGuardian = [...itemsValue.guardian];

    updateGuardian.splice(id, 1);
    setItemsValue((prev) => {
      return {
        ...prev,
        guardian: updateGuardian,
      };
    });
  };

  //dodaje dodatkowego ownera
  const handleAddGuardian = () => {
    const updateGuardian = [...itemsValue.guardian, ""];
    setItemsValue((prev) => {
      return {
        ...prev,
        guardian: updateGuardian,
      };
    });
  };

  // aktualizuję ownera po wyborze
  const handleUpdateGuardian = (e, id) => {
    const newGuardian = e.target.value;
    const guardArray = [...itemsValue.guardian];
    if (guardArray.includes(newGuardian)) return;
    guardArray[id] = newGuardian;

    setItemsValue((prev) => {
      return {
        ...prev,
        guardian: guardArray,
      };
    });
  };

  // tworzy obiekt opiekuna, z listą, dodawaniem, usuwaniem
  const guardianItems = itemsValue?.guardian?.map((guard, index) => {
    return (
      <section className="dept_mapper-owner-many" key={index}>
        <div className="dept_mapper-owner__container">
          <label className="dept_mapper_settings-label" htmlFor={`guardian-select-${index}`}>
            {/* Owner */}
          </label>
          <select
            id={`owner-select-${index}`}
            className="dept_mapper_settings-select"
            value={itemsValue?.guardian[index] ?? ""}
            onChange={(e) => handleUpdateGuardian(e, index, "guardian")}
          >
            <option value="" disabled hidden>
              -- Wybierz Opiekuna --
            </option>
            {guardian?.map((guardItem, id) => (
              <option key={id} value={guardItem}>
                {guardItem}
              </option>
            ))}
          </select>
        </div>
        {index === 0 ? (
          <i
            className="fa-solid fa-plus dept_mapper--fa-plus"
            onClick={handleAddGuardian}
          ></i>
        ) : (
          <i
            className="fa-solid fa-minus dept_mapper--fa-minus"
            onClick={() => handleDeleteGuardian(index)}
          ></i>
        )}
      </section>
    );
  });

  useEffect(() => {
    setItemsValue(dataItem);
  }, [dataItem]);

  useEffect(() => {
    if (
      itemsValue?.localization &&
      itemsValue?.area &&
      !itemsValue?.owner.includes("") &&
      !itemsValue?.guardian.includes("")
    ) {
      setActiveSave(true);
    } else {
      setActiveSave(false);
    }
  }, [itemsValue]);

  return (
    <section
      className="dept_mapper__container-item"
    // style={!activeSave ? { backgroundColor: "yellow" } : null}
    >
      <section className="dept_mapper-counter">
        <span
        >
          {id + 1}
        </span>
        {activeSave && (
          <i
            className="fas fa-save dept_mapper--fa-save"
            onClick={() => {
              handleSaveToDB(itemsValue);
            }}
          ></i>
        )}
      </section>
      <section className="dept_mapper-department"
        style={!activeSave ? { backgroundColor: "yellow", border: "1px solid rgba(44, 123, 168, 0.6)" } : null}
      >
        <span className="dept_mapper-dep"
        >
          {itemsValue?.department}
        </span>
        <span className="dept_mapper-dep"
        >
          {itemsValue?.company}
        </span>
      </section>
      <section className="dept_mapper-localization">
        <select
          className="dept_mapper_settings-select"
          value={itemsValue?.localization ?? ""}
          onChange={(e) => handleLocalization(e, "localization")}
        >
          <option value="" disabled hidden>
            -- Wybierz lokalizację --
          </option>

          {localization.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </section>
      <section className="dept_mapper-area">
        <select
          className="dept_mapper_settings-select"
          value={itemsValue?.area ? itemsValue.area : ""}
          onChange={(e) => handleLocalization(e, "area")}
        >
          <option value="" disabled hidden>
            -- Wybierz obszar --
          </option>
          {area?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </section>
      <section className="dept_mapper-owner">
        {ownerItems}
      </section>
      <section className="dept_mapper-guardian">
        {guardianItems}
      </section>
      <section className="dept_mapper_settings-icon">

        {activeSave && (!activeDelete ? (
          <i
            className="fas fa-trash dept_mapper--fa-trash"
            onDoubleClick={() => {
              setActiveDelete(true);
              // handleDeleteItem(itemsValue);
            }}
          ></i>
        ) :
          <section className="dept_mapper_settings-icon--accept">
            <i className="fas fa-check dept_mapper--fa-check"
              onDoubleClick={() => {
                setActiveDelete(false);
                handleDeleteItem(itemsValue.department, itemsValue.company);
              }}></i>
            <i className="fas fa-cancel dept_mapper--fa-cancel"
              onClick={() => setActiveDelete(false)}
            ></i>
          </section>)}
      </section>
    </section>
  );
};

export default DeptMapperSettings;
