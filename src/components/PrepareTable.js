import { useEffect, useState } from "react";

import useAxiosPrivateIntercept from "./hooks/useAxiosPrivate";
import useData from "./hooks/useData";
import PleaseWait from "./PleaseWait";
import Table from "./Table";
import { prepareColumns } from "./utilsForTable/prepareColumns";

import "./PrepareTable.css";

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
        `/user/save-table-settings/${auth._id}`,
        { tableSettings }
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const getData = async () => {
      try {
        setPleaseWait(true);
        const dataTable = await axiosPrivateIntercept.get(
          `/documents/get-data-table/${auth._id}/${info}`
        );
        // console.log(dataTable.data);
        // const [result, settingsUser, getColumns] = await Promise.all([
        //   axiosPrivateIntercept.get(`/documents/get-all/${auth._id}/${info}`),
        //   axiosPrivateIntercept.get(`/user/get-table-settings/${auth._id}`),
        //   axiosPrivateIntercept.get(`/user/get-columns/${auth._id}`),
        // ]);
        if (isMounted) {
          setDocuments(dataTable.data.dataTable);
          setTableSettings(dataTable.data.tableSettings);
          // kolumny są modyfikowane wg filtrów
          const update = prepareColumns(
            dataTable.data.columns,
            dataTable.data.dataTable
          );
          // setDocuments(result.data);
          // setTableSettings(settingsUser.data);
          // const update = prepareColumns(getColumns.data, result.data);
          setColumns(update);
          setPleaseWait(false);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getData();

    return () => {
      isMounted = false;
    };
  }, [info, auth._id, setPleaseWait, axiosPrivateIntercept]);

  return (
    <section className="prepare_table">
      {pleaseWait ? (
        <PleaseWait />
      ) : (
        columns.length > 0 &&
        documents.length > 0 &&
        tableSettings.pagination && (
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
