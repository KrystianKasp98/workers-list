// module.exports
const { handleDeletePropertyFromObject, sleep } = require("../../utils/index");
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

  prepareIndex() {
    return `${this.indexName}${new Date().toISOString().split("T")[0]}`;
  }

  async createIndex() {
    const index = this.prepareIndex();
    let result = true;
    this.client.indices.exists({ index }, async (err, res, status) => {
      if (res.body) {
        console.log("index already exist");
        return !result;
      } else {
        console.log(res);
        const body = mappings;
        await this.client.indices.create({ index });
        await this.client.indices.putMapping({ index, body });
        await sleep(2000);
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

  /**
   *
   * @param {array} workersList
   * @returns {array} Returns mapped array of workers from mySql service
   */
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

  /**
   *
   * @param {array} dataset
   * this function add WorkersDocument in bulk
   */
  async addBulkWorkersDocument(dataset) {
    const index = this.prepareIndex(); //here problem occured because i tried to pass await as _index value
    const body = dataset.flatMap((doc) => [{ index: { _index: index } }, doc]);
    const { body: bulkResponse } = await this.client.bulk({
      refresh: true,
      body,
    });
    console.log(bulkResponse);
  }

  /**
   *
   * @param {object} body
   * this function add worker document to elasticsearch base, if someone add user to mysql db, this function will run
   * @returns {boolean} result of adding worker document
   */
  async addWorkerDocument(body) {
    const index = this.prepareIndex();
    body = this.mapWorkersList([body]);
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

  /**
   *
   * @param {object} body
   * @param {null | string} index this function update worker document in elasticsearch base, if index passed it's possible to update document older than today
   * @returns {boolean} result of updating worker document
   */
  async updateWorkerDocument(body, index = null) {
    const { workerCode } = body;
    const workerList = await this.getWorkersList();
    const workerDocument = workerList.filter(
      (worker) => worker._source.workerCode === workerCode
    );
    if (!workerDocument.length) {
      return false;
    }
    body = handleDeletePropertyFromObject(["workerCode"], body);
    const mappedBody = {
      doc: body,
    };
    index = index ? index : this.prepareIndex();
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

  /**
   *
   * @param {null | string | array<string>} index if null returns all transactions, string returns 1 index, arr returns 1`or more indexes
   * @returns {array<object>} return arr of workers documents
   */
  async getWorkersList(index = null) {
    index = index ? index : this.prepareIndex();

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

  /**
   *
   * @param {string} workerCode
   * @returns {boolean} @returns {boolean} result of deleting worker document
   */
  async deleteWorkerDocument(workerCode) {
    const index = this.prepareIndex();
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
