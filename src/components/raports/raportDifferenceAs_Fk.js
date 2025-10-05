import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";
import { saveAs } from "file-saver";

export const useDifferenceAs_Fk = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth, setExcelFile } = useData();
  const raportDifferenceAs_Fk = async () => {
    try {
      setExcelFile(true);

      const response = await axiosPrivateIntercept.get(
        `/raport/get-fifferences-as-fk/${auth.id_user}`,
        {
          responseType: "blob", // 👈 najważniejsze: pobieramy jako blob
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `Różnice_AS_FK.xlsx`);
    } catch (error) {
      console.error(error);
    } finally {
      setExcelFile(false);
    }
  };

  return raportDifferenceAs_Fk;
};
