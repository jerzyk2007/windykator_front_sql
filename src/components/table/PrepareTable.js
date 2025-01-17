import { useEffect, useState } from "react";

import useAxiosPrivateIntercept from "../hooks/useAxiosPrivate";
import useData from "../hooks/useData";
import PleaseWait from "../PleaseWait";
import Table from "./Table";
import { prepareColumns } from "./utilsForTable/PrepareColumns";
import { filteredArrayManagement } from '../table/utilsForTable/changeSingleDocument';
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

          // wyciągnięcie ostatniego elementu tabeli INFORMACJA_ZARZAD
          const filteredData = dataTable.data.map(item => {
            const parsedArray = item.INFORMACJA_ZARZAD !== 'BRAK' ? JSON.parse(item.INFORMACJA_ZARZAD) : item.INFORMACJA_ZARZAD;

            return {
              ...item,
              INFORMACJA_ZARZAD: item.INFORMACJA_ZARZAD !== 'BRAK' ? filteredArrayManagement(parsedArray) : item.INFORMACJA_ZARZAD
            };
          });

          setDocuments(filteredData);
        }

        const tableSettingsColumns = await axiosPrivateIntercept.get(
          `/documents/get-settings-colums-table/${auth.id_user}`,
          { signal: controller.signal });

        setTableSettings(tableSettingsColumns.data.tableSettings);

        const update = prepareColumns(
          tableSettingsColumns.data.columns,
          info !== "raport" ? documents : raportDocuments
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
