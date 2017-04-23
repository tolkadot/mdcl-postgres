var Sequelize = require('sequelize');
var mdclDb = 'postgres://postgres:t0lkad0tP@localhost:5432/mdcl_db'
console.log(mdclDb);
var sequelize = new Sequelize
(mdclDb, {
  dialect:'postgres'
 });
 console.log("hello");
 sequelize.authenticate().then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });
module.exports = sequelize;
