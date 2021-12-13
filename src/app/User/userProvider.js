const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");
const crypto = require("crypto");
const {errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function (email) {
  if (!email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserEmail(connection, email);
    connection.release();

    return userListResult;
  }
};

exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userId);

  connection.release();

  return userResult[0];
};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};
exports.getUserName = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getUserNameResult = await userDao.selectUserName(connection, userId);
  connection.release();
  console.log(getUserNameResult,getUserNameResult,"g");
  return getUserNameResult;
};


exports.userIdCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userIdCheckResult = await userDao.selectUserId(connection, userId);
  connection.release();

  return userIdCheckResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      selectUserPasswordParams
  );
  connection.release();
  console.log(passwordCheckResult,"asfdadsf");
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);

  connection.release();

  return userAccountResult;
};
exports.updateUserStateInfo = async function (userId, status) {
  const connection = await pool.getConnection(async (conn) => conn);
  const params = [ status,userId];
  const updateUserAccountStatusResult = await userDao.updateUserAccountStatus(connection, params);
  connection.release();

  return updateUserAccountStatusResult;
};


exports.getUserPassword = async function (userId,password) {
  const connection = await pool.getConnection(async (conn) => conn);

  const hashedPassword = await crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");
  console.log(userId);
  const params = [userId, hashedPassword];
  console.log(hashedPassword);
  console.log(password);

  const getUserPasswordResult = await userDao.getUserPasswordCheck(connection, params);
  console.log(getUserPasswordResult[0].count,"eee");

  if(getUserPasswordResult[0].count != 1){
    connection.release();
    return errResponse(baseResponse.PASSWORD_NOT_MATCH);
  }


  connection.release();

  return errResponse(baseResponse.SUCCESS);
};


