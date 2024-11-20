import { useState } from "react";
import TableColumns from "./TableColumns";

import "./TableSettings.css";

const TableSettings = () => {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <section className="table_settings">
      <section className="table_settings_items">
        <section className="table_settings-wrapper">
          <section className="table_settings__container">
            {/* <section className="table_settings--bloc-tabs"> */}
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
                <section className="table_settings_section-content">
                  {/* <section className="table_settings_section-content-data"> */}
                  {/* <TableSettings dataColumns={columns} /> */}
                  <TableColumns />
                  {/* </section> */}
                  <section className="table_settings_section-content-data">

                    {/* <TableColumns /> */}
                  </section>

                </section>
              </section>
              <section
                className={
                  toggleState === 2 ? "content  active-content" : "content"
                }
              >
                <section className="table_settings_section-content">
                  <section className="table_settings_section-content-data"></section>
                  <section className="table_settings_section-content-data"></section>
                </section>
              </section>
              <section
                className={
                  toggleState === 3 ? "content  active-content" : "content"
                }
              >
                <section className="table_settings_section-content">
                  <section className="table_settings_section-content-data"></section>
                  <section className="table_settings_section-content-data"></section>
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
};

export default TableSettings;
