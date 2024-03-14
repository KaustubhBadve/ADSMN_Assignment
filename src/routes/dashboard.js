const router = require("express").Router();
const validateToken = require("../middlewares/authorization");
const errorValidator = require("../middlewares/validators/dashboard");
const dashboard = require("../controllers/dashboard");

// route to save score of user
router.post(
  "/savescore",
  validateToken(),
  errorValidator.SUBMIT_SCORE,
  dashboard.saveScore
);

// route to fetch overall user progress
router.get("/userprogress", validateToken(), dashboard.overAllScore);

// route to fetch weekly report
router.get("/weeklyreport", validateToken(), dashboard.weeklyScoreDashboard);

module.exports = router;
