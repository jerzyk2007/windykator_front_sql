import { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";

const PublicHolidays = ({ customHolidays, handleSaveData }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const listRef = useRef(null);

  const monthNames = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];

  // --- LOGIKA SORTOWANIA (Miesiąc, potem Dzień) ---
  const sortHolidays = (data) => {
    return [...data].sort((a, b) => {
      if (a.month !== b.month) return a.month - b.month;
      return a.day - b.day;
    });
  };

  const [holidays, setHolidays] = useState(sortHolidays(customHolidays));

  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
    index: null,
    data: null,
  });

  const [message, setMessage] = useState({
    info: "",
    status: null,
  });

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 150);
    return () => clearTimeout(timer);
  }, [holidays]);

  // --- WALIDACJA DATY ---
  const getMaxDays = (month) => {
    // Luty 29 (dla bezpieczeństwa świąt ruchomych/stałych), reszta standard
    if (month === 2) return 29;
    if ([4, 6, 9, 11].includes(month)) return 30;
    return 31;
  };

  const openModal = (type, index = null) => {
    let data =
      index !== null ? { ...holidays[index] } : { day: 1, name: "", month: 1 };
    setModal({ isOpen: true, type, index, data });
  };

  const closeModal = () =>
    setModal({ isOpen: false, type: null, index: null, data: null });

  const handleModalInputChange = (field, value) => {
    let val = value;
    if (field === "day") {
      val = parseInt(value) || "";
      const max = getMaxDays(modal.data.month);
      if (val > max) val = max;
      if (val < 1 && val !== "") val = 1;
    }
    setModal((prev) => ({ ...prev, data: { ...prev.data, [field]: val } }));
  };

  const saveModalAction = () => {
    const { day, month, name } = modal.data;

    // 1. Sprawdź czy data jest poprawna (np. 31 kwietnia)
    if (day > getMaxDays(month)) {
      return alert(
        `Miesiąc ${monthNames[month - 1]} ma tylko ${getMaxDays(month)} dni!`
      );
    }

    // 2. Sprawdź duplikaty (wykluczając obecnie edytowany index)
    const isDuplicate = holidays.some(
      (h, idx) => h.day === day && h.month === month && idx !== modal.index
    );

    if (isDuplicate) {
      return alert("Ta data jest już na liście świąt!");
    }

    if (!name.trim()) {
      return alert("Podaj nazwę święta!");
    }

    let updatedHolidays = [...holidays];
    if (modal.type === "add") {
      updatedHolidays.push(modal.data);
    } else if (modal.type === "edit") {
      updatedHolidays[modal.index] = modal.data;
    } else if (modal.type === "delete") {
      updatedHolidays.splice(modal.index, 1);
    }

    setHolidays(sortHolidays(updatedHolidays));
    closeModal();
  };

  const handleGlobalSave = async () => {
    try {
      await axiosPrivateIntercept.patch("/settings/change-holidays", {
        data: holidays,
      });
      handleSaveData(holidays, "freeDays");
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
              {modal.type === "edit" && "Edytuj święto"}
              {modal.type === "add" && "Nowe święto stałe"}
              {modal.type === "delete" && "Potwierdź usunięcie"}
            </h3>
            {modal.type !== "delete" ? (
              <div className="interest_rates_modal_form">
                <label>Nazwa święta:</label>
                <input
                  type="text"
                  className="interest_rates_modal_input"
                  value={modal.data.name}
                  onChange={(e) =>
                    handleModalInputChange("name", e.target.value)
                  }
                  placeholder="np. Boże Ciało"
                />

                <div className="interest_rates_modal_date_group">
                  <div
                    className="interest_rates_field_wrapper"
                    style={{ flex: "0 0 80px" }}
                  >
                    <label>Dzień:</label>
                    <input
                      type="number"
                      className="interest_rates_modal_input interest_rates_input_day"
                      value={modal.data.day}
                      onChange={(e) =>
                        handleModalInputChange("day", e.target.value)
                      }
                      onFocus={(e) => e.target.select()}
                    />
                  </div>

                  <div
                    className="interest_rates_field_wrapper"
                    style={{ flex: 1 }}
                  >
                    <label>Miesiąc:</label>
                    <select
                      className="interest_rates_modal_input interest_rates_input_month"
                      value={modal.data.month}
                      onChange={(e) =>
                        handleModalInputChange(
                          "month",
                          parseInt(e.target.value)
                        )
                      }
                    >
                      {monthNames.map((m, idx) => (
                        <option key={idx} value={idx + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <p>
                Czy usunąć święto: <strong>{modal.data.name}</strong>?
              </p>
            )}
            {/* {modal.type !== "delete" ? (
              <div className="interest_rates_modal_form">
                <label>Nazwa święta:</label>
                <input
                  type="text"
                  className="interest_rates_modal_input"
                  value={modal.data.name}
                  onChange={(e) =>
                    handleModalInputChange("name", e.target.value)
                  }
                  placeholder="np. Wigilia"
                />

                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  <div style={{ flex: 1 }}>
                    <label>Dzień:</label>
                    <input
                      type="number"
                      className="interest_rates_modal_input"
                      value={modal.data.day}
                      onChange={(e) =>
                        handleModalInputChange("day", e.target.value)
                      }
                    />
                  </div>
                  <div style={{ flex: 2 }}>
                    <label>Miesiąc:</label>
                    <select
                      className="interest_rates_modal_input"
                      value={modal.data.month}
                      onChange={(e) =>
                        handleModalInputChange(
                          "month",
                          parseInt(e.target.value)
                        )
                      }
                    >
                      {monthNames.map((m, idx) => (
                        <option key={idx} value={idx + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <p>
                Czy usunąć święto: <strong>{modal.data.name}</strong> (
                {modal.data.day} {monthNames[modal.data.month - 1]})?
              </p>
            )} */}

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
          {message.info ? `${message.info}` : "Dni ustawowo wolne (stałe)"}
        </h2>
        <h3>
          Proszę wprowadzać wyłącznie święta o stałych datach. Święta ruchome
          (takie jak Wielkanoc czy Boże Ciało) są uwzględniane automatycznie
          przez system
        </h3>
      </header>

      <div className="interest_rates_labels">
        <span className="interest_rates_label_date">Nazwa święta</span>
        <span className="interest_rates_label_percent">Data</span>
        <span className="interest_rates_label_actions">Opcje</span>
      </div>

      <div className="interest_rates_list" ref={listRef}>
        {holidays.map((h, index) => (
          <section key={index} className="interest_rates_row_section">
            <div className="interest_rates_field interest_rates_field_date">
              <span className="display_val">{h.name}</span>
            </div>
            <div className="interest_rates_field interest_rates_field_percent">
              <span className="display_val">
                {h.day} {monthNames[h.month - 1]}
              </span>
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

export default PublicHolidays;
