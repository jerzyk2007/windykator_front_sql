import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
// import useData from "../hooks/useData";
// import FKItemSettings from "./FKItemsData/FKItemSettings";
import FKItemSettings from "./FKItemsData/xxxFKItemSettings";
import "./xxxFKDataSettings.css";

const FKDataSettings = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [data, setData] = useState([]);
  const [raportDep, setRaportDep] = useState([]);
  const [mergeDep, setMergeDep] = useState([]);
  const [createItem, setCreateItem] = useState([]);
  const [itemsDB, setItemsDB] = useState([]);
  const [missingDeps, setMissingDeps] = useState([]);

  const checkMissingDepartments = (saveDeps, docDeps) => {
    let checkgDeps = [];
    for (const dep of docDeps) {
      const checkDep = saveDeps.find((item) => item === dep);
      if (!checkDep) {
        checkgDeps.push(dep);
      }
    }
    setMissingDeps(checkgDeps);
  };

  const itemsDep = missingDeps.map((dep, index) => {
    return (
      <span key={index} className="fk_data_settings__container-dep--info">{dep}</span>
    );
  });

  const getData = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get("/fk/get-fksettings-data");
      setData(result.data);
      const uniqueDep = await axiosPrivateIntercept.get("/fk/get-uniques-dep");
      setRaportDep(uniqueDep.data);

      checkMissingDepartments(result.data.departments, uniqueDep.data);

      const preparedItems = await axiosPrivateIntercept.get(
        "/fk/get-prepared-items"
      );
      setItemsDB(preparedItems.data);
      const combinedArray = result.data.departments.concat(uniqueDep.data);
      const uniqueArray = [...new Set(combinedArray)].sort();
      setMergeDep(uniqueArray);
      createMergeDep(uniqueArray, preparedItems.data);

      setPleaseWait(false);

      // setTimeout(() => setPleaseWait(false), 5000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveToDB = async (itemData) => {
    try {
      // Tworzymy kopię tablicy stanu itemsDB
      // const dataArray = [];
      const dataArray = [...itemsDB];

      // Sprawdzamy, czy istnieje już obiekt o danym department
      const existingItemIndex = dataArray.findIndex(
        (item) => item.department === itemData.department
      );
      if (existingItemIndex !== -1) {
        // Jeśli istnieje, aktualizujemy istniejący obiekt
        dataArray[existingItemIndex] = {
          ...dataArray[existingItemIndex],
          localization: itemData.localization,
          area: itemData.area,
          owner: itemData.owner,
          guardian: itemData.guardian,
        };
      } else {
        // Jeśli nie istnieje, dodajemy nowy obiekt na koniec tablicy
        dataArray.push({
          department: itemData.department,
          localization: itemData.localization,
          area: itemData.area,
          owner: itemData.owner,
          guardian: itemData.guardian,
        });
      }
      // Aktualizujemy stan itemsDB
      setItemsDB(dataArray);

      await axiosPrivateIntercept.patch("/fk/save-prepared-items", {
        department: itemData.department,
        localization: itemData.localization,
        area: itemData.area,
        owner: itemData.owner,
        guardian: itemData.guardian,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const itemsArray = mergeDep?.map((dep, index) => {
    // sprawdzam czy działy potrzebne do raportu są zapisane w "zmień stałe"
    const checkDepStyle = raportDep.find((item) => item === dep);

    return (
      <FKItemSettings
        key={index}
        id={index}
        dep={dep}
        dataItem={createItem ? createItem[index] : {}}
        settings={data}
        style={checkDepStyle ? "exist" : "noexist"}
        handleSaveToDB={handleSaveToDB}
      />
    );
  });


  const createMergeDep = (uniqueArray, itemsDB) => {
    const createDataDep = uniqueArray.map((item) => {
      //sprawdz czy jakieś dane są zapisane w DB
      const dbItem = itemsDB.find((dbItem) => dbItem.department === item);

      if (dbItem) {
        return {
          department: item,
          localization: dbItem.localization || "",
          area: dbItem.area || "",
          owner: dbItem.owner || [""],
          guardian: dbItem.guardian || [""],
        };
      } else {
        // Jeśli nie znaleziono obiektu w tablicy itemsDB, utwórz pusty obiekt
        return {
          department: item,
          localization: "",
          area: "",
          owner: [""],
          guardian: [""],
        };
      }
    });
    setCreateItem(createDataDep);
  };

  useEffect(() => {
    getData();
  }, []);



  return (
    <>
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <section className="fk_data_settings">
          <section className="fk_data_settings__title">
            <span>Dopasuj wyświetlanie danych</span>
          </section>
          <section className="fk_data_settings__container-dep">
            <span className="fk_data_settings__container-dep--title">Uzupełnij dane dla działów: </span>
            <section className="fk_data_settings-dep__container">
              {itemsDep}
            </section>
          </section>
          <section className="fk_data_settings__container">
            <section className="fk_data_settings__container-item">
              <section className="fk_data_settings-counter__container">
                <span className="fk_data_settings-counter">Lp</span>
              </section>
              <span className="fk_data_settings-department">Dział</span>
              <span className="fk_data_settings-localization">Lokalizacja</span>
              <span className="fk_data_settings-area">Obszar</span>
              <span className="fk_data_settings-owner">Owner</span>
              <span className="fk_data_settings-guardian">Opiekun</span>
            </section>
          </section>


          <section className="fk_data_settings__container-array">
            {itemsArray}
          </section>
        </section>
      )}
    </>
  );
};

export default FKDataSettings;
