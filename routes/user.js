const express = require("express");
const router = express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
//require
const userController=require("../controllers/users.js");

router.route("/signup")
.get( userController.renderSignupForm)//signup form
.post(wrapAsync(userController.signup));//signup

router.route("/login")
.get((userController.renderLoginForm))//login form
.post(saveRedirectUrl,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),userController.login);//login page



router.get("/logout",userController.logout);

module.exports=router;