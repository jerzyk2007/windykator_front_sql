import { useState, useEffect, useRef } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import PleaseWait from "../../PleaseWait";
import AddDoc from "./AddDoc";
import { LiaEditSolid } from "react-icons/lia";
import { IoSearchOutline } from "react-icons/io5";
import { Button } from "@mui/material";
// import "./SearchModule.css"; // Używamy wspólnego pliku

const EditDoc = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const searchRef = useRef();

  const [search, setSearch] = useState("");
  const [pleaseWait, setPleaseWait] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const formatToPLN = (value) => {
    if (!value && value !== 0) return "0,00 zł";
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (search.length < 5) return;

    setPleaseWait(true);
    setHasSearched(false);

    try {
      const result = await axiosPrivateIntercept.get(
        "/insurance/get-insurance-nr/",
        { params: { search } },
      );
      setDocuments(result.data);
      setHasSearched(true);
    } catch (err) {
      console.error("Błąd wyszukiwania:", err);
      setHasSearched(true);
    } finally {
      setPleaseWait(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    if (hasSearched) setHasSearched(false);
  };

  useEffect(() => {
    if (!isEditing) {
      setDocuments([]);
      setSearch("");
      setHasSearched(false);
    }
  }, [isEditing]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    setDocuments([]);
    setHasSearched(false);
  }, [search]);

  return (
    <main className="sm-container">
      {!isEditing ? (
        <div className="sm-content">
          <header className="sm-header">
            <h1>Edycja Dokumentów</h1>
            <p>Wyszukaj polisę, aby dokonać zmian w systemie</p>
          </header>

          <section className="sm-search-area">
            <form className="sm-search-form" onSubmit={handleSubmit}>
              <div className="sm-input-group">
                <IoSearchOutline className="sm-search-icon" />
                <input
                  type="text"
                  ref={searchRef}
                  placeholder="Wpisz numer polisy (min. 5 znaków)..."
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
            {documents.map((doc, index) => (
              <div className="sm-result-card" key={doc.id_document || index}>
                {/* 1. Podstawowe dane polisy */}
                <div className="sm-info">
                  <span className="sm-info-label">Numer i Ubezpieczyciel</span>
                  <h3 className="sm-info-value">{doc.NUMER_POLISY}</h3>
                  <small className="sm-info-subvalue">
                    {doc.UBEZPIECZYCIEL}
                  </small>
                </div>

                {/* 2. Dane kontrahenta */}
                <div className="sm-info">
                  <span className="sm-info-label">Kontrahent</span>
                  <p className="sm-info-value">{doc.KONTRAHENT_NAZWA}</p>
                </div>

                {/* 3. Spółka */}
                <div className="sm-info">
                  <span className="sm-info-label">Spółka</span>
                  <p className="sm-info-value">{doc.FIRMA || "Brak danych"}</p>
                </div>

                {/* 4. Finanse */}
                <div className="sm-info">
                  <span className="sm-info-label">Kwota / Pozostało</span>
                  <p className="sm-info-subvalue">
                    Suma: {formatToPLN(doc.KWOTA_DOKUMENT)}
                  </p>
                  <p className="sm-info-value" style={{ color: "#2e7d32" }}>
                    Należność: {formatToPLN(doc.NALEZNOSC)}
                  </p>
                </div>

                {/* Przycisk akcji */}
                <button
                  className="sm-action-btn"
                  onClick={() => (setSelectedDoc(doc), setIsEditing(true))}
                  title="Edytuj dokument"
                >
                  <LiaEditSolid />
                </button>
              </div>
            ))}

            {!pleaseWait && hasSearched && documents.length === 0 && (
              <div className="sm-no-results">
                Brak dokumentów spełniających kryteria.
              </div>
            )}
          </section>
        </div>
      ) : (
        <AddDoc
          profile="edit"
          setIsEditing={setIsEditing}
          docData={selectedDoc}
        />
      )}

      {pleaseWait && <PleaseWait />}
    </main>
  );
};

export default EditDoc;
