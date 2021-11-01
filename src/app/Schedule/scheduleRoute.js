const schedule = require("./scheduleController");
module.exports = function(app){
    const schedule = require('./scheduleController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // 7. 나의 스케줄 추가 API
    app.post('/app/useIds/:userId/schedules',jwtMiddleware,schedule.postSchedule);

    // 8. 나의 스케줄 조회 API
    app.get('/app/useIds/:userId/schedules',jwtMiddleware, schedule.postSchedule);

};

