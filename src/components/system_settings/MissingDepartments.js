import { useState, useEffect } from "react";
import "./MissingDepartments.css";

const MissingDepartments = ({ departments, companyData }) => {
  const [company, setCompany] = useState([]);

  const companyFilter = company?.map((item, index) => {
    const missingDeps = departments.filter((prev) => prev.company === item);

    const existDep = missingDeps
      .filter(
        (missDeps) => missDeps.exist === true && missDeps.manual === false
      )
      .sort((a, b) => a.dep.localeCompare(b.dep));

    const noExistDep = missingDeps
      .filter(
        (missDeps) => missDeps.exist === false && missDeps.manual === false
      )
      .sort((a, b) => a.dep.localeCompare(b.dep));

    const manualDep = missingDeps
      .filter((missDeps) => missDeps.manual === true)
      .sort((a, b) => a.dep.localeCompare(b.dep));

    const exist =
      existDep.length > 0 ? (
        existDep.map((prev, index) => (
          <span
            key={index}
            style={{ whiteSpace: "pre", color: "#0fc718", fontWeight: "bold" }}
          >
            {prev.dep}
            {index < existDep.length - 1 && ", "}
          </span>
        ))
      ) : (
        <span>Brak</span>
      );

    const noExist =
      noExistDep.length > 0 ? (
        noExistDep.map((prev, index) => (
          <span
            key={index}
            style={{ whiteSpace: "pre", color: "#ff3f3f", fontWeight: "bold" }}
          >
            {prev.dep}
            {index < noExistDep.length - 1 && ", "}
          </span>
        ))
      ) : (
        <span>Brak</span>
      );

    const manual =
      manualDep.length > 0 ? (
        manualDep.map((prev, index) => (
          <span
            key={index}
            style={{ whiteSpace: "pre", color: "#003f3f", fontWeight: "bold" }}
          >
            {prev.dep}
            {index < manualDep.length - 1 && ", "}
          </span>
        ))
      ) : (
        <span>Brak</span>
      );

    return (
      <section key={index} className="missing_department__container">
        <section
          className="missing_department__company--title"
          style={{ fontWeight: "bold" }}
        >
          {item}
        </section>
        <section className="missing_department__company--exist">
          {exist}
        </section>
        <section className="missing_department__company--noexist">
          {noExist}
        </section>
        <section className="missing_department__company--noexist">
          {manual}
        </section>
      </section>
    );
  });

  useEffect(() => {
    if (companyData?.selectCompany === "ALL") {
      setCompany(companyData?.companyNames.filter((name) => name !== "ALL"));
    } else {
      setCompany([companyData.selectCompany]);
    }
  }, [departments]);

  return (
    <section className="missing_department">
      <section className="missing_department__wrapper">
        <section className="missing_department__company--title">
          <span style={{ fontWeight: "bold" }}>Uzupełnij dane</span>
        </section>

        <section className="missing_department__company--exist">
          <span style={{ color: "#0fc718", fontWeight: "bold" }}>
            Nierozliczone FV:
          </span>
        </section>

        <section className="missing_department__company--noexist">
          <span style={{ color: "#ff3f3f", fontWeight: "bold" }}>
            Rozliczone FV:
          </span>
        </section>
        <section className="missing_department__company--noexist">
          <span style={{ color: "#003f3f", fontWeight: "bold" }}>
            Ręcznie dodane działy:
          </span>
        </section>
      </section>
      {companyFilter}
    </section>
  );
};

export default MissingDepartments;
