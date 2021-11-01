const jwtMiddleware = require("../../../config/jwtMiddleware");
const scheduleProvider = require("../../app/Schedule/scheduleProvider");
const scheduleService = require("../../app/Schedule/scheduleService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const userProvider = require("../../app/User/userProvider");


/**
 * API No. 5
 * API Name : 나의 스케줄 추가
 * [POST] /app/useIds/:userId/schedules
 */
exports.postSchedule = async function (req, res) {

    /**
     * body : userId, activatedTime, activatedDay, openTo(1-팀원, 2 나만), nameOpenTo,
     *
     */
    const {userId, activatedTime, activatedDay, openTo, nameOpenTo} = req.body;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (!activatedTime) return res.send(errResponse(baseResponse.SCHEDULE_ACTIVATEDTIME_EMPTY));
    if (!activatedDay) return res.send(errResponse(baseResponse.SCHEDULE_ACTIVATEDAY_EMPTY));

    const scheduleAdd = await scheduleService.retrieveSchedulePost(
        {userId, activatedTime, activatedDay, openTo, nameOpenTo}
    );
    return res.send(response(baseResponse.SUCCESS, scheduleAdd));
};

