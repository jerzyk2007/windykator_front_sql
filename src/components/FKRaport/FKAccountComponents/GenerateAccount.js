import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import GenerateAreas from "./GenerateAreas";
import "./GenerateAccount.css";

const GenerateAccount = ({
  account,
  showTable,
  filteredDataRaport,
  setTableData,
  setShowTable,
  styleCar,
  setButtonArea,
}) => {
  const [arrow, setArrow] = useState({
    [account]: true,
  });
  const [businessAccount, setBusinessAccount] = useState({
    accountArea: [],
  });
  const counter = filteredDataRaport.length;

  let sumFK = 0;
  let sumAS = 0;

  filteredDataRaport.forEach((item) => {
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
    return { sumFK, sumAS };
  });

  // const percent = "do ustalenia";

  const handleClick = () => {
    setTableData(filteredDataRaport);
    setShowTable(true);
  };

  const generateItems = businessAccount.accountArea.map((area, index) => {
    return (
      <GenerateAreas
        key={index}
        styleCar={styleCar}
        area={area}
        filteredData={filteredDataRaport}
        setTableData={setTableData}
        showTable={showTable}
        setShowTable={setShowTable}
        setButtonArea={setButtonArea}
      />
    );
  });

  useEffect(() => {
    const accountArray = [
      ...new Set(
        filteredDataRaport
          .filter((item) => item.RODZAJ_KONTA)
          .map((item) => item.OBSZAR)
      ),
    ].sort();
    setBusinessAccount({
      accountArea: accountArray,
    });

    setButtonArea((prev) => {
      // Sprawdź, czy area już istnieje w tablicy
      const existingAreaIndex = prev.findIndex(
        (item) => item.name === "Raport"
      );

      if (existingAreaIndex !== -1) {
        // Jeśli area już istnieje, zaktualizuj tylko jego dane
        const updatedArea = {
          ...prev[existingAreaIndex],
          data: filteredDataRaport,
        };
        const updatedAreas = [...prev];
        updatedAreas[existingAreaIndex] = updatedArea;
        return updatedAreas;
      } else {
        // Jeśli area nie istnieje, dodaj nowy obiekt do tablicy
        return [
          ...prev,
          {
            name: "Raport",
            data: filteredDataRaport,
          },
        ];
      }
    });
  }, [account, filteredDataRaport]);

  return (
    <>
      <section
        className="generate_account"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            styleCar === "car"
              ? "generate_account--select generate_account--select--car"
              : "generate_account--select "
          }
          onClick={() =>
            setArrow({
              [account]: !arrow[account],
            })
          }
        >
          <IoIosArrowDown
            className={"generate_account--arrow"}
            style={!arrow[account] ? null : { rotate: "180deg" }}
          />
          {account === "201203" ? "201 + 203" : account}
        </label>
        <label
          className="generate_account--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label
          className="generate_account--doc-sum"
          onDoubleClick={handleClick}
        >
          {sumFK.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label
          className="generate_account--doc-sum"
          onDoubleClick={handleClick}
        >
          {sumAS.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
      </section>
      {arrow[account] && generateItems}
    </>
  );
};

export default GenerateAccount;
