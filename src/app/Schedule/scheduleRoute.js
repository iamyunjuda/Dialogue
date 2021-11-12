const schedule = require("./scheduleController");
const jwtMiddleware = require("../../../config/jwtMiddleware");
module.exports = function(app){
    const schedule = require('./scheduleController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // 7. 나의 스케줄 추가 API
    app.post('/app/userIds/:userId/schedules',jwtMiddleware,schedule.postSchedule);

    // 8. 나의 스케줄 조회 API
    app.get('/app/userIds/:userId/schedules',jwtMiddleware, schedule.getSchedule);


    //9. 나의 스케줄 수정 API
    app.patch('/app/userIds/:userId/schedules',jwtMiddleware, schedule.patchSchedule);

    // 스케줄 합치기
    app.get('/app/userIds/:userId/teamIds/:teamId/teamschedules',jwtMiddleware, schedule.getAllMembersSchedules);

    //해당 유저 스케줄 가져오기
    app.get('/app/friendIds/:friendId/schedules', schedule.getUserSchedule);

//x테스트 안해봄
    //28
    //팀장이 로그인시 팀 스케줄 추가 가능하도록(각각 멤버 시간표에 추가됨)-> 비효율적인거 같아서 팀 시간표 만듦
    app.post('/app/userIds/:userId/teamschedules',jwtMiddleware, schedule.postTeamSchedule);
//29.
    app.get('/app/userIds/:userId/teamschedules',jwtMiddleware, schedule.getTeamSchedule);

//30.
    //팀 스케줄 이름 수정
    app.patch('/app/userIds/:userId/teamschedules/names',jwtMiddleware, schedule.patchTeamScheduleName);
    //팀 스케줄 시간 요일 수정
    app.patch('/app/userIds/:userId/teamschedules/times',jwtMiddleware, schedule.patchTeamScheduleTime);
    //팀 스케줄 삭제
    app.patch('/app/userIds/:userId/teamschedules/states',jwtMiddleware, schedule.patchTeamScheduleStatus);



    //33. 나의 스케줄 삭제
    app.patch('/app/userIds/:userId/schedules/states',jwtMiddleware,schedule.patchScheduleStatus)

};

