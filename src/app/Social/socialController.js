const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const socialService = require("./socialService");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userProvider =require("../User/userProvider");
const userService =require("../User/userService");
passport.use('kakao-login', new KakaoStrategy({
        clientID: 'faf8536f6684556c4a15623c70a54698',
        callbackURL: 'http://localhost:3000/app/social/kakao/callback',},
    async (accessToken, refreshToken, profile, done) => { console.log(accessToken); console.log(profile); }));



module.exports = {
    socialAuth: async (req,res)=>{
        const email = req.user.email;
        const emailRows = await userProvider.emailCheck(email);
        if(emailRows.length<1){
            const keyOne = crypto.randomBytes(256).toString('hex').substr(100,10);
            const keyTwo = crypto.randomBytes(256).toString('base64').substr(50,10);
            const password =keyOne + keyTwo;

            const signUpResponse = await userService.createUser(email,password,'010456789',user.nickname,'1999-04-02');
            return res.send(signUpResponse);

        }
        else{
            const signInResponse = await socialService.socialSignIn(email);
            return res.send(signInResponse);

        }





    }


};