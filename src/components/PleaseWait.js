import DefaultLoading from "./loading/DefaultLoading";
import XmasLoading from "./loading/XmasLoading";
import WindykacjaLoading from "./loading/WindykacjaLoading";
import "./PleaseWait.css";

const variants = {
  dnikn: WindykacjaLoading,
  old: DefaultLoading,
  xmas: XmasLoading,
  // halloween: HalloweenLoading,
  // summer: SummerLoading,
  // blackFriday: BlackFridayLoading,
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
