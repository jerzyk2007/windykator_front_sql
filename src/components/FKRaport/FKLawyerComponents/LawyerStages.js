import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
// import LawyerDepartments from "./LawyerDepartments";
import LawyerOwners from "./LawyerOwners";
import "./LawyerStages.css";

const LawyerStages = ({
  stage,
  filteredData,
  setTableData,
  setShowTable,
  showTable,
  styleCar,
}) => {
  const [arrow, setArrow] = useState({
    [stage]: false,
  });

  // const [depItems, setDepItems] = useState([]);

  const counter = filteredData.reduce((acc, doc) => {
    if (doc.ETAP_SPRAWY === stage) {
      acc++;
    }
    return acc;
  }, 0);

  let sumFK = 0;
  let sumAS = 0;

  filteredData.forEach((item) => {
    if (item.ETAP_SPRAWY === stage) {
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
    (obj) => obj.ETAP_SPRAWY === stage
  );

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

  if (arrow[stage]) {
    const owner = [...new Set(filteredOwner.map((own) => own.OWNER))].sort();
    generateItems = owner.map((item, index) => {
      return (
        <LawyerOwners
          key={index}
          styleCar={styleCar}
          own={item}
          filteredData={filteredOwner}
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
        className="lawyer_stages"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            styleCar === "car"
              ? "lawyer_stages--select lawyer_stages--select--car"
              : "lawyer_stages--select"
          }
          onClick={() =>
            setArrow({
              [stage]: !arrow[stage],
            })
          }
        >
          <IoIosArrowDown
            className="lawyer_stages--arrow"
            style={!arrow[stage] ? null : { rotate: "180deg" }}
          />
          {stage}
        </label>
        <label
          className="lawyer_stages--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="lawyer_stages--doc-sum" onDoubleClick={handleClick}>
          {sumFK.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="lawyer_stages--doc-sum" onDoubleClick={handleClick}>
          {sumAS.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
      </section>
      {generateItems}
    </>
  );
};

export default LawyerStages;
