import { useState } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from './hooks/useData';
import PleaseWait from './PleaseWait';
import './AddDataFromFile.css';

const AddDataFromFile = () => {
    const { pleaseWait, setPleaseWait } = useData();
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [errMsg, setErrMsg] = useState('');

    const handleSendFile = async (e) => {
        setPleaseWait(true);
        const file = e.target.files[0];
        if (!file) return console.log('Brak pliku');
        if (!file.name.endsWith('.xlsx')) {
            console.log('Akceptowany jest tylko plik z rozszerzeniem .xlsx');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('excelFile', file);

            const response = await axiosPrivateIntercept.post('/documents/send-documents', formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

            console.log(response.data);

            setErrMsg('Dokumenty zaktualizowane.');

            setPleaseWait(false);

        } catch (error) {
            setErrMsg('Błąd aktualizacji dokumentów');
            console.error('Błąd przesyłania pliku:', error);
            setPleaseWait(false);
        }
    };

    return (
        pleaseWait ? <PleaseWait /> :
            <section className='add_data_from_file'>
                <section className='add_data_from_file__container'>
                    {!errMsg ?
                        <section className='add_data_from_file__container-documents'>
                            <input
                                // ref={fileInputRef}
                                type="file"
                                name="uploadfile"
                                id="xlsx"
                                style={{ display: "none" }}
                                onChange={handleSendFile}
                            />
                            <label htmlFor="xlsx" className="add_data_file-click-me">Prześlij wszytskie faktury xlsx</label>
                        </section> :
                        <section className='add_data_from_file__container-documents'>
                            <span className="add_data_file-click-me">{errMsg}</span>
                        </section>
                    }
                    <section className='add_data_from_file__container-contacts'>
                    </section>
                    <section className='add_data_from_file__container-settlements'>
                    </section>    <section className='add_data_from_file__container-corrections'>
                    </section>
                </section>
            </section>
    );
};

export default AddDataFromFile;
