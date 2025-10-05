import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";
import { saveAs } from "file-saver";

export const useDifferenceAs_Fk = () => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();
  const raportDifferenceAs_Fk = async () => {
    try {
      const result = await axiosPrivateIntercept.get(
        `/raport/get-fifferences-as-fk/${auth.id_user}`
      );

      const response = await axiosPrivateIntercept.get(
        `/raport/get-fifferences-as-fk/${auth.id_user}`,
        {
          responseType: "blob", // 👈 najważniejsze: pobieramy jako blob
        }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // saveAs(blob, `${raportInfo.reportName}.xlsx`);
      saveAs(blob, `Różnice_AS_FK.xlsx`);

      //   const structureData = result.data.structure.map((item) => {
      //     return {
      //       area: item.AREA,
      //       company: item.COMPANY,
      //       department: item.DEPARTMENT,
      //       localization: item.LOCALIZATION,
      //       owner: Array.isArray(item.OWNER) ? item.OWNER.join("\n") : item.OWNER,
      //       guardian: Array.isArray(item.GUARDIAN)
      //         ? item.GUARDIAN.join("\n")
      //         : item.GUARDIAN,
      //       mail: Array.isArray(item.MAIL) ? item.MAIL.join("\n") : item.MAIL,
      //     };
      //   });

      //   const accountsData = result.data.accounts.map((item) => {
      //     return {
      //       usersurname: item.usersurname,
      //       username: item.username,
      //       userlogin: item.userlogin,
      //       departments: Array.isArray(item.departments)
      //         ? item.departments.join(", ")
      //         : item.departments,
      //     };
      //   });
      //   const sortedAccountsData = accountsData.sort((a, b) => {
      //     // Porównaj 'usersurname' w obu obiektach
      //     if (a.usersurname < b.usersurname) {
      //       return -1; // Jeśli a jest mniejsze niż b, a pojawi się wcześniej
      //     }
      //     if (a.usersurname > b.usersurname) {
      //       return 1; // Jeśli a jest większe niż b, b pojawi się wcześniej
      //     }
      //     return 0; // Jeśli są równe, pozostaw porządek bez zmian
      //   });

      //   const addObject = [
      //     { name: "struktura", data: structureData },
      //     { name: "konta", data: sortedAccountsData },
      //   ];

      //   generateExcel(addObject);
    } catch (error) {
      console.error(error);
    }
  };

  return raportDifferenceAs_Fk;
};
