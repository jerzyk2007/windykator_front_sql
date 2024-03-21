import React, { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import './FKRaport.css';

const FKRaport = ({ filteredDataRaport, setTableData, setShowTable, filter, showData, setShowData, arrow, setArrow }) => {

    const [businessAccount, setBusinessAccount] = useState({
        [filter.business]: [],
    });




    const wCounter = (area, account) => {
        const count = filteredDataRaport.reduce((acc, item) => {
            if (account === '201203') {
                if (item['OBSZAR'] === area) {
                    acc++;
                }
            }
            else {
                if (item['OBSZAR'] === area && item['RODZAJ KONTA'] === account) {
                    acc++;
                }
            }
            return acc;
        }, 0);

        return count;
    };

    const sumOfCount = (area, account) => {
        let sum = 0;
        const docSum = filteredDataRaport.map(item => {
            if (account === '201203') {
                if (item['OBSZAR'] === area) {
                    sum += item[' KWOTA DO ROZLICZENIA FK '];
                }
            }
            else {

                if (item['OBSZAR'] === area && item['RODZAJ KONTA'] === account) {
                    sum += item[' KWOTA DO ROZLICZENIA FK '];
                }
            }
        });
        return sum;
    };


    // funkcja generuje działy
    const generateDepartments = (own, account, area) => {

        let department = [];
        if (account === '201203') {
            department = [...new Set(filteredDataRaport.filter(dep => dep['OBSZAR'] === area && dep['OWNER'] === own).map(dep => dep['DZIAŁ']))];
        }
        else {
            department = [...new Set(filteredDataRaport.filter(dep => dep['OBSZAR'] === area && dep['RODZAJ KONTA'] === account && dep['OWNER'] === own).map(dep => dep['DZIAŁ']))];
        }

        const departmentItems = department.map((dep, index) => {
            const counterDepartment = filteredDataRaport.reduce((acc, doc) => {
                if (account === '201203') {
                    if (doc['DZIAŁ'] === dep && doc['OWNER'] === own) {
                        acc++;
                    }
                }
                else {
                    if (doc['DZIAŁ'] === dep && doc['RODZAJ KONTA'] === account && doc['OWNER'] === own) {
                        acc++;
                    }
                }
                return acc;
            }, 0);

            // pokazuje zsumowana wartość ownera
            let departmentSum = 0;
            const docSum = filteredDataRaport.map(dataSum => {
                if (account === '201203') {
                    if (dataSum['DZIAŁ'] === dep && dataSum['OWNER'] === own) {
                        departmentSum += dataSum[' KWOTA DO ROZLICZENIA FK '];
                    }
                }
                else {
                    if (dataSum['DZIAŁ'] === dep && dataSum['OWNER'] === own && dataSum['RODZAJ KONTA'] === account) {
                        departmentSum += dataSum[' KWOTA DO ROZLICZENIA FK '];
                    }
                }
            });
            const handleClickOwner = () => {
                let filteredObjects = [];
                if (account === '201203') {
                    filteredObjects = filteredDataRaport.filter(obj => obj['DZIAŁ'] === dep && obj['OWNER'] === own);
                }
                else {
                    filteredObjects = filteredDataRaport.filter(obj => obj['DZIAŁ'] === dep && obj['OWNER'] === own && obj['RODZAJ KONTA'] === account);
                }
                setTableData(filteredObjects);
                setShowTable(true);
            };
            return (
                <section key={index} className="fk_raport-w201 fk_raport-w201--owner">
                    <label className="fk_raport-w201--arrow fk_raport-w201--arrow--owner"
                        onDoubleClick={handleClickOwner}>
                        {dep}</label>
                    <label className="fk_raport-w201--doc-counter" onDoubleClick={handleClickOwner} >{counterDepartment}</label>
                    <label className="fk_raport-w201--doc-sum" onDoubleClick={handleClickOwner}>{(departmentSum).toLocaleString('pl-PL', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                    })}</label>
                </section>
            );
        });
        return departmentItems;
    };

    // funkcja generuje ownerów do działów
    const generateOwner = (area, account) => {
        let owner = [];
        if (account === '201203') {
            owner = [...new Set(filteredDataRaport.filter(own => own['OBSZAR'] === area).map(own => own['OWNER']))];
        } else {
            owner = [...new Set(filteredDataRaport.filter(own => own['RODZAJ KONTA'] === account && own['OBSZAR'] === area).map(own => own['OWNER']))];
        }

        const ownerItems = owner.map((own, index) => {
            const counterOwner = filteredDataRaport.reduce((acc, doc) => {
                if (account === '201203') {
                    if (doc['OBSZAR'] === area && doc['OWNER'] === own) {
                        acc++;
                    }
                }
                else {
                    if (doc['OBSZAR'] === area && doc['RODZAJ KONTA'] === account && doc['OWNER'] === own) {
                        acc++;
                    }
                }
                return acc;
            }, 0);

            // pokazuje zsumowana wartość ownera
            let ownerSum = 0;
            const docSum = filteredDataRaport.map(dataSum => {
                if (account === '201203') {
                    if (dataSum['OBSZAR'] === area && dataSum['OWNER'] === own) {
                        ownerSum += dataSum[' KWOTA DO ROZLICZENIA FK '];
                    }
                }
                else {
                    if (dataSum['OBSZAR'] === area && dataSum['RODZAJ KONTA'] === account && dataSum['OWNER'] === own) {
                        ownerSum += dataSum[' KWOTA DO ROZLICZENIA FK '];
                    }
                }
            });
            const handleClickOwner = () => {
                let filteredObjects = [];
                if (account === '201203') {
                    filteredObjects = filteredDataRaport.filter(obj => obj['OBSZAR'] === area && obj['OWNER'] === own);
                }
                else {
                    filteredObjects = filteredDataRaport.filter(obj => obj['OBSZAR'] === area && obj['RODZAJ KONTA'] === account && obj['OWNER'] === own);
                }
                setTableData(filteredObjects);
                setShowTable(true);
            };
            const departments = generateDepartments(own, account, area);
            return (
                <React.Fragment key={index}>
                    <section className="fk_raport-w201 fk_raport-w201--owner"
                        style={counterOwner === 0 ? { display: "none" } : null}
                    >

                        <label
                            className="fk_raport-w201--arrow fk_raport-w201--arrow--owner"
                            onClick={() => setArrow(prev => {
                                return {
                                    ...prev,
                                    owner: {
                                        ...prev.owner,
                                        [own]: !arrow.owner[own]
                                    }
                                };
                            })}
                        >
                            <IoIosArrowDown
                                className='fk_raport-business--arrow'
                                style={!arrow.owner[own] ? null : { rotate: "180deg" }}
                            />
                            {own}</label>
                        <label className="fk_raport-w201--doc-counter" onDoubleClick={handleClickOwner} >{counterOwner}</label>
                        <label className="fk_raport-w201--doc-sum" onDoubleClick={handleClickOwner}>{(ownerSum).toLocaleString('pl-PL', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            useGrouping: true,
                        })}</label>
                    </section>
                    {arrow.owner[own] && departments}

                </React.Fragment>
            );
        });
        return ownerItems;
    };



    const generateAccountItems = (account) => {
        const generateItems = (businessAccount[account]).map((item, index) => {
            const counter = wCounter(item, account);
            const sum = sumOfCount(item, account);

            const handleClick = () => {
                let filteredObjects = [];
                if (account === '201203') {
                    filteredObjects = filteredDataRaport.filter(obj => obj['OBSZAR'] === item);
                }
                else {
                    filteredObjects = filteredDataRaport.filter(obj => obj['OBSZAR'] === item && obj['RODZAJ KONTA'] === account);
                }
                setTableData(filteredObjects);
                setShowTable(true);
            };

            const owners = generateOwner(item, account);

            return (
                <React.Fragment key={index}>
                    <section className="fk_raport-w201" style={counter === 0 ? { display: "none" } : null}>
                        <label
                            className="fk_raport-w201--arrow"
                            onClick={() => setArrow(prev => {
                                return {
                                    ...prev,
                                    area: {
                                        ...prev.area,
                                        [item]: !arrow.area[item]
                                    }
                                };
                            })
                            }
                        >
                            <IoIosArrowDown
                                className='fk_raport-business--arrow'
                                style={!arrow.area[item] ? null : { rotate: "180deg" }}
                            />
                            {item}</label>
                        <label className="fk_raport-w201--doc-counter" onDoubleClick={handleClick}>{counter}</label>
                        <label className="fk_raport-w201--doc-sum">{(sum).toLocaleString('pl-PL', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                            useGrouping: true,
                        })}</label>
                    </section>
                    {/* {arrow[`W${filter.business}`][item] && owners} */}
                    {arrow.area[item] && owners}

                </React.Fragment >
            );
        });
        return generateItems;
    };

    const generateAccount = (account) => {

        const counter = filteredDataRaport.reduce((acc, item) => {
            if (account === "201203") {
                acc++;
            } else {
                if (item['RODZAJ KONTA'] === account) {
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
                if (item['RODZAJ KONTA'] === account) {
                    sum += item[' KWOTA DO ROZLICZENIA FK '];
                }
            }
        });

        const handleClick = () => {
            // Filtruj obiekty na podstawie nazwy (item) i wyświetl je w konsoli
            let filteredObjects = [];
            if (account === '201203') {
                filteredObjects = [...filteredDataRaport];
            }
            else {
                filteredObjects = filteredDataRaport.filter(obj => obj['RODZAJ KONTA'] === account);
            }

            setTableData(filteredObjects);
            setShowTable(true);

        };

        return (<>
            <section className='fk_raport-business' >
                <label
                    className='fk_raport-business--select'
                    // htmlFor={account}
                    // onClick={() => setShowData(prev => {
                    //     return {
                    //         ...prev,
                    //         [`W${account}`]: !showData[`W${account}`]
                    //     };
                    // })}
                    onClick={() => setArrow(prev => {
                        return {
                            ...prev,
                            account: {
                                [account]: !arrow.account[account]
                            }
                        };
                    })}
                >
                    <IoIosArrowDown
                        className='fk_raport-business--arrow'
                        // style={!showData[`W${account}`] ? null : { rotate: "180deg" }}
                        style={!arrow.account[account] ? null : { rotate: "180deg" }}
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

        </>
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
                    onDoubleClick={handleClick}
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
        let accountArray = [];
        if (filter.business === "201203") {
            accountArray = [...new Set(filteredDataRaport.filter(item => item['RODZAJ KONTA']).map(item => item['OBSZAR']))].sort();
            accountArray.forEach(areaIitem => {

                setArrow(prev => {
                    return {
                        ...prev,
                        area: {
                            ...prev.area,
                            [areaIitem]: false
                        }
                    };
                });
            });
        } else {
            accountArray = [...new Set(filteredDataRaport.filter(item => item['RODZAJ KONTA'] === Number(filter.business)).map(item => item['OBSZAR']))].sort();
            accountArray.forEach(areaIitem => {

                setArrow(prev => {
                    return {
                        ...prev,
                        area: {
                            ...prev.area,
                            [areaIitem]: false
                        }
                    };
                });
            });
        }
        setBusinessAccount({
            // [`W${filter.business}`]: accountArray
            [filter.business]: accountArray
        });
    }, []);

    return (
        <section className='fk_raport' >
            <section className='fk_raport-title' >
                <label className='fk_raport-title--business--header'>Obszar biznesu</label>
                <label className='fk_raport-title--doc-counter--header'>Liczba dokumentów</label>
                <label className='fk_raport-title--doc-sum--header'>Kwota do rozliczenia</label>
            </section>

            {/* {generateAccount(`${filter.business}`)} */}

            {filter.business === '201203' && generateAccount("201203")}
            {filter.business === '201203' && arrow.account[filter.business] && generateAccountItems("201203")}

            {filter.business === '201' && generateAccount(201)}
            {filter.business === '201' && arrow.account[filter.business] && generateAccountItems(201)}

            {filter.business === '203' && generateAccount(203)}
            {filter.business === '203' && arrow.account[filter.business] && generateAccountItems(203)}

            {/* {filter.business === '203' && generateArea(203)} */}
            {/* {generateArea(203)} */}
            {/* {showData.W203 && generateW201Items(203)} */}

            {/* {generateSumArea()} */}
        </section >
    );
};

export default FKRaport;