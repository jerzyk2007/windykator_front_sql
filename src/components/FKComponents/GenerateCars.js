import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import GenerateOwners from './GenerateOwners';


const GenerateCars = ({ area, filteredData, carsIssued, setTableData, showTable, setShowTable }) => {
    const [arrow, setArrow] = useState({
        car: false
    });

    const counter = filteredData.reduce((acc, item) => {
        if (item['CZY SAMOCHÓD WYDANY (dane As3)'] === carsIssued) {
            acc++;
        }
        return acc;
    }, 0);

    let sum = 0;
    const docSum = filteredData.map(item => {
        if (item['CZY SAMOCHÓD WYDANY (dane As3)'] === carsIssued) {
            sum += item[' KWOTA DO ROZLICZENIA FK '];
        }
        return sum;
    });

    const filteredObjects = filteredData.filter(obj => obj['CZY SAMOCHÓD WYDANY (dane As3)'] === carsIssued);

    const handleClick = () => {
        setTableData(filteredObjects);
        setShowTable(true);
    };

    let generateItems = [];
    if (arrow.car) {
        const owner = [...new Set(filteredObjects.filter(own => own['OBSZAR'] === area).map(own => own['OWNER']))];
        generateItems = owner.map((own, index) => {
            return (
                < GenerateOwners
                    key={index}
                    filteredData={filteredObjects}
                    area={area}
                    own={own}
                    setTableData={setTableData}
                    showTable={showTable}
                    setShowTable={setShowTable}
                />
            );
        });

    }

    return (
        < >
            <section className="fk_raport-w201 fk_raport-w201--owner"
                style={counter === 0 || showTable ? { display: "none" } : null}
            >

                <label
                    className="fk_raport-w201--arrow fk_raport-w201--arrow--owner"
                    onClick={() => setArrow({ car: !arrow.car })}


                >
                    <IoIosArrowDown
                        className='fk_raport-business--arrow'
                        style={!arrow.car ? null : { rotate: "180deg" }}
                    />
                    {carsIssued === "TAK" ? "AUTA WYDANE" : "AUTA NIEWYDANE"}</label>
                <label className="fk_raport-w201--doc-counter" onDoubleClick={handleClick} >{counter}</label>
                <label className="fk_raport-w201--doc-sum" onDoubleClick={handleClick}>{(sum).toLocaleString('pl-PL', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                })}</label>
            </section >
            {generateItems}

        </>
    );
};

export default GenerateCars;