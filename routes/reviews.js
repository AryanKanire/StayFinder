const express = require("express");
const router = express.Router({mergeParams:true});  //it gets data from app.js rote ex- id
const wrapasync = require("../utils/WrapAsyc");
const { isLoggedIn,isReviewAuthor } = require("../middelware");
const reviewcontroller = require("../controllers/reviews")

router.post("/",isLoggedIn,wrapasync(reviewcontroller.createreview));

router.post("/:reviewId",isLoggedIn,isReviewAuthor, wrapasync(reviewcontroller.destroyreview))


module.exports = router;