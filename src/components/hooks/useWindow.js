import { useState, useEffect } from 'react';

const useWindowSize = () => {
    const [windoSize, setWindowSize] = useState({
        width: undefined,
        height: undefined
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);;
    }, []);

    return windoSize;
};

export default useWindowSize;