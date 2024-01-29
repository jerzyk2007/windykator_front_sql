import { axiosPrivate } from '../api/axios';
import axios from '../api/axios';
import useData from './hooks/useData';
import PleaseWait from './PleaseWait';
import './AddDataFromFile.css';

const AddDataFromFile = () => {
    const { pleaseWait, setPleaseWait } = useData();


    const handleFileChange = async (e) => {
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

            const response = await axios.post('/contacts/addMany', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setPleaseWait(false);

        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };


    // const handleGetAllContacts = async () => {
    //     try {
    //         const response = await axiosPrivate.get('/contacts/getAllContacts');

    //         console.log(response.data);
    //     }
    //     catch (err) {
    //         console.log(err);
    //     }
    // };

    return (
        pleaseWait ? <PleaseWait /> : <div className='add_data_from_file'>
            <input type="file" name="uploadfile" id="xlsx" style={{ display: "none" }} onChange={handleFileChange} />
            <label htmlFor="xlsx" className="add_data_file-click-me">Click me to upload xlsx file</label>
            <br />
            {/* <button onClick={handleGetAllContacts}>Pobierz</button> */}

        </div>
    );
};

export default AddDataFromFile;