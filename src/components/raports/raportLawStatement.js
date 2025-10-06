import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";
import { saveAs } from "file-saver";

export const useLawStatement = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { setExcelFile } = useData();

  const lawStatement = async () => {
    try {
      setExcelFile(true);
      const response = await axiosPrivateIntercept.get(
        `/raport/get-data-raports-law-satetment`,
        {
          responseType: "blob", // 👈 najważniejsze: pobieramy jako blob
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `Zestawienie windykacyjne.xlsx`);
    } catch (error) {
      console.error(error);
    } finally {
      setExcelFile(false);
    }
  };

  return lawStatement;
};
