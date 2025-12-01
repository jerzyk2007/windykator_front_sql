import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
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

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const prepareTarget = (data) => {
    const { time, departments: originalDepartments } = data.target;
    const { departments: departmentKeys } = data;
    const newDepartments = {
      Całość: originalDepartments["Całość"] || "-",
    };

    // Przypisanie wartości z oryginalnego obiektu lub 0 dla nowych kluczy
    departmentKeys.forEach((dep) => {
      newDepartments[dep] = originalDepartments[dep] || 0;
    });

    // Stworzenie nowego obiektu target
    const newTarget = {
      time: { ...time },
      departments: newDepartments,
    };

    return newTarget;
  };

  const getData = async () => {
    try {
      setPleaseWait(true);
      const itemsData = await axiosPrivateIntercept.get(
        "/structure/get-org-str-data"
      );

      setDataItems(itemsData.data);

      const resultDepartments = await axiosPrivateIntercept.get(
        "/settings/get-departments"
      );

      const targetData = prepareTarget(resultDepartments.data);
      setDepartments(targetData);

      setPleaseWait(false);
    } catch (error) {
      console.error("Błąd podczas pobierania danych: ", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <section className="organization_structure">
          <section className="organization_structure-wrapper">
            <section className="organization_structure__container">
              <section className="bloc-tabs">
                <button
                  className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
                  onClick={() => toggleTab(1)}
                ></button>
                <button
                  className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
                  onClick={() => toggleTab(2)}
                ></button>
                <button
                  className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
                  onClick={() => toggleTab(3)}
                ></button>
              </section>
              <section className="content-tabs">
                <section
                  className={
                    toggleState === 1 ? "content  active-content" : "content"
                  }
                >
                  <section className="organization_structure__section-content">
                    <section className="iorganization_structure__section-content-data">
                      <OrgStrItemComponent
                        data={dataItems.areas}
                        multiCompany={
                          dataItems?.company ? dataItems.company : []
                        }
                        info="AREA"
                        title="Obszary"
                      />
                    </section>
                    <section className="organization_structure__section-content-data">
                      <OrgStrItemComponent
                        data={dataItems.localizations}
                        multiCompany={
                          dataItems?.company ? dataItems.company : []
                        }
                        info="LOCALIZATION"
                        title="Lokalizacje"
                      />
                    </section>
                    <section className="organization_structure__section-content-data">
                      <OrgStrItemComponent
                        data={dataItems.owners}
                        multiCompany={
                          dataItems?.company ? dataItems.company : []
                        }
                        info="OWNER"
                        title="Ownerzy"
                      />
                    </section>
                  </section>
                </section>
                <section
                  className={
                    toggleState === 2 ? "content  active-content" : "content"
                  }
                >
                  <section className="organization_structure__section-content">
                    <section className="organization_structure__section-content-data">
                      <OrgStrItemComponent
                        data={dataItems.guardians}
                        multiCompany={
                          dataItems?.company ? dataItems.company : []
                        }
                        info="GUARDIAN"
                        title="Opiekun"
                      />
                    </section>

                    <section className="organization_structure__section-content-data">
                      <ChangeAging
                        data={dataItems.aging}
                        info="AGING"
                        title="Wiekowanie"
                        setPleaseWait={setPleaseWait}
                      />
                    </section>

                    <section className="organization_structure__section-content-data">
                      <OrgStrItemComponent
                        data={dataItems.departments}
                        multiCompany={
                          dataItems?.company ? dataItems.company : []
                        }
                        info="DEPARTMENT"
                        title="Działy"
                      />
                    </section>
                  </section>
                </section>
                <section
                  className={
                    toggleState === 3 ? "content  active-content" : "content"
                  }
                >
                  <section className="organization_structure__section-content">
                    <section className="organization_structure__section-content-data">
                      <PercentageTarget
                        departments={departments}
                        setPleaseWait={setPleaseWait}
                      />
                    </section>
                    <section className="organization_structure__section-content-data"></section>
                    <section className="organization_structure__section-content-data"></section>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
      )}
    </>
  );
};

export default OrganizationStructure;
