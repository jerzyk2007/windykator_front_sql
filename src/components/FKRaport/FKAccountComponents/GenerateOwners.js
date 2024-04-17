import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
// import GenerateDepartments from "./GenerateDepartments";
import GenerateAging from "./GenerateAging";
import "./GenerateOwners.css";

const GenerateOwners = ({
  filteredData,
  own,
  setTableData,
  showTable,
  setShowTable,
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

  let sum = 0;
  filteredData.forEach((item) => {
    if (item.OWNER === own) {
      sum += item.KWOTA_DO_ROZLICZENIA_FK;
    }
    return sum;
  });

  const filteredObjects = filteredData.filter((obj) => obj.OWNER === own);

  const percent = "do ustalenia";

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  let generateItems = [];
  if (arrow[own]) {
    const aging = [
      ...new Set(
        filteredObjects
          .filter((age) => age.OWNER === own)
          .map((age) => age.PRZEDZIAL_WIEKOWANIE)
      ),
    ];

    const ageArray = [
      "< 1",
      " 1 - 30",
      " 31 - 90",
      " 91 - 180",
      " 181 - 360",
      "> 360",
    ];

    // Utwórz nową tablicę, zachowując kolejność z ageArray
    const sortedAging = ageArray.filter((item) => aging.includes(item));

    generateItems = sortedAging.map((age, index) => {
      return (
        <GenerateAging
          key={index}
          styleCar={styleCar}
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
        className="generate_owners"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            styleCar === "car"
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
