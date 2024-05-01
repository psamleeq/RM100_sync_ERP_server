////////////////////////////////////////
// README: 
// 此伺服器用於搬運rm100路段至ERP品號、訂單、銷貨單並過帳。
// 啟動伺服器：npm test/ npm start。
////////////////////////////////////////
// 目的: 
// 1. 將rm100路段加入ERP品號與訂單 ERP(INVMB, COPTC, COPTD, COPMB).
// 2. 將rm100回報單加入ERP銷貨單、並過帳 ERP(COPTG, COPTH...).
// 3. 結帳單。未完成
// 4. 將加項費依據 dTeam_succ是否相同加入同一張銷貨單、並過帳。
// 5. 抽單。
////////////////////////////////////////
// Workflow of purpose 1:
// a.1  建立INVMB，並記錄該案件於ERPINVMBsynced。
// a.2  建立COPTD。
// a.3  建立/更新COPTC。
//  a.3-1 若COPTC存在，更新COPTC。
//  a.3-2 若無COPTC，建立COPTC。
// a.4  建立 COPMB. 
//
// Workflow of purpose 2:
// b.1  更新訂單確認碼。
// b.2  建立銷貨單單身。
// b.3  建立或更新銷過單單頭。
//  b.3-1  若存在相同dTeam_succ的銷貨單單頭檔，更新銷貨單單頭總金額。
//  b.3-2  若不存在相同dTeam_succ的銷貨單單頭檔，建立新的銷貨單單頭檔。
// b.4  更新 COPMB.
// b.5  建立 INVLD.
// b.6  若無相同dTeam_succ存在，建立AJSLA。
// b.7  建立或更新AJSTA。
//  b.7-1 若相同dTeam_succ存在，更新AJSTA。
//  b.7-2 若無相同dTeam_succ存在，建立AJSTA。
// b.8  建立或更新AJSTB。
//  b.8-1 若相同dTeam_succ存在，更新AJSTB。
//  b.8-2 若無相同dTeam_succ存在，建立AJSTB。
// b.9  建立或更新ACTTA。
//  b.9-1 若相同dTeam_succ存在，更新ACTTA。
//  b.9-2 若無相同dTeam_succ存在，建立ACTTA。
// b.10 建立或更新ACTTB。
//  b.10-1 若相同dTeam_succ存在，更新ACTTB。
//  b.10-1 若無相同dTeam_succ存在，建立ACTTB。
// b.11 建立或更新ACTML。
//  b.11-1 若相同dTeam_succ存在，更新ACTML。
//  b.11-2 若無相同dTeam_succ存在，建立ACTML。
// b.12 建立或更新ACTMN。
//  b.12-1 若相同dTeam_succ存在，更新ACTMN。
//  b.12-2 若無相同dTeam_succ存在，建立ACTMN。
// b.13 建立或更新ACTMM。
//  b.13-1 若相同dTeam_succ存在，更新ACTMM。
//  b.13-2 若無相同dTeam_succ存在，且銷貨單日期之年、月、客戶無對應ACTMM，建立ACTMM。
//  b.13-3 若無相同dTeam_succ存在，但已存在相同年、月、客戶的ACTMM，更新ACTMM。
// b.14 建立或更新ACTMB。
//  b.14-1 若相同dTeam_succ存在，更新ACTMB。
//  b.14-2 若無相同dTeam_succ存在，且銷貨單日期之年、月、會計科目4111無對應ACTMB，建立ACTMB。
//  b.14-2 若無相同dTeam_succ存在，但已存在相同年、月、會計科目(4111)，更新ACTMB.
// b.15 建立或更新ACTMD。
//  b.15-1 若相同dTeam_succ存在，更新ACTMD。
//  b.15-2 若無相同dTeam_succ存在，建立ACTMD。
//
// Workflow of purpose 3:
// c.1 Insert 結帳單 
// 未開發。
// Workflow of purpose 4:
// d.1  建立 COPTH。
// d.2  更新 COPTG.
// d.3  建立 COPMB.
// d.4  建立 INVLD.
// 
// workflow of purpose 5:
// 透過API更新INVMB、COPTD、COPTC。
////////////////////////////////////////
// Modification History: 
// #000 2023-12-30 Stanley      File create.
// #001 2024-04-18 Stanley      過帳功能停用。增加拆帳廠商於銷貨單中，但未測試。
// #002 2024-04-22 Stanley      由於停用過帳功能將transaction commit 移至這，若需啟用過帳，刪除所有2024-04-22。
////////////////////////////////////////

// extract env variable.
const mode = process.env.MODE;
// determine which database to connect with environment variable.
const syncInterval = Number(process.env.SYNC_INTERVAL) || 5000;
// main set time out value.
const timeMachine = process.env.TIMEMACHINE;
if(timeMachine) {
    if(timeMachine.length !== 2) {
        throw 'Wrong date provided';
    }
    if(Number(timeMachine) > 31) {
        throw 'Wrong date provided';
    }
}

if(!mode) {
    throw new Error("Please provide environment variable in command. Run node --env-file=.env . or MODE='PRODUCTION' node .");
}
if(!(mode === 'PRODUCTION' || mode === 'DEVELOP')) {
    throw new Error('Wrong mode provided, change .env file then try again.');
}
function developLog(message) {
    // only available in develop mode. 
    console.log(message);
}

console.log('注意：三個Sync table都要有至少一行資料(sql table)，建議用{0: 0}');

if(mode === 'PRODUCTION') {
    developLog = function() {
        // disable any develop log.
    }
    console.log(`Server running in ${mode} mode, remember to copy all stored procedures in database [TEST] into [SDG].`);
}
if(mode === 'DEVELOP') {
    developLog(`Server running in ${mode} mode`);
}

const express = require('express');
const sql = require('mssql');
const app = express();
// const bodyParser = require('body-parser'); // module for handling large post request
// import node module

const { Case } = require('./models/case.js');
const { Order } = require('./models/order.js');
const { SalesSlip } = require('./models/sales_slip.js');
const { INVLD } = require('./models/INVLD.js');
const { COPMB } = require('./models/COPMB.js');
const { PBCsource } = require('./models/PBC_source.js');
const { AccountEntry } = require('./models/account_entry.js');
const { MiscellaneousCost } = require('./models/miscellaneous_cost.js');
const { PBC } = require('./models/PBC.js');
const { CategoricallyAccounting } = require('./models/categorically_accounting.js');
const { Detail } = require('./models/detail.js');
const { MonthlyDetail } = require('./models/monthly_detail.js');
const { MonthlyAccounting } = require('./models/monthly_accounting.js');
const { MonthlyDepartmentAccounting } = require('./models/monthly_department_accounting.js');
// import classes

const ERPConfig = process.env.MODE === 'PRODUCTION' ? require('./DB_config/ERP_config_production.js') : process.env.MODE === 'DEVELOP' ? require('./DB_config/ERP_config_develop.js') : undefined; 
const dTeamConvertMap = require('./map/dTeam_to_contract_number.js');
const departmentConvertMap = require('./map/contract_number_to_department.js');
const clientConvertMap = require('./map/contract_number_to_client_name.js');
const salesSlipTypeConvertMap = require('./map/sales_slip_to_TG001.js');
const dteamShortClientNameConvertMap = require('./map/dTeam_to_short_client_name.js');
const { CaseMap, COPTC, FirstCOPTD, NoninitialCOPTD, COPTG, FirstCOPTH, NoninitialCOPTH, SalesSlipToINVLD, OrderBodyToCOPMB, miscellaneousCostToCOPTH, 
    MiscellaneousCostToCOPMB, MiscellaneousCostToINVLD, salesSlipHeadToACTTA, salesSlipHeadToACTTBincome, salesSlipHeadToACTTBexpenditure, salesSlipHeadToAJSLA, 
    salesSlipHeadToAJSTA, salesSlipHeadToAJSTBincome, salesSlipHeadToAJSTBexpenditure, salesSlipHeadToACTMLincome, salesSlipHeadToACTMLexpenditure, salesSlipHeadToACTMN, 
    salesSlipHeadToACTMB1199, salesSlipHeadToACTMB4111, salesSlipHeadToACTMM, salesSlipHeadACTMD } = require('./models/modules.js');
// import mapping object & database modules

const { errorHandler, sendErrorMessageToLine } = require('./utils/error_handler.js');
const savelog = require('./utils/save_log.js');
const toLinelog = require('./utils/log_to_line.js');
const cType1NOTD001Map = require('./map/CTypeNO_to_TD001.js');
const itemNameIdConvertMap = require('./map/itemName_to_itemId.js');
const CurrentTime = require('./utils/current_time.js');
const { roundToTwo, round} = require('./utils/round.js');
// import function

const order = new Order();
const cases = new Case();
const salesSlip = new SalesSlip();
const projectManage = new INVLD();
const clientCasePriceHead = new COPMB();
const currentTime = new CurrentTime();
const cost = new MiscellaneousCost();
const pBCsource = new PBCsource();
const accountEntry = new AccountEntry();
const pBC = new PBC();
const categoricallyAccounting = new CategoricallyAccounting();
const detail = new Detail();
const monthlyDetail = new MonthlyDetail();
const monthlyAccounting = new MonthlyAccounting();
const monthlyDepartmentAccounting = new MonthlyDepartmentAccounting();
// declare object from classes

