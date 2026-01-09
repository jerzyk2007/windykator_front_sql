import { Button } from "@mui/material";
import useAxiosPrivateIntercept from "../../hooks/useAxiosPrivate";
import useData from "../../hooks/useData";

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

      removeDocuments(rowData.id_document);
      setDataRowTable(clearRowTable);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="ertp-accept-panel">
      <span className="ertp-accept-panel__header">
        Akceptacja sprawy i przyjęcie jej do obsługi
      </span>

      <div className="ertp-accept-panel__info">
        {"Po kliknięciu przycisku"}
        <span style={{ fontWeight: "bold", color: "rgb(25, 118, 210)" }}>
          <br /> AKCEPTUJ
          <br />
        </span>
        sprawa zostanie przydzielona. <br />
        Panel zostanie zamknięty, a sprawa usunięta z tej tabeli.
        <br />
        <br />
        <span>
          Część informacji zostanie pobrana i zaktualizowana przez system
          dopiero następnego dnia.
        </span>
      </div>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleAccept}
        sx={{ mt: 2, px: 5 }}
      >
        Akceptuj
      </Button>
    </section>
  );
};

export default AcceptCasePanel;
