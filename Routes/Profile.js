const express = require("express");
const isAuth = require("../Middlewares/isAuth");
const { body } = require("express-validator");
const profilecontroller = require("../Controllers/Profile");
const upload = require("../Middlewares/upload");

const router = express.Router();

router.post(
    "/updatefield",
    isAuth,
    [body("mobileno").optional().isMobilePhone()],
    profilecontroller.updateprofilefields
);

router.post(
    "/updateimg",
    isAuth,
    upload.single("image"),
    profilecontroller.updateprofileimg
);

module.exports = router;
