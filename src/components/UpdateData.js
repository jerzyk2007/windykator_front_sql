import React from 'react';
import './UpdateData.css';

const UpdateData = ({ data }) => {

    const updateItems = data.map((item, index) => {
        return (
            <section key={index} className='update-data__container'>
                <span className='update-data--info'>{item.data_name}</span>
                <span className='update-data--info'>{item.date}</span>
                <span className='update-data--info'>{item.hour}</span>
                <span className='update-data--info'>{item.success}</span>

            </section>
        );
    });

    return (
        <section className='update-data'>
            <section className='update-data__container'>
                <span className='update-data--info'>Nazwa:</span>
                <span className='update-data--info'>Data:</span>
                <span className='update-data--info'>Godzina:</span>
                <span className='update-data--info'>Status:</span>
            </section>
            {updateItems}

        </section>
    );
};

export default UpdateData;