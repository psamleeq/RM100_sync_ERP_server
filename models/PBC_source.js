const sql = require('mssql');

class PBCsource {
    async insertSalesSlipToAJSLA(salesSlip) {
        try {
            const request = new sql.Request(salesSlip.transaction);
            let insertSalesSlipToAJSLA = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, salesSlip.COMPANY)
            .input('CREATOR', sql.NVarChar, salesSlip.CREATOR)
            .input('USR_GROUP', sql.NVarChar, salesSlip.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, salesSlip.CREATE_DATE)
            .input('FLAG', sql.Int, salesSlip.FLAG)
            .input('CREATE_TIME', sql.NVarChar, salesSlip.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, salesSlip.CREATE_AP)
            .input('LA001', sql.NChar, salesSlip.LA001)
            .input('LA002', sql.NChar, salesSlip.LA002)
            .input('LA003', sql.NChar, salesSlip.LA003)
            .input('LA004', sql.NChar, salesSlip.LA004)
            .input('LA005', sql.NVarChar, salesSlip.LA005)
            .input('LA006', sql.NChar, salesSlip.LA006)
            .input('LA007', sql.NChar, salesSlip.LA007)
            .execute('insertSalesSlipToAJSLA');
            return insertSalesSlipToAJSLA.recordset;
        }
        catch (err) {
            await salesSlip.transaction.rollback();
            await salesSlip.dbConn.close();
            return err
        }
    }
}

module.exports = { PBCsource }