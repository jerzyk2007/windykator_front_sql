// import "./EditBasicDataPro.css";

// const EditBasicDataPro = ({ rowData, profile }) => {
//   const itemsSettlements = (rowData?.WYKAZ_SPLACONEJ_KWOTY_FK ?? [])
//     .map((item, index) => {
//       return (
//         <section
//           key={index}
//           className="edit_basic_data_pro__settlements_container"
//         >
//           <span>{item.data}</span>
//           <span>{item.symbol}</span>
//           <span>
//             {item?.kwota ? (
//               item.kwota.toLocaleString("pl-PL", {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2,
//                 useGrouping: true,
//               })
//             ) : (
//               <span style={{ color: "red" }}>Brak</span>
//             )}
//           </span>
//         </section>
//       );
//     })
//     .filter(Boolean);
//   if (profile === "partner") {
//     return (
//       <section className="edit_doc edit_doc_basic-data edit_basic_data_pro">
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Data przekazania:</span>
//           <span className="edit_doc--content">
//             {rowData.DATA_PRZEKAZANIA_SPRAWY}
//           </span>
//         </section>
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Faktura:</span>
//           <span className="edit_doc--content">{rowData.NUMER_DOKUMENTU}</span>
//         </section>
//         {rowData?.OPIS_DOKUMENTU && (
//           <section className="edit_doc__container">
//             <span className="edit_doc--title">Opis dokumentu:</span>
//             <span className="edit_basic_data_pro--content">
//               {rowData.OPIS_DOKUMENTU}
//             </span>
//           </section>
//         )}

//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Data wystawienia dok.</span>
//           <span className="edit_doc--content">
//             {rowData.DATA_WYSTAWIENIA_DOKUMENTU}
//           </span>
//         </section>

//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Kwota brutto dok.</span>
//           <span className="edit_doc--content">
//             {rowData?.KWOTA_BRUTTO_DOKUMENTU
//               ? rowData.KWOTA_BRUTTO_DOKUMENTU.toLocaleString("pl-PL", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                   useGrouping: true,
//                 })
//               : ""}
//           </span>
//         </section>

//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Kwota roszczenia:</span>
//           <span
//             className="edit_doc--content"
//             style={{ backgroundColor: "rgba(252, 255, 206, 1)" }}
//           >
//             {rowData.KWOTA_ROSZCZENIA_DO_KANCELARII
//               ? rowData.KWOTA_ROSZCZENIA_DO_KANCELARII.toLocaleString("pl-PL", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                   useGrouping: true,
//                 })
//               : "0,00"}
//           </span>
//         </section>

//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Kontrahent:</span>
//           <span
//             className="edit_basic_data_pro--content"
//             style={
//               rowData?.KONTRAHENT?.length > 160
//                 ? { overflowY: "auto", maxHeight: "100px" }
//                 : null
//             }
//           >
//             {rowData?.KONTRAHENT}
//           </span>
//         </section>
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">NIP:</span>
//           <span className="edit_doc--content">{rowData?.NIP}</span>
//         </section>

//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Oddział:</span>
//           <span className="edit_doc--content _pro--content">
//             <span className="edit_doc--content">
//               {rowData?.ODDZIAL?.LOKALIZACJA}
//             </span>
//             <span className="edit_doc--content">
//               {`${rowData?.ODDZIAL?.DZIAL} ${rowData?.ODDZIAL?.OBSZAR}`}
//             </span>
//           </span>
//         </section>
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Pozostała należność FK:</span>
//           <span className="edit_doc--content">
//             {rowData?.POZOSTALA_NALEZNOSC_FK ? (
//               rowData.POZOSTALA_NALEZNOSC_FK.toLocaleString("pl-PL", {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2,
//                 useGrouping: true,
//               })
//             ) : (
//               <span style={{ color: "red" }}>Brak danych</span>
//             )}
//           </span>
//         </section>
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Suma spłaconych kwot FK:</span>
//           <span className="edit_doc--content">
//             {rowData?.SUMA_SPLACONEJ_KWOTY_FK ? (
//               rowData.SUMA_SPLACONEJ_KWOTY_FK.toLocaleString("pl-PL", {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2,
//                 useGrouping: true,
//               })
//             ) : (
//               <span style={{ color: "red" }}>Brak danych</span>
//             )}
//           </span>
//         </section>
//         <section className="edit_doc__container">
//           <section className="edit_basic_data_pro__settlements">
//             <span className="edit_basic_data_pro__settlements--title">
//               Wykaz spłaconych kwot
//             </span>
//             {itemsSettlements.length ? (
//               itemsSettlements
//             ) : (
//               <span style={{ textAlign: "center", color: "red" }}>
//                 Brak wpłat
//               </span>
//             )}
//           </section>
//         </section>
//       </section>
//     );
//   } else if (profile === "insurance") {
//     console.log(rowData);
//     const phone = rowData.KONTAKT_DO_KLIENTA?.TELEFON?.map((item, index) => {
//       const formatted = item?.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

