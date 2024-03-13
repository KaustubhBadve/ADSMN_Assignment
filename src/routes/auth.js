const router=require("express").Router()


const auth=require("../controllers/auth")

router.post("/sendotp",auth.sendOtp)

router.post("/registration",auth.userRegistration)


module.exports = router;