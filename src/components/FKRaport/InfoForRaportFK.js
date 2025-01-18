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

const InfoForRaportFK = ({ setRaportInfoActive }) => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [pleaseWait, setPleaseWait] = useState(false);
    const [raportInfo, setRaportInfo] = useState({
        reportDate: new Date().toISOString().split('T')[0],
        agingDate: new Date().toISOString().split('T')[0],
        reportName: 'Draft 201 203_należności'
    });

    const getRaport = async () => {
        try {
            setPleaseWait(true);
            const result = await axiosPrivateIntercept.post("/fk/get-raport-data-v2");

            const accountArray = [
                ...new Set(
                    result.data
                        .filter((item) => item.RODZAJ_KONTA)
                        .map((item) => item.OBSZAR)
                ),
            ].sort();

            // usuwam wartości null, bo excel ma z tym problem
            const eraseNull = result.data.map(item => {

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


                return {
                    ...item,
                    ILE_DNI_NA_PLATNOSC_FV: item.ILE_DNI_NA_PLATNOSC_FV,
                    RODZAJ_KONTA: item.RODZAJ_KONTA,
                    NR_KLIENTA: item.NR_KLIENTA,
                    DO_ROZLICZENIA_AS: item.DO_ROZLICZENIA_AS ? item.DO_ROZLICZENIA_AS : "NULL",
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
                        ? item.INFORMACJA_ZARZAD.join("\n\n")
                        : "NULL",
                    HISTORIA_ZMIANY_DATY_ROZLICZENIA: item?.HISTORIA_ZMIANY_DATY_ROZLICZENIA > 0 ? item.HISTORIA_ZMIANY_DATY_ROZLICZENIA : " ",
                    OSTATECZNA_DATA_ROZLICZENIA: item.OSTATECZNA_DATA_ROZLICZENIA ? convertToDateIfPossible(item.OSTATECZNA_DATA_ROZLICZENIA) : " ",
                    VIN: item?.VIN ? item.VIN : ' '
                };
            }
            );
            // rozdziela dane na poszczególne obszary BLACHARNIA, CZĘŚCI itd
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


            /// tworzę osobny element tablicy dla arkusza WYDANE/NIEZAPŁACONE z warunkami, jest data wydania i nie jest rozliczone w AS
            const carDataSettlement = eraseNull.map(item => {
                if ((item.OBSZAR === "SAMOCHODY NOWE" || item.OBSZAR === "SAMOCHODY UŻYWANE") && item.DO_ROZLICZENIA_AS > 0 && item.CZY_SAMOCHOD_WYDANY_AS === "TAK") {
                    return item;
                }

            }).filter(Boolean);
            // // Dodajemy obiekt RAPORT na początku tablicy
            const finalResult = [{ name: 'ALL', data: eraseNull }, { name: 'WYDANE - NIEZAPŁACONE', data: carDataSettlement }, ...resultArray];


            // usuwam wiekowanie starsze niż <0, 1-7 z innych niż arkusza RAPORT
            const updateAging = finalResult.map((element) => {
                if (element.name !== "ALL" && element.data) {
                    const updatedData = element.data.filter((item) => {
                        return item.PRZEDZIAL_WIEKOWANIE !== "1-7" && item.PRZEDZIAL_WIEKOWANIE !== "<0" && item.DO_ROZLICZENIA_AS > 0;
                    });
                    return { ...element, data: updatedData }; // Zwracamy zaktualizowany element
                }

                return element; // Zwracamy element bez zmian, jeśli name === "Raport" lub data jest niezdefiniowana
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
                if (element.name !== "ALL") {

                    const filteredData = element.data.filter(item => item.CZY_W_KANCELARI === 'NIE');

                    const updatedData = filteredData.map((item) => {
                        const { BRAK_DATY_WYSTAWIENIA_FV, ROZNICA, JAKA_KANCELARIA, CZY_W_KANCELARI, KWOTA_WPS, ETAP_SPRAWY, ...rest } = item;
                        return rest;
                    });
                    return { ...element, data: updatedData };
                }
                return element;
            });

            //wysyłam dane do serwera, żeby zrobić znaczniki przy dokumentach w wygenerowanym raporcie, aby użytkownik mógł pracowac tylko na tych dokumentach
            axiosPrivateIntercept.post(
                `/fk/send-document-mark-fk`,
                updateFvDate
            );

            // getExcelRaportV2(updateFvDate, raportInfo);
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
                                    // onChange={(e) => console.log(e.target.value)}
                                    onChange={(e) => setRaportInfo({ ...raportInfo, reportName: e.target.value })}
                                />
                            </Box>
                            {/* <span>{raportInfo.reportDate}</span> */}
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