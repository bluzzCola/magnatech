var database = require("../database/config");

function buscarUltimasMedidas(idCaptura, limite_linhas) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `select top ${limite_linhas}
        temperatura, 
        umidade,  
                        momento,
                        CONVERT(varchar, momento, 108) as momento_grafico
                    from captura
                    where fk_aquario = 1
                    order by id desc`;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {

        instrucaoSql = `select idCaptura, fkSensor, temperatura, umidade, momento 
        from captura 
        where fkSensor = 1 limit ${limite_linhas};`;

    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMedidasEmTempoReal(idAquario) {

    instrucaoSql = ''

    if (process.env.AMBIENTE_PROCESSO == "producao") {
        instrucaoSql = `select top 1
         temperatura, 
         umidade,  
        CONVERT(varchar, momento, 108) as momento, 
                        fk_aquario 
                        from captura where fk_aquario = ${idAquario} 
                    order by id desc`;

    } else if (process.env.AMBIENTE_PROCESSO == "desenvolvimento") {
        instrucaoSql = `select 
        temperatura, 
        umidade,
                        DATE_FORMAT(momento,'%H:%i:%s') as momento, 
                        fkSensor
                        from captura where fkSensor = 1 
                    order by idCaptura desc limit 1`;
    } else {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM app.js\n");
        return
    }

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal
}
