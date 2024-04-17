import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import AgingAreas from "./AgingAreas";
import "./AgingComponent.css";

const AgingComponent = ({
  age,
  filteredData,
  setTableData,
  setShowTable,
  showTable,
  styleCar,
}) => {
  const [arrow, setArrow] = useState({
    [age]: false,
  });

  const [areaItems, setAreaItems] = useState([]);

  const counter = filteredData.reduce((acc, doc) => {
    if (doc.PRZEDZIAL_WIEKOWANIE === age) {
      acc++;
    }
    return acc;
  }, 0);

  let sum = 0;
  filteredData.forEach((item) => {
    if (item.PRZEDZIAL_WIEKOWANIE === age) {
      sum += item.KWOTA_DO_ROZLICZENIA_FK;
    }
    return sum;
  });

  const percent = "do ustalenia";

  const filteredObjects = filteredData.filter(
    (obj) => obj.PRZEDZIAL_WIEKOWANIE === age
  );

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  const generateItems = areaItems.map((item, index) => {
    return (
      <AgingAreas
        key={index}
        styleCar={styleCar}
        area={item}
        filteredData={filteredObjects}
        setTableData={setTableData}
        showTable={showTable}
        setShowTable={setShowTable}
      />
    );
  });

  useEffect(() => {
    const areaArray = [
      ...new Set(
        filteredObjects
          .filter((item) => item.PRZEDZIAL_WIEKOWANIE)
          .map((item) => item.OBSZAR)
      ),
    ].sort();

    setAreaItems(areaArray);
  }, [age, filteredObjects]);

  return (
    <>
      <section className="aging_component">
        <label
          className={
            styleCar === "car"
              ? "aging_component--select aging_component--select--car"
              : "aging_component--select"
          }
          onClick={() =>
            setArrow({
              [age]: !arrow[age],
            })
          }
        >
          <IoIosArrowDown
            className="aging_component--arrow"
            style={!arrow[age] ? null : { rotate: "180deg" }}
          />
          {age}
        </label>
        <label
          className="aging_component--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="aging_component--doc-sum" onDoubleClick={handleClick}>
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="aging_component--percent" onDoubleClick={handleClick}>
          {percent}
        </label>
      </section>
      {arrow[age] && generateItems}
    </>
  );
};

export default AgingComponent;
