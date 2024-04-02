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
  style,
  setButtonArea,
}) => {
  const [arrow, setArrow] = useState({
    [account]: true,
  });
  const [businessAccount, setBusinessAccount] = useState({
    accountArea: [],
  });

  const counter = filteredDataRaport.length;

  let sum = 0;
  filteredDataRaport.forEach((item) => {
    sum += item[" KWOTA DO ROZLICZENIA FK "];
  });
  //   const docSum = filteredDataRaport.map((item) => {
  //     sum += item[" KWOTA DO ROZLICZENIA FK "];
  //   });

  const percent = "do ustalenia";

  const handleClick = () => {
    setTableData(filteredDataRaport);
    setShowTable(true);
  };

  const generateItems = businessAccount.accountArea.map((area, index) => {
    return (
      <GenerateAreas
        key={index}
        style={style}
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
          .filter((item) => item["RODZAJ KONTA"])
          .map((item) => item["OBSZAR"])
      ),
    ].sort();
    setBusinessAccount({
      accountArea: accountArray,
    });
  }, [account]);

  return (
    <>
      <section className="generate_account">
        <label
          className={
            style === "car"
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
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label
          className="generate_account--percent"
          onDoubleClick={handleClick}
        >
          {percent}
        </label>
      </section>
      {arrow[account] && generateItems}
    </>
  );
};

export default GenerateAccount;
