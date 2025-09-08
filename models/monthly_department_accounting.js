const sql = require('mssql');
const ERPConfig = process.env.MODE === 'PRODUCTION' ? require('../DB_config/ERP_config_production.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/ERP_config_develop.js') : undefined; 
const { databaseNameToOperate } = process.env.MODE === 'PRODUCTION' ? require('../DB_config/production_config.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/develop_config.js') : undefined; 

class MonthlyDepartmentAccounting {
    async insertSalesSlipToACTMD(salesSlip) {
        try {
            const request = new sql.Request(salesSlip.transaction);
            let insertSalesSlipToACTMD = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, salesSlip.COMPANY)
            .input('CREATOR', sql.NVarChar, salesSlip.CREATOR)
            .input('USR_GROUP', sql.NVarChar, salesSlip.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, salesSlip.CREATE_DATE)
            .input('FLAG', sql.Int, salesSlip.FLAG)
            .input('CREATE_TIME', sql.NVarChar, salesSlip.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, salesSlip.CREATE_AP)
            .input('MD001', sql.NChar, salesSlip.MD001)
            .input('MD002', sql.NChar, salesSlip.MD002)
            .input('MD003', sql.NChar, salesSlip.MD003)
            .input('MD004', sql.NChar, salesSlip.MD004)
            .input('MD005', sql.NVarChar, salesSlip.MD005)
            .input('MD006', sql.NVarChar, salesSlip.MD006)
            .input('MD007', sql.NChar, salesSlip.MD007)
            .input('MD008', sql.NVarChar, salesSlip.MD008)
            .input('MD009', sql.NVarChar, salesSlip.MD009)
            .execute('insertSalesSlipToACTMD');
            await salesSlip.transaction.commit();
            return insertSalesSlipToACTMD.recordset;
        }
        catch (err) {
            await salesSlip.transaction.rollback();
            return err
        } finally {
            await salesSlip.dbConn.close();
        }
    }

    async getOldMonthlyDepartmentAccounting(accountingCategory, department, year, month) {
        try {
            let pool = await sql.connect(ERPConfig);
            let oldMonthlyDepartmentAccounting = await pool.request().query(`SELECT TOP(1) [MD006] FROM ${databaseNameToOperate}.[dbo].[ACTMD] 
                                                                            WHERE [MD001] = '${accountingCategory}' and [MD002] = '${department}' and [MD003] = '${year}' and [MD004] = '${month}'`);
            return oldMonthlyDepartmentAccounting.recordset;
        }
        catch(err) {
            throw new Error(err);
        }
    }

    async updateSalesSlipToACTMD(accountingCategory, department, year, month, priceWithTax, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            let caseDoneRecord = await request.query(`UPDATE ${databaseNameToOperate}.[dbo].[ACTMD] 
                                                    SET MD006 = MD006 + ${priceWithTax}, MD009 = MD009 + ${priceWithTax}
                                                    where [MD001] = '${accountingCategory}' and [MD002] = '${department}' and [MD003] = '${year}' and [MD004] = '${month}'`);
            await transaction.commit();
            return caseDoneRecord.recordset;
        }
        catch(err) {
            await transaction.rollback();
            return err;
        } finally {
            await dbConn.close();
        }
    }
}

module.exports = { MonthlyDepartmentAccounting }