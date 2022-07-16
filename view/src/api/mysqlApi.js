import api from "superagent";

export default class MySqlApi{
  
  static getWorkers() {
    return api
      .get(`http://localhost:8000/workers`)
      .set("accept", "json")
      .then(res => res.body.workers);
  }

  static getWorker(workerCode) {
    return api
      .get(`http://localhost:8000/workers/${workerCode}`)
      .set("accept", "json")
      .then(res=>res.body.worker)
  }

  static updateWorker(workerCode, worker) {
    return api
      .put(`http://localhost:8000/workers/${workerCode}`)
      .send(worker)
      .set("accept", "json")
      .then(res=>res.body.worker)

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