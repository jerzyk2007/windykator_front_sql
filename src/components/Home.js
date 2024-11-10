import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from "./hooks/useData";
import UpdateData from "./UpdateData";

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
      {auth?.roles?.includes(100) && (
        <section className="home__update">
          {updateData.length && <UpdateData data={updateData} />}
        </section>
      )}
    </section>
  );
};

export default Home;
