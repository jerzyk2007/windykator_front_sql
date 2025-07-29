import { FcInfo } from "react-icons/fc";
import './InstructionCustom.css';

const DocumentControl = ({ setSelectedMenuItem }) => {
    return (
        <section className='instruction_custom'>
            <section className='instruction_custom-title'>
                <label>Dokumenty kontroli BL</label>
            </section>
            <section className='instruction_custom-content'>
                <span className='instruction_component-content--text'>Do tabeli wczytywane są dane konieczne do kontroli dokumentacji Blacharskiej.<br />
                    Dane: od 8 dnia po terminie płatności, bez decyzji windykacyjnej.
                </span>
                <span className='instruction_custom-content--text'>Jeśli nie wiesz jak się poruszać po tabeli proszę zajrzyj tutaj:
                </span>
                <span className='instruction_custom-content--text'
                    style={{ textAlign: "center", color: "red", cursor: "pointer", textDecoration: "dashed" }}
                    onClick={() => setSelectedMenuItem(100)}
                >Instrukcja obsługi tabeli
                </span>
            </section>
        </section>
    );
};

export default DocumentControl;