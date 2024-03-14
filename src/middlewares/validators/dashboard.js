const { check } = require("express-validator");

const Errors = {
  SUBMIT_SCORE: [
    check("score", "Score should be numeric")
      .isNumeric()
      .isInt({ min: 50, max: 500 })
      .withMessage("Score should be in between 50 to 500")
      .notEmpty()
      .withMessage("Score should not be empty"),
  ],
};
module.exports = Errors;
