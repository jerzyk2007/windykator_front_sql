import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import { formatNip } from "../utilsForTable/tableFunctions";

const authLogin = [
  "marta.bednarek@krotoski.com",
  "amanda.nawrocka@krotoski.com",
  "jolanta.maslowska@krotoski.com",
  "anna.wylupek@krotoski.com",
  "jerzy.komorowski@krotoski.com",
  "jerzy.komorowski2@krotoski.com",
  "marcin.furmanek@krotoski.com",
];

const BasicDataInsider = ({
  rowData,
  setRowData,
  login,
  handleAddNote,
  context,
}) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  // zmienna dla zmiany DZIALu przez Blacharnie
  const [changeDepartment, setChangeDepartment] = useState({
    oldDep: "",
    newDep: "",
    optionsDep: [],
  });

  useEffect(() => {
    setChangeDepartment((prev) => {
      return {
        ...prev,
        oldDep: rowData.DZIAL,
      };
    });
    const fetchData = async () => {
      try {
        const result = await axiosPrivateIntercept.get(
          `/documents/get-available-deps/${rowData.FIRMA}`
        );
        setChangeDepartment((prev) => ({
          ...prev,
          optionsDep:
            Array.isArray(result.data) && result.data.length > 0
              ? result.data
              : prev.optionsDep, // jeśli pusta, zostawiamy poprzednią wartość
        }));
      } catch (error) {
        console.error(error);
      }
    };
    if (rowData.AREA === "BLACHARNIA") {
      fetchData();
    }
  }, [rowData.DZIAL]);

  return (
    <section className="ertp-data-section">
      <section className="ertp-data-row">
        <span className="ertp-data-row__label">Faktura:</span>
        <span className="ertp-data-row__value">{rowData.NUMER_FV}</span>
      </section>
      <section className="ertp-data-row">
        <span className="ertp-data-row__label">Data wystawienia:</span>
        <span className="ertp-data-row__value">{rowData.DATA_FV}</span>
      </section>
      <section className="ertp-data-row">
        <span className="ertp-data-row__label">Termin płatności:</span>
        <span className="ertp-data-row__value">{rowData.TERMIN}</span>
      </section>
      <section className="ertp-data-row">
        <span className="ertp-data-row__label">Po terminie:</span>
        <span
          className="ertp-data-row__value"
          style={
            rowData.ILE_DNI_PO_TERMINIE > 0
              ? { backgroundColor: "rgba(255, 130, 130, 1)" }
              : null
          }
        >
          {rowData.ILE_DNI_PO_TERMINIE}
        </span>
      </section>

      {rowData?.AREA === "BLACHARNIA" && authLogin.includes(login) && (
        <section className="ertp-data-row">
          <span className="ertp-data-row__label" style={{ border: "none" }}>
            Przypisz inny dział:
          </span>
          <select
            className="ertp-input-select"
            style={{ backgroundColor: "#f5ffe3" }}
            value={changeDepartment.newDep || changeDepartment.oldDep}
            onChange={(e) => {
              const newDep = e.target.value;
              setRowData((prev) => ({ ...prev, DZIAL: newDep }));
              handleAddNote(
                `Zmiana działu: ${changeDepartment.oldDep} na ${newDep}`,
                "log",
                context
              );
            }}
          >
            {changeDepartment.oldDep && (
              <option value={changeDepartment.oldDep} disabled>
                {changeDepartment.oldDep}
              </option>
            )}
            {changeDepartment.optionsDep
              .filter((dep) => dep !== changeDepartment.oldDep)
              .map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
          </select>
        </section>
      )}

      <section className="ertp-data-row">
        <span className="ertp-data-row__label">Brutto:</span>
        <span className="ertp-data-row__value">
          {rowData?.BRUTTO
            ? Number(rowData.BRUTTO).toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true, // Wymusza separatory tysięcy
              })
            : "0,00"}
        </span>
      </section>

      <section className="ertp-data-row">
        <span className="ertp-data-row__label">Netto:</span>
        <span className="ertp-data-row__value">
          {rowData?.NETTO
            ? Number(rowData.NETTO).toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true, // Wymusza separatory tysięcy
              })
            : "0,00"}
        </span>
      </section>

      {rowData.AREA === "BLACHARNIA" && (
        <>
          <section className="ertp-data-row">
            <span className="ertp-data-row__label">Netto + 50% VAT:</span>
            <span className="ertp-data-row__value">
              {rowData?.NETTO && rowData?.BRUTTO
                ? (
                    (Number(rowData.NETTO) + Number(rowData.BRUTTO)) /
                    2
                  ).toLocaleString("pl-PL", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true, // Wymusza odstępy tysięcy (np. 1 250,00)
                  })
                : "0,00"}
            </span>
          </section>

          {/* <section className="ertp-data-row">
            <span className="ertp-data-row__label">100% VAT:</span>
            <span
              className="ertp-data-row__value"
              style={{
                backgroundColor:
                  Math.abs(
                    rowData.BRUTTO - rowData.NETTO - rowData.DO_ROZLICZENIA
                  ) <= 1
                    ? "rgba(240, 69, 69, .7)"
                    : null,
              }}
            >
              {(rowData.BRUTTO - rowData.NETTO).toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </section> */}
          <section className="ertp-data-row">
            <span className="ertp-data-row__label">100% VAT:</span>
            <span
              className="ertp-data-row__value"
              style={{
                backgroundColor:
                  Math.abs(
                    Number(rowData.BRUTTO) -
                      Number(rowData.NETTO) -
                      Number(rowData.DO_ROZLICZENIA)
                  ) <= 1
                    ? "#fee2e2" // Pastelowy jasny czerwony
                    : "white",
                color:
                  Math.abs(
                    Number(rowData.BRUTTO) -
                      Number(rowData.NETTO) -
                      Number(rowData.DO_ROZLICZENIA)
                  ) <= 1
                    ? "#991b1b" // Ciemniejszy czerwony tekst dla lepszego kontrastu
                    : "#000000ff",
                fontWeight:
                  Math.abs(
                    Number(rowData.BRUTTO) -
                      Number(rowData.NETTO) -
                      Number(rowData.DO_ROZLICZENIA)
                  ) <= 1
                    ? "600"
                    : "normal",
              }}
            >
              {(Number(rowData.BRUTTO) - Number(rowData.NETTO)).toLocaleString(
                "pl-PL",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true, // Włącza odstępy tysięcy
                }
              )}
            </span>
          </section>
          {/* <section className="ertp-data-row">
            <span className="ertp-data-row__label">50% VAT:</span>
            <span
              className="ertp-data-row__value"
              style={{
                backgroundColor:
                  Math.abs(
                    (rowData.BRUTTO - rowData.NETTO) / 2 -
                      rowData.DO_ROZLICZENIA
                  ) <= 1
                    ? "rgba(240, 69, 69, .7)"
                    : null,
              }}
            >
              {((rowData.BRUTTO - rowData.NETTO) / 2).toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </section> */}
          <section className="ertp-data-row">
            <span className="ertp-data-row__label">50% VAT:</span>
            <span
              className="ertp-data-row__value"
              style={{
                backgroundColor:
                  Math.abs(
                    (Number(rowData.BRUTTO) - Number(rowData.NETTO)) / 2 -
                      Number(rowData.DO_ROZLICZENIA)
                  ) <= 1
                    ? "#fee2e2" // Pastelowy jasny czerwony
                    : "white",
                color:
                  Math.abs(
                    (Number(rowData.BRUTTO) - Number(rowData.NETTO)) / 2 -
                      Number(rowData.DO_ROZLICZENIA)
                  ) <= 1
                    ? "#991b1b"
                    : "#000000ff",
                fontWeight:
                  Math.abs(
                    (Number(rowData.BRUTTO) - Number(rowData.NETTO)) / 2 -
                      Number(rowData.DO_ROZLICZENIA)
                  ) <= 1
                    ? "600"
                    : "normal",
              }}
            >
              {(
                (Number(rowData.BRUTTO) - Number(rowData.NETTO)) /
                2
              ).toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true, // Włącza odstępy tysięcy
              })}
            </span>
          </section>
        </>
      )}

      {/* <section className="ertp-data-row">
        <span className="ertp-data-row__label">Do rozliczenia AS:</span>
        <span
          className="ertp-data-row__value"
          style={{ backgroundColor: "rgba(248, 255, 152, .6)" }}
        >
          {rowData.DO_ROZLICZENIA
            ? rowData.DO_ROZLICZENIA.toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "0,00"}
        </span>
      </section> */}

      <section className="ertp-data-row">
        <span className="ertp-data-row__label">Do rozliczenia AS:</span>
        <span
          className="ertp-data-row__value"
          style={{
            backgroundColor: "#fef9c3", // Pastelowy, "spokojny" żółty (bezpieczniejszy dla wzroku)
            fontWeight: "500", // Lekkie pogrubienie dla ważnej kwoty
            color: "#1e293b", // Ciemny grafitowy tekst dla wysokiego kontrastu
            // border: "1px solid #eab308", // Delikatnie ciemniejsza linia, żeby podkreślić to pole
          }}
        >
          {rowData?.DO_ROZLICZENIA
            ? Number(rowData.DO_ROZLICZENIA).toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true, // Włącza odstępy tysięcy (np. 1 250,00)
              })
            : "0,00"}
        </span>
      </section>
      {/* Poniżej przykład dla Kontrahenta ze scrollem */}

      {rowData.AREA === "SERWIS" ||
        (rowData.FIRMA === "RAC" && (
          <section className="ertp-data-row">
            <span className="ertp-data-row__label">Typ płatności:</span>
            <span
              className="ertp-data-row__value"
              style={
                rowData.TYP_PLATNOSCI === "Gotówka"
                  ? { backgroundColor: "rgba(240, 69, 69, .7)" }
                  : null
              }
            >
              {rowData.TYP_PLATNOSCI}
            </span>
          </section>
        ))}

      {rowData.AREA === "BLACHARNIA" && (
        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Nr szkody:</span>
          <span className="ertp-data-row__value">{rowData.NR_SZKODY}</span>
        </section>
      )}
      {rowData.AREA !== "BLACHARNIA" && rowData.FIRMA !== "RAC" && (
        <section className="ertp-data-row">
          <span className="ertp-data-row__label">Nr autoryzacji:</span>
          <span className="ertp-data-row__value">{rowData.NR_AUTORYZACJI}</span>
        </section>
      )}

      {rowData.AREA !== "CZĘŚCI" &&
        rowData.AREA !== "SAMOCHODY NOWE" &&
        rowData.FIRMA !== "RAC" && (
          <section className="ertp-data-row">
            <span className="ertp-data-row__label">Nr rejestracyjny:</span>
            <span className="ertp-data-row__value">
              {rowData.NR_REJESTRACYJNY}
            </span>
          </section>
        )}
      {rowData.AREA !== "CZĘŚCI" &&
        rowData.AREA !== "BLACHARNIA" &&
        rowData.FIRMA !== "RAC" && (
          <section className="ertp-data-row">
            <span className="ertp-data-row__label">Nr VIN:</span>
            <span className="ertp-data-row__value">{rowData.VIN}</span>
          </section>
        )}

      <section className="ertp-data-row">
        <span className="ertp-data-row__label">Doradca:</span>
        <span className="ertp-data-row__value">{rowData.DORADCA}</span>
      </section>

      <section className="ertp-data-row">
        <span className="ertp-data-row__label">Kontrahent:</span>
        <span
          className={
            rowData?.KONTRAHENT?.length > 70
              ? "ertp-data-row__value ertp-data-row__value--scrollable"
              : "ertp-data-row__value"
          }
          style={
            rowData?.KONTRAHENT?.length > 70 && rowData.AREA === "BLACHARNIA"
              ? { overflowY: "auto", maxHeight: "80px", padding: "0px 2px" }
              : null
          }
        >
          {rowData.KONTRAHENT}
        </span>
      </section>
      {rowData.AREA !== "BLACHARNIA" && (
        <section className="ertp-data-row">
          <span className="ertp-data-row__label">NIP:</span>
          <span className="ertp-data-row__value">{rowData.NIP}</span>
        </section>
      )}

      <section className="ertp-data-row">
        <span className="ertp-data-row__label">Uwagi z faktury:</span>
        <span
          className={
            rowData?.UWAGI_Z_FAKTURY?.length > 70
              ? "ertp-data-row__value ertp-data-row__value--scrollable"
              : "ertp-data-row__value"
          }
          style={
            rowData?.UWAGI_Z_FAKTURY?.length > 70 &&
            rowData.AREA === "BLACHARNIA"
              ? { overflowY: "auto", maxHeight: "70px" }
              : null
          }
        >
          {rowData.UWAGI_Z_FAKTURY}
        </span>
      </section>
    </section>
  );
};
export default BasicDataInsider;