Object.defineProperty(global, '__stack', {
    get: function() {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});
Object.defineProperty(global, '__line', {
    get: function() {
        return __stack[1].getLineNumber();
    }
});
// declare global var __line to access function line number

// app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); // parse json, explicity setting limit to handle large post request
// app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static('public'));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({limit: '50mb'}));
// set express middleware

app.listen(1026, () => {
    // Listen to port:1026
    console.log('server listening to port 1026');
});

const currentDate = timeMachine || currentTime.getDateTwoDegits();
// const for manually assign create date.

async function insertCaseToINVMB(getCaseFromWhere, dataFromPrevoius) { // a.1
    if(getCaseFromWhere == undefined || dataFromPrevoius == undefined) {
        // a.1.1 Check input function.
        throw new Error(`Error in line ${__line}: Input function or dataFromPrevoius is undefine, server down, try again`);
        // If no input undefined throw error, stop server.
    }
    try {
        // a.1.2 check DB connection.
        var casesFromRm100 = await getCaseFromWhere;
    } catch(err) {
        return await errorHandler({message: 'Fail to get case from rm100.', __line, err, dataFromPrevoius, ifContinueSync: true});
    }
    if(!casesFromRm100[0]) {
        // a.1.3 check if case from rm100.
        if(dataFromPrevoius.start === 'a.1-3') {
            // if no case to sync from Rm100, start syncing sales slip body.
            dataFromPrevoius.next = 'b.1-1';
            dataFromPrevoius.start = 'b.1-1';
            developLog('Function insertCaseToINVMB: No new case to sync, start syncing sales slip body.');
            return dataFromPrevoius;
        }
        dataFromPrevoius.next = 'a.1-' + (Number(dataFromPrevoius.next.split('-')[1])+1);
        dataFromPrevoius.start = 'a.1-' + (Number(dataFromPrevoius.start.split('-')[1])+1);
        return dataFromPrevoius;
    }
    var caseFromRm100 = casesFromRm100[0];
    if (!(dTeamConvertMap[caseFromRm100.DTeam].length === 9 && caseFromRm100.CType1NO.length <= 11 && caseFromRm100.CType1NO.length >= 8 && caseFromRm100.SerialNo && 
    caseFromRm100.CaseNo.length <=14 && caseFromRm100.CaseNo.length >= 11 && caseFromRm100.paperkind && caseFromRm100.CaseName && caseFromRm100.CaseRoad && caseFromRm100.RoadType)) {
        // a.1.4 Check all case key and value.
        return await errorHandler({ message: 'Wrong case data from RM100, stop syncing cases', __line, err: `caseFromRm100 that cause error=${JSON.stringify(caseFromRm100)}` })
    }
    caseFromRm100.dTeam = caseFromRm100.DTeam;
    caseFromRm100.next = dataFromPrevoius.start;
    caseFromRm100.start = dataFromPrevoius.start;
    caseFromRm100.try = dataFromPrevoius.try;
    if(caseFromRm100.CaseName.includes('缺失') || caseFromRm100.CaseName.includes('保固') || caseFromRm100.CaseNo.includes('免')) {
        const errFromPrevent = await cases.insertERPINVMBsynced(caseFromRm100.SerialNo, caseFromRm100.CType1NO, '1');
        // a.1.5 If case name with 缺失 or 保固 or caseNo with 免, prevent case gets into ERP database. 
        if(errFromPrevent) {
            // if error in inserting ERPINVMBsynced
            return await errorHandler({ message: 'Fail to insert case to INVMB synced table', __line, err: errFromSync, dataFromPrevoius, ifContinueSync: true });
        }
        developLog(`ERPINVMBsynced inserted at SerialNo=${caseFromRm100.SerialNo + caseFromRm100.CType1NO}, and set errorValue = '1', since case name include 缺失 or 保固 or caseNo include '免'`);
        return { 'next': caseFromRm100.start, 'start': caseFromRm100.start, 'try': caseFromRm100.try };
    }
    const errFromSync = await cases.insertERPINVMBsynced(caseFromRm100.SerialNo, caseFromRm100.CType1NO, '0');
    // a.1.5 Insert synced case into ERPINVMBsynced first(to check if any duplication)
    if(errFromSync) {
        // if error in inserting ERPINVMBsynced
        return await errorHandler({ message: 'Fail to insert case to INVMB synced table', __line, err: errFromSync, dataFromPrevoius, ifContinueSync: true });
    }
    developLog(`ERPINVMBsynced inserted at SerialNo=${caseFromRm100.SerialNo + caseFromRm100.CType1NO}`);
    try {
        // a.1.6 convert caseFromRm100.DTeam to contract number
        // a.1.7 get lastest serial number with contract number from ERP(INVMB)
        var number = await cases.genERPcaseSerialNo(dTeamConvertMap[caseFromRm100.DTeam]);
    } catch(err) {
        // if fail to get lastest serialNo.
        return await errorHandler({ message: 'Fail to get ERP lastest serialNo', __line, err, ifContinueSync: true, caseFromRm100, errorValue: 'a.1.7' });
    }
    if(null === number[0].MB001) {
        // a.1.7.1 if no lastest serial number, set serialNo = 0001
        caseFromRm100.DTeam = dTeamConvertMap[caseFromRm100.DTeam] + '0001';
    } else {
        // if number from ERP defined, serial number += 1
        caseFromRm100.DTeam = (Number(number[0]['MB001'])+1).toString();
    }
    if(caseFromRm100.DTeam.length !== 13) {
        // check return value
        return await errorHandler({ caseFromRm100, errorValue: 'a.1.7', message: 'Fail to convert Dteam+1 to string', __line, ifContinueSync: true });
    }
    // a.1.8 Generate create date and create time for case from rm100.
    caseFromRm100.CREATE_DATE = currentTime.genCREATE_DATE(currentDate); // date: 20231211
    caseFromRm100.CREATE_TIME = currentTime.genCREATE_TIME(); // time: 09:00:26 (hr, mins, sec)
    try {
        var { transaction, dbConn } = await cases.insertCaseFromRm100(new CaseMap(caseFromRm100));
        // a.1.9 Store case into INVMB.
        // Start of transaction.
    } catch(err) {
        return await errorHandler({ caseFromRm100, errorValue: 'a.1.9', message: 'Fail to insert case to ERP', __line, err, ifContinueSync: true });
    }
    developLog(`Insert success in INVMB001=${caseFromRm100.DTeam}`);
    caseFromRm100.transaction = transaction;
    caseFromRm100.dbConn = dbConn;
    caseFromRm100.next = 'a.2';
    // a.2 Insert COPTD.
    return caseFromRm100;
}

async function insertOrderBody(caseFromRm100) { //a.2
    try {
        // a.2.1 Get order with same CType1NO and get estimate income from rm100.
        var oldCaseInfo = await order.getOldERPorderBodyInfo(caseFromRm100.CType1NO, caseFromRm100.DTeam.slice(0, 9));
    } catch(err) {
        // if err stop current loop, delete cases in ERP INVMB?
        return await errorHandler({ caseFromRm100, errorValue: 'a.2.1', message: 'Fail to get old case from Rm100', __line, err, ifContinueSync: true });
    }
    try {
        caseFromRm100.orderEstimateIncome = await order.calculateEstimateIncome(caseFromRm100);
        // a.2.2 Calculate estimate income for order.
    } catch(err) {
        return await errorHandler({ message: `Fail to calculate estimate income`, __line, ifContinueSync: true, errorValue : 'a.2.2', caseFromRm100, err });
    }
    if(oldCaseInfo[0]) {
    // a.2.3 Check if old order body whith same ctypeNo exist.
        if(oldCaseInfo[0]['TD003'] == '9999') {
            return await errorHandler({ caseFromRm100, errorValue: 'a.2.3', message: 'TD003 out of range, stop syncing.', __line });
        }
        caseFromRm100.TD003 = ('000' + (Number(oldCaseInfo[0]['TD003']) + 1)).slice(-4);
        caseFromRm100.TD002 = oldCaseInfo[0]['TD002'];
        caseFromRm100.TD001 = oldCaseInfo[0]['TD001'];
        if(!caseFromRm100.TD003) {
            return await errorHandler({ caseFromRm100, errorValue: 'a.2.3', message: 'TH003 is undefinem stop syncing', __line, err: errFromCOPTD });
        }
        const errFromCOPTD = await order.insertOrderBody(new NoninitialCOPTD(caseFromRm100));
        // a.2.4 store order body in to ERP(order head exists)
        if(errFromCOPTD) {
            return await errorHandler({ caseFromRm100, errorValue: 'a.2.4', message: 'Fail to insert order body to ERP', __line, err: errFromCOPTD, ifContinueSync: true });
        }
        developLog(`Insert success in COPTD004=${caseFromRm100.DTeam}`);
        caseFromRm100.next = 'a.3-1';
        // a.3-1 Update price and amount in corresponding COPTC.
        return caseFromRm100;
    }
    // a.2.3 if order head with same CType1NO doesn't exist:  
    try {
        // a.2.3.1 generate TD001 from CType1No
        caseFromRm100.TD001 = cType1NOTD001Map(caseFromRm100.CType1NO);
    } catch(err) {
        // if err in mapping 
        return await errorHandler({ caseFromRm100, errorValue: 'a.2.3.1', message: 'Fail to convert CType1NO into TD001', __line, err, ifContinueSync: true })
    }
    const dateCreate = (currentTime.getFullYear()-1911).toString() + currentTime.getMonthTwoDegits() + currentDate;
    try {
        var number = await order.genERPorderSerialNo(dateCreate, caseFromRm100.TD001);
        // a.2.3.2 generate new serialNo from ERP
    } catch(err) {
        // if fail to get lastest serialNo, stop syncing.
        return await errorHandler({ caseFromRm100, errorValue: 'a.2.3.2', message: 'Fail to get ERP lastest serialNo, stop syncing cases', __line, err });
    }
    if(undefined == number[0]) {
        caseFromRm100.TD002 = dateCreate + '001';
        // if no lastest serial number to get, set serialNo = 001.
    } else {
        if(number[0]['TC002'].trim().slice(-3) == '999') {
            await errorHandler({ caseFromRm100, errorValue: 'a.2.3.2', message: 'TC002 out of range, use TIMEMACHINE.', __line });
            return { 'next':'0', 'start':'d.0', 'try': 0 };
        }
        caseFromRm100.TD002 = (Number(number[0]['TC002'])+1).toString();
        // if number from ERP defined, number + 1 = new serial number for new case.
    }
    if(caseFromRm100.TD002.length !== 10) {
        return await errorHandler({ caseFromRm100, errorValue: 'a.2.3.2', message: 'Fail to convert TD002+1 to string', __line, ifContinueSync: true });
    }
    const errFromCOPTD = await order.insertOrderBody(new FirstCOPTD(caseFromRm100));
    // a.2.4 store order body in to ERP(first order body).
    if(errFromCOPTD) {
        return await errorHandler({ caseFromRm100, errorValue: 'a.2.4', message: 'Fail to insert orderBody to ERP', __line, err: errFromCOPTD, ifContinueSync: true });
    }
    developLog(`Insert success in COPTD004=${caseFromRm100.DTeam}`);
    caseFromRm100.next = 'a.3-2';
    // a.3-2 Store COPTC
    return caseFromRm100;
}

async function updateOrderHead(caseFromRm100) { // a.3-1
    const errFromCOPTC = await order.updateOrderHead(caseFromRm100.orderEstimateIncome, caseFromRm100.TD001, caseFromRm100.TD002, caseFromRm100.transaction, 
    caseFromRm100.dbConn);
    // a.3-1.1 Update price and amount in corresponding COPTC.
    if(errFromCOPTC) {
        return await errorHandler({ caseFromRm100, errorValue: 'a.3-1.1', message: 'Fail to update price and amount in corresponding order head to ERP', __line, 
        err: errFromCOPTC, ifContinueSync: true })
    }
    developLog(`Update success in price and amount at COPTC.CFIELD01=${caseFromRm100.TD001+caseFromRm100.TD002}`);
    caseFromRm100.next = 'a.4';
    // a.4 Store COPMB
    return caseFromRm100;
}

async function insertOrderHead(caseFromRm100) { //a.3-2
    caseFromRm100.clientName = clientConvertMap[caseFromRm100.DTeam.slice(0, 9)];
    if(!caseFromRm100.clientName) {
        // a.3-2.1 Check client name.
        return await errorHandler({ caseFromRm100, errorValue: 'a.3.2-1', message: `No matched client name with contract number=${caseFromRm100.DTeam.slice(0, 9)}`, __line, 
        ifContinueSync: true });
    }
    const errFromCOPTC = await order.insertOrderHead(new COPTC(caseFromRm100));
    // a.3-2.2 Store order head into ERP.
    if(errFromCOPTC) {
        return await errorHandler({ caseFromRm100, errorValue: 'a.3-2.2', message: 'Fail to insert order head to ERP', __line, err: errFromCOPTC, ifContinueSync: true });
    }
    caseFromRm100.CFIELD01 = caseFromRm100.TD001 + caseFromRm100.TD002;
    developLog(`Insert success in COPTC.CFIELD01=${caseFromRm100.CFIELD01}`);
    caseFromRm100.next = 'a.4';
    // a.4 Store COPMB
    return caseFromRm100;
}

async function insertOrderBodyToCOPMB(caseFromRm100) { //a.4
    const errFromCOPMB = await clientCasePriceHead.insertOrderToCOPMB(new OrderBodyToCOPMB(caseFromRm100));
    // a.4.1 store case into COPMB
    // End of transaction.
    if(errFromCOPMB) {
        return await errorHandler({ caseFromRm100, errorValue: 'a.4.1', message: `Fail to insert COPMB to ERP`, __line, err: errFromCOPMB, ifContinueSync: true });
    }
    developLog(`Insert success in COPMB002=${caseFromRm100.DTeam}`);
    return { 'next': caseFromRm100.start, 'start': caseFromRm100.start, 'try': caseFromRm100.try };
    // back to a.1
}

async function updateOrderBodyToDone(getCaseDoneFromWhere, dataFromPrevoius) { // b.1
    if(getCaseDoneFromWhere == undefined || dataFromPrevoius == undefined) {
    //  b.1.1 Check input function.
        return await errorHandler({message: `Input function or dataFromPrevoius is undefine, stop syncing sales slip.`, __line});
    }
    try {
        //  b.1.2 Get case done from rm100.
        var casesDoneFromRm100 = await getCaseDoneFromWhere;
    } catch(err) {
        return await errorHandler({message: `Fail to get case done from rm100.`, __line, err, dataFromPrevoius, ifContinueSync: true });
    }
    if(!casesDoneFromRm100[0]) {
    //  b.1.3 Check if any case done from rm100.
        if(dataFromPrevoius.start === 'b.1-3') {
            // if no case to sync from rm100.
            dataFromPrevoius.next = 'd.1';
            dataFromPrevoius.start = 'd.1';
            developLog('Function updateOrderBodyToDone: No new case done to sync, start syncing miscellaneous cost.');
            return dataFromPrevoius;
        }
        dataFromPrevoius.next = 'b.1-' + (Number(dataFromPrevoius.next.split('-')[1])+1);
        dataFromPrevoius.start = 'b.1-' + (Number(dataFromPrevoius.start.split('-')[1])+1);
        return dataFromPrevoius;
    }
    var caseDoneFromRm100 = casesDoneFromRm100[0];
    if(!(dTeamConvertMap[caseDoneFromRm100.DTeam].length === 9 && caseDoneFromRm100.SerialNo && caseDoneFromRm100.CaseNo.length <=13 && caseDoneFromRm100.CaseNo.length >= 12 && 
    caseDoneFromRm100.CaseName && caseDoneFromRm100.CaseRoad && caseDoneFromRm100.succ && caseDoneFromRm100.relClosedate.length === 10 && caseDoneFromRm100.WCSN.length < 4 &&
    caseDoneFromRm100.通報單類別.length <= 3)) {
        //  b.1.4 Check each case done key and value.
        return await errorHandler({ message: 'Wrong case done data from rm100, stop syncing cases done', __line, 
        err: `caseDoneFromRm100 that cause error=${JSON.stringify(caseDoneFromRm100)}` });
    }
    caseDoneFromRm100.dTeam = caseDoneFromRm100.DTeam;
    caseDoneFromRm100.next = dataFromPrevoius.start;
    caseDoneFromRm100.start = dataFromPrevoius.start;
    caseDoneFromRm100.try = dataFromPrevoius.try;
    caseDoneFromRm100.dTeam_succ = caseDoneFromRm100.dTeam+'_'+caseDoneFromRm100.succ;
    const errFromSync = await salesSlip.insertERPCOPTGsynced(caseDoneFromRm100.SerialNo, caseDoneFromRm100.dTeam, '0', caseDoneFromRm100.succ);
    // b.1.5 Insert synced case done into ERPCOPTHsynced(to check if any duplication).
    if(errFromSync) {
        return await errorHandler({ message: 'Fail to insert case done to COPTH synced table', __line, err: errFromSync, dataFromPrevoius, ifContinueSync: true });
    }
    developLog(`ERPCOPTHsynced inserted at SerialNo=${caseDoneFromRm100.SerialNo+'_'+caseDoneFromRm100.dTeam_succ}`);
    try {
        caseDoneFromRm100.salesSlipActualIncome = await salesSlip.calculateActualIncome(caseDoneFromRm100);
        caseDoneFromRm100.roundSalesSlipActualIncome = round(caseDoneFromRm100.salesSlipActualIncome);
        caseDoneFromRm100.priceWithTax = round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05);
        // b.1.6 Calculate actual income from rm100.
    } catch(err) {
        return await errorHandler({ message: `Fail to calculate actual income`, __line, ifContinueSync: true, errorValue : 'b.1.6', caseDoneFromRm100, err });
    }
    if(!(caseDoneFromRm100.salesSlipActualIncome > 0)) {
        return await errorHandler({ message: 'caseDoneFromRm100.salesSlipActualIncome is undefine', err: caseDoneFromRm100.salesSlipActualIncome, __line, ifContinueSync: true, 
        caseDoneFromRm100, errorValue : 'b.1.6' });
    }
    try {
        var { result: resultFromCOPTD , transaction, dbConn } = await order.updateOrderBodyToDone(caseDoneFromRm100.CaseNo);
        // b.1.7 Update corresponding COPTD and get TD002, TD003, TD004, TD006.
        // Start of transaction.
    } catch(err) {
        return await errorHandler({ message: `Fail to update COPTD to done`, err, __line, ifContinueSync: true, errorValue : 'b.1.7', caseDoneFromRm100 });
    }
    if(!resultFromCOPTD[0]) {
        // if no case in COPTD
        return await errorHandler({ message: `No corresponding COPTD to update where CaseNo=${caseDoneFromRm100.CaseNo}`, __line, ifContinueSync : true, caseDoneFromRm100, 
        errorValue : 'b.1.7' });
    }
    caseDoneFromRm100.transaction = transaction;
    caseDoneFromRm100.dbConn = dbConn;
    caseDoneFromRm100.DTeam = resultFromCOPTD[0]['TD004']; // 品號
    caseDoneFromRm100.clientNumber = 'A'+caseDoneFromRm100.DTeam.slice(0, 9);
    caseDoneFromRm100.CType1NO = resultFromCOPTD[0]['TD006']; 
    caseDoneFromRm100.orderType = resultFromCOPTD[0]['TD001']; 
    caseDoneFromRm100.orderHeadNo = resultFromCOPTD[0]['TD002'];
    caseDoneFromRm100.orderBodyNo = resultFromCOPTD[0]['TD003'];
    caseDoneFromRm100.CREATE_DATE = currentTime.genCREATE_DATE(currentDate); // date: 20231211
    caseDoneFromRm100.CREATE_TIME = currentTime.genCREATE_TIME(); // time: 09:00:26 (hr, mins, sec)
    developLog(`COPTD update to done at TD020=${caseDoneFromRm100.CaseNo}`);
    caseDoneFromRm100.relClosedateReplaceAll = caseDoneFromRm100.relClosedate.replaceAll('/', '');
    caseDoneFromRm100.ROCeraRelCloseDate = (caseDoneFromRm100.relClosedate.slice(0,4)-1911).toString() + caseDoneFromRm100.relClosedateReplaceAll.slice(4, 8);
    caseDoneFromRm100.incomeMonth = caseDoneFromRm100.relClosedate.split('/')[1];
    caseDoneFromRm100.incomeYear = caseDoneFromRm100.relClosedate.split('/')[0];
    
    caseDoneFromRm100.next = 'b.2';
    // b.2 Insert sales slip body.
    return caseDoneFromRm100;
}

