import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import GenerateDepartments from './GenerateDepartments';

const GenerateOwners = ({ owner, filteredData, own, setTableData, showTable, setShowTable }) => {
    const [arrow, setArrow] = useState({
        [owner]: false
    });


    const counter = filteredData.reduce((acc, doc) => {
        if (doc['OWNER'] === own) {
            acc++;
        }

        return acc;
    }, 0);

    let sum = 0;
    const docSum = filteredData.map(item => {
        if (item['OWNER'] === own) {
            sum += item[' KWOTA DO ROZLICZENIA FK '];
        }
        return sum;
    });

    const filteredObjects = filteredData.filter(obj => obj['OWNER'] === own);

    const handleClick = () => {
        setTableData(filteredObjects);
        setShowTable(true);
    };

    let generateItems = [];
    if (arrow[owner]) {
        const departments = [...new Set(filteredObjects.filter(dep => dep['OWNER'] === own).map(dep => dep['DZIAŁ']))];
        generateItems = departments.map((dep, index) => {
            return (
                <GenerateDepartments
                    key={index}
                    dep={dep}
                    filteredData={filteredObjects}
                    setTableData={setTableData}
                    showTable={showTable}
                    setShowTable={setShowTable}
                />);
        });

    }

    return (
        <>
            <section className="fk_raport-w201 fk_raport-w201--owner"
                style={counter === 0 || showTable ? { display: "none" } : null}>
                <label
                    className="fk_raport-w201--arrow"
                    onClick={() => setArrow(
                        {
                            [owner]: !arrow[owner]
                        }
                    )}
                >
                    <IoIosArrowDown
                        className='fk_raport-business--arrow'
                        style={!arrow[owner] ? null : { rotate: "180deg" }}
                    />
                    {own}</label>
                <label className="fk_raport-w201--doc-counter" onDoubleClick={handleClick}>{counter}</label>
                <label className="fk_raport-w201--doc-sum">{(sum).toLocaleString('pl-PL', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                })}</label>
            </section>
            {generateItems}
        </>
    );
};

export default GenerateOwners;