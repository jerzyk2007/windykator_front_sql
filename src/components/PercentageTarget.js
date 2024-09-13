import { useState } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import { Button } from "@mui/material";

import "./PercentageTarget.css";

const PercentageTarget = ({ departments }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [errMsg, setErrMsg] = useState("");
  const [percentDep, setPercentDep] = useState({
    time: departments.time,
    departments: departments.departments,
  });

  const handleChange = (e, dep) => {
    const { value, maxLength } = e.target;
    const sliceNumber = value.slice(0, maxLength);
    setPercentDep((prev) => {
      return {
        ...prev,
        departments: {
          ...prev.departments,
          [dep]: sliceNumber,
        },
      };
    });
  };

  // Sprawdzamy, czy departments.departments istnieje i jest obiektem
  if (!percentDep || !percentDep.departments) return null;

  // Wydobycie wartości dla klucza "Całość"
  // const allValue = percentDep.departments["Całość"];

  // Tworzenie nowego obiektu bez klucza "Całość"
  const { Całość: _, ...otherDepartments } = percentDep.departments;

  const departmentEntries = Object.entries(otherDepartments);

  const departmentsItem = departmentEntries.map(([dep, value], index) => (
    <section key={index} className="percentage-department__container--info">
      <span className="percentage-department__container--text">{dep}</span>
      <input
        className="percentage-department__container--number"
        type="number"
        maxLength="2"
        value={value} // Ustawienie początkowej wartości
        onChange={(e) => handleChange(e, dep)} // Funkcja obsługująca zmiany, jeśli jest potrzebna
      />
    </section>
  ));

  const handleSavePercentageTarget = async () => {
    try {
      await axiosPrivateIntercept.patch("/settings/save-target-percent", {
        target: percentDep,
      });
      setErrMsg(`Sukces.`);
    } catch (err) {
      setErrMsg(`Zmiana się nie powiodła.`);
      console.error(err);
    }
  };

  return (
    <section className="percentage-department">
      <section className="percentage-department__title__container">
        <h3 className="percentage-department--name">
          <p
            className="percentage-department__title__container-name"
            style={{ color: "red" }}
          >
            {errMsg}
          </p>
          <label className="percentage-department__title__container-name">
            Cel na kwartał
          </label>
          <select
            className="percentage-department__title__container-actions--select"
            value={percentDep.time.Q}
            onChange={(e) =>
              setPercentDep((prev) => {
                return {
                  ...prev,

                  time: {
                    Q: Number(e.target.value),
                  },
                };
              })
            }
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>

          {/* {!errMsg ? (
            <>
              <label className="percentage-department__title__container-name">
                Cel na kwartał
              </label>
              <select
                className="percentage-department__title__container-actions--select"
                value={percentDep.time.Q}
                onChange={(e) =>
                  setPercentDep((prev) => {
                    return {
                      ...prev,

                      time: {
                        Q: Number(e.target.value),
                      },
                    };
                  })
                }
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </>
          ) : (
            errMsg
          )} */}
        </h3>
      </section>
      <section className="percentage-department__container">
        {departmentsItem}
      </section>
      <Button
        variant="contained"
        onClick={handleSavePercentageTarget}
        size="small"
      >
        Zapisz
      </Button>
    </section>
  );
};

export default PercentageTarget;
