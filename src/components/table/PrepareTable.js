import { useEffect, useState } from "react";
import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";
import PleaseWait from "../PleaseWait";
import Table from "./Table";
import {
  prepareColumnsInsider,
  prepareColumnsPartner,
} from "./utilsForTable/PrepareColumns";
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
        if (profile !== "insider" && profile !== "partner") {
          return; // przerwij działanie funkcji
        }

        const basePath = profile === "insider" ? "/documents" : "/law-partner";

        const dataTable = await axiosPrivateIntercept.get(
          `${basePath}/get-data-table/${auth.id_user}/${info}/${profile}`,
          { signal: controller.signal }
        );
        console.log(dataTable);
        setDocuments(dataTable.data);
        const tableSettingsColumns = await axiosPrivateIntercept.get(
          `/table/get-settings-colums-table/${auth.id_user}/${profile}`,
          { signal: controller.signal }
        );

        setTableSettings(tableSettingsColumns.data.tableSettings);

        const update =
          profile === "insider"
            ? prepareColumnsInsider(tableSettingsColumns.data.columns)
            : profile === "partner"
            ? prepareColumnsPartner(tableSettingsColumns.data.columns)
            : [];
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
