const sequelize = require('../db/dbconnect');
const Sequelize = require("sequelize");

const Worker = sequelize.define("worker", {
  idWorker: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  position: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  workerCode: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  startOfWork: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  endOfWork: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Worker;