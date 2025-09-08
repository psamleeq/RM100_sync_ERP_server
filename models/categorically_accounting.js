const sql = require('mssql'); 
const { databaseNameToOperate } = process.env.MODE === 'PRODUCTION' ? require('../DB_config/production_config.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/develop_config.js') : undefined; 

class CategoricallyAccounting {
    async insertSalesSlipToACTML(salesSlip) {
        try {
            const request = new sql.Request(salesSlip.transaction);
            let insertSalesSlipToACTML = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, salesSlip.COMPANY)
            .input('CREATOR', sql.NVarChar, salesSlip.CREATOR)
            .input('USR_GROUP', sql.NVarChar, salesSlip.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, salesSlip.CREATE_DATE)
            .input('FLAG', sql.Int, salesSlip.FLAG)
            .input('CREATE_TIME', sql.NVarChar, salesSlip.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, salesSlip.CREATE_AP)
            .input('ML001', sql.NVarChar, salesSlip.ML001)
            .input('ML002', sql.NVarChar, salesSlip.ML002)
            .input('ML003', sql.NChar, salesSlip.ML003)
            .input('ML004', sql.NChar, salesSlip.ML004)
            .input('ML005', sql.NChar, salesSlip.ML005)
            .input('ML006', sql.NVarChar, salesSlip.ML006)
            .input('ML007', sql.Int, salesSlip.ML007)
            .input('ML008', sql.NVarChar, salesSlip.ML008)
            .input('ML009', sql.NVarChar, salesSlip.ML009)
            .input('ML010', sql.NVarChar, salesSlip.ML010)
            .input('ML011', sql.NChar, salesSlip.ML011)
            .input('ML012', sql.NVarChar, salesSlip.ML012)
            .input('ML013', sql.NVarChar, salesSlip.ML013)
            .input('ML014', sql.NVarChar, salesSlip.ML014)
            .execute('insertSalesSlipToACTML');
            return insertSalesSlipToACTML.recordset;
        }
        catch (err) {
            await salesSlip.transaction.rollback();
            await salesSlip.dbConn.close();
            return err
        }
    }

    async updateSalesSlipToACTML(dTeam_succ, priceWithTax, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            let caseDoneRecord = await request.query(`UPDATE ${databaseNameToOperate}.[dbo].[ACTML] 
                                                    SET ML008 = ML008 + ${priceWithTax}, ML014 = ML014 + ${priceWithTax}
                                                    where ML009 = '${dTeam_succ}'`);
            return caseDoneRecord.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            return err;
        }
    } 
}

module.exports = { CategoricallyAccounting };