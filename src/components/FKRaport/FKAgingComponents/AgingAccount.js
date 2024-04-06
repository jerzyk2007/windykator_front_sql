import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import AgingComponent from "./AgingComponent";
import "./AgingAccount.css";

const AgingAccount = ({
  showTable,
  filteredDataRaport,
  setTableData,
  setShowTable,
  style,
}) => {
  const [arrow, setArrow] = useState({
    aging: true,
  });

  const [ageArray, setAgeArray] = useState([]);

  const counter = filteredDataRaport.length;

  let sum = 0;
  const docSum = filteredDataRaport.map((item) => {
    sum += item.KWOTA_DO_ROZLICZENIA_FK;
  });

  const percent = "do ustalenia";

  const handleClick = () => {
    setTableData(filteredDataRaport);
    setShowTable(true);
  };

  const generateItems = ageArray.map((item, index) => {
    return (
      <AgingComponent
        key={index}
        style=""
        age={item}
        filteredData={filteredDataRaport}
        setTableData={setTableData}
        showTable={showTable}
        setShowTable={setShowTable}
      />
    );
  });

  useEffect(() => {
    const agingArray = [
      ...new Set(filteredDataRaport.map((age) => age.PRZEDZIAL_WIEKOWANIE)),
    ];
    const ageArray = [
      "< 1",
      " 1 - 30",
      " 31 - 90",
      " 91 - 180",
      " 181 - 360",
      "> 360",
    ];
    const sortedAging = ageArray.filter((item) => agingArray.includes(item));
    setAgeArray(sortedAging);
  }, [filteredDataRaport]);

  return (
    <>
      <section className="aging_account">
        <label
          className={
            style === "car"
              ? "aging_account--select aging_account--select--car"
              : "aging_account--select "
          }
          onClick={() =>
            setArrow({
              aging: !arrow.aging,
            })
          }
        >
          <IoIosArrowDown
            className={"aging_account--arrow"}
            style={!arrow.aging ? null : { rotate: "180deg" }}
          />
          Wiekowanie
        </label>
        <label
          className="aging_account--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="aging_account--doc-sum" onDoubleClick={handleClick}>
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="aging_account--percent" onDoubleClick={handleClick}>
          {percent}
        </label>
      </section>
      {arrow.aging && generateItems}
    </>
  );
};

export default AgingAccount;
