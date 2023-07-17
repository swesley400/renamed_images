const { sequelize } = require("../config")


module.exports = {
    async getCount(){
        try{
            return await sequelize.query("select count(ptts_code) as count_ptts from tb_ptts;").then(ptts=> {
                return ptts[0][0].count_ptts
            })
        }
        catch(err){
            return err.message
        }
    },
    async getPttsImasges(idPtts) {
        try{
            const imgPtts = await sequelize.query(`select * from tb_imgs where imgs_ptts = ${idPtts};`)
            return imgPtts;
        }
        catch(err){
            return err.message
        }
    },
    async getFullNamePatiente(idPtts) {
        const paciente = await sequelize.query(`select concat(tb_ptts.ptts_code,'_',tb_ptts.ptts_fnme,tb_ptts.ptts_lnme) as nome_completo from tb_ptts where ptts_code =${idPtts};`)
        console.log(paciente)
        const {nome_completo} = paciente[0][0]
        return nome_completo.replace(/\s/g, '');
    }

}

