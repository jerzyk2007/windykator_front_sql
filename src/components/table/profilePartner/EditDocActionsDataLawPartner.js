import "./EditDocActionsDataLawPartner.css";

const EditDocActionsDataLawPartner = ({
  rowData,
  handleAddNote,
  updateDocuments,
  setRowData,
}) => {
  const status_sprawy = [
    "BRAK",
    "EGZEKUCYJNA",
    "PRZEDSĄDOWA",
    "RESTRUKTURYZACYJNA",
    "SĄDOWA",
    "SĄDOWA / EGZEKUCYJNA",
  ];

  const handleAddLog = (title, oldStatus, newStatus) => {
    const note = `Zmieniono ${title}: z ${
      oldStatus ? oldStatus : "BRAK"
    } na ${newStatus}`;
    handleAddNote(note, "log");
  };

  return (
    <section className="edit_doc edit_doc_basic-data law_partner_basic-data">
      <section className="edit_doc__container">
        <span className="edit_doc--title">Data akceptacji:</span>
        <span className="edit_doc--content">
          {rowData.DATA_PRZYJECIA_SPRAWY}
        </span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Status sprawy:</span>
        <select
          className="item_component-title__container-data--text law_partner_basic-data--select"
          value={rowData?.STATUS_SPRAWY ? rowData.STATUS_SPRAWY : ""}
          onChange={(e) => {
            handleAddLog(
              "Status sprawy",
              rowData.STATUS_SPRAWY,
              e.target.value
            );
            setRowData((prev) => {
              return {
                ...prev,
                STATUS_SPRAWY: e.target.value,
              };
            });
          }}
        >
          <option value="BRAK" disabled hidden>
            BRAK
          </option>
          {status_sprawy.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </section>

      <section className="edit_doc__container">
        <span className="edit_doc--title">Sygnatura sprawy:</span>
        <div className="textarea-wrapper">
          <textarea
            className="law_partner_basic-data--textarea"
            defaultValue={rowData.SYGNATURA_SPRAWY || ""}
            rows={1}
            maxLength={250}
            placeholder="wpisz dane - max 250 znaków"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onBlur={(e) => {
              const newValue = e.target.value;
              const oldValue = rowData.SYGNATURA_SPRAWY || "";

              if (newValue !== oldValue) {
                handleAddLog(
                  "Sygnaturę sprawy",
                  oldValue,
                  newValue ? newValue : "BRAK"
                );

                setRowData((prev) => ({
                  ...prev,
                  SYGNATURA_SPRAWY: newValue,
                }));
              }
            }}
          ></textarea>
        </div>
      </section>

      <section className="edit_doc__container">
        <span className="edit_doc--title">Wydział Sądu:</span>
        <div className="textarea-wrapper">
          <textarea
            className="law_partner_basic-data--textarea"
            defaultValue={rowData.WYDZIAL_SADU || ""}
            rows={1}
            maxLength={250}
            placeholder="wpisz dane - max 250 znaków"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onBlur={(e) => {
              const newValue = e.target.value;
              const oldValue = rowData.WYDZIAL_SADU || "";

              if (newValue !== oldValue) {
                handleAddLog(
                  "Wydział Sądu",
                  oldValue,
                  newValue ? newValue : "BRAK"
                );

                setRowData((prev) => ({
                  ...prev,
                  WYDZIAL_SADU: newValue,
                }));
              }
            }}
          ></textarea>
        </div>
      </section>

      <section className="edit_doc__container">
        <span className="edit_doc--title">Organ egzekucyjny:</span>
        <div className="textarea-wrapper">
          <textarea
            className="law_partner_basic-data--textarea"
            defaultValue={rowData.ORGAN_EGZEKUCYJNY || ""}
            rows={1}
            maxLength={250}
            placeholder="wpisz dane - max 250 znaków"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onBlur={(e) => {
              const newValue = e.target.value;
              const oldValue = rowData.ORGAN_EGZEKUCYJNY || "";

              if (newValue !== oldValue) {
                handleAddLog(
                  "Organ egzekucyjny",
                  oldValue,
                  newValue ? newValue : "BRAK"
                );

                setRowData((prev) => ({
                  ...prev,
                  ORGAN_EGZEKUCYJNY: newValue,
                }));
              }
            }}
          ></textarea>
        </div>
      </section>

      <section className="edit_doc__container">
        <span className="edit_doc--title">Sygnatura sprawy egzekucyjnej:</span>
        <div className="textarea-wrapper">
          <textarea
            className="law_partner_basic-data--textarea"
            defaultValue={rowData.SYGN_SPRAWY_EGZEKUCYJNEJ || ""}
            rows={1}
            maxLength={250}
            placeholder="wpisz dane - max 250 znaków"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onBlur={(e) => {
              const newValue = e.target.value;
              const oldValue = rowData.SYGN_SPRAWY_EGZEKUCYJNEJ || "";

              if (newValue !== oldValue) {
                handleAddLog(
                  "Sygn. sprawy egzekucyjnej",
                  oldValue,
                  newValue ? newValue : "BRAK"
                );

                setRowData((prev) => ({
                  ...prev,
                  SYGN_SPRAWY_EGZEKUCYJNEJ: newValue,
                }));
              }
            }}
          ></textarea>
        </div>
      </section>

      <section className="edit_doc__container">
        <span className="edit_doc--title">
          Termin przedawnienia roszczenia:
        </span>
        <div className="textarea-wrapper">
          <input
            className="item_component-title__container-data--text law_partner_basic-data--date"
            type="date"
            defaultValue={
              rowData.TERMIN_PRZEDAWNIENIA_ROSZCZENIA
                ? rowData.TERMIN_PRZEDAWNIENIA_ROSZCZENIA.slice(0, 10)
                : ""
            }
            onBlur={(e) => {
              const newValue = e.target.value || null;
              const oldValue = rowData.TERMIN_PRZEDAWNIENIA_ROSZCZENIA || null;

              if (newValue !== oldValue) {
                handleAddLog(
                  "Termin przedawnienia roszczenia",
                  oldValue ? oldValue.slice(0, 10) : "BRAK",
                  newValue || "BRAK"
                );

                setRowData((prev) => ({
                  ...prev,
                  TERMIN_PRZEDAWNIENIA_ROSZCZENIA: newValue,
                }));
              }
            }}
          />
        </div>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Data wymagalności płatności:</span>
        <div className="textarea-wrapper">
          <input
            className="item_component-title__container-data--text law_partner_basic-data--date"
            type="date"
            defaultValue={
              rowData.DATA_WYMAGALNOSCI_PLATNOSCI
                ? rowData.DATA_WYMAGALNOSCI_PLATNOSCI.slice(0, 10)
                : ""
            }
            onBlur={(e) => {
              const newValue = e.target.value || null;
              const oldValue = rowData.DATA_WYMAGALNOSCI_PLATNOSCI || null;

              if (newValue !== oldValue) {
                handleAddLog(
                  "Termin przedawnienia roszczenia",
                  oldValue ? oldValue.slice(0, 10) : "BRAK",
                  newValue || "BRAK"
                );

                setRowData((prev) => ({
                  ...prev,
                  DATA_WYMAGALNOSCI_PLATNOSCI: newValue,
                }));
              }
            }}
          />
        </div>
      </section>
    </section>
  );
};

export default EditDocActionsDataLawPartner;
