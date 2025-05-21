import { useEffect, useState } from "react";
import { Button } from "@mui/material";

const DeptMapperEdit = ({ id, data, localization, area, owner, guardian, setEditDep, handleSaveToDB, handleDeleteItem }) => {

    const [editData, setEditData] = useState({
        department: data?.department ? data.department : '',
        company: data?.company ? data.company : '',
        localization: data?.localization ? data.localization : '',
        area: data?.area ? data.area : '',
        owner: data?.owner ? data.owner : [],
        guardian: data?.guardian ? data.guardian : [],
    });

    const [activ, setActive] = useState(false);

    useEffect(() => {
        const { department, company, localization, area, owner, guardian } = editData;

        const hasAllValues =
            department.trim() !== '' &&
            company.trim() !== '' &&
            localization.trim() !== '' &&
            area.trim() !== '' &&
            owner.some(item => item && item.trim() !== '') &&
            guardian.some(item => item && item.trim() !== '');

        setActive(hasAllValues);
    }, [editData]);

    return (
        <section
            className="dept_mapper__edit"
        >
            <section className="dept_mapper__edit_panel">
                <section className="dept_mapper-counter">
                    <span
                    >
                        {id + 1}
                    </span>
                </section>

                <section className="dept_mapper-department">
                    <section className="dept_mapper-department__container">

                        <span>{editData.department}</span>
                        <span>{editData.company}</span>
                    </section>
                </section>

                <section className="dept_mapper-localization">
                    <select
                        className="dept_mapper_settings-select"
                        value={editData.localization}
                        label="Lokalizacja"
                        onChange={(e) => setEditData(prev => {
                            return {
                                ...prev,
                                localization: e.target.value
                            };
                        })}

                    >
                        <option value="" disabled hidden>
                            -- Wybierz lokalizację --
                        </option>

                        {localization.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}

                    </select>
                </section>
                <section className="dept_mapper-area">
                    <select
                        className="dept_mapper_settings-select"
                        value={editData.area}
                        label="Lokalizacja"
                        onChange={(e) => setEditData(prev => {
                            return {
                                ...prev,
                                area: e.target.value
                            };
                        })}
                    >
                        <option value="" disabled hidden>
                            -- Wybierz obszar --
                        </option>

                        {area.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}

                    </select>
                </section>
                <section className="dept_mapper-owner_guard__container">

                    {editData.owner.map((own, index) => {
                        const availableOptions = owner.filter(item =>
                            !editData.owner.includes(item) || item === own
                        );

                        return (
                            <section className="dept_mapper--many" key={index}>
                                <select
                                    className="dept_mapper_settings-select"
                                    value={own}
                                    onChange={(e) => setEditData(prev => {
                                        const updatedOwners = [...prev.owner];
                                        updatedOwners[index] = e.target.value;

                                        return {
                                            ...prev,
                                            owner: updatedOwners
                                        };
                                    })}
                                >
                                    <option value="" disabled hidden>
                                        -- Wybierz ownera --
                                    </option>

                                    {availableOptions.map((option, i) => (
                                        <option key={i} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                {/* {index === 0 ? (
                                    <i
                                        className="fa-solid fa-plus dept_mapper--fa-plus"
                                    // onClick={handleAddOwner}
                                    ></i>
                                ) : (
                                    <i
                                        className="fa-solid fa-minus dept_mapper--fa-minus"
                                    // onClick={() => handleDeleteOwner(index)}
                                    ></i>
                                )} */}
                                <section className="dept_mapper--icon">
                                    {index === 0 ? (
                                        <>
                                            {!editData.owner.includes("") ? <i
                                                className="fa-solid fa-plus dept_mapper--fa-plus"
                                                onClick={() => setEditData(prev => {
                                                    return {
                                                        ...prev,
                                                        owner: [...prev.owner, ""]
                                                    };
                                                })}
                                            ></i> : <i ></i>}
                                        </>
                                    ) : (
                                        <i
                                            className="fa-solid fa-minus dept_mapper--fa-minus dept_mapper--icon"
                                            onClick={() =>
                                                setEditData(prev => {
                                                    const updatedOwners = [...prev.owner];
                                                    updatedOwners.splice(index, 1); // usuń tylko jeden element po indeksie
                                                    return {
                                                        ...prev,
                                                        owner: updatedOwners
                                                    };
                                                })
                                            }
                                        // onClick={() => handleDeleteOwner(index)}
                                        ></i>
                                    )}
                                </section>
                            </section>

                        );
                    })}

                </section>
                <section className="dept_mapper-owner_guard__container">

                    {editData.guardian.map((guard, index) => {
                        const availableOptions = guardian.filter(item =>
                            !editData.guardian.includes(item) || item === guard
                        );

                        return (
                            <section className="dept_mapper--many" key={index}>
                                <select
                                    className="dept_mapper_settings-select"
                                    value={guard}
                                    onChange={(e) => setEditData(prev => {
                                        const updatedGuards = [...prev.guardian];
                                        updatedGuards[index] = e.target.value;

                                        return {
                                            ...prev,
                                            guardian: updatedGuards
                                        };
                                    })}
                                >
                                    <option value="" disabled hidden>
                                        -- Wybierz opiekuna --
                                    </option>

                                    {availableOptions.map((option, i) => (
                                        <option key={i} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                <section className="dept_mapper--icon">
                                    {index === 0 ? (
                                        <>
                                            {!editData.guardian.includes("") ? <i
                                                className="fa-solid fa-plus dept_mapper--fa-plus"
                                                onClick={() => setEditData(prev => {
                                                    return {
                                                        ...prev,
                                                        guardian: [...prev.guardian, ""]
                                                    };
                                                })}
                                            ></i> : <i ></i>}
                                        </>
                                    ) : (
                                        <i
                                            className="fa-solid fa-minus dept_mapper--fa-minus dept_mapper--icon"
                                            onClick={() =>
                                                setEditData(prev => {
                                                    const updatedGuards = [...prev.guardian];
                                                    updatedGuards.splice(index, 1); // usuń tylko jeden element po indeksie
                                                    return {
                                                        ...prev,
                                                        guardian: updatedGuards
                                                    };
                                                })
                                            }
                                        ></i>
                                    )}
                                </section>
                            </section>

                        );
                    })}
                </section>
            </section>

            <section className="dept_mapper__container__edit_accept">
                < Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setEditDep({
                        department: "",
                        company: ""
                    })}
                >
                    Anuluj
                </Button>
                < Button
                    variant="contained"
                    color="success"
                    disabled={!activ}
                    onClick={() => handleSaveToDB(editData.department, editData.company)}
                >
                    Zapisz zmiany
                </Button>
                {data?.exist && < Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteItem(editData.department, editData.company)}
                >
                    Usuń
                </Button>}
            </section>


        </section>
    );
};

export default DeptMapperEdit;