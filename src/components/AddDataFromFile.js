import { useState } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from './hooks/useData';
import PleaseWait from './PleaseWait';
import './AddDataFromFile.css';

const AddDataFromFile = () => {
    const { pleaseWait, setPleaseWait } = useData();
    const axiosPrivateIntercept = useAxiosPrivateIntercept();

    const [errSharepoint, setErrSharepoint] = useState('');
    const [errPowerBI, setErrPowerBI] = useState('');
    const [errAS, setErrAS] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const handleSendFile = async (e, type) => {
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


            const response = await axiosPrivateIntercept.post(`/documents/send-documents/${type}`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

            if (type === 'sharepoint') {
                setErrSharepoint('Dokumenty zaktualizowane.');
            }
            else
                if (type === 'powerbi') {
                    setErrPowerBI('Dokumenty zaktualizowane.');
                }



            setPleaseWait(false);

        } catch (error) {
            if (type === 'sharepoint') {
                setErrSharepoint('Błąd aktualizacji dokumentów.');
            }
            else
                if (type === 'AS') {
                    setErrAS('Błąd aktualizacji dokumentów.');
                }
                else
                    if (type === 'powerbi') {
                        setErrPowerBI('Błąd aktualizacji dokumentów.');
                    }
            console.error('Błąd przesyłania pliku:', error);
            setPleaseWait(false);
        }
    };

    return (
        pleaseWait ? <PleaseWait /> :
            <section className='add_data_from_file'>
                <section className='add_data_from_file__container'>


                    {!errAS ?
                        <section className='add_data_from_file__container-documents'>
                            <input
                                type="file"
                                name="uploadfile"
                                id="AS"
                                style={{ display: "none" }}
                                onChange={(e) => handleSendFile(e, 'AS')}
                            />
                            <label htmlFor="AS" className="add_data_file-click-me">Prześlij faktury AS</label>
                        </section> :
                        <section className='add_data_from_file__container-documents'>
                            <span className="add_data_file-click-me">{errAS}</span>
                        </section>
                    }

                    {!errPowerBI ?
                        <section className='add_data_from_file__container-documents'>
                            <input
                                type="file"
                                name="uploadfile"
                                id="powerbi"
                                style={{ display: "none" }}
                                onChange={(e) => handleSendFile(e, 'powerbi')}
                            />
                            <label htmlFor="powerbi" className="add_data_file-click-me">Prześlij faktury PowerBI</label>
                        </section> :
                        <section className='add_data_from_file__container-documents'>
                            <span className="add_data_file-click-me">{errPowerBI}</span>
                        </section>
                    }

                    <section className='add_data_from_file__container-corrections'>
                    </section>
                    {!errSharepoint ?
                        <section className='add_data_from_file__container-documents'>
                            <input
                                type="file"
                                name="uploadfile"
                                id="sharepoint"
                                style={{ display: "none" }}
                                onChange={(e) => handleSendFile(e, 'sharepoint')}
                            />
                            <label htmlFor="sharepoint" className="add_data_file-click-me">Prześlij faktury sharepoint</label>
                        </section> :
                        <section className='add_data_from_file__container-documents'>
                            <span className="add_data_file-click-me">{errSharepoint}</span>
                        </section>
                    }
                </section>
            </section>
    );
};

export default AddDataFromFile;
