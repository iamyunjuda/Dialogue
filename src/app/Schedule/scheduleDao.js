// 모든 유저 조회
async function selectScheduleCheck(  connection, checkScheduleParams) {
    const selectScheduleCheckQuery = `

        select (case
                    when endTimeHour < ?
                        then 1
                    when S.endTimeHour = ? and S.endTimeMin<= ?
                        then 1
                    else 0
            END)
                        as st,
               (case
                    when S.startTimeHour > ?
                        then 1
                    when startTimeHour = ? and S.startTimeMin>= ?
                        then 1
                    else 0
                   END) as ed from Schedule S where scheduleStatusId = ?
                `;
    const [scheduleRows] = await connection.query(selectScheduleCheckQuery,checkScheduleParams);
    return scheduleRows[0];
}

async function selectTeamScheduleCheck(  connection, checkScheduleParams) {
    const selectScheduleCheckQuery = `

        select (case
                    when endTimeHour < ?
                        then 1
                    when S.endTimeHour = ? and S.endTimeMin<= ?
                        then 1
                    else 0
            END)
                        as st,
               (case
                    when S.startTimeHour > ?
                        then 1
                    when startTimeHour = ? and S.startTimeMin>= ?
                        then 1
                    else 0
                   END) as ed from TeamSchedule S where teamScheduleId = ?
                `;
    const [scheduleRows] = await connection.query(selectScheduleCheckQuery,checkScheduleParams);
    return scheduleRows[0];
}

async function selectUserCheck(connection, userId) {
    const selectUserCheckQuery = `
                
            select count(userId) as count from User where userId= ? and status='ACTIVATED'
                `;
    const [userRows] = await connection.query(selectUserCheckQuery,userId);
    return userRows[0];
}
async function postSchedule(connection, postScheduleParams) {
    const postScheduleQuery = `
        INSERT INTO Schedule(userId, courseName, startTimeHour,startTimeMin,endTimeHour,endTimeMin,courseDay,isChangeable,isPublic,isNameHidden)
        
        values(?,?,?,?,?,?,?,?,?,?)


    `;
    const [scheduleRows] = await connection.query(postScheduleQuery,postScheduleParams);
    return scheduleRows[0];
}
async function postTeamSchedule(connection, postScheduleParams) {
    const postTeamScheduleQuery = `
        INSERT INTO TeamSchedule(teamId,courseName, startTimeHour,startTimeMin,endTimeHour,endTimeMin,courseDay)
        values(?,?,?,?,?,?,?)

           
    `;
    const [scheduleRows] = await connection.query(postTeamScheduleQuery,postScheduleParams);
    return scheduleRows[0];
}


async function getScheduleCheck(connection, params) {
    const getScheduleCheckQuery = `


        select scheduleStatusId from Schedule where userId =? and courseDay=? and status='ACTIVATED'
    `;
    const [scheduleRows] = await connection.query(getScheduleCheckQuery,params);

    return scheduleRows;
}
async function getTeamScheduleCheck(connection, params) {
    const getScheduleCheckQuery = `

        select TI.teamId, teamScheduleId from (TeamInfo TI inner join TeamSchedule TS on TI.teamId = TS.teamId) where userId = ? and TS.courseDay= ? and TS.status ='ACTIVATED';
      
    `;
    const [scheduleRows] = await connection.query(getScheduleCheckQuery,params);

    return scheduleRows;
}


async function selectUserSchedule(connection, userId) {
    const getScheduleCheckQuery = `
        select scheduleStatusId as scheduleId , courseName, startTimeHour, startTimeMin, endTimeHour, endTimeMin, courseDay
        From Schedule where userId=? and status ='ACTIVATED';

        
    `;
    const [scheduleRows] = await connection.query(getScheduleCheckQuery,userId);
    /*select teamScheduleId, T.teamName as teamName, S.teamId as teamId , courseName, startTimeHour, startTimeMin, endTimeHour, endTimeMin, courseDay
            From (TeamSchedule S inner join Team T on S.teamId=T.teamId)where S.teamId =? and S.status='ACTIVATED';
           */
    return scheduleRows;
}

async function getScheduleCheckForPatch(connection, scheduleId) {
    console.log(scheduleId,"ch");
    const getScheduleCheckQuery = `

        select count(courseName) as count
        FROM Schedule WHERE scheduleStatusId = ? and status = 'ACTIVATED';
       
    `;
    const [scheduleRows] = await connection.query(getScheduleCheckQuery,scheduleId);

    return scheduleRows;
}
async function getTeamScheduleCheckForPatch(connection, teamScheduleId) {
    const getScheduleCheckQuery = `

        select count(teamScheduleId) as count
        From TeamSchedule where teamScheduleId =? and status='ACTIVATED';
       
    `;
    const [scheduleRows] = await connection.query(getScheduleCheckQuery,teamScheduleId);

    return scheduleRows;
}

