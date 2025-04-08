import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
// import useData from "../hooks/useData";
// import FKItemSettings from "./FKItemsData/FKItemSettings";
import DeptMapperSettings from "./DeptMapperSettings";
import MissingDepartments from "./MissingDepartments";
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

  // const checkMissingDepartments = async (saveDeps, docDeps) => {
  //   let checkDeps = [];
  //   for (const dep of docDeps) {

  //     const checkDep = saveDeps.find((item) => item === dep);
  //     if (!checkDep) {
  //       checkDeps.push(dep);
  //     }
  //   }


  //   // sprawdzam czy brakujące działy mają do rozliczenia fv czy nie
  //   const checkDocPayment = await axiosPrivateIntercept.post("/items/check-doc-payment", { departments: checkDeps });
  //   // console.log(checkDocPayment.data);
  //   setMissingDeps(checkDocPayment.data);
  //   // setMissingDeps(checkDeps);
  // };



  const checkMissingDepartments2 = (saveDeps, docDeps) => {
    return docDeps.filter(
      dep => !saveDeps.some(item => item.DEPARTMENT === dep.DZIAL && item.COMPANY === dep.FIRMA)
    );
  };


  const itemsDepExist = missingDeps?.checkDoc?.map((dep, index) => {
    if (dep.exist === true) {
      return (
        <span key={index} className="dept_mapper__container-dep--info">{dep.dep}</span>
      );
    }
  }).filter(Boolean);;

  const itemsDepNoExist = missingDeps?.checkDoc?.map((dep, index) => {
    if (dep.exist === false) {
      return (
        <span key={index} className="dept_mapper__container-dep--info">{dep.dep}</span>
      );
    }
  }).filter(Boolean);;

  const getData = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get("/items/get-fksettings-data");
      setData(result.data);

      // pobiera unikalne nazwy działów z tabeli documents
      const uniqueDep = await axiosPrivateIntercept.get("/items/get-uniques-dep");
      setRaportDep(uniqueDep.data);

      // sprawdzam czy sa jakies nieopisane działy
      const checkMissingDeps = checkMissingDepartments2(result.data.uniqeDepFromCompanyJI, result.data.uniqeDepFromDocuments);

      if (checkMissingDeps?.length) {
        const checkDocPayment = await axiosPrivateIntercept.post("/items/check-doc-payment", { departments: checkMissingDeps });
        setMissingDeps(checkDocPayment.data.checkDoc);
      }

      const preparedItems = await axiosPrivateIntercept.get(
        "/items/get-prepared-items"
      );
      setItemsDB(preparedItems.data);

      const combinedArray = result.data.departments.concat(uniqueDep.data);
      const uniqueArray = [...new Set(combinedArray)].sort();
      setMergeDep(uniqueArray);
      createMergeDep(uniqueArray, preparedItems.data);


      // setTimeout(() => setPleaseWait(false), 5000);
    } catch (error) {
      console.error(error);
    }
    finally {
      setPleaseWait(false);

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

      await axiosPrivateIntercept.patch("/items/save-prepared-items", {
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

  const handleDeleteItem = async (dep) => {
    await axiosPrivateIntercept.delete(`/items/delete-prepared-item/${encodeURIComponent(dep)}`);
    const filteredData = createItem.filter(item => item.department !== dep);
    setCreateItem(filteredData);
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
        // dataItem={createItem ? {} : {}}
        settings={data}
        style={checkDepStyle ? "exist" : "noexist"}
        handleSaveToDB={handleSaveToDB}
        handleDeleteItem={handleDeleteItem}
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
        // <PleaseWait />
        <section className="dept_mapper"></section>
      ) : (
        <section className="dept_mapper">
          {missingDeps && <MissingDepartments
            departments={missingDeps} />}

          {/* {itemsDepExist?.length ? <section className="dept_mapper__container-dep">
            <span className="dept_mapper__container-dep--title">Uzupełnij dane dla działów - posiadające nierozl. FV: </span>
            <section className="dept_mapper-dep__container">
              {itemsDepExist}
            </section>
          </section> : null}

          {itemsDepNoExist?.length ? <section className="dept_mapper__container-dep"
            style={{ backgroundColor: "#ff8282" }}>
            <span className="dept_mapper__container-dep--title"

            >Uzupełnij dane dla działów - nie posiadających nierozl. FV: </span>
            <section className="dept_mapper-dep__container">
              {itemsDepNoExist}
            </section>
          </section> : null} */}

          <section className="dept_mapper__title">
            <span>Dopasuj wyświetlanie danych</span>
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
