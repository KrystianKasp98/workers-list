const express = require("express");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");
const Elastic = require("./db/dbconnect");
const workerslistRoute = require('./routes/workersList');

const elastic = new Elastic();
const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));


// app.post("/workers-list", async (req, res) => {
//   const result = await elastic.createIndex();
//   if (result) {
//     res.status(200).json({ message: "index has been successfully added" });
//   }
//   else {
//     res.status(404).json({message: "index already exist"})
//   }
// });
app.use("/workers-list", workerslistRoute);


module.exports = app;