const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('', '', '', {
    host: 'localhost',
    dialect:"mysql",
    port: ''
  });
  
sequelize.authenticate(() => {
    console.log("Conexão Realizada com sucesso")
})

module.exports = { sequelize }
