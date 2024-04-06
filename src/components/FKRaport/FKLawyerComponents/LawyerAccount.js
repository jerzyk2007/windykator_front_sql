import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import LawyerStages from "./LawyerStages";
import LawyerAreas from "./LawyerAreas";
import "./LawyerAccount.css";

const LawyerAccount = ({
  showTable,
  filteredDataRaport,
  setTableData,
  setShowTable,
  style,
}) => {
  const [arrow, setArrow] = useState({
    lawyer: true,
  });

  const [areasArray, setAreasArray] = useState([]);

  const counter = filteredDataRaport.length;

  let sum = 0;
  filteredDataRaport.forEach((item) => {
    sum += item.KWOTA_DO_ROZLICZENIA_FK;
  });

  const percent = "do ustalenia";

  const handleClick = () => {
    setTableData(filteredDataRaport);
    setShowTable(true);
  };

  const generateItems = areasArray.map((item, index) => {
    return (
      <LawyerAreas
        key={index}
        style=""
        area={item}
        filteredData={filteredDataRaport}
        setTableData={setTableData}
        showTable={showTable}
        setShowTable={setShowTable}
      />
    );
  });
  // const generateItems = lawyerArray.map((item, index) => {
  //   return (
  //     <LawyerStages
  //       key={index}
  //       style=""
  //       stage={item}
  //       filteredData={filteredDataRaport}
  //       setTableData={setTableData}
  //       showTable={showTable}
  //       setShowTable={setShowTable}
  //     />
  //   );
  // });

  useEffect(() => {
    const areasArray = [
      ...new Set(filteredDataRaport.map((item) => item.OBSZAR)),
    ].sort();
    setAreasArray(areasArray);
  }, [filteredDataRaport]);
  // useEffect(() => {
  //   const lawyerArray = [
  //     ...new Set(filteredDataRaport.map((age) => age.ETAP_SPRAWY)),
  //   ];
  //   const lawArray = [
  //     "Blokada na 10 dni oddziału",
  //     "POLUBOWNA",
  //     "POZEW W SĄDZIE",
  //     "UMORZENIE EPU",
  //     "WYGRANA",
  //   ];
  //   const sortedAging = lawArray.filter((item) => lawyerArray.includes(item));

  //   setLawyerArray(sortedAging);
  // }, [filteredDataRaport]);

  return (
    <>
      <section className="lawyer_account">
        <label
          className={
            style === "car"
              ? "lawyer_account--select lawyer_account--select--car"
              : "lawyer_account--select "
          }
          onClick={() =>
            setArrow({
              lawyer: !arrow.lawyer,
            })
          }
        >
          <IoIosArrowDown
            className={"lawyer_account--arrow"}
            style={!arrow.lawyer ? null : { rotate: "180deg" }}
          />
          Kancelarie
        </label>
        <label
          className="lawyer_account--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="lawyer_account--doc-sum" onDoubleClick={handleClick}>
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="lawyer_account--percent" onDoubleClick={handleClick}>
          {percent}
        </label>
      </section>
      {arrow.lawyer && generateItems}
    </>
  );
};

export default LawyerAccount;
