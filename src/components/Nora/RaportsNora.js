import { useState } from "react";
import PleaseWait from "../PleaseWait";
import { isExcelFile } from "../utilsForExcel/isExcelFile";
import * as XLSX from "xlsx";
import { getExcelRaport } from "./utilsForExcel/prepareExcelFile";

import "./RaportsNora.css";

const RaportsNora = () => {
  const [errCodeRaport, setErrCodeRaport] = useState("");
  const [pleaseWait, setPleaseWait] = useState(false);

  const message = {
    prepare: "Przygotowywanie danych.",
    progress: "Trwa dopasowywanie danych.",
    error: "Nastąpił bład.",
    finish: "Dokumenty zaktualizowane",
    errorExcelFile: "Nieprawidłowy plik. Proszę przesłać plik Excel.",
    errorXLSX: "Akceptowany jest tylko plik z rozszerzeniem .xlsx",
    errorData: "Nieprawidłowe dane w pliku.",
    saveToDB: "Zapis do bazy danych - proszę czekać ...",
    successRaport: "Raport wygenerowano poprawnie.",
  };

  // funkcja zamienia dane z pliku excel na json
  const decodeExcelFile = (file, type, setErrCodeRaport) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;

        const uint8Array = new Uint8Array(arrayBuffer);

        // Sprawdzenie, czy plik jest prawidłowym plikiem Excel
        if (!isExcelFile(uint8Array)) {
          setPleaseWait(false);

          if (type === "postCode") {
            return setErrCodeRaport(message.errorExcelFile);
          }
          return;
        }
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleSendFile = async (e, type) => {
    setPleaseWait(true);
    const file = e.target.files[0];
    if (!file) return console.error("Brak pliku");
    if (!file.name.endsWith(".xlsx")) {
      setPleaseWait(false);
      if (type === "postCode") {
        return setErrCodeRaport(message.errorXLSX);
      }
    }
    try {
      const decodedFile = await decodeExcelFile(file, type, setErrCodeRaport);

      // Pobieramy nagłówki kolumn z pierwszego wiersza
const headers = Object.keys(decodedFile[0]);

// Lista wymaganych nagłówków
const requiredHeaders = [
  "Oddział",
  "kontrahent",
  "nip",
  "kod pocztowy",
  "miasto",
  "k_adres",
  // "Opiekun D.CZ ASO"
];

// Sprawdzamy, czy wszystkie wymagane nagłówki są obecne
const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));

if (missingHeaders.length > 0) {
  setPleaseWait(false);
  return setErrCodeRaport(`Brakuje następujących nagłówków: ${missingHeaders.join(', ')}`);
}
      // if (
      //   !("Oddział" in decodedFile[0]) ||
      //   !("kontrahent" in decodedFile[0]) ||
      //   !("nip" in decodedFile[0]) ||
      //   !("kod pocztowy" in decodedFile[0]) ||
      //   !("miasto" in decodedFile[0]) ||
      //   !("k_adres" in decodedFile[0]) ||
      //   !("Opiekun D.CZ ASO" in decodedFile[0])
      // ) {
      //   setPleaseWait(false);

      //   return setErrCodeRaport(message.errorData);
      // }
      const postCode = {
        0: "0x-xxx",
        1: "1x-xxx",
        2: "2x-xxx",
        3: "3x-xxx",
        4: "4x-xxx",
        5: "5x-xxx",
        6: "6x-xxx",
        7: "7x-xxx",
        8: "8x-xxx",
        9: "9x-xxx",
      };
      const trimSpacesFromArrayObjects = (array) => {
        return array.map((item) => {
          // Create a new object with trimmed keys
          const trimmedItem = {};
          Object.keys(item).forEach((key) => {
            // Trim spaces from each key and assign the value to the new object
            const trimmedKey = key.trim();
            trimmedItem[trimmedKey] = item[key];
          });
          return trimmedItem;
        });
      };

      // Process finalArray to trim spaces in key names
      const removeEmptySpace = trimSpacesFromArrayObjects(decodedFile);

      // pobieram wszytskie unilane rozliczenia dla każdego miesiąca i roku
      const uniqueKeys = new Set();
      removeEmptySpace.forEach((item) => {
        Object.keys(item).forEach((key) => {
          const trimmedKey = key.trim();
          if (/^M\.\d{2}_R\.\d{4}$/.test(trimmedKey)) {
            uniqueKeys.add(trimmedKey);
          }
        });
      });

      // grupuję wg lat
      const groupedByYear = Array.from(uniqueKeys).reduce((acc, key) => {
        const yearMatch = key.match(/R\.(\d{4})$/);
        if (yearMatch) {
          const year = yearMatch[1];
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push(key);
        }
        return acc;
      }, {});

      // sortuję wg lat i miesięcy
      const resultArray = Object.entries(groupedByYear)
        .map(([year, data]) => {
          const sortedData = data.sort((a, b) => {
            const monthA = parseInt(a.match(/^M\.(\d{2})_/)[1], 10);
            const monthB = parseInt(b.match(/^M\.(\d{2})_/)[1], 10);
            return monthA - monthB;
          });

          return {
            year: parseInt(year, 10),
            data: sortedData,
          };
        })
        .sort((a, b) => a.year - b.year);

      // Fszukam bieżącego roku
      const currentYear = new Date().getFullYear();

      // usuwam pozostałe misięce z wcześniejszych lat, żeby było tak jak w roku bieżącym
      const finalResultArray = resultArray.map((item) => {
        if (item.year === currentYear) {
          // For the current year, keep data unchanged
          return { year: item.year, data: item.data };
        } else {
          // For other years, limit data to the first 7 elements
          const updatedData = item.data.slice(0, 7);
          return { year: item.year, data: updatedData };
        }
      });

      // grupuje dane wg kodu pocztowego, i sumuję poszczególne miesiące
      // const groupedData = removeEmptySpace.reduce((acc, item) => {
      //   const kod = item.kod;
      //   // const name = postCode[kod] || "Inne";
      //   const name = postCode[kod];

      //   if (!acc[name]) {
      //     acc[name] = [];
      //   }
      //   acc[name].push(item);

      //   return acc;
      // }, {});
      const groupedData = removeEmptySpace.reduce((acc, item) => {
        const kod = item.kod;

        // Sprawdzanie, czy kod pocztowy istnieje w postCode
        if (postCode.hasOwnProperty(kod)) {
          const name = postCode[kod];

          if (!acc[name]) {
            acc[name] = [];
          }
          acc[name].push(item);
        }

        return acc;
      }, {});

      // Converting the grouped data into an array format with name and data keys
      const finalArray = Object.entries(groupedData).map(([name, data]) => ({
        name,
        data,
      }));

      //kolejnośc kolumn oraz te co mają byc zachowane z orygilnalnego pliku
      const orderColumn=[
        "Oddział",
        "kontrahent",
        "nip",
        "kod pocztowy",
        "miasto",
        "k_adres",
        "Opiekun D.CZ ASO",
      ];

      const allowedKeys = [
     ...orderColumn
      ];
      const allowedKeysYear = [];

      const updatedFinalArray = finalArray.map(({ name, data }) => {
        // Update each data item
        const updatedData = data.map((item) => {
          // Create a new object to store the original and new keys
          let newItem = { ...item };
          // Add the "Suma_year" keys
          finalResultArray.forEach(({ year, data: keys }) => {
            // const sumaKey = `Suma_${year}`;
            let suma = 0;

            keys.forEach((key) => {
              let value = item[key];

              if (typeof value === "string") {
                value = parseFloat(value);
              }
              if (typeof value === "number" && !isNaN(value)) {
                suma += value;
              }
            });

            // newItem[sumaKey] = suma;
            newItem[year] = suma;
            if (!allowedKeysYear.includes(year)) {
              // if (!allowedKeysYear.includes(year) && String(year) !== "Inne") {
              allowedKeysYear.push(year);
            }

            if (!allowedKeys.includes(String(year))) {
              // if (
              //   !allowedKeys.includes(String(year)) &&
              //   String(year) !== "Inne"
              // ) {

              allowedKeys.push(String(year));
            }
          });

          return newItem;
        });

        return { name, data: updatedData };
      });

      // Sortowanie tablicy według klucza 'name'
      const sortedArray = updatedFinalArray.sort((a, b) => {
        if (a.name < b.name) {
          return -1; // a powinno być przed b
        }
        if (a.name > b.name) {
          return 1; // a powinno być po b
        }
        return 0; // a i b są równe
      });
      const filterKeys = (array, keys) => {
        return array.map((item) => {
          // Create a new object with only allowed keys for each item
          const filteredItem = {
            name: item.name,
            data: item.data.map((dataObj) => {
              // Create a new object with only allowed keys for each data object
              const filteredDataObj = {};
              Object.keys(dataObj).forEach((key) => {
                if (keys.includes(key.trim())) {
                  filteredDataObj[key.trim()] = dataObj[key];
                }
              });
              return filteredDataObj;
            }),
          };
          return filteredItem;
        });
      };
      const cleanData = filterKeys(sortedArray, allowedKeys);

      // Największa wartość w allowedKeysYear
      const maxKey = Math.max(...allowedKeysYear);

      const newKeys = allowedKeysYear
        .filter((year) => year !== maxKey) // Filtrujemy największy rok
        .flatMap((year) => [
          {
            name: year,
            newName: `${maxKey} - ${year}`, // Różnica między największym rokiem a bieżącym
            maxKey: maxKey,
            type: "minus", // Dodajemy klucz type
          },
          {
            name: year,
            newName: `${maxKey} / ${year} %`, // Procentowy stosunek
            maxKey: maxKey,
            type: "percentage", // Dodajemy klucz type
          },
        ]);

      // Aktualizacja cleanData na podstawie newKeys
      cleanData.forEach((item) => {
        item.data.forEach((dataObject) => {
          newKeys.forEach((newKey) => {
            const currentYearValue = dataObject[newKey.name] || 0;
            const maxCurrentYearValue = dataObject[newKey.maxKey] || 0;
            let newValue;

            if (newKey.type === "minus") {
              newValue = Number(
                (maxCurrentYearValue - currentYearValue).toFixed(2)
              );
            } else if (newKey.type === "percentage") {
              newValue =
                currentYearValue === 0 || maxCurrentYearValue === 0
                  ? 0
                  : Number(
                      (
                        ((maxCurrentYearValue - currentYearValue) /
                          currentYearValue) *
                        100
                      ).toFixed(2)
                    );
            }
            // console.log(typeof newKey.newName);

            if (!allowedKeys.includes(newKey.newName)) {
              const keyStr = String(newKey.name);
              const index = allowedKeys.indexOf(keyStr);

              if (index !== -1) {
                // Dodaj nowy element zaraz po istniejącym
                allowedKeys.splice(index + 1, 0, newKey.newName);
              } else {
                // Jeśli element nie istnieje, po prostu dodaj na końcu
                allowedKeys.push(newKey.newName);
              }
            }
            dataObject[newKey.newName] = newValue;
          });
        });
      });
      setErrCodeRaport(message.successRaport);

      getExcelRaport(cleanData, allowedKeys, newKeys, orderColumn);

      setPleaseWait(false);
    } catch (err) {
      console.error(err);
    }
  };

  return pleaseWait ? (
    <PleaseWait />
  ) : (
    <section className="raports_nora">
      <section className="raports_nora__container">
        <section className="raports_nora__container--title">
          <p>Raporty Nora</p>
        </section>
        <section className="raports_nora__container--data">
          {!errCodeRaport ? (
            <section className="raports_nora__container-documents">
              <input
                type="file"
                name="uploadfile"
                id="sharepoint"
                style={{ display: "none" }}
                onChange={(e) => handleSendFile(e, "postCode")}
              />
              <label htmlFor="sharepoint" className="add_data_file-click-me">
                Prześlij plik RaportNora dla kodów pocztowych
              </label>
            </section>
          ) : (
            <section className="raports_nora__container-documents">
              <span className="add_data_file-click-me">{errCodeRaport}</span>
            </section>
          )}
        </section>
      </section>
    </section>
  );
};

export default RaportsNora;
