const friendController = require("./friendController");
const friend = require("./friendController");
const jwtMiddleware = require("../../../config/jwtMiddleware");
module.exports = function(app){
    const friend = require('./friendController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    // app.get('/app/test', user.getTest)
//주석 추가


    //9. 친구 신청하기
    app.post('/app/userIds/:userId/friends',jwtMiddleware,friend.postFriendSend);
    //10. 친구 요청 수락하기 --> 요청을 받는 사람이 진행하는 과정임
    app.post('/app/userIds/:userId/friends/checks', jwtMiddleware,friend.postFriendRequestAccept);
    //11. 친구 이름 바꾸기
    app.patch('/app/userIds/:userId/friends', jwtMiddleware,friend.patchFriendName);
    //12. 친구 차단하기
    app.patch('/app/userIds/:userId/friends/blocks', jwtMiddleware,friend.blocksFriend);
    //13 친구 삭제
    app.patch('/app/userIds/:userId/friends/unfriends', jwtMiddleware,friend.unfriendsFriend);
    //14. 친구 목록 불러오기
    app.get('/app/userIds/:userId/friends',jwtMiddleware,friend.getFriendList);
    //15.친구 검색하기
    app.get('/app/userIds/:userId/lists/friends',jwtMiddleware,friend.searchFriendByName);

};

