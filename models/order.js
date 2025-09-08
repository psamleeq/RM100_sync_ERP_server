// workflow of calculating estimate fee for order
// 1. Get serialNo from a case.
// 2. Find 數量、項次 from 組套名稱序號 where case_serialno = serialNo.
// 3. Find 單價 from 估驗詳細表 where in (項次)
// 4. estimate fee = 數量*單價 where dteam = dteam

const sql = require('mssql');
const ERPConfig = process.env.MODE === 'PRODUCTION' ? require('../DB_config/ERP_config_production.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/ERP_config_develop.js') : undefined; 
const { databaseNameToOperate } = process.env.MODE === 'PRODUCTION' ? require('../DB_config/production_config.js') : process.env.MODE === 'DEVELOP' ? require('../DB_config/develop_config.js') : undefined; 
const incomeUnitPriceMap = require('../map/roadType1_unit_price.js');
const { roundToTwo, round } = require('../utils/round.js');

class Order {
    async getOldERPorderBodyInfo(cType1NO, contractNumber) {
        try {
            let pool = await sql.connect(ERPConfig);
            let TD123FROMERP = await pool.request().query(`SELECT TOP(1) [TD001],[TD002],[TD003] FROM ${databaseNameToOperate}.[dbo].[COPTD] WHERE [TD006] = '${cType1NO}' and [TD027] = '${contractNumber}' ORDER BY [TD003] DESC`);
            return TD123FROMERP.recordset;
        }
        catch(error) {
            throw new Error(error)
        }
    }
    
