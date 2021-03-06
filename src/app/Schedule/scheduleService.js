const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const scheduleProvider = require("./scheduleProvider");
const scheduleDao = require("./scheduleDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
const {stringify} = require("nodemon/lib/utils");


// Service: Create, Update, Delete 비즈니스 로직 처리
exports.retrieveSchedulePost = async function (userId, startTime, endTime, courseName, courseDay,isChangeable,isPublic,isNameHidden,detailContext) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{

        await connection.beginTransaction();

        var startTimesplit = startTime.split(":");
        var endTimesplit = endTime.split(":");
        //이미 존재하는 스케줄이 있는지 학인하기
        //if(parseInt(startTimesplit[0]) >parseInt(endTimesplit[0])){
          //  connection.release();
         //   return response(baseResponse.SCHEDULE_ERROR);
     //   }
        //console.log(3);

     //   if((parseInt(startTimesplit[0])== parseInt(endTimesplit[0])) && (parseInt(startTimesplit[1])>= parseInt(endTimesplit[1]))){
        //    connection.release();
      //      return response(baseResponse.SCHEDULE_ERROR);
    //    }


        // console.log(getTeamMember,"MEm");
        // console.log(courseDay,"Course");


        if(parseInt(startTimesplit[0]) >23 | parseInt(endTimesplit[0]) >23) {
            connection.release();
            return response(baseResponse.TIME_HOUR_ERROR);
        }
        if(parseInt(startTimesplit[1]) >59 | parseInt(endTimesplit[1]) >59){
            connection.release();
            return response(baseResponse.TIME_MIN_ERROR);

        }
        if(parseInt(endTimesplit[0])==12 & parseInt(endTimesplit[1]) ==0){
           endTimesplit[0]=11;
            endTimesplit[1]=59;

        }
        /*
        if(parseInt(endTimesplit[0])==11 & (parseInt(endTimesplit[1])==59 | parseInt(endTimesplit[0]==0))){
            endTimesplit[0]=11;
            endTimesplit[1]=58;

        }*/

        //활성화된 유저인지 확인
        console.log("asdf");
        const userCheckRows = await scheduleProvider.userCheck(userId);

        if(userCheckRows <1) {
            connection.release();
            return response(baseResponse.USER_UNACTIVATED);
        }

        let result= [];
        let result3=[];
        if((parseInt(endTimesplit[0]) < parseInt(startTimesplit[0])) | ((parseInt(endTimesplit[0]) == parseInt(startTimesplit[0])& parseInt(startTimesplit[1])>parseInt(endTimesplit[1]) ))){

            for(var i=0;i<courseDay.length;i++){
                console.log(i,"다시 오냐");
                const getSchedule = await scheduleProvider.getScheduleExist(userId,courseDay[i]);
                result.push(getSchedule);
                const getSchedule2 = await scheduleProvider.getScheduleExist(userId,courseDay[i]+1);
                result3.push(getSchedule2);

            }
            for(var i=0;i<result.length;i++) {
                for (var j = 0; j < result[i].length; j++) {
                    console.log(2, result[i][j].scheduleStatusId, 3, result[i][j]);
                    const checkParams = [startTimesplit[0], startTimesplit[0], startTimesplit[1],23, 23, 59, result[i][j].scheduleStatusId];
                    const scheduleRows = await scheduleProvider.scheduleCheck(checkParams);


                    if (scheduleRows.st + scheduleRows.ed == 0) {
                        connection.release();
                        console.log("왜지!!!!!??",i);
                        return response(baseResponse.SCHEDULE_EXIST);
                    }
                }
            }
            for(var i=0;i<result3.length;i++) {
                for (var j = 0; j < result3[i].length; j++) {
                    console.log(2, result3[i][j].scheduleStatusId, 3, result3[i][j]);
                    //const checkParams = [12,12,0,endTimesplit[0], endTimesplit[0], endTimesplit[1], result3[i][j].scheduleStatusId];
                    const checkParams = [0,0,0,endTimesplit[0], endTimesplit[0], endTimesplit[1], result3[i][j].scheduleStatusId];
                    const scheduleRows = await scheduleProvider.scheduleCheck(checkParams);


                    if (scheduleRows.st + scheduleRows.ed == 0) {
                        connection.release();
                        console.log("왜지!!!!!??",i);
                        return response(baseResponse.SCHEDULE_EXIST);
                    }
                }
            }

            if(!detailContext) detailContext = ' ';
            console.log(detailContext,"asdfasdf");
            for(var i=0;i<courseDay.length;i++) {
                //const postScheduleParams = [userId, courseName, startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[1], courseDay[i], isChangeable, isPublic, isNameHidden];
                console.log("!!!!!!");
                const postScheduleParams = [userId, courseName, startTimesplit[0], startTimesplit[1],23,59, courseDay[i], isChangeable, isPublic, isNameHidden,0,detailContext];

               //const postScheduleParams2 = [userId, courseName, 0,0, endTimesplit[0], endTimesplit[1], (courseDay[i]+1)%7, isChangeable, isPublic, isNameHidden];
                console.log(3);
                const postSchedule = await scheduleDao.postSchedule(connection, postScheduleParams);
                //    const params = [userId];
                //const getScheduleId =  await scheduleDao.getScheduleId(connection, params);
                await connection.commit();
                console.log(1);
                const getScheduleId = await scheduleDao.getScheduleId(connection, userId);
                console.log(getScheduleId.scheduleId);
                const patchDeleteId = await scheduleDao.patchScheduleId(connection, getScheduleId.scheduleId);
                console.log(4);
                const postScheduleParams2 = [userId, courseName, 0,0, endTimesplit[0], endTimesplit[1], (courseDay[i]+1+7)%7, isChangeable, isPublic, isNameHidden, getScheduleId.scheduleId,detailContext];
                const postSchedule2 = await scheduleDao.postSchedule(connection, postScheduleParams2);
            }

        }

        else {
            for (var i = 0; i < courseDay.length; i++) {
                console.log(i, "다시 오냐");
                const getSchedule = await scheduleProvider.getScheduleExist(userId, courseDay[i]);
                //const getTeamSchedule = await scheduleProvider.getTeamScheduleExist(userId,courseDay[i]);
                console.log(getSchedule, "1");
                result.push(getSchedule);
                console.log(result, "여기가 원인이냐?", i, courseDay.length);
            }

            console.log(result, "어떻게 들어갔나 확인하기");
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < result[i].length; j++) {
                    console.log(2, result[i][j].scheduleStatusId, 3, result[i][j]);
                    const checkParams = [startTimesplit[0], startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[0], endTimesplit[1], result[i][j].scheduleStatusId];
                    const scheduleRows = await scheduleProvider.scheduleCheck(checkParams);


                    if (scheduleRows.st + scheduleRows.ed == 0) {
                        connection.release();
                        console.log("왜지!!!!!??", i);
                        return response(baseResponse.SCHEDULE_EXIST);
                    }
                }
            }


            for(var i=0;i<courseDay.length;i++) {
                //const postScheduleParams = [userId, courseName, startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[1], courseDay[i], isChangeable, isPublic, isNameHidden];
                console.log("asdf");
                const postScheduleParams = [userId, courseName, startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[1], courseDay[i], isChangeable, isPublic, isNameHidden,0,detailContext];


                const postSchedule = await scheduleDao.postSchedule(connection, postScheduleParams);
                await connection.commit();
                const getScheduleId = await scheduleDao.getScheduleId(connection, userId);
                console.log(getScheduleId.scheduleId);
                const patchDeleteId = await scheduleDao.patchScheduleId(connection, getScheduleId.scheduleId);
                //    const params = [userId];
                //const getScheduleId =  await scheduleDao.getScheduleId(connection, params);

            }


            /**/





        }
        const result2= [];
        /*
        for(var i=0;i<courseDay.length;i++){
            const getTeamSchedule = await scheduleProvider.getTeamScheduleExist(userId,courseDay[i]);
            result2.push(getTeamSchedule);
        }

        console.log(result2,"어떻게 들어갔나 확인하기");
        for(var i=0;i<result2.length;i++) {
            for (var j = 0; j < result2[i].length; j++) {
                console.log(2, result2[i][j].teamScheduleId, 3, result2[i][j]);
                const checkParams = [startTimesplit[0], startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[0], endTimesplit[1], result2[i][j].teamScheduleId];
                const scheduleRows = await scheduleProvider.teamScheduleCheck(checkParams);


                if (scheduleRows.st + scheduleRows.ed == 0) {
                    connection.release();
                    console.log("왜지!!!!!??",);
                    return response(baseResponse.SCHEDULE_EXIST);
                }
            }
        }

        // console.log(1,scheduleRows);
*/






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
exports.retrieveTeamScheduleGet = async function (userId,teamId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{


        await connection.beginTransaction();


        //활성화된 유저인지 확인
        const userCheckRows = await scheduleProvider.userCheck(userId);
        if(userCheckRows <1) return  response(baseResponse.USER_UNACTIVATED);


       // const getSchedule =[];
        const getSchedule = await scheduleProvider.getTeamSchedules(teamId);
        console.log(getSchedule,"aaa");
       // getSchedule.push(getSchedules);
        //console.log(getSchedule.length,"ccc");
        if(getSchedule == undefined ){
            connection.release();
            return response(baseResponse.SUCCESS,[]);

        }

        console.log(getSchedule,"ccc");

            for (var i = 0; i < getSchedule.length; i++) {
                getSchedule[i].teamScheduleId = stringify(getSchedule[i].teamScheduleId);
                const startTime = (getSchedule[i].startTimeHour) + ':' + (getSchedule[i].startTimeMin);
                const endTime = (getSchedule[i].endTimeHour) + ':' + (getSchedule[i].endTimeMin);

                getSchedule[i].startTime = startTime;
                getSchedule[i].endTime = endTime;
                delete getSchedule[i].startTimeHour;
                delete getSchedule[i]["startTimeMin"];
                delete getSchedule[i]['endTimeHour'];
                delete getSchedule[i]['endTimeMin'];

            }
            await connection.commit();
            connection.release();

            return response(baseResponse.SUCCESS, getSchedule);

    }
    catch (err){

        await connection.rollback();
        connection.release();
        logger.error(`App - postSchedule Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    }


};

exports.retrieveScheduleGet = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{


        await connection.beginTransaction();


        //활성화된 유저인지 확인
        const userCheckRows = await scheduleProvider.userCheck(userId);
        if(userCheckRows <1) {
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }
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

exports.retrieveGetFriendSchedule = async function (userId,friendId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{


        await connection.beginTransaction();


        //활성화된 유저인지 확인
        const userCheckRows = await scheduleProvider.userCheck(userId);
        if(userCheckRows <1) {
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }

        const friendCheckRows = await scheduleProvider.userCheck(friendId);
        if(friendCheckRows <1) {
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }

        //둘이 친구인지 확인하기!
        const checkThem = await scheduleProvider.checkTheyAreFriend(userId, friendId);
        if(checkThem.count == 0)  {
            connection.release();
            return  response(baseResponse.FRIEND_NOT_EXIST);
        }


        const getSchedule = await scheduleProvider.getSchedule(userId);
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

exports.retrieveSchedulePatch = async function (scheduleId, userId, startTime, endTime, courseName, courseDay,isChangeable, isPublic,isNameHidden) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        await connection.beginTransaction();
        const scheduleStatusId = parseInt(scheduleId);

        var startTimesplit = startTime.split(":");
        var endTimesplit = endTime.split(":")

        if(parseInt(startTimesplit[0]) >parseInt(endTimesplit[0])){
            connection.release();
            return response(baseResponse.SCHEDULE_ERROR);
        }
        //console.log(3);

        if((parseInt(startTimesplit[0])== parseInt(endTimesplit[0])) && (parseInt(startTimesplit[1])>= parseInt(endTimesplit[1]))){
            connection.release();
            return response(baseResponse.SCHEDULE_ERROR);
        }


        // console.log(getTeamMember,"MEm");
        // console.log(courseDay,"Course");


        if(parseInt(startTimesplit[0]) >23 | parseInt(endTimesplit[0]) >23) {
            connection.release();
            return response(baseResponse.TIME_HOUR_ERROR);
        }
        if(parseInt(startTimesplit[1]) >59 | parseInt(endTimesplit[1]) >59) {
            connection.release();
            return response(baseResponse.TIME_MIN_ERROR);
        }

        if(parseInt(endTimesplit[0])==12 & parseInt(endTimesplit[1]) ==0){
            endTimesplit[0]=11;
            endTimesplit[1]=59;

        }
       // if(parseInt(endTimesplit[0])==11 & (parseInt(endTimesplit[1])==59 | parseInt(endTimesplit[0]==0))){
         //   endTimesplit[0]=11;
           // endTimesplit[1]=58;

        //}


        //활성화된 유저인지 확인
        const userCheckRows = await scheduleProvider.userCheck(userId);
        console.log("check1",scheduleId);
        if(userCheckRows <1) {
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }




        //이미 존재하는 스케줄이 있는지 학인하기
        var result= [];

        const getScheduleExist = await scheduleProvider.getScheduleExistForPatch(scheduleId);
        console.log("check2");
        if(getScheduleExist[0].count ==0) {
            connection.release();
            return  response(baseResponse.SCHEDULE_NOT_EXIST);
        }

        console.log("check4",courseDay);
        for(var i=0;i< courseDay.length ;i++){

            const getSchedule = await scheduleProvider.getScheduleExist(userId,courseDay[i]);
            console.log(getSchedule,"1");
            result.push(getSchedule);
        }


        for(var i=0;i<result.length;i++) {
            for (var j = 0; j < result[i].length; j++) {
                console.log(2, result[i][j].scheduleStatusId, 3, result[i][j]);
                const checkParams = [startTimesplit[0], startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[0], endTimesplit[1], result[i][j].scheduleStatusId];

                const scheduleRows = await scheduleProvider.scheduleCheck(checkParams);


                if (scheduleRows.st + scheduleRows.ed == 0) {
                    connection.release();
                    return response(baseResponse.SCHEDULE_EXIST);
                }
            }
        }

        const result2= [];
        for(var i=0;i<courseDay.length;i++){
            const getTeamSchedule = await scheduleProvider.getTeamScheduleExist(userId,courseDay[i]);
            result2.push(getTeamSchedule);
        }

        console.log(result2,"어떻게 들어갔나 확인하기");
        for(var i=0;i<result2.length;i++) {
            for (var j = 0; j < result2[i].length; j++) {
                console.log(2, result2[i][j].teamScheduleId, 3, result2[i][j]);
                const checkParams = [startTimesplit[0], startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[0], endTimesplit[1], result2[i][j].teamScheduleId];
                const scheduleRows = await scheduleProvider.teamScheduleCheck(checkParams);


                if (scheduleRows.st + scheduleRows.ed == 0) {
                    connection.release();
                    return response(baseResponse.SCHEDULE_EXIST);
                }
            }
        }

       // if(courseName)
        const checkParams =[ courseName, startTimesplit[0],startTimesplit[1], endTimesplit[0],endTimesplit[1],courseDay, isChangeable, isPublic,isNameHidden,scheduleStatusId];
        const scheduleRows = await scheduleProvider.scheduleUpdate(checkParams);



        // console.log(1,scheduleRows);
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



exports.retrieveAllSchedules = async function (userId, teamId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        await connection.beginTransaction();

        //활성화된 유저인지 확인
        const userCheckRows = await scheduleProvider.userCheck(userId);
        if(userCheckRows <1) {
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);}
        //team에 속한 유저를 모두 불러오기
        const ret =[];
        const getUserRows= await scheduleProvider.getUserRows(teamId);

        console.log(getUserRows);
        //유저의 스케줄들 불러오기
        for(let j=0;j<getUserRows.length;j++){
            console.log(getUserRows[j].userId,"ㅁㄴㅇㄹ2");
            if(getUserRows[j].userId==userId) continue;
            const getSchedule = await scheduleProvider.getSchedule(getUserRows[j].userId);
            console.log(getSchedule,"ㅁㄴㅇㄹ");

            for(let i=0;i<getSchedule.length;i++) {
                getSchedule[i].scheduleId = stringify(getSchedule[i].scheduleId);

                const startTime = (getSchedule[i].startTimeHour) + ':' + (getSchedule[i].startTimeMin);
                const endTime = (getSchedule[i].endTimeHour) + ':' + (getSchedule[i].endTimeMin);
                try{
                getSchedule[i].startTime = startTime;
                getSchedule[i].endTime = endTime;
                getSchedule[i].userId = getUserRows[j].userId;
                delete getSchedule[i].startTimeHour;
                delete getSchedule[i]["startTimeMin"];
                delete getSchedule[i]['endTimeHour'];
                delete getSchedule[i]['endTimeMin'];
            ret.push(getSchedule[i]);}
                catch(err){
                    continue;
                }

            }


        }






        await connection.commit();
        connection.release();
        return response(baseResponse.SUCCESS,ret);

    }
    catch (err){

        await connection.rollback();
        connection.release();
        logger.error(`App - postSchedule Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    }


};

exports.retrieveTeamSchedulePost = async function ( userId,teamId,startTime, endTime, courseName, courseDay) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        await connection.beginTransaction();
        //userId가 팀장인지 확인하기
      //  const checkUserIdIsALeader = await scheduleProvider.userIdIsALeader(userId,teamId);
      //  if (checkUserIdIsALeader.length != 1){
       //     connection.release();

        //    return response(baseResponse.USERID_NOT_A_LEADER);

      //  }


        //팀장만 활성화되어 있는지 확인하면됨
        const userCheckRows = await scheduleProvider.userCheck(userId);
        if(userCheckRows <1) {
            connection.release();
            return response(baseResponse.USER_UNACTIVATED);
        }

        //팀 상태 확인하기
        const teamCheckRows= await scheduleProvider.teamCheck(teamId);
        console.log(teamCheckRows,"팀 상태 확인한 결과")
        if(teamCheckRows!=1) {
            connection.release();
            return response(baseResponse.TEAM_UNACTIVATED);
        }

        const startTimesplit = startTime.split(":");
        const endTimesplit = endTime.split(":");
        //시작시간보다 엔딩 시간이 더 클 경우

       //// if(parseInt(startTimesplit[0]) >parseInt(endTimesplit[0])){
        //    connection.release();
      //  }
        //console.log(3);

        //if((parseInt(startTimesplit[0])== parseInt(endTimesplit[0])) && (parseInt(startTimesplit[1])>= parseInt(endTimesplit[1]))){
        //    connection.release();
       //     return response(baseResponse.SCHEDULE_ERROR);
     //   }


       // console.log(getTeamMember,"MEm");
       // console.log(courseDay,"Course");


        if(parseInt(startTimesplit[0]) >23 | parseInt(endTimesplit[0]) >23){
            connection.release();
             return response(baseResponse.TIME_HOUR_ERROR);}

        if(parseInt(startTimesplit[1]) >59 | parseInt(endTimesplit[1]) >59) {
            connection.release();
            return response(baseResponse.TIME_MIN_ERROR);
        }
        if(parseInt(endTimesplit[0])==12 & parseInt(endTimesplit[1]) ==0){
            endTimesplit[0]=11;
            endTimesplit[1]=59;

        }

      /*  if(parseInt(endTimesplit[0])==12 & parseInt(endTimesplit[1]) ==0){
            endTimesplit[0]=11;
            endTimesplit[1]=59;

        }*/
   /*     if(parseInt(endTimesplit[0])==11 & (parseInt(endTimesplit[1])==59 | parseInt(endTimesplit[0]==0))){
            endTimesplit[0]=11;
            endTimesplit[1]=58;

        }*/
        var result= [];
        var result3=[];





        var result2=[];

        const getTeamMember = await scheduleProvider.getUserRows(teamId);
        if((parseInt(endTimesplit[0]) < parseInt(startTimesplit[0])) | ((parseInt(endTimesplit[0]) == parseInt(startTimesplit[0])& parseInt(startTimesplit[1])>parseInt(endTimesplit[1]) ))){
            for(var i=0;i<courseDay.length;i++) {
                console.log(courseDay);
                // const postScheduleParams = [teamId, courseName, startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[1], courseDay[i]];
                const postScheduleParams = [teamId, courseName, startTimesplit[0], startTimesplit[1], 23,59, courseDay[i],0];
               // const postScheduleParams2 = [teamId, courseName, 0,0, endTimesplit[0], endTimesplit[1],(courseDay[i]+1)%7];
                const postTeamSchedule = await scheduleDao.postTeamSchedule(connection, postScheduleParams);
                await connection.commit();
                const getScheduleId = await scheduleDao.getTeamScheduleId(connection, teamId);
                const patchDeleteId = await scheduleDao.patchTeamScheduleId(connection, getScheduleId.scheduleId);
                const postScheduleParams2 = [teamId, courseName, 0,0, endTimesplit[0], endTimesplit[1], (courseDay[i]+1+7)%7,  getScheduleId.scheduleId];

                const postTeamSchedule2 = await scheduleDao.postTeamSchedule(connection, postScheduleParams2);
                await connection.commit();

            }



            /*
                        for(var k=0;k<getTeamMember.length;k++){
                            for(var i=0;i<courseDay.length;i++){
                                /!*  const getSchedule = await scheduleProvider.getScheduleExist(getTeamMember[k].userId,courseDay[i]);
                                  console.log(getSchedule,"1");
                                  result.push(getSchedule);*!/
                                const getTeamSchedule = await scheduleProvider.getTeamScheduleExist(userId,courseDay[i]);
                                const getTeamSchedule2 = await scheduleProvider.getTeamScheduleExist(userId,courseDay[i]+1);
                                console.log(getTeamSchedule,"team");
                                result2.push(getTeamSchedule);
                                result3.push(getTeamSchedule2);
                            }



                        }


                        for(var i=0;i<result2.length;i++) {
                            for (var j = 0; j < result2[i].length; j++) {
                                console.log(2, result2[i][j].teamScheduleId, 3, result2[i][j]);
                                const checkParams = [startTimesplit[0], startTimesplit[0], startTimesplit[1], 0, 0, 0, result2[i][j].teamScheduleId];
                                const scheduleRows = await scheduleProvider.teamScheduleCheck(checkParams);


                                if (scheduleRows.st + scheduleRows.ed == 0) {
                                    connection.release();
                                    return response(baseResponse.SCHEDULE_EXIST);
                                }
                            }*/





            }


/*

            for(var i=0;i<result3.length;i++) {
                for (var j = 0; j < result3[i].length; j++) {
                    console.log(2, result3[i][j].teamScheduleId, 3, result3[i][j]);
                    const checkParams = [12,12,0,endTimesplit[0], endTimesplit[0], endTimesplit[1], result3[i][j].teamScheduleId];
                    const scheduleRows = await scheduleProvider.scheduleCheck(checkParams);


                    if (scheduleRows.st + scheduleRows.ed == 0) {
                        connection.release();
                        console.log("왜지!!!!!??",i);
                        return response(baseResponse.SCHEDULE_EXIST);
                    }
                }
            }*/



        else {
            for(var i=0;i<courseDay.length;i++) {
                console.log(courseDay);
                // const postScheduleParams = [teamId, courseName, startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[1], courseDay[i]];
                const postScheduleParams = [teamId, courseName, startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[1], courseDay[i],0];

                const postTeamSchedule = await scheduleDao.postTeamSchedule(connection, postScheduleParams);
                await connection.commit();
                const getScheduleId = await scheduleDao.getTeamScheduleId(connection, teamId);
                const patchDeleteId = await scheduleDao.patchTeamScheduleId(connection, getScheduleId.scheduleId);

                await connection.commit();
            }


            /*for (var k = 0; k < getTeamMember.length; k++) {
                for (var i = 0; i < courseDay.length; i++) {
                    /!*  const getSchedule = await scheduleProvider.getScheduleExist(getTeamMember[k].userId,courseDay[i]);
                      console.log(getSchedule,"1");
                      result.push(getSchedule);*!/
                    const getTeamSchedule = await scheduleProvider.getTeamScheduleExist(userId, courseDay[i]);
                    console.log(getTeamSchedule, "team");
                    result2.push(getTeamSchedule);

                }


            }

            /!*
                    for(var i=0;i<result.length;i++) {
                        for (var j = 0; j < result[i].length; j++) {
                            console.log(2, result[i][j].scheduleStatusId, 3, result[i][j]);
                            const checkParams = [startTimesplit[0], startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[0], endTimesplit[1], result[i][j].scheduleStatusId];
                            const scheduleRows = await scheduleProvider.scheduleCheck(checkParams);
                            console.log("cnfghadf",scheduleRows);

                            if (scheduleRows.st + scheduleRows.ed == 0) {
                                connection.release();
                                return response(baseResponse.SCHEDULE_EXIST);
                            }
                        }
                    }

             *!/
            console.log("cnfghadf");
            for (var i = 0; i < result2.length; i++) {
                for (var j = 0; j < result2[i].length; j++) {
                    console.log(2, result2[i][j].teamScheduleId, 3, result2[i][j]);
                    const checkParams = [startTimesplit[0], startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[0], endTimesplit[1], result2[i][j].teamScheduleId];
                    const scheduleRows = await scheduleProvider.teamScheduleCheck(checkParams);


                    if (scheduleRows.st + scheduleRows.ed == 0) {
                        connection.release();
                        return response(baseResponse.SCHEDULE_EXIST);
                    }
                }
            }*/
        }
        // console.log(1,scheduleRows);
console.log("출력확인" );

 /*       for(var i=0;i<courseDay.length;i++) {
                console.log(courseDay);
               // const postScheduleParams = [teamId, courseName, startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[1], courseDay[i]];
            const postScheduleParams = [teamId, courseName, startTimesplit[0], startTimesplit[1], 11,59, courseDay[i]];
            const postScheduleParams2 = [teamId, courseName, 0,0, endTimesplit[0], endTimesplit[1], courseDay[i]+1];
            const postTeamSchedule = await scheduleDao.postTeamSchedule(connection, postScheduleParams);

            const postTeamSchedule2 = await scheduleDao.postTeamSchedule(connection, postScheduleParams2);


            }
*/






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


exports.retrieveGetTeamSchedule = async function (userId) {

    const connection = await pool.getConnection(async (conn) => conn);
    try{


        await connection.beginTransaction();


        //활성화된 유저인지 확인
        const userCheckRows = await scheduleProvider.userCheck(userId);
        if(userCheckRows <1) {
            connection.release();
            return  response(baseResponse.USER_UNACTIVATED);
        }
        //유저가 들어있는 팀의 목록 가져오기
        const getTeamIdOfUser = await scheduleProvider.getTeamIdOfUser(userId);
        const ret =[];
        for(var k=0;k<getTeamIdOfUser.length;k++){
            const getTeamSchedule = await scheduleProvider.getTeamSchedule(getTeamIdOfUser[k].teamId);
           // console.log(getTeamSchedule,"일정 확인");
            for(var i=0;i<getTeamSchedule.length;i++){

               getTeamSchedule[i].teamScheduleId = stringify(getTeamSchedule[i].teamScheduleId);
               console.log(getTeamSchedule[i],"일정 확인");
                const getTeamName = await scheduleProvider.getTeamName(getTeamIdOfUser[k].teamId);
                console.log(getTeamName.teamName,"확인");
                const startTime = (getTeamSchedule[i].startTimeHour)+':'+(getTeamSchedule[i].startTimeMin);
                const endTime =  (getTeamSchedule[i].endTimeHour) +':'+(getTeamSchedule[i].endTimeMin);

                //getTeamSchedule[i].teamName = getTeamName.teamName;


                getTeamSchedule[i].startTime = startTime;
                getTeamSchedule[i].endTime=endTime;
                delete getTeamSchedule[i].startTimeHour;
                delete getTeamSchedule[i]["startTimeMin"];
                delete getTeamSchedule[i]['endTimeHour'];
                delete getTeamSchedule[i]['endTimeMin'];

            }
            getTeamIdOfUser[k].teamId = getTeamIdOfUser[k].teamId;
           ret.push((getTeamIdOfUser[k],getTeamSchedule));



        }


        await connection.commit();
        connection.release();

        //console.log(getTeamIdOfUser);

        return response(baseResponse.SUCCESS,ret);

    }
    catch (err){

        await connection.rollback();
        connection.release();
        logger.error(`App - postSchedule Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    }


};
exports.retrieveTeamScheduleNamePatch = async function (teamScheduleId,userId,courseName) {
    const connection = await pool.getConnection(async (conn) => conn);

    try{
        await connection.beginTransaction();

        const getScheduleExist = await scheduleProvider.getTeamScheduleExistForPatch(teamScheduleId);
        if(getScheduleExist[0].count ==0) {

            connection.release();
            return  response(baseResponse.SCHEDULE_NOT_EXIST);
        }


        //userId가 팀장인지 확인
        const checkUserIdIsALeader =  await scheduleProvider.getTeamLeaderId(teamScheduleId);
      //  if(checkUserIdIsALeader.userId != userId) {
        //    connection.release();
          //  return response(baseResponse.SCHEDULE_CHANGE_NOT_ALLOWED);
        //}
        const params = [courseName,teamScheduleId];
        const patchTeamScheduleName =await scheduleDao.updateTeamScheduleName(connection,params);

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


exports.retrieveTeamScheduleTimePatch = async function (teamScheduleId, userId,  startTime, endTime,courseDay,courseName) {
    const connection = await pool.getConnection(async (conn) => conn);


    try{
        await connection.beginTransaction();

       // const teamScheduleIdInt = parseInt(teamScheduleId);

        var startTimesplit = startTime.split(":");
        var endTimesplit = endTime.split(":");


        if(parseInt(startTimesplit[0]) >parseInt(endTimesplit[0])){
            connection.release();
            return response(baseResponse.SCHEDULE_ERROR);
        }

        if((parseInt(startTimesplit[0])== parseInt(endTimesplit[0])) && (parseInt(startTimesplit[1])>= parseInt(endTimesplit[1]))){
            connection.release();
            return response(baseResponse.SCHEDULE_ERROR);
        }


        if(parseInt(startTimesplit[0]) >23 | parseInt(endTimesplit[0]) >23) {
            connection.release();
            return response(baseResponse.TIME_HOUR_ERROR);
        }
        if(parseInt(startTimesplit[1]) >59 | parseInt(endTimesplit[1]) >59) {
            connection.release();
            return response(baseResponse.TIME_MIN_ERROR);
        }
        if(parseInt(endTimesplit[0])==12 & parseInt(endTimesplit[1]) ==0){
            endTimesplit[0]=11;
            endTimesplit[1]=59;

        }
/*        if(parseInt(endTimesplit[0])==11 & (parseInt(endTimesplit[1])==59 | parseInt(endTimesplit[0]==0))){
            endTimesplit[0]=11;
            endTimesplit[1]=58;

        }*/

        //이미 존재하는 스케줄이 있는지 학인하기
        var result= [];
        var result2=[];
        const getScheduleExist = await scheduleProvider.getTeamScheduleExistForPatch(teamScheduleId);
        if(getScheduleExist[0].count ==0) {
            connection.release();
            return  response(baseResponse.SCHEDULE_NOT_EXIST);
        }


        //userId가 팀장인지 확인
       const checkUserIdIsALeader =  await scheduleProvider.getTeamLeaderId(teamScheduleId);
     //   if(checkUserIdIsALeader.userId != userId) {
       //     connection.release();
         //   return response(baseResponse.SCHEDULE_CHANGE_NOT_ALLOWED);
        //}



        const getTeamMember = await scheduleProvider.getUserRows(checkUserIdIsALeader.teamId);
        if(getTeamMember ==undefined){
            connection.release();
            return response(baseResponse.SUCCESS);

        }

        for(var k=0;k<getTeamMember.length;k++){
            for(var i=0;i<courseDay.length;i++){
                const getSchedule = await scheduleProvider.getScheduleExist(getTeamMember[k].userId,courseDay[i]);
                console.log(getSchedule,"1");
                result.push(getSchedule);
                const getTeamSchedule = await scheduleProvider.getTeamScheduleExist(getTeamMember[k].userId,courseDay[i]);
                result2.push(getTeamSchedule);
            }

        }


        for(var i=0;i<result.length;i++) {
            for (var j = 0; j < result[i].length; j++) {
                console.log("check",2, result[i][j].scheduleStatusId, 3, result[i][j])

                const checkParams = [startTimesplit[0], startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[0], endTimesplit[1], result[i][j].scheduleStatusId];

                const scheduleRows = await scheduleProvider.scheduleCheck(checkParams);

//
            //    if (scheduleRows.st + scheduleRows.ed == 0) {
              //      return response(baseResponse.SCHEDULE_EXIST);
              //}
            }
        }

        for(var i=0;i<result2.length;i++) {
            for (var j = 0; j < result2[i].length; j++) {
                console.log(2, result2[i][j].teamScheduleId, 3, result2[i][j]);
                //console.log("result[i][j].teamScheduleId",result[i][j].teamScheduleId);

                const checkParams = [startTimesplit[0], startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[0], endTimesplit[1], result2[i][j].teamScheduleId];



                const scheduleRows = await scheduleProvider.teamScheduleCheck(checkParams);

                //if (scheduleRows.st + scheduleRows.ed == 0) {
                  //  connection.release();
                    //return response(baseResponse.SCHEDULE_EXIST);
                //}
            }
        }

        // console.log(1,scheduleRows);

        for(var i=0;i<courseDay.length;i++) {
            console.log(courseDay);

                const patchScheduleParams = [checkUserIdIsALeader.teamId, startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[1], courseDay[i],courseName,teamScheduleId];
                const patchTeamSchedule = await scheduleDao.patchTeamSchedule(connection, patchScheduleParams);
        }


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
/*
exports.retrieveTeamSchedulePatch = async function (teamScheduleId, userId,  startTime, endTime, courseName, courseDay) {
    const connection = await pool.getConnection(async (conn) => conn);


    try{
        await connection.beginTransaction();

        // const teamScheduleIdInt = parseInt(teamScheduleId);

        var startTimesplit = startTime.split(":");
        var endTimesplit = endTime.split(":");


        if(parseInt(startTimesplit[0]) >parseInt(endTimesplit[0])){
            return response(baseResponse.SCHEDULE_ERROR);
        }

        if((parseInt(startTimesplit[0])== parseInt(endTimesplit[0])) && (parseInt(startTimesplit[1])>= parseInt(endTimesplit[1]))){
            return response(baseResponse.SCHEDULE_ERROR);
        }


        if(parseInt(startTimesplit[0]) >23 | parseInt(endTimesplit[0]) >23) return response(baseResponse.TIME_HOUR_ERROR);
        if(parseInt(startTimesplit[1]) >59 | parseInt(endTimesplit[1]) >59) return response(baseResponse.TIME_MIN_ERROR);


        //이미 존재하는 스케줄이 있는지 학인하기
        var result= [];
        var result2=[];
        const getScheduleExist = await scheduleProvider.getTeamScheduleExistForPatch(teamScheduleId);
        if(getScheduleExist[0].count ==0) return  response(baseResponse.SCHEDULE_NOT_EXIST);


        //userId가 팀장인지 확인
        const checkUserIdIsALeader =  await scheduleProvider.getTeamLeaderId(teamScheduleId);
        if(checkUserIdIsALeader.userId != userId) return response(baseResponse.SCHEDULE_CHANGE_NOT_ALLOWED);



        const getTeamMember = await scheduleProvider.getUserRows(checkUserIdIsALeader.teamId);
        for(var k=0;k<getTeamMember.length;k++){
            for(var i=0;i<courseDay.length;i++){
                const getSchedule = await scheduleProvider.getScheduleExist(getTeamMember[k].userId,courseDay[i]);
                console.log(getSchedule,"1");
                result.push(getSchedule);
                const getTeamSchedule = await scheduleProvider.getTeamScheduleExist(getTeamMember[k].userId,courseDay[i]);
                result2.push(getTeamSchedule);
            }

        }


        for(var i=0;i<result.length;i++) {
            for (var j = 0; j < result[i].length; j++) {
                console.log("check",2, result[i][j].scheduleStatusId, 3, result[i][j])

                const checkParams = [startTimesplit[0], startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[0], endTimesplit[1], result[i][j].scheduleStatusId];

                const scheduleRows = await scheduleProvider.scheduleCheck(checkParams);

//
                if (scheduleRows.st + scheduleRows.ed == 0) {
                    return response(baseResponse.SCHEDULE_EXIST);
                }
            }
        }

        for(var i=0;i<result2.length;i++) {
            for (var j = 0; j < result2[i].length; j++) {
                console.log(2, result2[i][j].teamScheduleId, 3, result2[i][j]);
                //console.log("result[i][j].teamScheduleId",result[i][j].teamScheduleId);

                const checkParams = [startTimesplit[0], startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[0], endTimesplit[1], result2[i][j].teamScheduleId];



                const scheduleRows = await scheduleProvider.teamScheduleCheck(checkParams);

                if (scheduleRows.st + scheduleRows.ed == 0) {
                    return response(baseResponse.SCHEDULE_EXIST);
                }
            }
        }

        // console.log(1,scheduleRows);

        for(var i=0;i<courseDay.length;i++) {
            console.log(courseDay);

            const patchScheduleParams = [checkUserIdIsALeader.teamId, courseName, startTimesplit[0], startTimesplit[1], endTimesplit[0], endTimesplit[1], courseDay[i],teamScheduleId];
            const patchTeamSchedule = await scheduleDao.patchTeamSchedule(connection, patchScheduleParams);
        }


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


};*/
exports.retrieveTeamScheduleStatusPatch = async function (teamScheduleId, userId) {
    const connection = await pool.getConnection(async (conn) => conn);

    try{
        await connection.beginTransaction();
        // const teamScheduleIdInt = parseInt(teamScheduleId);

        //userId가 팀장인지 확인
       /// const checkUserIdIsALeader =  await scheduleProvider.getTeamLeaderId(teamScheduleId);
       // if(checkUserIdIsALeader.userId != userId) {
         //   connection.release();
         //   return response(baseResponse.SCHEDULE_CHANGE_NOT_ALLOWED);
       // }

        const teamScheduleIdInt = parseInt(teamScheduleId);
        const getScheduleId = await scheduleDao.getTeamDeleteId(connection,teamScheduleId);

        const deleteId = getScheduleId[0].deleteId;
        const patchScheduleStatus =  await scheduleDao.patchTeamScheduleStatus(connection,deleteId);




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

exports.retrieveScheduleStatusPatch = async function (scheduleId, userId) {
    const connection = await pool.getConnection(async (conn) => conn);

    try{
        await connection.beginTransaction();
        // const teamScheduleIdInt = parseInt(teamScheduleId);
        //활성화된 유저인지
        const userCheckRows = await scheduleProvider.userCheck(userId);
        if(userCheckRows <1) {
            connection.release();
            return response(baseResponse.USER_UNACTIVATED);
        }

        //스케줄이 존재하는지
        const getScheduleExist = await scheduleProvider.getScheduleExistForPatch(scheduleId);
        if(getScheduleExist[0].count ==0) {
            connection.release();
            return  response(baseResponse.SCHEDULE_NOT_EXIST);
        }
        const getScheduleId = await scheduleDao.getDeleteId(connection,scheduleId);

            const deleteId = getScheduleId[0].deleteId;
            console.log(deleteId,"asdf");
            const patchScheduleStatus =  await scheduleDao.patchScheduleStatus(connection,deleteId);

      //  const patchScheduleStatus =  await scheduleDao.patchScheduleStatus(connection,scheduleId);


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





