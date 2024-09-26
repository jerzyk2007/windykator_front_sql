import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
// import useData from "../hooks/useData";
import FKItemSettings from "./FKItemsData/FKItemSettings";
import "./FKDataSettings.css";

const FKDataSettings = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [data, setData] = useState([]);
  const [raportDep, setRaportDep] = useState([]);
  const [mergeDep, setMergeDep] = useState([]);
  const [createItem, setCreateItem] = useState([]);
  const [itemsDB, setItemsDB] = useState([]);

  const getData = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get("/fk/get-fksettings-data");
      setData(result.data);

      const uniqueDep = await axiosPrivateIntercept.get("/fk/get-uniques-dep");
      setRaportDep(uniqueDep.data);

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
// import { useState, useEffect } from "react";
// import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
// import PleaseWait from "../PleaseWait";
// // import useData from "../hooks/useData";
// import FKItemSettings from "./FKItemsData/FKItemSettings";
// import "./FKDataSettings.css";

// const FKDataSettings = () => {
//   const axiosPrivateIntercept = useAxiosPrivateIntercept();
//   // const { pleaseWait, setPleaseWait } = useData();

//   const [pleaseWait, setPleaseWait] = useState(false);
//   const [data, setData] = useState([]);
//   const [raportDep, setRaportDep] = useState([]);
//   const [mergeDep, setMergeDep] = useState([]);
//   const [createItem, setCreateItem] = useState([]);
//   const [itemsDB, setItemsDB] = useState([]);

//   const getData = async () => {
//     try {
//       setPleaseWait(true);
//       const result = await axiosPrivateIntercept.get("/fk/get-fksettings-data");
//       setData(result.data);

//       const uniqueDep = await axiosPrivateIntercept.get("/fk/get-uniques-dep");
//       setRaportDep(uniqueDep.data);

//       const preparedItems = await axiosPrivateIntercept.get(
//         "/fk/get-prepared-items"
//       );
//       setItemsDB(preparedItems.data);

//       setPleaseWait(false);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSaveToDB = async (itemData) => {
//     try {
//       // Tworzymy kopię tablicy stanu itemsDB
//       const dataArray = [...itemsDB];

//       // Sprawdzamy, czy istnieje już obiekt o danym department
//       const existingItemIndex = dataArray.findIndex(
//         (item) => item.department === itemData.department
//       );

//       if (existingItemIndex !== -1) {
//         // Jeśli istnieje, aktualizujemy istniejący obiekt
//         dataArray[existingItemIndex] = {
//           ...dataArray[existingItemIndex],
//           localization: itemData.localization,
//           area: itemData.area,
//           owner: itemData.owner,
//           guardian: itemData.guardian,
//         };
//       } else {
//         // Jeśli nie istnieje, dodajemy nowy obiekt na koniec tablicy
//         dataArray.push({
//           department: itemData.department,
//           localization: itemData.localization,
//           area: itemData.area,
//           owner: itemData.owner,
//           guardian: itemData.guardian,
//         });
//       }

//       // Aktualizujemy stan itemsDB
//       setItemsDB(dataArray);

//       const result = await axiosPrivateIntercept.patch(
//         "/fk/save-prepared-items",
//         {
//           dataItems: dataArray,
//         }
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const itemsArray = mergeDep?.map((dep, index) => {
//     // sprawdzam czy działy potrzebne do raportu są zapisane w "zmień stałe"
//     const checkDepStyle = raportDep.find((item) => item === dep);

//     return (
//       <FKItemSettings
//         key={index}
//         id={index}
//         dep={dep}
//         dataItem={createItem ? createItem[index] : {}}
//         settings={data}
//         style={checkDepStyle ? "exist" : "noexist"}
//         // testData={createItem}
//         handleSaveToDB={handleSaveToDB}
//       />
//     );
//   });

//   const createMergeDep = (uniqueArray) => {
//     const createDataDep = uniqueArray.map((item) => {
//       //sprawdz czy jakieś dane są zapisane w DB
//       const dbItem = itemsDB.find((dbItem) => dbItem.department === item);

//       if (dbItem) {
//         return {
//           department: item,
//           localization: dbItem.localization || "",
//           area: dbItem.area || "",
//           owner: dbItem.owner || [""],
//           guardian: dbItem.guardian || [""],
//         };
//       } else {
//         // Jeśli nie znaleziono obiektu w tablicy itemsDB, utwórz pusty obiekt
//         return {
//           department: item,
//           localization: "",
//           area: "",
//           owner: [""],
//           guardian: [""],
//         };
//       }
//     });
//     setCreateItem(createDataDep);
//   };

//   useEffect(() => {
//     if (data?.departments && raportDep.length && itemsDB.length) {
//       const combinedArray = data.departments.concat(raportDep);
//       const uniqueArray = [...new Set(combinedArray)].sort();
//       setMergeDep(uniqueArray);
//       console.log(uniqueArray);
//       createMergeDep(uniqueArray);
//     }
//   }, [data, raportDep, itemsDB]);

//   useEffect(() => {
//     getData();
//   }, []);

//   return (
//     <>
//       {pleaseWait ? (
//         <PleaseWait />
//       ) : (
//         <section className="fk_data_settings">
//           <section className="fk_data_settings__title">
//             <span>Dopasuj wyświetlanie danych</span>
//           </section>
//           <section className="fk_data_settings__container">
//             <section className="fk_data_settings__container-item">
//               <section className="fk_data_settings-counter__container">
//                 <span className="fk_data_settings-counter">Lp</span>
//               </section>
//               <span className="fk_data_settings-department">Dział</span>
//               <span className="fk_data_settings-localization">Lokalizacja</span>
//               <span className="fk_data_settings-area">Obszar</span>
//               <span className="fk_data_settings-owner">Owner</span>
//               <span className="fk_data_settings-guardian">Opiekun</span>
//             </section>
//             {itemsArray}
//           </section>
//         </section>
//       )}
//     </>
//   );
// };

// export default FKDataSettings;
