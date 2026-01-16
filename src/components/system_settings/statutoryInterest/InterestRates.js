import { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";

const InterestRates = ({ percentYear, handleSaveData }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const listRef = useRef(null);
  const [message, setMessage] = useState({
    info: "",
    status: null,
  });
  // --- FUNKCJA FORMATUJĄCA DO WYŚWIETLANIA (Number -> "16,00") ---
  const formatToPL = (val) => {
    const num =
      typeof val === "string" ? parseFloat(val.replace(",", ".")) : val;
    if (isNaN(num)) return "0,00";
    return num
      .toLocaleString("pl-PL", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      .replace(/\s/g, "");
  };

  const parsePercent = (val) => parseFloat(val.replace(",", "."));

  const [rates, setRates] = useState(
    [...percentYear]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((r) => ({
        ...r,
        percent: formatToPL(r.percent),
      }))
  );

  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
    index: null,
    data: null,
  });

  // Funkcja przewijająca na dół
  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // --- EFEKT PRZEWIJANIA ---
  useEffect(() => {
    // Wywołuje przewinięcie przy montowaniu komponentu
    // oraz przy każdej zmianie w tablicy rates (dodanie, edycja, usunięcie)
    const timer = setTimeout(scrollToBottom, 150); // Lekki delay dla renderowania DOM
    return () => clearTimeout(timer);
  }, [rates]); // Reaguje na każdą zmianę stanu rates

  const openModal = (type, index = null) => {
    let data =
      index !== null
        ? { ...rates[index] }
        : { date: new Date().toISOString().split("T")[0], percent: "0,00" };
    setModal({ isOpen: true, type, index, data });
  };

  const closeModal = () =>
    setModal({ isOpen: false, type: null, index: null, data: null });

  const handleModalInputChange = (field, value) => {
    if (field === "percent") {
      let val = value.replace(".", ",");
      const regex = /^\d*,?\d{0,2}$/;
      if (regex.test(val)) {
        setModal((prev) => ({ ...prev, data: { ...prev.data, [field]: val } }));
      }
    } else {
      setModal((prev) => ({ ...prev, data: { ...prev.data, [field]: value } }));
    }
  };

  const handlePercentBlur = () => {
    setModal((prev) => ({
      ...prev,
      data: { ...prev.data, percent: formatToPL(prev.data.percent) },
    }));
  };

  const saveModalAction = () => {
    let updatedRates = [...rates];
    const finalData = {
      ...modal.data,
      percent: formatToPL(modal.data.percent),
    };

    if (modal.type === "add") {
      updatedRates.push(finalData);
    } else if (modal.type === "edit") {
      updatedRates[modal.index] = finalData;
    } else if (modal.type === "delete") {
      updatedRates.splice(modal.index, 1);
    }

    const sorted = updatedRates.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setRates(sorted); // To wywoła useEffect i przewinie listę
    closeModal();
  };

  const handleGlobalSave = async () => {
    const dataToSave = rates.map((r) => ({
      date: r.date,
      percent: parsePercent(r.percent),
    }));
    try {
      await axiosPrivateIntercept.patch("/settings/change-percent", {
        data: dataToSave,
      });
      handleSaveData(dataToSave, "percentYear");
      setMessage({
        info: "Sukces",
        status: "ok",
      });
    } catch (error) {
      setMessage({
        info: "Wystąpił błąd",
        status: "error",
      });

      console.error(error);
    }
  };

  return (
    <div className="interest_rates_container">
      {modal.isOpen && (
        <div className="interest_rates_modal_overlay">
          <div
            className={`interest_rates_modal_content ${
              modal.type === "delete" ? "modal_danger" : ""
            }`}
          >
            <h3>
              {modal.type === "edit" && "Edycja okresu"}
              {modal.type === "add" && "Nowy okres odsetkowy"}
              {modal.type === "delete" && "Potwierdź usunięcie"}
            </h3>

            {modal.type !== "delete" ? (
              <div className="interest_rates_modal_form">
                <label>Obowiązuje od:</label>
                <input
                  type="date"
                  className="interest_rates_modal_input"
                  value={modal.data.date}
                  onChange={(e) =>
                    handleModalInputChange("date", e.target.value)
                  }
                />
                <label>Stawka roczna (%):</label>
                <input
                  type="text"
                  className="interest_rates_modal_input"
                  value={modal.data.percent}
                  onChange={(e) =>
                    handleModalInputChange("percent", e.target.value)
                  }
                  onBlur={handlePercentBlur}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            ) : (
              <p>
                Czy na pewno usunąć stawkę z <strong>{modal.data.date}</strong>?
              </p>
            )}

            <div className="interest_rates_modal_actions">
              <button
                className="interest_rates_btn btn_cancel"
                onClick={closeModal}
              >
                Anuluj
              </button>
              <button
                className={`interest_rates_btn ${
                  modal.type === "delete" ? "btn_danger" : "btn_primary"
                }`}
                onClick={saveModalAction}
              >
                {modal.type === "delete" ? "Usuń" : "Zatwierdź"}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="interest_rates_header">
        <h2
          className={
            message.status
              ? `interest_rates-message--${message.status}`
              : "interest_rates-message"
          }
        >
          {message.info ? `${message.info}` : " Odsetki ustawowe"}
        </h2>
      </header>

      <div className="interest_rates_labels">
        <span className="interest_rates_label_date">Obowiązuje od</span>
        <span className="interest_rates_label_percent">Stawka roczna</span>
        <span className="interest_rates_label_actions">Opcje</span>
      </div>

      <div className="interest_rates_list" ref={listRef}>
        {rates.map((rate, index) => (
          <section key={index} className="interest_rates_row_section">
            <div className="interest_rates_field interest_rates_field_date">
              <span className="display_val">{rate.date}</span>
            </div>
            <div className="interest_rates_field interest_rates_field_percent">
              <span className="display_val">{rate.percent}%</span>
            </div>
            <div className="interest_rates_field interest_rates_field_actions">
              <button
                className="interest_rates_small_btn edit"
                onClick={() => openModal("edit", index)}
              >
                Edytuj
              </button>
              <button
                className="interest_rates_small_btn delete"
                onClick={() => openModal("delete", index)}
              >
                Usuń
              </button>
            </div>
          </section>
        ))}
      </div>

      <footer className="interest_rates_footer">
        <Button
          variant="contained"
          size="small"
          onClick={() => openModal("add")}
        >
          + Dodaj
        </Button>
        <Button
          variant="contained"
          size="small"
          color="success"
          onClick={handleGlobalSave}
        >
          Zapisz
        </Button>
      </footer>
    </div>
  );
};

export default InterestRates;
