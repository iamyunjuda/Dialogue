const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const friendProvider = require("./friendProvider");
const friendDao = require("./friendDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");


// Service: Create, Update, Delete 비즈니스 로직 처리

exports.retrieveFriendRequest = async function (userId, friendName) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        await connection.beginTransaction();
        //friendName -> userId

        const friendNameExchange = await friendProvider.friendNameExchange(friendName);
        console.log(friendNameExchange,"adfadf");
        if(friendNameExchange == undefined){
            connection.release();
            return response(baseResponse.FRIEND_NOT_EXIST);
        }
        if(friendNameExchange.userId == userId) {
            connection.release();
            return response(baseResponse.FRIEND_REQUEST_NOT_POSSIBLE);
        }

        const friendUserId = friendNameExchange.userId;

        //이미 친구는 아닌지
        const friendSearch = await friendProvider.getFriendSearch(userId, friendUserId);
        if(friendSearch.count>0){
            connection.release();
            return response(baseResponse.ALREADY_FRIEND_ERROR)};
        //블락된 유저가 아닌지(userId가 targetId로부터 차단 당한 것은 아닌지)
        const checkBlocked = await friendProvider.checkBlocked(userId, friendUserId);
        if(checkBlocked.count >0) {
            connection.release();
            return response(baseResponse.FRIEND_REQUEST_NOT_POSSIBLE)};

        //활성화된 유저인지 확인
        const userCheckRows = await friendProvider.userCheck(userId);
        if(userCheckRows <1){
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }
        const friendUserCheckRows = await friendProvider.userCheck(friendUserId);
        if(userCheckRows <1){
            connection.release();
            return  response(baseResponse.FRIEND_USER_UNACTIVATED);
        }

        //이미 보낸 요청이 있는지 확인
        const friendRequestCheckRows = await friendProvider.friendRequestExist(userId, friendUserId);
        if(friendRequestCheckRows>0) {
            connection.release();
            return response(baseResponse.FRIEND_REQUEST_EXIST);
        }

        //친구 요청 전송
        const params = [userId, friendUserId];
        const friendRequestPost = await friendDao.friendRequestPost(connection, params);

        await connection.commit();
        connection.release();
        return response(baseResponse.SUCCESS);

    }
    catch (err){

        await connection.rollback();
        connection.release();
        logger.error(`App - postSchedule Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    }


};



exports.retrievePostFriendRequest = async function (userId, friendRequestId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        await connection.beginTransaction();

        //활성화된 유저인지 확인
        const userCheckRows = await friendProvider.userCheck(userId);
        if(userCheckRows <1){
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }


        //받은 요청이 있는지 확인
        const friendRequestExist = await friendProvider.friendRequestExistWithRequestId(friendRequestId,userId)
        if(friendRequestExist.count ==0) {
            connection.release();
            return errResponse(baseResponse.FRIEND_REQUEST_NOT_EXIST);
        }

        //userID와 targetId 불러오기
        const getUserIds = await friendProvider.getFriendIds(friendRequestId);
        const targetId = getUserIds[0].target;
        const realUserId = getUserIds[0].userId;
        console.log(realUserId,"비교대상");
        console.log("userId와 다른 값이어야함",targetId,realUserId);
        //요청 수락하기 : 과정 = 요청 수락시 상태 UNACTIVATED로 바꾸고 insert
        //이미 친구였던적 있는지 확인
        const checkWereFriendBefore = await friendProvider.checkWereFriendBefore(realUserId, targetId);
        const checkAlereadyFriend = await friendProvider.checkAlereadyFriend(realUserId, targetId);
        if(checkAlereadyFriend != 0){
            const updateStatus = await friendDao.updateFriendRequestIdStatus(connection,friendRequestId);
            await connection.commit();
            connection.release();

            return response(baseResponse.SUCCESS);

        }
else{

            console.log(userId, targetId,"asdfssss");
            if(checkWereFriendBefore == undefined) { //?

                console.log(userId, targetId,"asdfsssaaa");
                //1. 상태 UNACTIVATED로 바꾸기
                const updateStatus = await friendDao.updateFriendRequestIdStatus(connection,friendRequestId);
                //2. insert하기
                console.log(userId, targetId,"asdf");
                const params1 = [realUserId, targetId, targetId];
                const params2 = [targetId, realUserId, realUserId];
                const friendInsert = await friendDao.insertFriendId(connection, params1);
                const friendInsert2 = await friendDao.insertFriendId(connection, params2);
            }
            else{
                console.log(userId, targetId,"asdfaaaaaa");
                //1. 상태 UNACTIVATED로 바꾸기
                const updateStatus = await friendDao.updateFriendRequestIdStatus(connection,friendRequestId);
                //2. 기존 친구 목록에서 상태만 업데이트 하기
                console.log(userId, targetId,"asdf2");
                const params1 = [realUserId, targetId, targetId];
                const params2 = [targetId, realUserId, realUserId];
                const friendInsert = await friendDao.updateFriendId(connection, params1);
                const friendInsert2 = await friendDao.updateFriendId(connection, params2);

            }

            await connection.commit();
            connection.release();
            return response(baseResponse.SUCCESS);



        }

    }
    catch (err){

        await connection.rollback();
        connection.release();
        logger.error(`App - postSchedule Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    }


};



