import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import GenerateAging from "./GenerateAging";
import "./GenerateDepartments.css";

const GenerateDepartments = ({
  dep,
  filteredData,
  setTableData,
  setShowTable,
  showTable,
  style,
}) => {
  const [arrow, setArrow] = useState({
    [dep]: false,
  });

  const counter = filteredData.reduce((acc, doc) => {
    if (doc["DZIAŁ"] === dep) {
      acc++;
    }
    return acc;
  }, 0);

  let sum = 0;
  const docSum = filteredData.map((item) => {
    if (item["DZIAŁ"] === dep) {
      sum += item[" KWOTA DO ROZLICZENIA FK "];
    }
    return sum;
  });

  const percent = "do ustalenia";

  const filteredObjects = filteredData.filter((obj) => obj["DZIAŁ"] === dep);

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  let generateItems = [];
  if (arrow[dep]) {
    const aging = [
      ...new Set(
        filteredObjects
          .filter((age) => age["DZIAŁ"] === dep)
          .map((age) => age["Przedział"])
      ),
    ];

    const ageArray = ["< 1", " 1 - 30", " 31 - 90", " 91 - 180", "> 360"];

    // Utwórz nową tablicę, zachowując kolejność z ageArray
    const sortedAging = ageArray.filter((item) => aging.includes(item));

    generateItems = sortedAging.map((age, index) => {
      return (
        <GenerateAging
          key={index}
          style={style}
          age={age}
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
        className="generate_departments"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            style === "car"
              ? "generate_departments--select generate_departments--select--car"
              : "generate_departments--select"
          }
          onClick={() =>
            setArrow({
              [dep]: !arrow[dep],
            })
          }
        >
          <IoIosArrowDown
            // className='generate_departments--arrow'
            className="generate_departments--arrow"
            style={!arrow[dep] ? null : { rotate: "180deg" }}
          />
          {dep}
        </label>
        <label
          className="generate_departments--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label
          className="generate_departments--doc-sum"
          onDoubleClick={handleClick}
        >
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label
          className="generate_departments--percent"
          onDoubleClick={handleClick}
        >
          {percent}
        </label>
      </section>
      {generateItems}
    </>
  );
};

export default GenerateDepartments;
