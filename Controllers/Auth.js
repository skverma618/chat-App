const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.register = async (req, res, next) => {
    console.log("hi");
    try {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send("validation failed");
        }
        const { ...userdata } = { ...req.body };
        const userdoc = await User.findOne({ mobileno: userdata.mobileno });
        if (userdoc) {
            return res.status(409).send("mobile no already taken");
        } else {
            const hashpass = await bcrypt.hash(userdata.password, 12);
            userdata.password = hashpass;
            const user = new User(userdata);
            const saveduser = await user.save();
            const { password, createdAt, updatedAt, ...datasend } = {
                ...saveduser._doc,
            };
            const token = saveduser.signtoken();
            const refreshtoken = saveduser.signrefreshtoken();
            saveduser.refreshtoken = refreshtoken;
            const updateduser = await saveduser.save();
            datasend.token = token;
            res.cookie("refreshtoken", refreshtoken, {
                secure: process.env.NODE_ENV !== "development",
                httpOnly: true,
                SameSite:
                    process.env.NODE_ENV === "development" ? "none" : "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            }).send(datasend);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send("validation failed");
        }
        const { ...userdata } = { ...req.body };
        const user = await User.findOne({ mobileno: userdata.mobileno });
        if (user) {
            const match = await bcrypt.compare(
                userdata.password,
                user.password
            );
            if (match) {
                const token = user.signtoken();
                const refreshtoken = user.signrefreshtoken();
                user.refreshtoken = refreshtoken;
                const updateduser = await user.save();
                res.cookie("refreshtoken", refreshtoken, {
                    secure: process.env.NODE_ENV !== "development",
                    httpOnly: true,
                    SameSite:
                        process.env.NODE_ENV === "development"
                            ? "none"
                            : "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                }).send({
                    _id: user._id,
                    token: token,
                    mobileno: user.mobileno,
                    name: user.name,
                    imgUrl: user.imgUrl,
                    about: user.about,
                });
            } else {
                return res.status(404).send("login credentials are wrong");
            }
        } else {
            return res.status(404).send("login credentials are wrong");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

exports.getToken = async (req, res, next) => {
    try {
        const refreshtoken = req.cookies.refreshtoken;
        const decoded = jwt.verify(refreshtoken, process.env.refreshsecret);
        const userid = decoded.data._id;
        const user = await User.findById(userid);
        if (!user) {
            return res.status(400).send("user not found");
        }
        if (user.refreshtoken === refreshtoken) {
            const token = user.signtoken();
            const refreshtoken = user.signrefreshtoken();
            user.refreshtoken = refreshtoken;
            await user.save();
            res.cookie("refreshtoken", refreshtoken, {
                secure: process.env.NODE_ENV !== "development",
                httpOnly: true,
                SameSite:
                    process.env.NODE_ENV === "development" ? "none" : "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            }).send({
                _id: user._id,
                token: token,
                mobileno: user.mobileno,
                name: user.name,
                imgUrl: user.imgUrl,
                about: user.about,
            });
        } else {
            user.refreshtoken = undefined;
            await user.save();
            return res
                .clearCookie("refreshtoken")
                .status(400)
                .send("token not valid");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};
