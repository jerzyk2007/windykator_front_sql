import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import { Button } from "@mui/material";

const UserCompany = ({ id, company, userCompany }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  // Lokalny stan dla zaznaczonych spółek (inicjalizowany tym co ma user)
  const [selectedCompanies, setSelectedCompanies] = useState(userCompany || []);
  const [errMsg, setErrMsg] = useState("");

  const handleSaveUserCompany = async () => {
    try {
      await axiosPrivateIntercept.patch(`/user/change-user-companies/${id}`, {
        activeCompanies: selectedCompanies,
      });
      setErrMsg("Sukces.");
    } catch (err) {
      setErrMsg("Zmiana się nie powiodła.");
      console.error(err);
    }
  };

  // Synchronizacja stanu jeśli propsy by się zmieniły (np. zmiana usera w locie)
  useEffect(() => {
    setSelectedCompanies(userCompany || []);
  }, [userCompany]);

  const toggleCompany = (compName) => {
    setErrMsg(""); // Czyścimy błąd przy zmianie
    setSelectedCompanies(
      (prev) =>
        prev.includes(compName)
          ? prev.filter((item) => item !== compName) // Usuń jeśli zaznaczone
          : [...prev, compName] // Dodaj jeśli nie zaznaczone
    );
  };
  return (
    <section className="user-edit-card user-edit-card--limited">
      <header className="user-edit-card__header">
        <h3 className="user-edit-card__title">
          {!errMsg ? "Dostęp do spółek" : errMsg}
        </h3>
      </header>

      <div className="user-edit-card__content">
        <div className="user-edit-card__grid">
          {company?.map((compName, index) => {
            const isChecked = selectedCompanies.includes(compName);

            return (
              <label key={index} className="user-edit-card__item">
                <span className="user-edit-card__item-label">{compName}</span>
                <input
                  type="checkbox"
                  className="user-edit-card__checkbox"
                  checked={isChecked}
                  onChange={() => toggleCompany(compName)}
                />
              </label>
            );
          })}
        </div>
      </div>

      <footer className="user-edit-card__footer">
        <Button
          variant="contained"
          className="user-edit-card__button"
          onClick={handleSaveUserCompany}
          color="success"
          size="small"
        >
          Zapisz zmiany
        </Button>
      </footer>
    </section>
  );
};

export default UserCompany;
