const passport =require('passport');
//const KakaoStrategy = require('passport-kakao').Strategy;
const social = require("./socialController");
module.exports = function(app){
    const social = require('./socialController.js');

    app.get('/app/login/kakao', passport.authenticate('kakao-login',{session:false}));
    app.get('/app/login/kakao/callback',
        passport.authenticate('kakao-login',{session:false}),social.socialAuth);





}