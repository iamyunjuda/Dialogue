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
const scheduleProvider = require("../Schedule/scheduleProvider");
const {stringify} = require("nodemon/lib/utils");
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
            dueDate = "2030-12-31";

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
        if(getTeamId.teamId == undefined) {
            connection.release();
            return response(baseResponse.TEAM_TEAMID_NOT_EXIST);

        }
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
        const checkTeamId = await teamDao.checkTeamIdExist(teamId);
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
        if(friendId ==undefined) return response(baseResponse.USER_USERID_NOT_EXIST);
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
        const checkTeamId = await teamDao.checkTeamIdExist(connection,teamId);
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

exports.getTeagetTeamMemberAndMYSchedulemMembers = async function (userId,teamId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{

        console.log(teamId);
        await connection.beginTransaction();
        const checkTeamId = await teamDao.checkTeamIdExist(connection,teamId);
        console.log(checkTeamId);
        if(checkTeamId.length !=1) return  response(baseResponse.TEAM_TEAMID_NOT_EXIST);
        if(checkTeamId[0].userId !=userId) return  response(baseResponse.TEAM_NOT_ALLOWED);


        //활성화된 유저인지 확인
        const userCheckRows = await scheduleProvider.userCheck(userId);
        if(userCheckRows <1) return  response(baseResponse.USER_UNACTIVATED);
        const getSchedule = await scheduleProvider.getSchedule(userId);

        if(getSchedule ==0 ){
            connection.release();
            return response(baseResponse.SUCCESS,[]);

        }
        for(var i=0;i<getSchedule.length;i++){
            getSchedule[i].scheduleId = stringify(getSchedule[i].scheduleId);
            const startTime = (getSchedule[i].startTimeHour)+':'+(getSchedule[i].startTimeMin);
            const endTime =  (getSchedule[i].endTimeHour) +':'+(getSchedule[i].endTimeMin);

            getSchedule[i].startTime=startTime;
            getSchedule[i].endTime=endTime;
            delete getSchedule[i].startTimeHour;
            delete getSchedule[i]["startTimeMin"];
            delete getSchedule[i]['endTimeHour'];
            delete getSchedule[i]['endTimeMin'];

            if(i==getSchedule.length-1){
                let memList ='';
                const params = [teamId];

                const getTeamMembersResult = await teamDao.getTeamMembers(connection, params);
                console.log(getTeamMembersResult,"aaaagggg");

                for(let i=0;i<getTeamMembersResult.length;i++){
                    console.log(getTeamMembersResult[i].userName,"qtqetw");
                    memList+=getTeamMembersResult[i].userName;
                    memList+=' ';
                    console.log(memList,"qqwertqetdsadw");
                    //memList.push= getTeamMembersResult[0].userName;

                }
                getSchedule[i].memberList = memList;

            }

        }



        await connection.commit();
        connection.release();

        return response(baseResponse.SUCCESS,getSchedule);

    }
    catch (err){

        await connection.rollback();
        connection.release();
        logger.error(`App - postSchedule Service error\n: ${err.message}`);
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
        if(getFriendListRows==undefined){
            connection.release();
            return response(baseResponse.SUCCESS,[]);

        }
        await connection.commit();
        connection.release();
        return response(baseResponse.SUCCESS,getFriendListRows);



    }catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }};

exports.patchTeamOut = async function (teamId,userId) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {

        await connection.beginTransaction();
        //const params =[ teamName, dueDate];
        //활성화된 유저인지 확인
        const userCheckRows = await teamProvider.userCheck(userId);
        if(userCheckRows <1)return  response(baseResponse.USER_UNACTIVATED);

        //해당 teamId가 존재하는지 그리고 권한이 있는지
        const param = [teamId, userId];
        const checkTeamId = await teamProvider.checkTeamIdMemberExist(param);
        if(checkTeamId.length !=1) return  response(baseResponse.TEAM_TEAMID_NOT_EXIST);

        if(checkTeamId[0].userId !=userId){
            const params =[userId, teamId];
            const patchTeamStatus =await teamDao.patchMemberOut(connection,params);
            //   return  response(baseResponse.TEAM_NOT_ALLOWED);

        }
        else
        {
            console.log(3);
            const patchTeamStatus = await teamDao.patchTeamStatus(connection, teamId);
            const patchTeamMemberStatus =await teamDao.patchAllMemberOut(connection,teamId);
            console.log(4);
        }
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

exports.patchTeamMembers = async function (teamId,userId,friendId) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {

        await connection.beginTransaction();
        //const params =[ teamName, dueDate];
        //활성화된 유저인지 확인
        const userCheckRows = await teamProvider.userCheck(userId);
        if(userCheckRows <1)return  response(baseResponse.USER_UNACTIVATED);

        //해당 teamId가 존재하는지 그리고 권한이 있는지
        const checkTeamId = await teamDao.checkTeamIdExist(teamId);
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
        if(getTeamIdList.length == 0) {
            return response(baseResponse.SUCCESS,[]);
        }
        for(var i=0;i<getTeamList.length;i++){
            const getTeamMemberNumbers = await teamDao.getTeamMemberNumbers(connection,getTeamList[i].teamId);
            console.log("check1",getTeamList[i].teamId);

            const getTeamName =await teamDao.getTeamName(connection,getTeamList[i].teamId);
            console.log("check2",getTeamName);
            const getDueDate = await teamDao.getTeamDueDate(connection,getTeamList[i].teamId);
            console.log("check3",getDueDate);
            try{
                getTeamList[i].numOfMembers = getTeamMemberNumbers.numOfMember;
                getTeamList[i].teamName = getTeamName.teamName;
                if(getDueDate.Time =='만료됨'){
                    const patchTeamList = await teamDao.patchTeamStatus(connection,getTeamList[i].teamId);
                    const patchTeamMember = await teamDao.patchAllMemberOut(connection,getTeamList[i].teamId);
                }
                else{
                    getTeamList[i].timeLeft =getDueDate.Time;
                }

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
        const checkTeamId = await teamDao.checkTeamIdExist(teamId);
        if(checkTeamId.length !=1) return  response(baseResponse.TEAM_TEAMID_NOT_EXIST);
        if(checkTeamId[0].userId !=userId){
            const params =[userId, teamId];
            const patchTeamStatus =await teamDao.patchMemberOut(connection,params);
         //   return  response(baseResponse.TEAM_NOT_ALLOWED);

        }
        else
        {
            console.log(3);
            const patchTeamStatus = await teamDao.patchTeamStatus(connection, teamId);
            console.log(4);
        }
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
