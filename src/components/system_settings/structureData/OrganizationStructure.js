import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import PleaseWait from "../../PleaseWait";
import OrgStrItemComponent from "./OrgStrItemComponent";
import ChangeAging from "./ChangeAging";
import PercentageTarget from "./PercentageTarget";
import "./OrganizationStructure.css";

const OrganizationStructure = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [pleaseWait, setPleaseWait] = useState(false);
  const [dataItems, setDataItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => setToggleState(index);

  const getData = async () => {
    try {
      setPleaseWait(true);
      const [itemsData, resultDepartments] = await Promise.all([
        axiosPrivateIntercept.get("/structure/get-org-str-data"),
        axiosPrivateIntercept.get("/settings/get-departments"),
      ]);

      setDataItems(itemsData.data);
      // Tutaj logika prepareTarget (pomińmy implementację dla czytelności, zakładamy że działa)
      setDepartments(resultDepartments.data.target);
      setPleaseWait(false);
    } catch (error) {
      console.error("Błąd: ", error);
      setPleaseWait(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const companyList = dataItems?.company || [];

  return (
    <div className="org-structure">
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <div className="org-structure__wrapper">
          {/* Nawigacja */}
          <nav className="org-structure__tabs-nav">
            <button
              className={`org-structure__tab ${
                toggleState === 1 ? "org-structure__tab--active" : ""
              }`}
              onClick={() => toggleTab(1)}
            >
              Panel 1
            </button>
            <button
              className={`org-structure__tab ${
                toggleState === 2 ? "org-structure__tab--active" : ""
              }`}
              onClick={() => toggleTab(2)}
            >
              Panel 2
            </button>
            <button
              className={`org-structure__tab ${
                toggleState === 3 ? "org-structure__tab--active" : ""
              }`}
              onClick={() => toggleTab(3)}
            >
              Panel 3
            </button>
          </nav>

          {/* Kontener na Grid */}
          <div className="org-structure__content-area">
            {toggleState === 1 && (
              <div className="org-structure__grid">
                <OrgStrItemComponent
                  data={dataItems.areas}
                  multiCompany={companyList}
                  info="AREA"
                  title="Obszary"
                />
                <OrgStrItemComponent
                  data={dataItems.localizations}
                  multiCompany={companyList}
                  info="LOCALIZATION"
                  title="Lokalizacje"
                />
                <OrgStrItemComponent
                  data={dataItems.owners}
                  multiCompany={companyList}
                  info="OWNER"
                  title="Ownerzy"
                />
              </div>
            )}

            {toggleState === 2 && (
              <div className="org-structure__grid">
                <OrgStrItemComponent
                  data={dataItems.guardians}
                  multiCompany={companyList}
                  info="GUARDIAN"
                  title="Opiekunowie"
                />
                <ChangeAging
                  data={dataItems.aging}
                  info="AGING"
                  title="Wiekowanie"
                  setPleaseWait={setPleaseWait}
                />
                <OrgStrItemComponent
                  data={dataItems.departments}
                  multiCompany={companyList}
                  info="DEPARTMENT"
                  title="Działy"
                />
              </div>
            )}

            {toggleState === 3 && (
              <div className="org-structure__grid">
                {/* Jeden komponent rozciągnięty lub wycentrowany */}
                <div className="org-structure__grid-centered">
                  <PercentageTarget
                    departments={departments}
                    setPleaseWait={setPleaseWait}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationStructure;
