// 모든 유저 조회
async function postTeam(connection,params) {
  const postTeamQuery = `
      insert into Team(teamName,dueDate,userId) values (?,?,?);
                `;
  const [userRows] = await connection.query(postTeamQuery,params);
  return userRows;
}
async function getTeamId(connection,teamId) {
    const getTeamIdQuery = `
        select max(teamId) as teamId from Team where userId=? and status='ACTIVATED';
    `;
    const [userRows] = await connection.query(getTeamIdQuery,teamId);
    return userRows[0];
}
async function addTeamMembers(connection,params) {
    const addTeamMemberQuery = `
        INSERT INTO TeamInfo(teamId,userId) values (?,?);
    `;
    const [userRows] = await connection.query(addTeamMemberQuery,params);
    return userRows[0];
}

async function getTeamIdList(connection,userId) {
    const getTeamListQuery = `
        select teamId from TeamInfo where userId=? and status='ACTIVATED';
    `;
    const [userRows] = await connection.query(getTeamListQuery,userId);
    return userRows;
}
async function getTeamMemberNumbers(connection,teamId) {
    const getTeamMemberNumbersQuery = `
        select  count(teamInfoId) as numOfMember from TeamInfo where teamId=? and status='ACTIVATED';
    `;
    const [userRows] = await connection.query(getTeamMemberNumbersQuery,teamId);
    return userRows[0];
}
async function getTeamName(connection,teamId) {
    const getTeamNameQuery = `
        select teamName from Team where teamId=? and status='ACTIVATED' ORDER BY updatedAt DESC;
    `;
    const [userRows] = await connection.query(getTeamNameQuery,teamId);
    return userRows[0];
}
async function getTeamDueDate(connection,teamId) {
    const getTeamDueDateQuery = `
        select teamId,
               case
                   when TIMESTAMPDIFF(year,NOW(),dueDate) >=5
                        then '무기한'
                
                   when TIMESTAMPDIFF(day,NOW(),dueDate) >=1
                       then concat(TIMESTAMPDIFF(day,NOW(),dueDate),'일')
                   
                   
                   ELSE '만료됨'
                   END as Time
        from Team where teamId=? and status ='ACTIVATED';
    `;
    const [userRows] = await connection.query(getTeamDueDateQuery,teamId);
    /*
    *   select teamId,
               case
                   when TIMESTAMPDIFF(hour,NOW(),dueDate) < 0
                        then '무기한'
                   when TIMESTAMPDIFF(hour,NOW(),dueDate) <24 and  TIMESTAMPDIFF(hour,NOW(),dueDate) >0
                       then concat(TIMESTAMPDIFF(hour,NOW(),dueDate),'시간')
                   when TIMESTAMPDIFF(minute,NOW(),dueDate) <60 and TIMESTAMPDIFF(minute,NOW(),dueDate) >60
                       then concat(TIMESTAMPDIFF(minute,NOW(),dueDate),'분')
                   when TIMESTAMPDIFF(day,NOW(),dueDate) >=1
                       then concat(TIMESTAMPDIFF(day,NOW(),dueDate),'일')
                   ELSE '만료됨'
                   END as Time
        from Team where teamId=? and status ='ACTIVATED';
    * */
    return userRows[0];
}


async function selectUserCheck(connection, userId) {
    const selectUserCheckQuery = `

        select count(userId) as gount from User where userId= ? and status = 'ACTIVATED';

                `;
    console.log("dk anjsep",userId);
    const [userRows] = await connection.query(selectUserCheckQuery,userId);
    console.log("dk 2",userRows[0]);
    return userRows[0];
}
async function checkTeamIdExist(connection, teamId) {
    console.log(teamId,"asdf");
    const checkTeamIdExistQuery = `

        select teamId, userId from Team where teamId=? and status = 'ACTIVATED';
                `;
    const [userRows] = await connection.query(checkTeamIdExistQuery,teamId);
    return userRows;
}

async function checkTeamIdMemberExist(connection, params) {
    const checkTeamIdExistQuery = `


        select teamId, userId from TeamInfo where teamId=? and userId =? and status = 'ACTIVATED';
                `;
    const [userRows] = await connection.query(checkTeamIdExistQuery,params);
    return userRows;
}


