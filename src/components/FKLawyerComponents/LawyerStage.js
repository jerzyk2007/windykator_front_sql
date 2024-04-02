import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import LawyerName from "./LawyerName";
import "./LawyerStage.css";

const LawyerStage = ({
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

  const [lawItems, setLawItems] = useState([]);

  const counter = filteredData.reduce((acc, doc) => {
    if (doc["ETAP SPRAWY"] === stage) {
      acc++;
    }
    return acc;
  }, 0);

  let sum = 0;
  const docSum = filteredData.map((item) => {
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

  const generateItems = lawItems.map((item, index) => {
    return (
      <LawyerName
        key={index}
        style={style}
        name={item}
        filteredData={filteredObjects}
        setTableData={setTableData}
        showTable={showTable}
        setShowTable={setShowTable}
      />
    );
  });

  useEffect(() => {
    const lawArray = [
      ...new Set(
        filteredObjects
          .filter((item) => item["ETAP SPRAWY"])
          .map((item) => item["JAKA KANCELARIA"])
      ),
    ].sort();

    setLawItems(lawArray);
  }, [stage]);

  return (
    <>
      <section
        className="lawyer_stage"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            style === "car"
              ? "lawyer_stage--select lawyer_stage--select--car"
              : "lawyer_stage--select"
          }
          onClick={() =>
            setArrow({
              [stage]: !arrow[stage],
            })
          }
        >
          <IoIosArrowDown
            className="lawyer_stage--arrow"
            style={!arrow[stage] ? null : { rotate: "180deg" }}
          />
          {stage}
        </label>
        <label
          className="lawyer_stage--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="lawyer_stage--doc-sum" onDoubleClick={handleClick}>
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="lawyer_stage--percent" onDoubleClick={handleClick}>
          {percent}
        </label>
      </section>
      {arrow[stage] && generateItems}
    </>
  );
};

export default LawyerStage;
