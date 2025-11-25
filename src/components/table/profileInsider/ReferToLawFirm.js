import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import "./ReferToLawFirm.css";

// Funkcja pomocnicza do formatowania liczby do wyświetlenia
const formatAmount = (value) => {
  if (value === null || value === undefined || value === "") {
    return ""; // Pusty string, jeśli wartość jest pusta
  }
  // Próbujemy parsować wartość jako liczbę, potem formatujemy
  const num = parseFloat(String(value).replace(",", ".")); // Upewnij się, że kropka jest używana do parsowania
  if (isNaN(num)) {
    return String(value); // Jeśli nie jest liczbą, zwróć oryginalny string
  }
  return num.toLocaleString("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
};

// Funkcja pomocnicza do parsowania sformatowanego stringu na liczbę
const parseFormattedAmount = (formattedString) => {
  // Usuń spacje (separator tysięcy) i zamień przecinek na kropkę
  const cleanString = formattedString.replace(/\s/g, "").replace(",", ".");
  const num = parseFloat(cleanString);
  return isNaN(num) ? 0 : num; // Zwróć 0, jeśli nie jest prawidłową liczbą
};

const ReferToLawFirm = ({
  rowData,
  lawPartner,
  handleAddNote,
  lawFirmData,
  setLawFirmData,
}) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  // Używamy dodatkowego stanu do przechowywania sformatowanej wartości do wyświetlenia w input
  const [displayKwotaRoszczenia, setDisplayKwotaRoszczenia] = useState("");

  const handleKwotaRoszczeniaChange = (e) => {
    const inputValue = e.target.value;
    // Aktualizujemy wyświetlaną wartość (może być niepoprawnie sformatowana, gdy użytkownik wpisuje)
    setDisplayKwotaRoszczenia(inputValue);
  };

  const handleKwotaRoszczeniaBlur = (e) => {
    const inputValue = e.target.value;
    const parsedValue = parseFormattedAmount(inputValue);

    setLawFirmData((prev) => ({
      ...prev,
      kwotaRoszczenia: parsedValue, // Zapisz sparsowaną liczbę
    }));
    // Po blurze, formatujemy wartość i ustawiamy ją z powrotem w input
    setDisplayKwotaRoszczenia(formatAmount(parsedValue));
  };

  const handleAccept = () => {
    handleAddNote("Przekazano do kancelarii:", lawFirmData.kancelaria);
    setLawFirmData((prev) => {
      return {
        ...prev,
        zapisz: true,
      };
    });
  };

  // const getData = async () => {
  //   try {
  //     console.log("kontrahent");
  //     // const contractorData = await axiosPrivateIntercept.get(
  //     //   `/law-partner/get-contractor-data/${encodeURIComponent(
  //     //     rowData.NUMER_FV
  //     //   )}`
  //     // );
  //     // console.log(contractorData.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    const initialKwota = rowData.DO_ROZLICZENIA || 0;
    setLawFirmData((prev) => ({
      ...prev,
      kwotaRoszczenia: initialKwota,
    }));
    setDisplayKwotaRoszczenia(formatAmount(initialKwota));
    // getData();
  }, []);

  return (
    <section className="edit_doc">
      <span className="edit-doc-chat--title refer_to_law_firm--title">
        Przekaż sprawę do zewnętrznej kancelarii
      </span>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Faktura:</span>
        <span className="edit_doc--content">{lawFirmData.numerFv}</span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Kontrahent:</span>
        <span
          className={
            lawFirmData?.kontrahent?.length > 240
              ? "refer_to_law_firm--content-scroll"
              : "refer_to_law_firm--content"
          }
          style={
            lawFirmData?.kontrahent?.length > 240
              ? { overflowY: "auto", maxHeight: "160px" }
              : null
          }
        >
          {lawFirmData.kontrahent}
        </span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">NIP:</span>
        <span className="edit_doc--content">{rowData.NIP}</span>
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Kwota roszczenia:</span>
        <input
          className="edit_doc--content"
          type="text" // Zmieniamy na type="text"
          value={displayKwotaRoszczenia} // Wyświetlamy sformatowany string
          onChange={handleKwotaRoszczeniaChange}
          onBlur={handleKwotaRoszczeniaBlur} // Dodajemy handler na utratę focusu
          // style={{ backgroundColor: "rgba(248, 255, 152, .6)" }} // Odkomentuj, jeśli potrzebujesz
        />
      </section>
      <section className="edit_doc__container">
        <span className="edit_doc--title">Wybierz kancelarię:</span>
        <select
          className="edit_doc--select"
          value={lawFirmData?.kancelaria ? lawFirmData.kancelaria : ""}
          label="Wybierz kancelarię"
          onChange={(e) => {
            setLawFirmData((prev) => {
              return {
                ...prev,
                kancelaria: e.target.value,
              };
            });
          }}
        >
          <option value="" disabled hidden>
            -- Wybierz kancelarię --
          </option>

          {lawPartner.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </section>
      <section className="refer_to_law_firm--panel">
        <Button
          className="mui-button"
          variant="contained"
          size="medium"
          //   disabled={!(lawFirmData.kancelaria && lawFirmData.kwotaRoszczenia > 0)}
          disabled={
            lawFirmData.zapisz === true ||
            !(lawFirmData.kancelaria && lawFirmData.kwotaRoszczenia > 0)
          }
          onClick={handleAccept}
        >
          Wprowadź
        </Button>
      </section>
    </section>
  );
};

export default ReferToLawFirm;
