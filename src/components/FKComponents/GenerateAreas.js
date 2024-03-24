import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import GenerateCars from './GenerateCars';
import GenerateOwners from './GenerateOwners';

const GenerateAreas = ({ showTable, area, filteredData, setTableData, setShowTable }) => {

    const [arrow, setArrow] = useState({
        [area]: false
    });

    const counter = filteredData.reduce((acc, item) => {
        if (item['OBSZAR'] === area) {
            acc++;
        }
        return acc;
    }, 0);

    let sum = 0;
    const docSum = filteredData.map(item => {
        if (item['OBSZAR'] === area) {
            sum += item[' KWOTA DO ROZLICZENIA FK '];
        }
        return sum;
    });

    const filteredObjects = filteredData.filter(obj => obj['OBSZAR'] === area);


    const handleClick = () => {
        setTableData(filteredObjects);
        setShowTable(true);

    };

    let generateItems = [];
    if (arrow[area]) {

        if (area === 'SAMOCHODY NOWE' || area === 'SAMOCHODY UŻYWANE') {
            const carsIssued = ["TAK", "NIE"];
            generateItems = carsIssued.map((car, index) => {
                return (
                    < GenerateCars
                        key={index}
                        filteredData={filteredObjects}
                        area={area}
                        carsIssued={car}
                        setTableData={setTableData}
                        showTable={showTable}
                        setShowTable={setShowTable}
                    />
                );
            });
        }
        else {
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
    }

    return (
        < >
            <section className="fk_raport-w201"
                style={counter === 0 || showTable ? { display: "none" } : null}
            >
                <label
                    className="fk_raport-w201--arrow"
                    onClick={() => setArrow(
                        {
                            [area]: !arrow[area]
                        }
                    )}
                >
                    <IoIosArrowDown
                        className='fk_raport-business--arrow'
                        style={!arrow[area] ? null : { rotate: "180deg" }}
                    />
                    {area}</label>
                <label className="fk_raport-w201--doc-counter" onDoubleClick={handleClick}>{counter}</label>
                <label className="fk_raport-w201--doc-sum">{(sum).toLocaleString('pl-PL', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                })}</label>
            </section>
            {generateItems}

        </ >
    );

};

export default GenerateAreas;