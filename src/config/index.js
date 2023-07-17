const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('databasname', 'username', 'password', {
    host: 'localhost',
    dialect:"mysql",
    port: 'port'
  });
  
sequelize.authenticate(() => {
    console.log("Conexão Realizada com sucesso")
})

module.exports = {sequelize}