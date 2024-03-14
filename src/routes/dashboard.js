const router = require("express").Router();
const validateToken = require("../middlewares/authorization");
const errorValidator = require("../middlewares/validators/dashboard");
const dashboard = require("../controllers/dashboard");

router.post(
  "/savescore",
  validateToken(),
  errorValidator.SUBMIT_SCORE,
  dashboard.saveScore
);

router.get("/userprogress", validateToken(), dashboard.overAllScore);

router.post("/weeklyreport", validateToken(), dashboard.weeklyScoreDashboard);

module.exports = router;