//       return (
//         <span key={index} className="edit_basic_data_pro--contact">
//           {formatted}
//         </span>
//       );
//     });
//     const mail = rowData.KONTAKT_DO_KLIENTA?.MAIL?.map((item, index) => {
//       return (
//         <span key={index} className="edit_basic_data_pro--contact">
//           {item}
//         </span>
//       );
//     });
//     const formatAccountNumber = (nr) => {
//       if (!nr) return "";

//       // pierwsze 2 cyfry
//       const first = nr.slice(0, 2);

//       // reszta pocięta na grupy po 4
//       const rest =
//         nr
//           .slice(2)
//           .match(/.{1,4}/g)
//           ?.join(" ") || "";

//       return `${first} ${rest}`;
//     };

//     return (
//       <section className="edit_doc edit_doc_basic-data edit_basic_data_pro">
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Data przekzania</span>
//           <span className="edit_doc--content">{rowData.DATA_PRZEKAZANIA}</span>
//         </section>
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Numer polisy</span>
//           <span className="edit_doc--content">{rowData.NUMER_POLISY}</span>
//         </section>
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Ubezpieczyciel</span>
//           <span className="edit_doc--content">{rowData.UBEZPIECZYCIEL}</span>
//         </section>
//         {rowData?.FAKTURA_NR && (
//           <section className="edit_doc__container">
//             <span className="edit_doc--title">Numer faktury</span>
//             <span className="edit_doc--content">{rowData.FAKTURA_NR}</span>
//           </section>
//         )}
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Termin płatności</span>
//           <span className="edit_doc--content">{rowData.TERMIN_PLATNOSCI}</span>
//         </section>
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Kontrahent:</span>
//           <span
//             className="edit_basic_data_pro--content"
//             style={
//               rowData?.KONTRAHENT_NAZWA?.length > 160
//                 ? { overflowY: "auto", maxHeight: "100px" }
//                 : null
//             }
//           >
//             {rowData?.KONTRAHENT_NAZWA}
//           </span>
//         </section>
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Adres kontrahenta:</span>
//           <span
//             className="edit_basic_data_pro--content"
//             style={
//               rowData?.KONTRAHENT_ADRES?.length > 160
//                 ? {
//                     overflowY: "auto",
//                     maxHeight: "100px",
//                     whiteSpace: "pre-line",
//                   }
//                 : { whiteSpace: "pre-line" }
//             }
//           >
//             {rowData?.KONTRAHENT_ADRES}
//           </span>
//         </section>
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">NIP</span>
//           <span className="edit_doc--content">
//             {" "}
//             {rowData.KONTRAHENT_NIP?.replace(
//               /(\d{3})(\d{3})(\d{2})(\d{2})/,
//               "$1-$2-$3-$4"
//             )}
//           </span>
//         </section>
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Należność</span>
//           <span className="edit_doc--content">
//             {rowData?.NALEZNOSC
//               ? rowData.NALEZNOSC.toLocaleString("pl-PL", {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                   useGrouping: true,
//                 })
//               : ""}
//           </span>
//         </section>
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Nr konta do wpłaty:</span>
//           <span className="edit_doc--content">
//             {" "}
//             {formatAccountNumber(rowData.NR_KONTA)}
//           </span>
//         </section>
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Dział</span>
//           <span className="edit_doc--content">{rowData.DZIAL}</span>
//         </section>
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Osoba zlecająca</span>
//           <span className="edit_doc--content">
//             {rowData.OSOBA_ZLECAJACA_WINDYKACJE}
//           </span>
//         </section>
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Telefon</span>
//           <div className="edit_doc--content edit_basic_data_pro--contact">
//             {phone}
//           </div>
//         </section>
//         <section className="edit_doc__container">
//           <span className="edit_doc--title">Mail</span>
//           <div className="edit_doc--content edit_basic_data_pro--contact">
//             {mail}
//           </div>
//         </section>
//       </section>
//     );
//   } else return null;
// };

