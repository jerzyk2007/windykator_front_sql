import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import useData from "../hooks/useData";
import FKItemSettings from "./FKItemsData/FKItemSettings";
import "./FKDataSettings.css";

const FKDataSettings = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { pleaseWait, setPleaseWait } = useData();

  const [data, setData] = useState([]);
  const [raportDep, setRaportDep] = useState([]);
  const [mergeDep, setMergeDep] = useState([]);
  const [testData, setTestData] = useState([]);

  const uniqeDep = [
    "D001",
    "D002",
    "D003",
    "D004",
    "D005",
    "D006",
    "D007",
    "D008",
    "D009",
    "D014",
    "D017",
    "D027",
    "D031",
    "D034",
    "D536",
    "D537",
    "KSIĘGOWOŚĆ",
  ];

  const getData = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get("/fk/get-fksettings-data");
      setData(result.data);
      const uniqueDep = await axiosPrivateIntercept.get("/fk/get-uniques-dep");

      setRaportDep(uniqueDep.data.departments);

      setPleaseWait(false);
    } catch (error) {
      console.error(error);
    }
  };

  const itemsArray = uniqeDep.map((dep, index) => {
    return (
      <FKItemSettings
        key={index}
        id={index}
        dep={dep}
        dataItem={testData ? testData[index] : {}}
        settings={data}
        style="exist"
        testData={testData}
      />
    );
  });

  // funkcja która ma sprawdzić które działy są w pliku przygotowanym do generowania raportu, a które działy sa zapisane a nie będą uzyte w raporcie
  const checkDep = (depDB, depRaport) => {
    const resultArray = [];

    depDB.forEach((item) => {
      const obj = { dep: item, exist: false };
      resultArray.push(obj);
    });

    resultArray.forEach((item) => {
      if (uniqeDep.includes(item.dep)) {
        item.exist = true;
      }
    });
    // depRaport.forEach((item) => {
    //   if (!depDB.includes(item)) {
    //     resultArray.push({ dep: item, exist: true });
    //   }
    // });

    // setMergeDep(resultArray);
    // console.log(resultArray);
    // console.log(resultArray);
  };

  useEffect(() => {
    if (data?.departments && raportDep) {
      checkDep(data.departments, raportDep);
    }
    const createDataDep = uniqeDep.map((item) => {
      const test = {
        department: item,
        localization: "",
        area: "",
        owner: [""],
        guardian: [""],
      };

      return test;
    });
    setTestData(createDataDep);
  }, [data, raportDep]);

  useEffect(() => {
    // console.log(testData);
  }, [testData]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <section className="fk_data_settings">
          <section className="fk_data_settings__title">
            <span>Dopasuj wyświetlanie danych</span>
          </section>
          <section className="fk_data_settings__container">
            <section className="fk_data_settings__container-item">
              <section className="fk_data_settings-counter__container">
                <span className="fk_data_settings-counter">Lp</span>
              </section>
              <span className="fk_data_settings-department">Dział</span>
              <span className="fk_data_settings-localization">Lokalizacja</span>
              <span className="fk_data_settings-area">Obszar</span>
              <span className="fk_data_settings-owner">Owner</span>
              <span className="fk_data_settings-guardian">Opiekun</span>
            </section>

            {/* <section className="fk_data_settings__container-item">
              <span className="fk_data_settings-counter">LP</span>
              <span className="fk_data_settings-department">Dział</span>
              <span className="fk_data_settings-localization">Lokalizacja</span>
              <span className="fk_data_settings-area">Obszar</span>
              <span className="fk_data_settings-owner">Owner</span>
              <span className="fk_data_settings-guardian">Opiekun</span>
            </section> */}
            {itemsArray}
          </section>
        </section>
      )}
    </>
  );
};

export default FKDataSettings;
