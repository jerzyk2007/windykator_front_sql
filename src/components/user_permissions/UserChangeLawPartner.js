import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import { Button } from "@mui/material";

const UserChangeLawPartner = ({ id, lawPartner, setLawPartner }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [errMsg, setErrMsg] = useState("");

  const changeItemSelect = (name) => {
    const updated = lawPartner.map((item) => {
      if (item.hasOwnProperty(name)) {
        return { ...item, [name]: !item[name] };
      }
      return item;
    });
    setLawPartner(updated);
  };

  const lawPartnerItem = (
    <section className="user-change-law-partner__container">
      {lawPartner?.map((item, index) => {
        const [name, value] = Object.entries(item)[0];
        return (
          <label
            key={index}
            className="user-change-law-partner__container--info"
          >
            <span className="user-change-law-partner__name">{name}</span>
            <input
              className="user-change-law-partner--check"
              type="checkbox"
              checked={value}
              onChange={() => changeItemSelect(name)}
            />
          </label>
        );
      })}
    </section>
  );

  const handleChangePermission = async () => {
    try {
      await axiosPrivateIntercept.patch(`/user/change-law-partner/${id}`, {
        lawPartner,
      });
      setErrMsg("Sukces.");
    } catch (err) {
      setErrMsg("Dostęp nie został zmieniony.");
      console.error(err);
    }
  };

  useEffect(() => {
    setErrMsg("");
  }, [lawPartner]);

  return (
    <section className="user-edit-card user-edit-card--limited">
      <header className="user-edit-card__header">
        <h3 className="user-edit-card__title">
          {!errMsg ? "Dostęp do zewnętrznych kancelarii" : errMsg}
        </h3>
      </header>

      <div className="user-edit-card__content">
        <div className="user-edit-card__grid">
          {lawPartner?.map((item, index) => {
            const [name, value] = Object.entries(item)[0];
            return (
              <label key={index} className="user-edit-card__item">
                <span className="user-edit-card__item-label">{name}</span>
                <input
                  type="checkbox"
                  className="user-edit-card__checkbox"
                  checked={value}
                  onChange={() => changeItemSelect(name)}
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
          onClick={handleChangePermission}
        >
          Zapisz zmiany
        </Button>
      </footer>
    </section>
  );
};

export default UserChangeLawPartner;
