// module.exports
const { handleDeletePropertyFromObject } = require("../../utils/index");
const { Client } = require("@elastic/elasticsearch");
const mappings = require("./mapping.json");
const superagent = require("superagent");

class Elastic {
  constructor() {
    this.init();
  }
  init() {
    this.client = new Client({
      // node: `http://elasticsearch`,//it's for docker
      node: `http://localhost:9200`,
    });
    this.indexName = `workers-list-`;
    this.ajax = superagent;
    this.lastprepredIndex = false;
  }
  async prepareIndex() {
    const index = `${this.indexName}${prep().toISOString().split("T")[0]}`;
    return index;
  }
  async createIndex() {
    const index = await this.prepareIndex();
    let result = true;
    this.client.indices.exists({ index }, async (err, res, status) => {
      if (res.body) {
        console.log("index already exist");
        return !result;
      } else {
        console.log(res);
        const body = mappings;
        console.log("index===>", index);
        await this.client.indices.create({ index });
        await this.client.indices.putMapping({ index, body });
        await this.createWorkersList();
        return result;
      }
    });
  }
  async createWorkersList() {
    const mySqlApiUrl = "http://localhost:8000/workers";
    const workersList = await this.ajax
      .get(mySqlApiUrl)
      .set("accept", "json")
      .then((res) => res.body.workers)
      .catch((err) => console.log(err));
    const mappedWorkersList = this.mapWorkersList(workersList);
    this.addBulkWorkersDocument(mappedWorkersList);
  }
  mapWorkersList(workersList) {
    return workersList.map((workerDocument) => ({
      workerCode: workerDocument.workerCode,
      position: workerDocument.position,
      workingHours: {
        start: workerDocument.startOfWork,
        end: workerDocument.endOfWork,
      },
      attendance: {
        start: "",
        end: "",
      },
      date: new Date().toISOString(),
    }));
  }
  async addBulkWorkersDocument(dataset) {
    const index = await this.prepareIndex(); //here problem occured because i tried to pass await as _index value
    const body = dataset.flatMap((doc) => [{ index: { _index: index } }, doc]);
    const { body: bulkResponse } = await this.client.bulk({
      refresh: true,
      body,
    });
    console.log(bulkResponse);
  }

  //if someone add user to mysql db, this function will run
  async addWorkerDocument(body) {
    const index = await this.prepareIndex();
    body = this.mappedWorkersList([body]);
    body = body[0];
    return await this.client
      .index({
        index,
        body: {
          ...body,
        },
      })
      .then((res) => true)
      .catch((err) => false);
  }
  async updateWorkerDocument(body) {
    const { workerCode } = body;
    console.log("body==>>", body);
    console.log("workerCode=>>", workerCode);
    const workerList = await this.getWorkersList();
    const workerDocument = workerList.filter(
      (worker) => worker._source.workerCode === workerCode
    );
    console.log("id =>>", workerDocument[0]);
    if (!workerDocument.length) {
      return false;
    }
    console.log("list after change", workerDocument);
    body = handleDeletePropertyFromObject(["workerCode"], body);
    console.log("body after change ==>", body);
    const mappedBody = {
      doc: body,
    };
    const index = await this.prepareIndex();
    return await this.client
      .update({
        index: index,
        id: workerDocument[0]._id,
        body: mappedBody,
      })
      .then((res) => {
        console.log(res);
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
  async getWorkersList() {
    const index = await this.prepareIndex();

    const result = await this.client.search({
      index,
      body: {
        query: {
          match_all: {},
        },
      },
    });

    return result.body.hits.hits;
  }
  async deleteWorkerDocument(workerCode) {
    const index = await this.prepareIndex();
    return await this.client
      .delete({
        index,
        workerCode,
      })
      .then((res) => true)
      .catch((err) => false);
  }
}

module.exports = Elastic;

//`workers-list-${new Date().toISOString().split('T')[0]}`
