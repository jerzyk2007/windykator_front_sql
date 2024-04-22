import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import LawyerAreas from "./LawyerAreas";
import "./LawyerAccount.css";

const LawyerAccount = ({
  showTable,
  filteredDataRaport,
  setTableData,
  setShowTable,
  styleCar,
  setButtonArea,
  // filter,
}) => {
  const [arrow, setArrow] = useState({
    lawyer: true,
  });

  const [areasArray, setAreasArray] = useState([]);

  const counter = filteredDataRaport.length;

  // let sum = 0;
  // filteredDataRaport.forEach((item) => {
  //   sum += item.KWOTA_DO_ROZLICZENIA_FK;
  // });

  let sumFK = 0;
  let sumAS = 0;

  filteredDataRaport.forEach((item) => {
    sumFK += item.KWOTA_DO_ROZLICZENIA_FK ? item.KWOTA_DO_ROZLICZENIA_FK : 0;
    sumAS += item.DO_ROZLICZENIA_AS ? item.DO_ROZLICZENIA_AS : 0;
  });

  // const percent = "do ustalenia";

  const handleClick = () => {
    setTableData(filteredDataRaport);
    setShowTable(true);
  };

  const generateItems = areasArray.map((item, index) => {
    return (
      <LawyerAreas
        key={index}
        styleCar=""
        area={item}
        filteredData={filteredDataRaport}
        setTableData={setTableData}
        showTable={showTable}
        setShowTable={setShowTable}
        setButtonArea={setButtonArea}
        // filter={filter}
      />
    );
  });

  useEffect(() => {
    const areasArray = [
      ...new Set(filteredDataRaport.map((item) => item.OBSZAR)),
    ].sort();
    setAreasArray(areasArray);
  }, [filteredDataRaport]);

  return (
    <>
      <section className="lawyer_account">
        <label
          className={
            styleCar === "car"
              ? "lawyer_account--select lawyer_account--select--car"
              : "lawyer_account--select "
          }
          onClick={() =>
            setArrow({
              lawyer: !arrow.lawyer,
            })
          }
        >
          <IoIosArrowDown
            className={"lawyer_account--arrow"}
            style={!arrow.lawyer ? null : { rotate: "180deg" }}
          />
          Kancelarie
        </label>
        <label
          className="lawyer_account--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="lawyer_account--doc-sum" onDoubleClick={handleClick}>
          {sumFK.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="lawyer_account--doc-sum" onDoubleClick={handleClick}>
          {sumAS.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        {/* {filter.payment !== "Wszystko" && (
          <label
            className="lawyer_account--percent"
            onDoubleClick={handleClick}
          >
            {percent}
          </label>
        )} */}
      </section>
      {arrow.lawyer && generateItems}
    </>
  );
};

export default LawyerAccount;
