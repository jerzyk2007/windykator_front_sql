import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
// import useData from "../hooks/useData";
// import FKItemSettings from "./FKItemsData/FKItemSettings";
import DeptMapperSettings from "./DeptMapperSettings";
import MissingDepartments from "./MissingDepartments";
import PleaseWait from "../PleaseWait";
// import FKItemSettings from "../FKRaport/FKItemsData/FKItemSettings";
import "./DeptMapper.css";

const DeptMapper = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [pleaseWait, setPleaseWait] = useState(false);
  // const [data, setData] = useState([]);
  // const [raportDep, setRaportDep] = useState([]);
  // const [mergeDep, setMergeDep] = useState([]);
  const [createItem, setCreateItem] = useState([]);
  // const [itemsDB, setItemsDB] = useState([]);
  // const [missingDeps, setMissingDeps] = useState([]);

  const [loadedData, setLoadedData] = useState(
    {
      uniqueDepFromCompanyJI: [],
      uniqueDepFromDocuments: [],
      missingDeps: [],
      preparedItems: []
    }
  );
  const [filteredData, setFilteredData] = useState(
    {
      uniqueDepFromCompanyJI: [],
      uniqueDepFromDocuments: [],
      missingDeps: [],
      preparedItems: []
    }
  );

  const [company, setCompany] = useState({
    selectCompany: "",
    companyNames: []
  });


  const checkMissingDepartments = (saveDeps, docDeps) => {
    return docDeps.filter(
      dep => !saveDeps.some(item => item.DEPARTMENT === dep.DZIAL && item.COMPANY === dep.FIRMA)
    );
  };

  // sprawdza czy dział ma nierozliczone fv
  const checkDocPay = async (checkDeps) => {
    try {
      return checkDeps?.length ? await axiosPrivateIntercept.post("/items/check-doc-payment", { departments: checkDeps }) : null;
    }
    catch (err) {
      console.error(err);
    }
  };

  const getData = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get("/items/get-fksettings-data");

      // sprawdzam czy sa jakies nieopisane działy
      const checkMissingDeps = checkMissingDepartments(result.data.uniqueDepFromCompanyJI, result.data.uniqueDepFromDocuments);

      // const checkDocPayment = checkMissingDeps?.length ? await axiosPrivateIntercept.post("/items/check-doc-payment", { departments: checkMissingDeps }) : null;

      const checkDocPayment = await checkDocPay(checkMissingDeps);

      setCompany({
        selectCompany: result.data.company.length > 1 ? "ALL" : result.data.company.length === 1 ? result.data.company[0] : '',
        companyNames: result.data.company.length > 1 ? ['ALL', ...result.data.company] : result.data.company.length === 1 ? result.data.company[0] : []
      });

      // łączę unikalne nazwy działów z danych document i join_items
      const transformUniqDep = result.data.uniqueDepFromDocuments.map(item => {
        return {
          DEPARTMENT: item.DZIAL,
          COMPANY: item.FIRMA
        };
      });
      const mergedUniqDep = [...result.data.uniqueDepFromCompanyJI, ...transformUniqDep];
      const uniqueDeps = mergedUniqDep.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.DEPARTMENT === item.DEPARTMENT && t.COMPANY === item.COMPANY
          )
      );
      // createMergeDepMulti();

      // createMergeDepMulti(uniqueDeps, result.data.preparedItems);
      // console.log(uniqueDeps);
      setLoadedData(prev => {
        return {
          ...prev,
          uniqueDepFromCompanyJI: result.data.uniqueDepFromCompanyJI || [],
          uniqueDepFromDocuments: result.data.uniqueDepFromDocuments || [],
          missingDeps: checkDocPayment ? checkDocPayment.data.checkDoc : [],
          preparedItems: result.data.preparedItems || [],
          mergeDeps: uniqueDeps.sort((a, b) => a.DEPARTMENT.localeCompare(b.DEPARTMENT)),
          localization: result.data.companyLoacalizations || [],
          area: result.data.companyAreas || [],
          owner: result.data.companyOwners || [],
          guardian: result.data.companyGuardians || [],
        };
      });
    } catch (error) {
      console.error(error);
    }
    finally {
      setPleaseWait(false);
    }
  };

  const handleSaveToDB = async (itemData) => {
    try {
      // Tworzymy kopię tablicy stanu preparedItems
      const dataArray = [...loadedData.preparedItems];

      // Sprawdzamy, czy istnieje już obiekt o danym department
      const existingItemIndex = dataArray.findIndex(
        (item) => item.DEPARTMENT === itemData.department
      );
      if (existingItemIndex !== -1) {
        // Jeśli istnieje, aktualizujemy istniejący obiekt
        dataArray[existingItemIndex] = {
          ...dataArray[existingItemIndex],
          COMPANY: itemData.company,
          LOCALIZATION: itemData.localization,
          AREA: itemData.area,
          OWNER: itemData.owner,
          GUARDIAN: itemData.guardian,
        };
      } else {
        // Jeśli nie istnieje, dodajemy nowy obiekt na koniec tablicy
        dataArray.push({
          DEPARTMENT: itemData.department,
          COMPANY: itemData.company,
          LOCALIZATION: itemData.localization,
          AREA: itemData.area,
          OWNER: itemData.owner,
          GUARDIAN: itemData.guardian,
        });
      }
      // Aktualizujemy stan itemsDB
      const sortedArray = [...dataArray].sort((a, b) => {
        const deptA = a.DEPARTMENT || "";
        const deptB = b.DEPARTMENT || "";
        const companyA = a.COMPANY || "";
        const companyB = b.COMPANY || "";

        const deptCompare = deptA.localeCompare(deptB);
        if (deptCompare !== 0) {
          return deptCompare;
        }

        return companyA.localeCompare(companyB);
      });

      const newDep = {
        DEPARTMENT: itemData.department,
        COMPANY: itemData.company,
      };

      const exists = loadedData.uniqueDepFromCompanyJI.some(
        item =>
          item.DEPARTMENT === newDep.DEPARTMENT &&
          item.COMPANY === newDep.COMPANY
      );

      const updateDep = exists
        ? loadedData.uniqueDepFromCompanyJI
        : [...loadedData.uniqueDepFromCompanyJI, newDep];


      setLoadedData(prev => ({
        ...prev,
        preparedItems: sortedArray,
        uniqueDepFromCompanyJI: updateDep // ← tu podstawiasz swoją nową wartość
      }));

      // const updateLoadaedData = loadedData.map(item => {
      //   console.log(item);
      // });

      await axiosPrivateIntercept.patch("/items/save-prepared-items", {
        DEPARTMENT: itemData.department,
        COMPANY: itemData.company,
        LOCALIZATION: itemData.localization,
        AREA: itemData.area,
        OWNER: itemData.owner,
        GUARDIAN: itemData.guardian,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteItem = async (dep, comp) => {
    await axiosPrivateIntercept.delete(`/items/delete-prepared-item/${encodeURIComponent(dep)}/${encodeURIComponent(comp)}`);
    const filteredPreparedItems = loadedData?.preparedItems?.filter(item => item.DEPARTMENT !== dep && item.COMPANY !== comp);
    const filteredUniqueDepFromCompanyJI = loadedData?.uniqueDepFromCompanyJI?.filter(item => item.DEPARTMENT !== dep && item.COMPANY !== comp);

    setLoadedData(prev => ({
      ...prev,
      preparedItems: filteredPreparedItems,
      uniqueDepFromCompanyJI: filteredUniqueDepFromCompanyJI
    }));
  };

  const itemsArray = filteredData?.mergeDeps?.map((dep, index) => {
    // const checkDepStyle = filteredData?.preparedItems.find((item) => item.DEPARTMENT === dep.DEPARTMENT && item.COMPANY === dep.COMPANY);
    const checkItem = createItem.find((item) => item.department === dep.DEPARTMENT && item.company === dep.COMPANY);
    const company = dep.COMPANY;
    const localization = filteredData?.localization.map(item => {
      if (item.COMPANY === company) {
        return item.LOCALIZATION;
      }
    }).filter(Boolean);

    const area = filteredData?.area.map(item => {
      if (item.COMPANY === "ALL") {
        return item.AREA;
      } else
        if (item.COMPANY === company) {
          return item.AREA;
        }
    }).filter(Boolean);

    const owner = filteredData?.owner.map(item => {
      if (item.COMPANY === company) {
        return item.OWNER;
      }
    }).filter(Boolean);

    const guardian = filteredData?.guardian.map(item => {
      if (item.COMPANY === company) {
        return item.GUARDIAN;
      }
    }).filter(Boolean);

    return (
      <DeptMapperSettings
        key={index}
        id={index}
        company={company}
        dataItem={checkItem}
        localization={localization}
        area={area}
        owner={owner}
        guardian={guardian}
        // style={checkDepStyle ? "exist" : "noexist"}
        handleSaveToDB={handleSaveToDB}
        handleDeleteItem={handleDeleteItem}
      />
    );
  });

  const createMergeDepMulti = () => {
    // const transformUniqDep = loadedData.uniqueDepFromDocuments.map(item => {
    //   return {
    //     DEPARTMENT: item.DZIAL,
    //     COMPANY: item.FIRMA
    //   };
    // });

    // const mergedUniqDep = [...loadedData.uniqueDepFromCompanyJI, ...transformUniqDep];

    // const uniqueDeps = mergedUniqDep.filter(
    //   (item, index, self) =>
    //     index ===
    //     self.findIndex(
    //       (t) =>
    //         t.DEPARTMENT === item.DEPARTMENT && t.COMPANY === item.COMPANY
    //     )
    // );

    const createDataDep = loadedData?.mergeDeps?.map((item) => {
      //sprawdz czy jakieś dane są zapisane w DB
      const dbItem = loadedData?.preparedItems?.find((dbItem) => dbItem.DEPARTMENT === item.DEPARTMENT && dbItem.COMPANY === item.COMPANY);

      if (dbItem) {
        return {
          department: item.DEPARTMENT,
          company: item.COMPANY,
          localization: dbItem.LOCALIZATION || "",
          area: dbItem.AREA || "",
          owner: dbItem.OWNER || [""],
          guardian: dbItem.GUARDIAN || [""],
        };
      } else {
        // Jeśli nie znaleziono obiektu w tablicy itemsDB, utwórz pusty obiekt
        // console.log('nie ma');
        return {
          department: item.DEPARTMENT,
          company: item.COMPANY,
          localization: "",
          area: "",
          owner: [""],
          guardian: [""],
        };
      }
    });
    setCreateItem(createDataDep?.sort((a, b) => a.department.localeCompare(b.department)));
  };

  useEffect(() => {
    setFilteredData(loadedData);
    // console.log(loadedData);
    createMergeDepMulti();

  }, [loadedData]);

  const updateFilteredData = async () => {
    try {
      const checkMissingDeps = checkMissingDepartments(loadedData.uniqueDepFromCompanyJI, loadedData.uniqueDepFromDocuments);
      const checkDocPayment = await checkDocPay(checkMissingDeps);
      const docPay = checkDocPayment ? checkDocPayment.data.checkDoc : [];

      const missingDeps = company.selectCompany !== 'ALL' ? docPay?.filter(item => item.company === company.selectCompany) : docPay;
      const preparedItems = company.selectCompany !== 'ALL' ? loadedData?.preparedItems?.filter(item => item.COMPANY === company.selectCompany) : loadedData.preparedItems;
      const mergeDeps = company.selectCompany !== 'ALL' ? loadedData?.mergeDeps?.filter(item => item.COMPANY === company.selectCompany) : loadedData.mergeDeps;

      // console.log(checkDocPayment);
      // console.log(loadedData.preparedItems);
      // console.log(loadedData.uniqueDepFromCompanyJI);
      // console.log(loadedData.uniqueDepFromDocuments);


      setFilteredData(prev => {
        return {
          ...prev,
          missingDeps,
          preparedItems,
          mergeDeps
        };
      });
    }
    catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // const missingDeps = company.selectCompany !== 'ALL' ? loadedData?.missingDeps?.filter(item => item.company === company.selectCompany) : loadedData.missingDeps;
    // const preparedItems = company.selectCompany !== 'ALL' ? loadedData?.preparedItems?.filter(item => item.COMPANY === company.selectCompany) : loadedData.preparedItems;
    // const mergeDeps = company.selectCompany !== 'ALL' ? loadedData?.mergeDeps?.filter(item => item.COMPANY === company.selectCompany) : loadedData.mergeDeps;


    // const checkMissingDeps = checkMissingDepartments(loadedData.uniqueDepFromCompanyJI, loadedData.uniqueDepFromDocuments);
    // console.log(checkMissingDeps);
    // setFilteredData(prev => {
    //   return {
    //     ...prev,
    //     missingDeps,
    //     preparedItems,
    //     mergeDeps
    //   };
    // });
    updateFilteredData();

  }, [company.selectCompany, loadedData]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <section className="dept_mapper">
          {filteredData?.missingDeps?.length ? <MissingDepartments
            departments={filteredData.missingDeps} /> : null}
          <section className="dept_mapper__title">
            <section className="dept_mapper__title--company">
              <select
                className="item_component-title__container-data--text"
                value={company.selectCompany}
                onChange={(e) => setCompany(prev => {
                  return {
                    ...prev,
                    selectCompany: e.target.value
                  };
                })}
              >
                {company.companyNames.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </section>
            <span className="dept_mapper__title--info">Dopasuj wyświetlanie danych</span>
            <section className="dept_mapper__title--company"></section>

          </section>
          <section className="dept_mapper__container">
            <section className="dept_mapper__container-item">
              <section className="dept_mapper-counter">
                <span >Lp</span>
              </section>
              <section className="dept_mapper-department">
                <span >Dział</span>
              </section>
              <section className="dept_mapper-localization">
                <span >Lokalizacja</span>
              </section>
              <section className="dept_mapper-area">
                <span >Obszar</span>
              </section>
              <section className="dept_mapper-owner">
                <span >Owner</span>
              </section>
              <section className="dept_mapper-guardian">
                <span >Opiekun</span>
              </section>
              <section className="dept_mapper_settings-icon"
                style={{ marginRight: "15px" }}>
              </section>
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
