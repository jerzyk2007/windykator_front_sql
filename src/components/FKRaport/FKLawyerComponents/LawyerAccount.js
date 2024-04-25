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
}) => {
  const [arrow, setArrow] = useState({
    lawyer: true,
  });

  const [areasArray, setAreasArray] = useState([]);

  const counter = filteredDataRaport.length;

  let sumFK = 0;
  let sumAS = 0;

  filteredDataRaport.forEach((item) => {
    if (
      typeof item.KWOTA_DO_ROZLICZENIA_FK === "number" ||
      !isNaN(item.KWOTA_DO_ROZLICZENIA_FK)
    ) {
      sumFK += Number(item.KWOTA_DO_ROZLICZENIA_FK);
    }
    if (
      typeof item.DO_ROZLICZENIA_AS === "number" ||
      !isNaN(item.DO_ROZLICZENIA_AS)
    ) {
      sumAS += Number(item.DO_ROZLICZENIA_AS);
    }
    return { sumFK, sumAS };
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
      <section
        className="lawyer_account"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
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
      </section>
      {arrow.lawyer && generateItems}
    </>
  );
};

export default LawyerAccount;
