const {
  handleRequestAPI,
  handleDeletePropertyFromObject,
  generateWorkerCode
} = require("../../utils/index");
const superagent = require("superagent");
const Worker = require("../models/workers");

exports.getAllWorkers = async (req, res) => {
  handleRequestAPI(
    async () => {
      const workers = await Worker.findAll();
      if (!workers.length) {
        return res.status(200).json({
          workers: [],
          message: "there aren't workers",
        });
      }
      return res.status(200).json({
        workers,
      });
    },
    req,
    res
  );
};

exports.getAllDistinctPositions = async (req, res) => {
  handleRequestAPI(
    async () => {
      const positions = await Worker.findAll({
        attributes: ["position"],
        group: ["position"],
      }).then(positions => positions.map(item => item.position))
      console.log(positions);
      if (!positions.length) {
        return res.status(200).json({
          positions: [],
          message: "there aren't positions",
        });
      }
      return res.status(200).json({
        positions,
      });
    },
    req,
    res
  );
};

exports.getOneWorker = async (req, res) => {
  handleRequestAPI(
    async () => {
      const { id } = req.params;
      const worker = await Worker.findOne({ where: { workerCode: id } });
      console.log({worker});
      if (!worker) {
        return res.status(404).json({
          message: `worker with workerCode: ${id} not found in database`
        });
      }
      return res.status(200).json({
        worker: worker.dataValues
      })
    },
    req,
    res
  )
};

exports.deleteWorker = async (req, res) => {
  handleRequestAPI(
    async () => {
      const { id } = req.params;
      const deletedWorker = await Worker.destroy({ where: { workerCode: id } });
      if (!deletedWorker) {
        return res.status(404).json({
          message: `worker with workerCode: ${id} not found in database`,
        });
      }

      return res.status(200).json({
        message: `worker(${id}) has been removed`
      });
    },
    req,
    res
  );
}

exports.postWorker = async (req, res) => {
  handleRequestAPI(
    async () => {
      const { name, lastName, position, startOfWork, endOfWork } = req.body;
      console.log({ ...req.body });
      if (!name || !lastName || !position || !startOfWork || !endOfWork) {
        return res.status(409).json({
          message: `can't add worker, name, lastName, position, workerCode, startOfWork, endOfWork is required`,
        });
      }
      const workers = await Worker.findAll();
      const workerCode = await generateWorkerCode(position, workers);
      await Worker.create({
        name,
        lastName,
        position,
        workerCode,
        startOfWork,
        endOfWork,
      });
      //http://localhost:8001/workers-list/${workerCode}
      await superagent.post(`http://localhost:8001/workers-list/${workerCode}`)
        .send({workerCode, position, startOfWork, endOfWork});
      return res.status(201).json({
        message: `Worker ${workerCode} has been added`,
        worker: {
          name,
          lastName,
          position,
          workerCode,
          startOfWork,
          endOfWork,
        },
      });
    },
    req,
    res
  );
};

exports.updateWorker = async (req, res) => {
  handleRequestAPI(
    async () => {
      const { id } = req.params;
      const worker = await Worker.findOne({ where: { workerCode: id } });
      if (!worker) {
        return res.status(404).json({
          message: `worker with workerCode: ${id} not found in database`,
        });
      }
      const { name, lastName, position, startOfWork, endOfWork } = worker;
      let body = { ...req.body };
      body = handleDeletePropertyFromObject(['id', 'workerCode'], body);
      console.log({body});
      console.log({worker});
      await Worker.update(
        { ...body },
        { where: { idWorker: worker.idWorker } }
      );//proble did't update worker

      await superagent
        .post(`http://localhost:8001/workers-list/${id}`)
        .send({ workerCode: id, position, startOfWork, endOfWork });
      
      return res.status(201).json({
        message: `Worker ${id} has been added`,
        worker: {
          name,
          lastName,
          position,
          workerCode: id,
          startOfWork,
          endOfWork,
        },
      });
      //.then(result => res.status(200).send({
      //   message: `worker(${id}) has been successfully updated`
      // })).catch(error => {
      //   res.status(400).send({
      //     message: `failed to update worker(${id})`
      //   })
      // })

    },req,res
  )
}
