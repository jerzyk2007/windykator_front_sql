import "./EditDocBasicData.css";

const EditDocBasicData = ({
  rowData,
  login,
  handleAddNote,
  changeDepartment,
  setChangeDepartment,
}) => {
  const authLogin = [
    "marta.bednarek@krotoski.com",
    "amanda.nawrocka@krotoski.com",
    "jolanta.maslowska@krotoski.com",
    "anna.wylupek@krotoski.com",
    "jerzy.komorowski@krotoski.com",
  ];

  return (
    <section className="edit_doc edit_doc_basic-data">
      <section className="edit_doc__container">
        <span className="edit_doc--title">Faktura:</span>
        <span className="edit_doc--content">{rowData.NUMER_FV}</span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Data wystawienia:</span>
        <span className="edit_doc--content">{rowData.DATA_FV}</span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Termin płatności:</span>
        <span className="edit_doc--content">{rowData.TERMIN}</span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Po terminie:</span>
        <span
          className="edit_doc--content"
          style={
            rowData.ILE_DNI_PO_TERMINIE > 0
              ? { backgroundColor: "rgba(240, 69, 69, .7)" }
              : null
          }
        >
          {rowData.ILE_DNI_PO_TERMINIE}
        </span>
      </section>
      {rowData?.AREA === "BLACHARNIA" && authLogin.includes(login) && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">Przypisz inny dział:</span>
          <select
            className="edit_doc--select"
            style={{ backgroundColor: "#f5ffe3" }}
            value={changeDepartment.newDep || changeDepartment.oldDep} // pokażemy oldDep, jeśli newDep jest pusty
            onChange={(e) => {
              const newDep = e.target.value;

              setChangeDepartment((prev) => ({
                ...prev,
                newDep: newDep,
              }));

              handleAddNote(
                `Zmiana działu: ${changeDepartment.oldDep} na`,
                newDep
              );
            }}
          >
            {/* Początkowa opcja, disabled */}
            {changeDepartment.oldDep && (
              <option value={changeDepartment.oldDep} disabled>
                {changeDepartment.oldDep}
              </option>
            )}

            {/* Pozostałe opcje */}
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

      <section className="edit_doc__container">
        <span className="edit_doc--title">Brutto:</span>
        <span className="edit_doc--content">
          {rowData?.BRUTTO
            ? rowData.BRUTTO.toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })
            : ""}
        </span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Netto:</span>
        <span className="edit_doc--content">
          {rowData?.NETTO
            ? rowData.NETTO.toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })
            : ""}
        </span>
      </section>
      {rowData.AREA === "BLACHARNIA" && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">Netto + 50% VAT:</span>
          <span className="edit_doc--content">
            {(
              rowData.NETTO +
              parseFloat(((rowData.BRUTTO - rowData.NETTO) / 2).toFixed(2))
            ).toLocaleString("pl-PL", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              useGrouping: true,
            })}
          </span>
        </section>
      )}

      {rowData.AREA === "BLACHARNIA" && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">100% VAT:</span>
          <span
            className="edit_doc--content"
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
              useGrouping: true,
            })}
          </span>
        </section>
      )}

      {rowData.AREA === "BLACHARNIA" && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">50% VAT:</span>
          <span
            className="edit_doc--content"
            style={{
              backgroundColor:
                Math.abs(
                  (rowData.BRUTTO - rowData.NETTO) / 2 - rowData.DO_ROZLICZENIA
                ) <= 1
                  ? "rgba(240, 69, 69, .7)"
                  : null,
            }}
          >
            {((rowData.BRUTTO - rowData.NETTO) / 2).toLocaleString("pl-PL", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              useGrouping: true,
            })}
          </span>
        </section>
      )}

      <section className="edit_doc__container">
        <span className="edit_doc--title">Do rozliczenia AS:</span>
        <span
          className="edit_doc--content"
          style={{ backgroundColor: "rgba(248, 255, 152, .6)" }}
        >
          {rowData.DO_ROZLICZENIA
            ? rowData.DO_ROZLICZENIA.toLocaleString("pl-PL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
              })
            : "0,00"}
        </span>
      </section>

      {rowData.AREA === "SERWIS" ||
        (rowData.FIRMA === "RAC" && (
          <section className="edit_doc__container">
            <span className="edit_doc--title">Typ płatności:</span>
            <span
              className="edit_doc--content"
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
        <section className="edit_doc__container">
          <span className="edit_doc--title">Nr szkody:</span>
          <span className="edit_doc--content">{rowData.NR_SZKODY}</span>
        </section>
      )}
      {rowData.AREA !== "BLACHARNIA" && rowData.FIRMA !== "RAC" && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">Nr autoryzacji:</span>
          <span className="edit_doc--content">{rowData.NR_AUTORYZACJI}</span>
        </section>
      )}

      {rowData.AREA !== "CZĘŚCI" &&
        rowData.AREA !== "SAMOCHODY NOWE" &&
        rowData.FIRMA !== "RAC" && (
          <section className="edit_doc__container">
            <span className="edit_doc--title">Nr rejestracyjny:</span>
            <span className="edit_doc--content">
              {rowData.NR_REJESTRACYJNY}
            </span>
          </section>
        )}
      {rowData.AREA !== "CZĘŚCI" &&
        rowData.AREA !== "BLACHARNIA" &&
        rowData.FIRMA !== "RAC" && (
          <section className="edit_doc__container">
            <span className="edit_doc--title">Nr VIN:</span>
            <span className="edit_doc--content">{rowData.VIN}</span>
          </section>
        )}

      <section className="edit_doc__container">
        <span className="edit_doc--title">Doradca:</span>
        <span className="edit_doc--content">{rowData.DORADCA}</span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Kontrahent:</span>
        <span
          className={
            rowData?.KONTRAHENT?.length > 140
              ? "edit_doc--content-scroll"
              : "edit_doc--content"
          }
          style={
            rowData?.KONTRAHENT?.length > 140 && rowData.AREA === "BLACHARNIA"
              ? { overflowY: "auto", maxHeight: "80px" }
              : null
          }
        >
          {rowData.KONTRAHENT}
        </span>
      </section>

      {rowData.AREA !== "BLACHARNIA" && (
        <section className="edit_doc__container">
          <span className="edit_doc--title">NIP:</span>
          <span className="edit_doc--content">{rowData.NIP}</span>
        </section>
      )}

      <section className="edit_doc__container">
        <span className="edit_doc--title">Uwagi z faktury:</span>
        <span
          className={
            rowData?.UWAGI_Z_FAKTURY?.length > 70
              ? "edit_doc--content-scroll"
              : "edit_doc--content"
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

export default EditDocBasicData;
