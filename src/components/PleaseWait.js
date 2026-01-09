import DefaultLoading from "./loading/DefaultLoading";
import XmasLoading from "./loading/XmasLoading";
import WindykacjaLoading from "./loading/WindykacjaLoading";
import FatThursday from "./loading/FatThursday";
import WomensDayLoading from "./loading/WomensDayLoading";
import "./PleaseWait.css";

const variants = {
  dnikn: WindykacjaLoading,
  old: DefaultLoading,
  xmas: XmasLoading,
  fat: FatThursday,
  valentine: WomensDayLoading,
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
