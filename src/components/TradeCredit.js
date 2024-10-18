import { useState } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import PleaseWait from "./PleaseWait";
import { Button } from "@mui/material";
import "./TradeCredit.css";
import { getExcelRaport } from "./utilsForCreditTrade/prepareExcelForTradeCredit";

const TradeCredit = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [pleaseWait, setPleaseWait] = useState(false);

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

  const generateRaport = async () => {
    try {
      setPleaseWait(true);
      const result = await axiosPrivateIntercept.get(
        `/documents/get-data-credit-trade`
      );

      const tradeCreditData = [...result.data.tradeCreditData];
      const areaCreditData = [...result.data.areaCreditData];

      // tablica z unikalnymi kontrahentami
      const newResult = uniqueContractor(tradeCreditData);

      // Wydobycie unikalnych wartości z klucza "segment"
      const uniqueSegments = [
        ...new Set(tradeCreditData.map((item) => item.segment)),
      ];

      const adjustLimit = (limit) => {
        if (limit === 0) return 0;
        if (limit < 10) return 10;
        if (limit < 100) return 100;
        if (limit < 500) return 500;

        // Zaokrąglanie w górę do najbliższej setki dla wartości poniżej 1000
        if (limit < 1000) return Math.ceil(limit / 100) * 100;

        // Zaokrąglanie w górę do najbliższego tysiąca dla wartości poniżej 10000
        if (limit <= 10000) return Math.ceil(limit / 100) * 100;

        // Zaokrąglanie w górę do najbliższego tysiąca dla wartości poniżej 100000
        if (limit <= 100000) return Math.ceil(limit / 1000) * 1000;

        // Zaokrąglanie w górę do najbliższej dziesiątki tysięcy dla wartości powyżej 100000
        if (limit > 100000) return Math.ceil(limit / 10000) * 10000;

        // Dla wartości od 10000 do 100000 bez zmian
        return limit;
      };

      // // tworzę tablicę z osobnymi danymi dla każdego segmentu
      const raportData = uniqueSegments.sort().map((item) => {
        const filteredData = tradeCreditData.filter(
          (doc) => doc.segment.toUpperCase() === item.toUpperCase()
        );
        return {
          item, // Nazwa segmentu
          data: filteredData, // Filtrowana tablica powiązanych danych
        };
      });

      // // tradeCreditDataa wszytskie dokumenty
      // // areaCreditData - dane uzupełnione przez obszary
      // // newResult - unikalni kontrahenci
      // // raportData - unikalne obszary z danymi

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
                (segment) =>
                  segment.kontrahent_nip === contractor.kontrahent_nip
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

              const formaPlatnWskazBiznes = contractor.kontrahent_nip
                ? transfer
                : "BRAK PRZELEWU";

              const termPlatnWskazBiznes =
                contractor.kontrahent_nip &&
                transfer === "PRZELEW" &&
                titleDaysPayment
                  ? titleDaysPayment
                  : "BRAK";

              const CzyBiznesZezwala =
                contractor.kontrahent_nip && transfer === "PRZELEW"
                  ? "TAK"
                  : "NIE";

              const iloscDni =
                contractor.kontrahent_nip && transfer === "PRZELEW"
                  ? Math.ceil(averageDayPayment / docCounter)
                  : 0;

              const dopuszczKredyt =
                contractor.kontrahent_nip && transfer === "PRZELEW"
                  ? Math.ceil(totalPurchases * 1.1) > 500
                    ? Math.ceil(totalPurchases * 1.1)
                    : 500
                  : 0;

              const creditLimit = (Math.ceil(totalPurchases) / 365) * iloscDni;
              const maxLimit = adjustLimit(creditLimit);

              return {
                "Numer klienta": String(contractor.kontrahent_id),
                "Nazwa kontrahenta": contractor.kontrahent_nazwa,
                "Nip kontrahenta": contractor.kontrahent_nip
                  ? contractor.kontrahent_nip
                  : "",
                Obszar: area,
                "Forma płatności -\nTeraz": contractor.kontrahent_nip
                  ? transfer
                  : "BRAK PRZELEWU",
                "Forma płatności -\nWskazuje Biznes": [
                  formaPlatnWskazBiznes,
                  false,
                ],
                "Obrót - 12 m-cy": Math.ceil(totalPurchases),

                "Ilość dni płatności opóźnionej": iloscDni,
                Limit: maxLimit,
              };
            }
            return null; // Zwróć null, jeśli nie ma filtrów
          })
          .filter(Boolean);

        return { name: raportItemName, data: prepareData };
      });

      // const test = raportData.map((item) => {
      //   for (const doc of item.data) {
      //     if (doc.segment === "F&I" && doc.kontrahent_nip === "5252800978") {
      //       console.log(doc);
      //     }
      //   }
      // });

      const columns = [
        "Lp",
        "Numer klienta",
        "Nazwa kontrahenta",
        "Nip kontrahenta",
        "Obszar",
        "Forma płatności -\nTeraz",
        "Forma płatności -\nWskazuje Biznes",
        "Obrót - 12 m-cy",

        // "Czy Biznes zezwala na płatność TAK/NIE",
        "Ilość dni płatności opóźnionej",
        "Limit",
        "Termin Płatności -\nWskazuje Biznes",
        "Komentarz Biznes -\nTermin",
        "Limit -\nnowy",
        "Podaj nowy limit",
        "Komentarz \nnowy limit",
      ];
      const generateNumber = raport.map((item) => {
        const preparedData = [...item.data];
        let counter = 1;
        console.log(item);

        const data = preparedData.map((doc) => {
          // console.log(doc);
          const filteredDoc = areaCreditData.filter((docFiltr) =>
            item.name === doc.Obszar && doc["Nip kontrahenta"]
              ? // docFiltr.area === doc.Obszar && doc["Nip kontrahenta"]
                docFiltr.kontr_nip === doc["Nip kontrahenta"]
              : docFiltr.kontr_nazwa === doc["Nazwa kontrahenta"]
          );

          // if (filteredDoc.length && filteredDoc.area === "F&I") {
          //   console.log(filteredDoc);
          // }
          // const test = areaCreditData.map((item) => {
          //   console.log(item);
          // });
          if (filteredDoc.length) {
            const firstFilteredDoc = filteredDoc[0] || {};
            const formaPltnosciBiznes =
              firstFilteredDoc.forma_plat === "PRZELEW"
                ? "PRZELEW"
                : firstFilteredDoc.forma_plat === "KOMPENSATA"
                ? "KOMPENSATA"
                : "BRAK PRZELEWU";
            return {
              ...doc,
              Lp: counter++,
              "Forma płatności -\nWskazuje Biznes": firstFilteredDoc.forma_plat
                ? [formaPltnosciBiznes, true]
                : doc["Forma płatności -\nWskazuje Biznes"],
              "Termin Płatności -\nWskazuje Biznes": firstFilteredDoc.ile_dni
                ? [firstFilteredDoc.ile_dni, true]
                : [null, false],
              "Komentarz Biznes -\nTermin": "",
              "Limit -\nnowy": "",
              "Podaj nowy limit": "",
              "Komentarz \nnowy limit": "",
            };
          } else {
            return doc;
          }
        });
        // console.log(data);
        return {
          name: item.name,
          data,
        };
      });

      const columnsContractor = [
        "Lp",
        "Numer klienta",
        "Nazwa kontrahenta",
        "Nip kontrahenta",
        "Obszar",
        "Forma płatności -\nWskazuje Biznes",
        "Termin Płatności -\nWskazuje Biznes",
        "Komentarz Biznes -\nTermin",
        "Podaj nowy limit",
        "Komentarz \nnowy limit",
      ];

      const newContractor = () => {
        const name = "NOWY KONTRAHENT";
        const data = Array.from({ length: 100 }, (_, index) => ({
          Lp: index + 1,
          "Numer klienta": "",
          "Nazwa kontrahenta": "",
          "Nip kontrahenta": "",
          Obszar: "",
          "Forma płatności -\nWskazuje Biznes": "",
          "Termin Płatności -\nWskazuje Biznes": "",
          "Komentarz Biznes -\nTermin": "",
          "Podaj nowy limit": "",
          "Komentarz \nnowy limit": "",
        }));
        return { name, data };
      };

      generateNumber.push(newContractor());
      console.log(generateNumber);

      getExcelRaport(generateNumber, columns, columnsContractor);

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
