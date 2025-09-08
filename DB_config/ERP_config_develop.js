// Config of ERP database
const ERPConfig = {
    user: 'sa',
    password: 'dsc@23265946',
    server: '192.168.8.239', // You can also use IP address, it add port automatically
    database: 'TEST',
    options: {
        trustServerCertificate: true
    }
};

module.exports = ERPConfig;