async function patchTeam(connection, params) {
    const patchTeamQuery = `
        update Team Set teamName=? , dueDate=?, updatedAt= current_timestamp() where teamId=? and status='ACTIVATED';
       
    `;
    const [userRows] = await connection.query(patchTeamQuery,params);
    return userRows;
}
async function getTeamMembers(connection, params) {
    const getTeamMembersQuery = `

        select U.userId, U.userName as userName from (User U inner join TeamInfo TI on TI.userId = U.userId)  where TI.teamId =? and U.status = 'ACTIVATED';

       /* select TI.userId, F.friendName from (TeamInfo TI inner join Friend F on TI.userId = F.targetId) where teamId = ? and F.userId = ? and TI.status = 'ACTIVATED';*/
    `;
    const [userRows] = await connection.query(getTeamMembersQuery,params);
    return userRows;
}
async function patchTeamMembers(connection, params) {
    const patchTeamMembersQuery = `
        update TeamInfo Set status='UNACTIVATED',updatedAt= current_timestamp() where teamId=? and userId = ? and status='ACTIVATED';
    `;
    const [userRows] = await connection.query(patchTeamMembersQuery,params);
    return userRows;
}
async function checkTeamId(connection, teamScheduleId) {
    const checkTeamIdQuery = `
        select teamId from TeamSchedule where teamId= ? and status= 'ACTIVATED';

    `;
    const [userRows] = await connection.query(checkTeamIdQuery,teamScheduleId);
    return userRows[0];
}
async function patchTeamStatus(connection, teamId) {
    const checkTeamIdQuery = `
        UPDATE Team SET status='UNACTIVATED', updatedAt= current_timestamp() where teamId= ? and status= 'ACTIVATED';

    `;
    console.log(teamId,"here");
    const [userRows] = await connection.query(checkTeamIdQuery,teamId);
    console.log(userRows,"here");
    return userRows;
}
async function patchAllMemberOut(connection, teamId) {
    const checkTeamIdQuery = `
        UPDATE TeamInfo SET status='UNACTIVATED', updatedAt= current_timestamp() where teamId= ? and status= 'ACTIVATED';

    `;
    console.log(teamId,"here");
    const [userRows] = await connection.query(checkTeamIdQuery,teamId);
    console.log(userRows,"here");
    return userRows;
}


async function selectUserId(connection, memberId) {
    const selectUserIdQuery = `
        select userId from User where ID = ? and status = 'ACTIVATED';

    `;
   // console.log(teamId,"here");
    const [userRows] = await connection.query(selectUserIdQuery,memberId);
    console.log(userRows,"memberId");
    return userRows;
}


async function selectUserInfo(connection, params) {
    const getFriendListQuery = `
        select friendId, targetId, friendName from Friend where userId= ? and targetId=? and status ='ACTIVATED';
    `;
    const [friendRows] = await connection.query(getFriendListQuery,params);
    return friendRows;
}
async function patchMemberOut(connection, params) {
    const patchMemberOutQuery = `
        UPDATE TeamInfo SET status='UNACTIVATED', updatedAt= current_timestamp() where userId= ? and teamId= ?   and status= 'ACTIVATED';
    `;
    const [friendRows] = await connection.query(patchMemberOutQuery,params);
    return friendRows;
}

async function checkTeamMemNum(connection, teamId) {
    const checkTeamMemNumQuery = `
        select count(userId) as count From TeamInfo where status='ACTIVATED' and teamId=?;
    `;
    const [friendRows] = await connection.query(checkTeamMemNumQuery,teamId);
    return friendRows[0];
}
async function checkTeamMemNum(connection, teamId) {
    const checkTeamMemNumQuery = `
        select count(userId) as count From TeamInfo where status='ACTIVATED' and teamId=?;
    `;
    const [friendRows] = await connection.query(checkTeamMemNumQuery,teamId);
    return friendRows[0];
}

async function getTeamInfo(connection, teamId) {
    const getTeamInfoQuery = `

        select teamName, dueDate from Team where teamId=95 and status='ACTIVATED';
    `;
    const [friendRows] = await connection.query(getTeamInfoQuery,teamId);
    return friendRows[0];
}

module.exports = {
    postTeam,
    getTeamId,
    addTeamMembers,
    getTeamIdList,
    getTeamMemberNumbers,
    getTeamName,
    getTeamDueDate,
    selectUserCheck,
    checkTeamIdExist,
    patchTeam,
    getTeamMembers,
    patchTeamMembers,
    checkTeamId,
    patchTeamStatus,
    selectUserId,
    selectUserInfo,
    patchMemberOut,
    checkTeamIdMemberExist,
    patchAllMemberOut,
    checkTeamMemNum,
    getTeamInfo,


};
