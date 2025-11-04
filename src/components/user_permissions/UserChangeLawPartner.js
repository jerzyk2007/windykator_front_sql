import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import "./UserChangeLawPartner.css";

const UserChangeLawPartner = ({ id, lawPartner, setLawPartner }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [errMsg, setErrMsg] = useState("");
  const changeItemSelect = (name) => {
    const updated = lawPartner.map((item) => {
      // jeśli obiekt zawiera klucz 'name', odwracamy jego wartość
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
        const [name, value] = Object.entries(item)[0]; // np. ["Kancelaria Krotoski", false]
        return (
          <label
            key={index}
            className="user-change-law-partner__container--info"
          >
            <span className="user-change-law-partner__name">{name}</span>
            <input
              className="user-change-law-partner--check "
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
    <section className="user-change-law-partner">
      <section className="user-change-law-partner__title">
        <h3 className="user-change-law-partner__title--name">
          {!errMsg ? "Dostęp do zawnętrznych kancelarii" : errMsg}
        </h3>
      </section>
      {lawPartnerItem}
      <Button variant="contained" onClick={handleChangePermission} size="small">
        Zmień
      </Button>
    </section>
  );
};

export default UserChangeLawPartner;
