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
      "Score updated",
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

exports.overAllScore = async (req, res) => {
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

    const data = await db.sequelize.query(
      `SELECT
            totalScore,
            userRank
        FROM (
            SELECT
                userId,
                SUM(score) AS totalScore,
                RANK() OVER (ORDER BY SUM(score) DESC) AS userRank
            FROM
                scoremaster 
            GROUP BY
                userId
        ) AS temp
        WHERE
            userId = :userId`,
      {
        nest: true,
        mapToModel: true,
        replacements: {
          userId,
        },
      }
    );

    if (!data.length) {
      return response.sendResponse(
        constant.response_code.BAD_REQUEST,
        "No data found",
        null,
        res,
        null
      );
    }

    return response.sendResponse(
      constant.response_code.SUCCESS,
      null,
      data[0],
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

exports.weeklyScoreDashboard = async (req, res) => {
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

    const data = await db.sequelize.query(
      `SELECT
            json_arrayagg(
              json_object(
                "weekNo",
                weekNo,
                "totalScore",
                totalScore,
                "rank",
                userRank
              )
            ) as weeks
          FROM
            (
              SELECT
                weekNo,
                totalScore,
                userId,
                RANK() OVER (
                  PARTITION BY weekNo
                  ORDER BY
                    totalScore DESC
                ) AS userRank
              FROM
                (
                  SELECT
                    userId,
                    DATEDIFF(FROM_UNIXTIME(createdAt / 1000), '2024-03-01') DIV 7 + 1 AS weekNo,
                    SUM(score) AS totalScore
                  FROM
                    scoremaster
                  WHERE
                    createdAt > 1709231400000
                  GROUP BY
                    userId,
                    DATEDIFF(FROM_UNIXTIME(createdAt / 1000), '2024-03-01') DIV 7 + 1
                ) AS weeklyScores
            ) AS rankedScores
          WHERE
            userId = 1
          ORDER BY
            weekNo ASC;`,
      {
        nest: true,
        mapToModel: true,
        replacements: {
          userId,
        },
      }
    );

    if (data?.length && !data[0].weeks) {
      return response.sendResponse(
        constant.response_code.BAD_REQUEST,
        "No data found",
        null,
        res,
        null
      );
    }

    return response.sendResponse(
      constant.response_code.SUCCESS,
      null,
      data[0],
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
