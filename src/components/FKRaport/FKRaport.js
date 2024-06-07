import React, { useState, useEffect } from "react";
import FKTable from "./FKTable";
import GenerateAccount from "./FKAccountComponents/GenerateAccount";
import Button from "@mui/material/Button";
import AgingAccount from "./FKAgingComponents/AgingAccount";
import LawyerAccount from "./FKLawyerComponents/LawyerAccount";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
// import * as xlsx from "xlsx";
// import XLSX from "xlsx-js-style";
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

  const handleExportExcel = async () => {
    try {
      const settingsColumn = await axiosPrivateIntercept.get(
        "/fk/get-columns-order"
      );

      let update = buttonArea.map((item) => {
        const updatedData = item.data.map((element) => {
          if (element.KWOTA_WPS == 0) {
            element.KWOTA_WPS = "NULL";
          }
          if (element.KWOTA_WPS != 0 && element.KWOTA_WPS !== "NULL") {
            element.KWOTA_WPS = Number(element.KWOTA_WPS);
            // item.KWOTA_WPS = "NULL";
          }

          if (element.DO_ROZLICZENIA_AS == 0) {
            element.DO_ROZLICZENIA_AS = "NULL";
          }

          if (
            element.DO_ROZLICZENIA_AS != 0 &&
            element.DO_ROZLICZENIA_AS !== "NULL"
          ) {
            element.DO_ROZLICZENIA_AS = Number(element.DO_ROZLICZENIA_AS);
            // item.KWOTA_WPS = "NULL";
          }

          if (element.ROZNICA == 0) {
            element.ROZNICA = "NULL";
          }
          if (element.ROZNICA != 0 && element.ROZNICA !== "NULL") {
            element.ROZNICA = Number(element.ROZNICA);
          }

          return element;
        });
        return { ...item, data: updatedData };
      });

      if (filter.payment === "Przeterminowane > 8") {
        update = update.map((element) => {
          if (element.name !== "Raport" && element.data) {
            const updatedData = element.data.filter((item) => {
              return item.PRZEDZIAL_WIEKOWANIE !== "1-7";
            });
            return { ...element, data: updatedData }; // Zwracamy zaktualizowany element
          }

          return element; // Zwracamy element bez zmian, jeśli name === "Raport" lub data jest niezdefiniowana
        });
      }

      //usuwam kolumny CZY_SAMOCHOD_WYDANY_AS, DATA_WYDANIA_AUTA z innych arkuszy niż Raport, SAMOCHODY NOWE, SAMOCHODY UŻYWANE
      update = update.map((element) => {
        if (
          element.name !== "Raport" &&
          element.name !== "SAMOCHODY NOWE" &&
          element.name !== "SAMOCHODY UŻYWANE"
        ) {
          const updatedData = element.data.map((item) => {
            const { CZY_SAMOCHOD_WYDANY_AS, DATA_WYDANIA_AUTA, ...rest } = item;
            return rest; // Zwróć obiekt bez tych dwóch kluczy
          });
          return { ...element, data: updatedData };
        }
        return element;
      });

      getExcelRaport(update, settingsColumn.data);
    } catch (err) {
      console.error(err);
    }
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
            onClick={handleExportExcel}
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

  // useEffect(() => {
  //   console.log(buttonArea);
  // }, [buttonArea]);

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
