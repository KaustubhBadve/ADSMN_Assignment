const authrouter = require("express").Router();

const auth = require("../controllers/auth");
const errorValidator = require("../middlewares/validators/user");

// route to send static otp
authrouter.post("/sendotp", errorValidator.SEND_OTP, auth.sendOtp);

// route for user registration
authrouter.post(
  "/registration",
  errorValidator.USER_REGISTRATION,
  auth.userRegistration
);

// route for user login
authrouter.post(
  "/login",
  errorValidator.USER_LOGIN,
  auth.userLogin
);

module.exports = authrouter;
