async function selectUserCheck(connection, userId) {
    const selectUserCheckQuery = `
                
            select count(userId) as count from User where userId= ? and status='ACTIVATED'
                `;
    const [userRows] = await connection.query(selectUserCheckQuery,userId);
    return userRows[0];
}


async function selectUserIdWithEmail(connection, friendName) {
    const selectUserCheckQuery = `
        select userId from User where ID=? and status='ACTIVATED';
            
                `;
    const [userRows] = await connection.query(selectUserCheckQuery,friendName);
    return userRows[0];
}
async function selectFriendRequest(connection, para) {
    const selectFriendRequestQuery = `
        select count(userId) as count from FriendRequest where userId = ? and targetId=? and status = 'ACTIVATED';

    `;
    const [friendRows] = await connection.query(selectFriendRequestQuery,para);
    return friendRows[0];
}
async function friendRequestPost(connection, para) {
    const selectFriendRequestQuery = `
        INSERT INTO FriendRequest(userId, targetId) Values (?,?);
    `;
    const [friendRows] = await connection.query(selectFriendRequestQuery,para);
    return friendRows[0];
}

async function selectFriendRequestExist(connection, friendRequestId) {
    const selectFriendRequestExistQuery = `

        select count(friendRequestId) as count from FriendRequest where friendRequestId=?  and targetId=? and status='ACTIVATED';
    `;
    const [friendRows] = await connection.query(selectFriendRequestExistQuery,friendRequestId);
    return friendRows[0];
}

async function selectFriendIds(connection, friendRequestId) {
    const selectFriendIdsQuery = `
        select userId, targetId from FriendRequest where friendRequestId= ? and status='ACTIVATED';
        
    `;
    const [friendRows] = await connection.query(selectFriendIdsQuery,friendRequestId);
    return friendRows[0];
}

async function selectFriendLists(connection, params) {
    const selectFriendIdsQuery = `
        select count(friendId) as count from Friend where targetId=? and userId=? and status='ACTIVATED';

    `;
    const [friendRows] = await connection.query(selectFriendIdsQuery,params);
    return friendRows[0];
}
async function updateFriendRequestIdStatus(connection, friendRequestId) {
    const selectFriendIdsQuery = `
        Update FriendRequest set status='UNACTIVATED',updatedAt= current_timestamp()  where friendRequestId=?;

    `;
    const [friendRows] = await connection.query(selectFriendIdsQuery,friendRequestId);
    return friendRows[0];
}

async function insertFriendId(connection, params1) {
    const insertFriendIdQuery = `
        insert into Friend(userId, targetId,friendName) values (?,?,(select userName from User where userId =? ));

    `;
    const [friendRows] = await connection.query(insertFriendIdQuery,params1);
    return friendRows[0];
}

async function selectFriendListsOfUserId(connection, params1) {
    const selectFriendListsOfUserIdQuery = `
        select count(targetId) as count from Friend where userId =? and targetId=? and status ='ACTIVATED';

    `;
    const [friendRows] = await connection.query(selectFriendListsOfUserIdQuery,params1);
    return friendRows[0];
}

async function friendNameUpdate(connection, params) {
    const friendNameUpdateQuery = `
        UPDATE Friend Set friendName = ?,updatedAt= current_timestamp()  where userId=? and targetId =? and status='ACTIVATED';
    `;
    const [friendRows] = await connection.query(friendNameUpdateQuery,params);
    return friendRows[0];
}


