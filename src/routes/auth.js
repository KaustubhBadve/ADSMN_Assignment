const authrouter = require("express").Router();

const auth = require("../controllers/auth");
const errorValidator = require("../middlewares/validators/user");

authrouter.post("/sendotp", errorValidator.SEND_OTP, auth.sendOtp);

authrouter.post(
  "/registration",
  errorValidator.USER_REGISTRATION,
  auth.userRegistration
);

module.exports = authrouter;
