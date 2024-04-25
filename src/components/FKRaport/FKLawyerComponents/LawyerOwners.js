import React, { useState } from "react";
import "./LawyerOwners.css";

const LawyerOwners = ({
  own,
  filteredData,
  setTableData,
  setShowTable,
  showTable,
  styleCar,
}) => {
  const [arrow, setArrow] = useState({
    [own]: false,
  });

  const counter = filteredData.reduce((acc, doc) => {
    if (doc.OWNER === own) {
      acc++;
    }
    return acc;
  }, 0);

  let sumFK = 0;
  let sumAS = 0;

  filteredData.forEach((item) => {
    if (item.OWNER === own) {
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
    }
    return { sumFK, sumAS };
  });
  // const percent = "do ustalenia";

  const filteredObjects = filteredData.filter((obj) => obj.OWNER === own);

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  return (
    <>
      <section
        className="lawyer_owners"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            styleCar === "car"
              ? "lawyer_owners--select lawyer_owners--select--car"
              : "lawyer_owners--select"
          }
          onClick={() =>
            setArrow({
              [own]: !arrow[own],
            })
          }
        >
          {own}
        </label>
        <label
          className="lawyer_owners--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="lawyer_owners--doc-sum" onDoubleClick={handleClick}>
          {sumFK.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="lawyer_owners--doc-sum" onDoubleClick={handleClick}>
          {sumAS.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
      </section>
    </>
  );
};

export default LawyerOwners;
