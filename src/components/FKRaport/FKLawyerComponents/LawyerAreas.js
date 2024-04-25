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
  styleCar,
  setButtonArea,
}) => {
  const [arrow, setArrow] = useState({
    [area]: false,
  });

  const counter = filteredData.reduce((acc, doc) => {
    if (doc.OBSZAR === area) {
      acc++;
    }
    return acc;
  }, 0);

  let sumFK = 0;
  let sumAS = 0;

  filteredData.forEach((item) => {
    if (item.OBSZAR === area) {
      if (
        typeof item.KWOTA_DO_ROZLICZENIA_FK === "number" ||
        !isNaN(item.KWOTA_DO_ROZLICZENIA_FK)
      ) {
        sumFK += Number(item.KWOTA_DO_ROZLICZENIA_FK);
      }
      if (
        typeof item.DO_ROZLICZENIA_AS === "number" ||
        !isNaN(item.DO_ROZLICZENIA_AS)
      ) {
        sumAS += Number(item.DO_ROZLICZENIA_AS);
      }
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
          <LawyerCars
            key={index}
            styleCar="car"
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
            styleCar={styleCar}
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
        className="lawyer_areas"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            styleCar === "car"
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
          {sumFK.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="lawyer_areas--doc-sum" onDoubleClick={handleClick}>
          {sumAS.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
      </section>
      {generateItems}
    </>
  );
};

export default LawyerAreas;
