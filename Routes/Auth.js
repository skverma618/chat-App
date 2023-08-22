const expres = require("express");
const authcontroller = require("../Controllers/Auth");
const { body } = require("express-validator");

const router = expres.Router();

router.post(
    "/register",
    [
        body("name").notEmpty(),
        body("mobileno").isMobilePhone().notEmpty(),
        body("password").isLength({ min: 6 }).notEmpty(),
    ],
    authcontroller.register
);

router.post(
    "/login",
    [
        body("mobileno").isMobilePhone().notEmpty(),
        body("password").isLength({ min: 6 }).notEmpty(),
    ],
    authcontroller.login
);

router.get("/token", authcontroller.getToken);

module.exports = router;
