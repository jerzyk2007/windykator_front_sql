import React, { useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";

const GenerateAging = ({ age, filteredData, setTableData, setShowTable, showTable }) => {
    const [arrow, setArrow] = useState({
        [age]: false
    });

    const counter = filteredData.reduce((acc, doc) => {
        if (doc['Przedział'] === age) {
            acc++;
        }
        return acc;
    }, 0);

    let sum = 0;
    const docSum = filteredData.map(item => {
        if (item['Przedział'] === age) {
            sum += item[' KWOTA DO ROZLICZENIA FK '];
        }
        return sum;
    });
    const filteredObjects = filteredData.filter(obj => obj['Przedział'] === age);

    const handleClick = () => {
        setTableData(filteredObjects);
        setShowTable(true);
    };

    return (
        <>
            <section className="fk_raport-w201 fk_raport-w201--owner"
                style={counter === 0 || showTable ? { display: "none" } : null}>
                <label
                    className="fk_raport-w201--arrow"
                    onClick={() => setArrow(
                        {
                            [age]: !arrow[age]
                        }
                    )}
                >
                    <IoIosArrowDown
                        className='fk_raport-business--arrow'
                        style={!arrow[age] ? null : { rotate: "180deg" }}
                    />
                    {age}</label>
                <label className="fk_raport-w201--doc-counter" onDoubleClick={handleClick}>{counter}</label>
                <label className="fk_raport-w201--doc-sum">{(sum).toLocaleString('pl-PL', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                })}</label>
            </section>
        </>
    );
};

export default GenerateAging;