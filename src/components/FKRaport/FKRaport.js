import React, { useState, useEffect } from "react";
import FKTable from "./FKTable";
import GenerateAccount from "./FKAccountComponents/GenerateAccount";
import Button from "@mui/material/Button";
import AgingAccount from "./FKAgingComponents/AgingAccount";
import LawyerAccount from "./FKLawyerComponents/LawyerAccount";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
// import * as xlsx from "xlsx";
import XLSX from "xlsx-js-style";
import { getExcelRaport } from "./utilsForFKTable/prepareFKExcelFile";
import "./FKRaport.css";

const FKRaport = ({
  filteredDataRaport,
  showTable,
  setTableData,
  tableData,
  setShowTable,
  filter,
}) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [buttonArea, setButtonArea] = useState([]);

  const handleShowTable = (data) => {
    setTableData(data);
    setShowTable(true);
  };

  const buttonItems = buttonArea.map((item, index) => {
    return (
      <section
        className={
          item.name === "Raport"
            ? "fk_raport-panel--item_all"
            : "fk_raport-panel--item"
        }
        key={index}
      >
        {item.name === "Raport" ? (
          <Button
            variant="outlined"
            color="success"
            onClick={() =>
              getExcelRaport(buttonArea, XLSX, axiosPrivateIntercept)
            }
          >
            {item.name}
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleShowTable(item.data)}
          >
            {item.name}
          </Button>
        )}
      </section>
    );
  });

  return (
    <>
      <section
        className="fk_raport"
        style={showTable ? { display: "none" } : null}
      >
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
