import { useRef, useState, useEffect } from "react";

const EditDocSettlements = ({ settlement, date, fv_zal, fv_zal_kwota }) => {
  const scrollRef = useRef(null);
  const [settlementData, setSettlementData] = useState([]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [settlementData]);

  useEffect(() => {
    const formatAmount = (value) =>
      typeof value === "number" && !isNaN(value)
        ? value.toLocaleString("pl-PL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
          })
        : "0,00";

    let formattedSettlements = [];

    if (Array.isArray(settlement) && settlement.length > 0) {
      formattedSettlements = [...settlement]
        .sort((a, b) => {
          const dateA = a.data || "";
          const dateB = b.data || "";
          return dateB.localeCompare(dateA);
        })
        .map((item) => ({
          datePart: item.data || "brak daty",
          descriptionPart: ` - ${item.opis} - `,
          amountPart: formatAmount(item.kwota),
        }));
    }

    if (fv_zal && typeof fv_zal_kwota === "number" && !isNaN(fv_zal_kwota)) {
      const zaliczkaObj = {
        datePart: fv_zal,
        descriptionPart: " - ",
        amountPart: formatAmount(fv_zal_kwota),
      };
      formattedSettlements = [zaliczkaObj, ...formattedSettlements];
    }

    setSettlementData(formattedSettlements);
  }, [settlement, fv_zal, fv_zal_kwota]);

  return (
    <section className="ertp-settlements-section">
      <span className="ertp-settlements__header">Opisy rozrachunków</span>

      {/* Wykorzystanie standardowych klas rzędu dla daty rozliczenia */}
      <section className="ertp-data-row">
        <span className="ertp-data-row__label">
          Data rozliczenia autostacja:
        </span>
        <span className="ertp-data-row__value">{date || "brak danych"}</span>
      </section>

      <div ref={scrollRef} className="ertp-settlements__scroll-box">
        {settlementData.length > 0 ? (
          settlementData.map((item, index) => (
            <div key={index} className="ertp-settlement-item">
              <span className="ertp-settlement-item__date">
                {item.datePart}
              </span>

              <span className="ertp-settlement-item__desc">
                {item.descriptionPart}
              </span>

              <span className="ertp-settlement-item__amount">
                {item.amountPart}
              </span>
            </div>
          ))
        ) : (
          <span className="ertp-settlement-item--empty">
            Brak danych z rozrachunków
          </span>
        )}
      </div>
    </section>
  );
};

export default EditDocSettlements;
