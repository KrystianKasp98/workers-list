const Sequelize = require("sequelize");

//we pass db name, username, password(null if not existed)
const sequelize = new Sequelize("workers-list", "root", "S3cret", {
  dialect: "mysql", //we use database mysql
  host: "localhost", //location of db
});

module.exports = sequelize;
