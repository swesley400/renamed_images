const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('zscan_database', 'root', '4hBbQNVymFQX', {
    host: 'localhost',
    dialect:"mysql",
    port: '4914'
  });
  
sequelize.authenticate(() => {
    console.log("Conexão Realizada com sucesso")
})

module.exports = { sequelize }