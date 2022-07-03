const { Router } = require('express');
const { getAllWorkers, getAllDistinctPositions, getOneWorker, postWorker,deleteWorker,updateWorker } = require("../controllers/workers");
const router = Router();

router.get("/", getAllWorkers);
router.get("/positions", getAllDistinctPositions);
router.get("/:id", getOneWorker);
router.post("/", postWorker);
router.put('/:id', updateWorker);
router.delete('/:id', deleteWorker);

//default handle wrong method
router.use((req, res) => {
  console.log(req.method);
  return res.status(404).json({ message: `${req.method} is not valid method, for ${req.baseUrl} endpoint, possible methods: GET, POST, DELETE` })
});

module.exports = router;