import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import GenerateDepartments from "./GenerateDepartments";
import "./GenerateCars.css";

const GenerateCars = ({
  area,
  filteredData,
  carsIssued,
  setTableData,
  showTable,
  setShowTable,
  styleCar,
  // filter,
}) => {
  const [arrow, setArrow] = useState({
    car: false,
  });

  const counter = filteredData.reduce((acc, item) => {
    if (item.CZY_SAMOCHOD_WYDANY_AS === carsIssued) {
      acc++;
    }
    return acc;
  }, 0);

  // let sum = 0;
  // filteredData.forEach((item) => {
  //   if (item.CZY_SAMOCHOD_WYDANY_AS === carsIssued) {
  //     sum += item.KWOTA_DO_ROZLICZENIA_FK;
  //   }
  //   return sum;
  // });

  let sumFK = 0;
  let sumAS = 0;
  filteredData.forEach((item) => {
    if (item.CZY_SAMOCHOD_WYDANY_AS === carsIssued) {
      sumFK += item.KWOTA_DO_ROZLICZENIA_FK ? item.KWOTA_DO_ROZLICZENIA_FK : 0;
      sumAS += item.DO_ROZLICZENIA_AS ? item.DO_ROZLICZENIA_AS : 0;
    }
    return { sumFK, sumAS };
  });

  // const percent = "do ustalenia";

  const filteredObjects = filteredData.filter(
    (obj) => obj.CZY_SAMOCHOD_WYDANY_AS === carsIssued
  );

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  let generateItems = [];
  if (arrow.car) {
    const departments = [
      ...new Set(
        filteredObjects
          .filter((dep) => dep.OBSZAR === area)
          .map((dep) => dep.DZIAL)
          .sort()
      ),
    ];

    generateItems = departments.map((dep, index) => {
      return (
        <GenerateDepartments
          key={index}
          dep={dep}
          styleCar="car"
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
        className="generate_cars"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          // className="generate_cars--select"
          className={
            styleCar === "car"
              ? "generate_cars--select generate_cars--select--car"
              : "generate_cars--select"
          }
          onClick={() =>
            setArrow({
              car: !arrow.car,
            })
          }
        >
          <IoIosArrowDown
            className="generate_cars--arrow"
            style={!arrow.car ? null : { rotate: "180deg" }}
          />
          {carsIssued === "TAK" ? "AUTA WYDANE" : "AUTA NIEWYDANE"}
        </label>
        <label
          className="generate_cars--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="generate_cars--doc-sum" onDoubleClick={handleClick}>
          {sumFK.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="generate_cars--doc-sum" onDoubleClick={handleClick}>
          {sumAS.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        {/* {filter.payment !== "Wszystko" && (
          <label className="generate_cars--percent" onDoubleClick={handleClick}>
            {percent}
          </label>
        )} */}
      </section>
      {generateItems}
    </>
  );
};

export default GenerateCars;
