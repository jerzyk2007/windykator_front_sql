import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import AgingCars from "./AgingCars";
import AgingDepartments from "./AgingDepartments";
import "./AgingAreas.css";

const AgingAreas = ({
  showTable,
  area,
  filteredData,
  setTableData,
  setShowTable,
  style,
}) => {
  const [arrow, setArrow] = useState({
    [area]: false,
  });

  const counter = filteredData.reduce((acc, item) => {
    if (item.OBSZAR === area) {
      acc++;
    }
    return acc;
  }, 0);

  let sum = 0;
  const docSum = filteredData.map((item) => {
    if (item.OBSZAR === area) {
      sum += item.KWOTA_DO_ROZLICZENIA_FK;
    }
    return sum;
  });

  const percent = "do ustalenia";

  const filteredObjects = filteredData.filter((obj) => obj.OBSZAR === area);

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  let generateItems = [];
  if (arrow[area]) {
    if (area === "SAMOCHODY NOWE" || area === "SAMOCHODY UŻYWANE") {
      const carsIssued = ["TAK", "NIE"];
      generateItems = carsIssued.map((car, index) => {
        return (
          <AgingCars
            key={index}
            style={style}
            filteredData={filteredObjects}
            area={area}
            carsIssued={car}
            setTableData={setTableData}
            showTable={showTable}
            setShowTable={setShowTable}
          />
        );
      });
    } else {
      const departments = [
        ...new Set(
          filteredObjects
            .filter((dep) => dep.OBSZAR === area)
            .map((dep) => dep.DZIAL)
        ),
      ].sort();
      generateItems = departments.map((dep, index) => {
        return (
          <AgingDepartments
            key={index}
            style={style}
            filteredData={filteredObjects}
            dep={dep}
            setTableData={setTableData}
            showTable={showTable}
            setShowTable={setShowTable}
          />
        );
      });
    }
  }

  return (
    <>
      <section
        className="aging_areas"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            style === "car"
              ? "aging_areas--select aging_areas--select--car"
              : "aging_areas--select"
          }
          onClick={() =>
            setArrow({
              [area]: !arrow[area],
            })
          }
        >
          <IoIosArrowDown
            className="aging_areas--arrow"
            style={!arrow[area] ? null : { rotate: "180deg" }}
          />
          {area}
        </label>
        <label className="aging_areas--doc-counter" onDoubleClick={handleClick}>
          {counter}
        </label>
        <label className="aging_areas--doc-sum" onDoubleClick={handleClick}>
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="aging_areas--percent" onDoubleClick={handleClick}>
          {percent}
        </label>
      </section>
      {generateItems}
    </>
  );
};

export default AgingAreas;
