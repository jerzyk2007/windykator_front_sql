import { useState, useEffect } from "react";
import PleaseWait from "../../PleaseWait";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import useData from "../../hooks/useData";

import {
  Button,
  Divider,
  Tooltip,
  IconButton,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  IoArrowBackOutline,
  IoSaveOutline,
  IoMailOutline,
  IoCallOutline,
  IoCheckmarkCircle,
  IoCheckmarkCircleOutline,
  IoAlertCircle,
  IoAlertCircleOutline,
  IoReceipt,
  IoReceiptOutline,
  IoPhonePortrait,
  IoPhonePortraitOutline,
  IoAddCircleOutline,
  IoCheckmarkSharp,
  IoCloseSharp,
  IoPauseCircleOutline,
  IoPlayCircleOutline,
  IoLockClosedOutline,
  IoWarningOutline,
} from "react-icons/io5";

const EditContractor = ({ id = 0, onBack }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();

  // --- NOWE STANY DLA DANYCH Z NODE ---
  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stany edytowalne
  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);
  const [statusWindykacji, setStatusWindykacji] = useState(0);

  // Stany pomocnicze
  const [pleaseWait, setPleaseWait] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [newEmail, setNewEmail] = useState({ active: false, value: "" });
  const [newPhone, setNewPhone] = useState({ active: false, value: "" });

  // --- LOGIKA UPRAWNIEŃ ---
  const isAdmin = auth?.roles?.some((role) => [150, 2000].includes(role));
  const userProfile = isAdmin ? "admin" : "user";

  // --- POBIERANIE DANYCH PO ID ---
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const result = await axiosPrivateIntercept.get(
          `/contractor/get-single-contractor/${id}`,
        );
        const data = result.data;

        // Zapisujemy pobrane dane do stanów
        setContractor(data);
        setEmails(data.EMAIL || []);
        setPhones(data.TELEFON || []);
        setStatusWindykacji(data.STATUS_WINDYKACJI || 0);
      } catch (error) {
        console.error(error);
        setSaveError("Nie udało się pobrać danych kontrahenta.");
      } finally {
        setLoading(false);
      }
    };
    if (id) getData();
  }, [id, axiosPrivateIntercept]);

  // Walidacja
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone) => {
    const cleanPhone = phone.replace(/[\s-]/g, "");
    const polishPhoneRegex = /^(?:\+48|48)?[1-9][0-9]{8}$/;
    return polishPhoneRegex.test(cleanPhone);
  };

  const toggleFlag = (type, index, field) => {
    if (type === "email") {
      const newEmails = [...emails];
      newEmails[index][field] = !newEmails[index][field];
      setEmails(newEmails);
    } else {
      const newPhones = [...phones];
      newPhones[index][field] = !newPhones[index][field];
      setPhones(newPhones);
    }
  };

  const confirmAddEmail = () => {
    if (!isEmailValid(newEmail.value)) return;
    setEmails([
      {
        value: newEmail.value,
        verified: false,
        invalid: false,
        debtCollection: false,
      },
      ...emails,
    ]);
    setNewEmail({ active: false, value: "" });
  };

  const confirmAddPhone = () => {
    if (!isPhoneValid(newPhone.value)) return;
    setPhones([
      {
        value: newPhone.value,
        verified: false,
        invalid: false,
        debtCollection: false,
        isMobile: true,
      },
      ...phones,
    ]);
    setNewPhone({ active: false, value: "" });
  };

  const handleSaveData = async (email, phone, status) => {
    setSaveError(null);
    try {
      setPleaseWait(true);
      await axiosPrivateIntercept.patch(
        `/contractor/change-data-contractor/${contractor?.id_kontrahent ?? null}`,
        { email, phone, status },
      );
    } catch (error) {
      console.error(error);
      setSaveError("Błąd serwera: Nie udało się zapisać zmian.");
    } finally {
      setPleaseWait(false);
    }
  };

  // Blokada renderowania dopóki nie ma danych
  if (loading) return <PleaseWait />;
  if (!contractor) return <div>Błąd ładowania danych...</div>;

  const isBlacklisted = contractor.KOD_KONTR_LISTA === "CZARNA";

  return (
    <>
      <div className="sm-edit-overlay">
        {pleaseWait ? (
          <PleaseWait />
        ) : (
          <div className="sm-edit-wrapper">
            <header className="sm-edit-header">
              <div className="sm-edit-header-left">
                <button className="sm-back-btn" onClick={onBack} title="Wróć">
                  <IoArrowBackOutline />
                </button>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <h1>Podgląd i edycja kontrahenta</h1>
                    <span className="sm-spolka-badge">{contractor.SPOLKA}</span>
                  </div>
                  <p>
                    ID: {contractor.KONTRAHENT_ID} | CKK:{" "}
                    {contractor.CUSTOMER_ID_CKK} | Uprawnienia:{" "}
                    <strong>{userProfile}</strong>
                  </p>
                </div>
              </div>

              {saveError && (
                <div className="sm-header-error">
                  <IoWarningOutline size={20} />
                  <span>{saveError}</span>
                </div>
              )}

              <Button
                variant="contained"
                startIcon={<IoSaveOutline />}
                onClick={() => handleSaveData(emails, phones, statusWindykacji)}
                color={saveError ? "error" : "primary"}
              >
                Zapisz zmiany
              </Button>
            </header>

            <div className="sm-edit-grid">
              {/* KOLUMNA 1: DANE PODSTAWOWE */}
              <section className="sm-edit-column">
                <div className="sm-edit-card">
                  <h3>DANE PODSTAWOWE</h3>
                  <div className="sm-view-field">
                    <label>Pełna nazwa kontrahenta</label>
                    <span className="sm-value-important">
                      {contractor.NAZWA_KONTRAHENTA_SLOWNIK}
                    </span>
                  </div>
                  <div className="sm-view-row">
                    {contractor.KONTR_NIP && (
                      <div className="sm-view-field">
                        <label>NIP</label>
                        <span>{contractor.KONTR_NIP}</span>
                      </div>
                    )}
                    {contractor.REGON && (
                      <div className="sm-view-field">
                        <label>REGON</label>
                        <span>{contractor.REGON}</span>
                      </div>
                    )}
                  </div>
                  <Divider sx={{ my: 1 }} />
                  <div className="sm-view-row">
                    <div className="sm-view-field">
                      <label>Forma płatności</label>
                      <span>
                        {contractor.PRZYPISANA_FORMA_PLATNOSCI || "---"}
                      </span>
                    </div>
                    <div className="sm-view-field">
                      <label>Termin (dni)</label>
                      <span>{contractor.PLATNOSCPOTEM_DNI || "0"}</span>
                    </div>
                  </div>
                  <div className="sm-view-field" style={{ marginTop: "10px" }}>
                    <label>Status kontrahenta - lista:</label>
                    <span
                      style={{
                        color: isBlacklisted ? "#d32f2f" : "#2e7d32",
                        fontWeight: "bold",
                      }}
                    >
                      {isBlacklisted ? "CZARNA (BLOKADA)" : "BIAŁA"}
                    </span>
                  </div>

                  <Divider sx={{ my: 1.5 }} />
                  <div className="sm-debt-status-container">
                    <Tooltip
                      title={
                        !isAdmin
                          ? "Brak uprawnień do zmiany statusu windykacji"
                          : ""
                      }
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={statusWindykacji === 1}
                            onChange={(e) =>
                              setStatusWindykacji(e.target.checked ? 1 : 0)
                            }
                            color="warning"
                            disabled={!isAdmin}
                          />
                        }
                        label={
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              opacity: !isAdmin ? 0.6 : 1,
                            }}
                          >
                            {!isAdmin && <IoLockClosedOutline size={14} />}
                            {statusWindykacji === 1 ? (
                              <IoPauseCircleOutline color="#ed6c02" size={20} />
                            ) : (
                              <IoPlayCircleOutline color="#2e7d32" size={20} />
                            )}
                            <span
                              style={{ fontSize: "0.85rem", fontWeight: 500 }}
                            >
                              {statusWindykacji === 1
                                ? "Windykacja: WSTRZYMANA"
                                : "Windykacja: AUTOMATYCZNA"}
                            </span>
                          </div>
                        }
                      />
                    </Tooltip>
                  </div>
                </div>
              </section>

              {/* KOLUMNA 2: ADRESY */}
              <section className="sm-edit-column">
                <div className="sm-edit-card">
                  <h3>ADRES SIEDZIBY (A_)</h3>
                  <div className="sm-view-field">
                    <label>Ulica i numer</label>
                    <span>
                      {contractor.A_ULICA_EXT} {contractor.A_NRDOMU}
                      {contractor.A_NRLOKALU ? `/${contractor.A_NRLOKALU}` : ""}
                    </span>
                  </div>
                  <div className="sm-view-field">
                    <label>Kod i miejscowość</label>
                    <span>
                      {contractor.A_KOD} {contractor.A_MIASTO}
                    </span>
                  </div>
                </div>
                <div className="sm-edit-card ak-bg">
                  <h3>ADRES KORESPONDENCYJNY (AK_)</h3>
                  <div className="sm-view-field">
                    <label>Ulica i numer</label>
                    <span>
                      {contractor.AK_ULICA_EXT || "---"} {contractor.AK_NRDOMU}
                      {contractor.AK_NRLOKALU
                        ? `/${contractor.AK_NRLOKALU}`
                        : ""}
                    </span>
                  </div>
                  <div className="sm-view-field">
                    <label>Kod i miejscowość</label>
                    <span>
                      {contractor.AK_KOD || "---"}{" "}
                      {contractor.AK_MIASTO || "---"}
                    </span>
                  </div>
                </div>
              </section>

              {/* KOLUMNA 3: KONTAKT */}
              <section className="sm-edit-column sm-contact-column">
                <div className="sm-contact-section">
                  <div className="sm-section-header">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <IoMailOutline /> <span>Adresy E-mail</span>
                    </div>
                    <IconButton
                      size="small"
                      color="primary"
                      disabled={newEmail.active}
                      onClick={() => setNewEmail({ active: true, value: "" })}
                    >
                      <IoAddCircleOutline />
                    </IconButton>
                  </div>
                  <div className="sm-scroll-area">
                    {newEmail.active && (
                      <div className="sm-contact-item sm-new-item-row">
                        <TextField
                          autoFocus
                          size="small"
                          variant="standard"
                          placeholder="np. jan@domena.pl"
                          value={newEmail.value}
                          error={
                            newEmail.value !== "" &&
                            !isEmailValid(newEmail.value)
                          }
                          onChange={(e) =>
                            setNewEmail({ ...newEmail, value: e.target.value })
                          }
                          sx={{ flexGrow: 1, input: { fontSize: "0.85rem" } }}
                        />
                        <div className="sm-contact-flags">
                          <IconButton
                            size="small"
                            color="success"
                            disabled={!isEmailValid(newEmail.value)}
                            onClick={confirmAddEmail}
                          >
                            <IoCheckmarkSharp />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              setNewEmail({ active: false, value: "" })
                            }
                          >
                            <IoCloseSharp />
                          </IconButton>
                        </div>
                      </div>
                    )}
                    {emails.map((m, idx) => (
                      <div
                        className={`sm-contact-item ${m.invalid ? "is-invalid" : ""}`}
                        key={idx}
                      >
                        <div className="sm-contact-val" title={m.value}>
                          {m.value}
                        </div>
                        <div className="sm-contact-flags">
                          <FlagButton
                            active={m.verified}
                            onClick={() => toggleFlag("email", idx, "verified")}
                            iconOn={<IoCheckmarkCircle />}
                            iconOff={<IoCheckmarkCircleOutline />}
                            label="Zweryfikowany"
                            color="#2e7d32"
                          />
                          <FlagButton
                            active={m.invalid}
                            onClick={() => toggleFlag("email", idx, "invalid")}
                            iconOn={<IoAlertCircle />}
                            iconOff={<IoAlertCircleOutline />}
                            label="Błędny"
                            color="#d32f2f"
                          />
                          <FlagButton
                            active={m.debtCollection}
                            onClick={() =>
                              toggleFlag("email", idx, "debtCollection")
                            }
                            iconOn={<IoReceipt />}
                            iconOff={<IoReceiptOutline />}
                            label="Windykacja"
                            color="#ed6c02"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Divider />
                <div className="sm-contact-section">
                  <div className="sm-section-header">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <IoCallOutline /> <span>Numery Telefonów</span>
                    </div>
                    <IconButton
                      size="small"
                      color="primary"
                      disabled={newPhone.active}
                      onClick={() => setNewPhone({ active: true, value: "" })}
                    >
                      <IoAddCircleOutline />
                    </IconButton>
                  </div>
                  <div className="sm-scroll-area">
                    {newPhone.active && (
                      <div className="sm-contact-item sm-new-item-row">
                        <TextField
                          autoFocus
                          size="small"
                          variant="standard"
                          placeholder="np. 600700800"
                          value={newPhone.value}
                          error={
                            newPhone.value !== "" &&
                            !isPhoneValid(newPhone.value)
                          }
                          onChange={(e) =>
                            setNewPhone({ ...newPhone, value: e.target.value })
                          }
                          sx={{ flexGrow: 1, input: { fontSize: "0.85rem" } }}
                        />
                        <div className="sm-contact-flags">
                          <IconButton
                            size="small"
                            color="success"
                            disabled={!isPhoneValid(newPhone.value)}
                            onClick={confirmAddPhone}
                          >
                            <IoCheckmarkSharp />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              setNewPhone({ active: false, value: "" })
                            }
                          >
                            <IoCloseSharp />
                          </IconButton>
                        </div>
                      </div>
                    )}
                    {phones.map((t, idx) => (
                      <div
                        className={`sm-contact-item ${t.invalid ? "is-invalid" : ""}`}
                        key={idx}
                      >
                        <div className="sm-contact-val">{t.value}</div>
                        <div className="sm-contact-flags">
                          <FlagButton
                            active={t.isMobile}
                            onClick={() => toggleFlag("phone", idx, "isMobile")}
                            iconOn={<IoPhonePortrait />}
                            iconOff={<IoPhonePortraitOutline />}
                            label="Komórka"
                            color="#1976d2"
                          />
                          <FlagButton
                            active={t.verified}
                            onClick={() => toggleFlag("phone", idx, "verified")}
                            iconOn={<IoCheckmarkCircle />}
                            iconOff={<IoCheckmarkCircleOutline />}
                            label="Zweryfikowany"
                            color="#2e7d32"
                          />
                          <FlagButton
                            active={t.invalid}
                            onClick={() => toggleFlag("phone", idx, "invalid")}
                            iconOn={<IoAlertCircle />}
                            iconOff={<IoAlertCircleOutline />}
                            label="Błędny"
                            color="#d32f2f"
                          />
                          <FlagButton
                            active={t.debtCollection}
                            onClick={() =>
                              toggleFlag("phone", idx, "debtCollection")
                            }
                            iconOn={<IoReceipt />}
                            iconOff={<IoReceiptOutline />}
                            label="Windykacja"
                            color="#ed6c02"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const FlagButton = ({ active, onClick, iconOn, iconOff, label, color }) => (
  <Tooltip title={label} arrow size="small">
    <IconButton
      size="small"
      onClick={onClick}
      style={{ color: active ? color : "#ccc", padding: "4px" }}
    >
      {active ? iconOn : iconOff}
    </IconButton>
  </Tooltip>
);

export default EditContractor;
