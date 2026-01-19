import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import Select from "react-select";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./AddDoc.css";

const clearForm = {
  numerDokumentu: "",
  ubezpieczyciel: "",
  terminPlatnosci: "",
  dataPrzekazania: "",
  kwotaDokument: 0,
  kwotaDokumentDisplay: "",
  kwotaNaleznosci: 0,
  kwotaDisplay: "",
  konto: "",
  kontoDisplay: "",
  firma: "", // <--- DODANO
  osobaZlecajaca: "",
  dzial: "",
  kontrahentNazwa: "",
  kontrahentUlica: "",
  kontrahentNrDomu: "",
  kontrahentNrLokalu: "",
  kontrahentKod: "",
  kontrahentMiasto: "",
  kontrahentNip: "",
  kontrahentRegon: "",
  telefony: [""],
  maile: [""],
};

const AddDoc = ({ profile, docData = {}, setIsEditing = () => {} }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [form, setForm] = useState(clearForm);
  const [message, setMessage] = useState({ type: "", info: "" });
  const [departments, setDepartments] = useState([]);
  const [company, setCompany] = useState([]);
  // --- WALIDATORY ---
  const v = {
    required: (val) => val && String(val).trim().length > 0,
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    nip: (val) => val.replace(/\D/g, "").length === 10,
    regon: (val) => [9, 14].includes(val.replace(/\D/g, "").length),
    zip: (val) => /^\d{2}-\d{3}$/.test(val),
    konto: (val) => val.replace(/\D/g, "").length === 26,
    phone: (val) => val.replace(/\D/g, "").length === 9,
    isPositive: (val) => !isNaN(val) && parseFloat(val) > 0,
  };

  const hasDuplicates = (array) => {
    const filtered = array
      .map((i) => i.replace(/\s/g, ""))
      .filter((i) => i !== "");
    return new Set(filtered).size !== filtered.length;
  };

  const getInvalidStyle = (isValid, value, isRequired = false) => {
    if (isRequired && (!value || value === "" || value === 0)) {
      return { borderColor: "#ffa7a7" };
    }
    if (!value || value === "" || value === 0) return {};
    return isValid ? {} : { color: "red", borderColor: "red" };
  };

  const getContactStyle = (isValid, value, array) => {
    const cleanVal = value.replace(/\s/g, "");
    const isDuplicate =
      cleanVal !== "" &&
      array.filter((i) => i.replace(/\s/g, "") === cleanVal).length > 1;
    if (isDuplicate)
      return { borderColor: "orange", backgroundColor: "#fffcf0" };
    return getInvalidStyle(isValid, value);
  };

  // --- FUNKCJE FORMATUJĄCE ---
  const formatPhone = (value) => {
    const d = value.replace(/\D/g, "").substring(0, 9);
    const p = [];
    if (d.length > 0) p.push(d.substring(0, 3));
    if (d.length > 3) p.push(d.substring(3, 6));
    if (d.length > 6) p.push(d.substring(6, 9));
    return p.join(" ");
  };

  const formatNIP = (value) => {
    const d = value.replace(/\D/g, "").substring(0, 10);
    const p = [];
    if (d.length > 0) p.push(d.substring(0, 3));
    if (d.length > 3) p.push(d.substring(3, 6));
    if (d.length > 6) p.push(d.substring(6, 8));
    if (d.length > 8) p.push(d.substring(8, 10));
    return p.join("-");
  };

  const formatZipCode = (value) => {
    const d = value.replace(/\D/g, "").substring(0, 5);
    return d.length > 2 ? `${d.substring(0, 2)}-${d.substring(2)}` : d;
  };

  const formatBankAccount = (value) => {
    const d = value.replace(/\D/g, "").substring(0, 26);
    const p = [];
    if (d.length > 0) p.push(d.substring(0, 2));
    for (let i = 2; i < d.length; i += 4) p.push(d.substring(i, i + 4));
    return p.join(" ");
  };

  const formatToPLN = (value) => {
    if (!value && value !== 0) return "";
    return new Intl.NumberFormat("pl-PL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // --- HANDLERY ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, index, field) => {
    let value = e.target.value;
    if (field === "telefony") value = formatPhone(value);
    setForm((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const handleAcceptNewDoc = () => {
    setMessage({ type: "", info: "" });
    setForm(clearForm);
    if (profile === "edit") {
      setIsEditing(false);
    }
  };

  const canAddPhone =
    form.telefony.every((t) => v.phone(t)) &&
    !hasDuplicates(form.telefony) &&
    form.telefony.every((t) => t !== "");
  const canAddMail =
    form.maile.every((m) => v.email(m)) &&
    !hasDuplicates(form.maile) &&
    form.maile.every((m) => m !== "");

  const handleSaveData = async (e) => {
    e.preventDefault();
    const errors = [];
    if (!v.required(form.numerDokumentu)) errors.push("Numer dokumentu");
    if (!v.required(form.ubezpieczyciel)) errors.push("Ubezpieczyciel");
    if (!v.required(form.terminPlatnosci)) errors.push("Termin płatności");
    if (!v.required(form.dataPrzekazania)) errors.push("Data przekazania");
    if (!v.isPositive(form.kwotaDokument)) errors.push("Kwota dokumentu");
    if (!v.isPositive(form.kwotaNaleznosci)) errors.push("Należność");
    if (!v.required(form.firma)) errors.push("Spółka"); // <--- WALIDACJA
    if (!v.email(form.osobaZlecajaca)) errors.push("E-mail zlecającego");
    if (!v.required(form.dzial)) errors.push("Dział");
    if (!v.required(form.kontrahentNazwa)) errors.push("Nazwa kontrahenta");
    if (!v.required(form.kontrahentUlica)) errors.push("Ulica kontrahenta");
    if (!v.required(form.kontrahentNrDomu)) errors.push("Numer domu");
    if (!v.zip(form.kontrahentKod)) errors.push("Kod pocztowy (00-000)");
    if (!v.required(form.kontrahentMiasto)) errors.push("Miasto");

    if (hasDuplicates(form.telefony) || hasDuplicates(form.maile))
      errors.push("Duplikaty w danych kontaktowych");

    if (errors.length > 0) {
      alert("Proszę poprawić błędy:\n\n- " + errors.join("\n- "));
      return;
    }

    try {
      if (profile === "new") {
        const result = await axiosPrivateIntercept.post(
          `insurance/insert-new-document`,
          { data: form },
        );
        if (result.status === 201)
          setMessage({ type: "new", info: result.data.message });
      } else if (profile === "edit") {
        const result = await axiosPrivateIntercept.post(
          `insurance/edit-document`,
          {
            id: docData.id_document,
            data: form,
          },
        );
        if (result.status === 201)
          setMessage({ type: "new", info: result.data.message });
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage({ type: "edit", info: error.response.data?.message ?? "" });
        return;
      }
      console.error(error);
    }
  };

  const getData = async () => {
    try {
      const result = await axiosPrivateIntercept.get(
        "insurance/get-available-dep-comp",
      );

      setDepartments(result?.data?.departments ?? []);
      const formattedCompanies = result.data.company.map((item) => ({
        value: item,
        label: item,
      }));
      setCompany(formattedCompanies);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (profile === "edit") {
      setForm({
        numerDokumentu: docData.NUMER_POLISY ?? "",
        ubezpieczyciel: docData.UBEZPIECZYCIEL ?? "",
        terminPlatnosci: docData.TERMIN_PLATNOSCI ?? "",
        dataPrzekazania: docData.DATA_PRZEKAZANIA ?? "",
        kwotaDokument: docData.KWOTA_DOKUMENT ?? 0,
        kwotaDokumentDisplay: formatToPLN(docData.KWOTA_DOKUMENT) ?? "",
        kwotaNaleznosci: docData.NALEZNOSC ?? 0,
        kwotaDisplay: formatToPLN(docData.NALEZNOSC) ?? "",
        konto: docData.NR_KONTA ?? "",
        kontoDisplay: formatBankAccount(docData.NR_KONTA) ?? "",
        firma: docData.FIRMA ?? "", // <--- MAPOWANIE Z BAZY
        osobaZlecajaca: docData.OSOBA_ZLECAJACA_WINDYKACJE ?? "",
        dzial: docData.DZIAL ?? "",
        kontrahentNazwa: docData.KONTRAHENT_NAZWA ?? "",
        kontrahentUlica: docData.KONTRAHENT_ULICA ?? "",
        kontrahentNrDomu: docData.KONTRAHENT_NR_BUDYNKU ?? "",
        kontrahentNrLokalu: docData.KONTRAHENT_NR_LOKALU ?? "",
        kontrahentKod: docData.KONTRAHENT_KOD_POCZTOWY ?? "",
        kontrahentMiasto: docData.KONTRAHENT_MIASTO ?? "",
        kontrahentNip: docData.KONTRAHENT_NIP ?? "",
        kontrahentRegon: docData.KONTRAHENT_REGON ?? "",
        telefony: docData.KONTAKT_DO_KLIENTA.TELEFON
          ? docData.KONTAKT_DO_KLIENTA.TELEFON.map((tel) => formatPhone(tel))
          : [""],
        maile: [...docData.KONTAKT_DO_KLIENTA.MAIL] ?? [""],
      });
    }
  }, [docData, profile]);

  useEffect(() => {
    getData();
  }, []);

  const options = departments.map((dep) => ({ value: dep, label: dep }));
  const currentValue = options.find((o) => o.value === form.dzial) || null;

  const currentCompanyValue =
    company.find((o) => o.value === form.firma) || null;

  const documentPanel = () => (
    <section className="add_doc">
      {message.type === "edit" ? (
        <h2 style={{ color: "red" }}>{message.info}</h2>
      ) : (
        <h2>{profile === "new" ? "Dodaj polisę" : "Edytuj polisę"}</h2>
      )}
      <form className="add_doc__form">
        {/* KOLUMNA 1: DANE POLISY */}
        <section className="add_doc-data">
          <h3>Dane Polisy</h3>
          <section className="add_doc__container">
            <section className="add_doc-code-city">
              <label>
                Numer dokumentu *
                <input
                  type="text"
                  name="numerDokumentu"
                  value={form.numerDokumentu}
                  onChange={handleChange}
                  style={getInvalidStyle(true, form.numerDokumentu, true)}
                />
              </label>
              <label>
                Termin płatności *
                <input
                  type="date"
                  name="terminPlatnosci"
                  value={form.terminPlatnosci}
                  onChange={handleChange}
                  style={getInvalidStyle(true, form.terminPlatnosci, true)}
                />
              </label>
            </section>

            <section className="add_doc-code-city">
              <label>
                Ubezpieczyciel *
                <input
                  type="text"
                  name="ubezpieczyciel"
                  placeholder="Nazwa"
                  value={form.ubezpieczyciel}
                  onChange={handleChange}
                  style={getInvalidStyle(true, form.ubezpieczyciel, true)}
                />
              </label>
              <label>
                Data przekazania *
                <input
                  type="date"
                  name="dataPrzekazania"
                  value={form.dataPrzekazania}
                  onChange={handleChange}
                  style={getInvalidStyle(true, form.dataPrzekazania, true)}
                />
              </label>
            </section>

            <section className="add_doc-code-city">
              <label>
                Kwota *
                <input
                  type="text"
                  value={form.kwotaDokumentDisplay}
                  placeholder="0,00"
                  style={getInvalidStyle(
                    v.isPositive(form.kwotaDokument),
                    form.kwotaDokumentDisplay,
                    true,
                  )}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[0-9.,]*$/.test(val) || val === "") {
                      setForm((p) => ({
                        ...p,
                        kwotaDokumentDisplay: val,
                        kwotaDokument:
                          parseFloat(
                            val.replace(",", ".").replace(/\s/g, ""),
                          ) || 0,
                      }));
                    }
                  }}
                  onBlur={() =>
                    setForm((p) => ({
                      ...p,
                      kwotaDokumentDisplay: formatToPLN(p.kwotaDokument),
                    }))
                  }
                  onFocus={() =>
                    setForm((p) => ({
                      ...p,
                      kwotaDokumentDisplay:
                        p.kwotaDokument === 0
                          ? ""
                          : String(p.kwotaDokument).replace(".", ","),
                    }))
                  }
                />
              </label>
              <label>
                Należność *
                <input
                  type="text"
                  value={form.kwotaDisplay}
                  placeholder="0,00"
                  style={getInvalidStyle(
                    v.isPositive(form.kwotaNaleznosci),
                    form.kwotaDisplay,
                    true,
                  )}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[0-9.,]*$/.test(val) || val === "") {
                      setForm((p) => ({
                        ...p,
                        kwotaDisplay: val,
                        kwotaNaleznosci:
                          parseFloat(
                            val.replace(",", ".").replace(/\s/g, ""),
                          ) || 0,
                      }));
                    }
                  }}
                  onBlur={() =>
                    setForm((p) => ({
                      ...p,
                      kwotaDisplay: formatToPLN(p.kwotaNaleznosci),
                    }))
                  }
                  onFocus={() =>
                    setForm((p) => ({
                      ...p,
                      kwotaDisplay:
                        p.kwotaNaleznosci === 0
                          ? ""
                          : String(p.kwotaNaleznosci).replace(".", ","),
                    }))
                  }
                />
              </label>
            </section>

            {/* WIERSZ: NR KONTA (70%) + SPÓŁKA (30%) */}
            <section className="add_doc-code-city">
              <label style={{ width: "65%" }}>
                Nr konta do wpłaty
                <input
                  type="text"
                  value={form.kontoDisplay}
                  style={getInvalidStyle(
                    v.konto(form.konto),
                    form.kontoDisplay,
                  )}
                  onChange={(e) => {
                    const clean = e.target.value
                      .replace(/\D/g, "")
                      .substring(0, 26);
                    setForm((p) => ({
                      ...p,
                      kontoDisplay: formatBankAccount(clean),
                      konto: clean,
                    }));
                  }}
                  placeholder="26 cyfr"
                />
              </label>
              <label style={{ width: "35%" }}>
                Spółka *
                <Select
                  name="firma"
                  className={`react-select-container ${
                    !form.firma ? "is-invalid" : ""
                  }`}
                  classNamePrefix="rs"
                  value={currentCompanyValue}
                  options={company}
                  onChange={(sel) =>
                    handleChange({
                      target: { name: "firma", value: sel ? sel.value : "" },
                    })
                  }
                  placeholder="Wybierz..."
                  menuPlacement="top"
                />
              </label>
            </section>

            <section className="add_doc-code-city">
              <label>
                E-mail zlecającego *
                <input
                  type="email"
                  name="osobaZlecajaca"
                  value={form.osobaZlecajaca}
                  style={getInvalidStyle(
                    v.email(form.osobaZlecajaca),
                    form.osobaZlecajaca,
                    true,
                  )}
                  onChange={handleChange}
                  placeholder="przyklad@firma.pl"
                />
              </label>
              <label>
                Dział *
                <Select
                  name="dzial"
                  className={`react-select-container ${
                    !form.dzial ? "is-invalid" : ""
                  }`}
                  classNamePrefix="rs"
                  value={currentValue}
                  options={options}
                  onChange={(sel) =>
                    handleChange({
                      target: { name: "dzial", value: sel ? sel.value : "" },
                    })
                  }
                  placeholder="Wybierz..."
                  menuPlacement="top"
                />
              </label>
            </section>
          </section>
        </section>

        {/* KOLUMNA 2: DANE KONTRAHENTA */}
        <section className="add_doc-data">
          <h3>Dane kontrahenta</h3>
          <section className="add_doc__container">
            <label>
              Nazwa kontrahenta *
              <input
                type="text"
                name="kontrahentNazwa"
                value={form.kontrahentNazwa}
                onChange={handleChange}
                style={getInvalidStyle(true, form.kontrahentNazwa, true)}
              />
            </label>
            <label>
              Ulica *
              <input
                type="text"
                name="kontrahentUlica"
                value={form.kontrahentUlica}
                onChange={handleChange}
                style={getInvalidStyle(true, form.kontrahentUlica, true)}
              />
            </label>
            <section className="add_doc-code-city">
              <label>
                Nr domu *
                <input
                  type="text"
                  name="kontrahentNrDomu"
                  value={form.kontrahentNrDomu}
                  onChange={handleChange}
                  style={getInvalidStyle(true, form.kontrahentNrDomu, true)}
                />
              </label>
              <label>
                Nr lokalu
                <input
                  type="text"
                  name="kontrahentNrLokalu"
                  value={form.kontrahentNrLokalu}
                  onChange={handleChange}
                />
              </label>
            </section>
            <section className="add_doc-code-city">
              <label>
                Kod pocztowy *
                <input
                  type="text"
                  value={form.kontrahentKod}
                  style={getInvalidStyle(
                    v.zip(form.kontrahentKod),
                    form.kontrahentKod,
                    true,
                  )}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      kontrahentKod: formatZipCode(e.target.value),
                    }))
                  }
                  maxLength={6}
                  placeholder="00-000"
                />
              </label>
              <label>
                Miasto *
                <input
                  type="text"
                  name="kontrahentMiasto"
                  value={form.kontrahentMiasto}
                  onChange={handleChange}
                  style={getInvalidStyle(true, form.kontrahentMiasto, true)}
                />
              </label>
            </section>
            <section className="add_doc-code-city">
              <label>
                NIP
                <input
                  type="text"
                  value={form.kontrahentNip}
                  style={getInvalidStyle(
                    v.nip(form.kontrahentNip),
                    form.kontrahentNip,
                  )}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      kontrahentNip: formatNIP(e.target.value),
                    }))
                  }
                  maxLength={13}
                />
              </label>
              <label>
                Regon
                <input
                  type="text"
                  value={form.kontrahentRegon}
                  style={getInvalidStyle(
                    v.regon(form.kontrahentRegon),
                    form.kontrahentRegon,
                  )}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      kontrahentRegon: e.target.value
                        .replace(/\D/g, "")
                        .substring(0, 14),
                    }))
                  }
                  maxLength={14}
                />
              </label>
            </section>
          </section>
        </section>

        {/* KOLUMNA 3: KONTAKT DO KLIENTA */}
        <section className="add_doc-data">
          <h3>Kontakt do klienta</h3>
          <div className="add_doc-contact-wrapper">
            <section className="add_doc-contact-section">
              <h4 className="contact-title">Telefony</h4>
              {form.telefony.map((tel, idx) => (
                <div key={`tel-${idx}`} className="add_doc-contact-row">
                  <input
                    className="add_doc-contact"
                    type="text"
                    value={tel}
                    style={getContactStyle(v.phone(tel), tel, form.telefony)}
                    onChange={(e) => handleArrayChange(e, idx, "telefony")}
                    placeholder="9 cyfr"
                  />
                  {form.telefony.length > 1 && (
                    <Button
                      color="error"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          telefony: p.telefony.filter((_, i) => i !== idx),
                        }))
                      }
                    >
                      x
                    </Button>
                  )}
                </div>
              ))}
              <Button
                size="small"
                variant="outlined"
                disabled={!canAddPhone}
                onClick={() =>
                  setForm((p) => ({ ...p, telefony: [...p.telefony, ""] }))
                }
              >
                + telefon
              </Button>
            </section>

            <div className="contact-divider"></div>

            <section className="add_doc-contact-section">
              <h4 className="contact-title">Adresy E-mail</h4>
              {form.maile.map((m, idx) => (
                <div key={`mail-${idx}`} className="add_doc-contact-row">
                  <input
                    className="add_doc-contact"
                    type="text"
                    value={m}
                    style={getContactStyle(v.email(m), m, form.maile)}
                    onChange={(e) => handleArrayChange(e, idx, "maile")}
                    placeholder="E-mail"
                  />
                  {form.maile.length > 1 && (
                    <Button
                      color="error"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          maile: p.maile.filter((_, i) => i !== idx),
                        }))
                      }
                    >
                      x
                    </Button>
                  )}
                </div>
              ))}
              <Button
                size="small"
                variant="outlined"
                disabled={!canAddMail}
                onClick={() =>
                  setForm((p) => ({ ...p, maile: [...p.maile, ""] }))
                }
              >
                + mail
              </Button>
            </section>
          </div>
        </section>
      </form>

      <section className="add_doc__accept-panel">
        {profile === "edit" && (
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => setIsEditing(false)}
          >
            Anuluj
          </Button>
        )}
        <Button
          variant="contained"
          size="small"
          color="success"
          onClick={handleSaveData}
        >
          Zapisz dokument
        </Button>
      </section>
    </section>
  );

  const messagePanel = () => (
    <section className="add_doc__message">
      <section className="add_doc__message__container">
        <div className="add_doc__message__icon">
          <FontAwesomeIcon icon={faCheckCircle} />
        </div>
        <span>{message.info}</span>
        <Button
          variant="contained"
          color="success"
          size="large"
          fullWidth
          style={{ marginTop: "10px", textTransform: "none", fontWeight: 600 }}
          onClick={handleAcceptNewDoc}
        >
          OK, kontynuuj
        </Button>
      </section>
    </section>
  );

  return message?.type === "new" ? messagePanel() : documentPanel();
};

export default AddDoc;
