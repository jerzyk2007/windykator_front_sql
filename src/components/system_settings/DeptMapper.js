import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import DeptMapperEdit from "./DeptMapperEdit";
import MissingDepartments from "./MissingDepartments";
import PleaseWait from "../PleaseWait";
import "./DeptMapper.css";

const DeptMapper = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [createItem, setCreateItem] = useState([]);

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

  const [editDep, setEditDep] = useState({
    department: "",
    company: ""
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

    setEditDep({
      department: "",
      company: ""
    });
    try {
      // Tworzymy kopię tablicy stanu preparedItems
      const dataArray = [...loadedData.preparedItems];

      // Sprawdzamy, czy istnieje już obiekt o danym department
      const existingItemIndex = dataArray.findIndex(
        (item) => item.DEPARTMENT === itemData.department && item.COMPANY === itemData.company
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
      }

      else {
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

      await axiosPrivateIntercept.patch("/items/save-prepared-items", {
        itemData
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteItem = async (dep, comp) => {
    setEditDep({
      department: "",
      company: ""
    });

    try {


      await axiosPrivateIntercept.delete(`/items/delete-prepared-item/${encodeURIComponent(dep)}/${encodeURIComponent(comp)}`);

      // await axiosPrivateIntercept.delete(`/items/delete-prepared-item`, {
      //   department: dep,
      //   company: comp
      // });
      const filteredPreparedItems = loadedData?.preparedItems?.filter(item => !(item.DEPARTMENT === dep && item.COMPANY === comp));
      const filteredUniqueDepFromCompanyJI = loadedData?.uniqueDepFromCompanyJI?.filter(item => !(item.DEPARTMENT === dep && item.COMPANY === comp));
      setLoadedData(prev => ({
        ...prev,
        preparedItems: filteredPreparedItems,
        uniqueDepFromCompanyJI: filteredUniqueDepFromCompanyJI
      }));
    }
    catch (error) {
      console.error(error);
    }
  };

  const itemsArray = createItem?.map((item, index) => {

    if (item.department === editDep.department && item.company === editDep.company) {

      const localization = loadedData?.localization.map(loc => {
        if (loc.COMPANY === item.company) {

          return loc.LOCALIZATION;
        }
      }).filter(Boolean);

      const area = loadedData?.area.map(area => {

        if (area.COMPANY === "ALL") {
          return area.AREA;
        } else
          if (area.COMPANY === item.company) {
            return area.AREA;
          }
      }).filter(Boolean);


      const owner = loadedData?.owner.map(own => {
        if (own.COMPANY === item.company) {
          return own.OWNER;
        }
      }).filter(Boolean);

      const guardian = loadedData?.guardian.map(guard => {
        if (guard.COMPANY === item.company) {
          return guard.GUARDIAN;
        }
      }).filter(Boolean);

      return (
        <DeptMapperEdit
          key={index}
          id={index}
          localization={localization}
          area={area}
          owner={owner}
          guardian={guardian}
          data={item}
          setEditDep={setEditDep}
          handleSaveToDB={handleSaveToDB}
          handleDeleteItem={handleDeleteItem}
        />
      );
    }
    else {

      return (
        <section
          key={index}
          className={`dept_mapper__container-item dept_mapper__container-item__array ${!item.exist ? 'dept_mapper__highlight-yellow' : ''}`
          }
          onDoubleClick={() => {
            if (!editDep.department && !editDep.company) {
              setEditDep(
                {
                  department: item.department,
                  company: item.company
                }
              );
            }
          }}
        >
          <section className="dept_mapper-counter">
            <span
            >
              {index + 1}
            </span>
          </section>

          <section className="dept_mapper-department">
            <section className="dept_mapper-department__container">

              <span>{item.department}</span>
              <span>{item.company}</span>
            </section>
          </section>
          <section className="dept_mapper-localization">
            <span className="dept_mapper-span">{item.localization}</span>
          </section>
          <section className="dept_mapper-area">
            <span className="dept_mapper-span">{item.area}</span>
          </section>
          <section className="dept_mapper-owner_guard__container">

            {item.owner.map((own, index) => {
              return (
                <section
                  key={index}
                  className="dept_mapper-owner">
                  <span className="dept_mapper-span">{own}</span>
                </section>
              );
            })}
          </section>
          <section className="dept_mapper-owner_guard__container">

            {item.guardian.map((guard, index) => {
              return (
                <section
                  key={index}
                  className="dept_mapper-owner">
                  <span className="dept_mapper-span">{guard}</span>
                </section>
              );
            })}
          </section>
        </section>
      );

    }
  });

  const updateFilteredData = async () => {
    try {
      setPleaseWait(true);
      const checkMissingDeps = checkMissingDepartments(loadedData.uniqueDepFromCompanyJI, loadedData.uniqueDepFromDocuments);
      const checkDocPayment = await checkDocPay(checkMissingDeps);
      const docPay = checkDocPayment ? checkDocPayment.data.checkDoc : [];

      const missingDeps = company.selectCompany !== 'ALL' ? docPay?.filter(item => item.company === company.selectCompany) : docPay;
      const preparedItems = company.selectCompany !== 'ALL' ? loadedData?.preparedItems?.filter(item => item.COMPANY === company.selectCompany) : loadedData.preparedItems;
      const mergeDeps = company.selectCompany !== 'ALL' ? loadedData?.mergeDeps?.filter(item => item.COMPANY === company.selectCompany) : loadedData.mergeDeps;

      setFilteredData(prev => {
        return {
          ...prev,
          missingDeps,
          preparedItems,
          mergeDeps
        };
      });

      const createDataDep = mergeDeps?.map((item) => {
        //sprawdz czy jakieś dane są zapisane w DB
        const dbItem = preparedItems.find((dbItem) => dbItem.DEPARTMENT === item.DEPARTMENT && dbItem.COMPANY === item.COMPANY);

        if (dbItem) {
          return {
            department: item.DEPARTMENT,
            company: item.COMPANY,
            localization: dbItem.LOCALIZATION || "",
            area: dbItem.AREA || "",
            owner: dbItem.OWNER || [""],
            guardian: dbItem.GUARDIAN || [""],
            exist: true
          };
        }
        else {
          // Jeśli nie znaleziono obiektu w tablicy itemsDB, utwórz pusty obiekt
          return {
            department: item.DEPARTMENT,
            company: item.COMPANY,
            localization: "",
            area: "",
            owner: [""],
            guardian: [""],
            exist: false

          };
        }
      });
      setCreateItem(createDataDep?.sort((a, b) => a.department.localeCompare(b.department)));

      setPleaseWait(false);

    }
    catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
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
            departments={filteredData.missingDeps} /> : <PleaseWait />}
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
                disabled={editDep.department}
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
            <section className="dept_mapper__container-item--title dept_mapper__container-item">
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
              <section className="dept_mapper-owner_guard__container">
                <section className="dept_mapper-owner">
                  <span >Owner</span>
                </section>
              </section>
              <section className="dept_mapper-owner_guard__container">

                <section className="dept_mapper-guardian">
                  <span >Opiekun</span>
                </section>

              </section>
              {/* <section className="dept_mapper-scroll">

              </section> */}

            </section>
          </section>
          <section className="dept_mapper__container-array">
            {itemsArray}
          </section>
        </section >
      )}
    </>
  );
};

export default DeptMapper;
