const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const teamDao = require("./teamDao");


// Provider: Read 비즈니스 로직 처리


exports.userCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkUserResult = await teamDao.selectUserCheck(
      connection,
      userId
  );

  connection.release();
  return checkUserResult.count;
};
exports.checkTeamIdExist = async function (teamId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkTeamIdExistResult = await teamDao.checkTeamIdExist(
      connection, teamId
  );

  connection.release();
  return checkTeamIdExistResult;
};
exports.checkTeamId = async function (teamScheduleId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkTeamIdExistResult = await teamDao.checkTeamId(
      connection, teamScheduleId
  );

  connection.release();
  return checkTeamIdExistResult;
};

