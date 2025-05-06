import { useState, useEffect } from "react";
import PleaseWait from "../PleaseWait";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import { saveAs } from "file-saver";
import Button from '@mui/material/Button';
import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import './RaportAreas.css';

const RaportAreas = () => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [pleaseWait, setPleaseWait] = useState(false);
    const [raportInfo, setRaportInfo] = useState({
        company: 'KRT',
        docDateFrom: '2024-01-01',
        docDateTo: '2025-04-30',
        areas: ['SERWIS', 'CZĘŚCI', 'BLACHARNIA'],
        accountingDate: new Date().toISOString().split('T')[0],
        reportName: 'Raport_Area',
        company: ['KRT', 'KEM',],
        colorCheckBox: ["primary", "neutral", "danger", "success", "warning"]
    });

    const getRaport = async () => {
        try {
            setPleaseWait(true);
            const response = await axiosPrivateIntercept.post(
                `/raport/get-raport-area`,
                { raportData: raportInfo },
                {
                    responseType: 'blob', // 👈 najważniejsze: pobieramy jako blob
                }
            );
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            saveAs(blob, `${raportInfo.reportName}.xlsx`);

        }
        catch (error) {
            console.error(error);
        }
        finally {
            setPleaseWait(false);

        }
    };

    return (
        <>
            {pleaseWait ? <PleaseWait /> :
                <section className="raport-areas">
                    <section className="raport-areas__container">
                        <section className="raport-areas__container-item">
                            <span className="raport-areas__container-title">Wybierz firmę:</span>

                            <section className="raport-areas__container-select">
                                {raportInfo.company.map((item, index) => {
                                    const color = raportInfo.colorCheckBox[index % raportInfo.colorCheckBox.length];
                                    return (
                                        <Checkbox className="raport-areas__container-select--item" key={index} label={item} color={color} defaultChecked />
                                    );
                                })}
                            </section>
                        </section>


                    </section>

                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={getRaport}
                    >Pobierz</Button>
                </section>
            }
        </>

    );
};

export default RaportAreas;