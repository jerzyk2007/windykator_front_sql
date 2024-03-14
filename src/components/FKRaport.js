import React, { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import './FKRaport.css';

const FKRaport = ({ filteredDataRaport, setTableData, setShowTable, filter, showData, setShowData }) => {


    const [businessArea, setBusinessArea] = useState({
        W201: [...new Set(filteredDataRaport.filter(item => item['RODZAJ KONTA'] === 201).map(item => item['OBSZAR']))],
        W203: [...new Set(filteredDataRaport.filter(item => item['RODZAJ KONTA'] === 203).map(item => item['OBSZAR']))]
    });

    const [arrow, setArrow] = useState({});



    const wCounter = (area, account) => {
        const count = filteredDataRaport.reduce((acc, item) => {
            if (item['OBSZAR'] === area && item['RODZAJ KONTA'] === account) {
                acc++;
            }
            return acc;
        }, 0);

        return count;
    };

    const sumOfCount = (area, account) => {
        let sum = 0;
        const docSum = filteredDataRaport.map(item => {
            if (item['OBSZAR'] === area && item['RODZAJ KONTA'] === account) {
                sum += item[' KWOTA DO ROZLICZENIA FK '];
            }
        });
        return sum;
    };


    const generateW201Items = (businessArea.W201).map((item, index) => {
        const counter = wCounter(item, 201);
        const sum = sumOfCount(item, 201);
        const handleClick = () => {
            // Filtruj obiekty na podstawie nazwy (item) i wyświetl je w konsoli
            const filteredObjects = filteredDataRaport.filter(obj => obj['OBSZAR'] === item && obj['RODZAJ KONTA'] === 201);

            setTableData(filteredObjects);
            setShowTable(true);

        };


        const owner = [...new Set(filteredDataRaport.filter(own => own['RODZAJ KONTA'] === 201 && own['OBSZAR'] === item).map(own => own['OWNER']))];

        const owner201 = owner.map((own, index) => {
            const counterOwner = filteredDataRaport.reduce((acc, doc) => {
                if (doc['OBSZAR'] === item && doc['RODZAJ KONTA'] === 201 && doc['OWNER'] === own) {
                    acc++;
                }
                return acc;
            }, 0);

            let ownerSum = 0;
            const docSum = filteredDataRaport.map(dataSum => {
                if (dataSum['OBSZAR'] === item && dataSum['RODZAJ KONTA'] === 201 && dataSum['OWNER'] === own) {
                    ownerSum += dataSum[' KWOTA DO ROZLICZENIA FK '];
                }
            });

            const handleClickOwner = () => {
                const filteredObjects = filteredDataRaport.filter(obj => obj['OBSZAR'] === item && obj['RODZAJ KONTA'] === 201 && obj['OWNER'] === own);

                setTableData(filteredObjects);
                setShowTable(true);
            };

            return (
                <section key={index} className="fk_raport-w201 fk_raport-w201--owner">
                    <label className="fk_raport-w201--arrow fk_raport-w201--arrow--owner">
                        {own}</label>
                    <label className="fk_raport-w201--doc-counter" onDoubleClick={handleClickOwner}>{counterOwner}</label>
                    <label className="fk_raport-w201--doc-sum">{(ownerSum).toLocaleString('pl-PL', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                    })}</label>
                </section>
            );
        });

        return (
            <React.Fragment key={index}>
                <section className="fk_raport-w201" style={counter === 0 ? { display: "none" } : null}>
                    <label
                        className="fk_raport-w201--arrow"
                        onClick={() => setArrow(prev => {
                            return {
                                ...prev,
                                [item]: !arrow[item]
                            };
                        })}
                    >
                        <IoIosArrowDown
                            className='fk_raport-business--arrow'
                            style={!arrow[item] ? null : { rotate: "180deg" }}
                        />
                        {item}</label>
                    <label className="fk_raport-w201--doc-counter" onDoubleClick={handleClick}>{counter}</label>
                    <label className="fk_raport-w201--doc-sum">{(sum).toLocaleString('pl-PL', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                    })}</label>
                </section>
                {arrow[item] && owner201}

            </React.Fragment>
        );
    });

    const generateW203Items = (businessArea.W203).map((item, index) => {
        const counter = wCounter(item, 203);
        const sum = sumOfCount(item, 203);
        const handleClick = () => {
            // Filtruj obiekty na podstawie nazwy (item) i wyświetl je w konsoli
            const filteredObjects = filteredDataRaport.filter(obj => obj['OBSZAR'] === item && obj['RODZAJ KONTA'] === 203);

            setTableData(filteredObjects);
            setShowTable(true);

        };
        return (
            <section key={index} className="fk_raport-w201" style={counter === 0 ? { display: "none" } : null} >
                <label className="fk_raport-w201--arrow">{item}</label>
                <label className="fk_raport-w201--doc-counter" onDoubleClick={handleClick}>{counter}</label>
                <label className="fk_raport-w201--doc-sum">{(sum).toLocaleString('pl-PL', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                })}</label>

            </section>

        );
    });

    const generateArea = (area) => {
        const counter = filteredDataRaport.reduce((acc, item) => {
            if (item['RODZAJ KONTA'] === area) {
                acc++;
            }
            return acc;
        }, 0);

        let sum = 0;
        const docSum = filteredDataRaport.map(item => {
            if (item['RODZAJ KONTA'] === area) {
                sum += item[' KWOTA DO ROZLICZENIA FK '];
            }
        });

        const handleClick = () => {
            // Filtruj obiekty na podstawie nazwy (item) i wyświetl je w konsoli
            const filteredObjects = filteredDataRaport.filter(obj => obj['RODZAJ KONTA'] === area);

            setTableData(filteredObjects);
            setShowTable(true);

        };

        return (
            <section className='fk_raport-business' >
                <label
                    className='fk_raport-business--select'
                    htmlFor={area}
                    onClick={() => setShowData(prev => {
                        return {
                            ...prev,
                            [`W${area}`]: !showData[`W${area}`]
                        };
                    })}>
                    <IoIosArrowDown
                        className='fk_raport-business--arrow'
                        style={!showData[`W${area}`] ? null : { rotate: "180deg" }}
                    />
                    {`${area}`}</label >
                <label className='fk_raport-title--doc-counter' onDoubleClick={handleClick}>
                    {counter}
                </label>
                <label className='fk_raport-title--doc-sum'>{sum.toLocaleString('pl-PL', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                })}</label>
            </section >
        );
    };

    const generateSumArea = () => {
        const counter = filteredDataRaport.reduce((acc, item) => {
            if (item['RODZAJ KONTA']) {
                acc++;
            }
            return acc;
        }, 0);

        let sum = 0;
        const docSum = filteredDataRaport.map(item => {
            if (item['RODZAJ KONTA']) {
                sum += item[' KWOTA DO ROZLICZENIA FK '];
            }
        });

        const handleClick = () => {
            // Filtruj obiekty na podstawie nazwy (item) i wyświetl je w konsoli
            const filteredObjects = filteredDataRaport.filter(obj => obj['RODZAJ KONTA']);

            setTableData(filteredObjects);
            setShowTable(true);

        };

        return (
            <section className='fk_raport-business' >
                <label
                    className='fk_raport-business--select fk_raport-business--all'
                >Suma końcowa
                </label >
                <label
                    className='fk_raport-title--doc-counter fk_raport-business--all'
                    onDoubleClick={handleClick}
                >
                    {counter}
                </label>
                <label className='fk_raport-title--doc-sum fk_raport-business--all'>
                    {sum.toLocaleString('pl-PL', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                    })}
                </label>
            </section >
        );
    };

    useEffect(() => {
        businessArea.W201.forEach(element => {
            setArrow(prev => {
                return {
                    ...prev,
                    [element]: false
                };
            });
        });
    }, [businessArea]);

    // useEffect(() => {
    //     const w201Owner = businessArea.W201.map(owner => {
    //         return {
    //             [owner]: [...new Set(filteredDataRaport.filter(item => item['RODZAJ KONTA'] === 201 && item['OBSZAR'] === owner).map(item => item['OWNER']))]
    //         };
    //     });
    // }, [filteredDataRaport]);

    return (
        <section className='fk_raport' >
            <section className='fk_raport-title' >
                <label className='fk_raport-title--business'>Obszar biznesu</label>
                <label className='fk_raport-title--doc-counter'>Liczba dokumentów</label>
                <label className='fk_raport-title--doc-sum'>Kwota do rozliczenia</label>
            </section>

            {generateArea(201)}
            {showData.W201 && generateW201Items}

            {generateArea(203)}
            {showData.W203 && generateW203Items}

            {generateSumArea()}
        </section >
    );
};

export default FKRaport;