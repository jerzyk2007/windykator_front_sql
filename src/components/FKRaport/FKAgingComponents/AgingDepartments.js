import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import AgingOwners from "./AgingOwners";
import "./AgingDepartments.css";

const AgingDepartments = ({
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
    const owners = [
      ...new Set(
        filteredObjects
          .filter((own) => own["DZIAŁ"] === dep)
          .map((own) => own["OWNER"])
      ),
    ];
    generateItems = owners.map((own, index) => {
      return (
        <AgingOwners
          key={index}
          style={style}
          filteredData={filteredObjects}
          own={own}
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
        className="aging_departments"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            style === "car"
              ? "aging_departments--select aging_departments--select--car"
              : "aging_departments--select"
          }
          onClick={() =>
            setArrow({
              [dep]: !arrow[dep],
            })
          }
        >
          <IoIosArrowDown
            // className='aging_departments--arrow'
            className="aging_departments--arrow"
            style={!arrow[dep] ? null : { rotate: "180deg" }}
          />
          {dep}
        </label>
        <label
          className="aging_departments--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label
          className="aging_departments--doc-sum"
          onDoubleClick={handleClick}
        >
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label
          className="aging_departments--percent"
          onDoubleClick={handleClick}
        >
          {percent}
        </label>
      </section>
      {generateItems}
    </>
  );
};

export default AgingDepartments;
