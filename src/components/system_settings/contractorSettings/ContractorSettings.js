import { useState, useEffect, useRef } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import { LiaEditSolid } from "react-icons/lia";
import { IoSearchOutline, IoEye } from "react-icons/io5"; // Dodałem ikonę raportu
import PleaseWait from "../../PleaseWait";
import { Button } from "@mui/material";
import EditContractor from "./EditContractor";
import ReportContractor from "./ReportContractor";

const ContractorSettings = ({ viewMode }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const searchRef = useRef();

  const [search, setSearch] = useState("");
  const [pleaseWait, setPleaseWait] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Formatowanie adresu
  const formatAddress = (c) => {
    const street = c.A_ULICA_EXT || "";
    const houseNum = c.A_NRDOMU || "";
    const flatNum = c.A_NRLOKALU ? `/${c.A_NRLOKALU}` : "";
    const zip = c.A_KOD || "";
    const city = c.A_MIASTO || "";

    if (!street && !city) return "Brak adresu głównego";

    return (
      <>
        {street} {houseNum}
        {flatNum}
        <br />
        {zip} {city}
      </>
    );
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (search.length < 5) return;

    setPleaseWait(true);
    setHasSearched(false);

    try {
      const result = await axiosPrivateIntercept.get(
        "/contractor/get-contarctors-list",
        { params: { search } },
      );
      setContractors(result.data);
      setHasSearched(true);
    } catch (err) {
      console.error("Błąd podczas wyszukiwania kontrahentów:", err);
      setHasSearched(true);
      setContractors([]);
    } finally {
      setPleaseWait(false);
    }
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    if (hasSearched) setHasSearched(false);
  };

  // USUNIĘTO useEffect, który czyścił stan przy powrocie (isEditing === false)
  // Dzięki temu lista 'contractors' zostanie zachowana w pamięci komponentu.

  // Opcjonalnie: Resetuj listę TYLKO gdy zmienia się tryb (np. z Edycji na Raporty w menu bocznym)
  useEffect(() => {
    setContractors([]);
    setSearch("");
    setHasSearched(false);
    setIsEditing(false);
  }, [viewMode]);

  return (
    <main className="sm-container">
      {!isEditing ? (
        <div className="sm-content">
          <header className="sm-header">
            <h1>
              {viewMode === "edit"
                ? "Zarządzanie Kontrahentami"
                : "Historia rozliczeń i windykacji Kontrahenta"}
            </h1>
            <p>Wyszukaj kontrahenta, aby wyświetlić szczegóły</p>
          </header>

          <section className="sm-search-area">
            <form className="sm-search-form" onSubmit={handleSubmit}>
              <div className="sm-input-group">
                <IoSearchOutline className="sm-search-icon" />
                <input
                  type="text"
                  ref={searchRef}
                  placeholder="NIP lub nazwa kontrahenta (min. 5 znaków)..."
                  value={search}
                  onChange={handleInputChange}
                />
              </div>
              <Button
                variant="contained"
                type="submit"
                disabled={search.length < 5 || pleaseWait}
                color="primary"
              >
                Szukaj
              </Button>
            </form>
          </section>

          <section className="sm-results-list">
            {contractors.map((c, index) => (
              <div className="sm-result-card" key={index}>
                <div
                  className="sm-avatar"
                  style={{
                    background:
                      c.IS_FIRMA === 1
                        ? "linear-gradient(135deg, #1976d2, #42a5f5)"
                        : "linear-gradient(135deg, #2e7d32, #66bb6a)",
                    fontSize: "1.4rem",
                  }}
                >
                  {c.IS_FIRMA === 1 ? "F" : "P"}
                </div>

                <div className="sm-info" style={{ flex: 2 }}>
                  <span className="sm-info-label">Nazwa i NIP</span>
                  <h3 className="sm-info-value">
                    {c.NAZWA_KONTRAHENTA_SLOWNIK}
                  </h3>
                  <small className="sm-info-subvalue">
                    {c.KONTR_NIP
                      ? `NIP: ${c.KONTR_NIP}`
                      : `PESEL: ${c.PESEL || "---"}`}
                  </small>
                </div>

                <div className="sm-info">
                  <span className="sm-info-label">Adres Główny</span>
                  <p
                    className="sm-info-value"
                    style={{ fontWeight: 400, fontSize: "0.85rem" }}
                  >
                    {formatAddress(c)}
                  </p>
                </div>

                <div className="sm-info">
                  <span className="sm-info-label">System / Spółka</span>
                  <p className="sm-info-value">{c.SPOLKA || "---"}</p>
                  <small className="sm-info-subvalue">
                    CKK: {c.CUSTOMER_ID_CKK}
                  </small>
                </div>

                <button
                  className="sm-action-btn"
                  onClick={() => {
                    setSelectedContractor(c);
                    setIsEditing(true);
                  }}
                  title={viewMode === "edit" ? "Edytuj dane" : "Pokaż raport"}
                >
                  {viewMode === "edit" ? <LiaEditSolid /> : <IoEye />}
                </button>
              </div>
            ))}

            {!pleaseWait && hasSearched && contractors.length === 0 && (
              <div className="sm-no-results">
                Nie znaleziono kontrahenta spełniającego kryteria.
              </div>
            )}
          </section>
        </div>
      ) : (
        <>
          {viewMode === "edit" && (
            <EditContractor
              id={selectedContractor.id_kontrahent}
              contractor={selectedContractor}
              onBack={() => setIsEditing(false)}
            />
          )}

          {viewMode === "raport" && (
            <ReportContractor
              contractor={selectedContractor}
              onBack={() => setIsEditing(false)}
            />
          )}
        </>
      )}

      {pleaseWait && <PleaseWait />}
    </main>
  );
};

export default ContractorSettings;
