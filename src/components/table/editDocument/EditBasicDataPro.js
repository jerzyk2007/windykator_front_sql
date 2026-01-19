import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import { formatNip } from "../utilsForTable/tableFunctions";

// tylko dla blacharni, te loginy mogą zmienić przypisanie działu a obszarze Blacharni
const authLogin = [
  "marta.bednarek@krotoski.com",
  "amanda.nawrocka@krotoski.com",
  "jolanta.maslowska@krotoski.com",
  "anna.wylupek@krotoski.com",
  "jerzy.komorowski@krotoski.com",
  "jerzy.komorowski2@krotoski.com",
  "marcin.furmanek@krotoski.com",
];

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return null;
  return amount.toLocaleString("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
};

const formatAccountNumber = (nr) => {
  if (!nr) return "";
  const first = nr.slice(0, 2);
  const rest =
    nr
      .slice(2)
      .match(/.{1,4}/g)
      ?.join(" ") || "";
  return `${first} ${rest}`;
};

// --- UNIWERSALNY WIERSZ DANYCH (Zaktualizowane klasy) ---
const DataRow = ({
  title,
  children,
  contentClass = "ertp-data-row__value",
  style = {},
}) => {
  if (children === null || children === undefined || children === "")
    return null;

  return (
    <section className="ertp-data-row">
      <span className="ertp-data-row__label">{title}</span>
      <span className={contentClass} style={style}>
        {children}
      </span>
    </section>
  );
};

const getScrollStyle = (text) => {
  if (text && text.length > 160) {
    return { overflowY: "auto", maxHeight: "100px", whiteSpace: "pre-line" };
  }
  return { whiteSpace: "pre-line" };
};

