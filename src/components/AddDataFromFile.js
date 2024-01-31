// import { axiosPrivate } from '../api/axios';
// import axios from '../api/axios';
// import useData from './hooks/useData';
// import PleaseWait from './PleaseWait';
// import './AddDataFromFile.css';

// const AddDataFromFile = () => {
//     const { pleaseWait, setPleaseWait } = useData();


//     const handleSendFile = async (e) => {
//         setPleaseWait(true);
//         const file = e.target.files[0];
//         if (!file) return console.log('Brak pliku');
//         if (!file.name.endsWith('.xlsx')) {
//             console.log('Akceptowany jest tylko plik z rozszerzeniem .xlsx');
//             return;
//         }
//         try {
//             const formData = new FormData();
//             formData.append('excelFile', file);

//             const response = await axios.post('/contacts/addMany', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             setPleaseWait(false);

//         } catch (error) {
//             console.error('Error uploading file:', error);
//         }
//     };


//     return (
//         pleaseWait ? <PleaseWait /> : <div className='add_data_from_file'>
//             <input type="file" name="uploadfile" id="xlsx" style={{ display: "none" }} onChange={handleSendFile} />
//             <label htmlFor="xlsx" className="add_data_file-click-me">Click me to upload xlsx file</label>
//             <br />
//         </div>
//     );
// };

// export default AddDataFromFile;

import { useRef } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from './hooks/useData';
import PleaseWait from './PleaseWait';
import './AddDataFromFile.css';

const AddDataFromFile = () => {
    const { pleaseWait, setPleaseWait } = useData();
    const axiosPrivateIntercept = useAxiosPrivateIntercept();
    const fileInputRef = useRef(null);

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
                headers: {
                'Content-Type': 'multipart/form-data',
            },);

            setPleaseWait(false);
            // Zresetuj wartość inputu, aby umożliwić ponowne wybranie tego samego pliku
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (error) {
            console.error('Błąd przesyłania pliku:', error);
        }
    };

    return (
        pleaseWait ? <PleaseWait /> :
            <section className='add_data_from_file'>
                <section className='add_data_from_file__container'>
                    <section className='add_data_from_file__container-documents'>
                        <input
                            ref={fileInputRef}
                            type="file"
                            name="uploadfile"
                            id="xlsx"
                            style={{ display: "none" }}
                            onChange={handleSendFile}
                        />
                        <label htmlFor="xlsx" className="add_data_file-click-me">Prześlij wszytskie faktury xlsx</label>
                    </section>
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
