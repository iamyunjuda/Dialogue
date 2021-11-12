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
     * courseDay, changeable, isPublic(1-팀원, 0 나만), isNameHidden
     *
     */

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {startTime, endTime, courseName, courseDay,isChangeable, isPublic,isNameHidden} = req.body;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (!startTime) return res.send(errResponse(baseResponse.SCHEDULE_ACTIVATEDTIME_EMPTY));
    if(!endTime) return res.send(errResponse(baseResponse.SCHEDULE_ENDTIME_EMPTY));
    if (!courseDay) return res.send(errResponse(baseResponse.SCHEDULE_ACTIVATEDAY_EMPTY));
    if(courseDay.length > 1){
        for(var i=0;i<courseDay.length;i++){
            if(courseDay[i]>6) return res.send(errResponse(baseResponse.SCHEDULE_COURSEDAY_EXIST));

        }

    }
    //if(courseDay>6) return res.send(errResponse(baseResponse.SCHEDULE_COURSEDAY_EXIST));
    if (userIdFromJWT != userId) {
       return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
   }

    const scheduleAdd = await scheduleService.retrieveSchedulePost(
        userId, startTime, endTime, courseName, courseDay,isChangeable, isPublic,isNameHidden
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

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }

    const scheduleGet = await scheduleService.retrieveScheduleGet(
        userId);

    return res.send(scheduleGet);
};


/**
 * API No. 9
 * API Name : 나의 스케줄 수정
 * [POST] /app/useIds/:userId/schedules
 */
exports.patchSchedule = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {scheduleId, startTime, endTime, courseName, courseDay,isChangeable,  isPublic, isNameHidden} = req.body;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (!startTime) return res.send(errResponse(baseResponse.SCHEDULE_ACTIVATEDTIME_EMPTY));
    if(!endTime) return res.send(errResponse(baseResponse.SCHEDULE_ENDTIME_EMPTY));
    if (!courseDay) return res.send(errResponse(baseResponse.SCHEDULE_ACTIVATEDAY_EMPTY));

    if(courseDay>6) return res.send(errResponse(baseResponse.SCHEDULE_COURSEDAY_EXIST));
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));


    }


    const schedulePatch = await scheduleService.retrieveSchedulePatch(
        scheduleId, userId, startTime, endTime, courseName, courseDay[0],isChangeable, isPublic, isNameHidden
    );

    return res.send(schedulePatch);

}

/**
 * API No. 33
 * API Name : 나의 스케줄 삭제
 *
 */
exports.patchScheduleStatus = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const {scheduleId} = req.body;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (!scheduleId) return res.send(errResponse(baseResponse.SCHEDULE_TEAMSCHEDULEID_EMPTY));

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    }


    const scheduleStatusPatch = await scheduleService.retrieveScheduleStatusPatch(
        scheduleId, userId
    );

    return res.send(scheduleStatusPatch);

}


/**
 * API No. 19
 * API Name : 모든 스케줄 합치기
 * [GET] /app/userId/:userId/teamIds/:teamId/teamschedules
 *
 */
exports.getAllMembersSchedules = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const teamId = req.params.teamId;


    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (!teamId) return res.send(errResponse(baseResponse.TEAM_TEAMID_EMPTY));
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));


    }



    const getAllSchedules = await scheduleService.retrieveAllSchedules(
       userId, teamId
    );

    return res.send(getAllSchedules);

}

/**
 * API No.
 * API Name : 유저 스케줄 불러오기
 *
 */
