import { useState, useEffect } from 'react';
import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from "./hooks/useData";

import './Home.css';

const Home = () => {
    const axiosPrivateIntercept = useAxiosPrivateIntercept();
    const { auth } = useData();

    const [updateTime, setUpdateTime] = useState({
        date: '',
        time: ''
    });


    useEffect(() => {
        const getUpdateTime = async () => {
            const response = await axiosPrivateIntercept.get(`/update/get-time`);

            const dateObj = new Date(response.data);
            // Pobieramy poszczególne elementy daty i czasu
            const day = dateObj.getDate().toString().padStart(2, '0'); // Dzień
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Miesiąc (numerowany od 0)
            const year = dateObj.getFullYear(); // Rok

            const hours = dateObj.getHours().toString().padStart(2, '0'); // Godzina
            const minutes = dateObj.getMinutes().toString().padStart(2, '0'); // Minuty

            // Formatujemy datę i czas według wymagań
            const dateFormatted = `${day}-${month}-${year}`;
            const timeFormatted = `${hours}:${minutes}`;

            setUpdateTime({
                date: dateFormatted,
                time: timeFormatted
            });
        };
        getUpdateTime();
    }, []);

    return (
        <section className='home'>
            {auth?.roles?.includes(100) && updateTime.date && updateTime.time && <section className='home-update'>
                <span>Data i czas aktualizacji rozrachunków:</span>
                <section className='home-update-time'>
                    <span className='home-update-time--date'>{updateTime.date}</span>
                    <span className='home-update-time--time'>{updateTime.time}</span>
                </section>

            </section>}
        </section>
    );
};

export default Home;