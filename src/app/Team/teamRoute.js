const user = require("./teamController");
const jwtMiddleware = require("../../../config/jwtMiddleware");
const team = require("./teamController");
module.exports = function(app){
    const team = require('./teamController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    // app.get('/app/test', user.getTest)


    //16. 팀 만들기
    app.post('/app/userIds/:userId/teams',jwtMiddleware,team.postTeam);

    //17. 팀에 친구 추가하기
   app.post('/app/userIds/:userId/teams/members',jwtMiddleware,team.postTeamMembers);

    //18. 팀 목록 불러오기
    app.get('/app/userIds/:userId/teams',jwtMiddleware,team.getTeam);


    //24. 팀에 속한 팀 멤버 목록 불러오기
    app.get('/app/userIds/:userId/teams/members',jwtMiddleware,team.getTeamMembers)

    //25.팀 이름, 날짜 수정하기
    app.patch('/app/userIds/:userId/teams',jwtMiddleware,team.patchTeam);

    //26.팀 멤버 삭제 하기
    app.patch('/app/userIds/:userId/teams/members',jwtMiddleware,team.patchTeamMembers);

    //27.팀 삭제
    app.patch('/app/userIds/:userId/teams/status',jwtMiddleware,team.patchTeamStatus);




};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API