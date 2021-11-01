const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const scheduleProvider = require("./scheduleProvider");
const scheduleDao = require("./scheduleDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
const userProvider = require("./userProvider");
const userDao = require("./userDao");

// Service: Create, Update, Delete 비즈니스 로직 처리
exports.retrieveSchedulePost = async function (userId, activatedTime, activatedDay, openTo, nameOpenTo) {
    try{
        //이미 존재하는 스케줄이 있는지 학인하기
        const scheduleRows = await userProvider.scheduleCheck(userId, activatedTime);

        //있다면, 에러

        //없다면, 진행

    }
    catch (err){


    }

    // 이메일 중복 확인
    const emailRows = await userProvider.emailCheck(email);
    if (emailRows.length > 0)
        return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

    // 비밀번호 암호화
    const hashedPassword = await crypto
        .createHash("sha512")
        .update(password)
        .digest("hex");

    const insertUserInfoParams = [email, hashedPassword, nickname];

    const connection = await pool.getConnection(async (conn) => conn);

    const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
    console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
    connection.release();
    return response(baseResponse.SUCCESS);

}