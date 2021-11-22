const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const teamProvider = require("./teamProvider");
const teamDao = require("./teamDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
//const friendProvider = require("./friendProvider");


// Service: Create, Update, Delete 비즈니스 로직 처리

exports.postTeamName = async function (teamName, dueDate,userId,friendId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {


        await connection.beginTransaction();
        for(var i =0 ;i < friendId.length;i++) {
            //활성화된 유저인지 확인
            // console.log(friendId[i],"asd");
            const userCheckRows = await teamProvider.userCheck(friendId[i]);
            if(userCheckRows <1)return  response(baseResponse.USER_UNACTIVATED);

           // const params3 = [getTeamId.teamId, friendId[i]]
            //const addTeamMembersResult = await teamDao.addTeamMembers(connection, params3);

        }

        if(dueDate == "infinite"){
            dueDate = "2099-12-31";

        }
       else{
            const dateInfo = dueDate.split("-");
            //
            var today = new Date();
            const newDate= today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();

            console.log(dueDate,newDate,"ㅁㄴㅇㄹ");

            if(dueDate >= newDate){
                console.log("true");
            }
            else{

                console.log("falsase");
                return response(baseResponse.DATE_ERROR);
            }



        }



        const params =[ teamName, dueDate,userId];
        const postTeamResult = await teamDao.postTeam(connection,params);
//////
        await connection.commit();

        //팀 아이디 불러오기
        const getTeamId = await teamDao.getTeamId(connection,userId);

        for(var i =0 ;i < friendId.length;i++) {


            const params3 = [getTeamId.teamId, friendId[i]]
            const addTeamMembersResult = await teamDao.addTeamMembers(connection, params3);

        }


        const params2 =[getTeamId.teamId, userId];
        const addTeamMembersResult = await teamDao.addTeamMembers(connection, params2);



        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.patchTeamName = async function (teamId, teamName, dueDate,userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {


        await connection.beginTransaction();
        const checkTeamId = await teamProvider.checkTeamIdExist(teamId);
        if(checkTeamId.length !=1) return  response(baseResponse.TEAM_TEAMID_NOT_EXIST);
        if(checkTeamId[0].userId !=userId) return  response(baseResponse.TEAM_NOT_ALLOWED);

        const params =[teamName, dueDate,teamId];
        const patchTeamResult = await teamDao.patchTeam(connection,params);

        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};



exports.postTeamMembersWithTargetId = async function (teamId,userId,friendId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {

        await connection.beginTransaction();
        //const params =[ teamName, dueDate];

        //팀 아이디 불러오기
       // const getTeamId = await teamDao.getTeamId(connection,userId);

        //팀원 추가하기
        //나 팀원으로 추가하기
    console.log(teamId,"seeeeee");
        for(var i =0 ;i < friendId.length;i++) {
            //활성화된 유저인지 확인
          // console.log(friendId[i],"asd");
            const userCheckRows = await teamProvider.userCheck(friendId[i]);
            if(userCheckRows <1) return  response(baseResponse.USER_UNACTIVATED);

            const params = [teamId, friendId[i]]
            const addTeamMembersResult = await teamDao.addTeamMembers(connection, params);

        }
        //const params =[getTeamId.teamId, userId];
      //  const addTeamMembersResult = await teamDao.addTeamMembers(connection, params);

        await connection.commit();

        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.postTeamMembersWithMemberId = async function (teamId,userId,memberId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {

        await connection.beginTransaction();
        //const params =[ teamName, dueDate];

        //팀 아이디 불러오기
    //    const getTeamId = await teamDao.getTeamId(connection,userId);
  //활성화된 유저인지 확인
        // console.log(friendId[i],"asd");

        const exchangeMemberIdTofriendId = await teamProvider.getUserId(memberId);

        const friendId = exchangeMemberIdTofriendId;
        console.log("hi",friendId,"here");
console.log("----------------");
        const userCheckRows = await teamProvider.userCheck(friendId);
        console.log("hi","here",userCheckRows);


        if(userCheckRows <1) return  response(baseResponse.USER_UNACTIVATED);

        const params = [teamId, friendId];
        const addTeamMembersResult = await teamDao.addTeamMembers(connection, params);

        await connection.commit();

        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.getTeamMembers = async function (userId,teamId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {

        await connection.beginTransaction();
        //const params =[ teamName, dueDate];

        //활성화된 유저인지 확인
        const userCheckRows = await teamProvider.userCheck(userId);
        if(userCheckRows <1)return  response(baseResponse.USER_UNACTIVATED);
        //해당 teamId가 존재하는지 그리고 권한이 있는지
        const checkTeamId = await teamProvider.checkTeamIdExist(teamId);
        if(checkTeamId.length !=1) return  response(baseResponse.TEAM_TEAMID_NOT_EXIST);
        if(checkTeamId[0].userId !=userId) return  response(baseResponse.TEAM_NOT_ALLOWED);


        const params = [teamId, userId];
        const getTeamMembersResult = await teamDao.getTeamMembers(connection, params);

        await connection.commit();

        connection.release();

        return response(baseResponse.SUCCESS,getTeamMembersResult);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};



exports.getTeamMembersIdWithMemberId = async function (userId,memberId) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        console.log(memberId);
        await connection.beginTransaction();

        const exchangeMemberIdTofriendId = await teamProvider.getUserId(memberId);


       // console.log(exchangeMemberIdTofriendId);
        if(exchangeMemberIdTofriendId == undefined) return response(baseResponse.USER_USERID_NOT_EXIST);

        const friendId = exchangeMemberIdTofriendId.userId;

        const userCheckRows = await teamProvider.userCheck(friendId);
        //console.log("hi","here",userCheckRows);


        if(userCheckRows <1) return  response(baseResponse.USER_UNACTIVATED);
    const params =[ userId, friendId];
        const getFriendListRows = await teamProvider.getFriendId(params);

        console.log(getFriendListRows,"ssdfasd");

        await connection.commit();
        connection.release();
        return response(baseResponse.SUCCESS,getFriendListRows);



    }catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }};



exports.patchTeamMembers = async function (teamId,userId,friendId) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {

        await connection.beginTransaction();
        //const params =[ teamName, dueDate];
        //활성화된 유저인지 확인
        const userCheckRows = await teamProvider.userCheck(userId);
        if(userCheckRows <1)return  response(baseResponse.USER_UNACTIVATED);

        //해당 teamId가 존재하는지 그리고 권한이 있는지
        const checkTeamId = await teamProvider.checkTeamIdExist(teamId);
        if(checkTeamId.length !=1) return  response(baseResponse.TEAM_TEAMID_NOT_EXIST);
        if(checkTeamId[0].userId !=userId) return  response(baseResponse.TEAM_NOT_ALLOWED);


        const params = [teamId, friendId];
        const getTeamMembersResult = await teamDao.patchTeamMembers(connection, params);

        await connection.commit();

        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.getTeamList = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {

        await connection.beginTransaction();
        //const params =[ teamName, dueDate];

        //팀 아이디 불러오기
        const getTeamList = await teamDao.getTeamIdList(connection,userId);
        console.log(getTeamList);
        for(var i=0;i<getTeamList.length;i++){
            const getTeamMemberNumbers = await teamDao.getTeamMemberNumbers(connection,getTeamList[i].teamId);
            console.log("check1",getTeamList[i].teamId);

            const getTeamName =await teamDao.getTeamName(connection,getTeamList[i].teamId);
            console.log("check2",getTeamName);
            const getDueDate = await teamDao.getTeamDueDate(connection,getTeamList[i].teamId);
            console.log("check3");
            try{
                getTeamList[i].numOfMembers = getTeamMemberNumbers.numOfMember;
                getTeamList[i].teamName = getTeamName.teamName;
                getTeamList[i].timeLeft =getDueDate.Time;
            }
            catch(err){continue;}


        }

        await connection.commit();


        connection.release();

        return response(baseResponse.SUCCESS,getTeamList);

    } catch (err) {
        await connection.rollback();
        connection.release();
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.patchTeamStatus = async function (teamId, userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {

        await connection.beginTransaction();
        //const params =[ teamName, dueDate];
        //활성화된 유저인지 확인
        console.log(1);
        const userCheckRows = await teamProvider.userCheck(userId);
        if(userCheckRows <1)return  response(baseResponse.USER_UNACTIVATED);

        //해당 teamId가 존재하는지 그리고 권한이 있는지
        console.log(2);
        const checkTeamId = await teamProvider.checkTeamIdExist(teamId);
        if(checkTeamId.length !=1) return  response(baseResponse.TEAM_TEAMID_NOT_EXIST);
        if(checkTeamId[0].userId !=userId) return  response(baseResponse.TEAM_NOT_ALLOWED);

        console.log(3);
        const patchTeamStatus =await teamDao.patchTeamStatus(connection,teamId);
        console.log(4);
        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        await connection.rollback();
        connection.release();
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