async function selectFriendListsOfUserIdUnactivated(connection, params) {
    const friendNameUpdateQuery = `
        select friendId from Friend where userId=? and targetId=? and status='UNACTIVATED';
    `;
    const [friendRows] = await connection.query(friendNameUpdateQuery,params);
    return friendRows[0];
}
async function updateFriendId(connection, params) {
    const friendNameUpdateQuery = `
        UPDATE Friend Set status = 'ACTIVATED', updatedAt= current_timestamp() where userId=? and targetId =? and status='UNACTIVATED';
    `;
    const [friendRows] = await connection.query(friendNameUpdateQuery,params);
    return friendRows[0];
}
async function checkIfTargetBlocked(connection, params) {
    const checkIfTargetBlockedQuery = `
        select count(friendId) as count from Friend where userId=? and targetId=? and status ='BLOCKED';
    `;
    const [friendRows] = await connection.query(checkIfTargetBlockedQuery,params);
    return friendRows[0];
}
async function blockFriend(connection, params) {
    const blockFriendQuery = `
        UPDATE Friend Set status ='BLOCKED', updatedAt =current_timestamp() where userId= ? and targetId=?;;
    `;
    const [friendRows] = await connection.query(blockFriendQuery,params);
    return friendRows[0];
}
async function deleteFriend(connection, params) {
    const blockFriendQuery = `
        UPDATE Friend Set status ='UNACTIVATED', updatedAt =current_timestamp() where userId= ? and targetId=?;
    `;
    const [friendRows] = await connection.query(blockFriendQuery,params);
    return friendRows[0];
}
async function getFriendList(connection, userId) {
    const getFriendListQuery = `
        select friendId, targetId, friendName from Friend where userId= ? and status ='ACTIVATED';
    `;
    const [friendRows] = await connection.query(getFriendListQuery,userId);
    return friendRows;
}
async function getUpdatedInfoScheduleId(connection, targetId) {
    const getUpdatedInfoScheduleIdQuery = `
        select max(scheduleStatusId) as scheduleStatusId from Schedule where userId=? and status='ACTIVATED';
    `;
    const [friendRows] = await connection.query(getUpdatedInfoScheduleIdQuery,targetId);
    return friendRows[0];
}
async function getUpdatedInfo(connection, scheduleId) {
    const getUpdatedInfoScheduleIdQuery = `
        select courseName,
               case
                   when TIMESTAMPDIFF(minute,updatedAt,NOW()) <=5
                       then '방금 전'
                   when TIMESTAMPDIFF(minute,updatedAt,NOW()) <60
                       then concat(TIMESTAMPDIFF(minute,updatedAt,NOW()),'분 전')
                   when TIMESTAMPDIFF(hour,updatedAt,NOW()) <24
                       then concat(TIMESTAMPDIFF(hour,updatedAt,NOW()),'시간 전')
                   when TIMESTAMPDIFF(day,updatedAt,NOW()) <24
                       then concat(TIMESTAMPDIFF(day,updatedAt,NOW()),'일 전')
                   ELSE concat(DATE_FORMAT(updatedAt,'%Y.%c.%d'))
                   END as Time
        from Schedule where scheduleStatusId=? and status ='ACTIVATED';
    `;
    const [friendRows] = await connection.query(getUpdatedInfoScheduleIdQuery,scheduleId);
    return friendRows[0];
}


async function getFriendList2(connection, params) {
    const searchFriendNameQuery = `
        select targetId as friendId, friendName from Friend where userId=? and friendName LIKE ? and status='ACTIVATED'
    `;
    const [friendRows] = await connection.query(searchFriendNameQuery,params);
    return friendRows;
}


async function getFriendList3(connection, params) {
    const searchFriendNameQuery = `
        select targetId as friendId, friendName from Friend where userId=? and status='ACTIVATED'
    `;
    const [friendRows] = await connection.query(searchFriendNameQuery,params);
    return friendRows;
}
async function getFriendRequest(connection, userId) {
    const getFriendRequestQuery = `

        select friendRequestId, U.userName from (FriendRequest F inner join User U on F.targetId = U.userId) where F.userId= ? and F.status ='ACTIVATED';

    `;
    const [friendRows] = await connection.query(getFriendRequestQuery,userId);
    return friendRows;
}
async function friendRequestPatch(connection, params) {
    const getFriendRequestQuery = `



        update FriendRequest Set status='UNACTIVATED', updatedAt = current_timestamp() where userId=? and friendRequestId=? and status='ACTIVATED';

    `;
    const [friendRows] = await connection.query(getFriendRequestQuery,params);
    return friendRows;
}



module.exports={
    selectUserCheck,
    selectUserIdWithEmail,
    selectFriendRequest,
    friendRequestPost,
    selectFriendRequestExist,
    selectFriendIds,
    selectFriendLists,
    updateFriendRequestIdStatus,
    insertFriendId,
    selectFriendListsOfUserId,
    friendNameUpdate,
    selectFriendListsOfUserIdUnactivated,
    updateFriendId,
    checkIfTargetBlocked,
    blockFriend,
    deleteFriend,
    getFriendList,
    getUpdatedInfoScheduleId,
    getUpdatedInfo,

    getFriendList,
    getFriendList2,
    getFriendList3,
    friendRequestPatch,
    getFriendRequest,

}