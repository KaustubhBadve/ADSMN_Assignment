const { check } = require("express-validator");

const Errors = {
  SEND_OTP: [
    check(
      "mobileNo",
      "Mobile Number should be numeric and length must be 10 digit"
    )
      .isNumeric()
      .isInt({ gt: 999999999 })
      .notEmpty()
      .isLength({ min: 10, max: 10 }),
  ],
  USER_REGISTRATION: [
    check(
      "mobileNo",
      "Mobile Number should be numeric and length must be 10 digit"
    )
      .isNumeric()
      .isInt({ gt: 999999999 })
      .notEmpty()
      .isLength({ min: 10, max: 10 }),
    check("email", "Email should not be empty").notEmpty().isEmail(),
    check("DOB", "Date of birth should be in valid format (DD-MM-YYYY)")
      .notEmpty()
      .isDate({ format: "DD-MM-YYYY" }),
    check("otp", "OTP should be numeric and length must be 4 digit")
      .isNumeric()
      .isInt({ gt: 999 })
      .notEmpty()
      .isLength({ min: 4, max: 4 }),
  ],
  USER_LOGIN: [
    check(
      "mobileNo",
      "Mobile Number should be numeric and length must be 10 digit"
    )
      .isNumeric()
      .isInt({ gt: 999999999 })
      .notEmpty()
      .isLength({ min: 10, max: 10 }),
    check("otp", "OTP should be numeric and length must be 4 digit")
      .isNumeric()
      .isInt({ gt: 999 })
      .notEmpty()
      .isLength({ min: 4, max: 4 }),
  ],
};
module.exports = Errors;
