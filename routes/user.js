const express = require("express");
const router = express.Router();
const User = require("../models/user");
const WrapAsyc = require("../utils/WrapAsyc");
const passport = require("passport");
const { saveUrl } = require("../middelware");
const usercontroller = require("../controllers/user");

router.get("/signup",usercontroller.rendersignup);

router.post("/signup",WrapAsyc(usercontroller.registeruser))

router.get("/login", usercontroller.renderlogin);

router.post("/login",
    saveUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
    usercontroller.loginuser);

router.get("/logout",usercontroller.logout)

module.exports = router;