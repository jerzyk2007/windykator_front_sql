import { useState } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import { Button } from "@mui/material";

const UserDelete = ({ id, login, setEdit }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleConfirmDeleteUser = async () => {
    try {
      await axiosPrivateIntercept.delete(`/user/delete-user/${id}`, {
        data: { userlogin: login }, // W axios delete body przesyłamy w kluczu data
      });
      setEdit(false);
    } catch (err) {
      setErrMsg("Użytkownik nie został usunięty.");
      console.error(err);
    }
  };

  return (
    <section className="user-edit-card user-edit-card--limited">
      <header
        className={`user-edit-card__header ${
          confirmDelete ? "user-edit-card__header--danger" : ""
        }`}
      >
        <h3 className="user-edit-card__title">
          {!confirmDelete
            ? !errMsg
              ? "Usuń użytkownika"
              : errMsg
            : "Potwierdź, tej operacji nie można cofnąć!"}
        </h3>
      </header>

      <div className="user-edit-card__content user-edit-card__content--centered">
        <span
          className="user-edit-card__text-highlight"
          style={{ color: "red", fontStyle: "italic" }}
        >
          {login}
        </span>
      </div>

      <footer className="user-edit-card__footer user-edit-card__footer--gap">
        {!confirmDelete ? (
          <Button
            variant="contained"
            className="user-edit-card__button"
            onClick={() => setConfirmDelete(true)}
            size="small"
            color="error"
          >
            Usuń użytkownika
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={() => setConfirmDelete(false)}
              size="small"
              color="inherit"
            >
              Anuluj
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmDeleteUser}
              size="small"
              color="error"
            >
              Potwierdź usunięcie
            </Button>
          </>
        )}
      </footer>
    </section>
  );
};

export default UserDelete;
