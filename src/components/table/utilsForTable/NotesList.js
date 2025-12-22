// import { spanInfoStyle } from "../utilsForTable/tableFunctions";

const NotesList = ({
  data = [],
  clickedIndex,
  handleCopyClick,
  handleMouseEnter,
  handleMouseLeave,
  preWrap = false, // różnica między InfoDesk i LogsEvent
}) => {
  const spanInfoStyle = (profile, info = "name") => {
    const dateColor = "rgba(47, 173, 74, 1)";
    return profile === "Pracownik"
      ? {
          color: info === "name" ? "rgba(42, 4, 207, 1)" : dateColor,
          fontWeight: "bold",
        }
      : profile === "Kancelaria"
      ? {
          color: info === "name" ? "rgba(192, 112, 8, 1)" : dateColor,
          fontWeight: "bold",
        }
      : {
          color: info === "name" ? "rgba(255, 14, 203, 1)" : dateColor,
          fontWeight: "bold",
        };
  };

  return data?.map((item, index) => (
    <section className="info_desk__container" key={index}>
      <span style={spanInfoStyle(item.profile, "date")}>{item.date}</span>

      {item?.date && <span>{" - "}</span>}

      <span
        className={`info_desk--username ${
          clickedIndex === index ? "clicked" : ""
        }`}
        style={spanInfoStyle(item.profile, "name")}
        onClick={() => handleCopyClick(item.userlogin, index)}
        onMouseEnter={(e) => handleMouseEnter(e, item.userlogin)}
        onMouseLeave={handleMouseLeave}
      >
        {item.username}
      </span>

      {item?.username && <span>{" - "}</span>}

      <span style={preWrap ? { whiteSpace: "pre-wrap" } : undefined}>
        {item.note}
      </span>
    </section>
  ));
};

export default NotesList;
