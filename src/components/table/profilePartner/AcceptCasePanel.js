import { Button } from "@mui/material";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import "./AcceptCasePanel.css";
const AcceptCasePanel = ({ rowData, updateDocuments }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();

  const handleAccept = async () => {
    try {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const formattedDate = `${year}-${month}-${day}`;
      await axiosPrivateIntercept.patch(`/law-partner/accept-document`, {
        id_document: rowData.id_document,
        acceptDate: formattedDate,
      });
      rowData.DATA_PRZYJECIA_SPRAWY = formattedDate;
      updateDocuments(rowData);
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
        Po kliknięciu przycisku Akceptuj sprawa zostanie przydzielona. <br />
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
