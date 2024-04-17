import React, { useState } from "react";
// import { IoIosArrowDown } from "react-icons/io";
// import LawyerNames from "./LawyerNames";
import "./LawyerOwners.css";

const LawyerOwners = ({
  own,
  filteredData,
  setTableData,
  setShowTable,
  showTable,
  styleCar,
}) => {
  const [arrow, setArrow] = useState({
    [own]: false,
  });

  // const [lawNameItems, setLawNameItems] = useState([]);

  const counter = filteredData.reduce((acc, doc) => {
    if (doc.OWNER === own) {
      acc++;
    }
    return acc;
  }, 0);

  let sum = 0;
  filteredData.forEach((item) => {
    if (item.OWNER === own) {
      sum += item.KWOTA_DO_ROZLICZENIA_FK;
    }
    return sum;
  });

  const percent = "do ustalenia";

  const filteredObjects = filteredData.filter((obj) => obj.OWNER === own);

  const handleClick = () => {
    setTableData(filteredObjects);
    setShowTable(true);
  };

  // const generateItems = lawNameItems.map((item, index) => {
  //   return (
  //     <LawyerNames
  //       key={index}
  //       styleCar={styleCar}
  //       name={item}
  //       filteredData={filteredObjects}
  //       setTableData={setTableData}
  //       showTable={showTable}
  //       setShowTable={setShowTable}
  //     />
  //   );
  // });

  // useEffect(() => {
  //   const lawNameArray = [
  //     ...new Set(
  //       filteredObjects
  //         .filter((item) => item.OBSZAR)
  //         .map((item) => item.JAKA_KANCELARIA)
  //     ),
  //   ].sort();
  //   setLawNameItems(lawNameArray);
  // }, [own]);

  return (
    <>
      <section
        className="lawyer_owners"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            styleCar === "car"
              ? "lawyer_owners--select lawyer_owners--select--car"
              : "lawyer_owners--select"
          }
          onClick={() =>
            setArrow({
              [own]: !arrow[own],
            })
          }
        >
          {/* <IoIosArrowDown
            className="lawyer_owners--arrow"
            style={!arrow[own] ? null : { rotate: "180deg" }}
          /> */}
          {own}
        </label>
        <label
          className="lawyer_owners--doc-counter"
          onDoubleClick={handleClick}
        >
          {counter}
        </label>
        <label className="lawyer_owners--doc-sum" onDoubleClick={handleClick}>
          {sum.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="lawyer_owners--percent" onDoubleClick={handleClick}>
          {percent}
        </label>
      </section>
      {/* {arrow[own] && generateItems} */}
    </>
  );
};

export default LawyerOwners;
