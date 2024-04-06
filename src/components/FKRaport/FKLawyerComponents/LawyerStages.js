import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import LawyerDepartments from "./LawyerDepartments";
import "./LawyerStages.css";

const LawyerStages = ({
  stage,
  filteredData,
  setTableData,
  setShowTable,
  showTable,
  style,
}) => {
  const [arrow, setArrow] = useState({
    [stage]: false,
  });

  const [depItems, setDepItems] = useState([]);

  const counter = filteredData.reduce((acc, doc) => {
    if (doc["ETAP SPRAWY"] === stage) {
      acc++;
    }
    return acc;
  }, 0);

  let sum = 0;
  filteredData.forEach((item) => {
    if (item["ETAP SPRAWY"] === stage) {
      sum += item[" KWOTA DO ROZLICZENIA FK "];
    }
    return sum;
  });

  const percent = "do ustalenia";

  const filteredObjects = filteredData.filter(
    (obj) => obj["ETAP SPRAWY"] === stage
  );

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  const generateItems = depItems.map((item, index) => {
    return (
      <LawyerDepartments
        key={index}
        style={style}
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
          .filter((item) => item["ETAP SPRAWY"])
          .map((item) => item["DZIAŁ"])
      ),
    ].sort();
    setDepItems(depArray);
  }, [stage]);

  return (
    <>
      <section
        className="lawyer_stages"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            style === "car"
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
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="lawyer_stages--percent" onDoubleClick={handleClick}>
          {percent}
        </label>
      </section>
      {arrow[stage] && generateItems}
    </>
  );
};

export default LawyerStages;
