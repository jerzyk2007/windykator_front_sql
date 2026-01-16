import { useState, useEffect } from "react";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
// import UserChangeRoles from "./UserChangeRoles";
// import UserChangeDepartments from "./UserChangeDepartments";
// import UserChangeLawPartner from "./UserChangeLawPartner";
// import UserChangeName from "./UserChangeName";
// import UserChangePass from "./UserChangePass";
// import UserChangeLogin from "./UserChangeLogin";
// import UserDelete from "./UserDelete";
// import UserCompany from "./UserCompany";
import PleaseWait from "../../PleaseWait";
import CloseIcon from "@mui/icons-material/Close";

//komponent do ustawień odsetek ustawowych
const StatuaryInterest = ({ user, setEdit }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const [pleaseWait, setPleaseWait] = useState(false);

  useEffect(() => {
    const getSettings = async () => {
      //   setPleaseWait(true);
    };
    getSettings();
  }, []);

  return (
    <section className="global_columns_panel">
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        <>
          <section className="global_columns_panel__container"></section>
          <section className="global_columns_panel__container"></section>

          <section className="global_columns_panel__container"></section>
        </>
      )}
      <section className="global_columns_panel-close">
        <CloseIcon />
      </section>
    </section>
  );
};

export default StatuaryInterest;
