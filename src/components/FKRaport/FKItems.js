import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
// import useData from "../hooks/useData";
import FKItemComponent from "./FKItemsData/FKItemComponent";
import FKItemAging from "./FKItemsData/FKItemAging";
import "./FKItems.css";

const FKItems = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  // const { pleaseWait, setPleaseWait } = useData();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [dataItems, setDataItems] = useState([]);
  const [toggleState, setToggleState] = useState(1);

  // const aging = ["<1", "1-30", "31-60", "180-360", ">360"];

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const getData = async () => {
    try {
      setPleaseWait(true);

      const result = await axiosPrivateIntercept.get("/fk/get-items-data");

      setDataItems(result.data.data);

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
        <section className="fk_items">
          <section className="fk_items-wrapper">
            <section className="fk_items__container">
              <section className="fk_items--bloc-tabs">
                <button
                  className={
                    toggleState === 1
                      ? "fk_items--bloc-area fk_items--bloc-active-tabs"
                      : "fk_items--bloc-area"
                  }
                  onClick={() => toggleTab(1)}
                ></button>
                <button
                  className={
                    toggleState === 2
                      ? "fk_items--bloc-area fk_items--bloc-active-tabs"
                      : "fk_items--bloc-area"
                  }
                  onClick={() => toggleTab(2)}
                ></button>
                <button
                  className={
                    toggleState === 3
                      ? "fk_items--bloc-area fk_items--bloc-active-tabs"
                      : "fk_items--bloc-area"
                  }
                  onClick={() => toggleTab(3)}
                ></button>
              </section>

              <section className="fk_items__content-tabs">
                <section
                  className={
                    toggleState === 1
                      ? "fk_items__content  fk_items__active-content"
                      : "fk_items__content"
                  }
                >
                  <section className="fk_items__section-content">
                    <section className="fk_items__section-content-data">
                      <FKItemComponent
                        data={dataItems.departments}
                        info="departments"
                        title="Działy"
                      />
                    </section>
                    <section className="fk_items__section-content-data">
                      <FKItemComponent
                        data={dataItems.localizations}
                        info="localizations"
                        title="Lokalizacje"
                      />
                    </section>
                    <section className="fk_items__section-content-data">
                      <FKItemComponent
                        data={dataItems.areas}
                        info="areas"
                        title="Obszary"
                      />
                    </section>
                  </section>
                </section>
                <section
                  className={
                    toggleState === 2 ? "content  active-content" : "content"
                  }
                >
                  <section className="fk_items__section-content">
                    <section className="fk_items__section-content-data">
                      <FKItemComponent
                        data={dataItems.owners}
                        info="owners"
                        title="Ownerzy"
                      />
                    </section>
                    <section className="fk_items__section-content-data">
                      <FKItemComponent
                        data={dataItems.guardians}
                        info="guardians"
                        title="Opiekun"
                      />
                    </section>
                    <section className="fk_items__section-content-data">
                      <FKItemAging
                        data={dataItems.aging}
                        info="aging"
                        title="Wiekowanie"
                      />
                    </section>
                  </section>
                </section>
                <section
                  className={
                    toggleState === 3 ? "content  active-content" : "content"
                  }
                >
                  <section className="fk_items__section-content">
                    <section className="fk_items__section-content-data"></section>
                    <section className="fk_items__section-content-data"></section>
                    <section className="fk_items__section-content-data"></section>
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

export default FKItems;
