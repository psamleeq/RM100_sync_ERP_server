const sql = require('mssql');
const ERPConfig = process.env.MODE === 'PRODUCTION' ? require('../DB_config/ERP_config_production.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/ERP_config_develop.js') : undefined; 
const { databaseNameToOperate, workflowDsyncRecordTable } = process.env.MODE === 'PRODUCTION' ? require('../DB_config/production_config.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/develop_config.js') : undefined; 

class MiscellaneousCost{
    async insertMiscellaneousCostToSalesSlipBody(miscellaneousCosts) {
        try {
            const request = new sql.Request(miscellaneousCosts.transaction);
            let insertMiscellaneousCostsToSalesSlipBody = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, miscellaneousCosts.COMPANY)
            .input('CREATOR', sql.NVarChar, miscellaneousCosts.CREATOR)
            .input('USR_GROUP', sql.NVarChar, miscellaneousCosts.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, miscellaneousCosts.CREATE_DATE)
            .input('FLAG', sql.Int, miscellaneousCosts.FLAG)
            .input('CREATE_TIME', sql.NVarChar, miscellaneousCosts.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, miscellaneousCosts.CREATE_AP)
            .input('TH001', sql.NChar, miscellaneousCosts.TH001)
            .input('TH002', sql.NChar, miscellaneousCosts.TH002)
            .input('TH003', sql.NChar, miscellaneousCosts.TH003)
            .input('TH004', sql.NVarChar, miscellaneousCosts.TH004)
            .input('TH005', sql.NVarChar, miscellaneousCosts.TH005)
            .input('TH007', sql.NVarChar, miscellaneousCosts.TH007)
            .input('TH008', sql.NVarChar, miscellaneousCosts.TH008)
            .input('TH009', sql.NVarChar, miscellaneousCosts.TH009)
            .input('TH010', sql.NVarChar, miscellaneousCosts.TH010)
            .input('TH012', sql.NVarChar, miscellaneousCosts.TH012)
            .input('TH013', sql.NVarChar, miscellaneousCosts.TH013)
            .input('TH018', sql.NVarChar, miscellaneousCosts.TH018)
            .input('TH020', sql.NVarChar, miscellaneousCosts.TH020)
            .input('TH021', sql.NVarChar, miscellaneousCosts.TH021)
            .input('TH024', sql.NVarChar, miscellaneousCosts.TH024)
            .input('TH025', sql.NVarChar, miscellaneousCosts.TH025)
            .input('TH026', sql.NVarChar, miscellaneousCosts.TH026)
            .input('TH030', sql.NVarChar, miscellaneousCosts.TH030)
            .input('TH031', sql.NVarChar, miscellaneousCosts.TH031)
            .input('TH035', sql.NVarChar, miscellaneousCosts.TH035)
            .input('TH036', sql.NVarChar, miscellaneousCosts.TH036)
            .input('TH037', sql.NVarChar, miscellaneousCosts.TH037)
            .input('TH038', sql.NVarChar, miscellaneousCosts.TH038)
            .input('TH042', sql.NVarChar, miscellaneousCosts.TH042)
            .input('TH043', sql.NVarChar, miscellaneousCosts.TH043)
            .input('TH057', sql.NVarChar, miscellaneousCosts.TH057)
            .input('TH099', sql.NVarChar, miscellaneousCosts.TH099)
            .input('TH079', sql.NVarChar, miscellaneousCosts.TH079)
            .execute('insertMiscellaneousCostsToSalesSlipBody');
            return insertMiscellaneousCostsToSalesSlipBody.recordset;
        }
        catch (err) {
            await miscellaneousCosts.transaction.rollback();
            await miscellaneousCosts.dbConn.close();
            return err;
        }
    }

    async getMiscellaneousCost(dTeam, succ) {
        try {
            let pool = await sql.connect(ERPConfig);
            let miscellaneousCost = await pool.request().query(`
            select b.工程項目 AS 'item',a.[數量] AS 'cost'
            from [192.168.8.214].[rm100].[dbo].[計價紀錄] a 
            inner join [192.168.8.214].[rm100].[dbo].[估驗詳細表] b on a.DTEAM = b.dteam and a.項次 = b.項次
            where a.reccontrol = '1' and a.備註='實際' and a.DTEAM = '${dTeam}' and a.SUCC = '${succ}' and right(a.項次,2) = '.0' and 
            right('00'+left(a.項次,patindex('%.%',a.項次)-1),3) >= '003' 
            order by b.ID,b.項次`);
            return miscellaneousCost.recordset;
        }
        catch(err) {
            throw new Error(err);
        }
    }

    async getERPmiscellaneousCostWaiting() {
        // get dTeam_succ from waiting table
        try {
            let pool = await sql.connect(ERPConfig);
            let miscellaneousCostInfo = await pool.request().query(`
            SELECT TOP (1) [serialNo] FROM [APIsync].[dbo].${workflowDsyncRecordTable} where errorControl = '1'`);
            return miscellaneousCostInfo.recordset;
        }
        catch(err) {
            throw new Error(err) 
        }
    }

    async insertERPmiscellaneousCostWaiting(dTeam, succ, errorValue, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            let unsnycCaseDone = await request.query(`INSERT INTO [APIsync].[dbo].${workflowDsyncRecordTable} (serialNo, errorControl) VALUES ('${dTeam}_${succ}', '${errorValue}')`);
            return unsnycCaseDone.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            return err;
        }
    }

    async initializeERPmiscellaneousCostWaiting() {
        try {
            let pool = await sql.connect(ERPConfig);
            let caseDoneWaiting = await pool.request().query(`UPDATE [APIsync].[dbo].${workflowDsyncRecordTable} SET errorControl = '1' where errorControl ='0'`);
            return caseDoneWaiting.recordset;
        }
        catch(err) {
            return err;
        }
    }

    async updateERPmiscellaneousCostWaitingTo0(dTeam_succ) {
        try {
            let pool = await sql.connect(ERPConfig);
            let costsTriedToday = await pool.request().query(`UPDATE [APIsync].[dbo].${workflowDsyncRecordTable} SET errorControl = '0' 
                                                                OUTPUT deleted.errorControl
                                                                where serialNo ='${dTeam_succ}'`);
            return costsTriedToday.recordset;
        }
        catch(err) {
            throw new Error(err);
        }
    }

    async updateERPmiscellaneousCostWaiting(dTeam_succ, errorValue) {
        try {
            let pool = await sql.connect(ERPConfig);
            let waitingRecord = await pool.request().query(`UPDATE [APIsync].[dbo].${workflowDsyncRecordTable} SET errorControl = '${errorValue}' where serialNo ='${dTeam_succ}'`);
            return waitingRecord.recordset;
        }
        catch(err) {
            return err;
        }
    }

    async getOldERPsalesSlipBodyInfoForCost(dteamSucc) {
        // get old sales slip body and largest price form ERP
        try {
            let pool = await sql.connect(ERPConfig);
            let TH123FROMERP = await pool.request().query(`SELECT [TH001], [TH002],[TH030], max([TH003]) AS [TH003], max([TH035]) AS [TH035] FROM ${databaseNameToOperate}.[dbo].[COPTH] 
                                                        where [TH018] = '${dteamSucc}' group by [TH001], [TH002],[TH030]`);
            return TH123FROMERP.recordset;
        }
        catch(err) {
            throw new Error(err);
        }
    }

    async deleteERPmiscellaneousCostWaiting(dTeam_succ) {
    // delete synced miscellaneous cost from waiting table
        try {
            let pool = await sql.connect(ERPConfig);
            let waitingRecord = await pool.request().query(`DELETE FROM [APIsync].[dbo].${workflowDsyncRecordTable} WHERE serialNo ='${dTeam_succ}'`);
            return waitingRecord.recordset;
        }
        catch(err) {
            return err;
        }
    }

    async insertOrderToCOPMB(miscellaneousCosts) { // 派工單號
        try {
            const request = new sql.Request(miscellaneousCosts.transaction);
            let insertOrderToCOPMB = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, miscellaneousCosts.COMPANY)
            .input('CREATOR', sql.NVarChar, miscellaneousCosts.CREATOR)
            .input('USR_GROUP', sql.NVarChar, miscellaneousCosts.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, miscellaneousCosts.CREATE_DATE)
            .input('FLAG', sql.Int, miscellaneousCosts.FLAG)
            .input('CREATE_TIME', sql.NVarChar, miscellaneousCosts.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, miscellaneousCosts.CREATE_AP)
            .input('MB001', sql.NChar, miscellaneousCosts.MB001)
            .input('MB002', sql.NChar, miscellaneousCosts.MB002)
            .input('MB003', sql.NChar, miscellaneousCosts.MB003)
            .input('MB004', sql.NChar, miscellaneousCosts.MB004)
            .input('MB007', sql.NVarChar, miscellaneousCosts.MB007)
            .input('MB008', sql.NVarChar, miscellaneousCosts.MB008)
            .input('MB009', sql.NVarChar, miscellaneousCosts.MB009)
            .input('MB010', sql.NVarChar, miscellaneousCosts.MB010)
            .input('MB012', sql.NVarChar, miscellaneousCosts.MB012)
            .input('MB013', sql.NVarChar, miscellaneousCosts.MB013)
            .input('MB014', sql.NVarChar, miscellaneousCosts.MB014)
            .input('MB015', sql.NVarChar, miscellaneousCosts.MB015)
            .input('MB016', sql.NVarChar, miscellaneousCosts.MB016)
            .input('MB017', sql.NChar, miscellaneousCosts.MB017)
            .input('MB019', sql.NChar, miscellaneousCosts.MB019)
            .execute('insertOrderToCOPMB');
            return insertOrderToCOPMB.recordset;
        }
        catch (err) {
            await miscellaneousCosts.transaction.rollback();
            await miscellaneousCosts.dbConn.close();
            return err;
        }
    }
}

module.exports = { MiscellaneousCost }