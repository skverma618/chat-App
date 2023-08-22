const Group = require("../Models/Group");
const fs = require("fs");
const User = require("../Models/User");
const GrpMsgs = require("../Models/GrpMsg");

exports.addGroup = async (req, res, next) => {
    try {
        if (req.file) {
            const { name, description, selectedcontacts } = { ...req.body };
            newselectedcontacts = JSON.parse(selectedcontacts);
            const members = [];
            for (let i = 0; i < newselectedcontacts.length; i++) {
                members.push({
                    member: newselectedcontacts[i],
                    role: "participant",
                });
            }
            members.push({ member: req.user._id, role: "admin" });
            const grp = new Group({
                name: name,
                description: description,
                members: members,
            });
            const savedgrp = await grp.save();
            const newpath = `images\\Profile\\${savedgrp._id.toString()}.jpg`;
            fs.renameSync(req.file.path, newpath);
            const imgUrl = `${
                process.env.domain
            }${newpath}?${new Date().getTime()}`;
            await Group.updateOne({ _id: savedgrp._id }, { imgUrl: imgUrl });
            const promises = [];
            promises.push(
                User.updateOne(
                    { _id: req.user._id },
                    { $push: { groups: savedgrp._id } }
                )
            );
            for (let i = 0; i < newselectedcontacts.length; i++) {
                promises.push(
                    User.updateOne(
                        { _id: newselectedcontacts[i] },
                        { $push: { groups: savedgrp._id } }
                    )
                );
            }
            await Promise.all(promises);
            const newsavedgrp = await Group.findOne({ _id: savedgrp._id })
                .populate({
                    path: "members.member",
                })
                .exec();
            res.send({ ...newsavedgrp._doc, imgUrl: imgUrl, messages: [] });
            const io = require("../socket").getIo();
            const users = require("../socket-events").users;
            for (let i = 0; i < newselectedcontacts.length; i++) {
                if (
                    newselectedcontacts[i].toString() != req.user._id.toString()
                ) {
                    const id = users.get(newselectedcontacts[i].toString());
                    if (id) {
                        io.to(id).emit("add-group", {
                            ...newsavedgrp._doc,
                            messages: [],
                        });
                    }
                }
            }
        } else {
            const { name, description, selectedcontacts } = { ...req.body };
            newselectedcontacts = JSON.parse(selectedcontacts);
            const members = [];
            for (let i = 0; i < newselectedcontacts.length; i++) {
                members.push({
                    member: newselectedcontacts[i],
                    role: "participant",
                });
            }
            members.push({ member: req.user._id, role: "admin" });
            const grp = new Group({
                name: name,
                description: description,
                members: members,
            });
            const savedgrp = await grp.save();
            const promises = [];
            promises.push(
                User.updateOne(
                    { _id: req.user._id },
                    { $push: { groups: savedgrp._id } }
                )
            );
            for (let i = 0; i < newselectedcontacts.length; i++) {
                console.log(newselectedcontacts[i]);
                promises.push(
                    User.updateOne(
                        { _id: newselectedcontacts[i] },
                        { $push: { groups: savedgrp._id } }
                    )
                );
            }
            await Promise.all(promises);
            const newsavedgrp = await Group.findOne({ _id: savedgrp._id })
                .populate({
                    path: "members.member",
                })
                .exec();
            res.send({ ...newsavedgrp._doc, messages: [] });
            const io = require("../socket").getIo();
            const users = require("../socket-events").users;
            for (let i = 0; i < newselectedcontacts.length; i++) {
                if (
                    newselectedcontacts[i].toString() != req.user._id.toString()
                ) {
                    const id = users.get(newselectedcontacts[i].toString());
                    if (id) {
                        io.to(id).emit("add-group", {
                            ...newsavedgrp._doc,
                            messages: [],
                        });
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("server error please try again");
    }
};

exports.exitgroup = async (req, res, next) => {
    try {
        const { id } = { ...req.body };
        const idx = req.user.groups.findIndex(
            (g) => g.toString() === id.toString()
        );
        req.user.groups.splice(idx, 1);
        await Group.updateOne(
            { _id: id },
            { $pull: { members: { member: req.user._id } } }
        );
        await GrpMsgs.updateMany(
            { groupid: id },
            { $push: { deletedby: req.user._id } }
        );
        await req.user.save();
        res.send("group exited");
        const grpmsg = new GrpMsgs({
            type: "grp info",
            infomsg: {
                type: "exit",
                doneby: req.user._id,
            },
            groupid: id,
        });
        await grpmsg.save();
        const grp = await Group.findById(id).select("members").exec();
        const io = require("../socket").getIo();
        const users = require("../socket-events").users;
        const newgrpmsg = { ...grpmsg._doc, groupid: id };
        for (let i = 0; i < grp.members.length; i++) {
            if (grp.members[i].member != req.user._id) {
                const id = users.get(grp.members[i].member.toString());
                if (id) {
                    io.to(id).emit("recieve-group-message", newgrpmsg);
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("server error please try again");
    }
};

exports.clearchat = async (req, res, next) => {
    try {
        const { id } = { ...req.body };
        await GrpMsgs.updateMany(
            { groupid: id },
            { $push: { deletedby: req.user._id } }
        );
        res.send("grp chat cleared");
    } catch (error) {
        console.log(error);
        res.status(500).send("server error please try again");
    }
};

exports.removemember = async (req, res, next) => {
    try {
        const { grpid, memid } = { ...req.body };
        const grp = await Group.findById({ _id: grpid })
            .select("members")
            .exec();
        let isadmin = false;
        for (let i = 0; i < grp.members.length; i++) {
            const mem = grp.members[i];
            console.log(mem);
            if (
                mem.member.toString() == req.user._id.toString() &&
                mem.role == "admin"
            ) {
                isadmin = true;
            }
        }
        console.log(grp);
        console.log(isadmin);
        if (isadmin) {
            await Group.updateOne(
                { _id: grpid },
                { $pull: { members: { member: memid } } }
            );
            await User.updateOne({ _id: memid }, { $pull: { groups: grpid } });
        }
        res.send("user removed");
    } catch (error) {
        console.log(error);
        res.status(500).send("server error please try again");
    }
};

exports.dismissadmin = async (req, res, next) => {
    try {
        const { grpid, memid } = { ...req.body };
        const grp = await Group.findById({ _id: grpid })
            .select("members")
            .exec();
        let isadmin = false;
        for (let i = 0; i < grp.members.length; i++) {
            const mem = grp.members[i];
            console.log(mem);
            if (
                mem.member.toString() == req.user._id.toString() &&
                mem.role == "admin"
            ) {
                isadmin = true;
            }
        }
        console.log(isadmin);
        if (isadmin) {
            await Group.updateOne(
                { _id: grpid },
                { $set: { "members.$[elem].role": "participant" } },
                { arrayFilters: [{ "elem.member": memid }] }
            );
            res.send("user admin");
            const grpmsg = new GrpMsgs({
                type: "grp info",
                infomsg: {
                    type: "dismiss admin",
                    doneby: req.user._id,
                    doneto: memid,
                },
                groupid: grpid,
            });
            await grpmsg.save();
            const io = require("../socket").getIo();
            const users = require("../socket-events").users;
            const newgrpmsg = { ...grpmsg._doc, groupid: grpid };
            for (let i = 0; i < grp.members.length; i++) {
                const id = users.get(grp.members[i].member.toString());
                if (id) {
                    io.to(id).emit("recieve-group-message", newgrpmsg);
                }
            }
        } else {
            res.send("user admin");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("server error please try again");
    }
};

exports.makeadmin = async (req, res, next) => {
    try {
        const { grpid, memid } = { ...req.body };
        const grp = await Group.findById({ _id: grpid })
            .select("members")
            .exec();
        let isadmin = false;
        for (let i = 0; i < grp.members.length; i++) {
            const mem = grp.members[i];
            console.log(mem);
            if (
                mem.member.toString() == req.user._id.toString() &&
                mem.role == "admin"
            ) {
                isadmin = true;
            }
        }
        console.log(isadmin);
        if (isadmin) {
            await Group.updateOne(
                { _id: grpid },
                { $set: { "members.$[elem].role": "admin" } },
                { arrayFilters: [{ "elem.member": memid }] }
            );
            const grpmsg = new GrpMsgs({
                type: "grp info",
                infomsg: {
                    type: "make admin",
                    doneby: req.user._id,
                    doneto: memid,
                },
                groupid: grpid,
            });
            await grpmsg.save();
            const io = require("../socket").getIo();
            const users = require("../socket-events").users;
            const newgrpmsg = { ...grpmsg._doc, groupid: grpid };
            for (let i = 0; i < grp.members.length; i++) {
                const id = users.get(grp.members[i].member.toString());
                if (id) {
                    io.to(id).emit("recieve-group-message", newgrpmsg);
                }
            }
        }
        res.send("user admin");
    } catch (error) {
        console.log(error);
        res.status(500).send("server error please try again");
    }
};

exports.updategroupfields = async (req, res, next) => {
    try {
        console.log(req.body);
        const field = req.body.field;
        const groupid = req.body.groupid;
        const grp = await Group.findById({ _id: groupid })
            .select("members")
            .exec();
        let isadmin = false;
        for (let i = 0; i < grp.members.length; i++) {
            const mem = grp.members[i];
            if (
                mem.member.toString() == req.user._id.toString() &&
                mem.role == "admin"
            ) {
                isadmin = true;
            }
        }
        if (isadmin) {
            if (field === "name") {
                const name = req.body.name;
                if (!name || name === "") {
                    return res.status(400).send("please provide valid name");
                }
                await Group.updateOne({ _id: groupid }, { name: name });
                res.send("fields updated");
                const grpmsg = new GrpMsgs({
                    type: "grp info",
                    infomsg: {
                        type: "update name",
                        doneby: req.user._id,
                        number: req.user.mobileno,
                    },
                    groupid: groupid,
                });
                await grpmsg.save();
                const io = require("../socket").getIo();
                const users = require("../socket-events").users;
                const newgrpmsg = { ...grpmsg._doc, groupid: groupid };
                for (let i = 0; i < grp.members.length; i++) {
                    const id = users.get(grp.members[i].member.toString());
                    if (id) {
                        io.to(id).emit("recieve-group-message", newgrpmsg);
                    }
                }
                for (let i = 0; i < grp.members.length; i++) {
                    const id = users.get(grp.members[i].member.toString());
                    if (id && id.toString() != req.user._id.toString()) {
                        io.to(id).emit("update-group-info", {
                            field: "name",
                            name: name,
                            id: groupid,
                        });
                    }
                }
            } else if (field === "description") {
                const description = req.body.description;
                if (!description || description === "") {
                    return res
                        .status(400)
                        .send("please provide valid description");
                }
                await Group.updateOne(
                    { _id: groupid },
                    { description: description }
                );
                res.send("fields updated");
                const grpmsg = new GrpMsgs({
                    type: "grp info",
                    infomsg: {
                        type: "update description",
                        doneby: req.user._id,
                        number: req.user.mobileno,
                    },
                    groupid: groupid,
                });
                await grpmsg.save();
                const io = require("../socket").getIo();
                const users = require("../socket-events").users;
                const newgrpmsg = { ...grpmsg._doc, groupid: groupid };
                for (let i = 0; i < grp.members.length; i++) {
                    const id = users.get(grp.members[i].member.toString());
                    if (id) {
                        io.to(id).emit("recieve-group-message", newgrpmsg);
                    }
                }
                for (let i = 0; i < grp.members.length; i++) {
                    const id = users.get(grp.members[i].member.toString());
                    if (id && id.toString() != req.user._id.toString()) {
                        io.to(id).emit("update-group-info", {
                            field: "description",
                            description: description,
                            id: groupid,
                        });
                    }
                }
            }
        } else {
            res.status(422).send("not authorized");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("server error please try again");
    }
};

exports.updategrpimage = async (req, res, next) => {
    try {
        const groupid = req.body.groupid;
        const grp = await Group.findById({ _id: groupid })
            .select("members")
            .exec();
        let isadmin = false;
        for (let i = 0; i < grp.members.length; i++) {
            const mem = grp.members[i];
            if (
                mem.member.toString() == req.user._id.toString() &&
                mem.role == "admin"
            ) {
                isadmin = true;
            }
        }
        if (isadmin) {
            const file = req.file;
            if (!file) {
                return res.status(400).send("profile image not found");
            }
            const imgUrl = `${process.env.domain}${
                file.path
            }?${new Date().getTime()}`;
            await Group.updateOne({ _id: groupid }, { imgUrl: imgUrl });
            res.send({ imgUrl: imgUrl });
            const grpmsg = new GrpMsgs({
                type: "grp info",
                infomsg: {
                    type: "update image",
                    doneby: req.user._id,
                    number: req.user.mobileno,
                },
                groupid: groupid,
            });
            await grpmsg.save();
            const io = require("../socket").getIo();
            const users = require("../socket-events").users;
            const newgrpmsg = { ...grpmsg._doc, groupid: groupid };
            for (let i = 0; i < grp.members.length; i++) {
                const id = users.get(grp.members[i].member.toString());
                if (id) {
                    io.to(id).emit("recieve-group-message", newgrpmsg);
                }
            }
            for (let i = 0; i < grp.members.length; i++) {
                const id = users.get(grp.members[i].member.toString());
                if (id && id.toString() != req.user._id.toString()) {
                    io.to(id).emit("update-group-info", {
                        field: "image",
                        imgUrl: imgUrl,
                        id: groupid,
                    });
                }
            }
        } else {
            res.status(422).send("not authorized");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("server error please try again");
    }
};
