import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import GenerateCars from "./GenerateCars";
import GenerateDepartments from "./GenerateDepartments";
import "./GenerateAreas.css";

const GenerateAreas = ({
  showTable,
  area,
  filteredData,
  setTableData,
  setShowTable,
  styleCar,
  setButtonArea,
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

  let generateItems = [];
  if (arrow[area]) {
    if (area === "SAMOCHODY NOWE" || area === "SAMOCHODY UŻYWANE") {
      const carsIssued = ["TAK", "NIE"];
      generateItems = carsIssued.map((car, index) => {
        return (
          <GenerateCars
            key={index}
            styleCar={styleCar}
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
            styleCar={styleCar}
            filteredData={filteredObjects}
            setTableData={setTableData}
            showTable={showTable}
            setShowTable={setShowTable}
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
  }, []);

  return (
    <>
      <section
        className="generate_areas"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            styleCar === "car"
              ? "generate_areas--select generate_areas--select--car"
              : "generate_areas--select"
          }
          onClick={() =>
            setArrow({
              [area]: !arrow[area],
            })
          }
        >
          <IoIosArrowDown
            className="generate_areas--arrow"
            style={!arrow[area] ? null : { rotate: "180deg" }}
          />
          {area}
        </label>
        <label
          className="generate_areas--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="generate_areas--doc-sum" onDoubleClick={handleClick}>
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="generate_areas--percent" onDoubleClick={handleClick}>
          {percent}
        </label>
      </section>
      {generateItems}
    </>
  );
};

export default GenerateAreas;
