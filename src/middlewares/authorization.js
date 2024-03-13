const response = require("../lib/response");
const constant = require("../constants/constant");
const jwt = require("jsonwebtoken");

const validateToken = () => (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    token = token.substring(7);
    jwt.verify(token, constant.JWT_SECRET, (err, decoded) => {
      if (err) {
        return response.sendResponse(
          constant.response_code.UNAUTHORIZED,
          constant.STRING_CONSTANTS.INVALID_AUTHORIZATION,
          null,
          res,
          null
        );
      } else {
        req.token={id:decoded?.id}
        return next();
      }
    });
  } else {
    return response.sendResponse(
      constant.response_code.UNAUTHORIZED,
      constant.STRING_CONSTANTS.INVALID_AUTHORIZATION,
      null,
      res,
      null
    );
  }
};

module.exports = validateToken;
