import { useState } from "react";
import { Button } from "@mui/material";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";

const InterestCalculator = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [formData, setFormData] = useState({
    amount: "",
    deadlineDate: "",
    paymentDate: new Date().toISOString().split("T")[0],
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- FUNKCJA DO FORMTOWANIA WALUTY (zawsze X XXX,XX) ---
  const formatMoney = (value) => {
    return new Intl.NumberFormat("pl-PL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(value);
  };

  const numericAmount = parseFloat(formData.amount.replace(",", "."));
  const isInvalid =
    !formData.amount ||
    isNaN(numericAmount) ||
    numericAmount <= 0 ||
    !formData.deadlineDate ||
    !formData.paymentDate ||
    new Date(formData.paymentDate) < new Date(formData.deadlineDate);

  const calculate = async () => {
    if (isInvalid) return;
    setLoading(true);
    try {
      const response = await axiosPrivateIntercept.post(
        "/settings/calculate-interest",
        {
          amount: numericAmount,
          deadlineDate: formData.deadlineDate,
          paymentDate: formData.paymentDate,
        }
      );
      setResults(response.data);
    } catch (error) {
      alert("Błąd serwera.");
    } finally {
      setLoading(false);
    }
  };

  // --- WIDOK 2: WYNIKI ---
  if (results) {
    return (
      <div className="interest_rates_container">
        <header className="interest_rates_header">
          <h2>Podsumowanie</h2>
        </header>

        <div
          className="calc_res_scroll_content"
          style={{ flex: 1, overflowY: "auto", padding: "0 10px" }}
        >
          <div
            className="calc_res_card_main"
            style={{
              background: "#f1f5f9",
              padding: "15px",
              borderRadius: "12px",
            }}
          >
            <div className="calc_res_scroll_content--info">
              <p className="calc_res_scroll_content--title">Kwota: </p>
              <p className="calc_res_scroll_content--value">
                {formatMoney(results.kwota_zobowiazania)} PLN
              </p>
            </div>
            <div className="calc_res_scroll_content--info">
              <p className="calc_res_scroll_content--title">Termin: </p>
              <p className="calc_res_scroll_content--value">
                {results.termin_zaplaty}
              </p>
            </div>
            <div className="calc_res_scroll_content--info">
              <p className="calc_res_scroll_content--title">Zapłacono: </p>
              <p className="calc_res_scroll_content--value">
                {results.uiszczenie_zaplaty}
              </p>
            </div>

            {results.warning && (
              <div className="calc_res_warning">{results.warning}</div>
            )}
          </div>

          <div className="interest_rates_labels" style={{ marginTop: "15px" }}>
            <span style={{ flex: 2 }}>Okres</span>
            <span style={{ flex: 0.8, textAlign: "center" }}>Dni</span>
            <span style={{ flex: 1.2, textAlign: "right" }}>Odsetki</span>
          </div>

          <div className="calc_res_list">
            {results.szczegoly.map((item, idx) => (
              <div
                key={idx}
                className="interest_rates_row_section"
                style={{ padding: "8px 12px" }}
              >
                <div style={{ flex: 2 }}>
                  <div
                    className="calc_item_dates"
                    style={{ fontSize: "0.9rem", fontWeight: 600 }}
                  >
                    {item.od_do}
                  </div>
                  <div
                    className="calc_item_rate"
                    style={{ fontSize: "0.8rem", color: "#64748b" }}
                  >
                    stawka: {item.stawka}
                  </div>
                </div>
                <div
                  style={{
                    flex: 0.8,
                    textAlign: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  {item.liczba_dni}
                </div>
                <div
                  style={{
                    flex: 1.2,
                    textAlign: "right",
                    fontWeight: "700",
                    fontSize: "0.9rem",
                  }}
                >
                  {formatMoney(item.kwota)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer
          className="calc_res_footer"
          style={{
            flexShrink: 0,
            padding: "15px",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <div className="calc_res_total_box">
            <span
              className="calc_res_total_box--result"
              style={{ color: "#c6ceda" }}
            >
              Suma odsetek
            </span>
            <span
              style={{ color: "#2df5b2", fontSize: "1.1rem", fontWeight: 700 }}
            >
              {formatMoney(results.razem_odsetki)} zł
            </span>
          </div>
          <Button
            style={{ minWidth: "100px" }}
            size="small"
            variant="contained"
            color="primary"
            onClick={() => setResults(null)}
          >
            Wróć
          </Button>
        </footer>
      </div>
    );
  }

  // --- WIDOK 1: FORMULARZ ---
  return (
    <div className="interest_rates_container">
      <header className="interest_rates_header">
        <h2>Kalkulator odsetek</h2>
      </header>
      <div className="interest_rates_list" style={{ padding: "15px" }}>
        <div className="interest_rates_modal_form">
          <label className="calc_form_label">Kwota zobowiązania (PLN):</label>
          <input
            type="text"
            className="interest_rates_modal_input"
            value={formData.amount}
            placeholder="np. 5000,00"
            onChange={(e) => {
              let val = e.target.value.replace(".", ",");
              if (/^\d*,?\d{0,2}$/.test(val) || val === "")
                setFormData({ ...formData, amount: val });
            }}
          />
          <label className="calc_form_label">Termin zapłaty:</label>
          <input
            type="date"
            className="interest_rates_modal_input"
            // min="2017-01-01"
            value={formData.deadlineDate}
            onChange={(e) =>
              setFormData({ ...formData, deadlineDate: e.target.value })
            }
          />
          <label className="calc_label">Uiszczenie zapłaty:</label>
          <input
            type="date"
            className="interest_rates_modal_input"
            // min={formData.deadlineDate}
            value={formData.paymentDate}
            onChange={(e) =>
              setFormData({ ...formData, paymentDate: e.target.value })
            }
          />
        </div>
      </div>
      <footer className="interest_rates_footer">
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            setFormData({
              amount: "",
              deadlineDate: "",
              paymentDate: new Date().toISOString().split("T")[0],
            })
          }
        >
          Wyczyść
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={calculate}
          disabled={loading || isInvalid}
        >
          {loading ? "Liczenie..." : "Oblicz"}
        </Button>
      </footer>
    </div>
  );
};

export default InterestCalculator;
