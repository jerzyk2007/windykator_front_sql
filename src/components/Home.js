import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from "./hooks/useData";
import UpdateData from "./user/UpdateData";
import { generateExcel } from "./FKRaport/utilsForFKTable/prepareFKExcelFile";

import "./Home.css";

const Home = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();

  const [updateData, setUpdateData] = useState([]);

  useEffect(() => {
    const getUpdateTime = async () => {
      const response = await axiosPrivateIntercept.get(`/update/get-time`);
      setUpdateData(response.data);
    };
    getUpdateTime();
  }, []);

  return (
    <section className="home">
      {auth?.roles?.includes(100) && updateData.length > 0 && (
        <section className="home__update">
          {<UpdateData data={updateData} />}
        </section>
      )}
    </section>
  );
};

export default Home;
