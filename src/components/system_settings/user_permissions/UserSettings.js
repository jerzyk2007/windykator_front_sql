import { useState, useEffect, useRef } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import { LiaEditSolid } from "react-icons/lia";
import { IoSearchOutline } from "react-icons/io5";
import PleaseWait from "../../PleaseWait";
import EditUserSettings from "./EditUserSettings";
import { Button } from "@mui/material";
// import "./UserSettings.css";

const UserSettings = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const searchRef = useRef();

  const [search, setSearch] = useState("");
  const [pleaseWait, setPleaseWait] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // --- ZMIANA 1: Nowy stan do śledzenia, czy przycisk Szukaj został kliknięty ---
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (search.length < 5) return;

    setPleaseWait(true);
    // --- ZMIANA 2: Resetujemy stan przed nowym wyszukiwaniem ---
    setHasSearched(false);

    try {
      const result = await axiosPrivateIntercept.get("/user/get-userdata/", {
        params: { search },
      });
      setUsers(result.data);
      // --- ZMIANA 3: Potwierdzamy, że wyszukiwanie się zakończyło ---
      setHasSearched(true);
    } catch (err) {
      console.error("Błąd podczas pobierania użytkowników:", err);
      // Nawet w przypadku błędu warto ustawić na true, by pokazać brak wyników (opcjonalnie)
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

  // --- ZMIANA 4: Funkcja czyszcząca stan, gdy użytkownik zaczyna wpisywać coś nowego ---
  const handleInputChange = (e) => {
    setSearch(e.target.value.toLowerCase());
    if (hasSearched) setHasSearched(false);
    if (users.length > 0) setUsers([]);
  };

  useEffect(() => {
    if (!isEditing) {
      setUsers([]);
      setSearch("");
      // --- ZMIANA 5: Resetujemy stan przy powrocie do widoku wyszukiwania ---
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
            <h1>Zarządzanie Użytkownikami</h1>
            <p>Wyszukaj pracownika, aby edytować jego dane</p>
          </header>

          <section className="sm-search-area">
            <form className="sm-search-form" onSubmit={handleSubmit}>
              <div className="sm-input-group">
                <IoSearchOutline className="sm-search-icon" />
                <input
                  type="text"
                  ref={searchRef}
                  placeholder="Login lub nazwisko (min. 5 znaków)..."
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
                <div className="sm-info" style={{ paddingLeft: "50px" }}>
                  <span
                    className="sm-info-label"
                    // style={{ textAlign: "center" }}
                  >
                    Login użytkownika
                  </span>
                  <h3 style={{ fontSize: "1.2rem" }} className="sm-info-value">
                    {u.userlogin}
                  </h3>
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
                Nie znaleziono użytkownika o podanym loginie.
              </div>
            )}
          </section>
        </div>
      ) : (
        <EditUserSettings user={selectedUser} setEdit={setIsEditing} />
      )}
      {pleaseWait && <PleaseWait />}
    </main>
  );
  // return (
  //   <main className="user-settings-page">
  //     {!isEditing ? (
  //       <div className="user-settings-content">
  //         <header className="user-settings-header">
  //           <h1>Zarządzanie Użytkownikami</h1>
  //           <p>
  //             Wyszukaj pracownika, aby edytować jego uprawnienia lub dane
  //             profilowe
  //           </p>
  //         </header>

  //         <section className="search-section">
  //           <form className="search-card" onSubmit={handleSubmit}>
  //             <div className="search-input-wrapper">
  //               <IoSearchOutline className="search-icon" />
  //               <input
  //                 type="text"
  //                 ref={searchRef}
  //                 placeholder="Login lub nazwisko (min. 5 znaków)..."
  //                 value={search}
  //                 // --- ZMIANA 6: Podpięcie nowej funkcji obsługi zmiany ---
  //                 onChange={handleInputChange}
  //               />
  //             </div>
  //             <Button
  //               variant="contained"
  //               type="submit"
  //               disabled={search.length < 5 || pleaseWait}
  //               size="large"
  //               color="primary"
  //               className="search-button"
  //             >
  //               Szukaj
  //             </Button>
  //           </form>
  //         </section>

  //         <section className="results-list">
  //           {users.map((u, index) => (
  //             <div className="user-card" key={u.id_user || index}>
  //               <div className="user-avatar-placeholder">
  //                 {getInitials(u.userlogin)}
  //               </div>
  //               <div className="user-info">
  //                 <span className="user-label">Login użytkownika</span>
  //                 <h3 className="user-value">{u.userlogin}</h3>
  //               </div>
  //               <button
  //                 className="edit-action-btn"
  //                 onClick={() => handleEditInitiation(u)}
  //                 title="Edytuj uprawnienia"
  //               >
  //                 <LiaEditSolid />
  //               </button>
  //             </div>
  //           ))}

  //           {/* --- ZMIANA 7: Dodanie warunku hasSearched do wyświetlania komunikatu --- */}
  //           {!pleaseWait && hasSearched && users.length === 0 && (
  //             <div className="no-results">
  //               Nie znaleziono użytkownika o podanym loginie.
  //             </div>
  //           )}
  //         </section>
  //       </div>
  //     ) : (
  //       <EditUserSettings user={selectedUser} setEdit={setIsEditing} />
  //     )}
  //     {pleaseWait && <PleaseWait />}
  //   </main>
  // );
};

export default UserSettings;
