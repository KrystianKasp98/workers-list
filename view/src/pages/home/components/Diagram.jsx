import { useEffect,useState } from "react";
import "beautiful-react-diagrams/styles.css";
import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";

import MySqlApi from "../../../api/mysqlApi";
import { groupWorkersListByPosition} from "../../../utils/index"

// the diagram model
const initialSchema = createSchema({
  nodes: [
    { id: "node-1", content: "Node 1", coordinates: [250, 60]/*x,y*/ },
    { id: "node-2", content: "Node 2", coordinates: [100, 200] },
    { id: "node-3", content: "Node 3", coordinates: [250, 200] },
    { id: "node-4", content: "Node 4", coordinates: [400, 200] },
  ],
  links: [
    { input: "node-1", output: "node-2" },
    { input: "node-1", output: "node-3" },
    { input: "node-1", output: "node-4" },
  ],
});

const DiagramComponent = () => {
  // create diagrams schema
  const [schema, { onChange }] = useSchema(initialSchema);
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const main = async () => {
      const workersList = await MySqlApi.getWorkers();
      const positionsList = await MySqlApi.getPositions();
      const workers = groupWorkersListByPosition(positionsList,workersList)
      console.log(positionsList);
      console.log(workersList);
      console.log(workers);
      setWorkers(workersList);
      
    }
    main();
  },[])

  return (
    <div style={{ height: "22.5rem" }}>
      <Diagram schema={schema} onChange={onChange} />
    </div>
  );
};

export default DiagramComponent;
