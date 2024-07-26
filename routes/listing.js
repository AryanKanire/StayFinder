const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/WrapAsyc");
const { isLoggedIn, isOwner } = require("../middelware");
const listingcontroller = require("../controllers/listing");
const multer = require("multer");
const { storage } = require("../cloudconfig");
const upload = multer({ storage });

router
    .route("/")
    .get(wrapasync(listingcontroller.index))
    .post(isLoggedIn,upload.single('listing[image]'), wrapasync(listingcontroller.createlisting)
);

router.get("/new", isLoggedIn, listingcontroller.renderNewform);

router
    .route("/:id")
    .get(wrapasync(listingcontroller.showlisting))
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), wrapasync(listingcontroller.updatelisting))
    .delete(isLoggedIn, isOwner, wrapasync(listingcontroller.deletelisting));

router.get("/:id/edit", isLoggedIn, isOwner, wrapasync(listingcontroller.renderEditform));

module.exports = router;
