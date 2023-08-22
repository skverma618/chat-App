const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Message = require("../Models/Message");

const storage = multer.diskStorage({
    destination: "Media",
    filename: function (req, file, cb) {
        const msgid = req.body.msgid;
        const filename = `${file.originalname}`;
        cb(null, filename);
        req.on("aborted", () => {
            const fullFilePath = `Media/${file.originalname}`;
            file.stream.on("end", () => {
                fs.unlink(fullFilePath, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            });
            file.stream.emit("end");
            Message.deleteOne({ _id: msgid });
        });
    },
});

const upload = multer({
    storage: storage,
}).single("media");

module.exports = upload;
