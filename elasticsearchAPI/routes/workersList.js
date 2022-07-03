const { Router } = require('express');
const {
  getWorkersList,
  createWorkersList,
  updateWorkerDocument,
  addWorkerDocument,
  deleteWorkerDocument,
} = require("../controllers/workersList");
const router = Router();

router.get("/", getWorkersList);
router.post("/", createWorkersList);
router.put("/:id", updateWorkerDocument);//update documentu when e.g worker stars work
router.post("/:id", addWorkerDocument);//create new document when user has been created in mysql
router.delete("/:id", deleteWorkerDocument);//delete worker Document
//default handle bad requests
router.use((req, res) => {
  console.log(req.method);
  return res.status(404).json({ message: `${req.method} is not valid method, for ${req.baseUrl} endpoint, possible methods: GET, POST, DELETE, PUT` })
});

module.exports = router;