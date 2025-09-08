const sql = require('mssql');
const ERPConfig = process.env.MODE === 'PRODUCTION' ? require('../DB_config/ERP_config_production.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/ERP_config_develop.js') : undefined; 
const { databaseNameToOperate } = process.env.MODE === 'PRODUCTION' ? require('../DB_config/production_config.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/develop_config.js') : undefined; 

class MonthlyAccounting {
    async insertSalesSlipToACTMB(salesSlip) {
        try {
            const request = new sql.Request(salesSlip.transaction);
            let insertSalesSlipToACTMB = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, salesSlip.COMPANY)
            .input('CREATOR', sql.NVarChar, salesSlip.CREATOR)
            .input('USR_GROUP', sql.NVarChar, salesSlip.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, salesSlip.CREATE_DATE)
            .input('FLAG', sql.Int, salesSlip.FLAG)
            .input('CREATE_TIME', sql.NVarChar, salesSlip.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, salesSlip.CREATE_AP)
            .input('MB001', sql.NChar, salesSlip.MB001)
            .input('MB002', sql.NChar, salesSlip.MB002)
            .input('MB003', sql.NChar, salesSlip.MB003)
            .input('MB004', sql.NVarChar, salesSlip.MB004)
            .input('MB005', sql.NVarChar, salesSlip.MB005)
            .input('MB006', sql.Int, salesSlip.MB006)
            .input('MB007', sql.Int, salesSlip.MB007)
            .input('MB008', sql.NChar, salesSlip.MB008)
            .input('MB009', sql.NVarChar, salesSlip.MB009)
            .input('MB010', sql.NVarChar, salesSlip.MB010)
            .execute('insertSalesSlipToACTMB');
            return insertSalesSlipToACTMB.recordset;
        }
        catch (err) {
            await salesSlip.transaction.rollback();
            await salesSlip.dbConn.close();
            return err
        }
    }

    async getOldMonthlyAccounting(accountingCategory, year, month) {
        try {
            let pool = await sql.connect(ERPConfig);
            let oldMonthlyAccounting = await pool.request().query(`SELECT TOP(1) [MB004] FROM ${databaseNameToOperate}.[dbo].[ACTMB] 
                                                                WHERE [MB001] = '${accountingCategory}' and [MB002] = '${year}' and [MB003] = '${month}'`);
            return oldMonthlyAccounting.recordset;
        }
        catch(err) {
            throw new Error(err);
        }
    }

    async updateSalesSlipHeadToACTMB4111(accountingCategory, year, month, priceWithTax, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            let caseDoneRecord = await request.query(`UPDATE ${databaseNameToOperate}.[dbo].[ACTMB] 
                                                    SET MB005 = MB005 + ${priceWithTax}, MB007 = MB007 + 1, MB010 = MB010 + ${priceWithTax}
                                                    where [MB001] = '${accountingCategory}' and [MB002] = '${year}' and [MB003] = '${month}'`);
            return caseDoneRecord.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            return err;
        }
    }

    async updateSalesSlipHeadToACTMB1199(accountingCategory, year, month, priceWithTax, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            let caseDoneRecord = await request.query(`UPDATE ${databaseNameToOperate}.[dbo].[ACTMB] 
                                                    SET MB004 = MB004 + ${priceWithTax}, MB006 = MB006 + 1, MB009 = MB009 + ${priceWithTax}
                                                    where [MB001] = '${accountingCategory}' and [MB002] = '${year}' and [MB003] = '${month}'`);
            return caseDoneRecord.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            return err;
        }
    }

    async updateSalesSlipBodyToACTMB4111(accountingCategory, year, month, priceWithTax, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            let caseDoneRecord = await request.query(`UPDATE ${databaseNameToOperate}.[dbo].[ACTMB] 
                                                    SET MB005 = MB005 + ${priceWithTax}, MB010 = MB010 + ${priceWithTax}
                                                    where [MB001] = '${accountingCategory}' and [MB002] = '${year}' and [MB003] = '${month}'`);
            return caseDoneRecord.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            return err;
        }
    }

    async updateSalesSlipBodyToACTMB1199(accountingCategory, year, month, priceWithTax, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            let caseDoneRecord = await request.query(`UPDATE ${databaseNameToOperate}.[dbo].[ACTMB] 
                                                    SET MB004 = MB004 + ${priceWithTax}, MB009 = MB009 + ${priceWithTax}
                                                    where [MB001] = '${accountingCategory}' and [MB002] = '${year}' and [MB003] = '${month}'`);
            return caseDoneRecord.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            return err;
        }
    }
}

module.exports = { MonthlyAccounting }