import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import PleaseWait from "../PleaseWait";
import useData from "../hooks/useData";
import Button from "@mui/material/Button";
import "./FKAddData.css";

const FKAddData = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { pleaseWait, setPleaseWait } = useData();

  return (
    <>
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <section className="fk_add_data">
          <section className="fk_add_data__title">
            <span>Dodaj dane do Raportu FK</span>
          </section>
          <section className="fk_add_data__container">
            <section className="fk_add_data__container-item">
              <span>Dane</span>
              <span>Data dodanych danych</span>
              <span>Ilość dodanych danych</span>
              <span></span>
            </section>

            <section className="fk_add_data__container-item">
              <span>Wiekowanie - plik księgowość</span>
              <span></span>
              <span></span>
              <Button variant="contained">Dodaj</Button>
            </section>

            <section className="fk_add_data__container-item">
              <span>Rozrachunki - przelewy bankowe</span>
              <span></span>
              <span></span>
              <Button variant="contained">Dodaj</Button>
            </section>
          </section>
        </section>
      )}
    </>
  );
};

export default FKAddData;