const EditBasicDataPro = ({
  rowData,
  setRowData,
  login,
  handleAddNote,
  profile,
  context,
}) => {
  // if (!rowData) return null;
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  // zmienna dla zmiany DZIALu przez Blacharnie
  const [changeDepartment, setChangeDepartment] = useState({
    oldDep: "",
    newDep: "",
    optionsDep: [],
  });

  const formatAddress = ({
    KONTRAHENT_ULICA,
    KONTRAHENT_NR_BUDYNKU,
    KONTRAHENT_NR_LOKALU,
    KONTRAHENT_KOD_POCZTOWY,
    KONTRAHENT_MIASTO,
  }) => {
    if (!KONTRAHENT_ULICA && !KONTRAHENT_MIASTO) return "";
    const streetLine = KONTRAHENT_ULICA
      ? KONTRAHENT_ULICA +
        (KONTRAHENT_NR_BUDYNKU ? ` ${KONTRAHENT_NR_BUDYNKU}` : "") +
        (KONTRAHENT_NR_LOKALU ? ` m. ${KONTRAHENT_NR_LOKALU}` : "")
      : "";
    const cityLine =
      KONTRAHENT_KOD_POCZTOWY || KONTRAHENT_MIASTO
        ? `${KONTRAHENT_KOD_POCZTOWY ?? ""} ${KONTRAHENT_MIASTO ?? ""}`.trim()
        : "";
    return [streetLine, cityLine].filter(Boolean).join("\n");
  };

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
          `/documents/get-available-deps/${rowData.FIRMA}`,
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
    if (rowData.AREA === "BLACHARNIA" && profile === "insider") {
      fetchData();
    }
  }, [rowData.DZIAL]);
  // --- WIDOK: UŻYTKOWNIK KRT/KEM/RAC ---
  if (profile === "insider") {
    return (
      <section className="ertp-data-section">
        <DataRow title="Faktura:" children={rowData.NUMER_FV} />

        <DataRow title="Data wystawienia:" children={rowData.DATA_FV} />

        <DataRow title="Termin płatności:" children={rowData.TERMIN} />

        <DataRow
          title="Po terminie:"
          style={
            rowData.ILE_DNI_PO_TERMINIE > 0
              ? { backgroundColor: "rgba(255, 130, 130, 1)" }
              : null
          }
          children={rowData.ILE_DNI_PO_TERMINIE}
        />

        {rowData?.AREA === "BLACHARNIA" && authLogin.includes(login) && (
          <DataRow title="Przypisz inny dział:">
            <select
              className="ertp-input-select"
              style={{ backgroundColor: "#f5ffe3", width: "100%" }}
              value={changeDepartment.newDep || changeDepartment.oldDep}
              onChange={(e) => {
                const newDep = e.target.value;
                setRowData((prev) => ({ ...prev, DZIAL: newDep }));
                handleAddNote(
                  `Zmiana działu: ${changeDepartment.oldDep} na ${newDep}`,
                  "log",
                  context,
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
          </DataRow>
        )}

        <DataRow
          title="Brutto:"
          children={formatCurrency(Number(rowData?.BRUTTO)) || "0,00"}
        />

        <DataRow
          title="Netto:"
          children={formatCurrency(Number(rowData?.NETTO)) || "0,00"}
        />

        {rowData.AREA === "BLACHARNIA" && (
          <>
            <DataRow title="Netto + 50% VAT:">
              {rowData?.NETTO && rowData?.BRUTTO
                ? formatCurrency(
                    (Number(rowData.NETTO) + Number(rowData.BRUTTO)) / 2,
                  )
                : "0,00"}
            </DataRow>

            <DataRow
              title="100% VAT:"
              style={{
                backgroundColor:
                  Math.abs(
                    Number(rowData.BRUTTO) -
                      Number(rowData.NETTO) -
                      Number(rowData.DO_ROZLICZENIA),
                  ) <= 1
                    ? "#fee2e2"
                    : "white",
                color:
                  Math.abs(
                    Number(rowData.BRUTTO) -
                      Number(rowData.NETTO) -
                      Number(rowData.DO_ROZLICZENIA),
                  ) <= 1
                    ? "#991b1b"
                    : "#000000ff",
                fontWeight:
                  Math.abs(
                    Number(rowData.BRUTTO) -
                      Number(rowData.NETTO) -
                      Number(rowData.DO_ROZLICZENIA),
                  ) <= 1
                    ? "600"
                    : "normal",
              }}
              children={formatCurrency(
                Number(rowData.BRUTTO) - Number(rowData.NETTO),
              )}
            />

            <DataRow
              title="50% VAT:"
              style={{
                backgroundColor:
                  Math.abs(
                    (Number(rowData.BRUTTO) - Number(rowData.NETTO)) / 2 -
                      Number(rowData.DO_ROZLICZENIA),
                  ) <= 1
                    ? "#fee2e2"
                    : "white",
                color:
                  Math.abs(
                    (Number(rowData.BRUTTO) - Number(rowData.NETTO)) / 2 -
                      Number(rowData.DO_ROZLICZENIA),
                  ) <= 1
                    ? "#991b1b"
                    : "#000000ff",
                fontWeight:
                  Math.abs(
                    (Number(rowData.BRUTTO) - Number(rowData.NETTO)) / 2 -
                      Number(rowData.DO_ROZLICZENIA),
                  ) <= 1
                    ? "600"
                    : "normal",
              }}
              children={formatCurrency(
                (Number(rowData.BRUTTO) - Number(rowData.NETTO)) / 2,
              )}
            />
          </>
        )}

        <DataRow
          title="Do rozliczenia AS:"
          style={{
            backgroundColor: "#fef9c3",
            fontWeight: "500",
            color: "#1e293b",
          }}
          children={formatCurrency(Number(rowData?.DO_ROZLICZENIA)) || "0,00"}
        />

        {(rowData.AREA === "SERWIS" || rowData.FIRMA === "RAC") && (
          <DataRow
            title="Typ płatności:"
            style={
              rowData.TYP_PLATNOSCI === "Gotówka"
                ? { backgroundColor: "rgba(240, 69, 69, .7)" }
                : null
            }
            children={rowData.TYP_PLATNOSCI}
          />
        )}

        {rowData.AREA === "BLACHARNIA" && (
          <DataRow title="Nr szkody:" children={rowData.NR_SZKODY} />
        )}

        {rowData.AREA !== "BLACHARNIA" && rowData.FIRMA !== "RAC" && (
          <DataRow title="Nr autoryzacji:" children={rowData.NR_AUTORYZACJI} />
        )}

        {rowData.AREA !== "CZĘŚCI" &&
          rowData.AREA !== "SAMOCHODY NOWE" &&
          rowData.FIRMA !== "RAC" && (
            <DataRow
              title="Nr rejestracyjny:"
              children={rowData.NR_REJESTRACYJNY}
            />
          )}

        {rowData.AREA !== "CZĘŚCI" &&
          rowData.AREA !== "BLACHARNIA" &&
          rowData.FIRMA !== "RAC" && (
            <DataRow title="Nr VIN:" children={rowData.VIN} />
          )}

        <DataRow title="Doradca:" children={rowData.DORADCA} />

        <DataRow
          title="Kontrahent:"
          style={getScrollStyle(rowData.KONTRAHENT)}
          contentClass={
            rowData?.KONTRAHENT?.length > 70
              ? "ertp-data-row__value ertp-data-row__value--scrollable"
              : "ertp-data-row__value"
          }
          children={rowData.KONTRAHENT}
        />

        {rowData.AREA !== "BLACHARNIA" && (
          <DataRow title="NIP:" children={rowData.NIP} />
        )}

        <DataRow
          title="Uwagi z faktury:"
          style={getScrollStyle(rowData.UWAGI_Z_FAKTURY)}
          contentClass={
            rowData?.UWAGI_Z_FAKTURY?.length > 70
              ? "ertp-data-row__value ertp-data-row__value--scrollable"
              : "ertp-data-row__value"
          }
          children={rowData.UWAGI_Z_FAKTURY}
        />
      </section>
    );
  }

  // --- WIDOK: PARTNER ---
  else if (profile === "partner") {
    const itemsSettlements = (rowData?.WYKAZ_SPLACONEJ_KWOTY_FK ?? []).map(
      (item, index) => (
        <section key={index} className="ertp-settlements-list__item">
          <span className="ertp-settlement-item__date">{item.data}</span>
          <span className="ertp-settlement-item__desc">{item.symbol}</span>
          <span className="ertp-settlement-item__amount">
            {item?.kwota ? (
              formatCurrency(item.kwota)
            ) : (
              <span style={{ color: "red" }}>Brak</span>
            )}
          </span>
        </section>
      ),
    );

    return (
      <section className="ertp-data-section">
        <DataRow
          title="Data przekazania:"
          children={rowData.DATA_PRZEKAZANIA_SPRAWY}
        />
        <DataRow title="Faktura:" children={rowData.NUMER_DOKUMENTU} />
        <DataRow title="Opis dokumentu:" children={rowData.OPIS_DOKUMENTU} />
        <DataRow
          title="Data wystawienia dok."
          children={rowData.DATA_WYSTAWIENIA_DOKUMENTU}
        />
        <DataRow
          title="Kwota brutto dok."
          children={formatCurrency(rowData.KWOTA_BRUTTO_DOKUMENTU)}
        />
        <DataRow
          title="Kwota roszczenia:"
          style={{ backgroundColor: "rgba(252, 255, 206, 1)" }}
          children={
            formatCurrency(rowData.KWOTA_ROSZCZENIA_DO_KANCELARII) || "0,00"
          }
        />
        <DataRow
          title="Kontrahent:"
          style={getScrollStyle(rowData.KONTRAHENT)}
          children={rowData.KONTRAHENT}
        />
        <DataRow title="NIP:" children={rowData.NIP} />

        <DataRow
          title="Oddział:"
          contentClass="ertp-data-row__value ertp-data-row__value--column"
        >
          <span>{rowData?.ODDZIAL?.LOKALIZACJA}</span>
          <span>{`${rowData?.ODDZIAL?.DZIAL || ""} ${
            rowData?.ODDZIAL?.OBSZAR || ""
          }`}</span>
        </DataRow>

        <DataRow
          title="Pozostała należność FK:"
          children={
            rowData.POZOSTALA_NALEZNOSC_FK ? (
              formatCurrency(rowData.POZOSTALA_NALEZNOSC_FK)
            ) : (
              <span style={{ color: "red" }}>Brak danych</span>
            )
          }
        />
        <DataRow
          title="Suma spłaconych kwot FK:"
          children={
            rowData.SUMA_SPLACONEJ_KWOTY_FK ? (
              formatCurrency(rowData.SUMA_SPLACONEJ_KWOTY_FK)
            ) : (
              <span style={{ color: "red" }}>Brak danych</span>
            )
          }
        />

        <section className="ertp-data-row">
          <section className="ertp-settlements-list">
            <span className="ertp-settlements-list__header">
              Wykaz spłaconych kwot
            </span>
            {itemsSettlements.length ? (
              itemsSettlements
            ) : (
              <span style={{ textAlign: "center", color: "red" }}>
                Brak wpłat
              </span>
            )}
          </section>
        </section>
      </section>
    );
  }

  // --- WIDOK: INSURANCE ---
  else if (profile === "insurance") {
    const renderContactList = (items, formatter = (val) => val) => {
      if (!items?.length) return null;
      return items.map((item, index) => (
        <span key={index}>{formatter(item)}</span>
      ));
    };

    return (
      <section className="ertp-data-section">
        <DataRow title="Data przekazania" children={rowData.DATA_PRZEKAZANIA} />
        <DataRow title="Numer polisy" children={rowData.NUMER_POLISY} />
        <DataRow title="Ubezpieczyciel" children={rowData.UBEZPIECZYCIEL} />
        <DataRow title="Numer faktury" children={rowData.FAKTURA_NR} />
        <DataRow title="Termin płatności" children={rowData.TERMIN_PLATNOSCI} />
        <DataRow
          title="Kontrahent:"
          style={getScrollStyle(rowData.KONTRAHENT_NAZWA)}
          children={rowData.KONTRAHENT_NAZWA}
        />
        <DataRow
          title="Adres kontrahenta:"
          style={getScrollStyle(rowData.KONTRAHENT_ADRES)}
        >
          {formatAddress(rowData)}
        </DataRow>
        <DataRow title="NIP" children={formatNip(rowData.KONTRAHENT_NIP)} />
        <DataRow
          title="Kwota dokumentu"
          children={formatCurrency(rowData.KWOTA_DOKUMENT)}
        />
        <DataRow
          title="Należność"
          children={formatCurrency(rowData.NALEZNOSC)}
        />
        <DataRow
          title="Nr konta do wpłaty:"
          children={formatAccountNumber(rowData.NR_KONTA)}
        />
        <DataRow title="Dział" children={rowData.DZIAL} />
        <DataRow
          style={{ wordBreak: "break-all" }}
          title="Osoba zlecająca"
          children={rowData.OSOBA_ZLECAJACA_WINDYKACJE}
        />

        <DataRow
          title="Telefon"
          contentClass="ertp-data-row__value ertp-data-row__value--column"
        >
          {renderContactList(rowData.KONTAKT_DO_KLIENTA?.TELEFON, (val) =>
            val.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"),
          )}
        </DataRow>

        <DataRow
          title="Mail"
          contentClass="ertp-data-row__value ertp-data-row__value--column"
        >
          {renderContactList(rowData.KONTAKT_DO_KLIENTA?.MAIL)}
        </DataRow>
      </section>
    );
  }

  return null;
};

export default EditBasicDataPro;