exports.getUserSchedule = async function (req, res) {

    /**
     * path Variable :userId
     */

    //const userIdFromJWT = req.verifiedToken.userId;
 //   const userId = req.params.userId;
    const friendId = req.params.friendId;
    if (!friendId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const scheduleGet = await scheduleService.retrieveScheduleGet(
        friendId);

    return res.send(scheduleGet);
};

exports.getFriendSchedule = async function (req, res) {

    /**
     * path Variable :userId
     */

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const friendId = req.params.friendId;
    if (!friendId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }



    const friendScheduleGet = await scheduleService.retrieveGetFriendSchedule(
       userId, friendId);

    return res.send(friendScheduleGet);
};



/**
 * API No.
 * API Name : 팀장이 팀 일정 추가하는 기능
 *
 */
exports.postTeamSchedule = async function (req, res) {

    /**
     * path Variable :userId, startTime, endTime, courseName, courseDay,isChangeable, isPublic,isNameHidden
     */


    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId;

    const {teamId,startTime, endTime, courseName, courseDay} = req.body;

    if (!teamId) return res.send(errResponse(baseResponse.TEAM_TEAMID_EMPTY));
    if (!startTime) return res.send(errResponse(baseResponse.SCHEDULE_ACTIVATEDTIME_EMPTY));
    if(!endTime) return res.send(errResponse(baseResponse.SCHEDULE_ENDTIME_EMPTY));
    if(!courseName) return res.send(errResponse(baseResponse.SCHEDULE_COURSENAME_EMPTY));
    if (!courseDay) return res.send(errResponse(baseResponse.SCHEDULE_ACTIVATEDAY_EMPTY));
    if(courseDay.length > 0){
        for(var i=0;i<courseDay.length;i++){
            if(courseDay[i]>6) return res.send(errResponse(baseResponse.SCHEDULE_COURSEDAY_EXIST));

        }

    }


    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));


    }
    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const postTeamSchedule = await scheduleService.retrieveTeamSchedulePost(
       userId,teamId,startTime, endTime, courseName, courseDay);

    return res.send(postTeamSchedule);
};
/**
 * API No.
 * API Name : 유저의 팀 스케줄을 가져오는 API
 *
 */
exports.getTeamSchedule = async function (req, res) {

    /**
     * path Variable :userId
     */


    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId;



    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const getTeamSchedule = await scheduleService.retrieveGetTeamSchedule(
        userId);

    return res.send(getTeamSchedule);
};


//teamPatch

/**
 * API No. 9
 * API Name : 나의 스케줄 수정
 * [POST] /app/useIds/:userId/schedules
 */
exports.patchTeamScheduleName = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {teamScheduleId ,courseName} = req.body;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if(!teamScheduleId) return res.send(errResponse(baseResponse.SCHEDULE_TEAMSCHEDULEID_EMPTY));
    if(!courseName) return res.send(errResponse(baseResponse.SCHEDULE_COURSENAME_EMPTY));

    if (userIdFromJWT != userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));




    const teamSchedulePatch = await scheduleService.retrieveTeamScheduleNamePatch(
        teamScheduleId, userId, courseName
    );

    return res.send(teamSchedulePatch);

}

/**
 * API No. 9
 * API Name : 나의 스케줄 수정
 * [POST] /app/useIds/:userId/schedules
 */
exports.patchTeamScheduleTime = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {teamScheduleId ,startTime, endTime, courseDay} = req.body;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!startTime) return res.send(errResponse(baseResponse. SCHEDULE_ACTIVATEDTIME_EMPTY));
    if(!endTime)return  res.send(errResponse(baseResponse.SCHEDULE_ENDTIME_EMPTY));
    if(!teamScheduleId) return res.send(errResponse(baseResponse.SCHEDULE_TEAMSCHEDULEID_EMPTY));
    if(!courseDay)   return res.send(errResponse(baseResponse.SCHEDULE_COURSEDAY_EXIST));


    if (userIdFromJWT != userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));




    const teamSchedulePatch = await scheduleService.retrieveTeamScheduleTimePatch(
        teamScheduleId, userId, startTime, endTime,courseDay
    );

    return res.send(teamSchedulePatch);

}

/**
 * API No. 9
 * API Name : 나의 스케줄 수정
 * [patch] /app/useIds/:userId/schedules
 */
exports.patchTeamScheduleStatus = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {teamScheduleId} = req.body;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!teamScheduleId) return res.send(errResponse(baseResponse.SCHEDULE_TEAMSCHEDULEID_EMPTY));


    if (userIdFromJWT != userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));




    const teamScheduleStatusPatch = await scheduleService.retrieveTeamScheduleStatusPatch(
        teamScheduleId, userId
    );

    return res.send(teamScheduleStatusPatch);

}
