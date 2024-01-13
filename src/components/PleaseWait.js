import { LuLoader } from "react-icons/lu";
import './PleaseWait.css';

const PleaseWait = () => {
    return (
        <section className="please-wait">
            <section className="please-wait__container">
                <p className='please-wait__container-text'>Proszę czekać ...</p>
                <LuLoader className='please-wait__container-icon' />
            </section>
        </section>
    );
};

export default PleaseWait;