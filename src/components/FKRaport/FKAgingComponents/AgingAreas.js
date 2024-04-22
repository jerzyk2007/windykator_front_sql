import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import AgingCars from "./AgingCars";
import AgingComponent from "./AgingComponent";
import "./AgingAreas.css";

const AgingAreas = ({
  showTable,
  area,
  filteredData,
  setTableData,
  setShowTable,
  styleCar,
  setButtonArea,
  // filter,
}) => {
  const [arrow, setArrow] = useState({
    [area]: false,
  });

  const counter = filteredData.reduce((acc, item) => {
    if (item.OBSZAR === area) {
      acc++;
    }
    return acc;
  }, 0);

  // let sum = 0;
  // filteredData.forEach((item) => {
  //   if (item.OBSZAR === area) {
  //     sum += item.KWOTA_DO_ROZLICZENIA_FK;
  //   }
  //   return sum;
  // });

  let sumFK = 0;
  let sumAS = 0;
  filteredData.forEach((item) => {
    if (item.OBSZAR === area) {
      sumFK += item.KWOTA_DO_ROZLICZENIA_FK ? item.KWOTA_DO_ROZLICZENIA_FK : 0;
      sumAS += item.DO_ROZLICZENIA_AS ? item.DO_ROZLICZENIA_AS : 0;
    }
    return { sumFK, sumAS };
  });

  // const percent = "do ustalenia";

  const filteredObjects = filteredData.filter((obj) => obj.OBSZAR === area);

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  let generateItems = [];
  if (arrow[area]) {
    if (area === "SAMOCHODY NOWE" || area === "SAMOCHODY UŻYWANE") {
      const carsIssued = ["TAK", "NIE"];
      generateItems = carsIssued.map((car, index) => {
        return (
          <AgingCars
            key={index}
            styleCar={styleCar}
            filteredData={filteredObjects}
            area={area}
            carsIssued={car}
            setTableData={setTableData}
            showTable={showTable}
            setShowTable={setShowTable}
            // filter={filter}
          />
        );
      });
    } else {
      const aging = [
        ...new Set(
          filteredObjects
            .filter((age) => age.OBSZAR === area)
            .map((age) => age.PRZEDZIAL_WIEKOWANIE)
        ),
      ];
      generateItems = aging.map((age, index) => {
        return (
          <AgingComponent
            key={index}
            styleCar={styleCar}
            filteredData={filteredObjects}
            age={age}
            setTableData={setTableData}
            showTable={showTable}
            setShowTable={setShowTable}
            // filter={filter}
          />
        );
      });
    }
  }
  useEffect(() => {
    setButtonArea((prev) => {
      // Sprawdź, czy area już istnieje w tablicy
      const existingAreaIndex = prev.findIndex((item) => item.name === area);

      if (existingAreaIndex !== -1) {
        // Jeśli area już istnieje, zaktualizuj tylko jego dane
        const updatedArea = {
          ...prev[existingAreaIndex],
          data: filteredObjects,
        };
        const updatedAreas = [...prev];
        updatedAreas[existingAreaIndex] = updatedArea;
        return updatedAreas;
      } else {
        // Jeśli area nie istnieje, dodaj nowy obiekt do tablicy
        return [
          ...prev,
          {
            name: area,
            data: filteredObjects,
          },
        ];
      }
    });
  }, [filteredData]);

  return (
    <>
      <section
        className="aging_areas"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            styleCar === "car"
              ? "aging_areas--select aging_areas--select--car"
              : "aging_areas--select"
          }
          onClick={() =>
            setArrow({
              [area]: !arrow[area],
            })
          }
        >
          <IoIosArrowDown
            className="aging_areas--arrow"
            style={!arrow[area] ? null : { rotate: "180deg" }}
          />
          {area}
        </label>
        <label className="aging_areas--doc-counter" onDoubleClick={handleClick}>
          {counter}
        </label>
        <label className="aging_areas--doc-sum" onDoubleClick={handleClick}>
          {sumFK.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="aging_areas--doc-sum" onDoubleClick={handleClick}>
          {sumAS.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        {/* {filter.payment !== "Wszystko" && (
          <label className="aging_areas--percent" onDoubleClick={handleClick}>
            {percent}
          </label>
        )} */}
      </section>
      {generateItems}
    </>
  );
};

export default AgingAreas;
