module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"사용자 이름은 최대 15자리를 입력해주세요." },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },

    SCHEDULE_ACTIVATEDTIME_EMPTY : { "isSuccess": false, "code": 2019, "message": "일정 시작 시간을 입력해주세요" },
    SCHEDULE_ACTIVATEDAY_EMPTY : { "isSuccess": false, "code": 2020, "message": "일정 시작 날짜를 입력해주세요" },
    SCHEDULE_ENDTIME_EMPTY: { "isSuccess": false, "code": 2021, "message": "일정 마무리 시간을 입력해주세요" },
    SCHEDULE_COURSEDAY_EXIST: { "isSuccess": false, "code": 2022, "message": "요일이 잘못 되었습니다." },

    FRIENDNAME_EMPTY : { "isSuccess": false, "code": 2023, "message": "친구의 이름을 입력해주세요" },
    FRIENDREQUESTID_EMPTY : { "isSuccess": false, "code": 2024, "message": "친구요청 Id를 입력해주세요" },
    FRIENDID_EMPTY: { "isSuccess": false, "code": 2025, "message": "친구의 Id를 입력해주세요" },
    USER_NAME_LENGTH : { "isSuccess": false, "code": 2026, "message": "친구의 이름을 15자 내로 입력해주세요" },
    //USER_NAME_EMPTY : { "isSuccess": false, "code": 2027, "message": "친구의 이름을 입력해주세요" },
    ADD_MEMBER : { "isSuccess": false, "code": 2027, "message": "팀원을 추가해주세요" },
    TEAM_NAME_EMPTY : { "isSuccess": false, "code": 2028, "message": "팀 이름을 입력하세요" },
    TEAM_DUEDATE_EMPTY : { "isSuccess": false, "code": 2029, "message": "일정 종료 시간을 입력하세요" },
    TEAM_NAME_LENGTH : { "isSuccess": false, "code": 2030, "message": "팀 이름을 30자 이내로 입력하세요" },
    SIGNUP_REDUNDANT_USERID: { "isSuccess": false, "code": 2031, "message": "존재하는 아이디입니다." },
    TEAM_TEAMID_EMPTY: { "isSuccess": false, "code": 2032, "message": "팀ID를 입력해주세요" },
    SCHEDULE_COURSENAME_EMPTY : { "isSuccess": false, "code": 2033, "message": "팀 일정 이름을 입력해주세요." },
    SCHEDULE_TEAMSCHEDULEID_EMPTY: { "isSuccess": false, "code": 2034, "message": "팀일정Id를 입력해주세요." },
    LOGIN_ALREADY_DONE: { "isSuccess": false, "code": 2035, "message": "이미 로그인이 완료되었습니다." },
    LOGGED_OUT: { "isSuccess": true, "code": 2035, "message": "로그아웃 되었습니다." },
    LOGIN_NOT_DONE: { "isSuccess": false, "code": 2036, "message": "로그인이 되어있지 않습니다." },
    LOGGED_IN:  { "isSuccess": true, "code": 2037, "message": "로그인 성공했습니다." },
    FRIENDID_LENGTH:{ "isSuccess": false, "code": 2038, "message": "팀원은 2명 이상이어야합니다." },


    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },
    TIME_HOUR_ERROR: { "isSuccess": false, "code": 3012, "message": "시간 범위가 잘못되었습니다." },
    TIME_MIN_ERROR: { "isSuccess": false, "code": 3013, "message": "분 범위가 잘못되었습니다." },
    FRIEND_REQUEST_EXIST : { "isSuccess": false, "code": 3014, "message": "이미 전송된 친구 요청입니다." },
    FRIEND_USER_UNACTIVATED: { "isSuccess": false, "code": 3015, "message": "비활성화된 유저입니다. 친구Id를 확인해보세요" },
    FRIEND_REQUEST_NOT_EXIST : { "isSuccess": false, "code": 3016, "message": "존재하지 않는 친구 요청입니다." },
    ALREADY_FRIEND_ERROR: { "isSuccess": false, "code": 3017, "message": "이미 친구 관계입니다" },
    FRIEND_LIST_NOT_EXIST: { "isSuccess": false, "code": 3018, "message": "해당 Id와 친구가 아닙니다." },
    SCHEDULE_EXIST: { "isSuccess": false, "code": 3007, "message": "해당 시간에 스케줄이 이미 존재합니다." },
    SCHEDULE_ERROR: { "isSuccess": false, "code": 3008, "message": "일정 시간을 다시 확인 해 주세요" },//Connection, Transaction 등의 서버 오류
    USER_UNACTIVATED:  { "isSuccess": false, "code": 3009, "message": "비활성화된 유저입니다." },
    SCHEDULE_NOT_EXIST :{ "isSuccess": false, "code": 3010, "message": "존재하지 않는 스케줄 입니다." },
    FRIEND_NOT_EXIST :  { "isSuccess": false, "code": 3011, "message": "존재하지 않는 친구 아이디입니다." },
    FRIEND_REQUEST_NOT_POSSIBLE :{ "isSuccess": false, "code": 3019, "message": "해당 유저에게 친구 요청을 할 수 없습니다." },
    USERID_NOT_A_LEADER:{ "isSuccess": false, "code": 3020, "message": "해당 유저에게 일정관리 권한이 없습니다. " },
    TEAM_UNACTIVATED:{ "isSuccess": false, "code": 3021, "message": "팀이 비활성화 되었습니다.  " },
    SCHEDULE_CHANGE_NOT_ALLOWED:{ "isSuccess": false, "code": 3022, "message": "팀 일정은 방장만 수정가능합니다." },
    TEAM_TEAMID_NOT_EXIST :{ "isSuccess": false, "code": 3023, "message": "해당 TEAMID가 존재하지 않습니다." },
    TEAM_NOT_ALLOWED  :{ "isSuccess": false, "code": 3024, "message": "해당 유저는 팀정보 변경 권한이 없습니다." },
    PASSWORD_NOT_MATCH:{ "isSuccess": false, "code": 3025, "message": "잘못된 비밀번호입니다." },
    DATE_ERROR:{ "isSuccess": false, "code": 3026, "message": "날짜가 잘못되었습니다." },

    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
