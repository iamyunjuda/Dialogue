// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT userEmail, userName 
                FROM User;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT userEmail, userName 
                FROM User 
                WHERE userEmail = ? and status = 'ACTIVATED';
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT ID
                 FROM User 
                 WHERE ID = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}



// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(userEmail, userPassword, userName,ID)
        VALUES (?, ?, ?,?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}
async function insertAppleUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(userEmail, userName, ID,social)
        VALUES (?, ?, ?,1);
    `;
  const insertUserInfoRow = await connection.query(
      insertUserInfoQuery,
      insertUserInfoParams
  );

  return insertUserInfoRow;
}
// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT userEmail, userName, userPassword,count(userId) as count
        FROM User 
        WHERE userEmail = ? AND userPassword = ? and status ='ACTIVATED';`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );
console.log(selectUserPasswordRow,"말안됨");
  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, userId
        FROM User 
        WHERE userEmail = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  console.log(email,"here");
  console.log(selectUserAccountRow[0],"here");
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, params) {
  const updateUserQuery = `
  UPDATE User
  SET userName = ?, userPassword = ?, updatedAt= current_timestamp()
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, params);
  return updateUserRow[0];
}

async function updateUserAccountStatus(connection,params) {
  const updateUserQuery = `
  UPDATE User
  SET status = ?,updatedAt= current_timestamp()
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery,params);
  return updateUserRow[0];
}
async function getUserPasswordCheck(connection,params) {
  const getUserPasswordCheckQuery = `
    select count(userId) as count from User where userId =? and userPassword=? and status ='ACTIVATED';


  `;
  const updateUserRow = await connection.query(getUserPasswordCheckQuery,params);
  return updateUserRow[0];
}

async function selectUserName(connection,userId) {
  const selectUserNameQuery = `

    select ID as userName from User where userId= ? and status ='ACTIVATED';


  `;
  const selectUserNameRow = await connection.query(selectUserNameQuery,userId);
  return selectUserNameRow[0];
}

async function updateUserFriendName(connection,params2) {
  const selectUserNameQuery = `

    UPDATE Friend SET friendName=? where targetId= ? and status ='ACTIVATED';


  `;
  const selectUserNameRow = await connection.query(selectUserNameQuery,params2);
  return selectUserNameRow[0];
}


module.exports = {
  selectUser,
  selectUserEmail,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  updateUserAccountStatus,
  getUserPasswordCheck,
  insertAppleUserInfo,
  selectUserName,
  updateUserFriendName,

};
