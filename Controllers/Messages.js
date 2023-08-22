const Messages = require("../Models/Message");
const upload = require("../Middlewares/uploadmedia");
const GrpMsgs = require("../Models/GrpMsg");
const path = require("path");
const fs = require("fs");

exports.getmessages = async (req, res, next) => {
    try {
        const { userid, contactid, skip, type } = { ...req.body };
        if (type === "contact") {
            const msgs = await Messages.find({
                $or: [
                    {
                        senderid: userid,
                        recieverid: contactid,
                        deletedby: { $ne: req.user._id },
                    },
                    {
                        senderid: contactid,
                        recieverid: userid,
                        deletedby: { $ne: req.user._id },
                    },
                ],
            })
                .sort({ _id: -1 })
                .skip(skip)
                .limit(25);
            msgs.reverse();
            const data = { msgs: msgs, contactid: contactid };
            res.send(data);
        } else if (type === "group") {
            console.log(contactid);
            const msgs = await GrpMsgs.find({
                groupid: contactid,
                deletedby: { $ne: req.user._id },
            })
                .sort({ _id: -1 })
                .skip(skip)
                .limit(25);
            msgs.reverse();
            const data = { msgs: msgs, contactid: contactid };
            res.send(data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("server error please try again");
    }
};

exports.deletemessage = async (req, res, next) => {
    try {
        const { id, type } = { ...req.body };
        if (type === "contact") {
            await Messages.updateOne(
                { _id: id },
                { $push: { deletedby: req.user._id } }
            );
            res.send("message deleted");
        } else if (type === "group") {
            await GrpMsgs.updateOne(
                { _id: id },
                { $push: { deletedby: req.user._id } }
            );
            res.send("message deleted");
        }
    } catch (error) {
        res.status(500).send("server error please try again");
    }
};

exports.sendmedia = (req, res, next) => {
    const sendmediasupport = async () => {
        try {
            if (req.file) {
                const msgid = req.body.msgid;
                console.log(req.file.path);
                const url =
                    `${process.env.serverdomain}${req.file.path}`.replace(
                        /\\/g,
                        "/"
                    );

                let size = `${Math.round(req.file.size / (1024 * 1024))}MB`;
                let path = req.file.path.replace(/\\/g, "/");
                if (size === "0MB") {
                    size = `${Math.round(req.file.size / 1024)}KB`;
                }
                if (size === "0KB") {
                    size = `${req.file.size}B`;
                }
                await Messages.updateOne(
                    { _id: msgid },
                    {
                        $set: {
                            "media.url": url,
                            "media.name": req.file.originalname,
                            "media.size": size,
                            "media.path": path,
                            status: "send to server",
                        },
                    }
                );
                const message = await Messages.findById(msgid);
                const io = require("../socket").getIo();
                const users = require("../socket-events").users;
                const recieverid = req.body.recieverid;
                const recsocid = users.get(recieverid);
                if (recsocid) {
                    io.to(recsocid).emit("recieve-media", message);
                }
                res.send("media send");
            } else {
                res.status(422).send("file not found");
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("server error please try again");
        }
    };

    upload(req, res, (err) => {
        if (err) {
            res.status(500).send("server error please try again");
            const msgid = req.body.msgid;
            Message.deleteOne({ _id: msgid });
        } else {
            sendmediasupport();
        }
    });
};

exports.downloadmedia = async (req, res, next) => {
    try {
        const msgid = req.query.msgid;
        const msg = await Messages.findById(msgid);
        res.download(msg.media.path, (error) => {
            console.log(error);
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("server error please try again");
    }
};
