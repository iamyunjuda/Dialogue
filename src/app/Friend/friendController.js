const jwtMiddleware = require("../../../config/jwtMiddleware");
const friendProvider = require("../../app/Friend/friendProvider");
const friendService = require("../../app/Friend/friendService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */