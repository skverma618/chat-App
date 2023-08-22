const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "images/Profile",
    filename: function (req, file, cb) {
        const userid = req.user._id.toString();
        cb(null, `${userid}.jpg`);
    },
});

const upload = multer({
    storage: storage,
});

module.exports = upload;
