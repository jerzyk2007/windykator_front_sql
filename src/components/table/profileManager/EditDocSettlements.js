import { useRef, useState, useEffect } from "react";
import "./EditDocSettlements.css";

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

    // 1. Przetwarzanie settlement (lista rozrachunków)
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

    // 2. Dodanie fv_zal na początek (jako osobny obiekt)
    if (fv_zal && typeof fv_zal_kwota === "number" && !isNaN(fv_zal_kwota)) {
      const zaliczkaObj = {
        datePart: fv_zal, // Tytuł zaliczki
        descriptionPart: " - ",
        amountPart: formatAmount(fv_zal_kwota),
      };
      formattedSettlements = [zaliczkaObj, ...formattedSettlements];
    }

    setSettlementData(formattedSettlements);
  }, [settlement, fv_zal, fv_zal_kwota]);

  return (
    <section className="edit-doc-settlements">
      <span className="edit-doc-settlements--title">Opisy rozrachunków</span>

      <section className="edit_doc__container">
        <span className="edit_doc--title">Data rozliczenia autostacja:</span>
        <span className="edit_doc--content">{date || "brak danych"}</span>
      </section>

      <div ref={scrollRef} className="edit-doc-settlements--content">
        {settlementData.length > 0 ? (
          settlementData.map((item, index) => (
            <div
              key={index}
              style={{
                borderBottom: "1px solid #c5c5c5ff",
                paddingBottom: "2px",
                marginBottom: "2px",
              }}
            >
              {/* DATA - KOLOR NIEBIESKI */}
              <span style={{ color: "#007bff", fontWeight: "600" }}>
                {item.datePart}
              </span>

              {/* OPIS - KOLOR SZARY/CZARNY */}
              <span style={{ color: "#555" }}>{item.descriptionPart}</span>

              {/* KWOTA - KOLOR ZIELONY */}
              <span style={{ color: "#0f962fff", fontWeight: "600" }}>
                {item.amountPart}
              </span>
            </div>
          ))
        ) : (
          <span style={{ color: "#999", fontStyle: "italic" }}>
            Brak danych z rozrachunków
          </span>
        )}
      </div>
    </section>
  );
};

export default EditDocSettlements;
