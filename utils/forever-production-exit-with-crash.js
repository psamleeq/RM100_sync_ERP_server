var forever = require('forever-monitor');

var child = new (forever.Monitor)('ERPsync_server.js', {
  silent: false,
  env: {'MODE': 'PRODUCTION', 'SYNC_INTERVAL': '200'}, 
});

child.on('restart', function() {
  console.error('Forever restarting script for ' + child.times + ' time');
});

child.on('exit:code', function(code) {
  console.error('Forever detected script exited with code ' + code);
  if (1 === code) child.stop(); // don't restart the script on exit(1)
});

child.start();