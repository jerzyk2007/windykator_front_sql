import { axiosPrivate, axiosPublic } from "../api/axios";

export const resetMail = async () => {
  try {
    // await axiosPublic.post(
    //     "/reset-password",
    //     JSON.stringify({ userlogin: 'jerzy.komorowski@krotoski.com' }),
    //     {
    //         headers: { "Content-Type": "application/json" },
    //         withCredentials: false,
    //     }
    // );
  } catch (error) {
    console.error(error);
  }
};
