import { useState, useEffect, useRef } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import { LiaEditSolid } from "react-icons/lia";
import { IoSearchOutline } from "react-icons/io5"; // Specyficzna ikona wyszukiwania osób
import PleaseWait from "../../PleaseWait";
import EditUserSettings from "./EditUserSettings";
import { Button } from "@mui/material";
import "./UserSettings.css";

const UserSetting = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const searchRef = useRef();

  const [search, setSearch] = useState("");
  const [pleaseWait, setPleaseWait] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (search.length < 5) return;

    setPleaseWait(true);
    try {
      const result = await axiosPrivateIntercept.get("/user/get-userdata/", {
        params: { search },
      });
      setUsers(result.data);
    } catch (err) {
      console.error("Błąd podczas pobierania użytkowników:", err);
    } finally {
      setPleaseWait(false);
    }
  };

  const handleEditInitiation = (userData) => {
    setSelectedUser(userData);
    setIsEditing(true);
  };

  //wyciągam inicjały
  const getInitials = (login) => {
    if (!login) return "??";

    // 1. Pobieramy tylko część przed @ (np. "jan.kowalski")
    const namePart = login.split("@")[0];

    // 2. Dzielimy kropką na części
    const parts = namePart.split(".");

    if (parts.length >= 2) {
      // Jeśli są co najmniej dwie części (imię i nazwisko)
      return (parts[0][0] + parts[1][0]).toUpperCase();
    } else {
      // Jeśli jest tylko jedna część (np. sam login)
      return parts[0].substring(0, 2).toUpperCase();
    }
  };

  useEffect(() => {
    if (!isEditing) {
      setUsers([]);
      setSearch("");
    }
  }, [isEditing]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  return (
    <main className="user-settings-page">
      {!isEditing ? (
        <div className="user-settings-content">
          <header className="user-settings-header">
            <h1>Zarządzanie Użytkownikami</h1>
            <p>
              Wyszukaj pracownika, aby edytować jego uprawnienia lub dane
              profilowe
            </p>
          </header>

          <section className="search-section">
            <form className="search-card" onSubmit={handleSubmit}>
              <div className="search-input-wrapper">
                <IoSearchOutline className="search-icon" />
                <input
                  type="text"
                  ref={searchRef}
                  placeholder="Login lub nazwisko (min. 5 znaków)..."
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
            {users.map((u, index) => (
              <div className="user-card" key={u.id_user || index}>
                <div className="user-avatar-placeholder">
                  {getInitials(u.userlogin)}
                </div>

                <div className="user-info">
                  <span className="user-label">Login użytkownika</span>
                  <h3 className="user-value">{u.userlogin}</h3>
                </div>

                <button
                  className="edit-action-btn"
                  onClick={() => handleEditInitiation(u)}
                  title="Edytuj uprawnienia"
                >
                  <LiaEditSolid />
                </button>
              </div>
            ))}

            {!pleaseWait && search.length >= 5 && users.length === 0 && (
              <div className="no-results">
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
};

export default UserSetting;
