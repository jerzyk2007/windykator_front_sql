import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import GenerateDepartments from "./GenerateDepartments";
import "./GenerateOwners.css";

const GenerateOwners = ({
  filteredData,
  own,
  setTableData,
  showTable,
  setShowTable,
  style,
}) => {
  const [arrow, setArrow] = useState({
    [own]: false,
  });

  const counter = filteredData.reduce((acc, doc) => {
    if (doc["OWNER"] === own) {
      acc++;
    }

    return acc;
  }, 0);

  let sum = 0;
  const docSum = filteredData.map((item) => {
    if (item["OWNER"] === own) {
      sum += item[" KWOTA DO ROZLICZENIA FK "];
    }
    return sum;
  });

  const filteredObjects = filteredData.filter((obj) => obj["OWNER"] === own);

  const percent = "do ustalenia";

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  let generateItems = [];
  if (arrow[own]) {
    const departments = [
      ...new Set(
        filteredObjects
          .filter((dep) => dep["OWNER"] === own)
          .map((dep) => dep["DZIAŁ"])
      ),
    ];
    generateItems = departments.map((dep, index) => {
      return (
        <GenerateDepartments
          key={index}
          dep={dep}
          style={style}
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
        className="generate_owners"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            style === "car"
              ? "generate_owners--select generate_owners--select--car"
              : "generate_owners--select"
          }
          onClick={() =>
            setArrow({
              [own]: !arrow[own],
            })
          }
        >
          <IoIosArrowDown
            className="generate_owners--arrow"
            style={!arrow[own] ? null : { rotate: "180deg" }}
          />
          {own}
        </label>
        <label
          className="generate_owners--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="generate_owners--doc-sum" onDoubleClick={handleClick}>
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="generate_owners--percent" onDoubleClick={handleClick}>
          {percent}
        </label>
      </section>
      {generateItems}
    </>
  );
};

export default GenerateOwners;
