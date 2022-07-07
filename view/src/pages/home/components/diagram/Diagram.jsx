import React,{ useEffect, useState } from "react";
import "beautiful-react-diagrams/styles.css";
import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";

import MySqlApi from "../../../../api/mysqlApi";
import {
  groupWorkersListByPosition,
  prepareDiagramSchema,
} from "../../../../utils/index";

import "./css/diagram.sass"

// the diagram model

const DiagramProvider = () => {
  const [workers, setWorkers] = useState([]);
  const [isWorkersFetched, setIsWorkersFetched] = useState(false);

  useEffect(() => {
    const main = async () => {
      const workersList = await MySqlApi.getWorkers();
      const positionsList = await MySqlApi.getPositions();
      const workers = groupWorkersListByPosition(positionsList, workersList);
      setIsWorkersFetched(true);
      setWorkers(workers);
    };
    main();
  }, []);

  const prepareDiagrams = () => {
    if (!isWorkersFetched) return null;
    const keys = Object.keys(workers).map((key, index) => key);
    const values = Object.values(workers).map((val, index) => val);
    console.log({ keys });
    console.log({values});
    console.log('res:=>', workers)
    const workerMapped = keys.map((item, index) => {
      const objectOfWorkers = {};
      objectOfWorkers[item] = values[index];
      const initialSchemal = prepareDiagramSchema(objectOfWorkers);
      return <DiagramComponent initialSchema={initialSchemal} />
    }).reverse();
    return workerMapped
  }
  
  return (
    <div className="diagram-box">
      {prepareDiagrams()}
    </div>
  )
};

const DiagramComponent = (props) => {
  // create diagrams schema
  console.log(props.initialSchema);
  const initialSchema = createSchema(props.initialSchema);
  console.log({initialSchema});
  const [schema, { onChange }] = useSchema(initialSchema);

  return (
    <div style={{ height: "22.5rem", width: "1000px" }} className="test">
      <Diagram schema={schema} onChange={onChange} />
    </div>
  );
};

export default DiagramProvider;
