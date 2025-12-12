import { useState } from "react";
import { Button } from "@mui/material";

import "./AddDoc.css";

const AddDoc = ({ profile }) => {
  const [form, setForm] = useState({
    numerDokumentu: "",
    terminPlatnosci: "",
    kwota: "",
    konto: "",
    mail: "",
    kontrahentNazwa: "",
    kontrahentUlica: "",
    kontrahentNrDomu: "",
    kontrahentKod: "",
    kontrahentMiasto: "",
    kontrahentNip: "",
    telefony: [""],
    maile: [""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dodawany dokument:", form);
    // tu zrobisz wysyłkę do backendu
  };

  const handleArrayChange = (e, index, field) => {
    const value = e.target.value;

    setForm((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addNewField = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  return (
    <section className="add_doc">
      <h2>Dodaj polisę</h2>
      <form className="add_doc__form" onSubmit={handleSubmit}>
        <section className="add_doc-data">
          <h3>Dane Polisy</h3>
          <section className="add_doc__container">
            <section className="add_doc-code-city">
              <label>
                Numer dokumentu:
                <input
                  type="text"
                  name="numerDokumentu"
                  value={form.numerDokumentu}
                  onChange={handleChange}
                />
              </label>

              <label>
                Termin płatności:
                <input
                  type="date"
                  name="terminPlatnosci"
                  value={form.terminPlatnosci}
                  onChange={handleChange}
                />
              </label>
            </section>

            <label>
              Kwota należności:
              <input
                type="number"
                step="0.01"
                name="kwota"
                value={form.kwota}
                onChange={handleChange}
              />
            </label>
            <label>
              Nr konta do wpłaty:
              <input
                type="number"
                // step="0.01"
                name="konto"
                value={form.konto}
                onChange={handleChange}
              />
            </label>
            <label>
              Zlecający windykację:
              <input
                type="mail"
                name="mail"
                value={form.mail}
                onChange={handleChange}
              />
            </label>
          </section>
        </section>
        <section className="add_doc-data">
          <h3>Dane kontrahenta</h3>
          <section className="add_doc__container">
            <label>
              Nazwa:
              <input
                type="text"
                name="kontrahentNazwa"
                value={form.kontrahentNazwa}
                onChange={handleChange}
              />
            </label>

            <label>
              Ulica:
              <input
                type="text"
                name="kontrahentUlica"
                value={form.kontrahentUlica}
                onChange={handleChange}
              />
            </label>
            <section className="add_doc-code-city">
              <label>
                Nr domu:
                <input
                  type="text"
                  name="kontrahentNrDomu"
                  value={form.kontrahentNrDomu}
                  onChange={handleChange}
                />
              </label>
              <label>
                Nr lokalu:
                <input
                  type="text"
                  name="kontrahentNrDomu"
                  value={form.kontrahentNrDomu}
                  onChange={handleChange}
                />
              </label>
            </section>

            <section className="add_doc-code-city">
              <label>
                Kod pocztowy:
                <input
                  type="text"
                  name="kontrahentKod"
                  value={form.kontrahentKod}
                  onChange={handleChange}
                  placeholder="00-000"
                />
              </label>

              <label>
                Miasto:
                <input
                  type="text"
                  name="kontrahentMiasto"
                  value={form.kontrahentMiasto}
                  onChange={handleChange}
                />
              </label>
            </section>

            <section className="add_doc-code-city">
              <label>
                NIP:
                <input
                  type="text"
                  name="kontrahentNip"
                  value={form.kontrahentNip}
                  onChange={handleChange}
                  placeholder="123-456-32-18"
                />
              </label>
              <label>
                Regon:
                <input
                  type="text"
                  name="kontrahentNip"
                  value={form.kontrahentNip}
                  onChange={handleChange}
                  placeholder="123-456-32-18"
                />
              </label>
            </section>
          </section>
        </section>
        <section className="add_doc-data">
          <h3>Kontakt do klienta</h3>
          {/* <section className="add_doc__container2"> */}
          <section className="add_doc__container-contact">
            {form.telefony.map((tel, index) => (
              <input
                className="add_doc-contact"
                key={index}
                type="text"
                value={tel}
                onChange={(e) => handleArrayChange(e, index, "telefony")}
                placeholder="Telefon"
              />
            ))}
          </section>
          <Button
            style={{ fontSize: "1rem", width: "30%" }}
            size="small"
            variant="contained"
            onClick={() => addNewField("telefony")}
          >
            + telefon
          </Button>
          {/* </section> */}
          <div
            style={{
              width: "100%",
              borderBottom: "2px solid rgba(44, 123, 168, 0.6)",
              padding: "5px",
            }}
          ></div>

          <section className="add_doc__container-contact">
            {form.maile.map((mail, index) => (
              <input
                className="add_doc-contact"
                key={index}
                type="text"
                value={mail}
                onChange={(e) => handleArrayChange(e, index, "telefony")}
                placeholder="Mail"
              />
            ))}
          </section>
          <Button
            style={{ fontSize: "1rem", width: "30%" }}
            size="small"
            variant="contained"
            onClick={() => addNewField("maile")}
          >
            + mail
          </Button>
        </section>
      </form>
      <section className="add_doc__accept-panel">
        <Button variant="contained" size="large" color="success">
          Zapisz dokument
        </Button>
      </section>
    </section>
  );
};

export default AddDoc;
