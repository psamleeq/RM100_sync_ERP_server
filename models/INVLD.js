const sql = require('mssql');

class INVLD {
    async insertSalesSlipToINVLD(salesSlip) { // 派工單號
        try {
            const request = new sql.Request(salesSlip.transaction);
            let insertSalesSlipToINVLD = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, salesSlip.COMPANY)
            .input('CREATOR', sql.NVarChar, salesSlip.CREATOR)
            .input('USR_GROUP', sql.NVarChar, salesSlip.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, salesSlip.CREATE_DATE)
            .input('FLAG', sql.Int, salesSlip.FLAG)
            .input('CREATE_TIME', sql.NVarChar, salesSlip.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, salesSlip.CREATE_AP)
            .input('LD001', sql.NChar, salesSlip.LD001)
            .input('LD002', sql.NChar, salesSlip.LD002)
            .input('LD003', sql.NChar, salesSlip.LD003)
            .input('LD004', sql.Int, salesSlip.LD004)
            .input('LD005', sql.NChar, salesSlip.LD005)
            .input('LD006', sql.NChar, salesSlip.LD006)
            .input('LD007', sql.NChar, salesSlip.LD007)
            .input('LD008', sql.NVarChar, salesSlip.LD008)
            .input('LD009', sql.NVarChar, salesSlip.LD009)
            .input('LD010', sql.NVarChar, salesSlip.LD010)
            .input('LD011', sql.NVarChar, salesSlip.LD011)
            .input('LD012', sql.NVarChar, salesSlip.LD012)
            .input('LD013', sql.NVarChar, salesSlip.LD013)
            .input('LD014', sql.Int, salesSlip.LD014)
            .execute('insertSalesSlipToINVLD');
            await salesSlip.transaction.commit(); // 2024-04-22 Add End of transaction, 由於停用過帳功能將transaction commit 移至這，若需啟用過帳，刪除這些。
            return insertSalesSlipToINVLD.recordset;
        }
        // catch (err) { // 2024-04-22被停用，若須過帳，請啟用這些
        //     await salesSlip.transaction.rollback();
        //     await salesSlip.dbConn.close();
        //     return err;
        // }
        catch (err) {
            await salesSlip.transaction.rollback(); // 2024-04-22 Add End of transaction, 由於停用過帳功能將transaction commit 移至這，若需啟用過帳，刪除這些，並啟用上面的東西。
            return err
        } finally {
            await salesSlip.dbConn.close();
        }
    }
}

module.exports = { INVLD }