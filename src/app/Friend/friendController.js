const jwtMiddleware = require("../../../config/jwtMiddleware");
const friendProvider = require("../../app/Friend/friendProvider");
const friendService = require("../../app/Friend/friendService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const scheduleService = require("../../app/Schedule/scheduleService");

/**
 * API No. 9
 * API Name : 친구 신청 API
 * [POST] /app/userIds/:userId/friends
 */

exports.postFriendSend = async function (req, res) {

    const userId = req.params.userId;

    const userIdFromJWT = req.verifiedToken.userId;

    const {friendName} = req.body;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));


    }
    if(!friendName) return res.send(errResponse(baseResponse.FRIENDNAME_EMPTY));

    if(friendName.length > 15) return res.send(errResponse(baseResponse.SIGNUP_NICKNAME_LENGTH));


    const friendRequest = await friendService.retrieveFriendRequest(
        userId, friendName
    );

    return res.send(friendRequest);


}
/**
 * API No. 9
 * API Name : 친구 신청 API
 *
 */

exports.patchFriendRequestRefuse = async function (req, res) {

    const userId = req.params.userId;

    const userIdFromJWT = req.verifiedToken.userId;

    const {friendRequestId} = req.body;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));


    }
    if(!friendRequestId) return res.send(errResponse(baseResponse.FRIEND_REQUEST_NOT_EXIST));




    const friendRequest = await friendService.retrieveFriendRequestRefuse(
        userId, friendRequestId
    );

    return res.send(friendRequest);


}
/**
 * API No. 10
 * API Name : 친구 수락 API
 * [POST] /app/userIds/:userId/friends/checks
 */

exports.postFriendRequestAccept = async function (req, res) {
    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId;

    const {friendRequestId} = req.body;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
       return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));


    }
    if(!friendRequestId) return res.send(errResponse(baseResponse.FRIENDREQUESTID_EMPTY));
    const postFriendRequest = await friendService.retrievePostFriendRequest(
        userId, friendRequestId
    );

    return res.send(postFriendRequest);


}
/**
 * API No. 11
 * API Name : 친구 이름 변경 API
 * [PATCH] /app/userIds/:userId/friends
 *  body : targetId, newName
 *
 */

exports.patchFriendName = async function (req, res) {
    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId;

    const {targetId, newName} = req.body;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));


    }

    if(!targetId) return res.send(errResponse(baseResponse.FRIENDID_EMPTY));
    if(!newName) return res.send(errResponse(baseResponse.FRIENDNAME_EMPTY));

    const updateFriendNameRequest = await friendService.retrievePatchFriendName(
        userId, targetId, newName
    );

    return res.send(updateFriendNameRequest);


}

/**
 * API No. 12
 * API Name : 친구 차단하기
 * [PATCH] /app/userIds/:userId/friends/blocks
 *  body : targetId
 *
 */

exports.blocksFriend = async function (req, res) {
    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId;

    const {targetId} = req.body;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (!targetId) return res.send(errResponse(baseResponse.FRIENDID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));


    }

    const updateFriendStatusRequest = await friendService.retrievePatchFriendStatusToBlock(
        userId, targetId
    );

    return res.send(updateFriendStatusRequest);


}


/**
 * API No. 13
 * API Name : 친구 삭제하기
 * [PATCH] /app/userIds/:userId/friends/unfriends
 *  body : targetId
 *
 */

exports.unfriendsFriend = async function (req, res) {

    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId;
    const {targetId} = req.body;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (!targetId) return res.send(errResponse(baseResponse.FRIENDID_EMPTY));

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));


    }

    const updateFriendStatusRequest = await friendService.retrievePatchFriendStatusToUnfriend(
        userId, targetId
    );

    return res.send(updateFriendStatusRequest);


}
/**
 * API No. 14
 * API Name : 친구 목록 불러오기
 * [get] /app/userIds/:userId/friends
 *
 *
 */

exports.getFriendList = async function (req, res) {
    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId;



    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));



    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));


    }

    const getFriendListRequest = await friendService.retrieveGetFriendList(
        userId
    );

    return res.send(getFriendListRequest);


}
/**
 * API No. 14
 * API Name : 친구 검색하기
 * [get] /app/userIds/:userId/friends
 *
 *
 */

exports.searchFriendByName = async function (req, res) {
    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId;
    const friendName = req.query.friendName;


    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));


    }
   // if (friendName<15) return res.send(errResponse(baseResponse.USER_NAME_LENGTH));

    const  searchFriendByNameRequest = await friendService.retrieveSearchFriend(
        userId,friendName
    );

    return res.send(searchFriendByNameRequest);


}

/**
 * API No. 14
 * API Name : 친구 검색하기
 * [get] /app/userIds/:userId/friends
 *
 *
 */

exports.getFriendRequestList = async function (req, res) {
    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId;
    const friendName = req.query.friendName;


    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));


    }
    // if (friendName<15) return res.send(errResponse(baseResponse.USER_NAME_LENGTH));

    const friendRequestResult = await friendService.retrieveFriendRequestList(
        userId
    );

    return res.send(friendRequestResult);


}
