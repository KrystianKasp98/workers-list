exports.handleRequestAPI = (callback, req, res) => {
  try {
    callback();
  } catch (error) {
    return (
      res.status(500),
      json({
        error,
        message: "something went wrong",
        req
      })
    );
  }
};

/**
 * 
 * @param {array<string>} arr properties which you want to delete
 * @param {object} obj object that will be modified
 * @returns {object} object after delete all properties from arr
 */
exports.handleDeletePropertyFromObject = (arr, obj) => {
  arr.forEach((item) => {
    if (obj[`${item}`]) {
      delete obj[`${item}`];
    }
  });
  return obj;
};

/**
 * 
 * @param {object} res response 
 * @param {number} statusCode 
 * @param {string} action possible actions add, delete, update 
 * @param {string} workerCode  
 * @returns {object} server response
 * it's only for elasticsearchApis
 */
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

/**
 * IT'S TESTING FUNCTION 
 * @param {object} req  request
 * @param {object} res response
 * @param {object} elastic elasticsearch client
 * @param {string} action action that you will run 
 * @returns {object} server response
 */
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

/**
 * this function will generate and check new workerCode for employee based on position
 * @param {string} position 
 * @param {array<object>} workers 
 * @returns 
 */
exports.generateWorkerCode = async (position, workers) => {
  let workerCode = `${position.charAt(0).toLocaleLowerCase()}-${Number(
    new Date().getTime()
  )
    .toString(16)
    .substring(6, 11)}`;
  while (workers.some((item) => item.workerCode === workerCode)) {
    workerCode = `${position.charAt(0).toLocaleLowerCase()}-${Number(
      new Date().getTime()
    )
      .toString(16)
      .substring(6, 11)}`;
  }
  return workerCode;
};

/**
 * function for delay 
 * @param {number} ms 
 * @returns {Promise}
 * @example
 * sleep(5000)
 * //it will freeze program for 5 secs
 */
exports.sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * 
 * @param {function} callback 
 * it will run passed callback every midnight
 */
exports.resetAtMidnight = (callback) => {
    var now = new Date();
    var night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // the next day, ...
        0, 0, 0 // ...at 00:00:00 hours
    );
    var msToMidnight = night.getTime() - now.getTime();

    setTimeout(function() {
        callback();
        resetAtMidnight(callback);    //      Then, reset again next midnight.
    }, msToMidnight);
}