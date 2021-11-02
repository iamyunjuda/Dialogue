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

async function selectUserCheck(connection, userId) {
    const selectUserCheckQuery = `
                
            select count(userId) as count from User where userId= ? and status='ACTIVATED'
                `;
    const [userRows] = await connection.query(selectUserCheckQuery,userId);
    return userRows[0];
}
async function postSchedule(connection, postScheduleParams) {
    const postScheduleQuery = `
        INSERT INTO Schedule(userId, courseName, startTimeHour,startTimeMin,endTimeHour,endTimeMin,courseDay,changeable,openTo,nameOpenTo)
        
        values(?,?,?,?,?,?,?,?,?,?)


    `;
    const [scheduleRows] = await connection.query(postScheduleQuery,postScheduleParams);
    return scheduleRows[0];
}

async function getScheduleCheck(connection, params) {
    const getScheduleCheckQuery = `


        select scheduleStatusId from Schedule where userId =? and courseDay=? and status='ACTIVATED'
    `;
    const [scheduleRows] = await connection.query(getScheduleCheckQuery,params);

    return scheduleRows;
}

async function selectUserSchedule(connection, userId) {
    const getScheduleCheckQuery = `

        select userId, courseName, startTimeHour, startTimeMin, endTimeHour, endTimeMin, courseDay, changeable, openTo, nameOpenTo
        From Schedule where userId =? and status='ACTIVATED';
       
    `;
    const [scheduleRows] = await connection.query(getScheduleCheckQuery,userId);

    return scheduleRows;
}


module.exports = {
    selectScheduleCheck,
    selectUserCheck,
    postSchedule,
    getScheduleCheck,
    selectUserSchedule,
};
