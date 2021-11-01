const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const secret_config = require("../../../config/secret");
const jwt = require("jsonwebtoken");
const userProvider =require("../User/userProvider");

exports.socialSignIn = async function(email){
    try{
        const UserRows = await userProvider.accountCheck(email);
        if(UserRows[0].status === 'UNACTIVATED'){
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT)

        }

        console.log(UserRows[0].userId);

        let token = await jwt.sign(
            {userIdx: UserRows[0].userId,},
            secret_config.jwtsecret,
            {expiresIn: "10m",
                subject:"User",}
        );
        return response(baseResponse.SUCCESS,{'userId':UserRows[0].userId,'jwt':token});


    }catch(err){
        logger.error(`App -socialSignIn Service error\n:  ${err.message}\n ${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);


    }








}