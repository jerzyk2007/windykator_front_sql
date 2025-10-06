import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";
import { saveAs } from "file-saver";

export const useOrganizationStructure = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { setExcelFile } = useData();

  const organizationStructure = async () => {
    try {
      setExcelFile(true);

      const response = await axiosPrivateIntercept.get(
        `/raport/get-organization-structure`,
        {
          responseType: "blob", // 👈 najważniejsze: pobieramy jako blob
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `Struktura organizacji.xlsx`);
    } catch (error) {
      console.error(error);
    } finally {
      setExcelFile(false);
    }
  };

  return organizationStructure;
};
