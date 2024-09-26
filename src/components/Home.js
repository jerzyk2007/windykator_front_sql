import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from "./hooks/useData";

import "./Home.css";

const Home = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();

  const [updateTime, setUpdateTime] = useState({
    date: "",
  });

  useEffect(() => {
    const getUpdateTime = async () => {
      const response = await axiosPrivateIntercept.get(`/update/get-time`);

      setUpdateTime({
        date: response.data,
      });
    };
    getUpdateTime();
  }, []);

  return (
    <section className="home">
      {auth?.roles?.includes(100) && updateTime.date && (
        <section className="home-update">
          <span>Data i czas aktualizacji rozrachunków:</span>
          <section className="home-update-time">
            <span className="home-update-time--date">{updateTime.date}</span>
            {/* <span className="home-update-time--time">{updateTime.time}</span> */}
          </section>
        </section>
      )}
    </section>
  );
};

export default Home;
