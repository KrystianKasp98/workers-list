const app = require('./app');
const sequelize = require('./db/dbconnect');

const workers = require('./data/workers');
const Worker = require('./models/workers');

app.listen(8000, () => console.log('mysql server started... '));

sequelize
  .sync({ force: true })
  .then((res) => Worker.bulkCreate(workers, { ignoreDuplicates: true }));