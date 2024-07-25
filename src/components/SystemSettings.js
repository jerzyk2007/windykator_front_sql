import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from "./hooks/useData";
import PleaseWait from "./PleaseWait";
import PercentageTarget from "./PercentageTarget";
import TableSettings from "./TableSettings";

import "./SystemSettings.css";

const SystemSettings = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [columns, setColumns] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const prepareTarget = (data) => {
    const { time, departments: originalDepartments } = data.target;
    const { departments: departmentKeys } = data;

    // Nowy obiekt departments
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

  // pobiera wszytskie nazwy kolumn z pierwszego dokumnetu w DB
  const handleGetData = async () => {
    try {
      setPleaseWait(true);

      const documentsColumn = await axiosPrivateIntercept.get(
        `/documents/get-all/${auth._id}/actual`
      );
      const firstDocument = documentsColumn.data[0];

      const keysArray = Object.keys(firstDocument);
      const newArray = keysArray.filter(
        (item) => item !== "_id" && item !== "__v"
      );

      createColumns(newArray);

      const resultDepartments = await axiosPrivateIntercept.get(
        "/settings/get-departments"
      );
      const targetData = prepareTarget(resultDepartments.data);
      setDepartments(targetData);

      setPleaseWait(false);
    } catch (err) {
      console.error(err);
    }
  };

  //tworzy kolumny na podstawie już zapisanych danych w DB i sprawdza czy są jakies nowe kolumny dzięki handleGetData
  const createColumns = async (columnsName) => {
    try {
      const settingsColumn = await axiosPrivateIntercept.get(
        "/settings/get-columns"
      );
      const newColumns = columnsName.map((colName) => {
        const matchingColumn = settingsColumn.data.find(
          (column) => column.accessorKey === colName
        );

        if (matchingColumn) {
          return {
            accessorKey: matchingColumn.accessorKey,
            header: matchingColumn.header,
            filterVariant: matchingColumn.filterVariant,
            type: matchingColumn.type,
          };
        } else {
          return {
            accessorKey: colName,
            header: colName,
            filterVariant: "contains",
            type: "text",
          };
        }
      });

      setColumns(newColumns);
    } catch (error) {
      console.error("Błąd podczas pobierania kolumn: ", error);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <section className="system_settings">
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <>
          <section className="system_settings_items">
            <section className="system_settings-wrapper">
              <section className="system_settings__container">
                <section className="system_settings--bloc-tabs">
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
                    <section className="system_settings_section-content">
                      <section className="system_settings_section-content-data">
                        <TableSettings dataColumns={columns} />
                      </section>

                      <section className="system_settings_section-content-data">
                        <PercentageTarget departments={departments} />
                      </section>
                    </section>
                  </section>
                  <section
                    className={
                      toggleState === 2 ? "content  active-content" : "content"
                    }
                  >
                    <section className="system_settings_section-content">
                      <section className="system_settings_section-content-data"></section>
                      <section className="system_settings_section-content-data"></section>
                    </section>
                  </section>
                  <section
                    className={
                      toggleState === 3 ? "content  active-content" : "content"
                    }
                  >
                    <section className="system_settings_section-content">
                      <section className="system_settings_section-content-data"></section>
                      <section className="system_settings_section-content-data"></section>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </>
      )}
    </section>
  );
};

export default SystemSettings;
