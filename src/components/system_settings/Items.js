import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import ItemComponent from './ItemComponent';
import ItemAging from './ItemAging';
import PercentageTarget from "./PercentageTarget";
import "./Items.css";

const FKItems = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  // const { pleaseWait, setPleaseWait } = useData();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [dataItems, setDataItems] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [toggleState, setToggleState] = useState(1);

  // const aging = ["<1", "1-30", "31-60", "180-360", ">360"];

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

      const itemsData = await axiosPrivateIntercept.get("/items/get-items");
      setDataItems(itemsData.data.data);

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
        <section className="items">
          <section className="items-wrapper">
            <section className="items__container">
              {/* <section className="items--bloc-tabs"> */}
              <section className="bloc-tabs">
                <button
                  className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
                  onClick={() => toggleTab(1)}
                ></button>
                <button
                  className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
                  onClick={() => toggleTab(2)}
                ></button>
                {/* <button
                  className={toggleState === 3 ? "tabs active-tabs" : "tabs"}

                  onClick={() => toggleTab(3)}
                ></button> */}
              </section>
              <section className="content-tabs">
                <section
                  className={
                    toggleState === 1
                      ? "content  active-content"
                      : "content"
                  }
                >
                  <section className="items__section-content">
                    <section className="items__section-content-data">
                      {/* <ItemComponent
                        data={dataItems.departments}
                        multiCompany={dataItems?.company ? dataItems.company[0].company : []}
                        info="DEPARTMENT"
                        title="Działy"

                      /> */}
                      <ItemComponent
                        data={dataItems.areas}
                        multiCompany={dataItems?.company ? dataItems.company[0].company : []}
                        info="AREA"
                        title="Obszary"
                      />

                    </section>
                    <section className="items__section-content-data">
                      <ItemComponent
                        data={dataItems.localizations}
                        multiCompany={dataItems?.company ? dataItems.company[0].company : []}
                        info="LOCALIZATION"
                        title="Lokalizacje"
                      />
                      {/* <ItemComponent
                        data={dataItems.areas}
                        multiCompany={dataItems?.company ? dataItems.company[0].company : []}
                        info="AREA"
                        title="Obszary"
                      /> */}
                    </section>
                    <section className="items__section-content-data">
                      {/* <ItemComponent
                        data={dataItems.areas}
                        multiCompany={dataItems?.company ? dataItems.company[0].company : []}
                        info="AREA"
                        title="Obszary"
                      /> */}
                      <ItemComponent
                        data={dataItems.owners}
                        multiCompany={dataItems?.company ? dataItems.company[0].company : []}
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
                  <section className="items__section-content">
                    <section className="items__section-content-data">
                      {/* <ItemComponent
                        data={dataItems.owners}
                        multiCompany={dataItems?.company ? dataItems.company[0].company : []}
                        info="OWNER"
                        title="Ownerzy"
                      /> */}
                      <ItemComponent
                        data={dataItems.guardians}
                        multiCompany={dataItems?.company ? dataItems.company[0].company : []}
                        info="GUARDIAN"
                        title="Opiekun"
                      />
                    </section>
                    {/*    <section className="items__section-content-data">
                    <ItemComponent
                        data={dataItems.guardians}
                        multiCompany={dataItems?.company ? dataItems.company[0].company : []}
                        info="GUARDIAN"
                        title="Opiekun"
                      /> 
                    </section>*/}

                    <section className="items__section-content-data">
                      <ItemAging
                        data={dataItems.aging}
                        info="AGING"
                        title="Wiekowanie"
                        setPleaseWait={setPleaseWait}
                      />
                    </section>
                    {/* <section className="items__section-content-data">
                      <ItemAging
                        data={dataItems.aging}
                        info="AGING"
                        title="Wiekowanie"
                        setPleaseWait={setPleaseWait}
                      /> */}
                    <section className="items__section-content-data">

                      <PercentageTarget departments={departments}
                        setPleaseWait={setPleaseWait}
                      />
                    </section>
                  </section>
                </section>
                {/* <section
                  className={
                    toggleState === 3 ? "content  active-content" : "content"
                  }
                > */}
                {/* <section className="items__section-content"> */}
                {/* <section className="items__section-content-data"></section>
                    <section className="items__section-content-data"></section>
                    <section className="items__section-content-data"></section> */}
                {/* </section> */}
                {/* </section> */}
              </section>
            </section>
          </section>
        </section>
      )}
    </>
  );
  // return (
  //   <>
  //     {pleaseWait ? (
  //       <PleaseWait />
  //     ) : (
  //       <section className="items">
  //         <section className="items-wrapper">
  //           <section className="items__container">
  //             {/* <section className="items--bloc-tabs"> */}
  //             <section className="bloc-tabs">
  //               <button
  //                 className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
  //                 onClick={() => toggleTab(1)}
  //               ></button>
  //               <button
  //                 className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
  //                 onClick={() => toggleTab(2)}
  //               ></button>
  //               <button
  //                 className={toggleState === 3 ? "tabs active-tabs" : "tabs"}

  //                 onClick={() => toggleTab(3)}
  //               ></button>
  //             </section>
  //             <section className="content-tabs">
  //               <section
  //                 className={
  //                   toggleState === 1
  //                     ? "content  active-content"
  //                     : "content"
  //                 }
  //               >
  //                 <section className="items__section-content">
  //                   <section className="items__section-content-data">
  //                     <ItemComponent
  //                       data={dataItems.departments}
  //                       multiCompany={dataItems?.company ? dataItems.company[0].company : []}
  //                       // multiCompany={['KRT', "KOD"]}
  //                       // multiCompany={['KEM']}
  //                       info="DEPARTMENT"
  //                       title="Działy"

  //                     />
  //                   </section>
  //                   <section className="items__section-content-data">
  //                     <ItemComponent
  //                       data={dataItems.localizations}
  //                       multiCompany={dataItems?.company ? dataItems.company[0].company : []}
  //                       info="LOCALIZATION"
  //                       title="Lokalizacje"
  //                     />
  //                   </section>
  //                   <section className="items__section-content-data">
  //                     <ItemComponent
  //                       data={dataItems.areas}
  //                       multiCompany={dataItems?.company ? dataItems.company[0].company : []}
  //                       info="AREA"
  //                       title="Obszary"
  //                     />
  //                   </section>
  //                 </section>
  //               </section>
  //               <section
  //                 className={
  //                   toggleState === 2 ? "content  active-content" : "content"
  //                 }
  //               >
  //                 <section className="items__section-content">
  //                   <section className="items__section-content-data">
  //                     <ItemComponent
  //                       data={dataItems.owners}
  //                       multiCompany={dataItems?.company ? dataItems.company[0].company : []}
  //                       info="OWNER"
  //                       title="Ownerzy"
  //                     />
  //                   </section>
  //                   <section className="items__section-content-data">
  //                     <ItemComponent
  //                       data={dataItems.guardians}
  //                       multiCompany={dataItems?.company ? dataItems.company[0].company : []}
  //                       info="GUARDIAN"
  //                       title="Opiekun"
  //                     />
  //                   </section>
  //                   <section className="items__section-content-data">
  //                     <ItemAging
  //                       data={dataItems.aging}
  //                       info="AGING"
  //                       title="Wiekowanie"
  //                       setPleaseWait={setPleaseWait}
  //                     />
  //                   </section>
  //                 </section>
  //               </section>
  //               <section
  //                 className={
  //                   toggleState === 3 ? "content  active-content" : "content"
  //                 }
  //               >
  //                 <section className="items__section-content">
  //                   <section className="items__section-content-data">
  //                     <PercentageTarget departments={departments}
  //                       setPleaseWait={setPleaseWait}
  //                     />
  //                     {/* <PercentageTarget /> */}

  //                   </section>
  //                   <section className="items__section-content-data"></section>
  //                   <section className="items__section-content-data"></section>
  //                 </section>
  //               </section>
  //             </section>
  //           </section>
  //         </section>
  //       </section>
  //     )}
  //   </>
  // );
};

export default FKItems;