async function insertSalesSlipBody(caseDoneFromRm100) { // b.2
    caseDoneFromRm100.department = departmentConvertMap[caseDoneFromRm100.DTeam.slice(0, 9)];
    if(!caseDoneFromRm100.department) {
    // Check department exist.
        return await errorHandler({ message: `Can't find department with contract number=${caseDoneFromRm100.DTeam.slice(0, 9)}`, __line, ifContinueSync: true, 
        caseDoneFromRm100, errorValue : 'b.2.1' });
    }
    try {
        var oldCaseDoneInfo = await salesSlip.getOldERPsalesSlipBodyInfo(caseDoneFromRm100.dTeam_succ);
        // b.2.1 Check if sales slip with same dteam + succ exist 
    } catch(err) {
        return await errorHandler({ message: `Fail to get old sales slip body info`, err, __line, ifContinueSync: true, errorValue : 'b.2.1', caseDoneFromRm100 });
    }
    if(oldCaseDoneInfo[0]) {
        // b.2.1.1 If exist new TH003 += 1
        if(oldCaseDoneInfo[0]['TH003'] == '9999') {
            return await errorHandler({ caseDoneFromRm100, errorValue: 'b.2.1.1', message: 'TH003 out of range, stop syncing.', __line });
        }
        caseDoneFromRm100.TH003 = ('000' + (Number(oldCaseDoneInfo[0]['TH003']) + 1)).slice(-4);
        caseDoneFromRm100.TH002 = oldCaseDoneInfo[0]['TH002'];
        caseDoneFromRm100.TH001 = oldCaseDoneInfo[0]['TH001'];
        oldCaseDoneInfo[0]['TH035'] > round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05) ? caseDoneFromRm100.TH035 = oldCaseDoneInfo[0]['TH035']: caseDoneFromRm100.TH035 = round(caseDoneFromRm100.roundSalesSlipActualIncome/1.05);
        const errFromCOPTH = await salesSlip.insertSalesSlipBody(new NoninitialCOPTH(caseDoneFromRm100));
        // b.2.2 Store sales slip body into ERP.
        if(errFromCOPTH) {
            return await errorHandler({ message: `Fail to insert sales slip body`, err: errFromCOPTH, __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.2.2' });
        }
        developLog(`Insert success in COPTH004=${caseDoneFromRm100.DTeam}`);
        caseDoneFromRm100.next = 'b.3-1';
        // b.3-1 Update total price to sales slip head.
        return caseDoneFromRm100;
    }
    // b.2.1.2 If doesn't exist
    caseDoneFromRm100.TG001 = salesSlipTypeConvertMap[caseDoneFromRm100.通報單類別];
    caseDoneFromRm100.dateCreate = (currentTime.getFullYear()-1911).toString() + currentTime.getMonthTwoDegits() + currentDate; // etc. 1130105
    try {
        var number = await salesSlip.genERPsalesSlipSerialNo(caseDoneFromRm100.ROCeraRelCloseDate, caseDoneFromRm100.TG001);
        // b.2.1.3 Generate new serialNo from ERP.
    } catch(err) {
        return await errorHandler({ message: 'Fail to get ERP lastest serialNo', err, __line, caseDoneFromRm100, errorValue : 'b.2.1.3', ifContinueSync: true });
    }
    if(undefined === number[0]) {
        caseDoneFromRm100.TG002 = caseDoneFromRm100.ROCeraRelCloseDate + '001';
        // if no lastest serial number to get, set serialNo = 001
    } else {
        caseDoneFromRm100.TG002 = (Number(number[0]['TG002'])+1).toString();
        // if number from ERP defined, number + 1 = new serial number for new case done
    }
    if(caseDoneFromRm100.TG002.length !== 10) {
        return await errorHandler({ message: 'Fail to convert TG002+1 to string', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.2.1.3' });
    }
    const errFromCOPTD = await salesSlip.insertSalesSlipBody(new FirstCOPTH(caseDoneFromRm100));
    // b.2.2 Store sales slip body into ERP
    if(errFromCOPTD) {
        return await errorHandler({ message: 'Fail to insert sales slip body to ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.2.2', err: errFromCOPTD })
    }
    developLog(`Insert success in COPTH004=${caseDoneFromRm100.DTeam}`);
    caseDoneFromRm100.next = 'b.3-2';
    // b.3-2 insert new sales slip head 
    return caseDoneFromRm100;
}

async function updateSalesSlipHead(caseDoneFromRm100) { // b.3-1
    try {
        var previousPrice = await salesSlip.updateSalesSlipHead(caseDoneFromRm100.roundSalesSlipActualIncome, caseDoneFromRm100.TH001, caseDoneFromRm100.TH002, caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
        // b.3-1.1 Update price and amount in corresponding sales slip head, and get total price.
    } catch(err) {
        return await errorHandler({ message: `Fail to update price and amount in corresponding sales slip head`, err, __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.3-1.1' });
    }
    if(!previousPrice[0]) {
        return await errorHandler({ message: `Fail to get previous price in corresponding sales slip head`, __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.3-1.1' });
    }
    const fixedSalesSlipIncome = (previousPrice[0]['TG025']-previousPrice[0]['TG013']*0.05+round(caseDoneFromRm100.salesSlipActualIncome))/1.05;
    const leftIncome =  round(round(caseDoneFromRm100.salesSlipActualIncome)/1.05) - round(fixedSalesSlipIncome);
    if(leftIncome != 0) {
        const errFromCOPTH = await salesSlip.fixMultiRound(caseDoneFromRm100.TH001, caseDoneFromRm100.TH002, caseDoneFromRm100.TH035, leftIncome, caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
        // b.3-1.2 Fix mutliple round in sales slip body with highest price.
        if(errFromCOPTH) {
            return await errorHandler({ message: `Fail to fix multi round leftIncome=${leftIncome}`, __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.3-1.2', err: errFromCOPTH });
        }
    }
    developLog(`Update success in price and amount at COPTG.CFIELD01=${caseDoneFromRm100.TH001+caseDoneFromRm100.TH002}`);
    caseDoneFromRm100.next = 'b.4';
    // b.4 Update COPMB.
    return caseDoneFromRm100;
}

async function insertSalesSlipHead(caseDoneFromRm100) { // b.3-2
    const errFromWaiting = await cost.insertERPmiscellaneousCostWaiting(caseDoneFromRm100.dTeam, caseDoneFromRm100.succ, '1', caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
    // b.3-2.1 Store first sales slip head's dteam_succ into ERPmiscellaneousCostWaiting for workflow d to get data.
    if(errFromWaiting) {
        return await errorHandler({ message: 'Fail to insert dTeam_succ to waiting table', err: errFromWaiting, __line, ifContinueSync: true, errorValue : 'b.3-2.1', 
        caseDoneFromRm100 });
    }
    caseDoneFromRm100.clientName = clientConvertMap[caseDoneFromRm100.DTeam.slice(0, 9)];
    if(!caseDoneFromRm100.clientName) {
    // Check client name exist.
        return await errorHandler({ message: `Can't find client name with contract number=${caseDoneFromRm100.DTeam.slice(0, 9)}`, __line, ifContinueSync: true, 
        caseDoneFromRm100, errorValue : 'b.2.1' });
    }
    const errFromCOPTC = await salesSlip.insertSalesSlipHead(new COPTG(caseDoneFromRm100));
    // b.3-2.2 Store case into sales slip head(COPTG).
    if(errFromCOPTC) {
        return await errorHandler({ message: 'Fail to insert sales slip head to ERP', err: errFromCOPTC, __line, ifContinueSync: true, errorValue : 'b.3-2.2', 
        caseDoneFromRm100 });
    }
    developLog(`Insert success in TG002=${caseDoneFromRm100.TG002}`);
    caseDoneFromRm100.next = 'b.4';
    // b.4 Update COPMB
    return caseDoneFromRm100;
}

async function updateSalesSlipBodyToCOPMB(caseDoneFromRm100) { // b.4
    const errFromCOPMB = await clientCasePriceHead.updateSalesSlipToCOPMB(caseDoneFromRm100.relClosedateReplaceAll, caseDoneFromRm100.DTeam, caseDoneFromRm100.salesSlipActualIncome, caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
    // b.4.1 Update COPMB.
    if(errFromCOPMB) {
        return await errorHandler({ caseDoneFromRm100, errorValue: 'b.4.1', message: `Fail to update COPMB to ERP`, __line, ifContinueSync: true, err: errFromCOPMB });
    }
    developLog(`Update success in COPMB002=${caseDoneFromRm100.DTeam}`);
    caseDoneFromRm100.next = 'b.5';
    // b.5 Insert INVLD.
    return caseDoneFromRm100;
}

async function insertSalesSlipToINVLD(caseDoneFromRm100) { // b.5
    if(caseDoneFromRm100.TH003) {
        // check if old case done
        var errFromINVLD = await projectManage.insertSalesSlipToINVLD(new SalesSlipToINVLD(caseDoneFromRm100));
        // 2024-04-22 Add End of transaction, 由於停用過帳功能將transaction commit 移至這，若需啟用過帳，刪除這些。
        // b.5.1 store INVLD into ERP
    } else {
        caseDoneFromRm100.TH003 = '0001';
        caseDoneFromRm100.TH001 = caseDoneFromRm100.TG001;
        caseDoneFromRm100.TH002 = caseDoneFromRm100.TG002;
        var errFromINVLD = await projectManage.insertSalesSlipToINVLD(new SalesSlipToINVLD(caseDoneFromRm100));
        // 2024-04-22 Add End of transaction, 由於停用過帳功能將transaction commit 移至這，若需啟用過帳，刪除這些。
    }
    if(errFromINVLD) {
        return await errorHandler({ caseDoneFromRm100, errorValue: 'b.5.1', message: `Fail to insert INVLD to ERP`, __line, ifContinueSync: true, err: errFromINVLD });
    }
    developLog(`Insert success in INVLD001=${caseDoneFromRm100.DTeam.slice(0, 9)}`);
    // if(!caseDoneFromRm100.TG001) { // 2024-04-18 停用過帳功能
    // // Check if not first sales slip body.
    //     caseDoneFromRm100.next = 'b.7-1';
    //     // b.7-1 Update AJSTA.
    //     return caseDoneFromRm100;

    // }
    // if first sales slip body.
    // caseDoneFromRm100.next = 'b.6'; // 2024-04-18 停用過帳功能 'b.6' => return { 'next': caseDoneFromRm100.start, 'start': caseDoneFromRm100.start, 'try': caseDoneFromRm100.try };
    // b.6 Insert AJSLA.
    return { 'next': caseDoneFromRm100.start, 'start': caseDoneFromRm100.start, 'try': caseDoneFromRm100.try };
}

async function insertSalesSlipBodyToAJSLA(caseDoneFromRm100) { // b.6
    try {
        var pBCserialNo = await pBC.genPBCserialNo(caseDoneFromRm100.dateCreate);
        // b.6.1 Get lastest PBC serialNo from ERP.
    } catch(err) {
        return await errorHandler({ message: 'Fail to get PBC serialNo from ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.6.1', err });
    }
    if(pBCserialNo[0] == undefined) {
        caseDoneFromRm100.LA001 = caseDoneFromRm100.dateCreate + '001';
        // If no lastest serial number to get, set serialNo = 001.
    } else {
        caseDoneFromRm100.LA001 = (Number(pBCserialNo[0]['LA001'])+1).toString();
        // If serialNo from ERP defined, number + 1 = new serial number.
    }
    if(caseDoneFromRm100.LA001.length !== 10) {
        return await errorHandler({ message: 'Fail to convert LA001+1 to string', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.6.1' });
    }
    const errFromAJSLA = await pBCsource.insertSalesSlipToAJSLA(new salesSlipHeadToAJSLA(caseDoneFromRm100));
    // b.6.2 Store PBC source into ERP.
    if(errFromAJSLA){
        return await errorHandler({ message: 'Fail to insert PBC source(AJSLA) to ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.6.2', 
        err: errFromAJSLA })
    }
    developLog(`Insert success in AJSLA001=${caseDoneFromRm100.LA001}`);
    caseDoneFromRm100.next = 'b.7-2';
    // b.7-2 insert AJSTA
    return caseDoneFromRm100;
}

async function updateSalesSlipBodyToAJSTA(caseDoneFromRm100) { // b.7-1
    const errFromAJSTA = await pBC.updateSalesSlipBodyToAJSTA(caseDoneFromRm100.dTeam_succ, caseDoneFromRm100.priceWithTax, caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
    // b.7-1.1 Update price to AJSTA.
    if(errFromAJSTA) {
        return await errorHandler({ message: 'Fail update price to AJSTA', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.7-1.1', err: errFromAJSTA });
    }
    developLog(`Update success in price at AJSTA010=${caseDoneFromRm100.dTeam_succ}`);
    caseDoneFromRm100.next = 'b.8-1';
    // b.8-1 Update ACTTB.
    return caseDoneFromRm100;
}

async function insertSalesSlipHeadToAJSTA(caseDoneFromRm100) { // b.7-2
    try {
        var accountEntrySerialNo = await accountEntry.genAccountEntrySerialNo((caseDoneFromRm100.ROCeraRelCloseDate));
        // b.7-2.1 Get lastest account entry serialNo from ERP. 
    } catch(err) {
        return await errorHandler({ message: 'Fail to get account entry serialNo from ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.7-2.1', err });
    }
    if(accountEntrySerialNo[0] == undefined) {
        caseDoneFromRm100.AJSTA005 = caseDoneFromRm100.ROCeraRelCloseDate + '001';
        // If no lastest serial number to get, set serialNo = 001.
    } else {
        caseDoneFromRm100.AJSTA005 = (Number(accountEntrySerialNo[0]['TA002'])+1).toString();
        // If serialNo from ERP defined, number + 1 = new serial number.
    }
    if(caseDoneFromRm100.AJSTA005.length !== 10) {
        return await errorHandler({ message: 'Fail to convert AJSTA005+1 to string', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.7-2.1' });
    }
    const errFromAJSLA = await pBC.insertSalesSlipToAJSTA(new salesSlipHeadToAJSTA(caseDoneFromRm100));
    // b.7-2.2 Store PBC source into ERP.
    if(errFromAJSLA) {
        return await errorHandler({ message: 'Fail to insert PBC source(AJSLA) to ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.7-2.2', 
        err: errFromAJSLA })
    }
    developLog(`Insert success in AJSTA005=${caseDoneFromRm100.AJSTA005}`);
    caseDoneFromRm100.next = 'b.8-2';
    // b.8-2 insert AJSTB.
    return caseDoneFromRm100;
}

async function updateSalesSlipBodyToAJSTB(caseDoneFromRm100) { // b.8-1
    const errFromAJSTB = await pBC.updateSalesSlipBodyToAJSTB(caseDoneFromRm100.dTeam_succ, caseDoneFromRm100.priceWithTax, 
        caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
    // b.8-1.1 Update PBC price into ERP.
    if(errFromAJSTB) {
        return await errorHandler({ message: 'Fail to update PBC(AJSTB) price to ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.8-1.1', 
        err: errFromAJSTB });
    }
    developLog(`Update success in AJSTB010=${caseDoneFromRm100.dTeam_succ}`);
    caseDoneFromRm100.next = 'b.9-1';
    // b.9-1 update ACTTA.
    return caseDoneFromRm100;
}

async function insertSalesSlipHeadToAJSTB(caseDoneFromRm100) { // b.8-2
    caseDoneFromRm100.AJSTB019 = dteamShortClientNameConvertMap[caseDoneFromRm100.dTeam];
    const errFromAJSTBexpenditure = await pBC.insertSalesSlipToAJSTB(new salesSlipHeadToAJSTBexpenditure(caseDoneFromRm100));
    // b.8-2.1 Store PBC expenditure into ERP.
    if(errFromAJSTBexpenditure) {
        return await errorHandler({ message: 'Fail to insert PBC(AJSTB) expenditure to ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.8-2.1', 
        err: errFromAJSTBexpenditure });
    }
    developLog(`Insert success in AJSTB001+TB027=${caseDoneFromRm100.LA001+'0020'}`);
    const errFromAJSTAincome = await pBC.insertSalesSlipToAJSTB(new salesSlipHeadToAJSTBincome(caseDoneFromRm100));
    // b.8-2.2 Store PBC income into ERP.
    if(errFromAJSTAincome) {
        return await errorHandler({ message: 'Fail to insert PBC(AJSTB) income to ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.8-2.2', 
        err: errFromAJSTAincome });
    }
    developLog(`Insert success in AJSTB001+TB027=${caseDoneFromRm100.LA001+'0010'}`);
    caseDoneFromRm100.next = 'b.9-2';
    // b.9-2 insert ACTTA.
    return caseDoneFromRm100;
}

async function updateSalesSlipBodyToACTTA(caseDoneFromRm100) { // b.9-1
    const errFromACTTA = await accountEntry.updateSalesSlipToACTTA(caseDoneFromRm100.dTeam_succ, caseDoneFromRm100.priceWithTax, 
        caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
    // b.9-1.1 Update account entry price into ERP.
    if(errFromACTTA) {
        return await errorHandler({ message: 'Fail to update account entry head(ACTTA) price to ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.9-1.1', 
        err: errFromACTTA });
    }
    developLog(`Update success in ACTTA009=${caseDoneFromRm100.dTeam_succ}`);
    caseDoneFromRm100.next = 'b.10-1';
    // b.10-1 Update ACTTB.
    return caseDoneFromRm100;
}

async function insertSalesSlipHeadToACTTA(caseDoneFromRm100) { // b.9-2
    const errFromACTTA = await accountEntry.insertSalesSlipToACTTA(new salesSlipHeadToACTTA(caseDoneFromRm100));
    // b.9-2.1 Store ACTTA into ERP.
    if(errFromACTTA) {
        return await errorHandler({ message: 'Fail to insert account entry head(ACTTA) to ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.9-2.1', 
        err: errFromACTTA });
    }
    developLog(`Insert success in ACTTA002=${caseDoneFromRm100.AJSTA005}`);
    caseDoneFromRm100.next = 'b.10-2';
    // b.10-2 Insert ACTTB.
    return caseDoneFromRm100;
}

async function updateSalesSlipBodyToACTTB(caseDoneFromRm100) { // b.10-1 
    const errFromACTTB = await accountEntry.updateSalesSlipToACTTB(caseDoneFromRm100.dTeam_succ, caseDoneFromRm100.priceWithTax,
    caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
    // b.10-1.1 Update PBC price into ERP.
    if(errFromACTTB) {
        return await errorHandler({ message: 'Fail to update account entry body(ACTTB) price to ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.10-1.1', 
        err: errFromACTTB });
    }
    developLog(`Update success in ACTTB010=${caseDoneFromRm100.dTeam_succ}`);
    caseDoneFromRm100.next = 'b.11-1';
    // b.11-1 update ACTML.
    return caseDoneFromRm100;
}

async function insertSalesSlipHeadToACTTB(caseDoneFromRm100) { // b.10-2 
    const errFromACTTBexpenditure = await accountEntry.insertSalesSlipToACTTB(new salesSlipHeadToACTTBexpenditure(caseDoneFromRm100));
    // b.10-2.1 Store account entry body(ACTTB) expenditure to ERP.
    if(errFromACTTBexpenditure) {
        return await errorHandler({ message: 'Fail to insert account entry body(ACTTB) expenditure to ERP', __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.10-2.1', err: errFromACTTBexpenditure });
    }
    developLog(`Insert success in ACTTB002+TB003=${caseDoneFromRm100.AJSTA005+'0020'}`);
    const errFromACTTBincome = await accountEntry.insertSalesSlipToACTTB(new salesSlipHeadToACTTBincome(caseDoneFromRm100));
    // b.10-2.2 Store account entry body(ACTTB) income to ERP.
    if(errFromACTTBincome) {
        return await errorHandler({ message: 'Fail to insert account entry body(ACTTB) income to ERP', __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.10-2.2', err: errFromACTTBincome });
    }
    developLog(`Insert success in ACTTB002+TB003=${caseDoneFromRm100.AJSTA005+'0010'}`);
    caseDoneFromRm100.next = 'b.11-2';
    // b.11-2 insert ACTLM.
    return caseDoneFromRm100;
}

async function updateSalesSlipBodyToACTML(caseDoneFromRm100) { // b.11-1 
    const errFromACTML = await categoricallyAccounting.updateSalesSlipToACTML(caseDoneFromRm100.dTeam_succ, caseDoneFromRm100.priceWithTax, 
    caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
    // b.11-1.1 Update PBC price into ERP.
    if(errFromACTML) {
        return await errorHandler({ message: 'Fail to update categorically accounting(ACTML) price to ERP', __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.11-1.1', err: errFromACTML });
    }
    developLog(`Update success in ACTML009=${caseDoneFromRm100.dTeam_succ}`);
    caseDoneFromRm100.next = 'b.12-1';
    // b.12-1 update ACTMN.
    return caseDoneFromRm100;
} 

async function insertSalesSlipHeadToACTML(caseDoneFromRm100) { // b.11-2 
    const errFromACTMLexpenditure = await categoricallyAccounting.insertSalesSlipToACTML(new salesSlipHeadToACTMLexpenditure(caseDoneFromRm100));
    // b.11-2.1 Store categorically accounting(ACTML) expenditure to ERP.
    if(errFromACTMLexpenditure) {
        return await errorHandler({ message: 'Fail to insert categorically accounting(ACTML) expenditure to ERP', __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.11-2.1', err: errFromACTMLexpenditure });
    }
    developLog(`Insert success in ACTML004+ML005=${caseDoneFromRm100.AJSTA005+'0020'}`);
    const errFromACTMLincome = await categoricallyAccounting.insertSalesSlipToACTML(new salesSlipHeadToACTMLincome(caseDoneFromRm100));
    // b.11-2.2 Store categorically accounting(ACTML) income to ERP.
    if(errFromACTMLincome) {
        return await errorHandler({ message: 'Fail to insert categorically accounting(ACTML) income to ERP', __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.11-2.2', err: errFromACTMLincome });
    }
    developLog(`Insert success in ACTML004+ML005=${caseDoneFromRm100.AJSTA005+'0010'}`);
    caseDoneFromRm100.next = 'b.12-2';
    // b.12-2 Insert ACTMN.
    return caseDoneFromRm100;
} 

async function updateSalesSlipBodyToACTMN(caseDoneFromRm100) { // b.12-1
    const errFromACTMN = await detail.updateSalesSlipToACTMN(caseDoneFromRm100.dTeam_succ, caseDoneFromRm100.priceWithTax, 
    caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
    // b.12-1.1 Update detail head price into ERP.
    if(errFromACTMN) {
        return await errorHandler({ message: 'Fail to update detail head(ACTMN) price to ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.11-1.1', 
        err: errFromACTMN });
    }
    developLog(`Update success in ACTMN003=${caseDoneFromRm100.clientNumber}`);
    caseDoneFromRm100.next = 'b.13-1';
    // b.13-1 Update ACTMM.
    return caseDoneFromRm100;
}

async function insertSalesSlipHeadToACTMN(caseDoneFromRm100) { // b.12-2
    const errFromACTMN = await detail.insertSalesSlipToACTMN(new salesSlipHeadToACTMN(caseDoneFromRm100));
    // b.12-2.1 Store datail head(ACTMN) into ERP.
    if(errFromACTMN) {
        return await errorHandler({ message: 'Fail to insert datail head(ACTMN) to ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.11-2.1', 
        err: errFromACTMN });
    }
    developLog(`Insert success in ACTMN003=${caseDoneFromRm100.clientNumber}`);
    caseDoneFromRm100.next = 'b.13-2';
    // b.13-2 Insert ACTMM.
    return caseDoneFromRm100;
}

async function updateSalesSlipBodyToACTMM(caseDoneFromRm100) { // b.13-1
    const errFromACTMM = await monthlyDetail.updateSalesSlipBodyToACTMM(caseDoneFromRm100.priceWithTax, caseDoneFromRm100.clientNumber, caseDoneFromRm100.incomeYear, 
        caseDoneFromRm100.incomeMonth, caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
    // b.13-1.1 Update monthly detail(ACTMM) price to ERP.
    if(errFromACTMM) {
        return await errorHandler({ message: 'Fail to update monthly detail(ACTMM) price to ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.13-1.1', 
        err: errFromACTMM });
    }
    developLog(`Update success in ACTMM003+MM004+MM005=${caseDoneFromRm100.clientNumber+caseDoneFromRm100.incomeYear+caseDoneFromRm100.incomeMonth}`);
    caseDoneFromRm100.next = 'b.14-1';
    // b.14-1 Update ACTMB.
    return caseDoneFromRm100;
}

async function insertSalesSlipHeadToACTMM(caseDoneFromRm100) { // b.13-2
    try {
        var oldMonthlyDetail = await monthlyDetail.getOldMonthlyDetail(caseDoneFromRm100.clientNumber, caseDoneFromRm100.incomeYear, caseDoneFromRm100.incomeMonth);
        // b.13-2.1 Check if monthly detail with same year, month and client exist.
    } catch(err) {
        return await errorHandler({ message: 'Fail to get old monthly datail(ACTMM) from ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.13-2.1', err });
    }
    if(oldMonthlyDetail[0]) {
        caseDoneFromRm100.next = 'b.13-3';
        // b.13-3 Update ACTMM.
        return caseDoneFromRm100;
    }
    const errFromACTMM = await monthlyDetail.insertSalesSlipToACTMM(new salesSlipHeadToACTMM(caseDoneFromRm100));
    // b.13-2.2 Store monthly detail(ACTMM) into ERP.  
    if(errFromACTMM) {
        return await errorHandler({ message: 'Fail to insert monthly datail(ACTMM) to ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.13-2.2', 
        err: errFromACTMM });
    }
    developLog(`Insert success in ACTMM003+MM004+MM005=${caseDoneFromRm100.clientNumber+caseDoneFromRm100.incomeYear+caseDoneFromRm100.incomeMonth}`);
    caseDoneFromRm100.next = 'b.14-2';
    // b.14-2 Insert ACTMB.
    return caseDoneFromRm100;
}

async function updateSalesSlipHeadToACTMM(caseDoneFromRm100) { // b.13-3
    const errFromACTMM = await monthlyDetail.updateSalesSlipHeadToACTMM(caseDoneFromRm100.priceWithTax, caseDoneFromRm100.clientNumber, caseDoneFromRm100.incomeYear, 
        caseDoneFromRm100.incomeMonth, caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
    // b.13-3.1 Update monthly detail(ACTMM) price and amount to ERP.
    if(errFromACTMM) {
        return await errorHandler({ message: 'Fail to update monthly detail(ACTMM) price and amount to ERP', __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.13-3.1', err: errFromACTMM });
    }
    developLog(`Update success in ACTMM003+MM004+MM005=${caseDoneFromRm100.clientNumber+caseDoneFromRm100.incomeYear+caseDoneFromRm100.incomeMonth}`);
    caseDoneFromRm100.next = 'b.14-3';
    // b.14-3 Update ACTMB.
    return caseDoneFromRm100;
}

async function updateSalesSlipBodyToACTMB(caseDoneFromRm100) { // b.14-1
    const errFromACTMB4111 = await monthlyAccounting.updateSalesSlipBodyToACTMB4111('4111', caseDoneFromRm100.incomeYear, caseDoneFromRm100.incomeMonth, caseDoneFromRm100.priceWithTax, 
    caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
    // b.14-1.1 Update monthly accounting4111(ACTMB) price to ERP.
    if(errFromACTMB4111) {
        return await errorHandler({ message: 'Fail to update monthly accounting4111(ACTMB) price to ERP', __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.14-1.1', err: errFromACTMB4111 });
    }
    developLog(`Update success in ACTMB001+MB002+MB003=${'4111'+caseDoneFromRm100.incomeYear+caseDoneFromRm100.incomeMonth}`);
    const errFromACTMB1199 = await monthlyAccounting.updateSalesSlipBodyToACTMB1199('1199', caseDoneFromRm100.incomeYear, 
    caseDoneFromRm100.incomeMonth, caseDoneFromRm100.priceWithTax, caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
    // b.14-1.2 Update monthly accounting1199(ACTMB) price to ERP.
    if(errFromACTMB1199) {
        return await errorHandler({ message: 'Fail to update monthly accounting1199(ACTMB) price to ERP', __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.14-1.2', err: errFromACTMB1199 });
    }
    developLog(`Update success in ACTMB001+MB002+MB003=${'1199'+caseDoneFromRm100.incomeYear+caseDoneFromRm100.incomeMonth}`);
    caseDoneFromRm100.next = 'b.15-1';
    // b.15-1 Update ACTMD.
    return caseDoneFromRm100;
}

async function insertSalesSlipHeadToACTMB(caseDoneFromRm100) { // b.14-2
    try {
        var oldMonthlyAccounting = await monthlyAccounting.getOldMonthlyAccounting('4111', caseDoneFromRm100.incomeYear, caseDoneFromRm100.incomeMonth);
        // b.14-2.1 Check if monthly accounting with same year, month and accounting category = 4111.
    } catch(err) {
        return await errorHandler({ message: 'Fail to get old monthly accounting4111(ACTMB) from ERP', __line, ifContinueSync: true, caseDoneFromRm100, errorValue : 'b.14-2.1', 
        err });
    }
    if(oldMonthlyAccounting[0]) {
        caseDoneFromRm100.next = 'b.14-3';
        // b.14-3 Update ACTMB.
        return caseDoneFromRm100;
    }
    const errFromACTMB4111 = await monthlyAccounting.insertSalesSlipToACTMB(new salesSlipHeadToACTMB4111(caseDoneFromRm100));
    // b.14-2.2 Store monthly accounting4111(ACTMB) into ERP.
    if(errFromACTMB4111) {
        return await errorHandler({ message: 'Fail to insert monthly accounting4111(ACTMB) into ERP', __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.14-2.2', err: errFromACTMB4111 });
    }
    developLog(`Insert success in ACTMB001+MB002+MB003=${'4111'+caseDoneFromRm100.incomeYear+caseDoneFromRm100.incomeMonth}`);
    const errFromACTMB1199 = await monthlyAccounting.insertSalesSlipToACTMB(new salesSlipHeadToACTMB1199(caseDoneFromRm100));
    // b.14-2.3 Store monthly accounting1199(ACTMB) into ERP.  
    if(errFromACTMB1199) {
        return await errorHandler({ message: 'Fail to insert monthly accounting1199(ACTMB) into ERP', __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.14-2.3', err: errFromACTMB1199 });
    }
    developLog(`Insert success in ACTMB001+MB002+MB003=${'1199'+caseDoneFromRm100.incomeYear+caseDoneFromRm100.incomeMonth}`);
    caseDoneFromRm100.next = 'b.15-2';
    // b.15-2 Insert ACTMD.
    return caseDoneFromRm100;
}

async function updateSalesSlipHeadToACTMB(caseDoneFromRm100) { // b.14-3
    const errFromACTMB4111 = await monthlyAccounting.updateSalesSlipHeadToACTMB4111('4111', caseDoneFromRm100.incomeYear, 
    caseDoneFromRm100.incomeMonth, caseDoneFromRm100.priceWithTax, caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
    // b.14-3.1 Update monthly accounting4111(ACTMB) price and amount to ERP.
    if(errFromACTMB4111) {
        return await errorHandler({ message: 'Fail to update monthly accounting4111(ACTMB) price and amount to ERP', __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.14-3.1', err: errFromACTMB4111 });
    }
    developLog(`Update success in ACTMB001+MB002+MB003=${'4111'+caseDoneFromRm100.incomeYear+caseDoneFromRm100.incomeMonth}`);
    const errFromACTMB1199 = await monthlyAccounting.updateSalesSlipHeadToACTMB1199('1199', caseDoneFromRm100.incomeYear, caseDoneFromRm100.incomeMonth, caseDoneFromRm100.priceWithTax, 
    caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
    // b.14-3.2 Update monthly accounting1199(ACTMB) price and amount to ERP.
    if(errFromACTMB1199) {
        return await errorHandler({ message: 'Fail to update monthly accounting1199(ACTMB) price and amount to ERP', __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.14-3.2', err: errFromACTMB1199 });
    }
    developLog(`Update success in ACTMB001+MB002+MB003=${'1199'+caseDoneFromRm100.incomeYear+caseDoneFromRm100.incomeMonth}`);
    caseDoneFromRm100.next = 'b.15-2';
    // b.15-2 Update ACTMD.
    return caseDoneFromRm100;
}

async function updateSalesSlipToACTMD(caseDoneFromRm100) { // b.15-1
    const errFromACTMD = await monthlyDepartmentAccounting.updateSalesSlipToACTMD('4111', caseDoneFromRm100.department, caseDoneFromRm100.incomeYear, 
    caseDoneFromRm100.incomeMonth, caseDoneFromRm100.priceWithTax, caseDoneFromRm100.transaction, caseDoneFromRm100.dbConn);
    // b.15-1.1 Update price in monthly department accounting.
    // End of transaction.
    if(errFromACTMD) {
        return await errorHandler({ message: 'Fail to update monthly department accounting(ACTMD) to ERP', __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.15-1.1', err: errFromACTMD });
    }
    developLog(`Update success in ACTMD001+MD002+MD003+MD004=${'4111'+caseDoneFromRm100.department+caseDoneFromRm100.incomeYear+caseDoneFromRm100.incomeMonth}`);
    if(caseDoneFromRm100.start.slice(0,1) == 'b') {
        return { 'next': caseDoneFromRm100.start, 'start': caseDoneFromRm100.start, 'try': caseDoneFromRm100.try };
    }
    const errFromWaiting = await cost.deleteERPmiscellaneousCostWaiting(caseDoneFromRm100.dTeam_succ);
    // b.15-1.2 If start from workflow d. Delete record in waiting table.
    if(errFromWaiting) {
        return await errorHandler({ caseDoneFromRm100, errorValue: 'b.15.-1', message: `Fail to delete record in waiting table`, __line, ifContinueSync: true, err: errFromWaiting });
    }
    return { 'next': caseDoneFromRm100.start, 'start': caseDoneFromRm100.start, 'try': caseDoneFromRm100.try };
}

async function insertSalesSlipHeadToACTMD(caseDoneFromRm100) { // b.15-2
    try {
        var oldMonthlyDepartmentAccounting = await monthlyDepartmentAccounting.getOldMonthlyDepartmentAccounting('4111', caseDoneFromRm100.department, 
        caseDoneFromRm100.incomeYear, caseDoneFromRm100.incomeMonth);
        // b.15-2.1 Check if old monthly department accounting exist.
    } catch(err) {
        return await errorHandler({ message: 'Fail to get old monthly department accounting(ACTMD) from ERP', __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.15-2.1', err });
    }
    if(oldMonthlyDepartmentAccounting[0]) {
        caseDoneFromRm100.next = 'b.15-1';
        // b.15-1 Update ACTMD.
        return caseDoneFromRm100;
    }
    const errFromACTMD = await monthlyDepartmentAccounting.insertSalesSlipToACTMD(new salesSlipHeadACTMD(caseDoneFromRm100));
    // b.15-2.2 Store monthly department accounting into ERP.
    // End of transaction.
    if(errFromACTMD) {
        return await errorHandler({ message: 'Fail to insert monthly department accounting(ACTMD) into ERP', __line, ifContinueSync: true, caseDoneFromRm100, 
        errorValue : 'b.15-2.2', err: errFromACTMD });
    }
    developLog(`Insert success in ACTMD001+MD002+MD003+MD004=${'4111'+caseDoneFromRm100.department+caseDoneFromRm100.incomeYear+caseDoneFromRm100.incomeMonth}`);
    return { 'next': caseDoneFromRm100.start, 'start': caseDoneFromRm100.start, 'try': caseDoneFromRm100.try };
}

async function initializetWaitingTable(dataFromPrevoius) { // d.0
    const errFromInitialize = await cost.initializeERPmiscellaneousCostWaiting();
    // d.0.1 Set all info in waiting table from 0(finished today) to 1
    if(errFromInitialize) {
        return await errorHandler({ message: `Fail to set all error value from 0 back to 1 in waiting table.`, __line, err: errFromInitialize, dataFromPrevoius, ifContinueSync: true });
    }
    return { 'next': 'a.1-1', 'start': 'a.1-1', 'try': dataFromPrevoius.try };
}

async function insertMiscellaneousCostToCOPTH(dataFromPrevoius) { // d.1
    try {
        var dTeam_succ = await cost.getERPmiscellaneousCostWaiting();
        // d.1.1 Get unsync dteam and succ where error value 1(is not finished today).
    } catch(err) {
        return await errorHandler({ dataFromPrevoius, message: `Fail to get dTeam_succ info from waiting table`, __line, ifContinueSync: true, err });
    }
    if(!dTeam_succ[0]) {
        // d.1.2 Check if all miscellaneous costs is done.
        developLog(`No more miscellaneous costs is waiting today, stop syncing.`);
        return { 'next': '0', 'start': 'd.0', 'try': 0 };
    }
    try {
        // d.1.3 Get miscellaneous costs from rm100.
        var miscellaneousCosts = await cost.getMiscellaneousCost(dTeam_succ[0].serialNo.split('_')[0], dTeam_succ[0].serialNo.split('_')[1]);
    } catch(err) {
        return await errorHandler({ dataFromPrevoius, message: `Fail to get miscellaneous costs from rm100`, __line, ifContinueSync: true, err });
    }
    if(!miscellaneousCosts[0]) {
        // d.1.3.1 If miscellaneous costs is not in database yet, change value to 0(finished today).
        try {
            var costsTriedToday = await cost.updateERPmiscellaneousCostWaitingTo0(dTeam_succ[0].serialNo);
        } catch(err) {
            return await errorHandler({ miscellaneousCosts:dataFromPrevoius, errorValue: 'd.1.3.1', message: `Fail to set error control to 0 in waiting table`, __line, ifContinueSync: true, err });
        }
        developLog(`No miscellaneous costs to get, set error value in waiting table from ${costsTriedToday[0].errorControl} to 0 where dTeam_succ=${dTeam_succ[0].serialNo}`);
        return dataFromPrevoius;
    }
    miscellaneousCosts.next = dataFromPrevoius.start;
    miscellaneousCosts.start = dataFromPrevoius.start;
    miscellaneousCosts.try = dataFromPrevoius.try;
    miscellaneousCosts.dTeam_succ = dTeam_succ[0].serialNo;
    miscellaneousCosts.clientNumber = 'A' + dTeamConvertMap[miscellaneousCosts.dTeam_succ.split('_')[0]];
    miscellaneousCosts.department = departmentConvertMap[miscellaneousCosts.clientNumber.slice(1,10)];
    try {
        var salesSlipInfo = await cost.getOldERPsalesSlipBodyInfoForCost(miscellaneousCosts.dTeam_succ);
        // d.1.4 Get sales slip head with same dTeam_succ
    } catch(err) {
        return await errorHandler({ miscellaneousCosts, errorValue: 'd.1.4', message: `Fail to get old sales slip head with same dTeam_succ`, __line, ifContinueSync: true, err });
    }
    if(!salesSlipInfo[0]) {
        return await errorHandler({ miscellaneousCosts, errorValue: 'd.1.4', message: `No corresponding sales slip head where dTeam_succ=${miscellaneousCosts.dTeam_succ}`, 
        __line, ifContinueSync: true });
    }
    miscellaneousCosts.TH003 = (Number(salesSlipInfo[0]['TH003'])+1);
    miscellaneousCosts.TH002 = salesSlipInfo[0]['TH002'];
    miscellaneousCosts.TH001 = salesSlipInfo[0]['TH001'];
    miscellaneousCosts.TH030 = salesSlipInfo[0]['TH030'];
    miscellaneousCosts.CREATE_DATE = currentTime.genCREATE_DATE(currentDate); // date: 20231211
    miscellaneousCosts.CREATE_TIME = currentTime.genCREATE_TIME(); // time: 09:00:26 (hr, mins, sec)
    const costArr = [salesSlipInfo[0]['TH035']];
    // Start of transaction.
    const  dbConn = new sql.ConnectionPool(ERPConfig);
    let transaction;
    try {
        await dbConn.connect();
        transaction = new sql.Transaction(dbConn);
        await transaction.begin();
    } catch(err) {
        return await errorHandler({ miscellaneousCosts, errorValue: 'd.1.6', message: `Fail to start transaction`, __line, ifContinueSync: true, err });
    }
    miscellaneousCosts.transaction = transaction;
    miscellaneousCosts.dbConn = dbConn;
    try {
        miscellaneousCosts.priceWithTax = 0;
        for(miscellaneousCost of miscellaneousCosts) {
            // for loop can't return errorHandler, or in short can't return promise.
            const numberAfterDecimalPoint = miscellaneousCost.cost.toString().split('.')[1];
            if(numberAfterDecimalPoint) {
                if(numberAfterDecimalPoint.length > 2) {
                    // Check if cost is two decimal places.
                    throw { message: `Decimal places exceed 2 in ${miscellaneousCost.cost}`, __line, errorValue: 'd.1.5' };
                }
            }
            costArr.push(round(round(miscellaneousCost.cost)/1.05));
            try {
                // d.1.5 Convert item name into item name.
                ({itemId : miscellaneousCost.itemId, itemName: miscellaneousCost.itemName} = itemNameIdConvertMap(miscellaneousCost.item));
            } catch(err) {
                throw { message: err+`where miscellaneousCost=${miscellaneousCost}`, __line, errorValue: 'd.1.5'};
            }
            const errFromCOPTH = await cost.insertMiscellaneousCostToSalesSlipBody(new miscellaneousCostToCOPTH(miscellaneousCost, miscellaneousCosts));
            // d.1.6 Store sales slip body into ERP.
            if(errFromCOPTH) {
                throw {err: errFromCOPTH, __line, errorValue: 'd.1.6', message: `Fail to insert sales slip body where miscellaneousCost=${miscellaneousCost}`};
            }
            miscellaneousCosts.priceWithTax += round(round(miscellaneousCost.cost)/1.05); // 金額扣除稅加總
            miscellaneousCosts.TH003 += 1;
        }
    } catch({err, __line, errorValue, message}) {
        return await errorHandler({ message, err, __line, ifContinueSync: true, miscellaneousCosts, errorValue });
    }
    developLog(`Insert success in COPTH001+TH002=${miscellaneousCosts.TH001+miscellaneousCosts.TH002}`);
    miscellaneousCosts.TH035 = Math.max(...costArr);
    miscellaneousCosts.next = 'd.2';
    // d.2 Update COPTG .
    return miscellaneousCosts;
}

async function updateMiscellaneousCostToCOPTG(miscellaneousCosts) { // d.2
    try {
        for(miscellaneousCost of miscellaneousCosts) {
            try {
                var previousPrice = await salesSlip.updateSalesSlipHead(round(miscellaneousCost.cost), miscellaneousCosts.TH001, miscellaneousCosts.TH002, 
                miscellaneousCosts.transaction, miscellaneousCosts.dbConn);
                // d.2.1 Update price and amount in corresponding sales slip head, and get total price.
            } catch(err) {
                throw { message: `Fail to update price and amount in corresponding sales slip head`, err, __line, errorValue : 'd.2.1' };
            }
            if(!previousPrice[0]) {
                throw { message: `Fail to get previous price in corresponding sales slip head`, __line, errorValue : 'd.2.1' };
            }
            const fixedSalesSlipIncome = (previousPrice[0]['TG025']-previousPrice[0]['TG013']*0.05+round(miscellaneousCost.cost))/1.05;
            miscellaneousCosts.salesSlipDate = previousPrice[0]['TG003'];
            miscellaneousCosts.relClosedate = previousPrice[0]['TG003'].slice(0,4)+'/'+previousPrice[0]['TG003'].slice(4,6)+'/'+previousPrice[0]['TG003'].slice(6,8); 
            miscellaneousCosts.relClosedateReplaceAll = miscellaneousCosts.relClosedate.replaceAll('/', '');
            miscellaneousCosts.incomeMonth = miscellaneousCosts.relClosedate.split('/')[1];
            miscellaneousCosts.incomeYear = miscellaneousCosts.relClosedate.split('/')[0];
            const leftIncome =  round(round(miscellaneousCost.cost)/1.05) - round(fixedSalesSlipIncome);
            if(leftIncome != 0) {
                const errFromCOPTH = await salesSlip.fixMultiRound(miscellaneousCosts.TH001, miscellaneousCosts.TH002, miscellaneousCosts.TH035, leftIncome, 
                miscellaneousCosts.transaction, miscellaneousCosts.dbConn);
                // d.2.2 Fix mutliple round in sales slip body with highest price.
                if(errFromCOPTH) {
                    throw { message: `Fail to fix multi round leftIncome=${leftIncome}`, __line, errorValue : 'd.2.2', err: errFromCOPTH };
                }
                miscellaneousCosts.TH035 -= leftIncome;
            }
        }
    } catch({err, __line, message, errorValue}) {
        return await errorHandler({ message, err, __line, ifContinueSync: true, miscellaneousCosts, errorValue });
    }
    developLog(`Update success in price and amount where COPTG.CFIELD01=${miscellaneousCosts.TH001+miscellaneousCosts.TH002}`);
    miscellaneousCosts.next = 'd.3';
    // d.3 Create COPMB
    return miscellaneousCosts;
}

async function insertMiscellaneousCostToCOPMB(miscellaneousCosts) { // d.3
    try {
        for(miscellaneousCost of miscellaneousCosts) {
        // d.3.1 Store miscellaneous costs into COPMB.
            const errFromCOPMB = await cost.insertOrderToCOPMB(new MiscellaneousCostToCOPMB(miscellaneousCost, miscellaneousCosts));
            if(errFromCOPMB) {
                throw { errorValue: 'd.3.1', message: `Fail to insert miscellaneous cost to COPMB`, __line, err: errFromCOPMB };
            }
        }
    } catch({err, __line, errorValue, message}) {
        return await errorHandler({ message, err, __line, ifContinueSync: true, miscellaneousCosts, errorValue });
    }
    developLog(`Insert success in COPMB001=${miscellaneousCosts.TH030}`);
    miscellaneousCosts.next = 'd.4';
    // d.4 Create INVLD
    return miscellaneousCosts;
}

async function insertMiscellaneousCostToINVLD(miscellaneousCosts) { // d.4
    try {
        for(miscellaneousCost of miscellaneousCosts) {
            const errFromINVLD = await projectManage.insertSalesSlipToINVLD(new MiscellaneousCostToINVLD(miscellaneousCost, miscellaneousCosts));
            // d.4.1 Store miscellaneous costs into INVLD.
            if(errFromINVLD) {
                throw { errorValue: 'd.4.1', message: `Fail to insert miscellaneous cost to COPMB`, __line, err: errFromCOPMB };
            }
        }
    } catch({err, __line, errorValue, message}) {
        return await errorHandler({ message, err, __line, ifContinueSync: true, miscellaneousCosts, errorValue });
    }
    developLog(`Insert success in INVLD006=${miscellaneousCosts.TH002}`);
    // miscellaneousCosts.next = 'b.7-1'; // 2024-04-18 停用過帳功能 'b.7-1' => return { 'next': caseDoneFromRm100.start, 'start': caseDoneFromRm100.start, 'try': caseDoneFromRm100.try }; 
    // d.5 Update AJSTA.
    return { 'next': caseDoneFromRm100.start, 'start': caseDoneFromRm100.start, 'try': caseDoneFromRm100.try }; 
}

async function millisTill23(hours, mins, attempt) {
    var millisTill23 = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), hours, mins, 0, 0) - new Date();
    developLog(`Timer now set to ${('0' + hours).slice(-2)}:${('0' + mins).slice(-2)}`);
    savelog(`Date: ${currentTime.getFullYear()}/${currentTime.getMonthTwoDegits()}/${currentTime.getDateTwoDegits()}: Timer now set to ${('0' + hours).slice(-2)}:${('0' + mins).slice(-2)}. Encounter ${attempt} error.`);
    toLinelog(`Date: ${currentTime.getFullYear()}/${currentTime.getMonthTwoDegits()}/${currentTime.getDateTwoDegits()}: Timer now set to ${('0' + hours).slice(-2)}:${('0' + mins).slice(-2)}. Encounter ${attempt} error.`);

    if (millisTill23 < 0) { // it's after 23, try 23 tomorrow.
         millisTill23 += 24*60*60*1000; 
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            developLog(`Now is ${('0' + hours).slice(-2)}:${('0' + mins).slice(-2)}, today's syncing start in 5 second.`);
            resolve(5000);
        }, millisTill23)
    });
}

async function main(fuctionToCall) {
    const dataFromPrevoius = await fuctionToCall;
    if(!dataFromPrevoius) return false;
    // if no data from previous step, stop.
    switch(dataFromPrevoius.next) {
        case '0':
            const resultFromClock = await millisTill23(23, 0, dataFromPrevoius.try);
            if(resultFromClock) {
                return setTimeout(() => {
                    main({ 'next': dataFromPrevoius.start, 'start': dataFromPrevoius.start, 'try': 0 });
                }, resultFromClock); // Timer for every 11p.m.
            }
            return false;
        case 'a.1-1':
            return setTimeout(() => main(insertCaseToINVMB(cases.getCaseFromRm100Flag1(1), dataFromPrevoius)), syncInterval);
        case 'a.1-2':
            return setTimeout(() => main(insertCaseToINVMB(cases.getCaseFromRm100Flag2(1), dataFromPrevoius)), syncInterval);
        case 'a.1-3':
            return setTimeout(() => main(insertCaseToINVMB(cases.getCaseFromRm100Heat(1), dataFromPrevoius)), syncInterval);
        case 'a.2':
            return main(insertOrderBody(dataFromPrevoius));
        case 'a.3-1':
            return main(updateOrderHead(dataFromPrevoius));
        case 'a.3-2':
            return main(insertOrderHead(dataFromPrevoius));
        case 'a.4':
            return main(insertOrderBodyToCOPMB(dataFromPrevoius));
        case 'b.1-1':
            return setTimeout(() => main(updateOrderBodyToDone(salesSlip.getCaseDoneFromRm100Flag1(), dataFromPrevoius)), syncInterval);
        case 'b.1-2':
            return setTimeout(() => main(updateOrderBodyToDone(salesSlip.getCaseDoneFromRm100Flag3(), dataFromPrevoius)), syncInterval);
        case 'b.1-3':
            return setTimeout(() => main(updateOrderBodyToDone(salesSlip.getCaseDoneFromRm100Type3(), dataFromPrevoius)), syncInterval);
        case 'b.2':
            return main(insertSalesSlipBody(dataFromPrevoius));
        case 'b.3-1':
            return main(updateSalesSlipHead(dataFromPrevoius));
        case 'b.3-2':
            return main(insertSalesSlipHead(dataFromPrevoius));
        case 'b.4':
            return main(updateSalesSlipBodyToCOPMB(dataFromPrevoius));
        case 'b.5':
            return main(insertSalesSlipToINVLD(dataFromPrevoius));
        case 'b.6':
            return main(insertSalesSlipBodyToAJSLA(dataFromPrevoius));
        case 'b.7-1':
            return main(updateSalesSlipBodyToAJSTA(dataFromPrevoius));
        case 'b.7-2':
            return main(insertSalesSlipHeadToAJSTA(dataFromPrevoius));
        case 'b.8-1':
            return main(updateSalesSlipBodyToAJSTB(dataFromPrevoius));
        case 'b.8-2':
            return main(insertSalesSlipHeadToAJSTB(dataFromPrevoius));
        case 'b.9-1':
            return main(updateSalesSlipBodyToACTTA(dataFromPrevoius));
        case 'b.9-2':
            return main(insertSalesSlipHeadToACTTA(dataFromPrevoius));
        case 'b.10-1':
            return main(updateSalesSlipBodyToACTTB(dataFromPrevoius));
        case 'b.10-2':
            return main(insertSalesSlipHeadToACTTB(dataFromPrevoius));
        case 'b.11-1':
            return main(updateSalesSlipBodyToACTML(dataFromPrevoius));
        case 'b.11-2':
            return main(insertSalesSlipHeadToACTML(dataFromPrevoius));
        case 'b.12-1':
            return main(updateSalesSlipBodyToACTMN(dataFromPrevoius));
        case 'b.12-2':
            return main(insertSalesSlipHeadToACTMN(dataFromPrevoius));
        case 'b.13-1':
            return main(updateSalesSlipBodyToACTMM(dataFromPrevoius));
        case 'b.13-2':
            return main(insertSalesSlipHeadToACTMM(dataFromPrevoius));
        case 'b.13-3':
            return main(updateSalesSlipHeadToACTMM(dataFromPrevoius));
        case 'b.14-1':
            return main(updateSalesSlipBodyToACTMB(dataFromPrevoius));
        case 'b.14-2':
            return main(insertSalesSlipHeadToACTMB(dataFromPrevoius)); 
        case 'b.14-3':
            return main(updateSalesSlipHeadToACTMB(dataFromPrevoius));
        case 'b.15-1':
            return main(updateSalesSlipToACTMD(dataFromPrevoius));
        case 'b.15-2':
            return main(insertSalesSlipHeadToACTMD(dataFromPrevoius));
        case 'd.0':
            return main(initializetWaitingTable(dataFromPrevoius));
        case 'd.1':
            return setTimeout(() => main(insertMiscellaneousCostToCOPTH(dataFromPrevoius)), 5000);
        case 'd.2':
            return main(updateMiscellaneousCostToCOPTG(dataFromPrevoius));
        case 'd.3':
            return main(insertMiscellaneousCostToCOPMB(dataFromPrevoius));
        case 'd.4':
            return main(insertMiscellaneousCostToINVLD(dataFromPrevoius));
    }
}

main({ 'next':'a.1-1', 'start':'a.1-1', 'try': 0 }); // Start from a.1-1 syncing case from rm100 to INVMB.
// main({ 'next':'d.0', 'start':'d.0', 'try': 0 }); // Start from initialize waiting table.
// main({ 'next':'0', 'start':'d.0', 'try': 0 }); // Start waiting till 23:00.
// start of sync function

async function deleteOrderFromAPI(caseNo, cType1NO) {
    // n Update case from API where MB009 = caseNo.
    try {
        var { result: iNVMB001 , transaction, dbConn } = await cases.updateINVMB003(caseNo, cType1NO);
        // n.1 Update INVMB MB003.
        // Start of transaction.
    } catch(err) {
        errorHandler({ message: `Failed in updating ERP.INVMB.MB003 value to ${cType1NO} where MB009=${caseNo}`, __line, err });
        return `Unexpected error occur: ${err}`;
    }
    if(!iNVMB001[0]) {
        return `Can't find case where CaseNo=${caseNo}`;
    }
    try {
        var orderEstimateIncome = await clientCasePriceHead.deleteCOPMBfromOrder(iNVMB001[0]['MB001'], transaction, dbConn);
        // n.2 Delete COPMB.
    } catch(err) {
        errorHandler({ message: `Failed in delete COPMB where COPMB.MB002=${iNVMB001[0]['MB001']}`, __line, err });
        return `Unexpected error occur: ${err}`;
    }
    if(!orderEstimateIncome[0]) {
        return `Can't find COPMB where COPMB.MB002=${iNVMB001[0]['MB001']}`
    }
    try {
        var orderHeadInfo = await order.deleteOrderbody(iNVMB001[0]['MB001'], transaction, dbConn);
        // n.3 Delete COPTD.
    } catch(err) {
        errorHandler({ message: `Failed in delete COPTD where COPTD.TD004=${iNVMB001[0]['MB001']}`, __line, err });
        return `Unexpected error occur: ${err}`
    }
    if(!orderHeadInfo[0]) {
        return `Can't find COPTD where COPTD.TD004=${iNVMB001[0]['MB001']}`
    }
    try {
        await order.removeOrderHeadPrice(orderEstimateIncome[0]['MB008'], orderHeadInfo[0]['TD001'], orderHeadInfo[0]['TD002'], transaction, dbConn);
        // n.4 Update price in COPTC.
        // End of transaction.
    } catch(err) {
        errorHandler({ message: `Failed in update price to COPTC where COPTC.TC001+TC002=${orderHeadInfo[0]['TD001']+orderHeadInfo[0]['TD002']}`, __line, err });
        return `Unexpected error occur: ${err}`;
    }
    return `Success, 4 table modified.`;
}

app.put('/ERP/rm100/:CaseNo', async(req, res) => {
    const caseNo = req.params.CaseNo;
    if(!caseNo) {
        // check if caseNo is provided.
        res.json('Sorry, please provide CaseNo, try again.');
    }
    if(!(caseNo.length <= 14 && caseNo.length >= 11)) {
        // check if query strings length fall between 11 and 14.
        res.json('Sorry, wrong CaseNo length, try again.');
    }
    if(req.body.CType1NO) {
        // n Update case where MB009 = caseNo.
        if(req.body.CType1NO.length > 11) {
            // Check CType1NO length.
            res.json('Sorry, CType1NO length exceed 11.');
        }
        const resultFromDeleteOrder = await deleteOrderFromAPI(caseNo, req.body.CType1NO);
        res.json(resultFromDeleteOrder);
    }

    res.json('抽單請提供CType1NO。'); // ，更改銷貨單金額請提供actualPrice與dTeam_succ
});