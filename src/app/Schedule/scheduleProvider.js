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
exports.teamScheduleCheck = async function (checkScheduleParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkScheduleResult = await scheduleDao.selectTeamScheduleCheck(
        connection,
        checkScheduleParams
    );

    connection.release();

    return checkScheduleResult;
};

exports.getScheduleExist = async function (userId,courseDay) {
    console.log("원인1");
    const connection = await pool.getConnection(async (conn) => conn);
    console.log("원인2");
    const params =[userId, courseDay];
    console.log("원인3");
    const getScheduleCheckResult = await scheduleDao.getScheduleCheck(
        connection,
        params
    );
    connection.release();
    console.log("원인4");
    return getScheduleCheckResult;
};
exports.getTeamScheduleExist = async function (userId,courseDay) {
    const connection = await pool.getConnection(async (conn) => conn);
    const params =[userId, courseDay];
    const getTeamScheduleCheckResult = await scheduleDao.getTeamScheduleCheck(
        connection,
        params
    );

    connection.release();
    return getTeamScheduleCheckResult;
};




exports.getScheduleExistForPatch = async function (scheduleId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const getScheduleCheckResult = await scheduleDao.getScheduleCheckForPatch(
        connection,
        scheduleId
    );

    connection.release();
    return getScheduleCheckResult;
};
exports.checkTheyAreFriend = async function (userId, friendId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const params =[userId, friendId];
    const checkTheyAreFriendResult = await scheduleDao.checkTheyAreFriend(
        connection,
        params
    );

    connection.release();
    return checkTheyAreFriendResult;
};

exports.getTeamScheduleExistForPatch = async function (teamScheduleId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const getTeamScheduleCheckResult = await scheduleDao.getTeamScheduleCheckForPatch(
        connection,
        teamScheduleId
    );

    connection.release();
    return getTeamScheduleCheckResult;
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

exports.getSchedule = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectUserScheduleResult = await scheduleDao.selectUserSchedule(
        connection,
        userId
    );

    connection.release();
    return selectUserScheduleResult;
};

exports.getScheduleExistList = async function (scheduleStatusId,userId,courseDay) {
    const connection = await pool.getConnection(async (conn) => conn);
    const params = [userId, courseDay, scheduleStatusId];
    const selectUserScheduleResult = await scheduleDao.selectScheduleExist(
        connection,
        params
    );

    connection.release();
    return selectUserScheduleResult;
};
exports.scheduleUpdate= async function(params) {
    const connection = await pool.getConnection(async (conn)=>conn);
    const updateScheduleInfo = await scheduleDao.updateScheduleInfo(
        connection, params
    );
    connection.release();
    return updateScheduleInfo;

};
exports.getUserRows= async function(teamId) {
    const connection = await pool.getConnection(async (conn)=>conn);
    const getTeamMembers = await scheduleDao.getTeamMembers(
        connection, teamId
    );
    connection.release();
    return getTeamMembers;

};
exports.userIdIsALeader= async function(userId,teamId) {
    const connection = await pool.getConnection(async (conn)=>conn);
    const params = [userId, teamId];
    const getTeamMembers = await scheduleDao.userIdIsALeader(
        connection, params
    );
    connection.release();
    return getTeamMembers;

};
exports.teamCheck= async function(teamId) {
    const connection = await pool.getConnection(async (conn)=>conn);

    const checkTeamStatus = await scheduleDao.getTeamStatus(
        connection, teamId
    );
    connection.release();
    return checkTeamStatus.num;

};

exports.getTeamSchedules = async function (teamId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectTeamScheduleResult = await scheduleDao.selectTeamSchedule(
        connection,
        teamId
    );

    connection.release();
    return selectTeamScheduleResult;
};

exports.getTeamSchedule = async function (teamId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectTeamScheduleResult = await scheduleDao.selectUserSchedule(
        connection,
        teamId
    );

    connection.release();
    return selectTeamScheduleResult;
};
exports.getTeamName = async function (teamId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectUserScheduleResult = await scheduleDao.selectTeamName(
        connection,
        teamId
    );

    connection.release();
    return selectUserScheduleResult;
};
exports.getTeamIdOfUser = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectTeamIdOfUserResult = await scheduleDao.selectTeamIdOfUser(
        connection,
        userId
    );

    connection.release();
    return selectTeamIdOfUserResult;
};

exports.getTeamLeaderId = async function (teamScheduleId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectTeamLeaderResult = await scheduleDao.selectTeamLeader(
        connection,
        teamScheduleId
    );

    connection.release();
    return selectTeamLeaderResult;
};

