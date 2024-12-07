import React, { useState } from "react";
import "./GenerateAging.css";

const GenerateAging = ({
  age,
  filteredData,
  setTableData,
  setShowTable,
  styleCar,
  showTable,
}) => {
  const [arrow, setArrow] = useState({
    [age]: false,
  });

  const counter = filteredData.reduce((acc, doc) => {
    if (doc.PRZEDZIAL_WIEKOWANIE === age) {
      acc++;
    }
    return acc;
  }, 0);

  let sumFK = 0;
  let sumAS = 0;

  filteredData.forEach((item) => {
    if (item.PRZEDZIAL_WIEKOWANIE === age) {
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

  const filteredObjects = filteredData.filter(
    (obj) => obj.PRZEDZIAL_WIEKOWANIE === age
  );

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  return (
    <>
      <section
        className="generate_aging"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            styleCar === "car"
              ? "generate_aging--select generate_aging--select--car"
              : "generate_aging--select"
          }
          onClick={() =>
            setArrow({
              [age]: !arrow[age],
            })
          }
        >
          {age}
        </label>
        <label
          className="generate_aging--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="generate_aging--doc-sum" onDoubleClick={handleClick}>
          {sumFK.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="generate_aging--doc-sum" onDoubleClick={handleClick}>
          {sumAS.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        {/* {filter.payment !== "Wszystko" && (
          <label
            className="generate_aging--percent"
            onDoubleClick={handleClick}
          >
            {percent}
          </label>
        )} */}
      </section>
    </>
  );
};

export default GenerateAging;
