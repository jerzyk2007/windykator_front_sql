import "./EditDocSettlements.css";

const EditDocSettlements = ({ settlement }) => {
  return (
    // <section className="edit-doc-settlements">
    <section className="edit-doc-settlements">
      <span className="edit-doc-settlements--title">Opisy rozrachunków</span>
      <textarea
        className="edit-doc-settlements--content"
        readOnly
        value={settlement ? settlement.join("\n") : ""}
      ></textarea>
    </section>
  );
};

export default EditDocSettlements;
