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
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  // pobiera wszytskie nazwy kolumn z pierwszego dokumnetu w DB
  const handleGetData = async () => {
    try {
      setPleaseWait(true);

      const documentsColumn = await axiosPrivateIntercept.get(
        `/documents/get-columns-name`
      );

      await createColumns(documentsColumn.data);

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
      console.log(newColumns);
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
                {/* <section className="system_settings--bloc-tabs"> */}
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
                    <section className="system_settings_section-content">
                      <section className="system_settings_section-content-data">
                        <TableSettings dataColumns={columns} />
                      </section>

                      <section className="system_settings_section-content-data">
                        {/* <PercentageTarget departments={departments} /> */}
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
