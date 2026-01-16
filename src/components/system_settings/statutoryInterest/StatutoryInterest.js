import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import InterestRates from "./InterestRates";
import PublicHolidays from "./PublicHolidays";
import PleaseWait from "../../PleaseWait";
// import CloseIcon from "@mui/icons-material/Close";
import "./StatuaryInterest.css";

//komponent do ustawień odsetek ustawowych
const StatuaryInterest = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [pleaseWait, setPleaseWait] = useState(false);
  const [data, setData] = useState({});

  const handleSaveData = async (update, info) => {
    try {
      const updateKey = {
        percentYear: "PROCENTY_ROK",
        freeDays: "WOLNE_USTAWOWE",
      };
      setData((prev) => {
        return {
          ...prev,
          [updateKey[info]]: update,
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getSettings = async () => {
      setPleaseWait(true);
      try {
        const result = await axiosPrivateIntercept.get(
          "/settings/get-rates-data"
        );
        setData(result.data[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setPleaseWait(false);
      }
    };
    getSettings();
  }, []);

  return (
    <section className="global_columns_panel">
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <>
          <section className="global_columns_panel__container">
            <InterestRates
              percentYear={data?.PROCENTY_ROK ?? []}
              handleSaveData={handleSaveData}
            />
          </section>
          <section className="global_columns_panel__container">
            <PublicHolidays
              customHolidays={data?.WOLNE_USTAWOWE ?? []}
              handleSaveData={handleSaveData}
            />
          </section>

          <section className="global_columns_panel__container"></section>
        </>
      )}
      {/* <section className="global_columns_panel-close">
        <CloseIcon onClick={() => navigate("/")} />
      </section> */}
    </section>
  );
};

export default StatuaryInterest;
