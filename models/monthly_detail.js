const sql = require('mssql');
const ERPConfig = process.env.MODE === 'PRODUCTION' ? require('../DB_config/ERP_config_production.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/ERP_config_develop.js') : undefined; 
const { databaseNameToOperate } = process.env.MODE === 'PRODUCTION' ? require('../DB_config/production_config.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/develop_config.js') : undefined; 

class MonthlyDetail {
    async insertSalesSlipToACTMM(salesSlip) {
        try {
            const request = new sql.Request(salesSlip.transaction);
            let insertSalesSlipToACTMM = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, salesSlip.COMPANY)
            .input('CREATOR', sql.NVarChar, salesSlip.CREATOR)
            .input('USR_GROUP', sql.NVarChar, salesSlip.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, salesSlip.CREATE_DATE)
            .input('FLAG', sql.Int, salesSlip.FLAG)
            .input('CREATE_TIME', sql.NVarChar, salesSlip.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, salesSlip.CREATE_AP)
            .input('MM001', sql.NChar, salesSlip.MM001)
            .input('MM002', sql.NChar, salesSlip.MM002)
            .input('MM003', sql.NChar, salesSlip.MM003)
            .input('MM004', sql.NChar, salesSlip.MM004)
            .input('MM005', sql.NChar, salesSlip.MM005)
            .input('MM006', sql.NVarChar, salesSlip.MM006)
            .input('MM007', sql.NVarChar, salesSlip.MM007)
            .input('MM008', sql.Int, salesSlip.MM008)
            .input('MM009', sql.Int, salesSlip.MM009)
            .execute('insertSalesSlipToACTMM');
            return insertSalesSlipToACTMM.recordset;
        }
        catch (err) {
            await salesSlip.transaction.rollback();
            await salesSlip.dbConn.close();
            return err
        }
    }

    async getOldMonthlyDetail(clientNumber, year, month) {
        try {
            let pool = await sql.connect(ERPConfig);
            let oldMonthlyDetail = await pool.request().query(`SELECT TOP(1) [MM006] FROM ${databaseNameToOperate}.[dbo].[ACTMM] WHERE [MM003] = '${clientNumber}' and [MM004] = '${year}' and [MM005] = '${month}'`);
            return oldMonthlyDetail.recordset;
        }
        catch(error) {
            throw new Error(error)
        }
    }

    async updateSalesSlipBodyToACTMM(priceWithTax, clientNumber, year, month, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            let caseDoneRecord = await request.query(`UPDATE ${databaseNameToOperate}.[dbo].[ACTMM] 
                                                    SET MM006 = MM006 + ${priceWithTax}
                                                    where MM003 = '${clientNumber}' and MM004 = '${year}' and MM005 = '${month}'`);
            return caseDoneRecord.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            return err;
        }
    }

    async updateSalesSlipHeadToACTMM(priceWithTax, clientNumber, year, month, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            let caseDoneRecord = await request.query(`UPDATE ${databaseNameToOperate}.[dbo].[ACTMM] 
                                                    SET MM006 = MM006 + ${priceWithTax}, MM008 = MM008 + 1
                                                    where MM003 = '${clientNumber}' and MM004 = '${year}' and MM005 = '${month}'`);
            return caseDoneRecord.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            return err;
        }
    }
}

module.exports = { MonthlyDetail }