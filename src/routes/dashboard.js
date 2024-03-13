const router=require("express").Router()

const dashboard=require("../controllers/dashboard")

router.post("/savescore",dashboard.saveScore)

router.post("/dashboard",dashboard.overAllScore)

router.post("/weeklyreport",dashboard.weeklyScoreDashboard)


module.exports = router;