const fs = require('fs');

function savelog(message) { 
    const log_file = fs.createWriteStream('../ERP_sync_server_log.txt', {flags : 'a'});
    // save error into file dblog
    log_file.write(message + '\n');
    
    log_file.end();

    log_file.on('error', (err) => {
        console.log('Error on savelog, err:', err);
        // Add feature: send push message to line bot
    });
};

module.exports = savelog;