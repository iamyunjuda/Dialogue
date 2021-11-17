const user = require("./userController");
const jwtMiddleware = require("../../../config/jwtMiddleware");
const passport = require("../../../config/passport-session");
const {response} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const regexEmail = require("regex-email");
const userService = require("../../app/User/userService");

module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');






    app.get('/errors/1',user.alreadyLogin);
    app.get('/seccess/1',user.loggedOut);
    app.get('/seccess/1',user.loggedIn);
    app.get('/errors/2',user.notLogin);
    // 1. 유저 생성 (회원가입) API
    app.post('/app/users', user.postUsers);

    // 2. 로그인
    // 로그인 하기 API (JWT 생성)
  //app.post('/app/login', user.login);


    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers);


    //회원 삭제
    app.patch('/app/users/:userId/states?status=', jwtMiddleware, user.patchUsersStatus);

        // 현재 비밀번호 체크하기
    app.get('/app/users/:userId/password', jwtMiddleware, user.getUserPassword);

    app.get('/app/login/checks',(req,res)=>{
        if(req.session.loginData){
            res.send({loggedIn:true, loginData: req.session.loginData})

        }else{
            res.send({loggedIn:false})

        }

    })


    app.route('/app/login')
        .post(async function(req, res){
            const {userEmail, userPassword} = req.body;

            if (!userEmail)
                return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
            if (!userPassword)
                return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

            // 길이 체크
            if (userEmail.length > 50)
                return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
            if (userPassword.length > 20)
                return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

            // 형식 체크 (by 정규표현식)
            if (!regexEmail.test(userEmail))
                return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));


            const signInResponse = await userService.postSignIn(userEmail, userPassword);
            if(signInResponse.isSuccess != true){
                return res.send(signInResponse);

            }


            //req.session.save(function(){
            //  res.redirect('/');
            //});




            var paramId = req.body.userEmail;
            var paramPassword = req.body.userPassword;

            //console.log(req.session.user,"afaf");
            if(req.session.user){
                signInResponse.login="Already logged in";
                console.log("이미 로그인");
                //res.redirect('/errors/1');
                return res.send(signInResponse);
            }
            else{
                req.session.user={
                    id:paramId,
                    name: 'hi',
                    authorized:true

                };
                signInResponse.login ="success";
                return res.send(signInResponse);
                //return res.send(signInResponse);
                res.end();

            }




        });

    app.route('/app/logout').get(function(req,res){
        console.log('로그아운 호출');
        const result={};
        if(req.session.user){
            console.log('로그아웃합니다.');
            result.logout ="로그아웃합니다";
            req.session.destroy(function(err){
                if(err){throw err;}
                console.log('세션삭제완료');
                result.result ="세션삭제완료";
                return res.send(result);
                res.end();
            });

        }else{
            console.log("로그인 안됨");
            result.result = '로그인 안됨';
            console.log(result);
            return res.send(result);
            res.end();

        }


    });
    app.get('/app/auto-login', jwtMiddleware, user.check);
};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API


// TODO: 탈퇴하기 API