import React from 'react';
import './UpdateData.css';

const UpdateData = ({ data }) => {
    const updateItems = data.map((item, index) => {
        return (
            <section key={index} className='update-data__container'>
                <span className='update-data--name'>{item.DATA_NAME}</span>
                <span className='update-data--date'>{item.DATE}</span>
                <span className='update-data--hour'>{item.HOUR}</span>
                <span className='update-data--update'>{item.UPDATE_SUCCESS}</span>

            </section>
        );
    });

    return (
        <section className='update-data'>
            <section className='update-data__container'>
                <span className='update-data--name'>Nazwa:</span>
                <span className='update-data--date'>Data:</span>
                <span className='update-data--hour'>Godzina:</span>
                <span className='update-data--update'>Status:</span>
            </section>
            {updateItems}

        </section>
    );
};

export default UpdateData;