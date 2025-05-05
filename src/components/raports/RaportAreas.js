import { useState, useEffect } from "react";
import PleaseWait from "../PleaseWait";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import { saveAs } from "file-saver";
import Button from '@mui/material/Button';


const RaportAreas = () => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [pleaseWait, setPleaseWait] = useState(false);
    const [raportInfo, setRaportInfo] = useState({
        company: 'KRT',
        docDateFrom: '2025-01-01',
        docDateTo: '2025-04-30',
        areas: ['SERWIS', 'CZĘŚCI', 'BLACHARNIA'],
        accountingDate: new Date().toISOString().split('T')[0],
        reportName: 'Raport Area'
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
            // const blob = new Blob([response.data], {
            //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            // });

            // saveAs(blob, `Raport_${raportInfo.reportName}.xlsx`);

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
            {pleaseWait ? <PleaseWait /> : <section className="raport-areas">
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