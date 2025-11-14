import useData from "./hooks/useData";
import "./HeaderNotification.css";

const HeaderNotification = () => {
  const { excelFile } = useData();
  console.log(excelFile);
  return (
    <section className="header_notification">
      {excelFile && <div className="loader"></div>}
    </section>
  );
};

export default HeaderNotification;