    async insertOrderHead(orderHead) { // 派工單號
        try {
            const request = new sql.Request(orderHead.transaction);
            let insertOrderHead = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, orderHead.COMPANY)
            .input('CREATOR', sql.NVarChar, orderHead.CREATOR)
            .input('USR_GROUP', sql.NVarChar, orderHead.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, orderHead.CREATE_DATE)
            .input('FLAG', sql.Int, orderHead.FLAG)
            .input('CREATE_TIME', sql.NVarChar, orderHead.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, orderHead.CREATE_AP)
            //.input('CREATE_PRID', sql.NVarChar, orderHead.CREATE_PRID)
            .input('TC001', sql.NChar, orderHead.TC001)
            .input('TC002', sql.NChar, orderHead.TC002)
            .input('TC003', sql.NVarChar, orderHead.TC003)
            .input('TC004', sql.NVarChar, orderHead.TC004)
            .input('TC005', sql.NVarChar, orderHead.TC005)
            .input('TC007', sql.NVarChar, orderHead.TC007)
            .input('TC008', sql.NVarChar, orderHead.TC008)
            .input('TC009', sql.NVarChar, orderHead.TC009)
            .input('TC014', sql.NVarChar, orderHead.TC014)
            .input('TC015', sql.NVarChar, orderHead.TC015)
            .input('TC016', sql.NVarChar, orderHead.TC016)
            .input('TC019', sql.NVarChar, orderHead.TC019)
            .input('TC026', sql.NVarChar, orderHead.TC026)
            .input('TC027', sql.NVarChar, orderHead.TC027)
            .input('TC028', sql.Int, orderHead.TC028)
            .input('TC029', sql.NVarChar, orderHead.TC029)
            .input('TC030', sql.NVarChar, orderHead.TC030)
            .input('TC031', sql.NVarChar, orderHead.TC031)
            .input('TC032', sql.NVarChar, orderHead.TC032)
            .input('TC039', sql.NVarChar, orderHead.TC039)
            .input('TC040', sql.NVarChar, orderHead.TC040)
            .input('TC041', sql.NVarChar, orderHead.TC041)
            .input('TC042', sql.NVarChar, orderHead.TC042)
            .input('TC043', sql.NVarChar, orderHead.TC043)
            .input('TC046', sql.NVarChar, orderHead.TC046)
            .input('TC049', sql.NVarChar, orderHead.TC049)
            .input('TC050', sql.NVarChar, orderHead.TC050)
            .input('TC051', sql.NVarChar, orderHead.TC051)
            .input('TC052', sql.NVarChar, orderHead.TC052)
            .input('TC055', sql.NVarChar, orderHead.TC055)
            .input('TC056', sql.NVarChar, orderHead.TC056)
            .input('TC057', sql.Int, orderHead.TC057)
            .input('TC058', sql.NVarChar, orderHead.TC058)
            .input('TC059', sql.NVarChar, orderHead.TC059)
            .input('TC064', sql.NVarChar, orderHead.TC064)
            .input('TC066', sql.NVarChar, orderHead.TC066)
            .input('TC067', sql.NVarChar, orderHead.TC067)
            .input('TC074', sql.NVarChar, orderHead.TC074)
            .input('TC075', sql.NVarChar, orderHead.TC075)
            .input('TC091', sql.NVarChar, orderHead.TC091)
            .input('TC092', sql.NVarChar, orderHead.TC092)
            .execute('insertOrderHead');
            return insertOrderHead.recordset;
        }
        catch (err) {
            await orderHead.transaction.rollback();
            await orderHead.dbConn.close();
            return err;
        }
    }

    async insertOrderBody(orderBody) {
        try {
            const request = new sql.Request(orderBody.transaction);
            let insertOrderBody = await request
            // use NVarChar instead of numeric
            .input('COMPANY', sql.NVarChar, orderBody.COMPANY)
            .input('CREATOR', sql.NVarChar, orderBody.CREATOR)
            .input('USR_GROUP', sql.NVarChar, orderBody.USR_GROUP)
            .input('CREATE_DATE', sql.NVarChar, orderBody.CREATE_DATE)
            .input('FLAG', sql.Int, orderBody.FLAG)
            .input('CREATE_TIME', sql.NVarChar, orderBody.CREATE_TIME)
            .input('CREATE_AP', sql.NVarChar, orderBody.CREATE_AP)
            //.input('CREATE_PRID', sql.NVarChar, orderBody.CREATE_PRID)
            .input('TD001', sql.NChar, orderBody.TD001)
            .input('TD002', sql.NChar, orderBody.TD002)
            .input('TD003', sql.NChar, orderBody.TD003)
            .input('TD004', sql.NVarChar, orderBody.TD004)
            .input('TD005', sql.NVarChar, orderBody.TD005)
            .input('TD006', sql.NVarChar, orderBody.TD006)
            .input('TD007', sql.NVarChar, orderBody.TD007)
            .input('TD008', sql.NVarChar, orderBody.TD008)
            .input('TD009', sql.NVarChar, orderBody.TD009)
            .input('TD010', sql.NVarChar, orderBody.TD010)
            .input('TD011', sql.NVarChar, orderBody.TD011)
            .input('TD012', sql.NVarChar, orderBody.TD012)
            .input('TD013', sql.NVarChar, orderBody.TD013)
            .input('TD016', sql.NVarChar, orderBody.TD016)
            .input('TD020', sql.NVarChar, orderBody.TD020)
            .input('TD021', sql.NVarChar, orderBody.TD021)
            .input('TD022', sql.NVarChar, orderBody.TD022)
            .input('TD024', sql.NVarChar, orderBody.TD024)
            .input('TD025', sql.NVarChar, orderBody.TD025)
            .input('TD026', sql.NVarChar, orderBody.TD026)
            .input('TD027', sql.NVarChar, orderBody.TD027)
            .input('TD030', sql.NVarChar, orderBody.TD030)
            .input('TD031', sql.NVarChar, orderBody.TD031)
            .input('TD032', sql.NVarChar, orderBody.TD032)
            .input('TD033', sql.NVarChar, orderBody.TD033)
            .input('TD034', sql.NVarChar, orderBody.TD034)
            .input('TD035', sql.NVarChar, orderBody.TD035)
            .input('TD036', sql.NVarChar, orderBody.TD036)
            .input('TD099', sql.NVarChar, orderBody.TD099)
            .input('TD040', sql.NVarChar, orderBody.TD040)
            // .input('CFIELD01', sql.NVarChar, orderBody.CFIELD01)  database default
            .execute('insertOrderBody');
            return insertOrderBody.recordset;
        }
        catch (err) {
            await orderBody.transaction.rollback();
            await orderBody.dbConn.close();
            return err
        }
    }
    
    async genERPorderSerialNo(date, TD001) {
        if(date.length === 7) {
        // check input length
            try {
                let pool = await sql.connect(ERPConfig);
                let TC002FROMERP = await pool.request().query(`SELECT TOP(1) RIGHT(CFIELD01, 11) AS TC002 FROM ${databaseNameToOperate}.[dbo].[COPTC] WHERE CFIELD01 like '${''+TD001+date}%' ORDER BY CFIELD01 DESC`);
                return TC002FROMERP.recordset;
            }
            catch(error) {
                throw Error(`Error in function genERPorderSerialNo: Fail to generate order serial number, ${error}`)
            }
        } else {
            throw new Error('Error in function genERPorderSerialNo: Wrong date provided.')
        }
    }

    async updateOrderBodyToDone(caseNo) {
        const dbConn = new sql.ConnectionPool(ERPConfig);
        let transaction;
        try {
            await dbConn.connect();
            transaction = new sql.Transaction(dbConn);
            await transaction.begin();
            const request = new sql.Request(transaction);
            let data = await request.query(`UPDATE ${databaseNameToOperate}.[dbo].[COPTD] SET TD009 = '1.000', TD016 = 'Y' 
                                            OUTPUT inserted.TD001, inserted.TD002, inserted.TD003, inserted.TD004, inserted.TD006 where TD020 = '${caseNo}'`);
            return { result: data.recordset, transaction, dbConn };
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            throw new Error(err);
        }
    }

    async updateOrderHead(orderPrice, TC001, TC002, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            orderPrice = round(orderPrice);
            let data = await request.query(`
            UPDATE ${databaseNameToOperate}.[dbo].[COPTC] 
            SET TC031 = TC031 + 1, TC029 = ROUND((TC015 + ${orderPrice})/1.05, 0), TC030 = ROUND((TC015+${orderPrice})*0.05/1.05, 0), TC015 = TC015 + ${orderPrice}
            where CFIELD01 = '${TC001+TC002}'
            `);
            return data.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            return err;
        }
    }

    async getEstimateIncome(caseSerialNo) {
        try {
            let pool = await sql.connect(ERPConfig);
            let estimateIncome = await pool.request().query(`
            select b.數量 as amount, c.單價 as unitPrice from [192.168.8.214].[rm100].[dbo].tbl_case a 
            inner join [192.168.8.214].[rm100].[dbo].計價組套設計 b on a.SerialNo = b.case_serialno and b.reccontrol = '1'
            inner join [192.168.8.214].[rm100].[dbo].估驗詳細表 c on c.項次 = b.項次 and c.dteam = b.dteam
            where a.SerialNo = '${caseSerialNo}'
            `);
            return estimateIncome.recordset;
        }
        catch(err) {
            throw new Error(err);
        }
    }

    async calculateEstimateIncome(caseFromRm100) { 
        if(caseFromRm100.CType1NO.slice(0,1) == 'Y' && caseFromRm100.sctype1sum0 > 0) {
            caseFromRm100.orderEstimateIncome = 0;
            caseFromRm100.orderEstimateIncome += caseFromRm100.sctype1sum0 * incomeUnitPriceMap[caseFromRm100.dTeam][5];
            return roundToTwo(caseFromRm100.orderEstimateIncome);
        }
        if(caseFromRm100.paperkind == '3') {
            if(caseFromRm100.sctype1sum0 > 0) {
                caseFromRm100.orderEstimateIncome = 0;
                caseFromRm100.orderEstimateIncome += caseFromRm100.sctype1sum0 * incomeUnitPriceMap[caseFromRm100.dTeam][5];
                return roundToTwo(caseFromRm100.orderEstimateIncome);
            }
        }
        if(caseFromRm100.RoadType == '1') {
            caseFromRm100.orderEstimateIncome = 0;
            if(caseFromRm100.sctype1sum0 > 0) {
                caseFromRm100.orderEstimateIncome += caseFromRm100.sctype1sum0 * incomeUnitPriceMap[caseFromRm100.dTeam][5];
            } else if(caseFromRm100.Delmuch0 == '5') {
                caseFromRm100.orderEstimateIncome += caseFromRm100.acsum0 * incomeUnitPriceMap[caseFromRm100.dTeam][1];
                caseFromRm100.orderEstimateIncome += caseFromRm100.acsum0 * 0.05 * incomeUnitPriceMap[caseFromRm100.dTeam][3];
                caseFromRm100.orderEstimateIncome += caseFromRm100.acsum0 * incomeUnitPriceMap[caseFromRm100.dTeam][4];
                if(caseFromRm100.BType == '15') {
                    caseFromRm100.orderEstimateIncome += 1 * incomeUnitPriceMap[caseFromRm100.dTeam][0];
                }
            } else if(caseFromRm100.Delmuch0 == '10') {
                caseFromRm100.orderEstimateIncome += caseFromRm100.acsum0 * incomeUnitPriceMap[caseFromRm100.dTeam][2];
                caseFromRm100.orderEstimateIncome += caseFromRm100.acsum0 * 0.1 * incomeUnitPriceMap[caseFromRm100.dTeam][3];
                if(caseFromRm100.BType == '15') {
                    caseFromRm100.orderEstimateIncome += 1 * incomeUnitPriceMap[caseFromRm100.dTeam][0];
                }
                if(caseFromRm100.picpath10) {
                    caseFromRm100.orderEstimateIncome += caseFromRm100.acsum0 * 2 * incomeUnitPriceMap[caseFromRm100.dTeam][4];
                } else {
                    caseFromRm100.orderEstimateIncome += caseFromRm100.acsum0 * incomeUnitPriceMap[caseFromRm100.dTeam][4];
                }
            } else if(caseFromRm100.Delmuch0 == '4') {
                caseFromRm100.orderEstimateIncome += caseFromRm100.acsum0 * incomeUnitPriceMap[caseFromRm100.dTeam][6];
            }
            return roundToTwo(caseFromRm100.orderEstimateIncome);
        } 
        if(caseFromRm100.RoadType <= 3) {
            try {
                var data = await this.getEstimateIncome(caseFromRm100.SerialNo);
                // a.2.2.2 Get estimate income from rm100: where paperkind != 1
            } catch(err) {
                throw new Error(err);
            }
            if(!data[0]) {
                throw new Error(`Price and unitPrice is undefine.`);
            }
            return roundToTwo(data.map((item) => item.amount * item.unitPrice).reduce((partialSum, item) => partialSum + item, 0));
        } 
        throw new Error(`Can't resolve RoadType in caseSerialNo=${caseFromRm100.SerialNo}`);
    }

    async deleteOrderbody(iNVMB001, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            let orderHeadInfo = await request.query(`
            delete from ${databaseNameToOperate}.[dbo].[COPTD] 
            OUTPUT deleted.TD001, deleted.TD002
            where TD004 = '${iNVMB001}'
            `);
            return orderHeadInfo.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            throw new Error(err);
        }
    }

    async removeOrderHeadPrice(orderPrice, cOPTC001, cOPTC002, transaction, dbConn) {
        try {
            const request = new sql.Request(transaction);
            orderPrice = round(orderPrice);
            let data = await request.query(`
            UPDATE ${databaseNameToOperate}.[dbo].[COPTC] 
            SET TC031 = TC031 - 1, TC029 = ROUND((TC015 - ${orderPrice})/1.05, 0), TC030 = ROUND((TC015 - ${orderPrice})*0.05/1.05, 0), TC015 = TC015 - ${orderPrice}
            where CFIELD01 = '${cOPTC001+cOPTC002}'
            `);
            return data.recordset;
        }
        catch(err) {
            await transaction.rollback();
            await dbConn.close();
            return err;
        }
    }
}

module.exports = { Order }