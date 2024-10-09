import { useState } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import PleaseWait from "./PleaseWait";
import { Button } from "@mui/material";
import "./TradeCredit.css";
import { getExcelRaport } from "./utilsForCreditTrade/prepareExcelForTradeCredit";

const TradeCredit = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [pleaseWait, setPleaseWait] = useState(false);

  //   const uniqueContractor = (contractor) => {
  //     const mapByNip = new Map();
  //     const usedNames = new Set();
  //     const nullNipKontrahenci = [];

  //     contractor.forEach((item) => {
  //       const { kontrahent_nip, kontrahent_nazwa } = item;

  //       if (kontrahent_nip) {
  //         // Sprawdzamy, czy kontrahent_nazwa już nie występuje
  //         if (!usedNames.has(kontrahent_nazwa)) {
  //           // Dodajemy unikalne wpisy na podstawie kontrahent_nip, jeśli kontrahent_nazwa się nie powtarza
  //           if (!mapByNip.has(kontrahent_nip)) {
  //             mapByNip.set(kontrahent_nip, item);
  //             usedNames.add(kontrahent_nazwa); // Oznaczamy nazwę jako wykorzystaną
  //           }
  //         }
  //       } else {
  //         // Zbieramy obiekty z null w kontrahent_nip
  //         nullNipKontrahenci.push(item);
  //       }
  //     });

  //     // Filtrujemy obiekty z kontrahent_nip === null, by były unikalne na podstawie kontrahent_nazwa i kontrahent_adres
  //     const uniqueNullNipKontrahenci = [];
  //     const setByNameAndAddress = new Set();

  //     nullNipKontrahenci.forEach((item) => {
  //       const { kontrahent_nazwa, kontrahent_adres } = item;
  //       const key = `${kontrahent_nazwa}-${kontrahent_adres}`;

  //       if (!setByNameAndAddress.has(key) && !usedNames.has(kontrahent_nazwa)) {
  //         setByNameAndAddress.add(key);
  //         uniqueNullNipKontrahenci.push(item);
  //         usedNames.add(kontrahent_nazwa); // Oznaczamy nazwę jako wykorzystaną
  //       }
  //     });

  //     // Łączymy wyniki z obu filtracji
  //     const uniqueKontrahenci = [
  //       ...Array.from(mapByNip.values()),
  //       ...uniqueNullNipKontrahenci,
  //     ];

  //     // Zwracamy tylko wybrane klucze
  //     return uniqueKontrahenci.map(
  //       ({ kontrahent_nazwa, kontrahent_nip, kontrahent_id }) => ({
  //         kontrahent_nazwa,
  //         kontrahent_nip,
  //         kontrahent_id,
  //       })
  //     );
  //   };

  const uniqueContractor = (contractor) => {
    const mapByNip = new Map();
    const usedNames = new Set();
    const nullNipKontrahenci = [];

    contractor.forEach((item) => {
      const { kontrahent_nip, kontrahent_nazwa } = item;

      // Sprawdzamy, czy kontrahent_nazwa jest poprawna (nie jest "#NAZWA?")
      if (kontrahent_nazwa && kontrahent_nazwa !== "#NAZWA?") {
        if (kontrahent_nip) {
          // Sprawdzamy, czy kontrahent_nazwa już nie występuje
          if (!usedNames.has(kontrahent_nazwa)) {
            // Dodajemy unikalne wpisy na podstawie kontrahent_nip, jeśli kontrahent_nazwa się nie powtarza
            if (!mapByNip.has(kontrahent_nip)) {
              mapByNip.set(kontrahent_nip, item);
              usedNames.add(kontrahent_nazwa); // Oznaczamy nazwę jako wykorzystaną
            }
          }
        } else {
          // Zbieramy obiekty z null w kontrahent_nip
          nullNipKontrahenci.push(item);
        }
      }
    });

    // Filtrujemy obiekty z kontrahent_nip === null, by były unikalne na podstawie kontrahent_nazwa i kontrahent_adres
    const uniqueNullNipKontrahenci = [];
    const setByNameAndAddress = new Set();

    nullNipKontrahenci.forEach((item) => {
      const { kontrahent_nazwa, kontrahent_adres } = item;
      const key = `${kontrahent_nazwa}-${kontrahent_adres}`;

      if (
        kontrahent_nazwa &&
        kontrahent_nazwa !== "#NAZWA?" && // Sprawdzamy, czy nazwa nie jest "#NAZWA?"
        !setByNameAndAddress.has(key) &&
        !usedNames.has(kontrahent_nazwa)
      ) {
        setByNameAndAddress.add(key);
        uniqueNullNipKontrahenci.push(item);
        usedNames.add(kontrahent_nazwa); // Oznaczamy nazwę jako wykorzystaną
      }
    });

    // Łączymy wyniki z obu filtracji
    const uniqueKontrahenci = [
      ...Array.from(mapByNip.values()),
      ...uniqueNullNipKontrahenci,
    ];

    // Zwracamy tylko wybrane klucze
    return uniqueKontrahenci.map(
      ({ kontrahent_nazwa, kontrahent_nip, kontrahent_id }) => ({
        kontrahent_nazwa,
        kontrahent_nip,
        kontrahent_id,
      })
    );
  };

  const platnoscPowyzejIluDni = 3;

  const generateRaport = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get(
        `/documents/get-data-credit-trade`
      );

      // tablica z unikalnymi kontrahentami
      const newResult = uniqueContractor(result.data);

      //   Wydobycie unikalnych wartości z klucza "segment"
      const uniqueSegments = [
        ...new Set(result.data.map((item) => item.segment)),
      ];

      // tworzę tablicę z osobnymi danymi dla każdego segmentu
      const raportData = uniqueSegments.sort().map((item) => {
        const filteredData = result.data.filter(
          (doc) => doc.segment.toUpperCase() === item.toUpperCase()
        );
        return {
          item, // Nazwa segmentu
          data: filteredData, // Filtrowana tablica powiązanych danych
        };
      });

      // result.data wszytskie dokumenty
      // newResult - unikalni kontrahenci
      // raportData - unikalne obszary z danymi

      const daysPayment = [
        { first: 0, last: 7, title: "0 - 7" },
        { first: 8, last: 14, title: "8 - 14" },
        { first: 15, last: 30, title: "15 - 30" },
        { first: 31, last: 90, title: "31 - 90" },
        { first: 91, last: 180, title: "91 - 180" },
        { first: 181, last: 360, title: "181 - 360" },
      ];

      const raport = raportData.map((item) => {
        const raportItemName = item.item;
        const raportItemData = [...item.data];

        const prepareData = newResult
          .map((contractor) => {
            let filteredSegment = [];
            if (contractor.kontrahent_nip) {
              filteredSegment = raportItemData.filter(
                (segment) => segment.kontrahent_id === contractor.kontrahent_id
              );
            } else {
              filteredSegment = raportItemData.filter(
                (segment) =>
                  segment.kontrahent_nazwa === contractor.kontrahent_nazwa
              );
            }

            if (filteredSegment.length > 0) {
              let docCounter = 0;
              let area = "";
              let transfer = "BRAK PRZELEWU";
              let averageDayPayment = 0;
              let totalPurchases = 0;

              for (const doc of filteredSegment) {
                docCounter++;
                area = doc.segment;
                averageDayPayment += doc.days_difference; // Suma dni
                totalPurchases += doc.brutto;
                if (doc.sposob_zaplaty === "PRZELEW") {
                  transfer = "PRZELEW";
                }
              }

              // Oblicz średnią
              const foundPayment = daysPayment.find((payment) => {
                const roundedValue = Math.ceil(averageDayPayment / docCounter); // Zaokrąglenie w górę
                return (
                  roundedValue >= payment.first && roundedValue <= payment.last
                );
              });

              // Przypisanie title do zmiennej titleDaysPayment, jeśli znalazł odpowiedni zakres
              const titleDaysPayment = foundPayment ? foundPayment.title : null;

              return {
                "Numer klienta": String(contractor.kontrahent_id),
                "Nazwa kontrahenta": contractor.kontrahent_nazwa,
                "Nip kontrahenta": contractor.kontrahent_nip
                  ? contractor.kontrahent_nip
                  : "",
                Obszar: area,
                "Forma płatności - Teraz": contractor.kontrahent_nip
                  ? transfer
                  : "BRAK PRZELEWU",
                "Forma płatności - Wskazuje Biznes": contractor.kontrahent_nip
                  ? transfer
                  : "BRAK PRZELEWU",
                "Termin Płatności - Wskazuje Biznes":
                  contractor.kontrahent_nip &&
                  transfer === "PRZELEW" &&
                  titleDaysPayment
                    ? titleDaysPayment
                    : "BRAK",
                "Czy Biznes zezwala na płatność TAK/NIE":
                  contractor.kontrahent_nip && transfer === "PRZELEW"
                    ? "TAK"
                    : "NIE",
                "Ilość dni płatności opóźnionej":
                  contractor.kontrahent_nip && transfer === "PRZELEW"
                    ? Math.ceil(averageDayPayment / docCounter)
                    : 0,
                "Dopuszczalny kredyt - Wskazuje Biznes":
                  contractor.kontrahent_nip && transfer === "PRZELEW"
                    ? Math.ceil(totalPurchases * 1.1) > 500
                      ? Math.ceil(totalPurchases * 1.1)
                      : 500
                    : 0,
                Saldo: Math.ceil(totalPurchases),
                "Klient nienazwany": filteredSegment.length > 0 ? "TAK" : "NIE",
              };
            }
            return null; // Zwróć null, jeśli nie ma filtrów
          })
          .filter(Boolean);

        return { name: raportItemName, data: prepareData };
      });

      const columns = [
        "Lp",
        "Numer klienta",
        "Nazwa kontrahenta",
        "Nip kontrahenta",
        "Obszar",
        "Forma płatności - Teraz",
        "Forma płatności - Wskazuje Biznes",
        "Termin Płatności - Wskazuje Biznes",
        "Czy Biznes zezwala na płatność TAK/NIE",
        "Ilość dni płatności opóźnionej",
        "Dopuszczalny kredyt - Wskazuje Biznes",
        "Saldo",
        "Klient nienazwany",
        // "Obecnie zgoda na płatności opóźnione",
        // "Ile wystawiona faktur",
        // "Ile wystawiono faktur - Przelew",
        // "Średnia dni na płatność",
        // "Ilość dni płatności opóźnionej",
        // `Ile faktur zapłacono powyżej dni - ${platnoscPowyzejIluDni}`,
        // `Sugerowana zgoda na na przelew (Nie, jeśli 3 fv powyżej ${platnoscPowyzejIluDni} dni)`,
        // "Suma zakupów",
        // "Przyznany kredyt - 10% sumy zakupów",
      ];

      const generateNumber = raport.map((item) => {
        const preparedData = [...item.data];
        let counter = 1;
        const data = preparedData.map((doc) => {
          return {
            Lp: counter++,
            ...doc,
          };
        });
        // console.log(data);
        return {
          name: item.name,
          data,
        };
      });

      console.log(generateNumber);

      getExcelRaport(generateNumber, columns);

      console.log("finish");

      setPleaseWait(false);
    } catch (err) {
      setPleaseWait(false);
      console.error(err);
    }
  };

  return (
    <>
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <section className="trade-credit">
          <section className="trade-credit__container">
            <h1>Kredyt Kupiecki</h1>
            <Button
              className="mui-button"
              variant="contained"
              size="large"
              color="success"
              onClick={generateRaport}
            >
              Generuj
            </Button>
          </section>
        </section>
      )}
    </>
  );
};

export default TradeCredit;
