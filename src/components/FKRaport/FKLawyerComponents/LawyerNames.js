import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import LawyerStages from "./LawyerStages";
import "./LawyerNames.css";

const LawyerNames = ({
  filteredData,
  name,
  setTableData,
  showTable,
  setShowTable,
  styleCar,
  // filter,
}) => {
  const [arrow, setArrow] = useState({
    [name]: false,
  });

  const counter = filteredData.reduce((acc, doc) => {
    if (doc.JAKA_KANCELARIA === name) {
      acc++;
    }

    return acc;
  }, 0);

  // let sum = 0;
  // filteredData.forEach((item) => {
  //   if (item.JAKA_KANCELARIA === name) {
  //     sum += item.KWOTA_DO_ROZLICZENIA_FK;
  //   }
  //   return sum;
  // });

  let sumFK = 0;
  let sumAS = 0;
  filteredData.forEach((item) => {
    if (item.JAKA_KANCELARIA === name) {
      sumFK += item.KWOTA_DO_ROZLICZENIA_FK ? item.KWOTA_DO_ROZLICZENIA_FK : 0;
      sumAS += item.DO_ROZLICZENIA_AS ? item.DO_ROZLICZENIA_AS : 0;
    }
    return { sumFK, sumAS };
  });
  // const percent = "do ustalenia";

  const filteredObjects = filteredData.filter(
    (obj) => obj.JAKA_KANCELARIA === name
  );

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  let generateItems = [];

  if (arrow[name]) {
    const namesArray = [
      ...new Set(
        filteredObjects
          .filter((item) => item.JAKA_KANCELARIA)
          .map((item) => item.ETAP_SPRAWY)
      ),
    ].sort();

    generateItems = namesArray.map((item, index) => {
      return (
        <LawyerStages
          key={index}
          styleCar={styleCar}
          stage={item}
          filteredData={filteredObjects}
          setTableData={setTableData}
          showTable={showTable}
          setShowTable={setShowTable}
          // filter={filter}
        />
      );
    });
  }

  return (
    <>
      <section
        className="lawyer_names"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            styleCar === "car"
              ? "lawyer_names--select lawyer_names--select--car"
              : "lawyer_names--select"
          }
          onClick={() =>
            setArrow({
              [name]: !arrow[name],
            })
          }
        >
          <IoIosArrowDown
            className="lawyer_names--arrow"
            style={!arrow[name] ? null : { rotate: "180deg" }}
          />
          {name}
        </label>
        <label
          className="lawyer_names--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="lawyer_names--doc-sum" onDoubleClick={handleClick}>
          {sumFK.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="lawyer_names--doc-sum" onDoubleClick={handleClick}>
          {sumAS.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        {/* {filter.payment !== "Wszystko" && (
          <label className="lawyer_names--percent" onDoubleClick={handleClick}>
            {percent}
          </label>
        )} */}
      </section>
      {generateItems}
    </>
  );
};

export default LawyerNames;
