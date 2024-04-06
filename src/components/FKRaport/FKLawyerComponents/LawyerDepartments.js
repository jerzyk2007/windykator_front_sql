import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import LawyerOwners from "./LawyerOwners";
import "./LawyerDepartments.css";

const LawyerDepartments = ({
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

  const [ownerItems, setOwnerItems] = useState([]);

  const counter = filteredData.reduce((acc, doc) => {
    if (doc.DZIAL === dep) {
      acc++;
    }
    return acc;
  }, 0);

  let sum = 0;
  filteredData.forEach((item) => {
    if (item.DZIAL === dep) {
      sum += item.KWOTA_DO_ROZLICZENIA_FK;
    }
    return sum;
  });

  const percent = "do ustalenia";

  const filteredObjects = filteredData.filter((obj) => obj.DZIAL === dep);

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  const generateItems = ownerItems.map((item, index) => {
    return (
      <LawyerOwners
        key={index}
        style={style}
        own={item}
        filteredData={filteredObjects}
        setTableData={setTableData}
        showTable={showTable}
        setShowTable={setShowTable}
      />
    );
  });

  useEffect(() => {
    const ownerArray = [
      ...new Set(
        filteredObjects.filter((item) => item.DZIAL).map((item) => item.OWNER)
      ),
    ].sort();
    setOwnerItems(ownerArray);
  }, [dep]);

  return (
    <>
      <section
        className="lawyer_departments"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            style === "car"
              ? "lawyer_departments--select lawyer_departments--select--car"
              : "lawyer_departments--select"
          }
          onClick={() =>
            setArrow({
              [dep]: !arrow[dep],
            })
          }
        >
          <IoIosArrowDown
            className="lawyer_departments--arrow"
            style={!arrow[dep] ? null : { rotate: "180deg" }}
          />
          {dep}
        </label>
        <label
          className="lawyer_departments--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label
          className="lawyer_departments--doc-sum"
          onDoubleClick={handleClick}
        >
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label
          className="lawyer_departments--percent"
          onDoubleClick={handleClick}
        >
          {percent}
        </label>
      </section>
      {arrow[dep] && generateItems}
    </>
  );
};

export default LawyerDepartments;
