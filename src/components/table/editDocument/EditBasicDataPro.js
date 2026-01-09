import { color } from "@mui/system";
import { formatNip } from "../utilsForTable/tableFunctions";

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

const EditBasicDataPro = ({ rowData, profile }) => {
  if (!rowData) return null;

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
        (KONTRAHENT_NR_LOKALU ? ` / ${KONTRAHENT_NR_LOKALU}` : "")
      : "";
    const cityLine =
      KONTRAHENT_KOD_POCZTOWY || KONTRAHENT_MIASTO
        ? `${KONTRAHENT_KOD_POCZTOWY ?? ""} ${KONTRAHENT_MIASTO ?? ""}`.trim()
        : "";
    return [streetLine, cityLine].filter(Boolean).join("\n");
  };

  // --- WIDOK: PARTNER ---
  if (profile === "partner") {
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
      )
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
            val.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")
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
