import React, { useState, useEffect } from "react";
import FKTable from "./FKTable";
import GenerateAccount from "./FKAccountComponents/GenerateAccount";
import Button from "@mui/material/Button";
import AgingAccount from "./FKAgingComponents/AgingAccount";
import LawyerAccount from "./FKLawyerComponents/LawyerAccount";
import "./FKRaport.css";

const FKRaport = ({
  filteredDataRaport,
  showTable,
  setTableData,
  tableData,
  setShowTable,
  filter,
}) => {
  const [buttonArea, setButtonArea] = useState([]);

  const handleButtonClick = (data) => {
    setTableData(data);
    setShowTable(true);
  };

  const buttonItems = buttonArea.map((item, index) => {
    return (
      <section className="fk_raport-panel--item" key={index}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleButtonClick(item.data)}
        >
          {item.name}
        </Button>
      </section>
    );
  });

  // useEffect(() => {
  // console.log(tableData.length);
  // }, [tableData]);

  return (
    <>
      <section className="fk_raport">
        <section className="fk_raport-panel">{buttonItems}</section>

        <section className="fk_raport-title">
          <label className="fk_raport-title--business--header">Obszar </label>
          <label className="fk_raport-title--doc-counter--header">
            Liczba dokumentów
          </label>
          <label className="fk_raport-title--doc-sum--header">
            Kwota do rozliczenia FK
          </label>
          <label className="fk_raport-title--doc-sum--header">
            Kwota do rozliczenia AS
          </label>
          {/* {filter.payment !== "Wszystko" && (
            <label className="fk_raport-title--percent--header">Procent</label>
          )} */}
        </section>

        {filter.raport === "accountRaport" && (
          <GenerateAccount
            styleCar=""
            account={filter.business}
            filteredDataRaport={filteredDataRaport}
            setTableData={setTableData}
            showTable={showTable}
            setShowTable={setShowTable}
            setButtonArea={setButtonArea}
            filter={filter}
          />
        )}

        {filter.raport === "agingRaport" && (
          <AgingAccount
            styleCar=""
            filteredDataRaport={filteredDataRaport}
            setTableData={setTableData}
            showTable={showTable}
            setShowTable={setShowTable}
            setButtonArea={setButtonArea}
            filter={filter}
          />
        )}

        {filter.raport === "lawyerRaport" && (
          <LawyerAccount
            styleCar=""
            filteredDataRaport={filteredDataRaport}
            setTableData={setTableData}
            showTable={showTable}
            setShowTable={setShowTable}
            setButtonArea={setButtonArea}
            filter={filter}
          />
        )}
      </section>
      {showTable && (
        <FKTable tableData={tableData} setShowTable={setShowTable} />
      )}
    </>
  );
};

export default FKRaport;
