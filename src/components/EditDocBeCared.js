import { Button } from "@mui/material";

import './EditDocBeCared.css';


export const EditDocBeCared = ({ rowData, setRowData, setBeCared }) => {

    console.log(rowData);
    return (
        <section className='edit_doc_becared-section-data'>
            <section className='edit_doc_becared-section-data-becared'>
                <h4 className='edit_doc_becared-section-data-becared--title'>Nr sprawy BeCared:</h4>
                <span className='edit_doc_becared-section-data-becared--content'>{rowData.NUMER_SPRAWY_BECARED}</span>
            </section>
            <section className='edit_doc_becared-section-data-becared'>
                <h4 className='edit_doc_becared-section-data-becared--title'>Data komentarza BeCared:</h4>
                <span className='edit_doc_becared-section-data-becared--content'>{rowData.DATA_KOMENTARZA_BECARED
                }</span>
            </section>
            <section className='edit_doc_becared-section-data-becared'>
                <h4 className='edit_doc_becared-section-data-becared--title'>Status sprawy kancelaria:</h4>
                <span className='edit_doc_becared-section-data-becared--content'>{rowData.STATUS_SPRAWY_KANCELARIA
                }</span>
            </section>
            <section className='edit_doc_becared-section-data-becared'>
                <h4 className='edit_doc_becared-section-data-becared--title'>Status sprawy windykacja:</h4>
                <span className='edit_doc_becared-section-data-becared--content'>{rowData.STATUS_SPRAWY_WINDYKACJA
                }</span>
            </section>
            <section className='edit_doc_becared-section-data-becared'>
                <h4 className='edit_doc_becared-section-data-becared--title'>Komentarz kancelaria BeCared:</h4>
                <span className='edit_doc_becared-section-data-becared--content'>{rowData.KOMENTARZ_KANCELARIA_BECARED
                }</span>
            </section>
            <section className='edit_doc_becared-section-data-becared'>
                <h4 className='edit_doc_becared-section-data-becared--title'>Kwota windykowana BeCared:</h4>
                <span className='edit_doc_becared-section-data-becared--content'>
                    {rowData.KWOTA_WINDYKOWANA_BECARED && rowData.KWOTA_WINDYKOWANA_BECARED.toLocaleString('pl-PL', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                    })}
                </span>
            </section>


            <Button
                variant="outlined"
                onClick={() => setBeCared(false)}
            >Działania</Button>
        </section>
    );
};

export default EditDocBeCared;
