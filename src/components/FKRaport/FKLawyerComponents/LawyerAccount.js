import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import LawyerStages from "./LawyerStages";
import LawyerAreas from "./LawyerAreas";
import "./LawyerAccount.css";

const LawyerAccount = ({
  showTable,
  filteredDataRaport,
  setTableData,
  setShowTable,
  style,
  setButtonArea,
}) => {
  const [arrow, setArrow] = useState({
    lawyer: true,
  });

  const [areasArray, setAreasArray] = useState([]);

  const counter = filteredDataRaport.length;

  let sum = 0;
  filteredDataRaport.forEach((item) => {
    sum += item.KWOTA_DO_ROZLICZENIA_FK;
  });

  const percent = "do ustalenia";

  const handleClick = () => {
    setTableData(filteredDataRaport);
    setShowTable(true);
  };

  const generateItems = areasArray.map((item, index) => {
    return (
      <LawyerAreas
        key={index}
        style=""
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
      <section className="lawyer_account">
        <label
          className={
            style === "car"
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
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="lawyer_account--percent" onDoubleClick={handleClick}>
          {percent}
        </label>
      </section>
      {arrow.lawyer && generateItems}
    </>
  );
};

export default LawyerAccount;
