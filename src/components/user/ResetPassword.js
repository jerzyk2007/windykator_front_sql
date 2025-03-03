
import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
import PleaseWait from "../PleaseWait";

const ResetPassword = () => {
    const { token } = useParams(); // Pobiera token z URL
    const navigate = useNavigate();
    const sentRequest = useRef(false); // Zapobiega wielokrotnemu wysyłaniu
    useEffect(() => {
        const sendToken = async () => {
            if (!token || sentRequest.current) return;

            const decodedToken = decodeURIComponent(token); // Dekodowanie tokena
            sentRequest.current = true; // Zapobiega ponownemu wywołaniu

            try {

                axiosPrivate.post(
                    "/reset-password/confirm",
                    JSON.stringify({ decodedToken }),
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );
                navigate("/login", { replace: true }); // Zapobiega powrotowi wstecz
            } catch (error) {
                console.error("Błąd podczas resetu hasła:", error);
                navigate("/error", { replace: true }); // Możesz przekierować na stronę błędu
            }
        };

        sendToken();
    }, [token, navigate]);

    // return null; // Nic nie wyświetlamy
    return (
        <PleaseWait />
    );
};
export default ResetPassword;
