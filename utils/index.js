exports.handleRequestAPI = (callback, req, res) => {
  try {
    callback();
  } catch (error) {
    return (
      res.status(500),
      json({
        error,
        message: "something went wrong",
      })
    );
  }
};

exports.handleDeletePropertyFromObject = (arr, obj) => {
  arr.forEach((item) => {
    if (obj[`${item}`]) {
      delete obj[`${item}`];
    }
  });
  return obj;
};

exports.handleServerResponseWorkerDocument = (
  res,
  statusCode,
  action,
  workerCode
) => {
  return res.status(statusCode).json({
    message:
      statusCode === 200
        ? `worker document(${workerCode}) has been ${
            action === "add" ? "added" : `${action}d`
          }`
        : `failed to ${action} document(${workerCode})`,
  });
};

exports.handleMethodElasticApi = async (req, res, elastic, action) =>
  this.handleRequestAPI(async () => {
    const { workerCode } = req.body;
    const methodFunction = elastic[`${action}WorkerDocument`];
    const result = methodFunction(req.body);
    if (!result) {
      return this.handleServerResponseWorkerDocument(
        res,
        409,
        action,
        workerCode
      );
    }
    return this.handleServerResponseWorkerDocument(
      res,
      200,
      action,
      workerCode
    );
  });

exports.generateWorkerCode = async (position, workers) => {
  let workerCode = `${position.charAt(0).toLocaleLowerCase()}-${Number(
    new Date().getTime()
  )
    .toString(16)
    .substring(6, 11)}`;
  console.log(workers);
  while (workers.some((item) => item.workerCode === workerCode)) {
    workerCode = `${position.charAt(0).toLocaleLowerCase()}-${Number(
      new Date().getTime()
    )
      .toString(16)
      .substring(6, 11)}`;
  }
  return workerCode;
};
