const jwtMiddleware = require("../../../config/jwtMiddleware");
const teamProvider = require("../../app/Team/teamProvider");
const teamService = require("../../app/Team/teamService");
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
 * API No. 15
 * API Name : 팀생성하기
 * [POST] /app/userIds/:userId/teams
 */
exports.postTeam = async function (req, res) {

    /**
     * Body: teamName, dueDate,
     */


    const {teamName, dueDate,targetId} = req.body;
    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    if(!targetId)return res.send(errResponse(baseResponse.FRIENDID_EMPTY));
    // 빈 값 체크
    if (!teamName)
        return res.send(response(baseResponse.TEAM_NAME_EMPTY));
    if (!dueDate)
        return res.send(response(baseResponse.TEAM_DUEDATE_EMPTY));
    console.log(teamName.length);
    // 길이 체크
    if (teamName.length > 30)
        return res.send(response(baseResponse.TEAM_NAME_LENGTH));
 //   if (targetId.length < 2)
     //   return res.send(response(baseResponse.FRIENDID_LENGTH));
   // if (dueDate > 15)
      //  return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));
    // 형식 체크 (by 정규표현식)


    // 기타 등등 - 추가하기


    const postTeamNameResponse = await teamService.postTeamName(
        teamName, dueDate,userId,targetId
    );

    return res.send(postTeamNameResponse);
};
/**
 * API No. 16
 * API Name : 팀멤버 추가하기
 * [POST] /app/userIds/:userId/teams/members
 */
exports.postTeamMembers = async function (req, res) {

    /**
     * Body: friendId
     */
    const {teamId,targetId, memberId} = req.body;

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    if(!teamId) return res.send(errResponse(baseResponse.TEAM_TEAMID_EMPTY));

    console.log(teamId,targetId, memberId,"asf");
    if (!userId && !memberId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    // 길이 체크
    //if (targetId.length==0)
    //  return res.send(response(baseResponse.ADD_MEMBER));

    if (!memberId) {
        console.log("here");
        const postTeamNameResponse = await teamService.postTeamMembersWithTargetId(
           teamId, userId, targetId
        );
        return res.send(postTeamNameResponse);
    } else {


        const postTeamNameResponse = await teamService.postTeamMembersWithMemberId(
            teamId,userId, memberId
        );

        return res.send(postTeamNameResponse);
    }

}


exports.getTeamMemberId = async function (req, res) {

    /**
     * Body: friendId
     */
    const {memberId} = req.query;

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    if(!memberId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    // 길이 체크
    //if (targetId.length==0)
    //  return res.send(response(baseResponse.ADD_MEMBER));




    const getMemberIdResponse = await teamService.getTeamMembersIdWithMemberId(
           userId, memberId
        );

        return res.send(getMemberIdResponse);


}



/**
 * API No. 16
 * API Name : 팀멤버 목록 보기
 * [GET] /app/userIds/:userId/teams/members
 */
exports.getTeamMembers = async function (req, res) {

    /**
     * Body: friendId
     */
    const {teamId} = req.query;

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (!teamId) return res.send(errResponse(baseResponse.TEAM_TEAMID_EMPTY));
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    // 길이 체크

    const getTeamMembersResponse = await teamService.getTeamMembers(
        userId,teamId
    );

    return res.send(getTeamMembersResponse);
};




/**
 * API No. 17
 * API Name : 팀불러오기
 * [GET] /app/userIds/:userId/teams
 */
exports.getTeam = async function (req, res) {




    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }




    const getTeamListResponse = await teamService.getTeamList(
        userId
    );

    return res.send(getTeamListResponse);
};

/**
 * API No. 15
 * API Name : 팀 이름,날짜 바꾸기
 * [PATCH] /app/userIds/:userId/teams
 */
exports.patchTeam = async function (req, res) {

    /**
     * Body: teamName, dueDate,
     */


    const {teamId,teamName, dueDate} = req.body;
    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    // 빈 값 체크
    if(!teamId) return res.send(response(baseResponse.TEAM_TEAMID_EMPTY));
    if (!teamName)
        return res.send(response(baseResponse.TEAM_NAME_EMPTY));
    if (!dueDate)
        return res.send(response(baseResponse.TEAM_DUEDATE_EMPTY));

    // 길이 체크
    if (teamName.length > 30)
        return res.send(response(baseResponse.TEAM_NAME_LENGTH));

    // if (dueDate > 15)
    //  return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));
    // 형식 체크 (by 정규표현식)


    // 기타 등등 - 추가하기


    const postTeamNameResponse = await teamService.patchTeamName(
        teamId, teamName, dueDate,userId
    );

    return res.send(postTeamNameResponse);
};
/**
 * API No. 16
 * API Name : 팀멤버 수정하기
 * [patch] /app/userIds/:userId/teams/members
 */
exports.patchTeamMembers = async function (req, res) {

    /**
     * Body: friendId
     */
    const {teamId, friendId} = req.body;

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (!teamId) return res.send(errResponse(baseResponse.TEAM_TEAMID_EMPTY));
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }



    const patchTeamMemberResponse = await teamService.patchTeamMembers(
       teamId, userId,friendId
    );

    return res.send(patchTeamMemberResponse);
};
/**
 * API No. 16
 * API Name : 팀 삭제하기
 * [patch] /app/userIds/:userId/teams/members
 */
exports.patchTeamStatus = async function (req, res) {

    /**
     * Body: friendId
     */
    const {teamId} = req.query;

    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (!teamId) return res.send(errResponse(baseResponse.TEAM_TEAMID_EMPTY));
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }



    const patchTeamStatusResponse = await teamService.patchTeamStatus(
        teamId, userId
    );

    return res.send(patchTeamStatusResponse);
};
