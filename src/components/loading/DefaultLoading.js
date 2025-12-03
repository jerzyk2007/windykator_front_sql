import "./DefaultLoading.css";

const DefaultLoading = () => {
  return (
    <section className="default_loading">
      <h1 className="default_loading__title">Proszę czekać ...</h1>
      <section className="default_loading__container">
        <div className="default_loading__boxes">
          <div className="box">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="box">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="box">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="box">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </section>
    </section>
  );
};
export default DefaultLoading;
