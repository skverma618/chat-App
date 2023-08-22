const express = require("express");
const isAuth = require("../Middlewares/isAuth");
const upload = require("../Middlewares/uploadgrp");
const grpcontroller = require("../Controllers/Group");
const updategrpimg = require("../Middlewares/updategrpimg");

const router = express.Router();

router.post("/add", isAuth, upload.single("image"), grpcontroller.addGroup);

router.post("/exit", isAuth, grpcontroller.exitgroup);

router.post("/clearchat", isAuth, grpcontroller.clearchat);

router.post("/remove", isAuth, grpcontroller.removemember);

router.post("/makeadmin", isAuth, grpcontroller.makeadmin);

router.post("/dismissadmin", isAuth, grpcontroller.dismissadmin);

router.post("/updatefield", isAuth, grpcontroller.updategroupfields);

router.post(
    "/updateimg",
    isAuth,
    updategrpimg.single("image"),
    grpcontroller.updategrpimage
);

module.exports = router;
