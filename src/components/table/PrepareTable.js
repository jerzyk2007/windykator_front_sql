import { useEffect, useState } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";
import PleaseWait from "../PleaseWait";
import Table from "./Table";
import { prepareColumns } from "./utilsForTable/PrepareColumns";
import "./PrepareTable.css";

// const PrepareTable = ({ info, raportDocuments }) => {
const PrepareTable = ({ info }) => {
  const axiosPrivateIntercept = useAxiosPrivateIntercept();
  const { auth } = useData();
  const [columns, setColumns] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [tableSettings, setTableSettings] = useState([]);
  const [pleaseWait, setPleaseWait] = useState(false);

  const handleSaveSettings = async (
    columnSizing,
    columnVisibility,
    columnOrder,
    columnPinning,
    pagination
  ) => {
    const tableSettings = {
      size: { ...columnSizing },
      visible: { ...columnVisibility },
      order: columnOrder,
      pinning: columnPinning,
      pagination,
    };
    try {
      await axiosPrivateIntercept.patch(
        `/user/save-table-settings/${auth.id_user}`,
        { newTableSettings: tableSettings }
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const getData = async () => {
      try {
        setPleaseWait(true);
        // if (info === "raport") {
        //   // setDocuments(raportDocuments);
        // } else {
        const dataTable = await axiosPrivateIntercept.get(
          `/documents/get-data-table/${auth.id_user}/${info}`,
          { signal: controller.signal }
        );
        // for (const doc of dataTable.data) {
        //   if (doc.NUMER_FV === "FV/UBL/632/25/A/D38") {
        //     console.log(doc);
        //   }
        // }

        setDocuments(dataTable.data);
        // }

        const userType = "Pracownik";
        const tableSettingsColumns = await axiosPrivateIntercept.get(
          `/table/get-settings-colums-table/${auth.id_user}/${userType}`,
          { signal: controller.signal }
        );
        // console.log(tableSettingsColumns.data);
        setTableSettings(tableSettingsColumns.data.tableSettings);

        const update = prepareColumns(
          tableSettingsColumns.data.columns
          // info !== "raport" ? documents : raportDocuments
          // dataTable.data
        );
        console.log(update);
        setColumns(update);
        setPleaseWait(false);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error(err);
        }
      }
    };

    getData();

    return () => {
      controller.abort(); // Anulowanie żądania przy odmontowaniu komponentu
    };
  }, [info, auth.id_user, setPleaseWait, axiosPrivateIntercept]);

  return (
    <section className="prepare_table">
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        columns.length > 0 && (
          <Table
            documents={documents}
            setDocuments={setDocuments}
            columns={columns}
            settings={tableSettings}
            handleSaveSettings={handleSaveSettings}
            roles={auth.roles}
          />
        )
      )}
    </section>
  );
};

export default PrepareTable;
