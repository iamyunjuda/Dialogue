const jwtMiddleware = require("../../../config/jwtMiddleware");
const scheduleProvider = require("../../app/Schedule/scheduleProvider");
const scheduleService = require("../../app/Schedule/scheduleService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");



/**
 * API No. 7
 * API Name : 나의 스케줄 추가
 * [POST] /app/useIds/:userId/schedules
 */
exports.postSchedule = async function (req, res) {

    /**
     * path Variable :userId
     * body : startTime, endTime, courseName,
     * courseDay, changeable, openTo(1-팀원, 2 나만), nameOpenTo,
     *
     */

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    const {startTime, endTime, courseName, courseDay,changeable, openTo,nameOpenTo} = req.body;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (!startTime) return res.send(errResponse(baseResponse.SCHEDULE_ACTIVATEDTIME_EMPTY));
    if(!endTime) return res.send(errResponse(baseResponse.SCHEDULE_ENDTIME_EMPTY));
    if (!courseDay) return res.send(errResponse(baseResponse.SCHEDULE_ACTIVATEDAY_EMPTY));
    if(courseDay>6) return res.send(errResponse(baseResponse.SCHEDULE_COURSEDAY_EXIST));
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
   }

    const scheduleAdd = await scheduleService.retrieveSchedulePost(
        userId, startTime, endTime, courseName, courseDay,changeable, openTo,nameOpenTo
    );

    return res.send(scheduleAdd);
};

/**
 * API No. 8
 * API Name : 나의 스케줄 조회
 * [POST] /app/useIds/:userId/schedules
 */
exports.getSchedule = async function (req, res) {

    /**
     * path Variable :userId
     */

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    const scheduleGet = await scheduleService.retrieveScheduleGet(
        userId);

    return res.send(scheduleGet);
};


