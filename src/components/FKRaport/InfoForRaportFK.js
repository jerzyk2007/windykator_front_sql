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
import { saveAs } from "file-saver";


import './InfoForRaportFK.css';

const InfoForRaportFK = ({ setRaportInfoActive, setErrorGenerateMsg, setGetRaportInfo, company }) => {
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
            const response = await axiosPrivateIntercept.post(
                `/fk/get-raport-data/${company}`,
                { raportInfo },
                {
                    responseType: 'blob', // 👈 najważniejsze: pobieramy jako blob
                }
            );
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            saveAs(blob, `Raport_${raportInfo.reportName}.xlsx`);

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
                                onClick={() => { setRaportInfoActive(false); setGetRaportInfo(true); }}
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