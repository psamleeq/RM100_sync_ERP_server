const sql = require('mssql');
const ERPConfig = process.env.MODE === 'PRODUCTION' ? require('../DB_config/ERP_config_production.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/ERP_config_develop.js') : undefined; 
const { databaseNameToOperate, workflowBsyncRecordTable } = process.env.MODE === 'PRODUCTION' ? require('../DB_config/production_config.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/develop_config.js') : undefined; 
const { roundToTwo } = require('../utils/round.js');

class SalesSlip {
    async insertSalesSlipHead(salesSlipHead) { // 派工單號
        try {
            const request = new sql.Request(salesSlipHead.transaction);
            let insertSalesSlipHead = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, salesSlipHead.COMPANY)
            .input('CREATOR', sql.NVarChar, salesSlipHead.CREATOR)
            .input('USR_GROUP', sql.NVarChar, salesSlipHead.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, salesSlipHead.CREATE_DATE)
            .input('FLAG', sql.Int, salesSlipHead.FLAG)
            .input('CREATE_TIME', sql.NVarChar, salesSlipHead.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, salesSlipHead.CREATE_AP)
            .input('TG001', sql.NChar, salesSlipHead.TG001)
            .input('TG002', sql.NChar, salesSlipHead.TG002)
            .input('TG003', sql.NVarChar, salesSlipHead.TG003)
            .input('TG004', sql.NVarChar, salesSlipHead.TG004)
            .input('TG005', sql.NVarChar, salesSlipHead.TG005)
            .input('TG007', sql.NVarChar, salesSlipHead.TG007)
            .input('TG010', sql.NVarChar, salesSlipHead.TG010)
            .input('TG011', sql.NVarChar, salesSlipHead.TG011)
            .input('TG012', sql.NVarChar, salesSlipHead.TG012)
            .input('TG013', sql.NVarChar, salesSlipHead.TG013)
            .input('TG015', sql.NVarChar, salesSlipHead.TG015)
            .input('TG016', sql.NVarChar, salesSlipHead.TG016)
            .input('TG017', sql.NVarChar, salesSlipHead.TG017)
            .input('TG020', sql.NVarChar, salesSlipHead.TG020)
            .input('TG022', sql.Int, salesSlipHead.TG022)
            .input('TG023', sql.NVarChar, salesSlipHead.TG023)
            .input('TG024', sql.NVarChar, salesSlipHead.TG024)
            .input('TG025', sql.NVarChar, salesSlipHead.TG025)
            .input('TG030', sql.NVarChar, salesSlipHead.TG030)
            .input('TG031', sql.NVarChar, salesSlipHead.TG031)
            .input('TG032', sql.Int, salesSlipHead.TG032)
            .input('TG033', sql.Int, salesSlipHead.TG033)
            .input('TG034', sql.NVarChar, salesSlipHead.TG034)
            .input('TG036', sql.NVarChar, salesSlipHead.TG036)
            .input('TG037', sql.NVarChar, salesSlipHead.TG037)
            .input('TG038', sql.NVarChar, salesSlipHead.TG038)
            .input('TG041', sql.Int, salesSlipHead.TG041)
            .input('TG042', sql.NVarChar, salesSlipHead.TG042)
            .input('TG043', sql.NVarChar, salesSlipHead.TG043)
            .input('TG044', sql.NVarChar, salesSlipHead.TG044)
            .input('TG045', sql.NVarChar, salesSlipHead.TG045)
            .input('TG046', sql.NVarChar, salesSlipHead.TG046)
            .input('TG047', sql.NVarChar, salesSlipHead.TG047)
            .input('TG049', sql.NVarChar, salesSlipHead.TG049)
            .input('TG055', sql.NVarChar, salesSlipHead.TG055)
            .input('TG056', sql.NVarChar, salesSlipHead.TG056)
            .input('TG057', sql.NVarChar, salesSlipHead.TG057)
            .input('TG058', sql.Int, salesSlipHead.TG058)
            .input('TG063', sql.NVarChar, salesSlipHead.TG063)
            .input('TG064', sql.NVarChar, salesSlipHead.TG064)
            .input('TG065', sql.NVarChar, salesSlipHead.TG065)
            .input('TG068', sql.NVarChar, salesSlipHead.TG068)
            .input('TG070', sql.NVarChar, salesSlipHead.TG070)
            .input('TG071', sql.NVarChar, salesSlipHead.TG071)
            .input('TG072', sql.NVarChar, salesSlipHead.TG072)
            .input('TG132', sql.NVarChar, salesSlipHead.TG132)
            .input('TG091', sql.NVarChar, salesSlipHead.TG091)
            .input('TG092', sql.NVarChar, salesSlipHead.TG092)
            .input('TG093', sql.NVarChar, salesSlipHead.TG093)
            .input('TG094', sql.NVarChar, salesSlipHead.TG094)
            .execute('insertSalesSlipHead');
            return insertSalesSlipHead.recordset;
        }
        catch (err) {
            await salesSlipHead.transaction.rollback();
            await salesSlipHead.dbConn.close();
            return err;
        }
    }

    async insertSalesSlipBody(salesSlipBody) {
        try {
            const request = new sql.Request(salesSlipBody.transaction);
            let insertSalesSlipBody = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, salesSlipBody.COMPANY)
            .input('CREATOR', sql.NVarChar, salesSlipBody.CREATOR)
            .input('USR_GROUP', sql.NVarChar, salesSlipBody.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, salesSlipBody.CREATE_DATE)
            .input('FLAG', sql.Int, salesSlipBody.FLAG)
            .input('CREATE_TIME', sql.NVarChar, salesSlipBody.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, salesSlipBody.CREATE_AP)
            .input('TH001', sql.NChar, salesSlipBody.TH001)
            .input('TH002', sql.NChar, salesSlipBody.TH002)
            .input('TH003', sql.NChar, salesSlipBody.TH003)
            .input('TH004', sql.NVarChar, salesSlipBody.TH004)
            .input('TH005', sql.NVarChar, salesSlipBody.TH005)
            .input('TH006', sql.NVarChar, salesSlipBody.TH006)
            .input('TH007', sql.NVarChar, salesSlipBody.TH007)
            .input('TH008', sql.NVarChar, salesSlipBody.TH008)
            .input('TH009', sql.NVarChar, salesSlipBody.TH009)
            .input('TH010', sql.NVarChar, salesSlipBody.TH010)
            .input('TH012', sql.NVarChar, salesSlipBody.TH012)
            .input('TH013', sql.NVarChar, salesSlipBody.TH013)
            .input('TH014', sql.NVarChar, salesSlipBody.TH014)
            .input('TH015', sql.NVarChar, salesSlipBody.TH015)
            .input('TH016', sql.NVarChar, salesSlipBody.TH016)
            .input('TH018', sql.NVarChar, salesSlipBody.TH018)
            .input('TH020', sql.NVarChar, salesSlipBody.TH020)
            .input('TH021', sql.NVarChar, salesSlipBody.TH021)
            .input('TH024', sql.NVarChar, salesSlipBody.TH024)
            .input('TH025', sql.NVarChar, salesSlipBody.TH025)
            .input('TH026', sql.NVarChar, salesSlipBody.TH026)
            .input('TH027', sql.NVarChar, salesSlipBody.TH027)
            .input('TH028', sql.NVarChar, salesSlipBody.TH028)
            .input('TH029', sql.NVarChar, salesSlipBody.TH029)
            .input('TH030', sql.NVarChar, salesSlipBody.TH030)
            .input('TH031', sql.NVarChar, salesSlipBody.TH031)
            .input('TH035', sql.NVarChar, salesSlipBody.TH035)
            .input('TH036', sql.NVarChar, salesSlipBody.TH036)
            .input('TH037', sql.NVarChar, salesSlipBody.TH037)
            .input('TH038', sql.NVarChar, salesSlipBody.TH038)
            .input('TH042', sql.NVarChar, salesSlipBody.TH042)
            .input('TH043', sql.NVarChar, salesSlipBody.TH043)
            .input('TH057', sql.NVarChar, salesSlipBody.TH057)
            .input('TH099', sql.NVarChar, salesSlipBody.TH099)
            .input('TH078', sql.NVarChar, salesSlipBody.TH078) // 2024-04-18 增加拆帳廠商於銷貨單中
            .input('TH079', sql.NVarChar, salesSlipBody.TH079) // 2024-04-18 增加拆帳廠商於銷貨單中
            .input('TH080', sql.NVarChar, salesSlipBody.TH080) // 2024-04-18 增加拆帳廠商於銷貨單中
            .execute('insertSalesSlipBody');
            return insertSalesSlipBody.recordset;
        }
        catch (err) {
            await salesSlipBody.transaction.rollback();
            await salesSlipBody.dbConn.close();
            return err;
        }
    }

    async getCaseDoneFromRm100Flag1() {
        try {
            let pool = await sql.connect(ERPConfig);
            let caseDoneData = await pool.request().query(`
            select TOP(1) a.SerialNo,a.CaseNo,a.CaseName,a.CaseRoad,b.DTeam,a.succ,d.通報單類別, a.WCSN,case when a.relClosedate='0' then CloseDate else relClosedate end as relClosedate, 
            case when g.[廠商名稱] is null then a.WCSN else g.[廠商名稱] end as [廠商名稱], 
            case when g.[廠商名稱] is null then 0 else g.[管理費拆帳比例] end as [管理費拆帳比例], 
            case when g.[廠商名稱] is null then 0 else g.[保留款拆帳比例] end as [保留款拆帳比例] 
            from [192.168.8.214].[rm100].[dbo].[tbl_case] a 
            inner join [192.168.8.214].[rm100].[dbo].[tbl_block] b on a.BSN = b.SerialNo and a.RecControl = '1' and b.RecControl = '1' and a.CType2 = '1' and a.succ <> '0'
            inner join [192.168.8.214].[rm100].[dbo].[大表] d on b.DTeam = d.dteam and a.succ = d.通報單名稱
            inner join [192.168.8.214].[rm100].[dbo].[大表金額] f on d.計價月份=f.計價月份 and d.dteam = f.dteam and f.Lock_Check='1'
            left join [APIsync].[dbo].[廠商拆帳比例表] g on a.WCSN = g.廠商名稱
            left join [APIsync].[dbo].${workflowBsyncRecordTable} c on cast(a.SerialNo AS varchar) +'_'+ b.DTeam +'_'+ a.succ = c.serialNo
            where CType1NO <> '0' and CaseNo = recaseno and c.serialNo is null`); // 2024-04-18 增加拆帳廠商於銷貨單中 add select g.[廠商名稱], g.[管理費拆帳比例], g.[保留款拆帳比例] and left join table g
            // if synced will stored in table c, therefore wont be selected again. 
            return caseDoneData.recordset;
        } catch(err) {
            throw new Error(err)
        }
    }

    async getCaseDoneFromRm100Flag3() {
        try {
            let pool = await sql.connect(ERPConfig);
            let caseDoneData = await pool.request().query(`
            select TOP(1) a.SerialNo,a.CaseNo,a.CaseName,a.CaseRoad,b.DTeam,a.succ,d.通報單類別, a.WCSN,a.SCType1NO AS CType1NO,case when a.relClosedate='0' then CloseDate else relClosedate end as relClosedate, 
            case when g.[廠商名稱] is null then a.WCSN2 else g.[廠商名稱] end as [廠商名稱], 
            case when g.[廠商名稱] is null then 0 else g.[管理費拆帳比例] end as [管理費拆帳比例], 
            case when g.[廠商名稱] is null then 0 else g.[保留款拆帳比例] end as [保留款拆帳比例] 
            from [192.168.8.214].[rm100].[dbo].[tbl_case] a 
            inner join [192.168.8.214].[rm100].[dbo].[tbl_block] b on a.BSN = b.SerialNo and a.RecControl = '1' and b.RecControl = '1' and SCType1Flag = '3' and a.succ <> '0'
            inner join [192.168.8.214].[rm100].[dbo].[大表] d on b.DTeam = d.dteam and a.succ = d.通報單名稱
            inner join [192.168.8.214].[rm100].[dbo].[大表金額] f on d.計價月份=f.計價月份 and d.dteam = f.dteam and f.Lock_Check='1'
            left join [APIsync].[dbo].[廠商拆帳比例表] g on a.WCSN2 = g.廠商名稱
            left join [APIsync].[dbo].${workflowBsyncRecordTable} c on cast(a.SerialNo AS varchar) +'_'+ b.DTeam +'_'+ a.succ = c.serialNo
            where SCType1NO <> '0' and CaseNo = recaseno and c.serialNo is null`); // 2024-04-18 增加拆帳廠商於銷貨單中 add select g.[廠商名稱], g.[管理費拆帳比例], g.[保留款拆帳比例] and left join table g
            // if synced will stored in table c, therefore wont be selected again.
            return caseDoneData.recordset;
        } catch(err) {
            throw new Error(err)
        }
    }

    async getCaseDoneFromRm100Type3() {
        try {
            let pool = await sql.connect(ERPConfig);
            let caseDoneData = await pool.request().query(`
            select TOP(1) a.SerialNo,a.CaseNo,a.CaseName,a.CaseRoad,b.DTeam,a.succ,d.通報單類別, a.WCSN,case when a.relClosedate='0' then CloseDate else relClosedate end as relClosedate, 
            case when g.[廠商名稱] is null then a.WCSN else g.[廠商名稱] end as [廠商名稱], 
            case when g.[廠商名稱] is null then 0 else g.[管理費拆帳比例] end as [管理費拆帳比例], 
            case when g.[廠商名稱] is null then 0 else g.[保留款拆帳比例] end as [保留款拆帳比例]
            from [192.168.8.214].[rm100].[dbo].[tbl_case] a 
            inner join [192.168.8.214].[rm100].[dbo].[tbl_block] b on a.BSN = b.SerialNo and a.RecControl = '1' and b.RecControl = '1' and CType4 = '3' and a.succ <> '0'
            inner join [192.168.8.214].[rm100].[dbo].[大表] d on b.DTeam = d.dteam and a.succ = d.通報單名稱
            inner join [192.168.8.214].[rm100].[dbo].[大表金額] f on d.計價月份=f.計價月份 and d.dteam = f.dteam and f.Lock_Check='1'
            left join [APIsync].[dbo].[廠商拆帳比例表] g on a.WCSN = g.廠商名稱
            left join [APIsync].[dbo].${workflowBsyncRecordTable} c on cast(a.SerialNo AS varchar) +'_'+ b.DTeam +'_'+ a.succ = c.serialNo
            where CType4No <> '0' and CaseNo = recaseno and c.serialNo is null`); // 2024-04-18 增加拆帳廠商於銷貨單中 add select g.[廠商名稱], g.[管理費拆帳比例], g.[保留款拆帳比例] and left join table g
            // if synced will stored in table c, therefore wont be selected again.
            return caseDoneData.recordset;
        } catch(err) {
            throw new Error(err)
        }
    }

    async getOldERPsalesSlipBodyInfo(dteamSucc) {
    // get old sales slip body and largest price form ERP
        try {
            let pool = await sql.connect(ERPConfig);
            let TH123FROMERP = await pool.request().query(`
            SELECT [TH001], [TH002],  max([TH003]) AS [TH003], max([TH035]) AS [TH035] FROM ${databaseNameToOperate}.[dbo].[COPTH] 
            where [TH018] = '${dteamSucc}' group by [TH001], [TH002]`);
            return TH123FROMERP.recordset;
        }
        catch(error) {
            throw new Error(error);
        }
    }

    async genERPsalesSlipSerialNo(date, TG001) {
    // gen sales slip serialNo from ERP
        if(date.length === 7) {
        // check input length
            try {
                let pool = await sql.connect(ERPConfig);
                let TG002FROMERP = await pool.request().query(`SELECT TOP(1) [TG002] FROM ${databaseNameToOperate}.[dbo].[COPTG] WHERE [TG002] like '${date}%' and TG001 = '${TG001}' ORDER BY [TG002] DESC`);
                return TG002FROMERP.recordset;
            }
            catch(err) {
                throw new Error(`Error in function genERPsalesSlipSerialNo: Fail to generate sales slip serial number, ${err}`);
            }
        } else {
            throw new Error('Error in function genERPsalesSlipSerialNo: Wrong date provided.');
        }
    }

    async updateERPCOPTGsynced(serialNo, dTeam, errorValue, succ) {
        try {
            let pool = await sql.connect(ERPConfig);
            let caseDoneRecord = await pool.request().query(`UPDATE [APIsync].[dbo].${workflowBsyncRecordTable} set errorControl = '${errorValue}' where serialNo = '${serialNo+'_'+dTeam+'_'+succ}'`);
            return caseDoneRecord.recordset;
        }
        catch(err) {
            return err;
        }
    }
    
    async insertERPCOPTGsynced(serialNo, dTeam, errorValue, succ) {
        try {
            let pool = await sql.connect(ERPConfig);
            let caseDoneRecord = await pool.request().query(`INSERT INTO [APIsync].[dbo].${workflowBsyncRecordTable} (serialNo, errorControl) VALUES ('${serialNo}_${dTeam}_${succ}', '${errorValue}')`);
            return caseDoneRecord.recordset;
        }
        catch(err) {
            return err
        }
    }

    async calculateActualIncome(caseDoneFromRm100) {
        try {
            var data = await this.getActualIncome(caseDoneFromRm100.SerialNo);
        } catch(err) {
            throw new Error(err);
        }
        if(data[0]) {
            return roundToTwo(data.map((item) => item.amount * item.unitPrice).reduce((partialSum, item) => partialSum + item, 0));
        }
        throw new Error(`Price and unitPrice is undefine.`);
    }

    async getActualIncome(caseSerialNo) {
        try {
            let pool = await sql.connect(ERPConfig);
            let actualIncome = await pool.request().query(
            `select a.數量 as amount, c.單價 as unitPrice 
            from [192.168.8.214].[rm100].[dbo].[計價紀錄] a 
            inner join [192.168.8.214].[rm100].[dbo].[估驗詳細表] c 
            on a.DTEAM = c.dteam and a.項次=c.項次
            inner join [192.168.8.214].[rm100].[dbo].[tbl_case] d 
            on a.csn = d.SerialNo 
            where a.reccontrol = '1' and a.備註='實際' and d.RecControl = '1' and d.SerialNo = '${caseSerialNo}'`
            );                                 
            return actualIncome.recordset;
        }
        catch(err) {
            throw new Error(err);
        }
    }

    async updateSalesSlipHead(actualPrice, TG001, TG002, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            let previousPrice = await request.query(`
            UPDATE ${databaseNameToOperate}.[dbo].[COPTG] 
            SET TG033 = TG033 + 1, TG013 = ROUND((TG013 + TG025 + ${actualPrice})/1.05, 0), TG025 = ROUND((TG013 + TG025+${actualPrice})*0.05/1.05, 0), TG045 = ROUND((TG013 + TG025 + ${actualPrice})/1.05, 0), TG046 = ROUND((TG013 + TG025+${actualPrice})*0.05/1.05, 0)
            OUTPUT deleted.TG013, deleted.TG025, deleted.TG003
            where CFIELD01 = '${TG001+TG002}'`);
            return previousPrice.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            throw new Error(err);
        }
    }

    async fixMultiRound(TH001, TH002, TH035, leftIncome, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            let previousPrice = await request.query(`
            UPDATE ${databaseNameToOperate}.[dbo].[COPTH] 
            set TH035 = TH035 - ${leftIncome}, TH036 = TH036 + ${leftIncome},TH037 = TH037 - ${leftIncome}, TH038 = TH038 + ${leftIncome}
            where TH001 = '${TH001}' and TH002 = '${TH002}' and TH035 = '${TH035}'`);                      
            return previousPrice.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            return err;
        }
    }
}

module.exports = { SalesSlip }