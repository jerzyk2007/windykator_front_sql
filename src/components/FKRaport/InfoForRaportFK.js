import { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PleaseWait from "../PleaseWait";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import { getExcelRaportV2 } from "./utilsForFKTable/prepareFKExcelFile";


import './InfoForRaportFK.css';

const InfoForRaportFK = ({ setRaportInfoActive, setErrorGenerateMsg }) => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [pleaseWait, setPleaseWait] = useState(false);
    const [raportInfo, setRaportInfo] = useState({
        reportDate: new Date().toISOString().split('T')[0],
        agingDate: new Date().toISOString().split('T')[0],
        accountingDate: new Date().toISOString().split('T')[0],
        reportName: 'Draft 201 203_należności'
    });



    const getRaport = async () => {
        try {
            setPleaseWait(true);
            const result = await axiosPrivateIntercept.post("/fk/get-raport-data-v2");

            if (result.data.dataRaport.length === 0) {
                setErrorGenerateMsg(false);
                setRaportInfoActive(false);
                return setPleaseWait(false);

            }
            const accountArray = [
                ...new Set(
                    result.data.dataRaport
                        .filter((item) => item.RODZAJ_KONTA)
                        .map((item) => item.OBSZAR)
                ),
            ].sort();

            //zamieniam daty w stringu na typ Date, jeżeli zapis jest odpowiedni 
            const convertToDateIfPossible = (value) => {
                // Sprawdź, czy wartość jest stringiem w formacie yyyy-mm-dd
                const datePattern = /^\d{4}-\d{2}-\d{2}$/;
                if (typeof value === 'string' && datePattern.test(value)) {
                    const date = new Date(value);
                    if (!isNaN(date.getTime())) {
                        return date;
                    }
                }
                // Jeśli nie spełnia warunku lub nie jest datą, zwróć oryginalną wartość
                return "NULL";
            };

            // // usuwam wartości null, bo excel ma z tym problem
            const eraseNull = result.data.dataRaport.map(item => {

                const historyDoc = (value) => {
                    const raportCounter = `Dokument pojawił się w raporcie ${value.length} raz.`;

                    const infoFK = value.map(item => {

                        return [
                            " ",
                            item.info,
                            "Daty rozliczenia: ",
                            ...(Array.isArray(item.historyDate) && item.historyDate.length
                                ? item.historyDate
                                : ["brak daty rozliczenia"]),
                            "Decyzja: ",
                            ...(Array.isArray(item.historyText) && item.historyText.length
                                ? item.historyText
                                : ["brak decyzji biznesu"]),

                        ];
                    });

                    const mergedInfoFK = infoFK.flat();

                    mergedInfoFK.unshift(raportCounter);
                    return mergedInfoFK.join("\n");
                };
                return {
                    ...item,
                    ILE_DNI_NA_PLATNOSC_FV: item.ILE_DNI_NA_PLATNOSC_FV,
                    RODZAJ_KONTA: item.RODZAJ_KONTA,
                    NR_KLIENTA: item.NR_KLIENTA,
                    DO_ROZLICZENIA_AS: item.DO_ROZLICZENIA_AS ? item.DO_ROZLICZENIA_AS : "NULL",
                    DORADCA_FV: item.DORADCA ? item.DORADCA : "Brak danych",
                    ROZNICA: item.ROZNICA !== 0 ? item.ROZNICA : "NULL",
                    DATA_ROZLICZENIA_AS: item.DATA_ROZLICZENIA_AS ? convertToDateIfPossible(
                        item.DATA_ROZLICZENIA_AS) : "NULL",
                    BRAK_DATY_WYSTAWIENIA_FV: item.BRAK_DATY_WYSTAWIENIA_FV ? item.BRAK_DATY_WYSTAWIENIA_FV : " ",
                    JAKA_KANCELARIA: item.JAKA_KANCELARIA ? item.JAKA_KANCELARIA : " ",
                    ETAP_SPRAWY: item.ETAP_SPRAWY ? item.ETAP_SPRAWY : " ",
                    KWOTA_WPS: item.KWOTA_WPS ? item.KWOTA_WPS : " ",
                    CZY_SAMOCHOD_WYDANY_AS: item.CZY_SAMOCHOD_WYDANY_AS ? item.CZY_SAMOCHOD_WYDANY_AS : " ",
                    DATA_WYDANIA_AUTA: item.DATA_WYDANIA_AUTA ? convertToDateIfPossible(item.DATA_WYDANIA_AUTA) : " ",
                    OPIEKUN_OBSZARU_CENTRALI: Array.isArray(item.OPIEKUN_OBSZARU_CENTRALI)
                        ? item.OPIEKUN_OBSZARU_CENTRALI.join("\n")
                        : item.OPIEKUN_OBSZARU_CENTRALI,
                    OPIS_ROZRACHUNKU: Array.isArray(item.OPIS_ROZRACHUNKU)
                        ? item.OPIS_ROZRACHUNKU.join("\n\n")
                        : "NULL",
                    OWNER: Array.isArray(item.OWNER) ? item.OWNER.join("\n") : item.OWNER,
                    DATA_WYSTAWIENIA_FV: convertToDateIfPossible(
                        item.DATA_WYSTAWIENIA_FV
                    ),
                    TERMIN_PLATNOSCI_FV: convertToDateIfPossible(
                        item.TERMIN_PLATNOSCI_FV
                    ),
                    INFORMACJA_ZARZAD: Array.isArray(item.INFORMACJA_ZARZAD)
                        // ? item.INFORMACJA_ZARZAD.join("\n\n")
                        ? item.INFORMACJA_ZARZAD[item.INFORMACJA_ZARZAD.length - 1]
                        : " ",
                    HISTORIA_ZMIANY_DATY_ROZLICZENIA: item?.HISTORIA_ZMIANY_DATY_ROZLICZENIA > 0 ? item.HISTORIA_ZMIANY_DATY_ROZLICZENIA : " ",
                    OSTATECZNA_DATA_ROZLICZENIA: item.OSTATECZNA_DATA_ROZLICZENIA ? convertToDateIfPossible(item.OSTATECZNA_DATA_ROZLICZENIA) : " ",
                    VIN: item?.VIN ? item.VIN : ' ',
                    HISTORIA_WPISÓW_W_RAPORCIE: item?.HISTORIA_WPISOW ? historyDoc(item.HISTORIA_WPISOW) : null
                };
            }
            );

            const cleanDifferences = result.data.differences.map(item => {
                return {
                    ...item,
                    OWNER: Array.isArray(item.OWNER) ? item.OWNER.join("\n") : item.OWNER,
                    OPIEKUN_OBSZARU_CENTRALI: Array.isArray(item.OPIEKUN_OBSZARU_CENTRALI)
                        ? item.OPIEKUN_OBSZARU_CENTRALI.join("\n")
                        : item.OPIEKUN_OBSZARU_CENTRALI,
                    TERMIN_PLATNOSCI_FV: convertToDateIfPossible(
                        item.TERMIN_PLATNOSCI_FV
                    ),
                    DATA_WYSTAWIENIA_FV: convertToDateIfPossible(
                        item.DATA_WYSTAWIENIA_FV
                    ),
                    DO_ROZLICZENIA_AS: Number(item.DO_ROZLICZENIA_AS),
                    KONTROLA_DOC: item.NR_DOKUMENTU &&
                        !["PO", "NO"].includes(item.NR_DOKUMENTU.slice(0, 2)) && item.DO_ROZLICZENIA_AS > 0
                        ? "TAK"
                        : "NIE"
                };
            });
            // // rozdziela dane na poszczególne obszary BLACHARNIA, CZĘŚCI itd
            const resultArray = accountArray.reduce((acc, area) => {
                // Filtrujemy obiekty, które mają odpowiedni OBSZAR
                const filteredData = eraseNull.filter(item => item.OBSZAR === area);

                // Jeśli są dane, dodajemy obiekt do wynikowej tablicy
                if (filteredData.length > 0) {
                    // acc.push({ [area]: filteredData });
                    acc.push({ name: area, data: filteredData });
                }

                return acc;
            }, []);


            // /// tworzę osobny element tablicy dla arkusza WYDANE/NIEZAPŁACONE z warunkami, jest data wydania i nie jest rozliczone w AS
            const carDataSettlement = eraseNull.map(item => {
                if ((item.OBSZAR === "SAMOCHODY NOWE" || item.OBSZAR === "SAMOCHODY UŻYWANE") && item.DO_ROZLICZENIA_AS > 0 && item.CZY_SAMOCHOD_WYDANY_AS === "TAK") {
                    return item;
                }

            }).filter(Boolean);
            // // Dodajemy obiekt RAPORT na początku tablicy i  dodtkowy arkusz z róznicami księgowosć AS-FK
            const finalResult = [{ name: 'ALL', data: eraseNull }, { name: 'KSIĘGOWOŚĆ AS', data: cleanDifferences }, { name: 'WYDANE - NIEZAPŁACONE', data: carDataSettlement }, ...resultArray];



            // usuwam wiekowanie starsze niż < 0, 1 - 7 z innych niż arkusza RAPORT
            const updateAging = finalResult.map((element) => {
                if (element.name !== "ALL" && element.name !== "KSIĘGOWOŚĆ" && element.name !== 'KSIĘGOWOŚĆ AS' && element.data) {
                    const updatedData = element.data.filter((item) => {
                        return item.PRZEDZIAL_WIEKOWANIE !== "1 - 7" && item.PRZEDZIAL_WIEKOWANIE !== "< 0" && item.DO_ROZLICZENIA_AS > 0
                            &&
                            (item.TYP_DOKUMENTU === 'Faktura'
                                || item.TYP_DOKUMENTU === 'Faktura zaliczkowa'
                                || item.TYP_DOKUMENTU === 'Korekta'
                                || item.TYP_DOKUMENTU === 'Nota');
                    });
                    return { ...element, data: updatedData }; // Zwracamy zaktualizowany element
                } else {
                    const updatedData = element.data.map((item) => {
                        const { HISTORIA_WPISÓW_W_RAPORCIE, ...rest } = item;
                        return rest; // Zwróć obiekt bez tych dwóch kluczy
                    });
                    return { ...element, data: updatedData };
                }

                // Zwracamy element bez zmian, jeśli name === "Raport" lub data jest niezdefiniowana
            });



            //usuwam kolumny CZY_SAMOCHOD_WYDANY_AS, DATA_WYDANIA_AUTA z innych arkuszy niż Raport, SAMOCHODY NOWE, SAMOCHODY UŻYWANE
            const updateCar = updateAging.map((element) => {
                if (
                    element.name !== "ALL" &&
                    element.name !== "SAMOCHODY NOWE" &&
                    element.name !== "SAMOCHODY UŻYWANE" &&
                    element.name !== "WYDANE - NIEZAPŁACONE"
                ) {
                    const updatedData = element.data.map((item) => {
                        const { CZY_SAMOCHOD_WYDANY_AS, DATA_WYDANIA_AUTA, ...rest } = item;
                        return rest; // Zwróć obiekt bez tych dwóch kluczy
                    });
                    return { ...element, data: updatedData };
                }
                return element;
            });

            const updateVIN = updateCar.map((element) => {
                if (
                    element.name === "BLACHARNIA" ||
                    element.name === "CZĘŚCI"
                ) {
                    const updatedData = element.data.map((item) => {
                        const { VIN, ...rest } = item;
                        return rest; // Zwróć obiekt bez tych dwóch kluczy
                    });
                    return { ...element, data: updatedData };
                }
                return element;
            });
            // usuwam kolumnę BRAK DATY WYSTAWIENIA FV ze wszytskich arkuszy oprócz RAPORT
            const updateFvDate = updateVIN.map((element) => {
                if (element.name !== "ALL" && element.name !== 'KSIĘGOWOŚĆ AS') {

                    const filteredData = element.data.filter(item => item.CZY_W_KANCELARI === 'NIE');

                    const updatedData = filteredData.map((item) => {
                        const { BRAK_DATY_WYSTAWIENIA_FV, ROZNICA, JAKA_KANCELARIA, CZY_W_KANCELARI, KWOTA_WPS, ETAP_SPRAWY, DATA_ROZLICZENIA_AS, OPIS_ROZRACHUNKU, ILE_DNI_NA_PLATNOSC_FV, RODZAJ_KONTA, NR_KLIENTA, ...rest } = item;
                        return rest;
                    });
                    return { ...element, data: updatedData };
                }
                return element;
            });


            // usuwam kolumnę KONTROLA ze wszytskich arkuszy oprócz KSIĘGOWOŚĆ AS
            const updateControlColumn = updateFvDate.map((element) => {
                if (element.name !== 'KSIĘGOWOŚĆ AS') {
                    const updatedData = element.data.map((item) => {
                        const { KONTROLA, ...rest } = item;
                        return rest;
                    });
                    return { ...element, data: updatedData };
                }
                return element;
            });

            // usuwam kolumnę DORADCA ze wszytskich arkuszy oprócz BLACHARNIA
            const updateAdvisersColumn = updateFvDate.map((element) => {
                if (element.name !== 'BLACHARNIA') {
                    const updatedData = element.data.map((item) => {
                        const { DORADCA_FV, ...rest } = item;
                        return rest;
                    });
                    return { ...element, data: updatedData };
                }
                return element;
            });

            // obrabiam tylko dane działu KSIĘGOWOŚĆ
            const accountingData = updateAdvisersColumn.map(item => {
                if (item.name === 'KSIĘGOWOŚĆ') {
                    // pierwsze filtrowanie wszytskich danych
                    const dataDoc = eraseNull.filter(doc =>
                        doc.TYP_DOKUMENTU !== 'PK' &&
                        doc.TYP_DOKUMENTU !== 'Inne' &&
                        doc.TYP_DOKUMENTU !== 'Korekta' &&
                        doc.ROZNICA !== "NULL" &&
                        doc.DATA_ROZLICZENIA_AS !== "NULL" &&
                        doc.DATA_ROZLICZENIA_AS <= new Date(raportInfo.accountingDate)
                    );

                    // drugie filtrowanie wszytskich danych
                    const dataDoc2 = eraseNull.filter(doc =>
                        doc.TYP_DOKUMENTU === 'Korekta' &&
                        doc.DO_ROZLICZENIA_AS !== "NULL" &&
                        doc.ROZNICA !== "NULL"
                    );
                    const joinData = [...dataDoc, ...dataDoc2];
                    const updateDataDoc = joinData.map(prev => {
                        const { INFORMACJA_ZARZAD, OSTATECZNA_DATA_ROZLICZENIA, HISTORIA_ZMIANY_DATY_ROZLICZENIA, HISTORIA_WPISÓW_W_RAPORCIE, ...rest } = prev;
                        return rest;
                    });
                    return {
                        name: item.name,
                        data: updateDataDoc
                    };
                }
                return item;
            });

            //wyciągam tylko nr documentów do tablicy, żeby postawić znacznik przy danej fakturze, żeby mozna było pobrać do tabeli wyfiltrowane dane z tabeli
            const excludedNames = ['ALL', 'KSIĘGOWOŚĆ', 'WYDANE - NIEZAPŁACONE', 'KSIĘGOWOŚĆ AS'];
            const markDocuments = updateControlColumn
                .filter(doc => !excludedNames.includes(doc.name)) // Filtruj obiekty o nazwach do wykluczenia
                .flatMap(doc => doc.data) // Rozbij tablice data na jedną tablicę
                .map(item => item.NR_DOKUMENTU); // Wyciągnij klucz NR_DOKUMENTU

            //wysyłam dane do serwera, żeby zrobić znaczniki przy dokumentach w wygenerowanym raporcie, aby użytkownik mógł pracowac tylko na tych dokumentach
            // await axiosPrivateIntercept.post(
            //     `/fk/send-document-mark-fk`,
            //     markDocuments
            // );

            //sortowanie obiektów wg kolejności, żeby arkusze w excel były odpowiednio posortowane
            const sortOrder = ["ALL", "WYDANE - NIEZAPŁACONE", "BLACHARNIA", "CZĘŚCI", "F&I", "KSIĘGOWOŚĆ", "KSIĘGOWOŚĆ AS", "SAMOCHODY NOWE", "SAMOCHODY UŻYWANE", "SERWIS", "WDT",];

            const sortedArray = accountingData.sort((a, b) =>
                sortOrder.indexOf(a.name) - sortOrder.indexOf(b.name)
            );

            getExcelRaportV2(sortedArray, raportInfo);
            setRaportInfoActive(false);
            setPleaseWait(false);
        }
        catch (error) {
            console.error(error);

        }
    };
    return (
        <>
            {pleaseWait ? <PleaseWait /> :
                <section className='info_for_raportFK'>
                    <section className='info_for_raportFK__wrapper'>
                        <section className='info_for_raportFK-title'>
                            <label>Wprowadź dane do raportu.</label>
                        </section >
                        <section className='info_for_raportFK__container'>
                            <section className='info_for_raportFK__box'>

                                <LocalizationProvider dateAdapter={AdapterDayjs}
                                    adapterLocale="pl"
                                >
                                    <DatePicker
                                        label="Data zestawienia:"
                                        value={dayjs(raportInfo.reportDate)}
                                        onChange={(newValue) => {
                                            const formattedDate = newValue ? newValue.format('YYYY-MM-DD') : '';
                                            setRaportInfo({ ...raportInfo, reportDate: formattedDate });
                                        }}
                                    />
                                    <DatePicker
                                        label="Wiekowanie na dzień:"
                                        value={dayjs(raportInfo.agingDate)}
                                        onChange={(newValue) => {
                                            const formattedDate = newValue ? newValue.format('YYYY-MM-DD') : '';
                                            setRaportInfo({ ...raportInfo, agingDate: formattedDate });
                                        }}
                                    />
                                </LocalizationProvider>
                            </section>
                            <section className='info_for_raportFK__box'>
                                <LocalizationProvider dateAdapter={AdapterDayjs}
                                    adapterLocale="pl"
                                >
                                    <DatePicker
                                        label="Data rozliczenia AS:"
                                        value={dayjs(raportInfo.reportDate)}
                                        onChange={(newValue) => {
                                            const formattedDate = newValue ? newValue.format('YYYY-MM-DD') : '';
                                            setRaportInfo({ ...raportInfo, accountingDate: formattedDate });
                                        }}
                                    />

                                </LocalizationProvider>
                            </section>
                            <section className='info_for_raportFK__box'>

                                <Box
                                    component="form"
                                    sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField id="standard-basic"
                                        label="Nazwa zestawienia:"
                                        variant="standard"
                                        value={raportInfo.reportName}
                                        onChange={(e) => setRaportInfo({ ...raportInfo, reportName: e.target.value })}
                                    />
                                </Box>
                            </section>
                        </section>
                        <section className='info_for_raportFK-confirm'>
                            <Button
                                color="secondary"
                                variant="contained"
                                onClick={() => setRaportInfoActive(false)}
                            >Anuluj</Button>

                            <Button
                                variant="contained"
                                color="success"
                                onClick={getRaport}>

                                Pobierz Raport
                            </Button>
                        </section>
                    </section>
                </section>
            }
        </>
    );
};

export default InfoForRaportFK;