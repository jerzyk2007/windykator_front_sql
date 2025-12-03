import DefaultLoading from "./loading/DefaultLoading";
import XmasLoading from "./loading/XmasLoading";
import "./PleaseWait.css";

const PleaseWait = () => {
  return (
    <section className="please-wait">
      {/* <DefaultLoading /> */}
      <XmasLoading />
    </section>
  );
};

export default PleaseWait;
