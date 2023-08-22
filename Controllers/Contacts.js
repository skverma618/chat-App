const User = require("../Models/User");
const { validationResult } = require("express-validator");
const Message = require("../Models/Message");

exports.addContact = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send("validation failed");
        }
        const { mobileno, name } = { ...req.body };
        const contact = await User.findOne({ mobileno: mobileno });
        let iscontact = false;
        if (!contact) {
            return res.status(422).send("user with mobileno not found");
        }
        for (let i = 0; i < req.user.contacts.length; i++) {
            if (
                req.user.contacts[i].contact.toString() ==
                contact._id.toString()
            ) {
                iscontact = true;
            }
        }
        if (iscontact) {
            return res.status(422).send("user already in contact list");
        }
        req.user.contacts.push({ contact: { _id: contact._id }, name: name });
        await req.user.save();
        res.send({
            _id: contact._id.toString(),
            name: name,
            mobileno: contact.mobileno,
            imgUrl: contact.imgUrl,
            about: contact.about,
            messages: [],
        });
    } catch (error) {
        res.status(500).send("server error please try again");
    }
};

exports.getContacts = async (req, res, next) => {
    try {
        const user1 = await User.findById(req.user._id).select("groups");
        let user;
        if (user1.groups.length > 0) {
            user = await User.findById(req.user._id)
                .populate({
                    path: "contacts.contact",
                    select: "imgUrl  about mobileno",
                })
                .populate({
                    path: "groups",
                    populate: {
                        path: "members.member",
                        select: "imgUrl name about mobileno",
                    },
                });
        } else {
            user = await User.findById(req.user._id).populate({
                path: "contacts.contact",
                select: "imgUrl about mobileno",
            });
        }
        const response = [];
        for (el of user.contacts) {
            const obj = {
                name: el.name,
                ...el.contact._doc,
                messages: [],
                type: "contact",
            };
            response.push(obj);
        }
        for (el of user.groups) {
            const obj = { ...el._doc, messages: [], type: "group" };
            response.push(obj);
        }
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send("server error please try again");
    }
};

exports.deletecontact = async (req, res, next) => {
    try {
        const { id } = { ...req.body };
        const idx = req.user.contacts.findIndex(
            (c) => c.contact.toString() === id.toString()
        );
        req.user.contacts.splice(idx, 1);
        await Message.updateMany(
            {
                $or: [
                    { senderid: req.user._id, recieverid: id },
                    { senderid: id, recieverid: req.user._id },
                ],
            },
            { $push: { deletedby: req.user._id } }
        );
        await req.user.save();
        res.send("contact deleted");
    } catch (error) {
        res.status(500).send("server error please try again");
    }
};

exports.clearchat = async (req, res, next) => {
    try {
        const { id } = { ...req.body };
        await Message.updateMany(
            {
                $or: [
                    { senderid: req.user._id, recieverid: id },
                    { senderid: id, recieverid: req.user._id },
                ],
            },
            { $push: { deletedby: req.user._id } }
        );
        res.send("messages deleted");
    } catch (error) {
        res.status(500).send("server error please try again");
    }
};

exports.editcontact = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send("validation failed");
        }
        const { id, name } = { ...req.body };
        for (let i = 0; i < req.user.contacts.length; i++) {
            if (req.user.contacts[i].contact.toString() === id.toString()) {
                req.user.contacts[i].name = name;
                break;
            }
        }
        await req.user.save();
        res.send("contact updated");
    } catch (error) {
        res.status(500).send("server error please try again");
    }
};
