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
  const lengthBetweenNodes = 150;
  const fullLengthNodes = (lengthArr - 1) * lengthBetweenNodes;
  const centerLength = fullLengthNodes / 2;
  const schema = {};
  schema.nodes = [{ id: title, content: title, coordinates: [centerLength, 60] }];
  schema.links = [];
  arrOfWorkers.forEach((item,index) => {
    const node = {
      id: `${item.idWorker}`,
      content:
        `name: ${item.name} ${item.lastName}

workerCode: ${item.workerCode}
`,
      coordinates: [index * lengthBetweenNodes, 200],
    };
    const link = { input: title, output: `${item.idWorker}` };
    schema.nodes.push(node);
    schema.links.push(link);
  })
  return schema;
}