exports.retrievePatchFriendName = async function (userId, targetId, friendName) {
    const connection = await pool.getConnection(async (conn) => conn);

    try{
        await connection.beginTransaction();

        //활성화된 유저인지 확인
        const userCheckRows = await friendProvider.userCheck(userId);
        if(userCheckRows <1){
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }
        //존재하는 targetId인지
        const targetCheckRows = await friendProvider.userCheck(targetId);
        if(targetCheckRows <1){
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }

        //userId 친구 목록에 targetId가 있는지
        const friendListExist = await friendProvider.friendListExist(userId,targetId);
        if(friendListExist.count==0) {
            connection.release();
            return errResponse(baseResponse.FRIEND_LIST_NOT_EXIST);
        }

        //friendName 바꾸기
        const params =[friendName,userId,targetId];
        const friendNameUpdate = await friendDao.friendNameUpdate(connection, params);



        await connection.commit();
        connection.release();
        return response(baseResponse.SUCCESS);

    }
    catch (err){

        await connection.rollback();
        connection.release();
        logger.error(`App - postSchedule Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    }


};


exports.retrievePatchFriendStatusToBlock = async function (userId, targetId) {
    const connection = await pool.getConnection(async (conn) => conn);

    try{
        await connection.beginTransaction();

        //활성화된 유저인지 확인
        const userCheckRows = await friendProvider.userCheck(userId);
        if(userCheckRows <1){
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }
        //존재하는 targetId인지
        const targetCheckRows = await friendProvider.userCheck(targetId);
        if(targetCheckRows <1){
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }

        //userId 친구 목록에 targetId가 있는지
        const friendListExist = await friendProvider.friendListExist(userId,targetId);
        if(friendListExist.count==0) {
            connection.release();
            return errResponse(baseResponse.FRIEND_LIST_NOT_EXIST);
        }

        //block하기
        const params = [userId, targetId];
        const blockFriend = await friendDao.blockFriend(connection, params);

        //차단당한 사람은 친구 삭제가 되어야함.
        const params2 =[targetId, userId];
        const deleteFriend = await friendDao.deleteFriend(connection, params2);



        await connection.commit();
        connection.release();
        return response(baseResponse.SUCCESS);

    }
    catch (err){

        await connection.rollback();
        connection.release();
        logger.error(`App - postSchedule Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    }


};

exports.retrievePatchFriendStatusToUnfriend = async function (userId, targetId) {
    const connection = await pool.getConnection(async (conn) => conn);

    try{
        await connection.beginTransaction();

        //활성화된 유저인지 확인
        const userCheckRows = await friendProvider.userCheck(userId);
        if(userCheckRows <1){
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }
        //존재하는 targetId인지
        const targetCheckRows = await friendProvider.userCheck(targetId);
        if(targetCheckRows <1){
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }

        //userId 친구 목록에 targetId가 있는지
        const friendListExist = await friendProvider.friendListExist(userId,targetId);
        if(friendListExist.count==0) {
            connection.release();
            return errResponse(baseResponse.FRIEND_LIST_NOT_EXIST);
        }

        //친구 삭제
        const params1 =[userId,targetId];
        const blockedFriend1 = await friendDao.deleteFriend(connection, params1);
        const params2 =[targetId, userId];
        const blockedFriend = await friendDao.deleteFriend(connection, params2);



        await connection.commit();
        connection.release();
        return response(baseResponse.SUCCESS);

    }
    catch (err){

        await connection.rollback();
        connection.release();
        logger.error(`App - postSchedule Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    }


};
exports.retrieveGetFriendList = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);

    try{
        await connection.beginTransaction();

        //활성화된 유저인지 확인
        const userCheckRows = await friendProvider.userCheck(userId);
        if(userCheckRows <1){
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }
        const result = [];
        const getFriendListRows = await friendProvider.getFriendList(userId);
        const getFriendRequestListRows = await friendProvider.getFriendRequestList(userId);
        //getFriendListRows.numOfRequest =getFriendRequestListRows.count;
       // result.push(getFriendListRows);
        //result.push(getFriendListRows);
        //getFriendListRows.push(getFriendRequestListRows);
       // getFriendListRows.numOfRequest = getFriendRequestListRows.count;
        //console.log(getFriendRequestListRows,"check1");
        var pre = {
            "friendRequestNum": getFriendRequestListRows,
            "friendList" : getFriendListRows
        };

        //var pre2= {"friendRequestNum": getFriendRequestListRows};
       // pre.push(pre2);
        await connection.commit();
        connection.release();
        return response(baseResponse.SUCCESS,pre);

    }
    catch (err){

        await connection.rollback();
        connection.release();
        logger.error(`App - postSchedule Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    }


};

exports.retrieveSearchFriend = async function (userId,friendName) {
    const connection = await pool.getConnection(async (conn) => conn);

    try{
        await connection.beginTransaction();

        //활성화된 유저인지 확인
        const userCheckRows = await friendProvider.userCheck(userId);
        if(userCheckRows <1){
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }
        if(friendName!=''){
            console.log(11111);
            const getFriendSearchListRows = await friendProvider.getFriendSearchList(userId,friendName);
            await connection.commit();
            connection.release();
            return response(baseResponse.SUCCESS,getFriendSearchListRows);

        }else {
            const getFriendSearchListRows = await friendProvider.getFriendSearchListWithoutName(userId);
            await connection.commit();
            connection.release();
            return response(baseResponse.SUCCESS,getFriendSearchListRows);
        }




    }
    catch (err){

        await connection.rollback();
        connection.release();
        logger.error(`App - postSchedule Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    }


};
exports.retrieveFriendRequestRefuse = async function (userId,friendRequestId) {
    const connection = await pool.getConnection(async (conn) => conn);

    try{
        await connection.beginTransaction();

        //활성화된 유저인지 확인
        const userCheckRows = await friendProvider.userCheck(userId);
        if(userCheckRows <1){
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }

        const params = [userId,friendRequestId];
        const friendRequest = await friendDao.friendRequestPatch(connection,params);



        await connection.commit();
        connection.release();
        return response(baseResponse.SUCCESS);





    }
    catch (err){

        await connection.rollback();
        connection.release();
        logger.error(`App - postSchedule Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    }


};


exports.retrieveFriendRequestList = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);

    try{
        await connection.beginTransaction();

        //활성화된 유저인지 확인
        const userCheckRows = await friendProvider.userCheck(userId);
        if(userCheckRows <1){
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }

        const friendRequestList = await friendProvider.friendRequestList(userId);



            await connection.commit();
            connection.release();
            return response(baseResponse.SUCCESS,friendRequestList);





    }
    catch (err){

        await connection.rollback();
        connection.release();
        logger.error(`App - postSchedule Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    }


};

