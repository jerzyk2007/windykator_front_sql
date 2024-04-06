import { useEffect, useState } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import FKRaport from "./FKRaport";
import PleaseWait from "../PleaseWait";
import useData from "../hooks/useData";
import "./FKSettings.css";

const FKSettings = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { pleaseWait, setPleaseWait } = useData();

  // const [data, setData] = useState([]);
  const [filteredDataRaport, setFilteredDataRaport] = useState([]);
  const [filter, setFilter] = useState({
    raport: "accountRaport",
    business: "201203",
    payment: "Przeterminowane",
    actions: "Tak",
  });
  const [showRaport, setShowRaport] = useState(false);
  const [showSettingsSelect, setSettingsSelect] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);

  const raportLabels = {
    accountRaport: "Konta",
    agingRaport: "Wiekowanie",
    lawyerRaport: "Kancelarie",
  };

  // dodawanie danych do DB
  // const sendDataFromExcel = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return console.log("Brak pliku");
  //   if (!file.name.endsWith(".xlsx")) {
  //     console.log("Akceptowany jest tylko plik z rozszerzeniem .xlsx");
  //     return;
  //   }
  //   try {
  //     const formData = new FormData();
  //     formData.append("excelFile", file);
  //     const response = await axiosPrivateIntercept.post(
  //       "/fk/send-documents",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //   } catch (err) {
  //     console.error("Błąd przesyłania pliku:", err);
  //   }
  // };

  const getFilteredData = async () => {
    setPleaseWait(true);
    const response = await axiosPrivateIntercept.post("/fk/get-data", {
      filter,
    });

    setFilteredDataRaport(response.data);
    setSettingsSelect(false);
    setShowRaport(true);
    setShowTable(false);
    setPleaseWait(false);
  };

  const handleSettingsSelect = () => {
    setFilteredDataRaport([]);
    setSettingsSelect(true);
  };

  useEffect(() => {
    setFilteredDataRaport([]);
  }, [filter]);

  useEffect(() => {
    getFilteredData();
  }, []);

  return (
    <>
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <section className="fk_settings">
          {!showSettingsSelect && (
            <section className="fk_settings-container-panel">
              <section className="fk_settings-container-info">
                <label className="fk_settings-container-info--text">
                  Raport:<span>{raportLabels[filter.raport]}</span>
                </label>

                {filter.raport === "accountRaport" && (
                  <label className="fk_settings-container-info--text">
                    Obszar:
                    <span>
                      {filter.business === "201203"
                        ? "201 + 203"
                        : filter.business}
                    </span>
                  </label>
                )}

                <label className="fk_settings-container-info--text">
                  Termin:<span>{filter.payment}</span>
                </label>

                <label className="fk_settings-container-info--text">
                  Podjęte działania:
                  <span>
                    {filter.actions === "All" ? "Całość" : filter.actions}
                  </span>
                </label>
              </section>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSettingsSelect}
              >
                Zmień raport
              </Button>
            </section>
          )}
          {showSettingsSelect && (
            <section className="fk_settings-container">
              <section className="fk_settings-container-select">
                <FormControl>
                  <FormLabel>Raport</FormLabel>
                  <RadioGroup
                    value={filter.raport}
                    onChange={(e) =>
                      setFilter((prev) => {
                        const updatedRaport = e.target.value;
                        const updatedActions =
                          updatedRaport === "lawyerRaport"
                            ? "Tak"
                            : prev.actions;
                        return {
                          ...prev,
                          raport: updatedRaport,
                          actions: updatedActions,
                        };
                      })
                    }
                    name="radio-buttons-group"
                  >
                    <FormControlLabel
                      value="accountRaport"
                      control={<Radio />}
                      label="Konta"
                    />
                    <FormControlLabel
                      value="agingRaport"
                      control={<Radio />}
                      label="Wiekowanie"
                    />
                    <FormControlLabel
                      value="lawyerRaport"
                      control={<Radio />}
                      label="Kancelarie"
                    />
                  </RadioGroup>
                </FormControl>
              </section>
              {filter.raport === "accountRaport" && (
                <section className="fk_settings-container-select">
                  <FormControl>
                    <FormLabel>Obszar biznesu</FormLabel>
                    <RadioGroup
                      value={filter.business}
                      onChange={(e) =>
                        setFilter((prev) => {
                          return {
                            ...prev,
                            business: e.target.value,
                          };
                        })
                      }
                      name="radio-buttons-group"
                    >
                      <FormControlLabel
                        value="201203"
                        control={<Radio />}
                        label="201 + 203"
                      />
                      <FormControlLabel
                        value="201"
                        control={<Radio />}
                        label="201"
                      />
                      <FormControlLabel
                        value="203"
                        control={<Radio />}
                        label="203"
                      />
                    </RadioGroup>
                  </FormControl>
                </section>
              )}
              <section className="fk_settings-container-select">
                <FormControl>
                  <FormLabel>Termin płatności</FormLabel>
                  <RadioGroup
                    value={filter.payment}
                    onChange={(e) =>
                      setFilter((prev) => {
                        return {
                          ...prev,
                          payment: e.target.value,
                        };
                      })
                    }
                    name="radio-buttons-group"
                  >
                    <FormControlLabel
                      value="Wszystko"
                      control={<Radio />}
                      label="Wszystko"
                    />
                    <FormControlLabel
                      value="Przeterminowane"
                      control={<Radio />}
                      label="Przeterminowane"
                    />
                    <FormControlLabel
                      value="Nieprzeterminowane"
                      control={<Radio />}
                      label="Nieprzeterminowane"
                    />
                  </RadioGroup>
                </FormControl>
              </section>

              {filter.raport !== "lawyerRaport" && (
                <section className="fk_settings-container-select">
                  <FormControl>
                    <FormLabel>Podjęte działania</FormLabel>
                    <RadioGroup
                      value={filter.actions}
                      onChange={(e) =>
                        setFilter((prev) => {
                          return {
                            ...prev,
                            actions: e.target.value,
                          };
                        })
                      }
                      name="radio-buttons-group"
                    >
                      <FormControlLabel
                        value="All"
                        control={<Radio />}
                        label="Całość"
                      />
                      <FormControlLabel
                        value="Tak"
                        control={<Radio />}
                        label="Tak"
                      />
                      <FormControlLabel
                        value="Nie"
                        control={<Radio />}
                        label="Nie"
                      />
                    </RadioGroup>
                  </FormControl>
                </section>
              )}
              <section className="fk_settings-container-generate">
                <Button
                  variant="contained"
                  color="secondary"
                  // disabled={data.length > 0 ? false : true}
                  onClick={getFilteredData}
                >
                  Generuj raport
                </Button>
              </section>
            </section>
          )}

          {showRaport && filteredDataRaport.length > 0 && (
            <FKRaport
              setTableData={setTableData}
              showTable={showTable}
              setShowTable={setShowTable}
              filter={filter}
              filteredDataRaport={filteredDataRaport}
              tableData={tableData}
            />
          )}

          {/* <section className='fk_settings'>
                <input
                    type="file"
                    name="uploadfile"
                    id="fk"
                    style={{ display: "none" }}
                    onChange={(e) => sendDataFromExcel(e)}
                />
                <label htmlFor="fk" className="fk_settings-click-me">Prześlij rozrachunki</label>
            </section> */}
        </section>
      )}
    </>
  );
};

export default FKSettings;
