import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import useData from "../hooks/useData";
import FKDepartments from "./FKItemsData/FKDepartments";
import FKLocalization from "./FKItemsData/FKLocalization";
import "./FKItems.css";

const FKItems = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { pleaseWait, setPleaseWait } = useData();

  const [dataItems, setDataItems] = useState([]);

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

  // useEffect(() => {
  //   console.log(dataItems);
  // }, [dataItems]);

  return (
    <>
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <section className="fk_items">
          <FKDepartments data={dataItems.departments} />
          <FKLocalization />
          <section className="fk_items__container">
            <section className="fk_items-title__container">
              <span className="fk_items--title">Obszar</span>
              <i className="fas fa-save fk_items--title--save"></i>
            </section>
          </section>
          <section className="fk_items__container">
            <section className="fk_items-title__container">
              <span className="fk_items--title">Owner</span>
              <i className="fas fa-save fk_items--title--save"></i>
            </section>
          </section>
          <section className="fk_items__container">
            <section className="fk_items-title__container">
              <span className="fk_items--title">Opiekun</span>
              <i className="fas fa-save fk_items--title--save"></i>
            </section>
          </section>
        </section>
      )}
    </>
  );
};

export default FKItems;
