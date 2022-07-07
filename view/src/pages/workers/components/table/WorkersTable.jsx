import React, { useState, useEffect } from "react";
import MySqlApi from "../../../../api/mysqlApi";
import Table from "./Table";
import defaultColumns  from "./defaultColumns.json";
import "./css/table.sass"

function WorkersTable() {
  const [data, setDate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const columns = React.useMemo(
    () => [
      ...defaultColumns,
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div>
            <button
              onClick={() => handleTryDelete(row.original.workerCode)}
            >
              delete
            </button>
            <button onClick={() => console.log(row.original.workerCode)}>
              update
            </button>
          </div>
        ),
      },
    ],
    [data]
  );

  useEffect(() => {
    const main = async () => {
      const data = await MySqlApi.getWorkers();
      console.log(data);
      setDate(data);
    };
    main();
    setIsLoading(false);
  }, [isLoading]);

  const handleTryDelete = (workerCode) => {
    const result = window.confirm(`Are you sure that you want delete worker: ${workerCode}`);
    if (result) deleteWorker(workerCode);
  }

  const deleteWorker = async (workerCode) => {
    setIsLoading(true);
    const {message} = await MySqlApi.deleteWorker(workerCode);
    console.log(message);
    alert(message);
  }

  return (
    <div className="wrapper-table--workers">
      <Table columns={columns} data={data} />
    </div>
  );
}

export default WorkersTable;
