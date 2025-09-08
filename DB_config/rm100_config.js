// Config of rm100 database

const rm100Config = {
    user: 'rm',
    password: 'rm',
    server: '192.168.8.214', // You can also use IP address, it add port automatically
    database: 'rm100',
    options: {
        trustServerCertificate: true,
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1',
            ciphers: 'DEFAULT@SECLEVEL=0'
        }
    }
};

module.exports = rm100Config;