async function updateScheduleInfo(connection, params) {
    const updateScheduleInfoQuery = `

        UPDATE Schedule SET 
         courseName=?, startTimeHour=?, startTimeMin=?,endTimeHour=?, endTimeMin=?, courseDay=?, isChangeable=?, isPublic=?, isNameHidden=?
        where scheduleStatusId=?;

    `;
    const [scheduleRows] = await connection.query(updateScheduleInfoQuery,params);

    return scheduleRows;
}


async function selectScheduleExist(connection, params) {
    const getScheduleCheckQuery = `


        select scheduleStatusId from Schedule where scheduleStatusId!=? and userId =? and courseDay=? and status='ACTIVATED'
    `;
    const [scheduleRows] = await connection.query(getScheduleCheckQuery,params);

    return scheduleRows;
}
async function getTeamMembers(connection, teamId) {
    const getTeamMembersQuery = `
        select userId from TeamInfo where teamId=? and status ='ACTIVATED';
    `;
    const [scheduleRows] = await connection.query(getTeamMembersQuery,teamId);

    return scheduleRows;
}
async function userIdIsALeader(connection, params) {
    const userIdIsALeaderQuery = `
        select teamId from Team where userId =? and teamId =? and status= 'ACTIVATED';
    `;
    const [scheduleRows] = await connection.query(userIdIsALeaderQuery,params);

    return scheduleRows;
}
async function getTeamStatus(connection, teamId) {
    const getTeamStatusQuery = `
        select count(teamId) as num from Team where teamId =? and status= 'ACTIVATED';

    `;
    const [scheduleRows] = await connection.query(getTeamStatusQuery,teamId);

    return scheduleRows[0];
}
async function selectTeamIdOfUser(connection, userId) {
    const getUserTeamIdQuery = `
        select teamId from TeamInfo where userId= ? and status = 'ACTIVATED';
    `;
    const [scheduleRows] = await connection.query(getUserTeamIdQuery,userId);

    return scheduleRows;
}
async function selectTeamName(connection, teamId) {
    const getTeamNameQuery = `
        select teamName from Team where teamId=? and status = 'ACTIVATED';
    `;
    const [scheduleRows] = await connection.query(getTeamNameQuery,teamId);

    return scheduleRows;
}
async function selectTeamLeader(connection, teamScheduleId) {
    const selectTeamLeaderQuery = `
        select TS.teamId , TF.userId from
            (TeamSchedule TS inner join Team TF on TS.teamId= TF.teamId) where TS.teamScheduleId = ? and TS.status ='ACTIVATED';
    `;
    const [scheduleRows] = await connection.query(selectTeamLeaderQuery,teamScheduleId);

    return scheduleRows[0];
}
async function patchTeamSchedule(connection, params) {
    const patchTeamScheduleQuery = `
        UPDATE TeamSchedule SET
                                teamId= ? , startTimeHour=?, startTimeMin=?,endTimeHour=?, endTimeMin=?, courseDay=?
        where teamScheduleId=?;
    `;
    const [scheduleRows] = await connection.query(patchTeamScheduleQuery,params);

    return scheduleRows[0];
}
async function patchTeamScheduleStatus(connection, teamScheduleId) {
    const patchTeamScheduleStatusQuery = `
        UPDATE TeamSchedule SET
                               status = 'UNACTIVATED'
        where teamScheduleId=?;
    `;
    const [scheduleRows] = await connection.query(patchTeamScheduleStatusQuery,teamScheduleId);

    return scheduleRows[0];
}

async function updateTeamScheduleName(connection, params) {
    const patchTeamScheduleStatusQuery = `
        UPDATE TeamSchedule SET
                              courseName= ? 
        where teamScheduleId=?;
    `;
    const [scheduleRows] = await connection.query(patchTeamScheduleStatusQuery,params);

    return scheduleRows[0];
}
async function patchScheduleStatus(connection, scheduleId) {
    const patchScheduleStatusQuery = `
        UPDATE Schedule SET
            status= 'UNACTIVATED'
        where scheduleStatusId=? and status = 'ACTIVATED';

    `;
    const [scheduleRows] = await connection.query(patchScheduleStatusQuery,scheduleId);

    return scheduleRows[0];
}




module.exports = {
    selectScheduleCheck,
    selectUserCheck,
    postSchedule,
    getScheduleCheck,
    selectUserSchedule,
    getScheduleCheckForPatch,
    updateScheduleInfo,
    selectScheduleExist,
    getTeamMembers,
    postTeamSchedule,
    userIdIsALeader,
    getTeamStatus,
    selectTeamIdOfUser,
    selectTeamName,
    getTeamScheduleCheckForPatch,
    selectTeamLeader,
    patchTeamSchedule,
    getTeamScheduleCheck,
    selectTeamScheduleCheck,
    patchTeamScheduleStatus,
    updateTeamScheduleName,
    patchScheduleStatus,

};
