// const departmentsObjective = {
//   time: {
//     Q: 5,
//   },
//   departments: {
//     Całość: "-",
//     D08: 28,
//     D38: 28,
//     "D48/D58": 28,
//     "D68/D78": 28,
//     D88: 28,
//     D98: 28,
//     "D118/D148": 21,
//     "D308/D318": 28,
//   },
// };

const muiTableBodyCellProps = {
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

const addedAllToRaportsDep = (generatingRaport) => {
  const sumOfAllItems = generatingRaport.reduce(
    (acc, currentItem) => {
      acc.ILOSC_NIEROZLICZONYCH_FV += currentItem.ILOSC_NIEROZLICZONYCH_FV;
      acc.ILOSC_PRZETERMINOWANYCH_FV += currentItem.ILOSC_PRZETERMINOWANYCH_FV;
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
      acc.PRZETERMINOWANE_KANCELARIA += currentItem.PRZETERMINOWANE_KANCELARIA;
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
      (expiredPaymentsValue / (notExpiredPaymentValue + expiredPaymentsValue)) *
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
    notExpiredPaymentWithoutPandLValue + expiredPaymentsWithoutPandLValue !==
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
  sumOfAllItems.CEL = "";

  //dodaję "Całość" jako pierwszy obiekt, żeby w tabeli wyświetlał się jako pierwszy
  generatingRaport.unshift(sumOfAllItems);

  return generatingRaport;
};

// funkcja przygotowuje dane do raportu
export const grossTotalDepartments = (
  departments,
  raportData,
  raportDate,
  percentTarget
) => {
  const departmentsObjective = { ...percentTarget };
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

      // if (
      //   item.DZIAL === dep &&
      //   item.JAKA_KANCELARIA !== "ROK-KONOPA" &&
      //   item.JAKA_KANCELARIA !== "CNP" &&
      //   afterDeadlineDate < todayDate &&
      //   documentDate >= minDate &&
      //   documentDate <= maxDate
      // ) 
      if (
        item.DZIAL === dep &&
        item.JAKA_KANCELARIA_TU !== "ROK-KONOPA" &&
        item.JAKA_KANCELARIA_TU !== "CNP" &&
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

      // if (
      //   item.DZIAL === dep &&
      //   item.JAKA_KANCELARIA !== "ROK-KONOPA" &&
      //   item.JAKA_KANCELARIA !== "CNP" &&
      //   afterDeadlineDate > todayDate &&
      //   documentDate >= minDate &&
      //   documentDate <= maxDate
      // )
      if (
        item.DZIAL === dep &&
        item.JAKA_KANCELARIA_TU !== "ROK-KONOPA" &&
        item.JAKA_KANCELARIA_TU !== "CNP" &&
        afterDeadlineDate > todayDate &&
        documentDate >= minDate &&
        documentDate <= maxDate
      ) {
        notExpiredPaymentWithoutPandL.set(
          dep,
          notExpiredPaymentWithoutPandL.get(dep) + item.DO_ROZLICZENIA
        );
      }

      // if (
      //   item.DZIAL === dep &&
      //   item.JAKA_KANCELARIA !== "BRAK" &&
      //   item.JAKA_KANCELARIA !== "ROK-KONOPA" &&
      //   item.JAKA_KANCELARIA !== "CNP" &&
      //   afterDeadlineDate < todayDate &&
      //   documentDate >= minDate &&
      //   documentDate <= maxDate
      // ) 
      if (
        item.DZIAL === dep &&
        item.JAKA_KANCELARIA !== "BRAK" &&
        item.JAKA_KANCELARIA_TU !== "ROK-KONOPA" &&
        item.JAKA_KANCELARIA_TU !== "CNP" &&
        afterDeadlineDate < todayDate &&
        documentDate >= minDate &&
        documentDate <= maxDate
      ) {
        legalExpired.set(dep, legalExpired.get(dep) + item.DO_ROZLICZENIA);
        legalCounter.set(dep, legalCounter.get(dep) + 1);
      }

      // if (
      //   item.DZIAL === dep &&
      //   item.JAKA_KANCELARIA === "BRAK" &&
      //   afterDeadlineDate < todayDate &&
      //   documentDate >= minDate &&
      //   documentDate <= maxDate
      // )
      if (
        item.DZIAL === dep &&
        item.JAKA_KANCELARIA === "BRAK" &&
        item.JAKA_KANCELARIA_TU === "BRAK" &&
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

      // if (
      //   item.DZIAL === dep &&
      //   item.JAKA_KANCELARIA === "BRAK" &&
      //   afterDeadlineDate > todayDate &&
      //   documentDate >= minDate &&
      //   documentDate <= maxDate
      // )
      if (
        item.DZIAL === dep &&
        item.JAKA_KANCELARIA === "BRAK" &&
        item.JAKA_KANCELARIA_TU === "BRAK" &&
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
        item.BLAD_DORADCY === "TAK" &&
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
    let expiredPaymentsWithoutPandLValue = expiredPaymentsWithoutPandL.get(dep);
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
      notExpiredPaymentWithoutPandLValue + expiredPaymentsWithoutPandLValue !==
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

  if (generatingRaport.length === 1) {
    return generatingRaport;
  } else {
    const preparedData = addedAllToRaportsDep(generatingRaport);
    return preparedData;
  }
};

export const columnsDepartments = [
  {
    accessorKey: "DZIALY",
    header: "Dział",
    filterVariant: "multi-select",
    enableColumnFilter: true,

    // size: columnSizing?.Department ? columnSizing.Department : 150
  },
  {
    accessorKey: "CEL",
    header: "Cele na kwartał",
    // header: "Cele na bez R-K i CNP",
    enableColumnFilter: false,
    Cell: ({ cell }) => {
      const value = cell.getValue();
      const formattedValue =
        value !== undefined && value !== "" ? `${value}%` : " "; // Dodanie znaku procent do wartości, jeśli nie jest to pusty string
      return formattedValue;
    },
  },
  {
    accessorKey: "CEL_BEZ_PZU_LINK4",
    header: "Stan należności w % - BL",
    // header: "Stan należności w % bez R-K i CNP",
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
    enableColumnFilter: false,
  },
  {
    accessorKey: "PRZETERMINOWANE_BEZ_PZU_LINK4",
    header: "Kwota przeterminowanych fv - BL",
    // header: "Kwota przeterminowanych bez R-K i CNP",
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
    enableColumnFilter: false,
  },
  {
    accessorKey: "ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4",
    header: "Ilość przeterminowanych FV - BL",
    // header: "Ilość przeterminowanych FV bez R-K i CNP",
    muiTableBodyCellProps: {
      ...muiTableBodyCellProps,
      sx: {
        ...muiTableBodyCellProps.sx,
        backgroundColor: "#ffe884",
      },
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "NIEPRZETERMINOWANE_FV_BEZ_PZU_LINK4",
    header: "Kwota nieprzeterminowanych FV - BL",
    // header: "Kwota nieprzeterminowanych FV bez R-K i CNP",
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
    enableColumnFilter: false,
  },
  {
    accessorKey: "CEL_CALOSC",
    header: "Stan wszystkich należności w %",
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
    enableColumnFilter: false,
  },

  {
    accessorKey: "PRZETERMINOWANE_FV",
    header: "Kwota wszystkich przeterminowanych fv",
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
    enableColumnFilter: false,
  },

  {
    accessorKey: "ILOSC_PRZETERMINOWANYCH_FV",
    header: "Ilość wszystkich faktur przeterminowanych",
    muiTableBodyCellProps: {
      ...muiTableBodyCellProps,
      sx: {
        ...muiTableBodyCellProps.sx,
        backgroundColor: "#caff84",
      },
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "NIEPRZETERMINOWANE_FV",
    header: "Kwota wszystkich nieprzeterminowanych fv",
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
    enableColumnFilter: false,
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
    enableColumnFilter: false,
  },
  {
    accessorKey: "PRZETERMINOWANE_BEZ_KANCELARII",
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
    enableColumnFilter: false,
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
    enableColumnFilter: false,
  },
  {
    accessorKey: "NIEPRZETERMINOWANE_FV_BEZ_KANCELARII",
    header: "Kwota wszystkich nieprzeterminowanych fv bez kancelarii",
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
    enableColumnFilter: false,
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
    enableColumnFilter: false,
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
    enableColumnFilter: false,
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
    enableColumnFilter: false,
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
    enableColumnFilter: false,
  },
];

export const columnsAdv = [
  {
    accessorKey: "DORADCA",
    header: "Doradca",
    filterVariant: "multi-select",
  },
  {
    accessorKey: "DZIAL",
    header: "Dział",
    filterVariant: "multi-select",
  },

  {
    accessorKey: "CEL_BEZ_PZU_LINK4",
    header: "Stan należności w %",
    // header: "Stan należności w % bez R-K i CNP",
    enableColumnFilter: false,
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
    header: "Kwota przeterminowanych FV",
    // header: "Kwota przeterminowanych FV bez R-K i CNP",
    enableColumnFilter: false,
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
    header: "Ilość przeterminowanych FV",
    // header: "Ilość przeterminowanych FV bez R-K i CNP",
    enableColumnFilter: false,
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
    header: "Kwota nieprzeterminowanych FV",
    // header: "Kwota nieprzeterminowanych FV bez R-K i CNP",
    enableColumnFilter: false,
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
    accessorKey: "KWOTA_NIEPOBRANYCH_VAT",
    header: "Kwota niepobranych VAT'ów",
    enableColumnFilter: false,
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
    enableColumnFilter: false,
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
    enableColumnFilter: false,
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
    enableColumnFilter: false,
    muiTableBodyCellProps: {
      ...muiTableBodyCellProps,
      sx: {
        ...muiTableBodyCellProps.sx,
        backgroundColor: "rgba(255, 0, 255, .2)",
      },
    },
  },
];

export const grossTotalAdv = (departments, raportData, raportDate) => {
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
    sumOfGross.set(dep.merge, 0);
    howManyElements.set(dep.merge, 0);
    howManyExpiredElements.set(dep.merge, 0);
    howManyExpiredElementsWithoutPandL.set(dep.merge, 0);
    underPayment.set(dep.merge, 0);
    expiredPayments.set(dep.merge, 0);
    notExpiredPayment.set(dep.merge, 0);
    expiredPaymentsWithoutPandL.set(dep.merge, 0);
    notExpiredPaymentWithoutPandL.set(dep.merge, 0);
    legalExpired.set(dep.merge, 0);
    legalCounter.set(dep.merge, 0);
    VATPayment.set(dep.merge, 0);
    VATCounter.set(dep.merge, 0);
    adviserMistakePayment.set(dep.merge, 0);
    adviserMistakeCounter.set(dep.merge, 0);

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
        item.DORADCA === dep.adviser &&
        dep.merge === `${dep.adviser}-${item.DZIAL}` &&
        documentDate >= minDate &&
        documentDate <= maxDate
      ) {
        sumOfGross.set(dep.merge, sumOfGross.get(dep.merge) + item.BRUTTO);
        howManyElements.set(dep.merge, howManyElements.get(dep.merge) + 1);
        underPayment.set(
          dep.merge,
          underPayment.get(dep.merge) + item.DO_ROZLICZENIA
        );
      }

      if (
        item.DORADCA === dep.adviser &&
        dep.merge === `${dep.adviser}-${item.DZIAL}` &&
        afterDeadlineDate < todayDate &&
        documentDate >= minDate &&
        documentDate <= maxDate
      ) {
        expiredPayments.set(
          dep.merge,
          expiredPayments.get(dep.merge) + item.DO_ROZLICZENIA
        );
        howManyExpiredElements.set(
          dep.merge,
          howManyExpiredElements.get(dep.merge) + 1
        );
      }

      if (
        item.DORADCA === dep.adviser &&
        dep.merge === `${dep.adviser}-${item.DZIAL}` &&
        afterDeadlineDate > todayDate &&
        documentDate >= minDate &&
        documentDate <= maxDate
      ) {
        notExpiredPayment.set(
          dep.merge,
          notExpiredPayment.get(dep.merge) + item.DO_ROZLICZENIA
        );
      }

      // if (
      //   item.DORADCA === dep.adviser &&
      //   dep.merge === `${dep.adviser}-${item.DZIAL}` &&
      //   item.JAKA_KANCELARIA !== "ROK-KONOPA" &&
      //   item.JAKA_KANCELARIA !== "CNP" &&
      //   afterDeadlineDate < todayDate &&
      //   documentDate >= minDate &&
      //   documentDate <= maxDate
      // ) 
      if (
        item.DORADCA === dep.adviser &&
        dep.merge === `${dep.adviser}-${item.DZIAL}` &&
        item.JAKA_KANCELARIA_TU !== "ROK-KONOPA" &&
        item.JAKA_KANCELARIA_TU !== "CNP" &&
        afterDeadlineDate < todayDate &&
        documentDate >= minDate &&
        documentDate <= maxDate
      ) {
        expiredPaymentsWithoutPandL.set(
          dep.merge,
          expiredPaymentsWithoutPandL.get(dep.merge) + item.DO_ROZLICZENIA
        );
        howManyExpiredElementsWithoutPandL.set(
          dep.merge,
          howManyExpiredElementsWithoutPandL.get(dep.merge) + 1
        );
      }

      // if (
      //   item.DORADCA === dep.adviser &&
      //   dep.merge === `${dep.adviser}-${item.DZIAL}` &&
      //   item.JAKA_KANCELARIA !== "BRAK" &&
      //   item.JAKA_KANCELARIA !== "ROK-KONOPA" &&
      //   item.JAKA_KANCELARIA !== "CNP" &&
      //   afterDeadlineDate < todayDate &&
      //   documentDate >= minDate &&
      //   documentDate <= maxDate
      // )
      if (
        item.DORADCA === dep.adviser &&
        dep.merge === `${dep.adviser}-${item.DZIAL}` &&
        item.JAKA_KANCELARIA !== "BRAK" &&
        item.JAKA_KANCELARIA_TU !== "ROK-KONOPA" &&
        item.JAKA_KANCELARIA_TU !== "CNP" &&
        afterDeadlineDate < todayDate &&
        documentDate >= minDate &&
        documentDate <= maxDate
      ) {
        legalExpired.set(
          dep.merge,
          legalExpired.get(dep.merge) + item.DO_ROZLICZENIA
        );
        legalCounter.set(dep.merge, legalCounter.get(dep.merge) + 1);
      }

      // if (
      //   item.DORADCA === dep.adviser &&
      //   dep.merge === `${dep.adviser}-${item.DZIAL}` &&
      //   item.JAKA_KANCELARIA !== "ROK-KONOPA" &&
      //   item.JAKA_KANCELARIA !== "CNP" &&
      //   afterDeadlineDate > todayDate &&
      //   documentDate >= minDate &&
      //   documentDate <= maxDate
      // ) 
      if (
        item.DORADCA === dep.adviser &&
        dep.merge === `${dep.adviser}-${item.DZIAL}` &&
        item.JAKA_KANCELARIA_TU !== "ROK-KONOPA" &&
        item.JAKA_KANCELARIA_TU !== "CNP" &&
        afterDeadlineDate > todayDate &&
        documentDate >= minDate &&
        documentDate <= maxDate
      ) {
        notExpiredPaymentWithoutPandL.set(
          dep.merge,
          notExpiredPaymentWithoutPandL.get(dep.merge) + item.DO_ROZLICZENIA
        );
      }

      if (
        item.DORADCA === dep.adviser &&
        dep.merge === `${dep.adviser}-${item.DZIAL}` &&
        documentDate >= minDate &&
        documentDate <= maxDate &&
        item.POBRANO_VAT === "100" &&
        item.DO_ROZLICZENIA !== 0
      ) {
        VATCounter.set(dep.merge, VATCounter.get(dep.merge) + 1);
        VATPayment.set(dep.merge, VATPayment.get(dep.merge) + item["100_VAT"]);
      }

      if (
        item.DORADCA === dep.adviser &&
        dep.merge === `${dep.adviser}-${item.DZIAL}` &&
        documentDate >= minDate &&
        documentDate <= maxDate &&
        item.POBRANO_VAT === "50" &&
        item.DO_ROZLICZENIA !== 0
      ) {
        VATCounter.set(dep.merge, VATCounter.get(dep.merge) + 1);
        VATPayment.set(dep.merge, VATPayment.get(dep.merge) + item["50_VAT"]);
      }

      if (
        item.DORADCA === dep.adviser &&
        dep.merge === `${dep.adviser}-${item.DZIAL}` &&
        documentDate >= minDate &&
        documentDate <= maxDate &&
        item.BLAD_DORADCY === "TAK" &&
        item.DO_ROZLICZENIA !== 0
      ) {
        adviserMistakeCounter.set(
          dep.merge,
          adviserMistakeCounter.get(dep.merge) + 1
        );
        adviserMistakePayment.set(
          dep.merge,
          adviserMistakePayment.get(dep.merge) + item.DO_ROZLICZENIA
        );
      }
    });
  });

  departments.forEach((dep) => {
    // zabezpieczenie przed dzieleniem przez zero odtąd
    let expiredPaymentsValue = expiredPayments.get(dep.merge);
    let notExpiredPaymentValue = notExpiredPayment.get(dep.merge);
    let expiredPaymentsWithoutPandLValue = expiredPaymentsWithoutPandL.get(
      dep.merge
    );
    let notExpiredPaymentWithoutPandLValue = notExpiredPaymentWithoutPandL.get(
      dep.merge
    );

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
      notExpiredPaymentWithoutPandLValue + expiredPaymentsWithoutPandLValue !==
      0
    ) {
      objectiveWithoutPandL = (
        (expiredPaymentsWithoutPandLValue /
          (notExpiredPaymentWithoutPandLValue +
            expiredPaymentsWithoutPandLValue)) *
        100
      ).toFixed(2);
    }
    // zabezpieczenie przed dzieleniem przez zero dodtąd

    let departmentObj = {
      DORADCA_DZIAL: dep.merge,
      DORADCA: dep.adviser,
      DZIAL: dep.department,
      CALKOWITA_WARTOSC_FV_BRUTTO: Number(sumOfGross.get(dep.merge)),
      KWOTA_NIEROZLICZONYCH_FV: Number(underPayment.get(dep.merge).toFixed(2)),
      PRZETERMINOWANE_FV: Number(expiredPaymentsValue.toFixed(2)),
      NIEPRZETERMINOWANE_FV: Number(notExpiredPaymentValue.toFixed(2)),
      PRZETERMINOWANE_BEZ_PZU_LINK4: Number(
        expiredPaymentsWithoutPandLValue.toFixed(2)
      ),
      NIEPRZETERMINOWANE_FV_BEZ_PZU_LINK4: Number(
        notExpiredPaymentWithoutPandLValue.toFixed(2)
      ),
      PRZETERMINOWANE_KANCELARIA: Number(
        legalExpired.get(dep.merge).toFixed(2)
      ),
      CEL_CALOSC: Number(objective),
      CEL_BEZ_PZU_LINK4: Number(objectiveWithoutPandL),
      ILOSC_NIEROZLICZONYCH_FV: howManyElements.get(dep.merge),
      ILOSC_PRZETERMINOWANYCH_FV: howManyExpiredElements.get(dep.merge),
      ILOSC_PRZETERMINOWANYCH_FV_BEZ_PZU_LINK4:
        howManyExpiredElementsWithoutPandL.get(dep.merge),
      ILOSC_FV_KANCELARIA: legalCounter.get(dep.merge),
      ILE_NIEPOBRANYCH_VAT: VATCounter.get(dep.merge),
      KWOTA_NIEPOBRANYCH_VAT: Number(VATPayment.get(dep.merge).toFixed(2)),
      ILE_BLEDOW_DORADCY_I_DOKUMENTACJI: adviserMistakeCounter.get(dep.merge),
      KWOTA_BLEDOW_DORADCY_I_DOKUMENTACJI: Number(
        adviserMistakePayment.get(dep.merge).toFixed(2)
      ),
    };

    if (departmentObj.CALKOWITA_WARTOSC_FV_BRUTTO) {
      generatingRaport.push(departmentObj);
    }
  });
  return generatingRaport;
};
