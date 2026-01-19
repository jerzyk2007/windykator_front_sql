import { useState, useEffect, useRef } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import PleaseWait from "../../PleaseWait";
import AddDoc from "./AddDoc";
import { LiaEditSolid } from "react-icons/lia";
import { IoSearchOutline } from "react-icons/io5";
import { Button } from "@mui/material";
import "./EditDoc.css";

const EditDoc = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const searchRef = useRef();

  const [search, setSearch] = useState("");
  const [pleaseWait, setPleaseWait] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Funkcja formatująca walutę
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
    try {
      const result = await axiosPrivateIntercept.get(
        "/insurance/get-insurance-nr/",
        { params: { search } },
      );
      setDocuments(result.data);
    } catch (err) {
      console.error("Błąd wyszukiwania:", err);
    } finally {
      setPleaseWait(false);
    }
  };

  const handleEditInitiation = (doc) => {
    setSelectedDoc(doc);
    setIsEditing(true);
  };

  useEffect(() => {
    if (!isEditing) {
      setDocuments([]);
      setSearch("");
    }
  }, [isEditing]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    setDocuments([]);
  }, [search]);

  return (
    <main className="edit-doc-page">
      {!isEditing ? (
        <div className="edit-doc-content">
          <header className="edit-doc-header">
            <h1>Edycja Dokumentów</h1>
            <p>Wyszukaj polisę, aby dokonać zmian w systemie</p>
          </header>

          <section className="search-section">
            <form className="search-card" onSubmit={handleSubmit}>
              <div className="search-input-wrapper">
                <IoSearchOutline className="search-icon" />
                <input
                  type="text"
                  ref={searchRef}
                  placeholder="Wpisz numer polisy (min. 5 znaków)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value.toLowerCase())}
                />
              </div>
              <Button
                variant="contained"
                type="submit"
                disabled={search.length < 5}
                size="large"
                color="primary"
                className="search-button"
              >
                Szukaj
              </Button>
            </form>
          </section>

          <section className="results-list">
            {documents.map((doc, index) => (
              <div className="doc-card" key={doc.id_document || index}>
                {/* 1. Podstawowe dane polisy */}
                <div className="doc-info">
                  <span className="doc-label">Numer i Ubezpieczyciel</span>
                  <h3 className="doc-value">{doc.NUMER_POLISY}</h3>
                  <small className="doc-subvalue">{doc.UBEZPIECZYCIEL}</small>
                </div>

                {/* 2. Dane kontrahenta */}
                <div className="doc-info">
                  <span className="doc-label">Kontrahent</span>
                  <p className="doc-value">{doc.KONTRAHENT_NAZWA}</p>
                </div>

                {/* 3. Spółka (NOWE) */}
                <div className="doc-info">
                  <span className="doc-label">Spółka</span>
                  <p className="doc-value">{doc.FIRMA || "Brak danych"}</p>
                </div>

                {/* 4. Logistyka/Daty */}
                <div className="doc-info">
                  <span className="doc-label">Data przekazania</span>
                  <p className="doc-value">{doc.DATA_PRZEKAZANIA || "-"}</p>
                </div>

                {/* 5. Finanse */}
                <div className="doc-info">
                  <span className="doc-label">Kwota / Należność</span>
                  <p
                    className="doc-value"
                    style={{ fontSize: "0.85rem", opacity: 0.8 }}
                  >
                    Kwota dokumentu: {formatToPLN(doc.KWOTA_DOKUMENT)}
                  </p>
                  <p
                    className="doc-value"
                    style={{ fontWeight: "bold", color: "#2e7d32" }}
                  >
                    Pozostało: {formatToPLN(doc.NALEZNOSC)}
                  </p>
                </div>

                {/* Przycisk akcji */}
                <button
                  className="edit-action-btn"
                  onClick={() => handleEditInitiation(doc)}
                  title="Edytuj dokument"
                >
                  <LiaEditSolid />
                </button>
              </div>
            ))}

            {!pleaseWait && search.length >= 5 && documents.length === 0 && (
              <div className="no-results">
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
