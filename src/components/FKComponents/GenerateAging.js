import React, { useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import './GenerateAging.css';

const GenerateAging = ({ age, filteredData, setTableData, setShowTable, showTable, style }) => {
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

    const percent = "do ustalenia";

    const filteredObjects = filteredData.filter(obj => obj['Przedział'] === age);

    const handleClick = () => {
        setTableData(filteredObjects);
        setShowTable(true);
    };

    return (
        <>
            <section className='generate_aging' >
                <label
                    // className='generate_aging--select'
                    className={style === "car" ? 'generate_aging--select generate_aging--select--car' : "generate_aging--select"}
                    onClick={() => setArrow({
                        [age]: !arrow[age]
                    })}
                >
                    {/* <IoIosArrowDown
                        className='generate_aging--arrow'
                        style={!arrow[age] ? null : { rotate: "180deg" }}
                    /> */}
                    {age}</label >
                <label className='generate_aging--doc-counter' onDoubleClick={handleClick}>
                    {counter}
                </label>
                <label className='generate_aging--doc-sum' onDoubleClick={handleClick}>{sum.toLocaleString('pl-PL', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                })}</label>
                <label className='generate_aging--percent' onDoubleClick={handleClick}>{percent}</label>
            </section >
        </>
    );
};

export default GenerateAging;