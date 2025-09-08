const sql = require('mssql');
const ERPConfig = process.env.MODE === 'PRODUCTION' ? require('../DB_config/ERP_config_production.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/ERP_config_develop.js') : undefined; 
const { databaseNameToOperate } = process.env.MODE === 'PRODUCTION' ? require('../DB_config/production_config.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/develop_config.js') : undefined; 

class PBC {
    async insertSalesSlipToAJSTA(salesSlip) {
        try {
            const request = new sql.Request(salesSlip.transaction);
            let insertSalesSlipToAJSTA = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, salesSlip.COMPANY)
            .input('CREATOR', sql.NVarChar, salesSlip.CREATOR)
            .input('USR_GROUP', sql.NVarChar, salesSlip.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, salesSlip.CREATE_DATE)
            .input('FLAG', sql.Int, salesSlip.FLAG)
            .input('CREATE_TIME', sql.NVarChar, salesSlip.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, salesSlip.CREATE_AP)
            .input('TA001', sql.NChar, salesSlip.TA001)
            .input('TA002', sql.NChar, salesSlip.TA002)
            .input('TA003', sql.NVarChar, salesSlip.TA003)
            .input('TA004', sql.NVarChar, salesSlip.TA004)
            .input('TA005', sql.NVarChar, salesSlip.TA005)
            .input('TA006', sql.NVarChar, salesSlip.TA006)
            .input('TA007', sql.NVarChar, salesSlip.TA007)
            .input('TA008', sql.NVarChar, salesSlip.TA008)
            .input('TA009', sql.NVarChar, salesSlip.TA009)
            .input('TA010', sql.NVarChar, salesSlip.TA010)
            .input('TA011', sql.NVarChar, salesSlip.TA011)
            .input('TA012', sql.NVarChar, salesSlip.TA012)
            .input('TA013', sql.NVarChar, salesSlip.TA013)
            .input('TA014', sql.NVarChar, salesSlip.TA014)
            .input('TA015', sql.NVarChar, salesSlip.TA015)
            .input('TA016', sql.NVarChar, salesSlip.TA016)
            .execute('insertSalesSlipToAJSTA');
            return insertSalesSlipToAJSTA.recordset;
        }
        catch (err) {
            await salesSlip.transaction.rollback();
            await salesSlip.dbConn.close();
            return err
        }
    }

    async insertSalesSlipToAJSTB(salesSlip) {
        try {
            const request = new sql.Request(salesSlip.transaction);
            let insertSalesSlipToAJSTB = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, salesSlip.COMPANY)
            .input('CREATOR', sql.NVarChar, salesSlip.CREATOR)
            .input('USR_GROUP', sql.NVarChar, salesSlip.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, salesSlip.CREATE_DATE)
            .input('FLAG', sql.Int, salesSlip.FLAG)
            .input('CREATE_TIME', sql.NVarChar, salesSlip.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, salesSlip.CREATE_AP)
            .input('TB001', sql.NChar, salesSlip.TB001)
            .input('TB002', sql.NChar, salesSlip.TB002)
            .input('TB003', sql.NChar, salesSlip.TB003)
            .input('TB004', sql.Int, salesSlip.TB004)
            .input('TB005', sql.NVarChar, salesSlip.TB005)
            .input('TB006', sql.NVarChar, salesSlip.TB006)
            .input('TB007', sql.NVarChar, salesSlip.TB007)
            .input('TB008', sql.NVarChar, salesSlip.TB008)
            .input('TB010', sql.NVarChar, salesSlip.TB010)
            .input('TB011', sql.NVarChar, salesSlip.TB011)
            .input('TB013', sql.NVarChar, salesSlip.TB013)
            .input('TB014', sql.NVarChar, salesSlip.TB014)
            .input('TB015', sql.NVarChar, salesSlip.TB015)
            .input('TB016', sql.NVarChar, salesSlip.TB016)
            .input('TB017', sql.NVarChar, salesSlip.TB017)
            .input('TB019', sql.NVarChar, salesSlip.TB019)
            .input('TB020', sql.NVarChar, salesSlip.TB020)
            .input('TB027', sql.NVarChar, salesSlip.TB027)
            .execute('insertSalesSlipToAJSTB');
            return insertSalesSlipToAJSTB.recordset;
        }
        catch (err) {
            await salesSlip.transaction.rollback();
            await salesSlip.dbConn.close();
            return err
        }
    }

    async genPBCserialNo(date) {
    // generate PCB serialNo from ERP
        if(date.length === 7) {
        // check input length
            try {
                let pool = await sql.connect(ERPConfig);
                let pCBserialNo = await pool.request().query(`SELECT TOP(1) [LA001] FROM ${databaseNameToOperate}.[dbo].[AJSLA] WHERE [LA001] like '${date}%' ORDER BY [LA001] DESC`);
                return pCBserialNo.recordset;
            }
            catch(error) {
                throw new Error(`Error in function genPBCserialNo: Fail to generate PCB serial number, ${error}`);
            }
        } else {
            throw new Error('Error in function genPBCserialNo: Wrong date provided.');
        }
    }

    async updateSalesSlipBodyToAJSTA(dTeam_succ, priceWithTax, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            let caseDoneRecord = await request.query(`UPDATE ${databaseNameToOperate}.[dbo].[AJSTA] 
                                                    SET TA007 = TA007 + ${priceWithTax}, TA008 = TA008 + ${priceWithTax}, TA009 = TA009 + ${priceWithTax}
                                                    where TA010 = '${dTeam_succ}'`);
            return caseDoneRecord.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            return err;
        }
    }

    async updateSalesSlipBodyToAJSTB(dTeam_succ, priceWithTax, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            let caseDoneRecord = await request.query(`UPDATE ${databaseNameToOperate}.[dbo].[AJSTB] 
                                                    SET TB007 = TB007 + ${priceWithTax}, TB017 = TB017 + ${priceWithTax}
                                                    where TB010 = '${dTeam_succ}'`);
            return caseDoneRecord.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            return err;
        }
    }
}

module.exports = { PBC };