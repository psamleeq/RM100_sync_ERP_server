const sql = require('mssql');
const { databaseNameToOperate } = process.env.MODE === 'PRODUCTION' ? require('../DB_config/production_config.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/develop_config.js') : undefined; 

class Detail {
    async insertSalesSlipToACTMN(salesSlip) {
        try {
            const request = new sql.Request(salesSlip.transaction);
            let insertSalesSlipToACTMN = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, salesSlip.COMPANY)
            .input('CREATOR', sql.NVarChar, salesSlip.CREATOR)
            .input('USR_GROUP', sql.NVarChar, salesSlip.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, salesSlip.CREATE_DATE)
            .input('FLAG', sql.Int, salesSlip.FLAG)
            .input('CREATE_TIME', sql.NVarChar, salesSlip.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, salesSlip.CREATE_AP)
            .input('MN001', sql.NChar, salesSlip.MN001)
            .input('MN002', sql.NChar, salesSlip.MN002)
            .input('MN003', sql.NChar, salesSlip.MN003)
            .input('MN004', sql.NChar, salesSlip.MN004)
            .input('MN005', sql.NChar, salesSlip.MN005)
            .input('MN006', sql.NChar, salesSlip.MN006)
            .input('MN007', sql.NChar, salesSlip.MN007)
            .input('MN008', sql.Int, salesSlip.MN008)
            .input('MN009', sql.NVarChar, salesSlip.MN009)
            .input('MN010', sql.NVarChar, salesSlip.MN010)
            .input('MN011', sql.NVarChar, salesSlip.MN011)
            .input('MN012', sql.NVarChar, salesSlip.MN012)
            .input('MN013', sql.NVarChar, salesSlip.MN013)
            .input('MN014', sql.NVarChar, salesSlip.MN014)
            .input('MN015', sql.NVarChar, salesSlip.MN015)
            .input('MN016', sql.NVarChar, salesSlip.MN016)
            .input('MN017', sql.NVarChar, salesSlip.MN017)
            .input('MN018', sql.NVarChar, salesSlip.MN018)
            .input('MN019', sql.NVarChar, salesSlip.MN019)
            .input('MN020', sql.NVarChar, salesSlip.MN020)
            .execute('insertSalesSlipToACTMN');
            return insertSalesSlipToACTMN.recordset;
        }
        catch (err) {
            await salesSlip.transaction.rollback();
            await salesSlip.dbConn.close();
            return err;
        }
    }

    async updateSalesSlipToACTMN(dTeam_succ, priceWithTax, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            let caseDoneRecord = await request.query(`UPDATE ${databaseNameToOperate}.[dbo].[ACTMN] 
                                                    SET MN009 = MN009 + ${priceWithTax}, MN014 = MN014 + ${priceWithTax}
                                                    where MN010 = '${dTeam_succ}'`);
            return caseDoneRecord.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            return err;
        }
    } 
}

module.exports = { Detail }