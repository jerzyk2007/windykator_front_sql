import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import AgingDepartments from "./AgingDepartments";
import "./AgingComponent.css";

const AgingComponent = ({
  age,
  filteredData,
  setTableData,
  setShowTable,
  showTable,
  styleCar,
}) => {
  const [arrow, setArrow] = useState({
    [age]: false,
  });

  const [depItems, setDepItems] = useState([]);

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

  const generateItems = depItems.map((item, index) => {
    return (
      <AgingDepartments
        key={index}
        styleCar={styleCar}
        dep={item}
        filteredData={filteredObjects}
        setTableData={setTableData}
        showTable={showTable}
        setShowTable={setShowTable}
      />
    );
  });

  useEffect(() => {
    const depArray = [
      ...new Set(
        filteredObjects
          .filter((item) => item.PRZEDZIAL_WIEKOWANIE)
          .map((item) => item.DZIAL)
      ),
    ].sort();

    setDepItems(depArray);
  }, [age]);

  return (
    <>
      <section
        className="aging_component"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            styleCar === "car"
              ? "aging_component--select aging_component--select--car"
              : "aging_component--select"
          }
          onClick={() =>
            setArrow({
              [age]: !arrow[age],
            })
          }
        >
          <IoIosArrowDown
            className="aging_component--arrow"
            style={!arrow[age] ? null : { rotate: "180deg" }}
          />
          {age}
        </label>
        <label
          className="aging_component--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="aging_component--doc-sum" onDoubleClick={handleClick}>
          {sumFK.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="aging_component--doc-sum" onDoubleClick={handleClick}>
          {sumAS.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
      </section>
      {arrow[age] && generateItems}
    </>
  );
};

export default AgingComponent;
