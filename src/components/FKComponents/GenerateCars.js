import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import GenerateOwners from "./GenerateOwners";
import GenerateDepartments from "./GenerateDepartments";
import "./GenerateCars.css";

const GenerateCars = ({
  area,
  filteredData,
  carsIssued,
  setTableData,
  showTable,
  setShowTable,
  style,
}) => {
  const [arrow, setArrow] = useState({
    car: false,
  });

  const counter = filteredData.reduce((acc, item) => {
    if (item["CZY SAMOCHÓD WYDANY (dane As3)"] === carsIssued) {
      acc++;
    }
    return acc;
  }, 0);

  let sum = 0;
  const docSum = filteredData.map((item) => {
    if (item["CZY SAMOCHÓD WYDANY (dane As3)"] === carsIssued) {
      sum += item[" KWOTA DO ROZLICZENIA FK "];
    }
    return sum;
  });

  const percent = "do ustalenia";

  const filteredObjects = filteredData.filter(
    (obj) => obj["CZY SAMOCHÓD WYDANY (dane As3)"] === carsIssued
  );

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  let generateItems = [];
  if (arrow.car) {
    const departments = [
      ...new Set(
        filteredObjects
          .filter((dep) => dep["OBSZAR"] === area)
          .map((dep) => dep["DZIAŁ"])
          .sort()
      ),
    ];

    generateItems = departments.map((dep, index) => {
      return (
        <GenerateDepartments
          key={index}
          dep={dep}
          style="car"
          filteredData={filteredObjects}
          setTableData={setTableData}
          showTable={showTable}
          setShowTable={setShowTable}
        />
      );
    });
  }

  return (
    <>
      <section
        className="generate_cars"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          // className="generate_cars--select"
          className={
            style === "car"
              ? "generate_cars--select generate_cars--select--car"
              : "generate_cars--select"
          }
          onClick={() =>
            setArrow({
              car: !arrow.car,
            })
          }
        >
          <IoIosArrowDown
            className="generate_cars--arrow"
            style={!arrow.car ? null : { rotate: "180deg" }}
          />
          {carsIssued === "TAK" ? "AUTA WYDANE" : "AUTA NIEWYDANE"}
        </label>
        <label
          className="generate_cars--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="generate_cars--doc-sum" onDoubleClick={handleClick}>
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="generate_cars--percent" onDoubleClick={handleClick}>
          {percent}
        </label>
      </section>
      {generateItems}
    </>
  );
};

export default GenerateCars;
