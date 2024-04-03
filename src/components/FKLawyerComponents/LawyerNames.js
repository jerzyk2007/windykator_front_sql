import React, { useState } from "react";
// import { IoIosArrowDown } from "react-icons/io";
import "./LawyerNames.css";

const LawyerNames = ({
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
  filteredData.forEach((item) => {
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
        className="lawyer_names"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            style === "car"
              ? "lawyer_names--select lawyer_names--select--car"
              : "lawyer_names--select"
          }
          onClick={() =>
            setArrow({
              [name]: !arrow[name],
            })
          }
        >
          {/* <IoIosArrowDown
                        className='lawyer_names--arrow'
                        style={!arrow[own] ? null : { rotate: "180deg" }}
                    /> */}
          {name}
        </label>
        <label
          className="lawyer_names--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="lawyer_names--doc-sum" onDoubleClick={handleClick}>
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="lawyer_names--percent" onDoubleClick={handleClick}>
          {percent}
        </label>
      </section>
    </>
  );
};

export default LawyerNames;
