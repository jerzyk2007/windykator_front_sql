import { useState } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import { Button } from "@mui/material";
import "./UserChangeName.css"; // Korzystamy z tego samego pliku co UserChangeName

const UserDelete = ({ id, login, setEdit }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleConfirmDeleteUser = async () => {
    try {
      await axiosPrivateIntercept.delete(`/user/delete-user/${id}`, {
        userlogin: login,
      });
      setEdit(false);
    } catch (err) {
      setErrMsg("Użytkownik nie został usunięty.");
      console.error(err);
    }
  };

  return (
    <section className="user_change_name">
      {" "}
      {/* Ta sama klasa główna */}
      <section className="user_change_name__title">
        <h3
          className={`user_change_name__title--name ${
            confirmDelete ? "msg-error" : ""
          }`}
        >
          {!confirmDelete
            ? !errMsg
              ? "Usuń użytkownika"
              : errMsg
            : "Potwierdź, tej operacji nie można cofnąć!"}
        </h3>
      </section>
      <section className="user_change_name__container">
        {/* p udaje inputa, aby zachować marginesy i układ */}
        <p
          className="user_change_name__container--edit"
          style={{
            border: "none",
            background: "transparent",
            fontWeight: "bold",
          }}
        >
          {login}
        </p>
      </section>
      <section
        className="user_change_name__container"
        style={{
          paddingTop: 0,
          flexDirection: "row",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {!confirmDelete ? (
          <Button
            variant="contained"
            onClick={() => setConfirmDelete(true)}
            size="small"
            color="error"
          >
            Usuń użytkownika
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              onClick={() => setConfirmDelete(false)}
              size="small"
              color="secondary"
            >
              Anuluj
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmDeleteUser}
              size="small"
              color="error"
            >
              Potwierdź
            </Button>
          </>
        )}
      </section>
    </section>
  );
};

export default UserDelete;
