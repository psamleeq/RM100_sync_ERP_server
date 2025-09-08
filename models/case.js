const sql = require('mssql');
// const { get } = require('./pool-manager')
const ERPConfig = process.env.MODE === 'PRODUCTION' ? require('../DB_config/ERP_config_production.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/ERP_config_develop.js') : undefined; 
const { databaseNameToOperate, workflowAsyncRecordTable } = process.env.MODE === 'PRODUCTION' ? require('../DB_config/production_config.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/develop_config.js') : undefined; 

class Case {
    async insertCaseFromRm100(caseFromRm100) {
        const  dbConn = new sql.ConnectionPool(ERPConfig);
        let transaction;
        try {
            await dbConn.connect();
            transaction = new sql.Transaction(dbConn);
            await transaction.begin();
            const request = new sql.Request(transaction);
            let insertCaseFromRm100 = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, caseFromRm100.COMPANY)
            .input('CREATOR', sql.NVarChar, caseFromRm100.CREATOR)
            .input('USR_GROUP', sql.NVarChar, caseFromRm100.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, caseFromRm100.CREATE_DATE)
            .input('FLAG', sql.Int, caseFromRm100.FLAG)
            .input('CREATE_TIME', sql.NVarChar, caseFromRm100.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, caseFromRm100.CREATE_AP)
            .input('MB001', sql.NChar, caseFromRm100.MB001)
            .input('MB002', sql.NVarChar, caseFromRm100.MB002)
            .input('MB003', sql.NVarChar, caseFromRm100.MB003)
            .input('MB004', sql.NVarChar, caseFromRm100.MB004)
            .input('MB005', sql.NVarChar, caseFromRm100.MB005)
            .input('MB006', sql.NVarChar, caseFromRm100.MB006)
            .input('MB009', sql.NVarChar, caseFromRm100.MB009)
            .input('MB010', sql.NVarChar, caseFromRm100.MB010)
            .input('MB011', sql.NVarChar, caseFromRm100.MB011)
            .input('MB014', sql.NVarChar, caseFromRm100.MB014)
            .input('MB015', sql.NVarChar, caseFromRm100.MB015)
            .input('MB017', sql.NVarChar, caseFromRm100.MB017)
            .input('MB019', sql.NVarChar, caseFromRm100.MB019)
            .input('MB020', sql.NVarChar, caseFromRm100.MB020)
            .input('MB022', sql.NVarChar, caseFromRm100.MB022)
            .input('MB023', sql.Int, caseFromRm100.MB023)
            .input('MB024', sql.Int, caseFromRm100.MB024)
            .input('MB025', sql.NVarChar, caseFromRm100.MB025)
            .input('MB026', sql.NVarChar, caseFromRm100.MB026)
            .input('MB033', sql.NVarChar, caseFromRm100.MB033)
            .input('MB034', sql.NVarChar, caseFromRm100.MB034)
            .input('MB035', sql.NVarChar, caseFromRm100.MB035)
            .input('MB036', sql.Int, caseFromRm100.MB036)
            .input('MB037', sql.Int, caseFromRm100.MB037)
            .input('MB038', sql.NVarChar, caseFromRm100.MB038)
            .input('MB039', sql.NVarChar, caseFromRm100.MB039)
            .input('MB040', sql.NVarChar, caseFromRm100.MB040)
            .input('MB041', sql.NVarChar, caseFromRm100.MB041)
            .input('MB042', sql.NVarChar, caseFromRm100.MB042)
            .input('MB043', sql.NVarChar, caseFromRm100.MB043)
            .input('MB044', sql.NVarChar, caseFromRm100.MB044)
            .input('MB045', sql.NVarChar, caseFromRm100.MB045)
            .input('MB046', sql.NVarChar, caseFromRm100.MB046)
            .input('MB047', sql.NVarChar, caseFromRm100.MB047)
            .input('MB049', sql.NVarChar, caseFromRm100.MB049)
            .input('MB050', sql.NVarChar, caseFromRm100.MB050)
            .input('MB051', sql.NVarChar, caseFromRm100.MB051)
            .input('MB052', sql.NVarChar, caseFromRm100.MB052)
            .input('MB053', sql.NVarChar, caseFromRm100.MB053)
            .input('MB054', sql.NVarChar, caseFromRm100.MB054)
            .input('MB055', sql.NVarChar, caseFromRm100.MB055)
            .input('MB056', sql.NVarChar, caseFromRm100.MB056)
            .input('MB057', sql.NVarChar, caseFromRm100.MB057)
            .input('MB058', sql.NVarChar, caseFromRm100.MB058)
            .input('MB059', sql.NVarChar, caseFromRm100.MB059)
            .input('MB060', sql.NVarChar, caseFromRm100.MB060)
            .input('MB061', sql.NVarChar, caseFromRm100.MB061)
            .input('MB062', sql.NVarChar, caseFromRm100.MB062)
            .input('MB063', sql.NVarChar, caseFromRm100.MB063)
            .input('MB064', sql.NVarChar, caseFromRm100.MB064)
            .input('MB065', sql.NVarChar, caseFromRm100.MB065)
            .input('MB066', sql.NVarChar, caseFromRm100.MB066)
            .input('MB069', sql.NVarChar, caseFromRm100.MB069)
            .input('MB070', sql.NVarChar, caseFromRm100.MB070)
            .input('MB071', sql.NVarChar, caseFromRm100.MB071)
            .input('MB073', sql.NVarChar, caseFromRm100.MB073)
            .input('MB074', sql.NVarChar, caseFromRm100.MB074)
            .input('MB075', sql.NVarChar, caseFromRm100.MB075)
            .input('MB076', sql.Int, caseFromRm100.MB076)
            .input('MB078', sql.Int, caseFromRm100.MB078)
            .input('MB079', sql.Int, caseFromRm100.MB079)
            .input('MB080', sql.NVarChar, caseFromRm100.MB080)
            .input('MB082', sql.NVarChar, caseFromRm100.MB082)
            .input('MB083', sql.NVarChar, caseFromRm100.MB083)
            .input('MB084', sql.NVarChar, caseFromRm100.MB084)
            .input('MB085', sql.Int, caseFromRm100.MB085)
            .input('MB086', sql.Int, caseFromRm100.MB086)
            .input('MB087', sql.NVarChar, caseFromRm100.MB087)
            .input('MB088', sql.NVarChar, caseFromRm100.MB088)
            .input('MB089', sql.NVarChar, caseFromRm100.MB089)
            .input('MB091', sql.NVarChar, caseFromRm100.MB091)
            .input('MB092', sql.NVarChar, caseFromRm100.MB092)
            .input('MB093', sql.NVarChar, caseFromRm100.MB093)
            .input('MB094', sql.NVarChar, caseFromRm100.MB094)
            .input('MB095', sql.NVarChar, caseFromRm100.MB095)
            .input('MB096', sql.NVarChar, caseFromRm100.MB096)
            .input('MB103', sql.NVarChar, caseFromRm100.MB103)
            .input('MB104', sql.NVarChar, caseFromRm100.MB104)
            .input('MB105', sql.NVarChar, caseFromRm100.MB105)
            .input('MB106', sql.NVarChar, caseFromRm100.MB106)
            .input('MB107', sql.NVarChar, caseFromRm100.MB107)
            .input('MB121', sql.NVarChar, caseFromRm100.MB121)
            .input('MB122', sql.NVarChar, caseFromRm100.MB122)
            .input('MB123', sql.Int, caseFromRm100.MB123)
            .input('MB124', sql.NVarChar, caseFromRm100.MB124)
            .input('MB125', sql.NVarChar, caseFromRm100.MB125)
            .input('MB131', sql.NVarChar, caseFromRm100.MB131)
            .input('MB132', sql.NVarChar, caseFromRm100.MB132)
            .input('MB133', sql.NVarChar, caseFromRm100.MB133)
            .input('MB144', sql.NVarChar, caseFromRm100.MB144)
            .input('MB148', sql.NVarChar, caseFromRm100.MB148)
            .input('MB149', sql.NVarChar, caseFromRm100.MB149)
            .input('MB150', sql.NVarChar, caseFromRm100.MB150)
            .input('MB151', sql.NVarChar, caseFromRm100.MB151)
            .input('MB152', sql.NVarChar, caseFromRm100.MB152)
            .input('MB153', sql.NVarChar, caseFromRm100.MB153)
            .input('MB154', sql.NVarChar, caseFromRm100.MB154)
            .input('MB156', sql.NVarChar, caseFromRm100.MB156)
            .input('MB165', sql.NVarChar, caseFromRm100.MB165)
            .input('MB166', sql.NVarChar, caseFromRm100.MB166)
            .input('MB168', sql.NVarChar, caseFromRm100.MB168)
            .execute('insertCaseFromRm100');
            return { result: insertCaseFromRm100.recordset, transaction, dbConn };
        }
        catch (err) {
            await transaction.rollback();
            await dbConn.close();
            throw new Error(err);
            //savelog(`${err} Where serialNo=${dutyAllocation.serialNo}`);
        }
    }
    
    async getCaseFromRm100Flag1(caseQuantity) {
        try {
            let pool = await sql.connect(ERPConfig);
            let caseData = await pool.request().query(`
            select TOP(${caseQuantity}) a.SerialNo,a.CaseNo,a.CaseName,a.CaseRoad,b.DTeam,a.paperkind,a.CType1NO,a.BType,a.picpath10,a.sctype1sum0,a.acsum0,a.Delmuch0,a.RoadType,a.CType1Date
            from [192.168.8.214].[rm100].[dbo].[tbl_case] a 
            inner join [192.168.8.214].[rm100].[dbo].[tbl_block] b on a.BSN = b.SerialNo and a.RecControl = '1' and b.RecControl = '1' and a.CType1 = '1'
            left join [APIsync].[dbo].${workflowAsyncRecordTable} c on cast(a.SerialNo AS varchar) + a.CType1NO = c.serialNo
            where CType1NO <> '0' and CaseNo = recaseno and c.serialNo is null`);
            // if synced will stored in table c, therefore wont be selected again.
            return caseData.recordset;
        } catch(err) {
            throw new Error(err)
        }
    }

    async getCaseFromRm100Flag2(caseQuantity) {
        try {
            let pool = await sql.connect(ERPConfig);
            let caseData = await pool.request().query(`
            select TOP(${caseQuantity}) a.SerialNo,a.CaseNo,a.CaseName,a.CaseRoad,b.DTeam,a.paperkind,a.SCType1NO as CType1NO,a.BType,a.picpath10,a.sctype1sum0,a.acsum0,a.Delmuch0,a.RoadType, a.CType1Date
            from [192.168.8.214].[rm100].[dbo].[tbl_case] a 
            inner join [192.168.8.214].[rm100].[dbo].[tbl_block] b on a.BSN = b.SerialNo and a.RecControl = '1' and b.RecControl = '1' and SCType1Flag in ('2','3')
            Left join [APIsync].[dbo].${workflowAsyncRecordTable} c on cast(a.SerialNo AS varchar) + a.SCType1NO = c.serialNo
            where SCType1NO <> '0' and CaseNo = recaseno and c.serialNo is null`);
            return caseData.recordset;
        }
        catch(error) {
            return error
        }
    }
    
    async getCaseFromRm100Heat(caseQuantity) {
        try {
            let pool = await sql.connect(ERPConfig);
            let caseData = await pool.request().query(`
            select TOP(${caseQuantity}) a.SerialNo,a.CaseNo,a.CaseName,a.CaseRoad,b.DTeam,a.paperkind,a.CType4No as CType1NO,a.BType,a.picpath10,a.sctype1sum0,a.acsum0,a.Delmuch0,a.RoadType 
            from [192.168.8.214].[rm100].[dbo].[tbl_case] a 
            inner join [192.168.8.214].[rm100].[dbo].[tbl_block] b on a.BSN = b.SerialNo and a.RecControl = '1' and b.RecControl = '1'  and a.CType1 = '1' 
            left join [APIsync].[dbo].${workflowAsyncRecordTable} c on cast(a.SerialNo AS varchar) + a.CType4No = c.serialNo
            where CType4No <> '0' and CaseNo = recaseno and c.serialNo is null`);         
            return caseData.recordset;
        }
        catch(error) {
            return error
        }
    }
    
    async updateERPINVMBsynced(serialNo, CType1NO, errorValue) {
        try {
            let pool = await sql.connect(ERPConfig);
            // let pool = await sql.connect(ERPConfig);
            let caseRecord = await pool.request().query(`UPDATE [APIsync].[dbo].${workflowAsyncRecordTable} set errorControl = '${errorValue}' where serialNo = '${serialNo+CType1NO}'`);
            return caseRecord.recordset;
        }
        catch(err) {
            return err;
        }
    }

    async insertERPINVMBsynced(serialNo, CType1NO, errorValue) {
        try {
            let pool = await sql.connect(ERPConfig);
            // let pool = await sql.connect(ERPConfig);
            let caseRecord = await pool.request().query(`INSERT INTO [APIsync].[dbo].${workflowAsyncRecordTable} (serialNo, errorControl) VALUES ('${serialNo+CType1NO}', '${errorValue}')`);
            return caseRecord.recordset;
        }
        catch(err) {
            return err;
        }
    }
    
    async genERPcaseSerialNo(dteam) {
        try {
            var pool = await sql.connect(ERPConfig);
            let serialNoFromERP = await pool.request().query(`SELECT max([MB001]) AS [MB001] FROM ${databaseNameToOperate}.[dbo].[INVMB] WHERE [MB001] like '${dteam}%'`);
            return serialNoFromERP.recordset;
        } catch(err) {
            await pool.close();
            throw new Error(err);
        }
    }
    
    async updateINVMB003(caseNo, cType1NO) {
        const dbConn = new sql.ConnectionPool(ERPConfig);
        let transaction;
        try {
            await dbConn.connect();
            transaction = new sql.Transaction(dbConn);
            await transaction.begin();
            const request = new sql.Request(transaction);
            let caseData = await request.query(`
            update ${databaseNameToOperate}.[dbo].[INVMB] 
            set MB003 = '${cType1NO}' 
            OUTPUT deleted.MB001
            where MB009 = '${caseNo}'
            `);
            return { result: caseData.recordset, transaction, dbConn };
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close(); 
            throw new Error(err);
        }
    }

    async getINVMB001WithCaseNo(caseNo) {
        try {
            let pool = await sql.connect(ERPConfig);
            let iNVMB001 = await pool.request().query(`SELECT TOP (1) [MB001] FROM ${databaseNameToOperate}.[dbo].[INVMB] WHERE [MB009] = '${caseNo}'`);
            return iNVMB001.recordset;
        } catch(err) {
            throw new Error(err);
        }
    }
}


module.exports = { Case }