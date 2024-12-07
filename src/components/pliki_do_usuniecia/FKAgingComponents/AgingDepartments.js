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
  styleCar,
}) => {
  const [arrow, setArrow] = useState({
    [dep]: false,
  });
  const counter = filteredData.reduce((acc, doc) => {
    if (doc.DZIAL === dep) {
      acc++;
    }
    return acc;
  }, 0);

  let sumFK = 0;
  let sumAS = 0;

  filteredData.forEach((item) => {
    if (item.DZIAL === dep) {
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

  const filteredObjects = filteredData.filter((obj) => obj.DZIAL === dep);

  const filteredOwner = filteredObjects.map((item) => {
    if (item.OWNER) {
      let combinedText;
      if (Array.isArray(item.OWNER)) {
        combinedText =
          item.OWNER.length > 1 ? item.OWNER.join(" - ") : item.OWNER[0];
      } else {
        combinedText = item.OWNER; // Jeśli item.OWNER jest pojedynczym stringiem
      }
      return {
        ...item,
        OWNER: combinedText,
      };
    }
    return item;
  });

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  let generateItems = [];
  if (arrow[dep]) {
    const owner = [...new Set(filteredOwner.map((own) => own.OWNER))].sort();
    generateItems = owner.map((own, index) => {
      return (
        <AgingOwners
          key={index}
          styleCar={styleCar}
          filteredData={filteredOwner}
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
            styleCar === "car"
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
          {sumFK.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label
          className="aging_departments--doc-sum"
          onDoubleClick={handleClick}
        >
          {sumAS.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        {/* {filter.payment !== "Wszystko" && (
          <label
            className="aging_departments--percent"
            onDoubleClick={handleClick}
          >
            {percent}
          </label>
        )} */}
      </section>
      {generateItems}
    </>
  );
};

export default AgingDepartments;
