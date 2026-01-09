import DefaultLoading from "./loading/DefaultLoading";
import XmasLoading from "./loading/XmasLoading";
import WindykacjaLoading from "./loading/WindykacjaLoading";
import FatThursday from "./loading/FatThursday";
import WomensDayLoading from "./loading/WomensDayLoading";
import XmasKulig from "./loading/XmasKulig";
import "./PleaseWait.css";

const variants = {
  dnikn: WindykacjaLoading,
  old: DefaultLoading,
  xmas: XmasLoading,
  fat: FatThursday,
  valentine: WomensDayLoading,
  kulig: XmasKulig,
};

const PleaseWait = ({ info = "dnikn" }) => {
  const LoaderComponent = variants[info] || variants.cube;
  return (
    <section className="please-wait">
      <LoaderComponent />
    </section>
  );
};

export default PleaseWait;
