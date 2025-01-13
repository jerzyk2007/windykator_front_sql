import { useEffect, useState } from "react";

import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";
import PleaseWait from "../PleaseWait";
import Table from "./Table";
import { prepareColumns } from "./utilsForTable/PrepareColumns";

import "./PrepareTable.css";

const PrepareTable = ({ info, raportDocuments }) => {
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
        { tableSettings }
      );
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   let isMounted = true;

  //   const getData = async () => {
  //     try {
  //       setPleaseWait(true);
  //       if (info==="raport") {

  //       }
  //       const dataTable = await axiosPrivateIntercept.get(
  //         `/documents/get-data-table/${auth.id_user}/${info}`
  //       );

  //       if (isMounted) {
  //         setDocuments(dataTable.data.dataTable);
  //         setTableSettings(dataTable.data.tableSettings);

  //         const update = prepareColumns(
  //           dataTable.data.columns,
  //           dataTable.data.dataTable
  //         );
  //         setColumns(update);
  //         setPleaseWait(false);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   getData();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [info, auth.id_user, setPleaseWait, axiosPrivateIntercept]);

  useEffect(() => {
    const controller = new AbortController();

    const getData = async () => {
      try {
        setPleaseWait(true);
        if (info === "raport") {
          setDocuments(raportDocuments);
        } else {
          const dataTable = await axiosPrivateIntercept.get(
            `/documents/get-data-table/${auth.id_user}/${info}`,
            { signal: controller.signal }
          );
          setDocuments(dataTable.data);
        }

        const tableSettingsColumns = await axiosPrivateIntercept.get(
          `/documents/get-settings-colums-table/${auth.id_user}`,
          { signal: controller.signal });

        setTableSettings(tableSettingsColumns.data.tableSettings);

        const update = prepareColumns(
          tableSettingsColumns.data.columns,
          info === "raport" ? documents : raportDocuments
          // dataTable.data.dataTable
        );
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
          // documents.length > 0 && (
          // tableSettings.pagination &&
          <Table
            documents={documents}
            setDocuments={setDocuments}
            columns={columns}
            settings={tableSettings}
            handleSaveSettings={handleSaveSettings}
          // getSingleRow={getSingleRow}
          // quickNote={quickNote}
          // setQuickNote={setQuickNote}
          // dataRowTable={dataRowTable}
          // setDataRowTable={setDataRowTable}
          // info={info}
          />
        )
      )}
    </section>
  );
};

export default PrepareTable;
