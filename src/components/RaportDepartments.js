import { useState, useEffect, useMemo, useCallback } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from "./hooks/useData";
import useWindowSize from "./hooks/useWindow";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_PL } from "material-react-table/locales/pl";
import PleaseWait from "./PleaseWait";
import * as xlsx from "xlsx";

import "./RaportDepartments.css";

const RaportDepartments = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { pleaseWait, setPleaseWait, auth } = useData();
  const { height } = useWindowSize();

  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnSizing, setColumnSizing] = useState({});
  const [density, setDensity] = useState("");
  const [columnOrder, setColumnOrder] = useState([]);
  const [columnPinning, setColumnPinning] = useState({});
  const [tableSize, setTableSize] = useState(400);
  const [raportData, setRaportData] = useState([]);
  const [permission, setPermission] = useState("");
  const [departments, setDepartments] = useState([]);
  const [raport, setRaport] = useState([]);
  const [minMaxDateGlobal, setMinMaxDateGlobal] = useState({
    minGlobalDate: "",
    maxGlobalDate: "",
  });
  const [raportDate, setRaportDate] = useState({
    minRaportDate: "",
    maxRaportDate: "",
  });
  const [errRaportDate, errSetRaportDate] = useState(false);

  const muiTableBodyCellProps = useMemo(() => {
    return {
      align: "center",
      sx: {
        backgroundColor: "#fff",
        borderRight: "1px solid #000",
        borderBottom: "1px solid #000",
        fontSize: "14px",
        fontWeight: "bold",
        padding: "2px",
        minHeight: "3rem",
      },
    };
  }, []);

  const departmentsObjective = {
    time: {
      Q: 2,
    },
    departments: {
      Całość: "",
      D08: 28,
      D38: 28,
      "D48/D58": 28,
      "D68/D78": 28,
      D88: 28,
      D98: 28,
      "D118/D148": 21,
      "D308/D318": 28,
    },
  };

  const checkMinMaxDateGlobal = (documents) => {
    let maxDate = documents[0].DATA_FV;
    let minDate = documents[0].DATA_FV;

    // Iteracja przez wszystkie obiekty w tablicy;
    documents.forEach((obj) => {
      // Porównanie daty z aktualnymi maksymalną i minimalną datą
      if (obj.DATA_FV > maxDate) {
        maxDate = obj.DATA_FV;
      }
      if (obj.DATA_FV < minDate) {
        minDate = obj.DATA_FV;
      }
    });
    setMinMaxDateGlobal({
      minGlobalDate: minDate,
      maxGlobalDate: maxDate,
    });
    setRaportDate({
      minRaportDate: minDate,
      maxRaportDate: maxDate,
    });
  };

  // w przypadku jeśli Asystentka widzi wiecej niż jeden działa dodawany jest kolejny wiersz "Całość" jako łączny wynik działów które widzi
  const addedAllToRaports = (generatingRaport) => {
    if (generatingRaport.length > 1) {
      const sumOfAllItems = generatingRaport.reduce(
        (acc, currentItem) => {
          acc.ILOSC_NIEROZLICZONYCH_FV += currentItem.ILOSC_NIEROZLICZONYCH_FV;
          acc.ILOSC_PRZETERMINOWANYCH_FV +=
            currentItem.ILOSC_PRZETERMINOWANYCH_FV;
          acc.ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4 +=
            currentItem.ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4;
          acc.PRZETERMINOWANE_FV += currentItem.PRZETERMINOWANE_FV;
          acc.PRZETERMINOWANE_BEZ_PZU_LINK4 +=
            currentItem.PRZETERMINOWANE_BEZ_PZU_LINK4;
          acc.NIEPRZETERMINOWANE_FV += currentItem.NIEPRZETERMINOWANE_FV;
          acc.NIEPRZETERMINOWANE_FV_BEZ_PZU_LINK4 +=
            currentItem.NIEPRZETERMINOWANE_FV_BEZ_PZU_LINK4;
          acc.CALKOWITA_WARTOSC_FV_BRUTTO +=
            currentItem.CALKOWITA_WARTOSC_FV_BRUTTO;
          acc.KWOTA_NIEROZLICZONYCH_FV += currentItem.KWOTA_NIEROZLICZONYCH_FV;
          acc.PRZETERMINOWANE_KANCELARIA +=
            currentItem.PRZETERMINOWANE_KANCELARIA;
          acc.ILOSC_FV_KANCELARIA += currentItem.ILOSC_FV_KANCELARIA;
          acc.ILOSC_PRZETERMINOWANYCH_FV_BEZ_KANCELARII +=
            currentItem.ILOSC_PRZETERMINOWANYCH_FV_BEZ_KANCELARII;
          acc.NIEPRZETERMINOWANE_FV_BEZ_KANCELARII +=
            currentItem.NIEPRZETERMINOWANE_FV_BEZ_KANCELARII;
          acc.PRZETERMINOWANE_BEZ_KANCELARII +=
            currentItem.PRZETERMINOWANE_BEZ_KANCELARII;
          acc.ILE_NIEPOBRANYCH_VAT += currentItem.ILE_NIEPOBRANYCH_VAT;
          acc.KWOTA_NIEPOBRANYCH_VAT += currentItem.KWOTA_NIEPOBRANYCH_VAT;
          acc.ILE_BLEDOW_DORADCY_I_DOKUMENTACJI +=
            currentItem.ILE_BLEDOW_DORADCY_I_DOKUMENTACJI;
          acc.KWOTA_BLEDOW_DORADCY_I_DOKUMENTACJI +=
            currentItem.KWOTA_BLEDOW_DORADCY_I_DOKUMENTACJI;

          return acc;
        },
        {
          ILOSC_NIEROZLICZONYCH_FV: 0,
          ILOSC_PRZETERMINOWANYCH_FV: 0,
          ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4: 0,
          PRZETERMINOWANE_FV: 0,
          PRZETERMINOWANE_BEZ_PZU_LINK4: 0,
          NIEPRZETERMINOWANE_FV: 0,
          NIEPRZETERMINOWANE_FV_BEZ_PZU_LINK4: 0,
          CALKOWITA_WARTOSC_FV_BRUTTO: 0,
          KWOTA_NIEROZLICZONYCH_FV: 0,
          PRZETERMINOWANE_KANCELARIA: 0,
          ILOSC_FV_KANCELARIA: 0,
          ILOSC_PRZETERMINOWANYCH_FV_BEZ_KANCELARII: 0,
          NIEPRZETERMINOWANE_FV_BEZ_KANCELARII: 0,
          PRZETERMINOWANE_BEZ_KANCELARII: 0,
          ILE_NIEPOBRANYCH_VAT: 0,
          KWOTA_NIEPOBRANYCH_VAT: 0,
          ILE_BLEDOW_DORADCY_I_DOKUMENTACJI: 0,
          KWOTA_BLEDOW_DORADCY_I_DOKUMENTACJI: 0,
        }
      );

      const expiredPaymentsValue = sumOfAllItems.PRZETERMINOWANE_FV;
      const notExpiredPaymentValue = sumOfAllItems.NIEPRZETERMINOWANE_FV;
      // Oblicz wartość Objective - cel całość
      //zabezpieczenie przed dzieleniem przez zero
      let objective = 0;
      if (notExpiredPaymentValue + expiredPaymentsValue !== 0) {
        objective =
          (expiredPaymentsValue /
            (notExpiredPaymentValue + expiredPaymentsValue)) *
          100;
      }
      sumOfAllItems.CEL_CALOSC = objective;

      const expiredPaymentsWithoutPandLValue =
        sumOfAllItems.PRZETERMINOWANE_BEZ_PZU_LINK4;
      const notExpiredPaymentWithoutPandLValue =
        sumOfAllItems.NIEPRZETERMINOWANE_FV_BEZ_PZU_LINK4;
      // Oblicz wartość ObjectiveWithoutPandL
      //zabezpieczenie przed dzieleniem przez zero
      let objectiveWithoutPandL = 0;
      if (
        notExpiredPaymentWithoutPandLValue +
          expiredPaymentsWithoutPandLValue !==
        0
      ) {
        objectiveWithoutPandL =
          (expiredPaymentsWithoutPandLValue /
            (notExpiredPaymentWithoutPandLValue +
              expiredPaymentsWithoutPandLValue)) *
          100;
      }
      sumOfAllItems.CEL_BEZ_PZU_LINK4 = objectiveWithoutPandL;

      const expiredPaymentsWithoutLegal =
        sumOfAllItems.PRZETERMINOWANE_BEZ_KANCELARII;
      const notExpiredPaymentWithoutLegal =
        sumOfAllItems.NIEPRZETERMINOWANE_FV_BEZ_KANCELARII;
      // Oblicz wartość ObjectiveWithoutPandL
      //zabezpieczenie przed dzieleniem przez zero
      let objectiveWithoutLegal = 0;
      if (notExpiredPaymentWithoutLegal + expiredPaymentsWithoutLegal !== 0) {
        objectiveWithoutLegal =
          (expiredPaymentsWithoutLegal /
            (notExpiredPaymentWithoutLegal + expiredPaymentsWithoutLegal)) *
          100;
      }

      sumOfAllItems.CEL_BEZ_KANCELARII = objectiveWithoutLegal;

      sumOfAllItems.DZIALY = "Całość";

      //dodaję "Całość" jako pierwszy obiekt, żeby w tabeli wyświetlał się jako pierwszy
      generatingRaport.unshift(sumOfAllItems);

      setRaport(generatingRaport);
    } else {
      setRaport(generatingRaport);
    }
  };

  // funkcja przygotowuje dane do raportu
  const grossTotal = useCallback(() => {
    // suma Brutto
    let sumOfGross = new Map();

    //ile faktur
    let howManyElements = new Map();

    //ile faktur przeterminowanych
    let howManyExpiredElements = new Map();

    //ile faktur przeterminowanych bez PZU/LINK4
    let howManyExpiredElementsWithoutPandL = new Map();

    //ile niedopłaty
    let underPayment = new Map();

    //przeterminowane płatności
    let expiredPayments = new Map();

    //przeterminowane płatności bez PZU i LINK4
    let expiredPaymentsWithoutPandL = new Map();

    //nieprzeterminowane
    let notExpiredPayment = new Map();

    //nieprzeterminowane bez PZU i LINK4
    let notExpiredPaymentWithoutPandL = new Map();

    // przeterminowane kancelaria
    let legalExpired = new Map();

    // ilość faktur kancelaria
    let legalCounter = new Map();

    // przeterminowane bez kancelarii
    let expiredWithoutLegal = new Map();

    // nieprzeterminowane bez kancelarii
    let notExpiredWithoutLegal = new Map();

    // ilość faktur bez kancelarii
    let withoutLegalCounter = new Map();

    // kwota niepobranych VATów
    let VATPayment = new Map();

    // ilość niepobranych VATów
    let VATCounter = new Map();

    // kwota nierozliczonych faktur wskutek błedów doradcy
    let adviserMistakePayment = new Map();

    // liczba nierozliczonych faktur wskutek błedów doradcy
    let adviserMistakeCounter = new Map();

    let generatingRaport = [];

    departments.forEach((dep) => {
      sumOfGross.set(dep, 0);
      howManyElements.set(dep, 0);
      howManyExpiredElements.set(dep, 0);
      howManyExpiredElementsWithoutPandL.set(dep, 0);
      underPayment.set(dep, 0);
      expiredPayments.set(dep, 0);
      notExpiredPayment.set(dep, 0);
      expiredPaymentsWithoutPandL.set(dep, 0);
      notExpiredPaymentWithoutPandL.set(dep, 0);
      legalExpired.set(dep, 0);
      legalCounter.set(dep, 0);
      expiredWithoutLegal.set(dep, 0);
      withoutLegalCounter.set(dep, 0);
      notExpiredWithoutLegal.set(dep, 0);
      VATPayment.set(dep, 0);
      VATCounter.set(dep, 0);
      adviserMistakePayment.set(dep, 0);
      adviserMistakeCounter.set(dep, 0);

      raportData.forEach((item) => {
        // Sprawdzenie, czy obiekt zawiera klucz DZIAL, który pasuje do aktualnego działu
        // oraz czy data mieści się w przedziale

        // pobranie daty dokumnetu
        let documentDate = new Date(item.DATA_FV);
        documentDate.setHours(0, 0, 0, 0);

        // // pobranie daty terminu płatności
        let afterDeadlineDate = new Date(item.TERMIN);
        afterDeadlineDate.setHours(0, 0, 0, 0);

        // najmniejsza data z danych
        let minDate = new Date(raportDate.minRaportDate);
        minDate.setHours(0, 0, 0, 0);

        // największa data z danych
        let maxDate = new Date(raportDate.maxRaportDate);
        minDate.setHours(0, 0, 0, 0);

        // dzisiejsza data
        let todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        if (
          item.DZIAL === dep &&
          documentDate >= minDate &&
          documentDate <= maxDate
        ) {
          sumOfGross.set(dep, sumOfGross.get(dep) + item.BRUTTO);
          howManyElements.set(dep, howManyElements.get(dep) + 1);
          underPayment.set(dep, underPayment.get(dep) + item.DO_ROZLICZENIA);
        }

        if (
          item.DZIAL === dep &&
          afterDeadlineDate < todayDate &&
          documentDate >= minDate &&
          documentDate <= maxDate
        ) {
          expiredPayments.set(
            dep,
            expiredPayments.get(dep) + item.DO_ROZLICZENIA
          );
          howManyExpiredElements.set(dep, howManyExpiredElements.get(dep) + 1);
        }

        if (
          item.DZIAL === dep &&
          afterDeadlineDate > todayDate &&
          documentDate >= minDate &&
          documentDate <= maxDate
        ) {
          notExpiredPayment.set(
            dep,
            notExpiredPayment.get(dep) + item.DO_ROZLICZENIA
          );
        }

        if (
          item.DZIAL === dep &&
          item.JAKA_KANCELARIA !== "ROK-KONOPA" &&
          item.JAKA_KANCELARIA !== "CNP" &&
          afterDeadlineDate < todayDate &&
          documentDate >= minDate &&
          documentDate <= maxDate
        ) {
          expiredPaymentsWithoutPandL.set(
            dep,
            expiredPaymentsWithoutPandL.get(dep) + item.DO_ROZLICZENIA
          );
          howManyExpiredElementsWithoutPandL.set(
            dep,
            howManyExpiredElementsWithoutPandL.get(dep) + 1
          );
        }

        if (
          item.DZIAL === dep &&
          item.JAKA_KANCELARIA !== "ROK-KONOPA" &&
          item.JAKA_KANCELARIA !== "CNP" &&
          afterDeadlineDate > todayDate &&
          documentDate >= minDate &&
          documentDate <= maxDate
        ) {
          notExpiredPaymentWithoutPandL.set(
            dep,
            notExpiredPaymentWithoutPandL.get(dep) + item.DO_ROZLICZENIA
          );
        }

        if (
          item.DZIAL === dep &&
          item.JAKA_KANCELARIA !== "BRAK" &&
          item.JAKA_KANCELARIA !== "ROK-KONOPA" &&
          item.JAKA_KANCELARIA !== "CNP" &&
          afterDeadlineDate < todayDate &&
          documentDate >= minDate &&
          documentDate <= maxDate
        ) {
          legalExpired.set(dep, legalExpired.get(dep) + item.DO_ROZLICZENIA);
          legalCounter.set(dep, legalCounter.get(dep) + 1);
        }

        if (
          item.DZIAL === dep &&
          item.JAKA_KANCELARIA === "BRAK" &&
          afterDeadlineDate < todayDate &&
          documentDate >= minDate &&
          documentDate <= maxDate
        ) {
          expiredWithoutLegal.set(
            dep,
            expiredWithoutLegal.get(dep) + item.DO_ROZLICZENIA
          );
          withoutLegalCounter.set(dep, withoutLegalCounter.get(dep) + 1);
        }

        if (
          item.DZIAL === dep &&
          item.JAKA_KANCELARIA === "BRAK" &&
          afterDeadlineDate > todayDate &&
          documentDate >= minDate &&
          documentDate <= maxDate
        ) {
          notExpiredWithoutLegal.set(
            dep,
            notExpiredWithoutLegal.get(dep) + item.DO_ROZLICZENIA
          );
        }

        if (
          item.DZIAL === dep &&
          documentDate >= minDate &&
          documentDate <= maxDate &&
          item.POBRANO_VAT === "100" &&
          item.DO_ROZLICZENIA !== 0
        ) {
          VATCounter.set(dep, VATCounter.get(dep) + 1);
          VATPayment.set(dep, VATPayment.get(dep) + item["100_VAT"]);
        }
        if (
          item.DZIAL === dep &&
          documentDate >= minDate &&
          documentDate <= maxDate &&
          item.POBRANO_VAT === "50" &&
          item.DO_ROZLICZENIA !== 0
        ) {
          VATCounter.set(dep, VATCounter.get(dep) + 1);
          VATPayment.set(dep, VATPayment.get(dep) + item["50_VAT"]);
        }

        if (
          item.DZIAL === dep &&
          documentDate >= minDate &&
          documentDate <= maxDate &&
          (item.BLAD_DORADCY === "TAK" || item.BLAD_W_DOKUMENTACJI === "TAK") &&
          item.DO_ROZLICZENIA !== 0
        ) {
          adviserMistakeCounter.set(dep, adviserMistakeCounter.get(dep) + 1);
          adviserMistakePayment.set(
            dep,
            adviserMistakePayment.get(dep) + item.DO_ROZLICZENIA
          );
        }
      });
    });

    departments.forEach((dep) => {
      // zabezpieczenie przed dzieleniem przez zero odtąd
      let expiredPaymentsValue = expiredPayments.get(dep);
      let notExpiredPaymentValue = notExpiredPayment.get(dep);
      let expiredPaymentsWithoutPandLValue =
        expiredPaymentsWithoutPandL.get(dep);
      let notExpiredPaymentWithoutPandLValue =
        notExpiredPaymentWithoutPandL.get(dep);
      let expiredWithoutLegalValue = expiredWithoutLegal.get(dep);
      let notExpiredWithoutLegalValue = notExpiredWithoutLegal.get(dep);

      let objective = 0;
      if (notExpiredPaymentValue + expiredPaymentsValue !== 0) {
        objective = (
          (expiredPaymentsValue /
            (notExpiredPaymentValue + expiredPaymentsValue)) *
          100
        ).toFixed(2);
      }

      let objectiveWithoutPandL = 0;
      if (
        notExpiredPaymentWithoutPandLValue +
          expiredPaymentsWithoutPandLValue !==
        0
      ) {
        objectiveWithoutPandL = (
          (expiredPaymentsWithoutPandLValue /
            (notExpiredPaymentWithoutPandLValue +
              expiredPaymentsWithoutPandLValue)) *
          100
        ).toFixed(2);
      }

      let objectiveWithoutLegal = 0;
      if (notExpiredWithoutLegalValue + expiredWithoutLegalValue !== 0) {
        objectiveWithoutLegal = (
          (expiredWithoutLegalValue /
            (notExpiredWithoutLegalValue + expiredWithoutLegalValue)) *
          100
        ).toFixed(2);
      }

      let departmentObj = {
        DZIALY: dep,
        CEL: departmentsObjective.departments[dep],
        CEL_BEZ_PZU_LINK4: Number(objectiveWithoutPandL),
        PRZETERMINOWANE_BEZ_PZU_LINK4: Number(
          expiredPaymentsWithoutPandLValue.toFixed(2)
        ),
        ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4:
          howManyExpiredElementsWithoutPandL.get(dep),
        CALKOWITA_WARTOSC_FV_BRUTTO: Number(sumOfGross.get(dep).toFixed(2)),
        ILOSC_NIEROZLICZONYCH_FV: howManyElements.get(dep),
        KWOTA_NIEROZLICZONYCH_FV: Number(underPayment.get(dep).toFixed(2)),
        PRZETERMINOWANE_FV: Number(expiredPaymentsValue.toFixed(2)),
        NIEPRZETERMINOWANE_FV: Number(notExpiredPaymentValue.toFixed(2)),
        NIEPRZETERMINOWANE_FV_BEZ_PZU_LINK4: Number(
          notExpiredPaymentWithoutPandLValue.toFixed(2)
        ),
        PRZETERMINOWANE_KANCELARIA: Number(legalExpired.get(dep).toFixed(2)),
        CEL_CALOSC: Number(objective),
        ILOSC_PRZETERMINOWANYCH_FV: howManyExpiredElements.get(dep),
        ILOSC_FV_KANCELARIA: legalCounter.get(dep),
        CEL_BEZ_KANCELARII: Number(objectiveWithoutLegal),
        ILOSC_PRZETERMINOWANYCH_FV_BEZ_KANCELARII: withoutLegalCounter.get(dep),
        NIEPRZETERMINOWANE_FV_BEZ_KANCELARII: Number(
          notExpiredWithoutLegalValue.toFixed(2)
        ),
        PRZETERMINOWANE_BEZ_KANCELARII: Number(
          expiredWithoutLegalValue.toFixed(2)
        ),
        ILE_NIEPOBRANYCH_VAT: VATCounter.get(dep),
        KWOTA_NIEPOBRANYCH_VAT: Number(VATPayment.get(dep).toFixed(2)),
        ILE_BLEDOW_DORADCY_I_DOKUMENTACJI: adviserMistakeCounter.get(dep),
        KWOTA_BLEDOW_DORADCY_I_DOKUMENTACJI: Number(
          adviserMistakePayment.get(dep).toFixed(2)
        ),
      };
      generatingRaport.push(departmentObj);
    });

    addedAllToRaports(generatingRaport);
  }, [
    departments,
    departmentsObjective.departments,
    raportData,
    raportDate.maxRaportDate,
    raportDate.minRaportDate,
  ]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "DZIALY",
        header: "Dział",
        // size: columnSizing?.Department ? columnSizing.Department : 150
      },
      {
        accessorKey: "CEL",
        header: `Cele na ${departmentsObjective.time.Q}-Q bez R-K i CNP`,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const formattedValue =
            value !== undefined && value !== "" ? `${value}%` : ""; // Dodanie znaku procent do wartości, jeśli nie jest to pusty string
          return formattedValue;
        },
      },
      {
        accessorKey: "CEL_BEZ_PZU_LINK4",
        header: "Stan należności w % bez R-K i CNP",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const formattedSalary =
            value !== undefined && value !== null
              ? value.toLocaleString("pl-PL", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                }) + "%"
              : "0,00"; // Zastąp puste pola zerem

          return `${formattedSalary}`;
        },
        muiTableBodyCellProps: {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor: "#ffe884",
          },
        },
      },
      {
        accessorKey: "PRZETERMINOWANE_BEZ_PZU_LINK4",
        header: "Kwota przeterminowanych bez R-K i CNP",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const formattedSalary =
            value !== undefined && value !== null
              ? value.toLocaleString("pl-PL", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })
              : "0,00"; // Zastąp puste pola zerem

          return `${formattedSalary}`;
        },
        muiTableBodyCellProps: {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor: "#ffe884",
          },
        },
      },
      {
        accessorKey: "ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4",
        header: "Ilość przeterminowanych FV bez R-K i CNP",
        muiTableBodyCellProps: {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor: "#ffe884",
          },
        },
      },
      {
        accessorKey: "NIEPRZETERMINOWANE_FV_BEZ_PZU_LINK4",
        header: "Kwota nieprzeterminowanych FV bez R-K i CNP",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const formattedSalary =
            value !== undefined && value !== null
              ? value.toLocaleString("pl-PL", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })
              : "0,00"; // Zastąp puste pola zerem

          return `${formattedSalary}`;
        },
        muiTableBodyCellProps: {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor: "#ffe884",
          },
        },
      },
      {
        accessorKey: "CEL_CALOSC",
        header: "Stan wszytskich należności w %",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const formattedSalary =
            value !== undefined && value !== null
              ? value.toLocaleString("pl-PL", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                }) + "%"
              : "0,00"; // Zastąpuje puste pola zerem

          return `${formattedSalary}`;
        },
        muiTableBodyCellProps: {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor: "#caff84",
          },
        },
      },

      {
        accessorKey: "PRZETERMINOWANE_FV",
        header: "Kwota wszytskich przeterminowanych fv",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const formattedSalary =
            value !== undefined && value !== null
              ? value.toLocaleString("pl-PL", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })
              : "0,00"; // Zastąp puste pola zerem

          return `${formattedSalary}`;
        },
        muiTableBodyCellProps: {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor: "#caff84",
          },
        },
      },

      {
        accessorKey: "ILOSC_PRZETERMINOWANYCH_FV",
        header: "Ilość wszytskich faktur przeterminowanych",
        muiTableBodyCellProps: {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor: "#caff84",
          },
        },
      },
      {
        accessorKey: "NIEPRZETERMINOWANE_FV",
        header: "Kwota wszytskich nieprzeterminowanych fv",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const formattedSalary =
            value !== undefined && value !== null
              ? value.toLocaleString("pl-PL", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })
              : "0,00"; // Zastąp puste pola zerem

          return `${formattedSalary}`;
        },
        muiTableBodyCellProps: {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor: "#caff84",
          },
        },
      },
      {
        accessorKey: "CEL_BEZ_KANCELARII",
        header: "Stan  należności bez kancelarii w %",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const formattedSalary =
            value !== undefined && value !== null
              ? value.toLocaleString("pl-PL", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                }) + "%"
              : "0,00"; // Zastąpuje puste pola zerem

          return `${formattedSalary}`;
        },
        muiTableBodyCellProps: {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor: "#9fdcff",
          },
        },
      },
      {
        accessorKey: "PRZETERMINOWANE_KANCELARIA",
        header: "Kwota przeterminowanych fv bez kancelarii",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const formattedSalary =
            value !== undefined && value !== null
              ? value.toLocaleString("pl-PL", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })
              : "0,00"; // Zastąp puste pola zerem

          return `${formattedSalary}`;
        },
        muiTableBodyCellProps: {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor: "#9fdcff",
          },
        },
      },
      {
        accessorKey: "ILOSC_PRZETERMINOWANYCH_FV_BEZ_KANCELARII",
        header: "Ilość faktur przeterminowanych bez kancelarii",
        muiTableBodyCellProps: {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor: "#9fdcff",
          },
        },
      },
      {
        accessorKey: "NIEPRZETERMINOWANE_FV_BEZ_KANCELARII",
        header: "Kwota wszytskich nieprzeterminowanych fv bez kancelarii",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const formattedSalary =
            value !== undefined && value !== null
              ? value.toLocaleString("pl-PL", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })
              : "0,00"; // Zastąp puste pola zerem

          return `${formattedSalary}`;
        },
        muiTableBodyCellProps: {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor: "#9fdcff",
          },
        },
      },

      {
        accessorKey: "KWOTA_NIEPOBRANYCH_VAT",
        header: "Kwota niepobranych VAT'ów",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const formattedSalary =
            value !== undefined && value !== null
              ? value.toLocaleString("pl-PL", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })
              : "0,00"; // Zastąp puste pola zerem

          return `${formattedSalary}`;
        },
        muiTableBodyCellProps: {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor: "rgba(255, 0, 255, .2)",
          },
        },
      },
      {
        accessorKey: "ILE_NIEPOBRANYCH_VAT",
        header: "Ilość niepobranych VAT'ów",
        muiTableBodyCellProps: {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor: "rgba(255, 0, 255, .2)",
          },
        },
      },
      {
        accessorKey: "KWOTA_BLEDOW_DORADCY_I_DOKUMENTACJI",
        header: "Kwota nierozliczonych fv - błędy Doradcy i dokumentacji",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          const formattedSalary =
            value !== undefined && value !== null
              ? value.toLocaleString("pl-PL", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })
              : "0,00"; // Zastąp puste pola zerem

          return `${formattedSalary}`;
        },
        muiTableBodyCellProps: {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor: "rgba(255, 0, 255, .2)",
          },
        },
      },

      {
        accessorKey: "ILE_BLEDOW_DORADCY_I_DOKUMENTACJI",
        header: "Ilość nierozliczonych fv - błędy Doradcy i dokumentacji",
        muiTableBodyCellProps: {
          ...muiTableBodyCellProps,
          sx: {
            ...muiTableBodyCellProps.sx,
            backgroundColor: "rgba(255, 0, 255, .2)",
          },
        },
      },
    ],
    [muiTableBodyCellProps, departmentsObjective.time.Q]
  );
  const table = useMaterialReactTable({
    columns,
    data: raport,
    enableStickyHeader: true,
    enableGlobalFilter: false,
    enableGlobalFilterModes: false,
    enableColumnFilters: false,
    enableColumnPinning: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    // layoutMode: "grid",
    enableColumnActions: false,
    enablePagination: false,
    localization: MRT_Localization_PL,
    onColumnVisibilityChange: setColumnVisibility,
    onDensityChange: setDensity,
    onColumnSizingChange: setColumnSizing,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    state: {
      columnVisibility,
      density,
      columnOrder,
      columnPinning,
      columnSizing,
    },

    defaultColumn: {
      maxSize: 400,
      minSize: 100,
      // size: 160, //default size is usually 180
    },
    // wyłącza wszytskie ikonki nad tabelą
    // enableToolbarInternalActions: false,

    muiTableHeadCellProps: () => ({
      align: "left",
      sx: {
        fontFamily: "Calibri, sans-serif",
        fontWeight: "700",
        fontSize: "16px",
        color: "black",
        backgroundColor: "#a7d3f7",
        padding: "15px",
        paddingTop: "0",
        paddingBottom: "0",
        minHeight: "2rem",
        whiteSpace: "wrap",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid rgba(81, 81, 81, .2)",
        "& .Mui-TableHeadCell-Content": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          textWrap: "balance",
          // whiteSpace: "wrap",
        },
        "& .Mui-TableHeadCell-Content-Wrapper": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          whiteSpace: "wrap",
        },
        "& .Mui-TableHeadCell-Content-Actions": {
          display: "none",
        },
      },
    }),

    muiTableBodyCellProps: ({ column, cell }) => ({
      align: "center",
      sx: {
        borderRight: "1px solid #000",
        borderBottom: "1px solid #000",
        fontSize: "14px",
        fontWeight: "bold",
        padding: "2px",
        minHeight: "3rem",
      },
    }),

    muiTableContainerProps: { sx: { maxHeight: tableSize } },
  });

  const handleSaveSettings = async () => {
    const raportDepartments = {
      size: { ...columnSizing },
      visible: { ...columnVisibility },
      density,
      order: columnOrder,
      pinning: columnPinning,
    };
    try {
      await axiosPrivateIntercept.patch(
        `/user/save-raport-departments-settings/${auth._id}`,
        { raportDepartments }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleExportExcel = async () => {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(raport);
    xlsx.utils.book_append_sheet(wb, ws, "Dział");
    xlsx.writeFile(wb, "Raport-Dział.xlsx");
  };

  useEffect(() => {
    const createDataRaport = () => {
      if (permission === "Standard") {
        let uniqueDepartments = [];
        raportData.forEach((item) => {
          if (item.DZIAL && typeof item.DZIAL === "string") {
            if (!uniqueDepartments.includes(item.DZIAL)) {
              uniqueDepartments.push(item.DZIAL);
            }
          }
        });
        setDepartments(uniqueDepartments);
      }
    };
    createDataRaport();
  }, [raportData, permission, raportDate]);

  useEffect(() => {
    grossTotal();
  }, [departments, grossTotal]);

  useEffect(() => {
    setTableSize(height - 215);
  }, [height]);

  useEffect(() => {
    let minDate = new Date(raportDate.minRaportDate);
    let maxDate = new Date(raportDate.maxRaportDate);
    if (minDate > maxDate || maxDate < minDate) {
      errSetRaportDate(true);
    } else {
      errSetRaportDate(false);
    }
  }, [raportDate]);

  useEffect(() => {
    const getData = async () => {
      try {
        setPleaseWait(true);
        const resultData = await axiosPrivateIntercept.get(
          `/raport/get-data/${auth._id}`
        );
        setRaportData(resultData.data.data);
        setPermission(resultData.data.permission);
        checkMinMaxDateGlobal(resultData.data.data);

        const [settingsRaportUserDepartments] = await Promise.all([
          axiosPrivateIntercept.get(
            `/user/get-raport-departments-settings/${auth._id}`
          ),
        ]);

        setColumnVisibility(settingsRaportUserDepartments?.data?.visible || {});
        setColumnSizing(settingsRaportUserDepartments?.data?.size || {});
        setDensity(
          settingsRaportUserDepartments?.data?.density || "comfortable"
        );
        setColumnOrder(
          settingsRaportUserDepartments?.data?.order?.map((order) => order) ||
            []
        );
        setColumnPinning(
          settingsRaportUserDepartments?.data?.pinning || {
            left: [],
            right: [],
          }
        );

        setPleaseWait(false);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [auth._id, axiosPrivateIntercept, setPleaseWait]);

  return (
    <section className="raport_departments">
      <section className="raport_departments-date">
        <section className="raport_departments-date__title">
          <h3>Wybierz przedział dat dla raportu</h3>
        </section>
        <section className="raport_departments-date__content">
          <h3 className="raport_departments-date__content-name">od: </h3>
          <input
            className="raport_departments-date-select"
            style={errRaportDate ? { backgroundColor: "red" } : null}
            name="minDate"
            type="date"
            min={minMaxDateGlobal.minGlobalDate}
            max={minMaxDateGlobal.maxGlobalDate}
            value={raportDate.minRaportDate}
            onChange={(e) =>
              setRaportDate((prev) => {
                return {
                  ...prev,
                  minRaportDate: e.target.value
                    ? e.target.value
                    : minMaxDateGlobal.minGlobalDate,
                };
              })
            }
          />
          <h3 className="raport_departments-date__content-name">do: </h3>

          <input
            className="raport_departments-date-select"
            style={errRaportDate ? { backgroundColor: "red" } : null}
            name="maxDate"
            type="date"
            min={minMaxDateGlobal.minGlobalDate}
            max={minMaxDateGlobal.maxGlobalDate}
            value={raportDate?.maxRaportDate}
            onChange={(e) =>
              setRaportDate((prev) => {
                return {
                  ...prev,
                  maxRaportDate: e.target.value
                    ? e.target.value
                    : minMaxDateGlobal.maxGlobalDate,
                };
              })
            }
          />
        </section>
      </section>
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <MaterialReactTable
          className="raport_departments-table"
          table={table}
        />
      )}
      <section className="raport_departments-panel">
        <i
          className="fas fa-save raport_departments-save-settings"
          onClick={handleSaveSettings}
        ></i>
        <i
          className="fa-regular fa-file-excel raport_departments-export-excel"
          onClick={handleExportExcel}
        ></i>
      </section>
    </section>
  );
};

export default RaportDepartments;
