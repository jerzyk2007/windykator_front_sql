import { Button } from "@mui/material";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import useData from "../../hooks/useData";

import "./AcceptCasePanel.css";

const AcceptCasePanel = ({
  rowData,
  updateDocuments,
  removeDocuments,
  setDataRowTable,
  clearRowTable,
}) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();

  const handleAccept = async () => {
    try {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const formattedDate = `${year}-${month}-${day}`;

      const note = {
        date: formattedDate,
        note: "Przyjęto sprawę do obsługi.",
        profile: auth.permissions,
        userlogin: auth.userlogin,
        username: auth.usersurname,
      };
      await axiosPrivateIntercept.patch(`/law-partner/accept-document`, {
        id_document: rowData.id_document,
        acceptDate: formattedDate,
        note,
      });
      // rowData.DATA_PRZYJECIA_SPRAWY = formattedDate;
      // updateDocuments(rowData);
      removeDocuments(rowData.id_document);
      setDataRowTable(clearRowTable);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className="accept_case_panel">
      <span className="accept_case_panel--title">
        Akceptacja sprawy i przyjęcie jej do obsługi
      </span>
      <span className="accept_case_panel--info">
        {"Po kliknięciu przycisku"}
        <span style={{ fontWeight: "bold", color: "rgb(25, 118, 210)" }}>
          <br /> AKCEPTUJ
          <br />
        </span>
        sprawa zostanie przydzielona. <br />
        Panel zostanie zamknięty, a sprawa usunięta z tej tabeli.
        <br />
        <br />
        Część informacji zostanie pobrana i zaktualizowana przez system dopiero
        następnego dnia.
      </span>
      <Button variant="contained" size="large" onClick={handleAccept}>
        Akceptuj
      </Button>
    </section>
  );
};
export default AcceptCasePanel;
