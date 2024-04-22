import React, { useState } from "react";
import "./GenerateAging.css";

const GenerateAging = ({
  age,
  filteredData,
  setTableData,
  setShowTable,
  styleCar,
  // filter,
}) => {
  const [arrow, setArrow] = useState({
    [age]: false,
  });

  const counter = filteredData.reduce((acc, doc) => {
    if (doc.PRZEDZIAL_WIEKOWANIE === age) {
      acc++;
    }
    return acc;
  }, 0);

  // let sum = 0;
  // filteredData.forEach((item) => {
  //   if (item.PRZEDZIAL_WIEKOWANIE === age) {
  //     sum += item.KWOTA_DO_ROZLICZENIA_FK;
  //   }
  //   return sum;
  // });

  let sumFK = 0;
  let sumAS = 0;
  filteredData.forEach((item) => {
    if (item.PRZEDZIAL_WIEKOWANIE === age) {
      sumFK += item.KWOTA_DO_ROZLICZENIA_FK ? item.KWOTA_DO_ROZLICZENIA_FK : 0;
      sumAS += item.DO_ROZLICZENIA_AS ? item.DO_ROZLICZENIA_AS : 0;
    }
    return { sumFK, sumAS };
  });

  // const percent = "do ustalenia";

  const filteredObjects = filteredData.filter(
    (obj) => obj.PRZEDZIAL_WIEKOWANIE === age
  );

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  return (
    <>
      <section className="generate_aging">
        <label
          // className='generate_aging--select'
          className={
            styleCar === "car"
              ? "generate_aging--select generate_aging--select--car"
              : "generate_aging--select"
          }
          onClick={() =>
            setArrow({
              [age]: !arrow[age],
            })
          }
        >
          {/* <IoIosArrowDown
                        className='generate_aging--arrow'
                        style={!arrow[age] ? null : { rotate: "180deg" }}
                    /> */}
          {age}
        </label>
        <label
          className="generate_aging--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="generate_aging--doc-sum" onDoubleClick={handleClick}>
          {sumFK.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="generate_aging--doc-sum" onDoubleClick={handleClick}>
          {sumAS.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        {/* {filter.payment !== "Wszystko" && (
          <label
            className="generate_aging--percent"
            onDoubleClick={handleClick}
          >
            {percent}
          </label>
        )} */}
      </section>
    </>
  );
};

export default GenerateAging;
