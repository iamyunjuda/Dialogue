const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
// exports.getTest = async function (req, res) {
//     return res.send(response(baseResponse.SUCCESS))
// }

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, nickname
     */
    const {userEmail, userPassword, userName, userId} = req.body;

    // 빈 값 체크
    if (!userEmail)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    if (!userPassword)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if (!userName)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));
    if (!userId)
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    // 길이 체크
    if (userEmail.length > 50)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
    if (userPassword.length > 20)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    if (userId.length > 15)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));
    if (userName.length > 15)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));
    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(userEmail))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 기타 등등 - 추가하기

    console.log(userId);
    const signUpResponse = await userService.createUser(
        userEmail, userPassword, userName,userId
    );





    return res.send(signUpResponse);
};

// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 2
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {userEmail, userPassword} = req.body;

    if (!userEmail)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    if (!userPassword)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (userEmail.length > 50)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
    if (userPassword.length > 20)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(userEmail))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));


    const signInResponse = await userService.postSignIn(userEmail, userPassword);


    //req.session.save(function(){
      //  res.redirect('/');
    //});

    return res.send(signInResponse);
};
/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};





/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};


/**
 * API No. 22
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const {userName, userPassword} = req.body;
    if (!userPassword)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if (!userName)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));
    if (userPassword.length > 20)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    if (userName.length > 15)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));


    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!userName) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, userName, userPassword)
        return res.send(editUserInfo);
    }
};


/**
 * API No. 5
 * API Name : 회원 상태 바꾸기
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsersStatus = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const {status} = req.query;



    //WITHDRAWAL, UNACTIVATED
    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    } else {
        if (!status) return res.send(errResponse(baseResponse.USER_STATUS_EMPTY));

        const editUserInfo = await userService.editUserState(userId, status)
        return res.send(editUserInfo);
    }
};



/**
 * API No. 5
 * API Name : 회원 상태 바꾸기
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.getUserPassword = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    const {password} = req.query;
    //WITHDRAWAL, UNACTIVATED
    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!password){

        return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));
    }

    const getUserPassword = await userProvider.getUserPassword(userId,password);

    console.log(getUserPassword,"ee11");

    //if(getUserPassword[0].count ==1){
      //  const hello ={};
        //hello.result ="correct";
        //return res.send(hello);


    //}
    //else{
      //  const hello ={};
        //hello.result ="wrong";
        //return res.send(hello);


    //}
    return res.send(getUserPassword);


};
exports.alreadyLogin = async function (req, res) {


    return res.send(response(baseResponse.LOGIN_ALREADY_DONE));
};
exports.notLogin = async function (req, res) {


    return res.send(response(baseResponse.LOGIN_NOT_DONE));
};

exports.loggedOut = async function (req, res) {


    return res.send(response(baseResponse.LOGGED_OUT));
};
exports.loggedIn = async function (req, res) {


    return res.send(response(baseResponse.LOGGED_IN));
};







/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
