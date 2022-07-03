import { useEffect, useState } from "react";
import "beautiful-react-diagrams/styles.css";
import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";

import MySqlApi from "../../../api/mysqlApi";
import {
  groupWorkersListByPosition,
  prepareDiagramSchema,
} from "../../../utils/index";

// the diagram model

const DiagramProvider = () => {
  const [workers, setWorkers] = useState([]);
  const [initialSchema, setInitialSchema] = useState(false);

  useEffect(() => {
    const main = async () => {
      const workersList = await MySqlApi.getWorkers();
      const positionsList = await MySqlApi.getPositions();
      const workers = groupWorkersListByPosition(positionsList, workersList);

      const wh = prepareDiagramSchema({ warehouseman: workers.warehouseman });//preapare diagrams for other positions, do refactor and descriptuon fucntion in utlis
      setInitialSchema(wh);

      console.log(wh);
      setWorkers(workers);
    };
    main();
  }, []);
  return (
    <div>
      { initialSchema && <DiagramComponent initialSchema={initialSchema} />}
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
    <div style={{ height: "22.5rem" }}>
      <Diagram schema={schema} onChange={onChange} />
    </div>
  );
};

// custom node: https://antonioru.github.io/beautiful-react-diagrams/#/Customisation

export default DiagramProvider;
