import { diagram } from "./consts";

/**
 * 
 * @param {array} positionsList 
 * @param {array} workers 
 * @returns 
 */
export const groupWorkersListByPosition = (positionsList, workers) => {
  const groupedWorkersList = {};
  positionsList.forEach(position => {
    const positionMap = workers.filter(worker => worker.position === position)
    groupedWorkersList[position] = positionMap;
  })
  console.log(groupedWorkersList);
  return groupedWorkersList;
}

/**
 * 
 * @param {array} objectOfWorkers 
 */
export const prepareDiagramSchema = (objectOfWorkers) => {
  const title = Object.keys(objectOfWorkers)[0];
  const arrOfWorkers = objectOfWorkers[title];
  const lengthArr = arrOfWorkers.length;
  const lengthBetweenNodes = diagram.fullLength/lengthArr;
  const centerLength = diagram.positionName.x;
  const schema = {};
  schema.nodes = [{ id: title, content: title, coordinates: [centerLength, diagram.positionName.y] }];
  schema.links = [];
  arrOfWorkers.forEach((item,index) => {
    const node = {
      id: `${item.idWorker}`,
      content:`${item.workerCode}`,
      coordinates: [index * lengthBetweenNodes + 50, 200],
    };
    const link = { input: title, output: `${item.idWorker}` };
    if (arrOfWorkers.length === 1) {
      node.coordinates[0] = centerLength;
    }
    schema.nodes.push(node);
    schema.links.push(link);
  })
  return schema;
}
