const { validationResult, body } = require("express-validator");
const response = require("../lib/response");
const constant = require("../constants/constant");
const query = require("../lib/queries/users");
const jwt = require("jsonwebtoken");

exports.sendOtp = async (req, res) => {
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
    let body = req?.body;
    const otp = "1234";
    const expiryTime = Date.now() + 60 * 1000;

    let alreadyExists = await query.findMobileNo(body?.mobileNo);

    if (alreadyExists) {
      await query.updateInVerificationMaster(
        { otp, otpGeneratedAt: expiryTime },
        { mobileNo: body?.mobileNo }
      );
    } else {
      await query.createEntryInVerificationMaster({
        otp,
        mobileNo: body?.mobileNo,
        otpGeneratedAt: expiryTime,
      });
    }

    return response.sendResponse(
      constant.response_code.SUCCESS,
      "Otp Sent",
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

exports.userRegistration = async (req, res) => {
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
    let body = req?.body;

    let alreadyExists = await query.findUser(body?.mobileNo);

    if (alreadyExists) {
      errors.errors.push({
        msg: `User already exists with mobileNo ${body?.mobileNo}`,
      });
      return response.sendResponse(
        constant.response_code.BAD_REQUEST,
        null,
        null,
        res,
        errors
      );
    } else {
      let alreadyExistsOtp = await query.findMobileNo(body?.mobileNo);
      if (!alreadyExistsOtp || alreadyExistsOtp?.otp !== body?.otp) {
        errors.errors.push({
          msg: `Invalid OTP`,
        });
        return response.sendResponse(
          constant.response_code.BAD_REQUEST,
          null,
          null,
          res,
          errors
        );
      }

      const otpGeneratedAt = alreadyExistsOtp?.otpGeneratedAt;
      const timeDiff = Date.now() - otpGeneratedAt;
      const oneMinuteInMillis = 60 * 1000;
      if (timeDiff >= oneMinuteInMillis) {
        errors.errors.push({
          msg: `OTP expired`,
        });
        return response.sendResponse(
          constant.response_code.BAD_REQUEST,
          null,
          null,
          res,
          errors
        );
      }


      let userDetails = {
        name: body?.name,
        email: body.email,
        mobileNo: body?.mobileNo,
      };
      let newUser = await query.createUser(userDetails);
      userDetails = {
        ...userDetails,
        id:newUser?.id,
      };
      token = await genNewToken(userDetails, res);
      return response.sendResponse(
        constant.response_code.SUCCESS,
        "Registration Succesfull",
        token,
        res,
        null
      );
    }
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

const genNewToken = async (payload, res) => {
  try {
    var token = jwt.sign(payload, constant.JWT_SECRET, {
      expiresIn: 432000,
    });
    return token;
  } catch (err) {
    console.log(`Error in generating token: ${err}`);
    return response.sendResponse(
      constant.response_code.INTERNAL_SERVER_ERROR,
      "Error in generating token",
      null,
      res
    );
  }
};
