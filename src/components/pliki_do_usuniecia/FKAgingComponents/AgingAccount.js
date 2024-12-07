import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import AgingAreas from "./AgingAreas";
import "./AgingAccount.css";

const AgingAccount = ({
  showTable,
  filteredDataRaport,
  setTableData,
  setShowTable,
  styleCar,
  setButtonArea,
}) => {
  const [arrow, setArrow] = useState({
    aging: true,
  });

  const [areasArray, setAreasArray] = useState([]);

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

  const generateItems = areasArray.map((item, index) => {
    return (
      <AgingAreas
        key={index}
        styleCar=""
        area={item}
        filteredData={filteredDataRaport}
        setTableData={setTableData}
        showTable={showTable}
        setShowTable={setShowTable}
        setButtonArea={setButtonArea}
      />
    );
  });

  useEffect(() => {
    const itemsArray = [
      ...new Set(filteredDataRaport.map((age) => age.OBSZAR)),
    ].sort();
    setAreasArray(itemsArray);
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
  }, [filteredDataRaport]);

  return (
    <>
      <section
        className="aging_account"
        style={counter === 0 || showTable ? { display: "none" } : null}
      >
        <label
          className={
            styleCar === "car"
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
          {sumFK.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
        <label className="aging_account--doc-sum" onDoubleClick={handleClick}>
          {sumAS.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })}
        </label>
      </section>
      {arrow.aging && generateItems}
    </>
  );
};

export default AgingAccount;
// import React, { useEffect, useState } from "react";
// import { IoIosArrowDown } from "react-icons/io";
// import AgingComponent from "./AgingComponent";
// import "./AgingAccount.css";

// const AgingAccount = ({
//   showTable,
//   filteredDataRaport,
//   setTableData,
//   setShowTable,
//   styleCar,
//   filter,
// }) => {
//   const [arrow, setArrow] = useState({
//     aging: true,
//   });

//   const [ageArray, setAgeArray] = useState([]);

//   const counter = filteredDataRaport.length;

//   let sum = 0;
//   filteredDataRaport.forEach((item) => {
//     sum += item.KWOTA_DO_ROZLICZENIA_FK;
//   });

//   const percent = "do ustalenia";

//   const handleClick = () => {
//     setTableData(filteredDataRaport);
//     setShowTable(true);
//   };

//   const generateItems = ageArray.map((item, index) => {
//     return (
//       <AgingComponent
//         key={index}
//         styleCar=""
//         age={item}
//         filteredData={filteredDataRaport}
//         setTableData={setTableData}
//         showTable={showTable}
//         setShowTable={setShowTable}
//         filter={filter}
//       />
//     );
//   });

//   useEffect(() => {
//     const agingArray = [
//       ...new Set(filteredDataRaport.map((age) => age.PRZEDZIAL_WIEKOWANIE)),
//     ];
//     // const ageArray = [
//     //   "< 1",
//     //   " 1 - 30",
//     //   " 31 - 90",
//     //   " 91 - 180",
//     //   " 181 - 360",
//     //   "> 360",
//     // ];
//     // const sortedAging = ageArray.filter((item) => agingArray.includes(item));
//     setAgeArray(agingArray);
//   }, [filteredDataRaport]);

//   return (
//     <>
//       <section className="aging_account">
//         <label
//           className={
//             styleCar === "car"
//               ? "aging_account--select aging_account--select--car"
//               : "aging_account--select "
//           }
//           onClick={() =>
//             setArrow({
//               aging: !arrow.aging,
//             })
//           }
//         >
//           <IoIosArrowDown
//             className={"aging_account--arrow"}
//             style={!arrow.aging ? null : { rotate: "180deg" }}
//           />
//           Wiekowanie
//         </label>
//         <label
//           className="aging_account--doc-counter"
//           onDoubleClick={handleClick}
//         >
//           {counter}
//         </label>
//         <label className="aging_account--doc-sum" onDoubleClick={handleClick}>
//           {sum.toLocaleString("pl-PL", {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//             useGrouping: true,
//           })}
//         </label>
//         {filter.payment !== "Wszystko" && (
//           <label className="aging_account--percent" onDoubleClick={handleClick}>
//             {percent}
//           </label>
//         )}
//       </section>
//       {arrow.aging && generateItems}
//     </>
//   );
// };

// export default AgingAccount;
