const passport =require('passport');
//const KakaoStrategy = require('passport-kakao').Strategy;

const social = require("./socialController");
const jwt = require('jsonwebtoken');
const AppleStrategy = require('passport-apple');

const bodyParser = require("body-parser");
const fs = require('fs');
const {Strategy: KakaoStrategy} = require("passport-kakao");
//const AppleAuth = require('apple-auth');
//const config = fs.readFileSync('src/app/Social/config.json');

//const AppleAuth = require('apple-auth');
//const config = fs.readFileSync('./config.json');
//const auth = new AppleAuth(config, './config/AuthKey.p8');
/*const appleStrategyOpt = {
    clientID: "com.senya.dialogue",
    teamID:"69F5355JYF",
    callbackURL: "https://dev.senya.today/app/login/apple/callback",
    keyID: "V9JQU3C66Z",
    privateKeyLocation: 'AuthKey_V9JQU3C66Z.p8'

};
8*/

passport.use('apple-login',new AppleStrategy(
    {
        clientID: "com.sen.dialogue",
        teamID:"69F5355JYF",
        callbackURL: "https://dev.senya.today/app/login/apple/callback",
        keyID: "V9JQU3C66Z",
        privateKeyLocation: './AuthKey_V9JQU3C66Z.p8',
        passReqToCallback: true

    }, function(accessToken, refreshToken, idToken, profile, cb) {
        // Here, check if the idToken exists in your database!
        console.log(idToken,profile);
        cb(null, idToken);
    }));


module.exports = function(app){
    const social = require('./socialController.js');
    const passport =require('passport');
    //const KakaoStrategy = require('passport-kakao').Strategy;

    passport.use('kakao-login', new KakaoStrategy({
            clientID: 'faf8536f6684556c4a15623c70a54698',
            clientSecret: '39unbvMrBxfi6UgANWTUu1GEIPaackDy',
            callbackURL: 'http://localhost:3000/app/social/kakao/callback',
        },
        async (accessToken, refreshToken, profile, done) => {   console.log(accessToken);  console.log(done); console.log(profile);}));



    app.get('/app/login/kakao', passport.authenticate('kakao-login',{session:false}));
    app.get('/app/social/kakao/callback',
        passport.authenticate('kakao-login',{session:false}),social.socialAuth);



       //let auth = new AppleAuth(config, fs.readFileSync('src/app/Social/AuthKey_V9JQU3C66Z.p8').toString(), 'text');
       app.get('/app/login/apple', passport.authenticate('apple-login'));

 //   app.post('/app/login/apple/callback',
        //passport.authenticate('apple-login', {session:false}),social.socialAuth);


    app.post('/app/login/apple/callback', (req, res, next) => {
        passport.authenticate('apple-login', (err, profile) => {
            /**
             * profile 변수에는 AppleStrategy callback에서 넘겨주는 decodedIdToken의 값이 담긴다.

             */
console.log(profile);
            req.profile = profile;
            next();
        },social.socialAuth)(req, res, next);
    });

            /*
            (req, res, next) => {
            (err, profile) => {


            console.log(profile);
            req.profile = profile;
            console.log(profile);
            next();
        },social.socialAuth)(req, res, next);
    });

/*
    app.post('/app/login/apple/callback',
        function(req, res, next) {
            passport.authenticate('apple', function(err, user, info) {
                if (err) {
                    if (err == "AuthorizationError") {
                        res.send("Oops! Looks like you didn't allow the app to proceed. Please sign in again! <br /> \
                <a href=\"/login\">Sign in with Apple</a>");
                    } else if (err == "TokenError") {
                        res.send("Oops! Couldn't get a valid token from Apple's servers! <br /> \
                <a href=\"/login\">Sign in with Apple</a>");
                    }
                } else {
                    res.json(user);
                }
            },social.socialAuth)(req, res, next);
        });*/
/*
    app.post('/app/login/apple/callback', bodyParser(), async (req, res) => {
        try {
            console.log( Date().toString() + "GET /auth");
            const response = await auth.accessToken(req.body.code);
            const idToken = jwt.decode(response.id_token);

            const user = {};
            user.id = idToken.sub;

            if (idToken.email) user.email = idToken.email;
            if (req.body.user) {
                const { name } = JSON.parse(req.body.user);
                user.name = name;
            }

            res.json(user);
        } catch (ex) {
            console.error(ex);
            res.send("An error occurred!");
        }
    });

    app.get('/app/login/apple', async (req, res) => {
        try {
            console.log( Date().toString() + "GET /refresh");
            const accessToken = await auth.refreshToken(req.query.refreshToken);
            res.json(accessToken);
        } catch (ex) {
            console.error(ex);
            res.send("An error occurred!");
        }
    });

    app.get("/", (req, res) => {
        console.log( Date().toString() + "GET /");
        res.send(`<a href="${auth.loginURL()}">Sign in with Apple</a>`);
    });

    app.get('/token', (req, res) => {
        res.send(auth._tokenGenerator.generate());
    });

    app.get('/refresh', async (req, res) => {
        try {
            console.log( Date().toString() + "GET /refresh");
            const accessToken = await auth.refreshToken(req.query.refreshToken);
            res.json(accessToken);
        } catch (ex) {
            console.error(ex);
            res.send("An error occurred!");
        }
    });
*/
}