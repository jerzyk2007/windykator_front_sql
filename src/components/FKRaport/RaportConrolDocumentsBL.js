import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";
import { saveAs } from "file-saver";

export const useControlRaportBL = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { setExcelFile } = useData();

  const controlRaportBL = async () => {
    try {
      setExcelFile(true);
      const response = await axiosPrivateIntercept.get(
        `/raport/get-data-raports-control-BL`,
        {
          responseType: "blob", // 👈 najważniejsze: pobieramy jako blob
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `Raport kontroli BL.xlsx`);
    } catch (error) {
      console.error(error);
    } finally {
      setExcelFile(false);
    }
  };

  return controlRaportBL;
};
