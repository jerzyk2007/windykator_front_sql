import { useState, useEffect, useRef } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import { LiaEditSolid } from "react-icons/lia";
import { IoSearchOutline } from "react-icons/io5";
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

  // Formatowanie adresu z pól A_ (Główny)
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
    e.preventDefault();
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

  useEffect(() => {
    if (!isEditing) {
      setContractors([]);
      setSearch("");
      setHasSearched(false);
    }
  }, [isEditing]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

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
            <p>Wyszukaj kontrahenta, aby edytować dane w systemie</p>
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
              <div className="sm-result-card" key={c.id_kontrahent || index}>
                {/* AWATAR: F dla Firmy (niebieski), P dla Prywatnego (zielony) */}
                <div
                  className="sm-avatar"
                  style={{
                    background:
                      c.IS_FIRMA === 1
                        ? "linear-gradient(135deg, #1976d2, #42a5f5)" // Niebieski dla firm
                        : "linear-gradient(135deg, #2e7d32, #66bb6a)", // Zielony dla prywatnych
                    fontSize: "1.4rem",
                  }}
                  title={c.IS_FIRMA === 1 ? "Firma" : "Osoba prywatna"}
                >
                  {c.IS_FIRMA === 1 ? "F" : "P"}
                </div>

                {/* 1. Nazwa i NIP */}
                <div className="sm-info" style={{ flex: 2 }}>
                  <span className="sm-info-label">Nazwa i NIP</span>
                  <h3 className="sm-info-value">
                    {c.NAZWA_KONTRAHENTA_SLOWNIK}
                  </h3>
                  <small className="sm-info-subvalue">
                    {c.KONTR_NIP
                      ? `NIP: ${c.KONTR_NIP}`
                      : c.PESEL
                        ? `PESEL: ${c.PESEL}`
                        : "Brak identyfikatora"}
                  </small>
                </div>

                {/* 2. Adres Główny */}
                <div className="sm-info">
                  <span className="sm-info-label">Adres Główny</span>
                  <p
                    className="sm-info-value"
                    style={{ fontWeight: 400, fontSize: "0.85rem" }}
                  >
                    {formatAddress(c)}
                  </p>
                </div>

                {/* 3. Spółka i ID */}
                <div className="sm-info">
                  <span className="sm-info-label">System / Spółka</span>
                  <p className="sm-info-value">{c.SPOLKA || "---"}</p>
                  <small className="sm-info-subvalue">
                    CKK: {c.CUSTOMER_ID_CKK}
                  </small>
                </div>

                {/* Akcja */}
                <button
                  className="sm-action-btn"
                  onClick={() => {
                    setSelectedContractor(c);
                    setIsEditing(true);
                  }}
                  title="Edytuj dane kontrahenta"
                >
                  <LiaEditSolid />
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
