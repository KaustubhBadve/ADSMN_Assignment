const { validationResult, body } = require("express-validator");
const response = require("../lib/response");
const constant = require("../constants/constant");
const db = require("../models");
const queryDashboard = require("../lib/queries/dashboard");
const moment = require("moment");

exports.saveScore = async (req, res) => {
  try {
    let errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return response.sendResponse(
        constant.response_code.BAD_REQUEST,
        null,
        null,
        res,
        errors
      );
    }

    const token = req.token;
    let userId = token?.id;
    let body = req?.body;
    const date = moment().startOf("day");
    const start = date.valueOf();
    const end = moment(date).endOf("day").valueOf();

    const checkLimit = await db.sequelize.query(
      `SELECT
        COUNT(*) AS scoreCount
      FROM
        scoremaster
      WHERE
        userId = :userId
        AND createdAt BETWEEN :start
        AND :end`,
      {
        nest: true,
        mapToModel: true,
        replacements: {
          start,
          end,
          userId,
        },
      }
    );

    const scoreCount = checkLimit[0]?.scoreCount;

    if (scoreCount >= 3) {
      return response.sendResponse(
        constant.response_code.BAD_REQUEST,
        "Maximum 3 scores can be added per day",
        null,
        res,
        null
      );
    }

    await queryDashboard.createScore({ userId, score: body?.score });

    return response.sendResponse(
      constant.response_code.SUCCESS,
      null,
      null,
      res,
      null
    );
  } catch (err) {
    console.log(err);
    return response.sendResponse(
      constant.response_code.INTERNAL_SERVER_ERROR,
      err.message || constant.STRING_CONSTANTS.SOME_ERROR_OCCURED,
      null,
      res
    );
  }
};

exports.overAllScore = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

exports.weeklyScoreDashboard = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};
