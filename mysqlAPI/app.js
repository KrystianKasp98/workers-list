const express = require("express");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");
const workersRoute = require("./routes/workers");

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.status(404).send({ message: `it's works` });
});

app.use("/workers", workersRoute);

module.exports = app;