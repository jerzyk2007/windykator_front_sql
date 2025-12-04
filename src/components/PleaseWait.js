import DefaultLoading from "./loading/DefaultLoading";
import XmasLoading from "./loading/XmasLoading";
import "./PleaseWait.css";

const variants = {
  cube: DefaultLoading,
  xmas: XmasLoading,
  // halloween: HalloweenLoading,
  // summer: SummerLoading,
  // blackFriday: BlackFridayLoading,
};

const PleaseWait = ({ info = "cube" }) => {
  const LoaderComponent = variants[info] || variants.cube;
  return (
    <section className="please-wait">
      <LoaderComponent />
    </section>
  );
};

export default PleaseWait;
