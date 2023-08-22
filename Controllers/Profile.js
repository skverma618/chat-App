const { validationResult } = require("express-validator");
const User = require("../Models/User");

exports.updateprofilefields = async (req, res, next) => {
    try {
        const field = req.body.field;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send("please provide valid mobile no");
        }
        if (field === "name") {
            const name = req.body.name;
            if (!name || name === "") {
                return res.status(400).send("please provide valid name");
            }
            req.user.name = name;
            const user = await req.user.save();
            res.send({
                mobileno: user.mobileno,
                imgUrl: user.imgUrl,
                name: name,
                about: user.about,
                _id: user._id,
            });
        } else if (field === "about") {
            const about = req.body.about;
            if (!about || about === "") {
                return res.status(400).send("please provide valid name");
            }
            req.user.about = about;
            const user = await req.user.save();
            res.send({
                mobileno: user.mobileno,
                imgUrl: user.imgUrl,
                name: user.name,
                about: about,
                _id: user._id,
            });
        } else {
            const mobileno = req.body.mobileno;
            req.user.mobileno = mobileno;
            const founduser = await User.findOne({ mobileno: mobileno });
            if (founduser) {
                return res
                    .status(400)
                    .send("user already exits with given mobile no");
            }
            const user = await req.user.save();
            res.send({
                mobileno: mobileno,
                imgUrl: user.imgUrl,
                name: user.name,
                about: user.about,
                _id: user._id,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send("server error please try later");
    }
};

exports.updateprofileimg = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send("profile image not found");
        }
        const imgUrl = `${process.env.serverdomain}${
            file.path
        }?${new Date().getTime()}`;
        req.user.imgUrl = imgUrl;
        const user = await req.user.save();
        res.send({
            mobileno: user.mobileno,
            imgUrl: imgUrl,
            name: user.name,
            about: user.about,
            _id: user._id,
        });
    } catch {
        return res.status(500).send("server error please try later");
    }
};
