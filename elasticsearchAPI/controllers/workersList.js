const {
  handleRequestAPI,
  handleServerResponseWorkerDocument,
} = require("../../utils/index");


const Elastic = require('../db/dbconnect');
const elastic = new Elastic();

exports.getWorkersList = async (req, res) => {
  handleRequestAPI(
    async () => {
      let delay = 50;
      const result = await elastic.createIndex();
      if (result) {
        delay = 2000;
      }
      setTimeout(async () => {
        const workersList = await elastic.getWorkersList();
        if (!workersList?.length) {
          return res.status(200).json({
            workersList: [],
            message: "there aren't workers",
          });
        }
        return res.status(200).json({
          workersList,
        });
        
      },delay)
    },
    req,
    res
  );
};

exports.createWorkersList = async (req, res) => {
  handleRequestAPI(
    async () => {
      const result = await elastic.createIndex();
      if (result) {
        res.status(200).json({ message: "workers list(index) has been successfully added" });
      }
      else {
        res.status(409).json({message: "workers list(with current index) already exist"})
      }
    },
    req,
    res
  )
}

exports.updateWorkerDocument = async (req, res) => {
  handleRequestAPI(
    async () => {
      const workerCode = req.params.id;
      let body = req.body;
      body.workerCode = workerCode;
      const result = await elastic.updateWorkerDocument(body);
      if (!result) {
        return handleServerResponseWorkerDocument(res,409,'update',workerCode)
      }
      return handleServerResponseWorkerDocument(res,200,'update',workerCode)
    }
  )
};

exports.addWorkerDocument = async (req, res) => {
  handleRequestAPI(
    async () => {
      const { workerCode } = req.body;
      const result = await elastic.addWorkerDocument(req.body);
      if (!result) {
        return handleServerResponseWorkerDocument(res, 409, 'add', workerCode);
      }
      return handleServerResponseWorkerDocument(res,200,'add',workerCode)
    }
  )
}

exports.deleteWorkerDocument = async (req, res) => {
  handleRequestAPI(
    async () => {
      const workerCode = req.params.id;
      const result = await elastic.deleteWorkerDocument(req.body);
      if (!result) {
        return handleServerResponseWorkerDocument(res, 409, 'delete', workerCode);
      }
      return handleServerResponseWorkerDocument(res, 200, 'delete', workerCode);
    }
  )
}