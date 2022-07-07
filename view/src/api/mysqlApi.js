import api from "superagent";

export default class MySqlApi{
  static getWorkers() {
    return api
      .get(`http://localhost:8000/workers`)
      .set("accept", "json")
      .then(res => res.body.workers);
  }
  //returns all positions in company
  static getPositions() {
    return api
      .get(`http://localhost:8000/workers/positions`)
      .set("accept", "json")
      .then(res => res.body.positions);
  }

  static deleteWorker(workerCode) {
    return api
      .delete(`http://localhost:8000/workers/${workerCode}`)
      .set("accept", "json")
      .then(res => res.body)
  }
}