const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const scheduleDao = require("./scheduleDao");


// Provider: Read 비즈니스 로직 처리
exports.scheduleCheck = async function (checkScheduleParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkScheduleResult = await scheduleDao.selectScheduleCheck(
        connection,
        checkScheduleParams
    );

    connection.release();

    return checkScheduleResult;
};
exports.getScheduleExist = async function (userId,courseDay) {
    const connection = await pool.getConnection(async (conn) => conn);
    const params =[userId, courseDay]
    const getScheduleCheckResult = await scheduleDao.getScheduleCheck(
        connection,
        params
    );


    return getScheduleCheckResult;
};

exports.userCheck = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserResult = await scheduleDao.selectUserCheck(
        connection,
        userId
    );

    connection.release();
    return checkUserResult.count;
};
