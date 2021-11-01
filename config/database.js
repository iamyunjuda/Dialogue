const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'ssacdb.chcwlyzqnyjd.ap-northeast-2.rds.amazonaws.com',
    user: 'senya',
    port: '3306',
    password: '6736dbswn!',
    database: 'Dialogue'
});

module.exports = {
    pool: pool
};