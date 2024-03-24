import React, { useState, useEffect } from "react";
import FKTable from "./FKTable";
import GenerateAccount from "./FKComponents/GenerateAccount";
import Button from '@mui/material/Button';
import './FKRaport.css';

const FKRaport = ({ filteredDataRaport, showTable, setTableData, tableData, setShowTable, filter }) => {

    const [businessAccount, setBusinessAccount] = useState({
        [filter.business]: [],
    });

    const [buttonArea, setButtonArea] = useState([]);

    const handleButtonClick = (data) => {
        setTableData(data);
        setShowTable(true);
    };

    useEffect(() => {
        let accountArray = [];
        if (filter.business === "201203") {
            accountArray = [...new Set(filteredDataRaport.filter(item => item['RODZAJ KONTA']).map(item => item['OBSZAR']))].sort();
        } else {
            accountArray = [...new Set(filteredDataRaport.filter(item => item['RODZAJ KONTA'] === Number(filter.business)).map(item => item['OBSZAR']))].sort();

        }
        setBusinessAccount({
            [filter.business]: accountArray
        });
    }, [filter]);



    const buttonItems = buttonArea.map((item, index) => {
        return (
            <section className='fk_raport-panel--item' key={index}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleButtonClick(item.data)}
                >{item.name}</Button>

            </section>
        );
    });

    // useEffect(() => {
    //     console.log(buttonArea);
    // }, [buttonArea]);


    return (
        <>
            <section className='fk_raport' >
                <section className='fk_raport-panel' >
                    {buttonItems}
                </section>

                <section className='fk_raport-title' >
                    <label className='fk_raport-title--business--header'>Obszar </label>
                    <label className='fk_raport-title--doc-counter--header'>Liczba dokumentów</label>
                    <label className='fk_raport-title--doc-sum--header'>Kwota do rozliczenia</label>
                    <label className='fk_raport-title--percent--header'>Procent</label>
                </section>

                {filter.raport === "accountRaport" &&
                    <GenerateAccount
                        style=""
                        account={filter.business}
                        filteredDataRaport={filteredDataRaport}
                        setTableData={setTableData}
                        showTable={showTable}
                        setShowTable={setShowTable}
                        buttonArea={buttonArea}
                        setButtonArea={setButtonArea}
                    />}


            </section >
            {showTable && <FKTable tableData={tableData} setShowTable={setShowTable} />}
        </>
    );
};

export default FKRaport;