// export default EditBasicDataPro;

import "./EditBasicDataPro.css";

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return null;
  return amount.toLocaleString("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
};

const formatAccountNumber = (nr) => {
  if (!nr) return "";
  const first = nr.slice(0, 2);
  const rest =
    nr
      .slice(2)
      .match(/.{1,4}/g)
      ?.join(" ") || "";
  return `${first} ${rest}`;
};

const formatNip = (nip) => {
  if (!nip) return "";
  return nip.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1-$2-$3-$4");
};

// --- UNIWERSALNY WIERSZ DANYCH ---
const DataRow = ({
  title,
  children,
  contentClass = "edit_doc--content",
  style = {},
}) => {
  // Jeśli nie ma danych (null/undefined/pusty string), nie renderujemy sekcji
  if (children === null || children === undefined || children === "")
    return null;

  return (
    <section className="edit_doc__container">
      <span className="edit_doc--title">{title}</span>
      {/* Tu jest klucz: dynamiczna klasa pozwala na flex-column tam gdzie trzeba */}
      <span className={contentClass} style={style}>
        {children}
      </span>
    </section>
  );
};

// Pomocnik do styli scrollowania (dla długich tekstów)
const getScrollStyle = (text) => {
  if (text && text.length > 160) {
    return { overflowY: "auto", maxHeight: "100px", whiteSpace: "pre-line" };
  }
  return { whiteSpace: "pre-line" }; // Zachowuje łamanie linii w adresach
};

