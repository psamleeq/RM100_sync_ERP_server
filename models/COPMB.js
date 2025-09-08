const sql = require('mssql');
const { databaseNameToOperate } = process.env.MODE === 'PRODUCTION' ? require('../DB_config/production_config.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/develop_config.js') : undefined; 
const { roundToTwo } = require('../utils/round.js');

class COPMB {
    async insertOrderToCOPMB(order) { // 派工單號
        try {
            const request = new sql.Request(order.transaction);
            let insertOrderToCOPMB = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, order.COMPANY)
            .input('CREATOR', sql.NVarChar, order.CREATOR)
            .input('USR_GROUP', sql.NVarChar, order.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, order.CREATE_DATE)
            .input('FLAG', sql.Int, order.FLAG)
            .input('CREATE_TIME', sql.NVarChar, order.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, order.CREATE_AP)
            .input('MB001', sql.NChar, order.MB001)
            .input('MB002', sql.NChar, order.MB002)
            .input('MB003', sql.NChar, order.MB003)
            .input('MB004', sql.NChar, order.MB004)
            .input('MB007', sql.NVarChar, order.MB007)
            .input('MB008', sql.NVarChar, order.MB008)
            .input('MB009', sql.NVarChar, order.MB009)
            .input('MB010', sql.NVarChar, order.MB010)
            .input('MB012', sql.NVarChar, order.MB012)
            .input('MB013', sql.NVarChar, order.MB013)
            .input('MB014', sql.NVarChar, order.MB014)
            .input('MB015', sql.NVarChar, order.MB015)
            .input('MB016', sql.NVarChar, order.MB016)
            .input('MB017', sql.NChar, order.MB017)
            .input('MB019', sql.NChar, order.MB019)
            .execute('insertOrderToCOPMB');
            await order.transaction.commit();
            return insertOrderToCOPMB.recordset;
        }
        catch (err) {
            await order.transaction.rollback();
            return err;
        } finally {
            await order.dbConn.close();
        }
    }

    async updateSalesSlipToCOPMB(date, MB002, actualPrice, transaction, dbConn) {
        try {
            actualPrice = roundToTwo(actualPrice/1.05);
            const request = new sql.Request(transaction);
            let updateSalesSlipToCOPMB = await request.query(`
            IF (SELECT CREATE_DATE FROM ${databaseNameToOperate}.[dbo].[COPMB] WHERE MB002 = '${MB002}') < '${date}'
                UPDATE ${databaseNameToOperate}.[dbo].[COPMB]
                SET MB009 = '${date}', MB010 = '${date}', MB014 = CREATE_DATE, MB008 = '${actualPrice}'
                WHERE MB002 = '${MB002}'
            ELSE
                UPDATE ${databaseNameToOperate}.[dbo].[COPMB]
                SET MB009 = '${date}', MB010 = '${date}', MB014 = '${date}', MB017 = '${date}', MB008 = '${actualPrice}'
                WHERE MB002 = '${MB002}'`); 
            return updateSalesSlipToCOPMB.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            return err;
        }
    }

    async deleteCOPMBfromOrder(iNVMB001, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            let orderEstimateIncome = await request.query(`
            delete from ${databaseNameToOperate}.[dbo].[COPMB] 
            OUTPUT deleted.MB008
            where MB002 = '${iNVMB001}'
            `);
            return orderEstimateIncome.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            throw new Error(err);
        }
    }
}

module.exports = { COPMB }