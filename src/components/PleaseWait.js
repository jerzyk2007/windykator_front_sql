import './PleaseWait.css';

const PleaseWait = () => {
    return (
        <section className="please-wait">
            <h1 className="please-wait__title">Proszę czekać ...</h1>
            <section className="please-wait__container">
                <div className="boxes">
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

export default PleaseWait;