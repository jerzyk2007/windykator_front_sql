import { useState } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import { Button } from "@mui/material";

const PercentageTarget = ({ departments, setPleaseWait }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [errMsg, setErrMsg] = useState("");
  const [percentDep, setPercentDep] = useState({
    time: departments.time,
    departments: departments.departments,
  });

  const handleChange = (e, dep) => {
    const { value, maxLength } = e.target;
    const sliceNumber = value.slice(0, maxLength);
    setPercentDep((prev) => ({
      ...prev,
      departments: {
        ...prev.departments,
        [dep]: sliceNumber,
      },
    }));
  };

  if (!percentDep || !percentDep.departments) return null;

  const { Całość: _, ...otherDepartments } = percentDep.departments;
  const departmentEntries = Object.entries(otherDepartments);

  const departmentsItem = departmentEntries.map(([dep, value], index) => (
    <section key={index} className="org-str-target__row">
      <span className="org-str-target__row-name">{dep}</span>
      <input
        className="org-str-target__input"
        type="number"
        maxLength="2"
        value={value}
        onChange={(e) => handleChange(e, dep)}
      />
    </section>
  ));

  const handleSavePercentageTarget = async () => {
    try {
      setPleaseWait(true);
      await axiosPrivateIntercept.patch("/settings/save-target-percent", {
        target: percentDep,
      });
      setPleaseWait(false);
      setErrMsg(`Sukces.`);
      setTimeout(() => setErrMsg(""), 3000); // Czyścimy komunikat po 3 sek.
    } catch (err) {
      setErrMsg(`Błąd zapisu.`);
      console.error(err);
      setPleaseWait(false);
    }
  };

  return (
    <section className="org-str-target">
      {/* <header className="org-str-target__header"> */}
      <header className="org-str-item__header">
        {/* <div className="org-str-target__header-top"> */}
        <div className="org-str-item__title">
          <div className="org-str-target__title-group">
            <label className="org-str-target__label">Cel Q</label>
            <select
              className="org-str-target__select"
              value={percentDep.time.Q}
              onChange={(e) =>
                setPercentDep((prev) => ({
                  ...prev,
                  time: { Q: Number(e.target.value) },
                }))
              }
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>

          <Button
            variant="contained"
            onClick={handleSavePercentageTarget}
            size="small"
            sx={{ minWidth: "80px", height: "32px", textTransform: "none" }}
          >
            Zapisz
          </Button>
        </div>
        {errMsg && <p className="org-str-target__message-status">{errMsg}</p>}
      </header>

      <section className="org-str-target__list">{departmentsItem}</section>
    </section>
  );
};

export default PercentageTarget;
