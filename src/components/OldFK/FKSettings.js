import { useEffect, useState, useMemo } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import FKTable from "./FKTable";
import FKRaport from "./FKRaport";

import './FKSettings.css';

const FKSettings = () => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [data, setData] = useState([]);
    const [filteredDataRaport, setFilteredDataRaport] = useState([]);
    const [filter, setFilter] = useState({
        business: "owner",
        payment: "Wszystko",
    });
    const [showRaport, setShowRaport] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [tableData, setTableData] = useState([]);


    // zmienna przeniesiona tutaj, zeby po zamknięciu tabeli nie gubiło rozwiajnych list
    const [showData, setShowData] = useState({
        W201: false,
        W203: false
    });

    const sendDataFromExcel = async (e) => {
        const file = e.target.files[0];
        if (!file) return console.log('Brak pliku');
        if (!file.name.endsWith('.xlsx')) {
            console.log('Akceptowany jest tylko plik z rozszerzeniem .xlsx');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('excelFile', file);
            const response = await axiosPrivateIntercept.post('/fk/send-documents', formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
        }
        catch (err) {
            console.error('Błąd przesyłania pliku:', err);
        }
    };



    const getFilteredData = () => {

        let filteredData = data;

        // if (filter.business !== "Wszystko") {
        //     if (filter.business === "201") {
        //         filteredData = filteredData.filter(item => item['RODZAJ KONTA'] === 201);
        //     } else if (filter.business === "203") {
        //         filteredData = filteredData.filter(item => item['RODZAJ KONTA'] === 203);
        //     }
        // }

        if (filter.payment !== "Wszystko") {
            if (filter.payment === "Przeterminowane") {
                filteredData = filteredData.filter(item => item['PRZETERMINOWANE/NIEPRZETERMINOWANE'] === "PRZETERMINOWANE");
            } else if (filter.payment === "Nieprzeterminowane") {
                filteredData = filteredData.filter(item => item['PRZETERMINOWANE/NIEPRZETERMINOWANE'] === "NIEPRZETERMINOWANE");
            }
        }

        setFilteredDataRaport(filteredData);
        setShowRaport(true);
        setShowTable(false);

    };

    useEffect(() => {
        setShowRaport(false);
        setShowData({
            W201: false,
            W203: false
        });
    }, [filter]);

    useEffect(() => {
        const getDataFromDB = async () => {
            const response = await axiosPrivateIntercept.get('/fk/get-data');
            setData(response.data);
        };
        getDataFromDB();
    }, []);

    return (
        <section className='fk_settings'>
            <section className="fk_settings-create">
                <section className='fk_settings-business'>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Obszar biznesu</FormLabel>
                        <RadioGroup
                            // aria-labelledby="demo-radio-buttons-group-label"
                            value={filter.business}
                            onChange={(e) => setFilter(prev => {
                                return {
                                    ...prev,
                                    business: e.target.value
                                };
                            })}
                            name="radio-buttons-group"
                        >
                            <FormControlLabel value="owner" control={<Radio />} label="Owner" />
                            <FormControlLabel value="aging" control={<Radio />} label="Wiekowanie" />
                            {/* <FormControlLabel value="law" control={<Radio />} label="Kancelaria" /> */}
                        </RadioGroup>
                    </FormControl>
                </section>
                <section className='fk_settings-control'>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Termin płatności</FormLabel>
                        <RadioGroup
                            // aria-labelledby="demo-radio-buttons-group-label"
                            value={filter.payment}
                            onChange={(e) => setFilter(prev => {
                                return {
                                    ...prev,
                                    payment: e.target.value
                                };
                            })}
                            name="radio-buttons-group"
                        >
                            <FormControlLabel value="Wszystko" control={<Radio />} label="Wszystko" />
                            <FormControlLabel value="Przeterminowane" control={<Radio />} label="Przeterminowane" />
                            <FormControlLabel value="Nieprzeterminowane" control={<Radio />} label="Nieprzeterminowane" />
                        </RadioGroup>
                    </FormControl>
                </section>
                <section className='fk_settings-generate'>
                    <Button
                        variant="contained"
                        disabled={data.length > 0 ? false : true}
                        onClick={getFilteredData}
                    >Generuj raport</Button>
                </section>
            </section>

            {showTable && <FKTable tableData={tableData} setShowTable={setShowTable} />}
            {showRaport && !showTable &&
                < FKRaport
                    setTableData={setTableData}
                    setShowTable={setShowTable}
                    filter={filter}
                    filteredDataRaport={filteredDataRaport}
                    showData={showData}
                    setShowData={setShowData}
                />}

            {/* <section className='fk_settings'>
                <input
                    type="file"
                    name="uploadfile"
                    id="fk"
                    style={{ display: "none" }}
                    onChange={(e) => sendDataFromExcel(e)}
                />
                <label htmlFor="fk" className="fk_settings-click-me">Prześlij rozrachunki</label>
            </section> */}
        </section >
    );
};

export default FKSettings;