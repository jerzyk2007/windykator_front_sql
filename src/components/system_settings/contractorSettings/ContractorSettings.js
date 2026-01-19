import { useState, useEffect, useRef } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import { LiaEditSolid } from "react-icons/lia";
import { IoSearchOutline } from "react-icons/io5";
import PleaseWait from "../../PleaseWait";
import { Button } from "@mui/material";

const ContarctorSettings = ({ id = null }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const searchRef = useRef();

  const [search, setSearch] = useState("");
  const [pleaseWait, setPleaseWait] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // --- ZMIANA 1: Nowy stan informujący, czy wyszukiwanie zostało wykonane ---
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (search.length < 5) return;

    setPleaseWait(true);
    // --- ZMIANA 2: Resetujemy stan przed nowym wyszukiwaniem ---
    setHasSearched(false);

    try {
      // Przykład zapytania (odkomentuj i dostosuj endpoint):
      // const result = await axiosPrivateIntercept.get("/contractor/get-data/", {
      //   params: { search },
      // });
      // setUsers(result.data);

      // --- ZMIANA 3: Potwierdzamy zakończenie wyszukiwania ---
      setHasSearched(true);
    } catch (err) {
      console.error("Błąd podczas pobierania kontrahentów:", err);
      setHasSearched(true);
    } finally {
      setPleaseWait(false);
    }
  };

  const handleEditInitiation = (userData) => {
    setSelectedUser(userData);
    setIsEditing(true);
  };

  const getInitials = (login) => {
    if (!login) return "??";
    const namePart = login.split("@")[0];
    const parts = namePart.split(".");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    } else {
      return parts[0].substring(0, 2).toUpperCase();
    }
  };

  // --- ZMIANA 4: Funkcja resetująca komunikaty, gdy użytkownik wpisuje nowy tekst ---
  const handleInputChange = (e) => {
    setSearch(e.target.value.toLowerCase());
    if (hasSearched) setHasSearched(false);
    if (users.length > 0) setUsers([]);
  };

  useEffect(() => {
    if (!isEditing) {
      setUsers([]);
      setSearch("");
      // --- ZMIANA 5: Resetujemy przy powrocie z edycji ---
      setHasSearched(false);
    }
  }, [isEditing]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  //   return (
  //     <main className="user-settings-page">
  //       {!isEditing ? (
  //         <div className="user-settings-content">
  //           <header className="user-settings-header">
  //             <h1>Zarządzanie Kontrahentami</h1>
  //             <p>Wyszukaj kontrahenta, aby edytować jego dane lub ustawienia</p>
  //           </header>

  //           <section className="search-section">
  //             <form className="search-card" onSubmit={handleSubmit}>
  //               <div className="search-input-wrapper">
  //                 <IoSearchOutline className="search-icon" />
  //                 <input
  //                   type="text"
  //                   ref={searchRef}
  //                   placeholder="NIP lub nazwa kontrahenta (min. 5 znaków)..."
  //                   value={search}
  //                   // --- ZMIANA 6: Podpięcie nowej funkcji ---
  //                   onChange={handleInputChange}
  //                 />
  //               </div>
  //               <Button
  //                 variant="contained"
  //                 type="submit"
  //                 disabled={search.length < 5 || pleaseWait}
  //                 size="large"
  //                 color="primary"
  //                 className="search-button"
  //               >
  //                 Szukaj
  //               </Button>
  //             </form>
  //           </section>

  //           <section className="results-list">
  //             {users.map((u, index) => (
  //               <div className="user-card" key={u.id_user || index}>
  //                 <div className="user-avatar-placeholder">
  //                   {getInitials(u.userlogin)}
  //                 </div>
  //                 <div className="user-info">
  //                   <span className="user-label">Login użytkownika</span>
  //                   <h3 className="user-value">{u.userlogin}</h3>
  //                 </div>
  //                 <button
  //                   className="edit-action-btn"
  //                   onClick={() => handleEditInitiation(u)}
  //                   title="Edytuj uprawnienia"
  //                 >
  //                   <LiaEditSolid />
  //                 </button>
  //               </div>
  //             ))}

  //             {/* --- ZMIANA 7: Warunek uzależniony od hasSearched --- */}
  //             {!pleaseWait && hasSearched && users.length === 0 && (
  //               <div className="no-results">
  //                 Nie znaleziono kontrahenta o podanym NIP lub nazwie.
  //               </div>
  //             )}
  //           </section>
  //         </div>
  //       ) : (
  //         <div>{/* Tutaj komponent edycji kontrahenta */}</div>
  //       )}
  //       {pleaseWait && <PleaseWait />}
  //     </main>
  //   );

  return (
    <main className="sm-container">
      {!isEditing ? (
        <div className="sm-content">
          <header className="sm-header">
            <h1>Zarządzanie Kontrahentami</h1>
            <p>Wyszukaj kontrahenta, aby edytować jego ustawienia</p>
          </header>

          <section className="sm-search-area">
            <form className="sm-search-form" onSubmit={handleSubmit}>
              <div className="sm-input-group">
                <IoSearchOutline className="sm-search-icon" />
                <input
                  type="text"
                  ref={searchRef}
                  placeholder="NIP lub nazwa (min. 5 znaków)..."
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
            {users.map((u, index) => (
              <div className="sm-result-card" key={u.id_user || index}>
                <div className="sm-avatar">{getInitials(u.userlogin)}</div>
                <div className="sm-info">
                  <span className="sm-info-label">Nazwa kontrahenta / NIP</span>
                  <h3 className="sm-info-value">{u.userlogin}</h3>
                </div>
                <button
                  className="sm-action-btn"
                  onClick={() => handleEditInitiation(u)}
                >
                  <LiaEditSolid />
                </button>
              </div>
            ))}

            {!pleaseWait && hasSearched && users.length === 0 && (
              <div className="sm-no-results">
                Nie znaleziono kontrahenta o podanych danych.
              </div>
            )}
          </section>
        </div>
      ) : (
        <div>{/* Komponent edycji kontrahenta */}</div>
      )}
      {pleaseWait && <PleaseWait />}
    </main>
  );
};

export default ContarctorSettings;
