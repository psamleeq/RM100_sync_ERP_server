// Aware:
// 1. Dont input serialNo or cType1No or succ or dTeam before insertERP synced table.
// 2. dTeam.length = 2
// 3. To continue sync, provide caseFromRm100 or caseDoneFromRm100 or miscellaneousCosts to update errorControl in table.
// 4. To continue sync, provide dataFromPrevoius to start from beginning of workflow.
// 5. Parameter err, means any err/message that is not expected.
// Definition of error value:
// 0: Without any error, case goes into ERP database successfully.
// 1: Case is recognize, with no error, but no need to get into ERP database.
const { Case } = require('../models/case.js');
const savelog = require('./save_log.js');
const { SalesSlip } = require('../models/sales_slip.js');
const { MiscellaneousCost } = require('../models/miscellaneous_cost.js');
const { request } = require('urllib');
const cost = new MiscellaneousCost(); 
const cases = new Case();
const salesSlip = new SalesSlip();
const mode = process.env.MODE;
const attempt = Number(process.env.ATTEMPT) || 2;
const { lineBotIP } = mode === 'PRODUCTION' ? require('../DB_config/production_config.js') : mode === 'DEVELOP' ? require('../DB_config/develop_config.js') : undefined;

function developLog(message) {
    // only available in develop mode. 
    console.log(message);
}

if(mode === 'PRODUCTION') {
    developLog = function() {
        // disable any develop log.
    }
}

