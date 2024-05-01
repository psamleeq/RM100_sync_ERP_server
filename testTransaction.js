const sql = require('mssql');
const ERPConfig = require('./DB_config/ERP_config_develop.js');

const executeProcedure = async () => {
    // sql connection
    const dbConn = new sql.ConnectionPool(ERPConfig);
    await dbConn.connect();
    let transaction;
    try {
        transaction = new sql.Transaction(dbConn);
        await transaction.begin();
        const request = new sql.Request(transaction);
        const result1 = await request.query(`INSERT INTO [APIsync].[dbo].[ERPCOPTGsynced] (serialNo, errorControl) VALUES (17, 0)`);
        const result2 = await request.query(`INSERT INTO [APIsync].[dbo].[ERPCOPTGsynced] (serialNo, errorControl) VALUES (18, 0)`);
        // await transaction.commit();
        return {transaction, request, dbConn};
    } catch (err) {
        await transaction.rollback();
        throw err;
    } 
    
    // finally {
    //     await dbConn.close();
    // }
};

const executeProcedure2 = async ({transaction, dbConn}) => {
    try {
        // await transaction.begin();
        console.log()
        const request = new sql.Request(transaction);
        const result3 = await request.query(`INSERT INTO [APIsync].[dbo].[ERPCOPTGsynced] (serialNo, errorControl) VALUES (19, 0)`);
        const result4 = await request.query(`INSERT INTO [APIsync].[dbo].[ERPCOPTGsynced] (serialNo, errorControl) VALUES (20, 0)`);
        await transaction.commit();
        return {result3, transaction};
    } catch (err) {
        await transaction.rollback();
        throw err;
    } finally {
        await dbConn.close();
        
    }
};
executeProcedure().then(({transaction, dbConn}) => {
    executeProcedure2({transaction, dbConn})
})



