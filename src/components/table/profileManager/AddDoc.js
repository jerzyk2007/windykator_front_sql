// import { useState } from "react";
// import "./AddDoc.css";

// const AddDoc = ({ profile }) => {
//   const [form, setForm] = useState({
//     numerDokumentu: "",
//     dataPlatnosci: "",
//     kwota: "",
//     kontrahentNazwa: "",
//     kontrahentUlica: "",
//     kontrahentNrDomu: "",
//     kontrahentKod: "",
//     kontrahentMiasto: "",
//     kontrahentNip: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Dodawany dokument:", form);
//     // tu zrobisz wysyłkę do backendu
//   };

//   return (
//     <section className="add_doc">
//       <section className="add_doc__container">
//         <h2>Dodaj dokument płatniczy</h2>
//         <section className="add_doc__wrapper">
//           <section className="add_doc-data">
//             <form className="add_doc__form" onSubmit={handleSubmit}>
//               {/* DANE DOKUMENTU */}
//               <div className="add_doc__section">
//                 <h3>Dane dokumentu</h3>

//                 <label>
//                   Numer dokumentu:
//                   <input
//                     type="text"
//                     name="numerDokumentu"
//                     value={form.numerDokumentu}
//                     onChange={handleChange}
//                   />
//                 </label>

//                 <label>
//                   Data płatności:
//                   <input
//                     type="date"
//                     name="dataPlatnosci"
//                     value={form.dataPlatnosci}
//                     onChange={handleChange}
//                   />
//                 </label>

//                 <label>
//                   Kwota brutto:
//                   <input
//                     type="number"
//                     step="0.01"
//                     name="kwota"
//                     value={form.kwota}
//                     onChange={handleChange}
//                   />
//                 </label>
//               </div>

//               {/* DANE KONTRAHENTA */}
//             </form>
//           </section>
//           <section className="add_doc-data">
//             <form className="add_doc__form" onSubmit={handleSubmit}>
//               {/* DANE KONTRAHENTA */}
//               <div className="add_doc__section">
//                 <h3>Dane kontrahenta</h3>

//                 <label>
//                   Nazwa:
//                   <input
//                     type="text"
//                     name="kontrahentNazwa"
//                     value={form.kontrahentNazwa}
//                     onChange={handleChange}
//                   />
//                 </label>

//                 <label>
//                   Ulica:
//                   <input
//                     type="text"
//                     name="kontrahentUlica"
//                     value={form.kontrahentUlica}
//                     onChange={handleChange}
//                   />
//                 </label>

//                 <label>
//                   Nr domu / lokalu:
//                   <input
//                     type="text"
//                     name="kontrahentNrDomu"
//                     value={form.kontrahentNrDomu}
//                     onChange={handleChange}
//                   />
//                 </label>

//                 <label>
//                   Kod pocztowy:
//                   <input
//                     type="text"
//                     name="kontrahentKod"
//                     value={form.kontrahentKod}
//                     onChange={handleChange}
//                     placeholder="00-000"
//                   />
//                 </label>

//                 <label>
//                   Miasto:
//                   <input
//                     type="text"
//                     name="kontrahentMiasto"
//                     value={form.kontrahentMiasto}
//                     onChange={handleChange}
//                   />
//                 </label>

//                 <label>
//                   NIP:
//                   <input
//                     type="text"
//                     name="kontrahentNip"
//                     value={form.kontrahentNip}
//                     onChange={handleChange}
//                     placeholder="123-456-32-18"
//                   />
//                 </label>
//               </div>
//             </form>
//           </section>
//         </section>
//       </section>
//       <section className="add_doc__accept-panel">
//         <button type="submit" className="add_doc__submit">
//           Zapisz dokument
//         </button>
//       </section>
//     </section>
//   );
// };

// export default AddDoc;
import { useState } from "react";
import "./AddDoc.css";

const AddDoc = ({ profile }) => {
  const [form, setForm] = useState({
    numerDokumentu: "",
    dataPlatnosci: "",
    kwota: "",
    kontrahentNazwa: "",
    kontrahentUlica: "",
    kontrahentNrDomu: "",
    kontrahentKod: "",
    kontrahentMiasto: "",
    kontrahentNip: "",
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

  return (
    <section className="add_doc">
      <section className="add_doc__container">
        <h2>Dodaj dokument płatniczy</h2>

        {/* JEDNA FORMA OBEJMUJĄCA OBA BLOKI */}
        <form className="add_doc__form" onSubmit={handleSubmit}>
          <section className="add_doc__wrapper">
            {/* ===================== LEWA KOLUMNA ===================== */}
            <section className="add_doc-data">
              <div className="add_doc__section">
                <h3>Dane dokumentu</h3>

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
                  Data płatności:
                  <input
                    type="date"
                    name="dataPlatnosci"
                    value={form.dataPlatnosci}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Kwota brutto:
                  <input
                    type="number"
                    step="0.01"
                    name="kwota"
                    value={form.kwota}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </section>

            {/* ===================== PRAWA KOLUMNA ===================== */}
            <section className="add_doc-data">
              <div className="add_doc__section">
                <h3>Dane kontrahenta</h3>

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

                <label>
                  Nr domu / lokalu:
                  <input
                    type="text"
                    name="kontrahentNrDomu"
                    value={form.kontrahentNrDomu}
                    onChange={handleChange}
                  />
                </label>

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
              </div>
            </section>
          </section>

          {/* PANEL ZAPISU */}
          <section className="add_doc__accept-panel">
            <button type="submit" className="add_doc__submit">
              Zapisz dokument
            </button>
          </section>
        </form>
      </section>
    </section>
  );
};

export default AddDoc;
