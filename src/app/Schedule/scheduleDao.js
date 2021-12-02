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
        INSERT INTO Schedule(userId, courseName, startTimeHour,startTimeMin,endTimeHour,endTimeMin,courseDay,isChangeable,isPublic,isNameHidden,deleteId,detailContext)
        
        values(?,?,?,?,?,?,?,?,?,?,?,?);


    `;
    const [scheduleRows] = await connection.query(postScheduleQuery,postScheduleParams);
    return scheduleRows[0];
}
async function postTeamSchedule(connection, postScheduleParams) {
    const postTeamScheduleQuery = `
        INSERT INTO TeamSchedule(teamId,courseName, startTimeHour,startTimeMin,endTimeHour,endTimeMin,courseDay,deleteId)
        values(?,?,?,?,?,?,?,?);

           
    `;
    const [scheduleRows] = await connection.query(postTeamScheduleQuery,postScheduleParams);
    return scheduleRows[0];
}


async function getScheduleCheck(connection, params) {
    const getScheduleCheckQuery = `


        select scheduleStatusId from Schedule where userId =? and courseDay=? and status='ACTIVATED';
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
        select scheduleStatusId as scheduleId , courseName, startTimeHour, startTimeMin, endTimeHour, endTimeMin, courseDay,detailContext
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
         courseName=?, startTimeHour=?, startTimeMin=?,endTimeHour=?, endTimeMin=?, courseDay=?, isChangeable=?, isPublic=?, isNameHidden=?, updatedAt= current_timestamp()
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
                                teamId= ? , startTimeHour=?, startTimeMin=?,endTimeHour=?, endTimeMin=?, courseDay=?, updatedAt= current_timestamp()
        where teamScheduleId=?;
    `;
    const [scheduleRows] = await connection.query(patchTeamScheduleQuery,params);

    return scheduleRows[0];
}
async function patchTeamScheduleStatus(connection, teamScheduleId) {
    const patchTeamScheduleStatusQuery = `
        UPDATE TeamSchedule SET
                               status = 'UNACTIVATED', updatedAt= current_timestamp()
        where deleteId=?;
    `;
    const [scheduleRows] = await connection.query(patchTeamScheduleStatusQuery,teamScheduleId);

    return scheduleRows[0];
}

async function updateTeamScheduleName(connection, params) {
    const patchTeamScheduleStatusQuery = `
        UPDATE TeamSchedule SET
                              courseName= ? ,updatedAt= current_timestamp()
        where deleteId=?;
    `;
    const [scheduleRows] = await connection.query(patchTeamScheduleStatusQuery,params);

    return scheduleRows[0];
}
async function patchScheduleStatus(connection, scheduleId) {
    const patchScheduleStatusQuery = `
        UPDATE Schedule SET
            status= 'UNACTIVATED', updatedAt= current_timestamp()
        where deleteId=? and status = 'ACTIVATED';

    `;
    const [scheduleRows] = await connection.query(patchScheduleStatusQuery,scheduleId);

    return scheduleRows[0];
}
async function checkTheyAreFriend(connection, params) {
    const checkTheyAreFriendQuery = `

        select count(friendId) as count from Friend where userId= ? and targetId=? and status ='ACTIVATED';


    `;
    const [scheduleRows] = await connection.query(checkTheyAreFriendQuery,params);

    return scheduleRows[0];
}
async function selectTeamSchedule(connection, teamId) {
    const selectTeamScheduleQuery = `

        select teamScheduleId, courseName, startTimeHour, startTimeMin, endTimeHour, endTimeMin, courseDay
        From TeamSchedule where teamId=? and status ='ACTIVATED';



    `;
    const [scheduleRows] = await connection.query(selectTeamScheduleQuery,teamId);

    return scheduleRows;
}
async function getScheduleId(connection, userId) {
    const selectTeamScheduleQuery = `

        select max(scheduleStatusId) as scheduleId
        From Schedule where userId=? and status ='ACTIVATED';



    `;
    const [scheduleRows] = await connection.query(selectTeamScheduleQuery,userId);

    return scheduleRows[0];
}

async function getTeamScheduleId(connection, teamId) {
    const selectTeamScheduleQuery = `

        select max(teamScheduleId) as scheduleId
        From TeamSchedule where teamId=? and status ='ACTIVATED';



    `;
    const [scheduleRows] = await connection.query(selectTeamScheduleQuery,teamId);

    return scheduleRows[0];
}
async function patchScheduleId(connection, scheduleId) {
    const patchScheduleIdQuery = `

        UPDATE Schedule SET
                            deleteId= ?, updatedAt= current_timestamp()
        where scheduleStatusId=? and status = 'ACTIVATED';
    



    `;
    const params =[scheduleId,scheduleId];
    const [scheduleRows] = await connection.query(patchScheduleIdQuery,params);

    return scheduleRows[0];
}
async function patchTeamScheduleId(connection, scheduleId) {
    const patchScheduleIdQuery = `

        UPDATE TeamSchedule SET
                            deleteId= ?, updatedAt= current_timestamp()
        where teamScheduleId=? and status = 'ACTIVATED';
    



    `;
    const params =[scheduleId,scheduleId];
    const [scheduleRows] = await connection.query(patchScheduleIdQuery,params);

    return scheduleRows[0];
}

async function getDeleteId(connection, scheduleId) {
    const getDeleteIdQuery = `


        select deleteId from Schedule where scheduleStatusId = ? and status ='ACTIVATED';


    `;

    const [scheduleRows] = await connection.query(getDeleteIdQuery,scheduleId);

    return scheduleRows;
}
async function getTeamDeleteId(connection, scheduleId) {
    const getDeleteIdQuery = `


        select deleteId from TeamSchedule where teamScheduleId = ? and status ='ACTIVATED';


    `;

    const [scheduleRows] = await connection.query(getDeleteIdQuery,scheduleId);

    return scheduleRows;
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
    checkTheyAreFriend,
    selectTeamSchedule,
    getScheduleId,
    patchScheduleId,
    getTeamScheduleId,
    patchTeamScheduleId,
    getDeleteId,
    getTeamDeleteId,
};
