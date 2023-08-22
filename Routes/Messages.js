const express = require("express");
const messagescontroller = require("../Controllers/Messages");
const isAuth = require("../Middlewares/isAuth");

const router = express.Router();

router.post("/get", isAuth, messagescontroller.getmessages);

router.post("/delete", isAuth, messagescontroller.deletemessage);

router.post("/sendmedia", isAuth, messagescontroller.sendmedia);

router.get("/downloadmedia", isAuth, messagescontroller.downloadmedia);

module.exports = router;
