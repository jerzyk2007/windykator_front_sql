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
  // filter,
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
    sumFK += item.KWOTA_DO_ROZLICZENIA_FK ? item.KWOTA_DO_ROZLICZENIA_FK : 0;
    sumAS += item.DO_ROZLICZENIA_AS ? item.DO_ROZLICZENIA_AS : 0;
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
        // filter={filter}
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
  }, [account, filteredDataRaport]);

  return (
    <>
      <section className="generate_account">
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
        {/* {filter.payment !== "Wszystko" && (
          <label
            className="generate_account--percent"
            onDoubleClick={handleClick}
          >
            {percent}
          </label>
        )} */}
      </section>
      {arrow[account] && generateItems}
    </>
  );
};

export default GenerateAccount;
