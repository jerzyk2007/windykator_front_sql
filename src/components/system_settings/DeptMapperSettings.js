import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const DeptMapperSettings = ({
  id,
  dep,
  dataItem,
  settings,
  style,
  handleSaveToDB,
}) => {
  const [settingsItem, setSettingsItem] = useState([]);
  const [itemsValue, setItemsValue] = useState({});
  const [activeSave, setActiveSave] = useState(false);

  const handleLocalization = (e, info) => {
    const newValue = e.target.value;
    setItemsValue((prev) => {
      return {
        ...prev,
        [info]: newValue,
      };
    });
  };

  // tworzy dla listy rozwijanej wszytskie nazwy lokalizacji
  const localizationItems = settingsItem.localizations?.map((loc, index) => {
    return (
      <MenuItem value={loc} key={index}>
        {loc}
      </MenuItem>
    );
  });

  // tworzy dla listy rozwijanej wszytskie nazwy obszarów
  const areaItems = settingsItem.areas?.map((area, index) => {
    return (
      <MenuItem value={area} key={index}>
        {area}
      </MenuItem>
    );
  });

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
    const menuItems = settingsItem.owners?.map((ownItem, id) => {
      return (
        <MenuItem value={ownItem} key={id}>
          {ownItem}
        </MenuItem>
      );
    });

    return (
      <section className="dept_mapper-owner-many" key={index}>
        <Box className="dept_mapper-owner__container">
          <FormControl fullWidth>
            <InputLabel id="simple-select-label">Owner</InputLabel>
            <Select
              labelId="simple-select-label"
              id="simple-select"
              value={itemsValue?.owner[index] ? itemsValue.owner[index] : ""}
              label="Obszar"
              onChange={(e) => handleUpdateOwner(e, index, "owner")}
            >
              {menuItems}
            </Select>
          </FormControl>
        </Box>
        {index === 0 && (
          <i
            className="fa-solid fa-plus dept_mapper--fa-plus"
            onClick={handleAddOwner}
          ></i>
        )}
        {index !== 0 && (
          <i
            className="fa-solid fa-minus dept_mapper--fa-minus"
            onClick={() => {
              handleDeleteOwner(index);
            }}
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
    const menuItems = settingsItem.guardians?.map((guardItem, id) => {
      return (
        <MenuItem value={guardItem} key={id}>
          {guardItem}
        </MenuItem>
      );
    });

    return (
      <section className="dept_mapper-owner-many" key={index}>
        <Box className="dept_mapper-owner__container">
          <FormControl fullWidth>
            <InputLabel id="simple-select-label">Opiekun</InputLabel>
            <Select
              labelId="simple-select-label"
              id="simple-select"
              value={
                itemsValue?.guardian[index] ? itemsValue.guardian[index] : ""
              }
              label="Obszar"
              onChange={(e) => handleUpdateGuardian(e, index, "guardian")}
            >
              {menuItems}
            </Select>
          </FormControl>
        </Box>
        {index === 0 && (
          <i
            className="fa-solid fa-plus dept_mapper--fa-plus"
            onClick={handleAddGuardian}
          ></i>
        )}
        {index !== 0 && (
          <i
            className="fa-solid fa-minus dept_mapper--fa-minus"
            onClick={() => {
              handleDeleteGuardian(index);
            }}
          ></i>
        )}
      </section>
    );
  });

  useEffect(() => {
    setSettingsItem(settings);
    setItemsValue(dataItem);
  }, [settings, dataItem]);

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
      <section className="dept_mapper-counter__container">
        <span
          className="dept_mapper-counter"
        // style={
        //   style === "exist"
        //     ? { backgroundColor: "#aeffe4" }
        //     : { backgroundColor: "red", color: "white", padding: "5px" }
        // }
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
      <section className="dept_mapper-department">
        <span className="dept_mapper-dep"
          style={!activeSave ? { backgroundColor: "yellow", border: "1px solid rgba(44, 123, 168, 0.6)" } : null}

        >
          {itemsValue?.department}
        </span>
      </section>
      <section className="dept_mapper-localization">
        <Box>
          <FormControl fullWidth>
            <InputLabel id="simple-select-label">Lokalizacja</InputLabel>
            <Select
              labelId="simple-select-label"
              id="simple-select"
              value={itemsValue?.localization ? itemsValue.localization : ""}
              label="Lokalizacja"
              onChange={(e) => handleLocalization(e, "localization")}
            >
              {localizationItems}
            </Select>
          </FormControl>
        </Box>
      </section>
      <section className="dept_mapper-area">
        <Box>
          <FormControl fullWidth>
            <InputLabel id="simple-select-label">Obszar</InputLabel>
            <Select
              labelId="simple-select-label"
              id="simple-select"
              value={itemsValue?.area ? itemsValue.area : ""}
              label="Obszar"
              onChange={(e) => handleLocalization(e, "area")}
            >
              {areaItems}
            </Select>
          </FormControl>
        </Box>
      </section>
      <section className="dept_mapper-owner">{ownerItems}</section>
      <section className="dept_mapper-owner">{guardianItems}</section>
    </section>
  );
};

export default DeptMapperSettings;
