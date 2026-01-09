import { useEffect, useState } from "react";
import { Button } from "@mui/material";

const ChangeOrgStrEdit = ({
  id,
  data,
  localization,
  area,
  owner,
  guardian,
  setEditDep,
  handleSaveToDB,
  handleDeleteItem,
}) => {
  const [editData, setEditData] = useState({ ...data });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const { localization, area, owner, guardian } = editData;
    // Walidacja przycisku zapisu: wszystko musi być wybrane i niepuste
    const valid =
      localization &&
      area &&
      owner.length > 0 &&
      owner.every((o) => o && o.trim() !== "") &&
      guardian.length > 0 &&
      guardian.every((g) => g && g.trim() !== "");
    setIsActive(valid);
  }, [editData]);

  const updateArray = (type, index, value) => {
    const copy = [...editData[type]];
    copy[index] = value;
    setEditData((prev) => ({ ...prev, [type]: copy }));
  };

  const addRow = (type) => {
    const currentArray = editData[type];
    // ZABEZPIECZENIE: Nie pozwól dodać, jeśli w tablicy jest już pusty element
    if (currentArray.some((item) => !item || item.trim() === "")) {
      return;
    }
    setEditData((prev) => ({ ...prev, [type]: [...prev[type], ""] }));
  };

  const removeRow = (type, index) =>
    setEditData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));

  return (
    <div className="change-org-str__modal-overlay">
      <section className="change-org-str__modal-card">
        <header className="change-org-str__modal-header">
          <div className="change-org-str__modal-title-box">
            <span className="change-org-str__modal-badge">
              Edycja #{id + 1}
            </span>
            <h2>
              {editData.department} <small>({editData.company})</small>
            </h2>
          </div>
          <button
            className="change-org-str__modal-close-btn"
            onClick={() => setEditDep({ department: "", company: "" })}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </header>

        <div className="change-org-str__modal-content">
          <div className="change-org-str__modal-grid">
            {/* Lokalizacja */}
            <div className="change-org-str__modal-field">
              <label>
                <i className="fa-solid fa-location-dot"></i> Lokalizacja
              </label>
              <select
                className="change-org-str__select-modal"
                value={editData.localization}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, localization: e.target.value }))
                }
              >
                <option value="" disabled>
                  -- Wybierz lokalizację --
                </option>
                {localization.map((l, i) => (
                  <option key={i} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Obszar */}
            <div className="change-org-str__modal-field">
              <label>
                <i className="fa-solid fa-layer-group"></i> Obszar
              </label>
              <select
                className="change-org-str__select-modal"
                value={editData.area}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, area: e.target.value }))
                }
              >
                <option value="" disabled>
                  -- Wybierz obszar --
                </option>
                {area.map((a, i) => (
                  <option key={i} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Ownerzy */}
            <div className="change-org-str__modal-field">
              <label>
                <i className="fa-solid fa-user-tie"></i> Ownerzy
              </label>
              <div className="change-org-str__modal-dynamic-list">
                {editData.owner.map((own, idx) => (
                  <div key={idx} className="change-org-str__modal-dynamic-row">
                    <select
                      className="change-org-str__select-modal"
                      value={own}
                      onChange={(e) =>
                        updateArray("owner", idx, e.target.value)
                      }
                    >
                      <option value="" disabled hidden>
                        -- Wybierz ownera --
                      </option>
                      {owner
                        .filter((o) => !editData.owner.includes(o) || o === own)
                        .map((o, i) => (
                          <option key={i} value={o}>
                            {o}
                          </option>
                        ))}
                    </select>
                    <div className="change-org-str__modal-icons">
                      {idx === 0 ? (
                        /* Plus pokazuje się tylko gdy nie ma pustych wierszy w tej sekcji */
                        !editData.owner.some((o) => !o || o.trim() === "") && (
                          <i
                            className="fa-solid fa-circle-plus success-icon"
                            onClick={() => addRow("owner")}
                          ></i>
                        )
                      ) : (
                        <i
                          className="fa-solid fa-circle-minus danger-icon"
                          onClick={() => removeRow("owner", idx)}
                        ></i>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opiekunowie */}
            <div className="change-org-str__modal-field">
              <label>
                <i className="fa-solid fa-user-shield"></i> Opiekunowie
              </label>
              <div className="change-org-str__modal-dynamic-list">
                {editData.guardian.map((guard, idx) => (
                  <div key={idx} className="change-org-str__modal-dynamic-row">
                    <select
                      className="change-org-str__select-modal"
                      value={guard}
                      onChange={(e) =>
                        updateArray("guardian", idx, e.target.value)
                      }
                    >
                      <option value="" disabled hidden>
                        -- Wybierz opiekuna --
                      </option>
                      {guardian
                        .filter(
                          (g) => !editData.guardian.includes(g) || g === guard
                        )
                        .map((g, i) => (
                          <option key={i} value={g}>
                            {g}
                          </option>
                        ))}
                    </select>
                    <div className="change-org-str__modal-icons">
                      {idx === 0 ? (
                        /* Plus pokazuje się tylko gdy nie ma pustych wierszy w tej sekcji */
                        !editData.guardian.some(
                          (g) => !g || g.trim() === ""
                        ) && (
                          <i
                            className="fa-solid fa-circle-plus success-icon"
                            onClick={() => addRow("guardian")}
                          ></i>
                        )
                      ) : (
                        <i
                          className="fa-solid fa-circle-minus danger-icon"
                          onClick={() => removeRow("guardian", idx)}
                        ></i>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="change-org-str__modal-footer">
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            onClick={() => setEditDep({ department: "", company: "" })}
          >
            Anuluj
          </Button>
          <div className="change-org-str__modal-footer-right">
            {data.exist && (
              <Button
                color="error"
                variant="text"
                size="small"
                onClick={() =>
                  handleDeleteItem(editData.department, editData.company)
                }
              >
                Usuń powiązanie
              </Button>
            )}
            <Button
              variant="contained"
              disabled={!isActive}
              size="small"
              onClick={() => handleSaveToDB(editData)}
            >
              Zapisz zmiany
            </Button>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default ChangeOrgStrEdit;
