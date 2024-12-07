import React, { useState, useEffect } from "react";
import FKTable from "./FKTable";
import GenerateAccount from "./FKAccountComponents/GenerateAccount";
import Button from "@mui/material/Button";
import AgingAccount from "./FKAgingComponents/AgingAccount";
import LawyerAccount from "./FKLawyerComponents/LawyerAccount";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
// import * as xlsx from "xlsx";
// import XLSX from "xlsx-js-style";
import { getExcelRaport } from "../FKRaport/utilsForFKTable/prepareFKExcelFile";
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
      let update = [];
      update = buttonArea.map((item) => {
        const updatedData = item.data.map((element) => {
          // if (element.KWOTA_WPS == 0) {
          //   element.KWOTA_WPS = "NULL";
          // }
          if (
            element.KWOTA_WPS != 0 &&
            element.KWOTA_WPS !== "NULL" &&
            element.KWOTA_WPS !== " "
          ) {
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

      // usuwam kolumnę BRAK DATY WYSTAWIENIA FV ze wszytskich arkuszy oprócz RAPORT
      update = update.map((element) => {
        if (element.name !== "Raport") {
          const updatedData = element.data.map((item) => {
            const { BRAK_DATY_WYSTAWIENIA_FV, ...rest } = item;
            return rest;
          });
          return { ...element, data: updatedData };
        }
        return element;
      });

      // zmieniam zapis daty string na zapis date
      update = update.map((element) => {
        const updatedData = element.data.map((item) => {
          const convertToDateIfPossible = (value) => {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              return date;
            }
            return value;
          };

          return {
            ...item,
            DATA_WYSTAWIENIA_FV: convertToDateIfPossible(
              item.DATA_WYSTAWIENIA_FV
            ),
            DATA_ROZLICZENIA_AS: convertToDateIfPossible(
              item.DATA_ROZLICZENIA_AS
            ),
            TERMIN_PLATNOSCI_FV: convertToDateIfPossible(
              item.TERMIN_PLATNOSCI_FV
            ),
            DATA_WYDANIA_AUTA: convertToDateIfPossible(item.DATA_WYDANIA_AUTA),
          };
        });
        return { ...element, data: updatedData };
      });
      // Dodawanie danych w pierwszych 10 wierszach
      // const customData = [
      //   { cell: "A1", value: "Nazwa Raportu" },
      //   { cell: "B1", value: "Raport Finansowy" },
      //   { cell: "A3", value: "Data" },
      //   { cell: "B3", value: "2024-07-11" },
      //   { cell: "A8", value: "Autor" },
      //   { cell: "B8", value: "Jan Kowalski" },
      //   { cell: "D4", value: "Suma przeterminowanych" },
      //   { cell: "E4", value: 100 },
      //   // Dodaj więcej danych według własnego pomysłu
      // ];

      // w tablicach odzdielam nowym wierszem dane lub dodatkowo pustym wierszem
      const cleanData = update.map((doc) => {
        const updateDoc = doc.data.map((item) => {
          const {
            OPIEKUN_OBSZARU_CENTRALI,
            OPIS_ROZRACHUNKU,
            OWNER,
            ...cleanDoc
          } = item;
          return {
            ...cleanDoc,
            OPIEKUN_OBSZARU_CENTRALI: Array.isArray(OPIEKUN_OBSZARU_CENTRALI)
              ? OPIEKUN_OBSZARU_CENTRALI.join("\n")
              : OPIEKUN_OBSZARU_CENTRALI,
            OPIS_ROZRACHUNKU: Array.isArray(OPIS_ROZRACHUNKU)
              ? OPIS_ROZRACHUNKU.join("\n\n")
              : OPIS_ROZRACHUNKU,
            OWNER: Array.isArray(OWNER) ? OWNER.join("\n") : OWNER,
          };
        });
        return {
          name: doc.name,
          data: updateDoc,
        };
      });
      // // w tablicach odzdielam nowym wierszem dane lub dodatkowo pustym wierszem
      // const cleanData = buttonArea.map((doc) => {
      //   const update = doc.data.map((item) => {
      //     const {
      //       OPIEKUN_OBSZARU_CENTRALI,
      //       OPIS_ROZRACHUNKU,
      //       OWNER,
      //       ...cleanDoc
      //     } = item;

      //     return {
      //       ...cleanDoc,
      //       OPIEKUN_OBSZARU_CENTRALI: Array.isArray(OPIEKUN_OBSZARU_CENTRALI)
      //         ? OPIEKUN_OBSZARU_CENTRALI.join("\n")
      //         : OPIEKUN_OBSZARU_CENTRALI,
      //       OPIS_ROZRACHUNKU: Array.isArray(OPIS_ROZRACHUNKU)
      //         ? OPIS_ROZRACHUNKU.join("\n\n")
      //         : OPIS_ROZRACHUNKU,
      //       OWNER: Array.isArray(OWNER) ? OWNER.join("\n") : OWNER,
      //     };
      //   });
      //   return {
      //     name: doc.name,
      //     data: update,
      //   };
      // });
      getExcelRaport(cleanData, settingsColumn.data);
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
