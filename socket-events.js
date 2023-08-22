const io = require("./socket").getIo();
const jwt = require("jsonwebtoken");
const User = require("./Models/User");
const Message = require("./Models/Message");
const GrpMsg = require("./Models/GrpMsg");
const Group = require("./Models/Group");

users = new Map();

exports.registerevent = () => {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            const decoded = jwt.verify(token, process.env.tokensecret);
            const userid = decoded.data._id;
            if (userid) {
                socket.userid = userid;
                next();
            } else {
                next(new Error("token invalid"));
            }
        } catch {
            next(new Error("token invalid"));
        }
    });

    io.on("connection", (socket) => {
        users.set(socket.userid.toString(), socket.id.toString());
        console.log(users);
        console.log("user connected");

        socket.on(
            "send-message",
            async (
                msg,
                recieverid,
                sendermob,
                senderimg,
                senderabout,
                senderid,
                cb
            ) => {
                const recsocid = users.get(recieverid);
                console.log(recsocid);
                console.log(sendermob);
                if (recsocid) {
                    console.log(recsocid);
                    const message = new Message({
                        data: msg,
                        senderid: senderid,
                        recieverid: recieverid,
                        deletedby: [],
                        status: "sendToServer",
                    });
                    const savedmsg = await message.save();
                    const newsavedmsg = {
                        ...savedmsg._doc,
                        sendermob: sendermob,
                        senderimg: senderimg,
                        senderabout: senderabout,
                    };
                    console.log(newsavedmsg);
                    cb(newsavedmsg);
                    io.to(recsocid).emit("recieve-message", newsavedmsg);
                    const user = await User.findById(recieverid).select(
                        "contacts"
                    );
                    const con = await user.contacts.find((c) => {
                        return senderid.toString() === c.contact.toString();
                    });
                    if (!con) {
                        user.contacts.push({
                            contact: { _id: senderid },
                            name: "",
                        });
                        await user.save();
                    }
                } else {
                    const message = new Message({
                        data: msg,
                        senderid: senderid,
                        recieverid: recieverid,
                        deletedby: [],
                        status: "sendToServer",
                    });
                    const savedmsg = await message.save();
                    cb(savedmsg);
                    const user = await User.findById(recieverid).select(
                        "contacts"
                    );
                    const con = await user.contacts.find((c) => {
                        return senderid.toString() === c.contact.toString();
                    });
                    if (!con) {
                        user.contacts.push({
                            contact: { _id: senderid },
                            name: "",
                        });
                        await user.save();
                    }
                }
            }
        );

        socket.on(
            "send-media",
            async (recieverid, senderid, sendermob, type, cb) => {
                const message = new Message({
                    sendermob: sendermob,
                    senderid: senderid,
                    recieverid: recieverid,
                    deletedby: [],
                    status: "sending",
                    type: "media",
                    media: { type: type },
                });
                const savedmsg = await message.save();
                cb(savedmsg);
            }
        );

        socket.on(
            "send-group-message",
            async (msg, groupid, senderid, sendermob, cb) => {
                console.log("in here");
                const message = new GrpMsg({
                    data: msg,
                    sendermob: sendermob,
                    senderid: senderid,
                    groupid: groupid,
                    deletedby: [],
                    status: "sendToServer",
                });
                const savedmsg = await message.save();
                cb(savedmsg);
                const grp = await Group.findById(groupid).select("members");
                for (let i = 0; i < grp.members.length; i++) {
                    if (grp.members[i].member != senderid) {
                        const id = users.get(grp.members[i].member.toString());
                        if (id) {
                            io.to(id).emit("recieve-group-message", savedmsg);
                        }
                    }
                }
            }
        );

        socket.on("close-call", (userid) => {
            const id = users.get(userid.toString());
            if (id) {
                io.to(id).emit("close-call");
            }
        });

        socket.on("disconnect", () => {
            console.log("user disconnected");
            users.delete(socket.userid);
        });
    });
};

exports.users = users;
