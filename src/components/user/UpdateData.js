import "./UpdateData.css";

const UpdateData = ({ data }) => {
  const sortedData = [
    "Faktury",
    "Wydania samochodów",
    "Rozrachunki",
    "Opisy rozrachunków",
    "Rozliczenia Symfonia",
    "Rubicon",
    "BeCared",
    "Dokumenty Raportu FK - KRT",
    "Dokumenty Raportu FK - KEM",
    "Dokumenty Raportu FK - RAC",
    "Wpłaty dla spraw w Kancelarii Krotoski",
  ];

  const sortedArray = [...data].sort(
    (a, b) => sortedData.indexOf(a.DATA_NAME) - sortedData.indexOf(b.DATA_NAME)
  );

  const updateItems = sortedArray.map((item, index) => {
    return (
      <div key={index} className="update-data-card__row">
        <span className="col-name">{item.DATA_NAME}</span>
        <span className="col-date">{item.DATE}</span>
        <span className="col-hour">{item.HOUR}</span>
        <span
          className={`col-status ${
            item.UPDATE_SUCCESS === "Sukces" ? "status-ok" : ""
          }`}
        >
          {item.UPDATE_SUCCESS}
        </span>
      </div>
    );
  });

  return (
    <section className="update-data-card">
      <header className="update-data-card__header">
        <h3 className="update-data-card__title">Status aktualizacji danych</h3>
      </header>

      <div className="update-data-card__table-labels">
        <span className="col-name">Nazwa:</span>
        <span className="col-date">Data:</span>
        <span className="col-hour">Godzina:</span>
        <span className="col-status">Status:</span>
      </div>

      <div className="update-data-card__content">{updateItems}</div>
    </section>
  );
};

export default UpdateData;
