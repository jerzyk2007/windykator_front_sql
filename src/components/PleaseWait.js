import DefaultLoading from "./loading/DefaultLoading";
import XmasLoading from "./loading/XmasLoading";
import WindykacjaLoading from "./loading/WindykacjaLoading";
import FatThursday from "./loading/FatThursday";
import WomensDayLoading from "./loading/WomensDayLoading";
import XmasKulig from "./loading/XmasKulig";
import XmasSkiJump from "./loading/XmasSkiJump";
import XmasRestaurant from "./loading/XmasRestaurant";
import "./PleaseWait.css";

const variants = {
  default: WindykacjaLoading,
  draft: XmasRestaurant,
  old: DefaultLoading,
  xmas: XmasLoading,
  fat: FatThursday,
  valentine: WomensDayLoading,
  kulig: XmasKulig,
  ski: XmasSkiJump,
};

const PleaseWait = ({ info = "default" }) => {
  const LoaderComponent = variants[info] || variants.cube;
  return (
    <section className="please-wait">
      <LoaderComponent />
    </section>
  );
};

export default PleaseWait;
