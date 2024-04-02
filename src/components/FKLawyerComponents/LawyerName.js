import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import "./LawyerName.css";

const LawyerName = ({
  filteredData,
  name,
  setTableData,
  showTable,
  setShowTable,
  style,
}) => {
  const [arrow, setArrow] = useState({
    [name]: false,
  });

  const counter = filteredData.reduce((acc, doc) => {
    if (doc["JAKA KANCELARIA"] === name) {
      acc++;
    }

    return acc;
  }, 0);

  let sum = 0;
  const docSum = filteredData.map((item) => {
    if (item["JAKA KANCELARIA"] === name) {
      sum += item[" KWOTA DO ROZLICZENIA FK "];
    }
    return sum;
  });

  const filteredObjects = filteredData.filter(
    (obj) => obj["JAKA KANCELARIA"] === name
  );

  const percent = "do ustalenia";

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  return (
    <>
      <section
        className="lawyer_name"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            style === "car"
              ? "lawyer_name--select lawyer_name--select--car"
              : "lawyer_name--select"
          }
          onClick={() =>
            setArrow({
              [name]: !arrow[name],
            })
          }
        >
          {/* <IoIosArrowDown
                        className='lawyer_name--arrow'
                        style={!arrow[own] ? null : { rotate: "180deg" }}
                    /> */}
          {name}
        </label>
        <label className="lawyer_name--doc-counter" onDoubleClick={handleClick}>
          {counter}
        </label>
        <label className="lawyer_name--doc-sum" onDoubleClick={handleClick}>
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="lawyer_name--percent" onDoubleClick={handleClick}>
          {percent}
        </label>
      </section>
    </>
  );
};

export default LawyerName;
