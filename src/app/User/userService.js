const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
const friendProvider = require("../Friend/friendProvider");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (email, password, nickname,userId) {
    console.log(userId);
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        // 이메일 중복 확인
        await connection.beginTransaction();
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");
        const userIdCheck = await userProvider.userIdCheck(userId);
        console.log(userId);
        if (userIdCheck.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_USERID);

        const insertUserInfoParams = [email, hashedPassword, nickname,userId];

    console.log(userId);
        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)

        await connection.commit();
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        await connection.rollback();
        logger.error(`App - createUser Service error\n: ${err.message}`);
        await connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};


// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (email, password) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        await connection.beginTransaction();
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].userEmail

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

        if (passwordRows[0].userPassword !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

        if (userInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(userInfoRows[0].userId) // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].userId,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );
        await connection.commit();
        connection.release();
        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].userId, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUser = async function (userId, userName, userPassword) {

    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        const userCheckRows = await friendProvider.userCheck(userId);
        if(userCheckRows <1)return  response(baseResponse.USER_UNACTIVATED);



        const params = [userName, userPassword,userId];

        const editUserResult = await userDao.updateUserInfo(connection, params);
        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        await connection.rollback();
        connection.release();
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
exports.editUserState = async function (userId, status) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        await connection.beginTransaction();
        const userCheckRows = await friendProvider.userCheck(userId);
        if(userCheckRows <1)return  response(baseResponse.USER_UNACTIVATED);

        const editUserStateResult = await userProvider.updateUserStateInfo(userId, status)
        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        await connection.rollback();
        connection.release();
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}


