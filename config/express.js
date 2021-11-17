const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');

//var session = require('express-session');
//var MySQLStore = require('express-mysql-session')(session);
//var options ={
//host: 'localhost',
   // host: 'ssacdb.chcwlyzqnyjd.ap-northeast-2.rds.amazonaws.com',
  //  user: 'senya',
 //   port: '3306',
 //   password: '6736dbswn!',
 //   database: 'Dialogue'
//};


module.exports = function () {
    const passport = require("passport");
    var bodyParser = require('body-parser');
    var cookieParser =require('cookie-parser');
    var static = require('serve-static');
    var errorHandler = require('error-handler');

    var expressErrorHandler = require('express-error-handler');
    var expressSession = require('express-session');




    const app = express();


    app.set('port',process.env.PORT || 3000);
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json())
    //app.use('/public',static(path.join(_dirname,'public')));
    app.use(cookieParser());
    app.use(expressSession({
        secret : 'asdfadsf!@#$!$!',
        resave :true,
        saveUninitialized:true,
        cookie : {expires: 60*60*24,},

    }));



    app.use(compression());




    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());
    // app.use(express.static(process.cwd() + '/public'));
   // var sessionStore = new MySQLStore(options);
  //  app.use(session({
   //     secret:"asdfasffdas",
   //     resave:false,
   //     saveUninitialized:true,
   //     store: sessionStore
   //     }))

    /* App (Android, iOS) */
    // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.
    require('../src/app/User/userRoute')(app);
    require('../src/app/Social/socialRoute')(app);
    require('../src/app/Friend/friendRoute')(app);
    require('../src/app/Schedule/scheduleRoute')(app);
    require('../src/app/Team/teamRoute')(app);
    // require('../src/app/Board/boardRoute')(app);

    return app;
};