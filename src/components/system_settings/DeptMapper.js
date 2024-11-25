import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
// import useData from "../hooks/useData";
// import FKItemSettings from "./FKItemsData/FKItemSettings";
import DeptMapperSettings from "./DeptMapperSettings";
// import FKItemSettings from "../FKRaport/FKItemsData/FKItemSettings";
import "./DeptMapper.css";

const DeptMapper = () => {
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
      <span key={index} className="dept_mapper__container-dep--info">{dep}</span>
    );
  });

  const getData = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get("/fk/get-fksettings-data");
      setData(result.data);
      // console.log(result.data.departments);
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
      // console.log(dataArray);

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
      <DeptMapperSettings
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
        <section className="dept_mapper">
          <section className="dept_mapper__title">
            <span>Dopasuj wyświetlanie danych</span>
          </section>
          <section className="dept_mapper__container-dep">
            <span className="dept_mapper__container-dep--title">Uzupełnij dane dla działów: </span>
            <section className="dept_mapper-dep__container">
              {itemsDep}
            </section>
          </section>
          <section className="dept_mapper__container">
            <section className="dept_mapper__container-item">
              <section className="dept_mapper-counter__container">
                <span className="dept_mapper-counter">Lp</span>
              </section>
              <span className="dept_mapper-department">Dział</span>
              <span className="dept_mapper-localization">Lokalizacja</span>
              <span className="dept_mapper-area">Obszar</span>
              <span className="dept_mapper-owner">Owner</span>
              <span className="dept_mapper-guardian">Opiekun</span>
            </section>
          </section>


          <section className="dept_mapper__container-array">
            {itemsArray}
          </section>
        </section>
      )}
    </>
  );
};

export default DeptMapper;
