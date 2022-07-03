const Sequelize = require("sequelize");

//podajemy nazwe bazy danych, uzytkownika, haslo- null gdy nie ma
const sequelize = new Sequelize("workers-list", "root", "S3cret", {
  dialect: "mysql", //we use database mysql
  host: "localhost", //location of db
});

module.exports = sequelize;