const EditBasicDataPro = ({ rowData, profile }) => {
  if (!rowData) return null;

  // --- WIDOK: PARTNER ---
  if (profile === "partner") {
    const itemsSettlements = (rowData?.WYKAZ_SPLACONEJ_KWOTY_FK ?? []).map(
      (item, index) => (
        <section
          key={index}
          className="edit_basic_data_pro__settlements_container"
        >
          <span>{item.data}</span>
          <span>{item.symbol}</span>
          <span>
            {item?.kwota ? (
              formatCurrency(item.kwota)
            ) : (
              <span style={{ color: "red" }}>Brak</span>
            )}
          </span>
        </section>
      )
    );

    return (
      <section className="edit_doc edit_doc_basic-data edit_basic_data_pro">
        <DataRow
          title="Data przekazania:"
          children={rowData.DATA_PRZEKAZANIA_SPRAWY}
        />
        <DataRow title="Faktura:" children={rowData.NUMER_DOKUMENTU} />

        {/* Tu używamy innej klasy contentClass zgodnie z oryginałem */}
        <DataRow
          title="Opis dokumentu:"
          contentClass="edit_basic_data_pro--content"
          children={rowData.OPIS_DOKUMENTU}
        />

        <DataRow
          title="Data wystawienia dok."
          children={rowData.DATA_WYSTAWIENIA_DOKUMENTU}
        />
        <DataRow
          title="Kwota brutto dok."
          children={formatCurrency(rowData.KWOTA_BRUTTO_DOKUMENTU)}
        />

        <DataRow
          title="Kwota roszczenia:"
          style={{ backgroundColor: "rgba(252, 255, 206, 1)" }}
          children={
            formatCurrency(rowData.KWOTA_ROSZCZENIA_DO_KANCELARII) || "0,00"
          }
        />

        <DataRow
          title="Kontrahent:"
          contentClass="edit_basic_data_pro--content"
          style={getScrollStyle(rowData.KONTRAHENT)}
          children={rowData.KONTRAHENT}
        />

        <DataRow title="NIP:" children={rowData.NIP} />

        {/* Specyficzny przypadek: ODDZIAŁ (zagnieżdżone spany) */}
        <DataRow
          title="Oddział:"
          contentClass="edit_doc--content _pro--content" // Klasa _pro--content robi flex-direction: column
        >
          <span className="edit_doc--content" style={{ border: "none" }}>
            {rowData?.ODDZIAL?.LOKALIZACJA}
          </span>
          <span className="edit_doc--content" style={{ border: "none" }}>{`${
            rowData?.ODDZIAL?.DZIAL || ""
          } ${rowData?.ODDZIAL?.OBSZAR || ""}`}</span>
        </DataRow>

        <DataRow
          title="Pozostała należność FK:"
          children={
            rowData.POZOSTALA_NALEZNOSC_FK ? (
              formatCurrency(rowData.POZOSTALA_NALEZNOSC_FK)
            ) : (
              <span style={{ color: "red" }}>Brak danych</span>
            )
          }
        />

        <DataRow
          title="Suma spłaconych kwot FK:"
          children={
            rowData.SUMA_SPLACONEJ_KWOTY_FK ? (
              formatCurrency(rowData.SUMA_SPLACONEJ_KWOTY_FK)
            ) : (
              <span style={{ color: "red" }}>Brak danych</span>
            )
          }
        />

        <section className="edit_doc__container">
          <section className="edit_basic_data_pro__settlements">
            <span className="edit_basic_data_pro__settlements--title">
              Wykaz spłaconych kwot
            </span>
            {itemsSettlements.length ? (
              itemsSettlements
            ) : (
              <span style={{ textAlign: "center", color: "red" }}>
                Brak wpłat
              </span>
            )}
          </section>
        </section>
      </section>
    );
  }

  // --- WIDOK: INSURANCE ---
  else if (profile === "insurance") {
    // Renderowanie listy telefonów/maili
    const renderContactList = (items, formatter = (val) => val) => {
      if (!items?.length) return null;
      return items.map((item, index) => (
        // Span zamiast diva, żeby nie psuć struktury, display block/flex wymuszony przez klasę rodzica
        <span key={index}>{formatter(item)}</span>
      ));
    };

    return (
      <section className="edit_doc edit_doc_basic-data edit_basic_data_pro">
        <DataRow title="Data przekazania" children={rowData.DATA_PRZEKAZANIA} />
        <DataRow title="Numer polisy" children={rowData.NUMER_POLISY} />
        <DataRow title="Ubezpieczyciel" children={rowData.UBEZPIECZYCIEL} />
        <DataRow title="Numer faktury" children={rowData.FAKTURA_NR} />
        <DataRow title="Termin płatności" children={rowData.TERMIN_PLATNOSCI} />

        <DataRow
          title="Kontrahent:"
          contentClass="edit_basic_data_pro--content"
          style={getScrollStyle(rowData.KONTRAHENT_NAZWA)}
          children={rowData.KONTRAHENT_NAZWA}
        />

        <DataRow
          title="Adres kontrahenta:"
          contentClass="edit_basic_data_pro--content"
          style={getScrollStyle(rowData.KONTRAHENT_ADRES)}
          children={rowData.KONTRAHENT_ADRES}
        />

        <DataRow title="NIP" children={formatNip(rowData.KONTRAHENT_NIP)} />
        <DataRow
          title="Należność"
          children={formatCurrency(rowData.NALEZNOSC)}
        />
        <DataRow
          title="Nr konta do wpłaty:"
          children={formatAccountNumber(rowData.NR_KONTA)}
        />
        <DataRow title="Dział" children={rowData.DZIAL} />
        <DataRow
          title="Osoba zlecająca"
          children={rowData.OSOBA_ZLECAJACA_WINDYKACJE}
        />

        {/* --- TUTAJ ROZWIĄZANIE TWOJEGO PROBLEMU --- */}
        {/* Dodajemy klasę 'edit_basic_data_pro--contact', która w Twoim CSS ma flex-direction: column */}

        <DataRow
          title="Telefon"
          contentClass="edit_doc--content edit_basic_data_pro--contact"
        >
          {renderContactList(rowData.KONTAKT_DO_KLIENTA?.TELEFON, (val) =>
            val.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")
          )}
        </DataRow>

        <DataRow
          title="Mail"
          contentClass="edit_doc--content edit_basic_data_pro--contact"
        >
          {renderContactList(rowData.KONTAKT_DO_KLIENTA?.MAIL)}
        </DataRow>
      </section>
    );
  }

  return null;
};

export default EditBasicDataPro;
