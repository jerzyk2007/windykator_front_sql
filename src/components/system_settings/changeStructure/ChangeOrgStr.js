import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import ChangeOrgStrEdit from "./ChangeOrgStrEdit";
import MissingDepartments from "./MissingDepartments";
import PleaseWait from "../../PleaseWait";
import "./ChangeOrgStr.css";

const ChangeOrgStr = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [createItem, setCreateItem] = useState([]);

  const [loadedData, setLoadedData] = useState({
    uniqueDepFromCompanyJI: [],
    uniqueDepFromDocuments: [],
    missingDeps: [],
    preparedItems: [],
  });

  const [filteredData, setFilteredData] = useState({
    uniqueDepFromCompanyJI: [],
    uniqueDepFromDocuments: [],
    missingDeps: [],
    preparedItems: [],
  });

  const [company, setCompany] = useState({
    selectCompany: "",
    companyNames: [],
  });

  const [editDep, setEditDep] = useState({
    department: "",
    company: "",
  });

  const checkMissingDepartments = (saveDeps, docDeps, manualDeps = []) => {
    const missingFromDocs = docDeps
      .filter(
        (dep) =>
          !saveDeps.some(
            (item) =>
              item.DEPARTMENT === dep.DZIAL && item.COMPANY === dep.FIRMA
          )
      )
      .map((dep) => ({ ...dep, manual: false }));

    const manualMarked = manualDeps.map((dep) => ({ ...dep, manual: true }));
    const combined = [...missingFromDocs, ...manualMarked];

    const unique = Array.from(
      new Map(
        combined.map((dep) => [`${dep.DZIAL}_${dep.FIRMA}`, dep])
      ).values()
    );

    return unique;
  };

  const checkDocPay = async (checkDeps) => {
    try {
      return checkDeps?.length
        ? await axiosPrivateIntercept.post("/structure/check-doc-payment", {
            departments: checkDeps,
          })
        : null;
    } catch (err) {
      console.error(err);
    }
  };

  const getData = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get(
        "/structure/get-fksettings-data"
      );

      const checkMissingDeps = checkMissingDepartments(
        result.data.uniqueDepFromCompanyJI,
        result.data.uniqueDepFromDocuments,
        result.data.manualAddDep
      );

      const checkDocPayment = await checkDocPay(checkMissingDeps);

      setCompany({
        selectCompany:
          result.data.company.length > 1 ? "ALL" : result.data.company[0] || "",
        companyNames:
          result.data.company.length > 1
            ? ["ALL", ...result.data.company]
            : result.data.company,
      });

      const transformUniqDep = result.data.uniqueDepFromDocuments.map(
        (item) => ({
          DEPARTMENT: item.DZIAL,
          COMPANY: item.FIRMA,
        })
      );

      const transformManualDep = result.data.manualAddDep.map((item) => ({
        DEPARTMENT: item.DZIAL,
        COMPANY: item.FIRMA,
      }));

      const mergedUniqDep = [
        ...result.data.uniqueDepFromCompanyJI,
        ...transformUniqDep,
        ...transformManualDep,
      ];

      const uniqueDeps = mergedUniqDep.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.DEPARTMENT === item.DEPARTMENT && t.COMPANY === item.COMPANY
          )
      );

      setLoadedData((prev) => ({
        ...prev,
        uniqueDepFromCompanyJI: result.data.uniqueDepFromCompanyJI || [],
        uniqueDepFromDocuments: result.data.uniqueDepFromDocuments || [],
        manualAddDep: result.data.manualAddDep || [],
        missingDeps: checkDocPayment ? checkDocPayment.data.checkDoc : [],
        preparedItems: result.data.preparedItems || [],
        mergeDeps: uniqueDeps.sort((a, b) =>
          a.DEPARTMENT.localeCompare(b.DEPARTMENT)
        ),
        localization: result.data.companyLoacalizations || [],
        area: result.data.companyAreas || [],
        owner: result.data.companyOwners || [],
        guardian: result.data.companyGuardians || [],
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setPleaseWait(false);
    }
  };

  const handleSaveToDB = async (itemData) => {
    setEditDep({ department: "", company: "" });
    try {
      const dataArray = [...loadedData.preparedItems];
      const existingItemIndex = dataArray.findIndex(
        (item) =>
          item.DEPARTMENT === itemData.department &&
          item.COMPANY === itemData.company
      );

      if (existingItemIndex !== -1) {
        dataArray[existingItemIndex] = {
          ...dataArray[existingItemIndex],
          COMPANY: itemData.company,
          LOCALIZATION: itemData.localization,
          AREA: itemData.area,
          OWNER: itemData.owner,
          GUARDIAN: itemData.guardian,
        };
      } else {
        dataArray.push({
          DEPARTMENT: itemData.department,
          COMPANY: itemData.company,
          LOCALIZATION: itemData.localization,
          AREA: itemData.area,
          OWNER: itemData.owner,
          GUARDIAN: itemData.guardian,
        });
      }

      const sortedArray = [...dataArray].sort((a, b) => {
        const deptCompare = (a.DEPARTMENT || "").localeCompare(
          b.DEPARTMENT || ""
        );
        return deptCompare !== 0
          ? deptCompare
          : (a.COMPANY || "").localeCompare(b.COMPANY || "");
      });

      const newDep = {
        DEPARTMENT: itemData.department,
        COMPANY: itemData.company,
      };
      const exists = loadedData.uniqueDepFromCompanyJI.some(
        (item) =>
          item.DEPARTMENT === newDep.DEPARTMENT &&
          item.COMPANY === newDep.COMPANY
      );

      const updateDep = exists
        ? loadedData.uniqueDepFromCompanyJI
        : [...loadedData.uniqueDepFromCompanyJI, newDep];

      setLoadedData((prev) => ({
        ...prev,
        preparedItems: sortedArray,
        uniqueDepFromCompanyJI: updateDep,
      }));

      await axiosPrivateIntercept.patch("/structure/save-prepared-items", {
        itemData,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteItem = async (dep, comp) => {
    setEditDep({ department: "", company: "" });
    try {
      await axiosPrivateIntercept.delete(
        `/structure/delete-prepared-item/${encodeURIComponent(
          dep
        )}/${encodeURIComponent(comp)}`
      );
      setLoadedData((prev) => ({
        ...prev,
        preparedItems: prev.preparedItems.filter(
          (item) => !(item.DEPARTMENT === dep && item.COMPANY === comp)
        ),
        uniqueDepFromCompanyJI: prev.uniqueDepFromCompanyJI.filter(
          (item) => !(item.DEPARTMENT === dep && item.COMPANY === comp)
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const updateFilteredData = async () => {
    try {
      setPleaseWait(true);
      const checkMissingDeps = checkMissingDepartments(
        loadedData.uniqueDepFromCompanyJI,
        loadedData.uniqueDepFromDocuments,
        loadedData.manualAddDep
      );
      const checkDocPayment = await checkDocPay(checkMissingDeps);
      const docPay = checkDocPayment ? checkDocPayment.data.checkDoc : [];

      const missingDeps =
        company.selectCompany !== "ALL"
          ? docPay?.filter((item) => item.company === company.selectCompany)
          : docPay;

      const preparedItems =
        company.selectCompany !== "ALL"
          ? loadedData?.preparedItems?.filter(
              (item) => item.COMPANY === company.selectCompany
            )
          : loadedData.preparedItems;

      const mergeDeps =
        company.selectCompany !== "ALL"
          ? loadedData?.mergeDeps?.filter(
              (item) => item.COMPANY === company.selectCompany
            )
          : loadedData.mergeDeps;

      setFilteredData((prev) => ({
        ...prev,
        missingDeps,
        preparedItems,
        mergeDeps,
      }));

      const createDataDep = mergeDeps?.map((item) => {
        const dbItem = preparedItems.find(
          (db) =>
            db.DEPARTMENT === item.DEPARTMENT && db.COMPANY === item.COMPANY
        );

        return dbItem
          ? {
              department: item.DEPARTMENT,
              company: item.COMPANY,
              localization: dbItem.LOCALIZATION || "",
              area: dbItem.AREA || "",
              owner: dbItem.OWNER || [""],
              guardian: dbItem.GUARDIAN || [""],
              exist: true,
            }
          : {
              department: item.DEPARTMENT,
              company: item.COMPANY,
              localization: "",
              area: "",
              owner: [""],
              guardian: [""],
              exist: false,
            };
      });

      setCreateItem(
        createDataDep?.sort((a, b) => a.department.localeCompare(b.department))
      );
      setPleaseWait(false);
    } catch (err) {
      console.error(err);
      setPleaseWait(false);
    }
  };

  useEffect(() => {
    updateFilteredData();
  }, [company.selectCompany, loadedData]);

  useEffect(() => {
    getData();
  }, []);

  const itemsArray = createItem?.map((item, index) => {
    if (
      item.department === editDep.department &&
      item.company === editDep.company
    ) {
      const localization = loadedData?.localization
        .filter((loc) => loc.COMPANY === item.company)
        .map((loc) => loc.LOCALIZATION);
      const area = loadedData?.area
        .filter((a) => a.COMPANY === "ALL" || a.COMPANY === item.company)
        .map((a) => a.AREA);
      const owner = loadedData?.owner
        .filter((own) => own.COMPANY === item.company)
        .map((own) => own.OWNER);
      const guardian = loadedData?.guardian
        .filter((guard) => guard.COMPANY === item.company)
        .map((guard) => guard.GUARDIAN);

      return (
        <ChangeOrgStrEdit
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
    } else {
      return (
        <section
          key={index}
          className={`change-org-str__item ${
            !item.exist ? "change-org-str__item--missing" : ""
          }`}
          onDoubleClick={() =>
            !editDep.department &&
            setEditDep({ department: item.department, company: item.company })
          }
        >
          <div className="change-org-str__col-lp">
            <span>{index + 1}</span>
          </div>
          <div className="change-org-str__col-dept">
            <div className="change-org-str__dept-box">
              <span>{item.department}</span>
              <span>{item.company}</span>
            </div>
          </div>
          <div className="change-org-str__col-loc">
            <span className="change-org-str__data-span">
              {item.localization}
            </span>
          </div>
          <div className="change-org-str__col-area">
            <span className="change-org-str__data-span">{item.area}</span>
          </div>
          <div
            className={`change-org-str__col-owner ${
              item.owner.length === 1 ? "change-org-str__col-owner--single" : ""
            }`}
          >
            {item.owner.map((own, i) => (
              <div key={i} className="change-org-str__owner-item">
                <span className="change-org-str__data-span">{own}</span>
              </div>
            ))}
          </div>
          <div className="change-org-str__col-guardian">
            {item.guardian.map((guard, i) => (
              <div key={i} className="change-org-str__guardian-item">
                <span className="change-org-str__data-span">{guard}</span>
              </div>
            ))}
          </div>
        </section>
      );
    }
  });

  return (
    <>
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <section className="change-org-str">
          {filteredData?.missingDeps ? (
            <MissingDepartments
              departments={filteredData.missingDeps}
              companyData={company}
            />
          ) : (
            <PleaseWait />
          )}

          <header className="change-org-str__header">
            <div className="change-org-str__header-filter">
              <select
                className="change-org-str__select"
                value={company?.selectCompany}
                onChange={(e) =>
                  setCompany((prev) => ({
                    ...prev,
                    selectCompany: e.target.value,
                  }))
                }
                disabled={editDep.department}
              >
                {company?.companyNames?.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="change-org-str__header-info">
              Dopasuj wyświetlanie danych
            </div>
            <div className="change-org-str__header-spacer"></div>
          </header>

          {/* <main className="change-org-str__main">
            <section className="change-org-str__item change-org-str__item--header">
              <div className="change-org-str__col-lp">
                <span>Lp</span>
              </div>
              <div className="change-org-str__col-dept">
                <span>Dział</span>
              </div>
              <div className="change-org-str__col-loc">
                <span>Lokalizacja</span>
              </div>
              <div className="change-org-str__col-area">
                <span>Obszar</span>
              </div>
              <div className="change-org-str__col-owner">
                <span>Owner</span>
              </div>
              <div className="change-org-str__col-guardian">
                <span>Opiekun</span>
              </div>
            </section>

            <section className="change-org-str__list">{itemsArray}</section>
          </main> */}
          <main className="change-org-str__main">
            <section className="change-org-str__item change-org-str__item--header">
              <div className="change-org-str__col-lp">
                <span>Lp</span>
              </div>
              <div className="change-org-str__col-dept">
                <span>Dział</span>
              </div>
              <div className="change-org-str__col-loc">
                <span>Lokalizacja</span>
              </div>
              <div className="change-org-str__col-area">
                <span>Obszar</span>
              </div>
              <div className="change-org-str__col-owner">
                <span>Owner</span>
              </div>
              <div className="change-org-str__col-guardian">
                <span>Opiekun</span>
              </div>
            </section>
            <section className="change-org-str__list">{itemsArray}</section>
          </main>
        </section>
      )}
    </>
  );
};

export default ChangeOrgStr;