async function errorHandler({ caseFromRm100, caseDoneFromRm100, errorValue, message, __line, err, ifContinueSync = false, dataFromPrevoius, miscellaneousCosts }) {
    const dataObject = dataFromPrevoius||caseFromRm100||caseDoneFromRm100||miscellaneousCosts;
    if(dataObject) {
        dataObject.dbConn = '';
        dataObject.transaction = '';
    }
    // errorValue depend on server workflow number, maxlength = 10.
    if(!message || !__line) {
        // Check if line and message is provided
        developLog('Please provide line & message in errorHandler.');
        savelog('Please provide line & message in errorHandler.');
        return false;
    };
    if(errorValue) {
        // Check if errorValue is provided
        if(errorValue > 10) {
            // If errorValue provided check length
            developLog(`Error in line ${__line}: ErrorValue length excecced 10.`);
            savelog(`Error in line ${__line}: ErrorValue length excecced 10.`);
            return false;
        }
        if(errorValue.slice(0,1) !== 'a' && errorValue.slice(0,1) !== 'b' && errorValue.slice(0,1) !== 'c' && errorValue.slice(0,1) !== 'd') {
            // If errorValue provided check first character
            developLog(`Error in line ${__line}: ErrorValue can only start with a, b, c, and d.`);
            savelog(`Error in line ${__line}: ErrorValue can only start with a, b, c, and d.`);
            return false;
        }
    }
    if(err) {
        developLog(`Error in line ${__line}, ${message}: ${err}`);
        savelog(`Error in line ${__line}, ${message}: ${err}`);
    } else {
        developLog(`Error in line ${__line}: ${message}`);
        savelog(`Error in line ${__line}: ${message}`);
    }
    if(!dataObject) {
        return false;
    }
    if(dataObject.start.slice(0,1)==='a' && errorValue) {
    // Record case errorValue into synced table.
        developLog(`caseFromRm100=${JSON.stringify(dataObject)}`)
        savelog(`caseFromRm100=${JSON.stringify(dataObject)}`);
        if(!(dataObject.SerialNo && dataObject.CType1NO)) {
            // Check all input from caseFromRm100
            developLog(`Error in errorhandler: caseFromRm100 missing parameter to update synced table.`);
            savelog(`Error in errorhandler: caseFromRm100 missing parameter to update synced table.`);
            return false;
        }
        const errFromINVMB = await cases.updateERPINVMBsynced(dataObject.SerialNo, dataObject.CType1NO, errorValue);
        // Update errorValue in INVMBsynced table.
        if(errFromINVMB) {
            developLog(`Error in errorHandler: Fail to update case to sync table, stop syncing case, ${errFromINVMB}`);
            savelog(`Error in errorHandler: Fail to update case to sync table, stop syncing case, ${errFromINVMB}`);
            return false;
        }
        developLog(`Change serialNo = '${dataObject.SerialNo + dataObject.CType1NO}', errorControl to '${errorValue}' successfully`);
        savelog(`Change serialNo = '${dataObject.SerialNo + dataObject.CType1NO}', errorControl to '${errorValue}' successfully`);
        if(err) {
            if('string' === typeof err && err.toString().includes('5000ms')) {
                process.exit(0);
            }
            if('object' === typeof err && JSON.stringify(err).includes('duplicate')) {
                developLog(`Error include duplicate stop syncing.`);
                savelog(`Error include duplicate stop syncing.`);
                return false;
            }
        }
        if(ifContinueSync && dataObject.try < attempt) {
            dataObject.try += 1;
            return { 'next': dataObject.start, 'start': dataObject.start, 'try': dataObject.try };
        }
        if(dataObject.try >= attempt) {
            developLog(`Sorry try=${dataObject.try}, out of attempt, stop syncing`);
            savelog(`Sorry try=${dataObject.try}, out of attempt, stop syncing`);
        }
        return false;
    }
    if(dataObject.start.slice(0,1) === 'b' && errorValue) {
    // Record caseDone errorValue into synced table.
        developLog(`caseDoneFromRm100=${JSON.stringify(dataObject)}`)
        savelog(`caseDoneFromRm100=${JSON.stringify(dataObject)}`);
        if(!(dataObject.SerialNo && dataObject.dTeam && dataObject.succ)) {
            // Check all input from caseDoneFromRm100
            developLog(`Error in line ${__line}: Missing parameter to update synced table.`);
            savelog(`Error in line ${__line}: Missing parameter to update synced table.`);
            return false;
        }
        const errFromCOPTG = await salesSlip.updateERPCOPTGsynced(dataObject.SerialNo, dataObject.dTeam, errorValue, dataObject.succ);
        if(errFromCOPTG) {
            developLog(`Error in errorHandler: Fail to update case done to sync table, stop syncing case, ${errFromCOPTG}`);
            savelog(`Error in errorHandler: Fail to update case done to sync table, stop syncing case, ${errFromCOPTG}`);
            return false;
        }
        developLog(`Change serialNo = '${dataObject.SerialNo + '_' + dataObject.dTeam + '_' + dataObject.succ}', errorControl to '${errorValue}' successfully`);
        savelog(`Change serialNo = '${dataObject.SerialNo + '_' + dataObject.dTeam + '_' + dataObject.succ}', errorControl to '${errorValue}' successfully`);
        if(err) {
            if('string' === typeof err && err.toString().includes('5000ms')) {
                process.exit(0);
            }
            if('object' === typeof err && JSON.stringify(err).includes('duplicate')) {
                developLog(`Error include duplicate stop syncing.`);
                savelog(`Error include duplicate stop syncing.`);
                return false;
            }
        }
        if(ifContinueSync && dataObject.try < attempt) {
            dataObject.try += 1;
            return { 'next': dataObject.start, 'start': dataObject.start, 'try': dataObject.try };
        }
        if(dataObject.try >= attempt) {
            developLog(`Sorry try=${dataObject.try}, out of attempt, stop syncing`);
            savelog(`Sorry try=${dataObject.try}, out of attempt, stop syncing`);
        }
        return false;
    }
    if(dataObject.start.slice(0,1) === 'd' && errorValue) {
    // Record costs errorValue into waiting table.
    
        let objectToLog = {};
        // Copy value and key into new object to save into log.
        for (const [key, value] of Object.entries(dataObject)) {
            if(typeof(value) == 'object') {
                objectToLog[value.item] = value.cost;
            } else {
                objectToLog[key] = value;
            }
        }
        savelog(`miscellaneousCosts=${JSON.stringify(objectToLog)}`);

        if(!dataObject.dTeam_succ) {
            // Check all input from miscellaneousCosts
            developLog(`Error in line ${__line}: Missing parameter to update waiting.`);
            savelog(`Error in line ${__line}: Missing parameter to update waiting.`);
            return false;
        }
        const errFromWaiting = await cost.updateERPmiscellaneousCostWaiting(dataObject.dTeam_succ, errorValue);
        if(errFromWaiting) {
            developLog(`Error in errorHandler: Fail to update waiting table, stop syncing, ${errFromWaiting}`);
            savelog(`Error in errorHandler: Fail to update waiting table, stop syncing, ${errFromWaiting}`);
            return false;
        }
        developLog(`Change serialNo = '${dataObject.dTeam_succ}', errorControl to '${errorValue}' successfully`);
        savelog(`Change serialNo = '${dataObject.dTeam_succ}', errorControl to '${errorValue}' successfully`);
        if(err) {
            if('string' === typeof err && err.toString().includes('5000ms')) {
                process.exit(0);
            }
            if('object' === typeof err && JSON.stringify(err).includes('duplicate')) {
                developLog(`Error include duplicate stop syncing.`);
                savelog(`Error include duplicate stop syncing.`);
                return false;
            } 
        }

        if(ifContinueSync && dataObject.try < attempt) {
            dataObject.try += 1;
            return { 'next': dataObject.start, 'start': dataObject.start, 'try': dataObject.try };
        }
        if(dataObject.try >= attempt) {
            developLog(`Sorry try=${dataObject.try}, out of attempt, stop syncing.`);
            savelog(`Sorry try=${dataObject.try}, out of attempt,stop syncing.`);
        }
        return false;
    }
    if(err) {
        if('string' === typeof err && err.toString().includes('5000ms')) {
            // if request time out
            process.exit(0);
        }
        if('object' === typeof err && JSON.stringify(err).includes('duplicate')) {
            developLog(`Error include duplicate stop syncing.`);
            savelog(`Error include duplicate stop syncing.`);
            return false;
        }
    }
    if(ifContinueSync && dataObject.try < attempt) {
        dataObject.try += 1;
        return dataObject;
    }
    if(dataObject.try >= attempt) {
        developLog(`Sorry try=${dataObject.try}, out of attempt, stop syncing.`);
        savelog(`Sorry try=${dataObject.try}, out of attempt,stop syncing.`)
    }
    return false;
}

async function sendErrorMessageToLine(message) {
    // line bot is shut down now 2024/04/18
    if(mode !== 'PRODUCTION') throw new Error(`Sorry can't send error message to line bot, it's only available in production mode.`);
    return await request(lineBotIP+':1027/rm100_sync_ERP_server_error', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        content: JSON.stringify({
            'secret': '$2b$10$PVs4nv',
            message,
        }),
    }).then(({ data, res }) => {
        return { message: data.toString(), status: res.status };
    }).catch((err) => {
        developLog(`Fail to send message to line bot, stop syncing`, err);
        savelog(`Fail to send message to line bot, stop syncing`, err);
        return { message: `Fail to send message to line bot, stop syncing: ${err}`, status: '404' };
    })
}

module.exports = { errorHandler, sendErrorMessageToLine }