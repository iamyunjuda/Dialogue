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


// Service: Create, Update, Delete 비즈니스 로직 처리
exports.retrieveSchedulePost = async function (userId, startTime, endTime, courseName, courseDay,changeable, openTo,nameOpenTo) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{


        await connection.beginTransaction();

        var startTimesplit = startTime.split(":");
        var endTimesplit = endTime.split(":");
        //이미 존재하는 스케줄이 있는지 학인하기

        const getSchedule = await scheduleProvider.getScheduleExist(userId,courseDay);

        for(var i=0;i<getSchedule.length;i++){


            const checkParams =[ startTimesplit[0],startTimesplit[0],startTimesplit[1], endTimesplit[0], endTimesplit[0],endTimesplit[1],getSchedule[i].scheduleStatusId];
            const scheduleRows = await scheduleProvider.scheduleCheck(checkParams);


            if(scheduleRows.st+scheduleRows.ed == 0){
                return response(baseResponse.SCHEDULE_EXIST);
            }
        }


       // console.log(1,scheduleRows);

        //시작시간보다 엔딩 시간이 더 클 경우
        if(startTimesplit[0]> endTimesplit[0]){
            return response(baseResponse.SCHEDULE_ERROR);
        }
        console.log(3);
        console.log(startTimesplit[0], endTimesplit[0]);
        if((startTimesplit[0]== endTimesplit[0]) && (startTimesplit[1]> endTimesplit[1])){

            return response(baseResponse.SCHEDULE_ERROR);
        }

        //활성화된 유저인지 확인
        const userCheckRows = await scheduleProvider.userCheck(userId);

        if(userCheckRows <1)return  response(baseResponse.USER_UNACTIVATED);

        const postScheduleParams =[userId, courseName, startTimesplit[0],startTimesplit[1],endTimesplit[0],endTimesplit[1],  courseDay, changeable, openTo, nameOpenTo];

        const postSchedule = await scheduleDao.postSchedule(connection,postScheduleParams);


        await connection.commit();
        connection.release();
        return response(baseResponse.SUCCESS,postSchedule);

    }
    catch (err){

        await connection.rollback();
        connection.release();
        logger.error(`App - postSchedule Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    }


}

exports.retrieveScheduleGet = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{


        await connection.beginTransaction();

        //var startTimesplit = startTime.split(":");
      //  var endTimesplit = endTime.split(":");
        //이미 존재하는 스케줄이 있는지 학인하기



        //활성화된 유저인지 확인
        const userCheckRows = await scheduleProvider.userCheck(userId);
        if(userCheckRows <1)return  response(baseResponse.USER_UNACTIVATED);
        const getSchedule = await scheduleProvider.getSchedule(userId);


        for(var i=0;i<getSchedule.length;i++){

           const startTime = (getSchedule[i].startTimeHour)+':'+(getSchedule[i].startTimeMin);
           const endTime =  (getSchedule[i].endTimeHour) +':'+(getSchedule[i].endTimeMin);

           getSchedule[i].startTime=startTime;
           getSchedule[i].endTime=endTime;

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


}

