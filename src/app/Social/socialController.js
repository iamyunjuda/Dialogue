const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const AppleStrategy = require('passport-apple');
const socialService = require("./socialService");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userProvider =require("../User/userProvider");
const userService =require("../User/userService");
const {errResponse, response} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
//const AppleStrategy = require("passport-apple");

passport.use('kakao-login', new KakaoStrategy({
        clientID: 'faf8536f6684556c4a15623c70a54698',
        clientSecret: '39unbvMrBxfi6UgANWTUu1GEIPaackDy',
        callbackURL: 'http://localhost:3000/app/social/kakao/callback',
        },
    async (accessToken, refreshToken, profile, done) => {   console.log(accessToken);  console.log(done); console.log(profile);}));

/*


passport.use('apple-login',new AppleStrategy(
    {
        clientID: "com.senya.dialogue",
        teamID:"69F5355JYF",
        callbackURL: "http://localhost:3000/app/login/apple/callback",
        keyID: "V9JQU3C66Z",
        privateKeyLocation: 'AuthKey_V9JQU3C66Z.p8',
        passReqToCallback: true

    },function(req, accessToken, refreshToken, idToken, profile, cb) {
        // The idToken returned is encoded. You can use the jsonwebtoken library via jwt.decode(idToken)
        // to access the properties of the decoded idToken properties which contains the user's
        // identity information.
        // Here, check if the idToken.sub exists in your database!
        // idToken should contains email too if user authorized it but will not contain the name
        // `profile` parameter is REQUIRED for the sake of passport implementation
        // it should be profile in the future but apple hasn't implemented passing data
        // in access token yet https://developer.apple.com/documentation/sign_in_with_apple/tokenresponse
        cb(null, idToken);
    }));*/


passport.use('apple-login',new AppleStrategy(
    {
        clientID: "com.sen.dialogue",
        teamID:"69F5355JYF",
        callbackURL: "https://dev.senya.today/app/login/apple/callback",
        keyID: "V9JQU3C66Z",
        privateKeyLocation: './AuthKey_V9JQU3C66Z.p8',
        passReqToCallback: true

    },function(req, accessToken, refreshToken, idToken, profile, cb) {

        console.log(profile);

        console.log(cb);
        // The idToken returned is encoded. You can use the jsonwebtoken library via jwt.decode(idToken)
        // to access the properties of the decoded idToken properties which contains the user's
        // identity information.
        // Here, check if the idToken.sub exists in your database!
        // idToken should contains email too if user authorized it but will not contain the name
        // `profile` parameter is REQUIRED for the sake of passport implementation
        // it should be profile in the future but apple hasn't implemented passing data
        // in access token yet https://developer.apple.com/documentation/sign_in_with_apple/tokenresponse
        cb(null, idToken);
    }));



    //async (accessToken, refreshToken, profile, done) => { console.log(accessToken); console.log(profile); }));


exports.socialAuth = async function (req, res) {


    console.log("hello");
    const email = req.user.email;
    const emailRows = await userProvider.emailCheck(email);
    if(emailRows.length<1){
        const keyOne = crypto.randomBytes(256).toString('hex').substr(100,10);
        const keyTwo = crypto.randomBytes(256).toString('base64').substr(50,10);
        const password =keyOne + keyTwo;

        const signUpResponse = await userService.createUser(email,password,user.nickname,email);


        return res.send(signUpResponse);

    }
    else{
        const signInResponse = await socialService.socialSignIn(email);
        return res.send(signInResponse);

    }






};
exports.userLogin = async function (req, res) {

    const email = req.body.email;
    const nickname = email.split('@');
    const emailRows = await userProvider.emailCheck(email);
    if(emailRows.length<1){


        const signUpResponse = await userService.createAppleUser(email,nickname[0]);

        return res.send(signUpResponse);

    }
    else{
        const signInResponse = await socialService.socialSignIn(email);
        return res.send(signInResponse);

    }






};


/*


module.exports = {






    socialAuth: async (req,res)=>{

        console.log("hello");
        const email = req.user.email;
        const emailRows = await userProvider.emailCheck(email);
        if(emailRows.length<1){
            const keyOne = crypto.randomBytes(256).toString('hex').substr(100,10);
            const keyTwo = crypto.randomBytes(256).toString('base64').substr(50,10);
            const password =keyOne + keyTwo;

            const signUpResponse = await userService.createUser(email,password,user.nickname,email);


            return res.send(signUpResponse);

        }
        else{
            const signInResponse = await socialService.socialSignIn(email);
            return res.send(signInResponse);

        }





    }


};*/