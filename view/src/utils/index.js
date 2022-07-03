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

