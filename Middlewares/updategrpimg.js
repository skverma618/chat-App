const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "images/Profile",
    filename: function (req, file, cb) {
        const groupid = req.body.groupid;
        cb(null, `${groupid}.jpg`);
    },
});

const upload = multer({
    storage: storage,
});

module.exports = upload;
