import { useEffect, useState } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";
import PleaseWait from "../PleaseWait";
import Table from "./Table";
import { prepareColumns } from "./utilsForTable/PrepareColumns";
import "./PrepareTable.css";

// const PrepareTable = ({ info, raportDocuments }) => {
const PrepareTable = ({ info, profile }) => {
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
        `/user/save-table-settings/${auth.id_user}/${profile}`,
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
        const dataTable = await axiosPrivateIntercept.get(
          `/documents/get-data-table/${auth.id_user}/${info}/${profile}`,
          { signal: controller.signal }
        );
        console.log(dataTable.data);
        setDocuments(dataTable.data);
        const tableSettingsColumns = await axiosPrivateIntercept.get(
          `/table/get-settings-colums-table/${auth.id_user}/${profile}`,
          { signal: controller.signal }
        );
        console.log(tableSettingsColumns.data.tableSettings);

        setTableSettings(tableSettingsColumns.data.tableSettings);

        const update = prepareColumns(tableSettingsColumns.data.columns);

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
            profile={profile}
          />
        )
      )}
    </section>
  );
};

export default PrepareTable;
