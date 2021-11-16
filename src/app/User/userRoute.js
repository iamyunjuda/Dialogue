const user = require("./userController");
const jwtMiddleware = require("../../../config/jwtMiddleware");
module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 유저 생성 (회원가입) API
    app.post('/app/users', user.postUsers);

    // 2. 로그인
    // 로그인 하기 API (JWT 생성)
    app.post('/app/login', user.login);


    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers);


    //회원 삭제
    app.patch('/app/users/:userId/states?status=', jwtMiddleware, user.patchUsersStatus);

        // 현재 비밀번호 체크하기
    app.get('/app/users/:userId/password', jwtMiddleware, user.getUserPassword)


};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API