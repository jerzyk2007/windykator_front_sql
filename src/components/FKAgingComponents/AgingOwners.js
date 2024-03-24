import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import './AgingOwners.css';

const AgingOwners = ({ filteredData, own, setTableData, showTable, setShowTable, style }) => {
    const [arrow, setArrow] = useState({
        [own]: false
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

    const percent = "do ustalenia";

    const handleClick = () => {
        setTableData(filteredObjects);
        setShowTable(true);
    };


    return (
        <>
            <section className="aging_owners"
                style={counter === 0 || showTable ? { display: "none" } : null}
            >
                <label
                    className={style === "car" ? 'aging_owners--select aging_owners--select--car' : "aging_owners--select"}
                    onClick={() => setArrow(
                        {
                            [own]: !arrow[own]
                        }
                    )}
                >
                    {/* <IoIosArrowDown
                        className='aging_owners--arrow'
                        style={!arrow[own] ? null : { rotate: "180deg" }}
                    /> */}
                    {own}</label>
                <label className="aging_owners--doc-counter" onDoubleClick={handleClick}>{counter}</label>
                <label className="aging_owners--doc-sum" onDoubleClick={handleClick}>{(sum).toLocaleString('pl-PL', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                })}</label>
                <label className='generate-areas--percent' onDoubleClick={handleClick}>{percent}</label>
            </section>
        </>
    );
};

export default AgingOwners;