import React, { useEffect, useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import GenerateAreas from './GenerateAreas';


const GenerateAccount = ({ account, showTable, filteredDataRaport, setTableData, setShowTable }) => {
    const [arrow, setArrow] = useState({
        [account]: false
    });

    const [businessAccount, setBusinessAccount] = useState({
        accountArea: [],
    });

    const counter = filteredDataRaport.reduce((acc, item) => {
        if (account === "201203") {
            acc++;
        } else {
            if (item['RODZAJ KONTA'] === Number(account)) {
                acc++;
            }
        }
        return acc;
    }, 0);

    let sum = 0;
    const docSum = filteredDataRaport.map(item => {
        if (account === "201203") {
            sum += item[' KWOTA DO ROZLICZENIA FK '];
        }
        else {
            if (item['RODZAJ KONTA'] === Number(account)) {
                sum += item[' KWOTA DO ROZLICZENIA FK '];
            }
        }
    });
    let filteredObjects = [];
    if (account === '201203') {
        filteredObjects = [...filteredDataRaport];
    }
    else {
        filteredObjects = filteredDataRaport.filter(obj => obj['RODZAJ KONTA'] === Number(account));
    }

    const handleClick = () => {
        setTableData(filteredObjects);
        setShowTable(true);
    };


    const generateItems = (businessAccount.accountArea).map((area, index) => {
        return (
            <GenerateAreas
                key={index}
                area={area}
                filteredData={filteredObjects}
                setTableData={setTableData}
                showTable={showTable}
                setShowTable={setShowTable}
            />
        );

    });

    useEffect(() => {

        const accountArray = [...new Set(filteredObjects.filter(item => item['RODZAJ KONTA']).map(item => item['OBSZAR']))].sort();
        setBusinessAccount({
            accountArea: accountArray
        });
    }, [account]);


    return (<>
        <section className='fk_raport-business' >
            <label
                className='fk_raport-business--select'
                onClick={() => setArrow({
                    [account]: !arrow[account]
                })}
            >
                <IoIosArrowDown
                    className='fk_raport-business--arrow'
                    style={!arrow[account] ? null : { rotate: "180deg" }}
                />
                {account === "201203" ? "201 - 203" : account}</label >
            <label className='fk_raport-title--doc-counter' onDoubleClick={handleClick}>
                {counter}
            </label>
            <label className='fk_raport-title--doc-sum'>{sum.toLocaleString('pl-PL', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
            })}</label>
        </section >
        {arrow[account] && generateItems}
    </>
    );
};

export default GenerateAccount;