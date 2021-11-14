const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const friendDao = require("./friendDao");
const {stringify} = require("nodemon/lib/utils");


// Provider: Read 비즈니스 로직 처리
exports.userCheck = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserResult = await friendDao.selectUserCheck(
        connection,
        userId
    );

    connection.release();
    return checkUserResult.count;
};

exports.friendNameExchange = async function (friendName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserResult = await friendDao.selectUserIdWithEmail(
        connection,
        friendName
    );
    //console.log(checkUserResult);
    connection.release();
    return checkUserResult;
};
exports.friendRequestExist = async function (userId, friendUserId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const para = [userId, friendUserId];
    const checkUserResult = await friendDao.selectFriendRequest(
        connection,
        para
    );

    connection.release();
    console.log("here",checkUserResult.count);
    return checkUserResult.count;
};

exports.friendRequestExistWithRequestId = async function (friendRequestId,userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const params =[friendRequestId, userId];
    const checkFriendRequestResult = await friendDao.selectFriendRequestExist(
        connection,
        params
    );

    connection.release();
    console.log("here",checkFriendRequestResult.count);
    return checkFriendRequestResult.count;
};
exports.getFriendIds = async function (friendRequestId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const checkFriendRequestResult = await friendDao.selectFriendIds(
        connection,
        friendRequestId
    );
    connection.release();

    return checkFriendRequestResult;
};
exports.getFriendSearch = async function (userId, friendId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const params =[userId, friendId];
    const checkFriendResult = await friendDao.selectFriendLists(
        connection,
        params
    );
    connection.release();

    return checkFriendResult;
};
exports.friendListExist = async function (userId, targetId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const params =[userId, targetId];
    const checkFriendResult = await friendDao.selectFriendListsOfUserId(
        connection,
        params
    );
    connection.release();

    return checkFriendResult;
};
exports.checkWereFriendBefore = async function (userId, targetId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const params =[userId, targetId];
    const checkFriendResult = await friendDao.selectFriendListsOfUserIdUnactivated(
        connection,
        params
    );
    connection.release();

    return checkFriendResult;
};
exports.checkBlocked = async function (userId, targetId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const params =[userId, targetId];
    const checkFriendResult = await friendDao.checkIfTargetBlocked(
        connection,
        params
    );
    connection.release();

    return checkFriendResult;
};

exports.getFriendList = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
        // 친구 목록
    const getFriendListResult = await friendDao.getFriendList(
        connection,
        userId
    );
    console.log(getFriendListResult,111);
    //목록에 각각의 최신 업데이트 내용
    if(getFriendListResult == undefined)return;
    else{
        console.log(getFriendListResult[0].targetId,1111);
    for(var i=0;i<getFriendListResult.length;i++){

        console.log(getFriendListResult[i].targetId,"친구Id 맞나 확인하기")
        const getUpdatedInfoScheduleId = await friendDao.getUpdatedInfoScheduleId(connection,getFriendListResult[i].targetId);
        if(getUpdatedInfoScheduleId.scheduleStatusId == null) continue;
        //만약 최근 일정이 뜨지 않는 다면 없느 것임
            console.log(11111,getUpdatedInfoScheduleId);
        const getUpdatedInfo= await friendDao.getUpdatedInfo(connection,getUpdatedInfoScheduleId.scheduleStatusId);

        getFriendListResult[i].recentlyUpdatedCourseName= getUpdatedInfo.courseName;
        getFriendListResult[i].recentlyUpdatedTime= getUpdatedInfo.Time;
        console.log( getFriendListResult[i],"코스이름이랑 시간 잘 추가되었나 확인하기");


    }

    connection.release();

    return getFriendListResult;
    }
};
exports.getFriendSearchList = async function (userId,friendName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const friendNames = friendName.concat('%');
    console.log(friendNames);
    const params =[userId, friendNames];
    // 친구 목록
    const searchFriendResult = await friendDao.getFriendList2(
        connection,
        params
    );

    console.log(searchFriendResult);
        connection.release();
        return searchFriendResult;

};


exports.getFriendSearchListWithoutName = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const params =[userId];
    // 친구 목록
    const searchFriendResult = await friendDao.getFriendList3(
        connection,
        params
    );


    connection.release();
    return searchFriendResult;

};

exports.friendRequestList = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const getFriendRequestResult = await friendDao.getFriendRequest(
        connection,
        userId
    );
    connection.release();

    return getFriendRequestResult;
};
