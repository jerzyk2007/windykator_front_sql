import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import LawyerCars from "./LawyerCars";
import LawyerNames from "./LawyerNames";
import "./LawyerAreas.css";

const LawyerAreas = ({
  area,
  filteredData,
  setTableData,
  setShowTable,
  showTable,
  style,
}) => {
  const [arrow, setArrow] = useState({
    [area]: false,
  });

  const [lawNameItems, setLawNameItems] = useState([]);

  const counter = filteredData.reduce((acc, doc) => {
    if (doc.OBSZAR === area) {
      acc++;
    }
    return acc;
  }, 0);

  let sum = 0;
  filteredData.forEach((item) => {
    if (item.OBSZAR === area) {
      sum += item.KWOTA_DO_ROZLICZENIA_FK;
    }
    return sum;
  });

  const percent = "do ustalenia";

  const filteredObjects = filteredData.filter((obj) => obj.OBSZAR === area);

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  // const generateItems = lawNameItems.map((item, index) => {
  //   return (
  //     <LawyerNames
  //       key={index}
  //       style={style}
  //       name={item}
  //       filteredData={filteredObjects}
  //       setTableData={setTableData}
  //       showTable={showTable}
  //       setShowTable={setShowTable}
  //     />
  //   );
  // });

  // useEffect(() => {
  //   const lawArray = [
  //     ...new Set(
  //       filteredObjects
  //         .filter((item) => item.OBSZAR)
  //         .map((item) => item.JAKA_KANCELARIA)
  //     ),
  //   ].sort();
  //   console.group(lawArray);
  //   setLawNameItems(lawArray);
  // }, [area]);

  let generateItems = [];
  if (arrow[area]) {
    if (area === "SAMOCHODY NOWE" || area === "SAMOCHODY UŻYWANE") {
      const carsIssued = ["TAK", "NIE"];
      generateItems = carsIssued.map((car, index) => {
        return (
          <LawyerCars
            key={index}
            style="car"
            filteredData={filteredObjects}
            area={area}
            carsIssued={car}
            setTableData={setTableData}
            showTable={showTable}
            setShowTable={setShowTable}
          />
        );
      });
    } else {
      const lawArray = [
        ...new Set(
          filteredObjects
            .filter((item) => item.OBSZAR)
            .map((item) => item.JAKA_KANCELARIA)
        ),
      ].sort();
      generateItems = lawArray.map((item, index) => {
        return (
          <LawyerNames
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
    }
  }

  return (
    <>
      <section
        className="lawyer_areas"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            style === "car"
              ? "lawyer_areas--select lawyer_areas--select--car"
              : "lawyer_areas--select"
          }
          onClick={() =>
            setArrow({
              [area]: !arrow[area],
            })
          }
        >
          <IoIosArrowDown
            className="lawyer_areas--arrow"
            style={!arrow[area] ? null : { rotate: "180deg" }}
          />
          {area}
        </label>
        <label
          className="lawyer_areas--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="lawyer_areas--doc-sum" onDoubleClick={handleClick}>
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="lawyer_areas--percent" onDoubleClick={handleClick}>
          {percent}
        </label>
      </section>
      {generateItems}
    </>
  );
};

export default LawyerAreas;
