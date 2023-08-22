const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        mobileno: {
            type: String,
            required: true,
            unique: true,
            sparse: true,
            trim: true,
        },
        imgUrl: {
            type: String,
            default: "",
        },
        password: {
            type: String,
            required: true,
        },
        refreshtoken: {
            type: String,
        },
        contacts: [
            {
                contact: { type: Schema.Types.ObjectId, ref: "user" },
                name: { type: String },
            },
        ],
        groups: [{ type: Schema.Types.ObjectId, ref: "group" }],
        about: {
            type: String,
            default: "hey there i am using kunal chat",
        },
    },
    { timestamps: true }
);

userSchema.methods.signtoken = function () {
    const token = jwt.sign(
        { data: { _id: this._id, mobileno: this.mobileno } },
        process.env.tokensecret,
        { expiresIn: "15m" }
    );
    return token;
};

userSchema.methods.signrefreshtoken = function () {
    const refreshtoken = jwt.sign(
        { data: { _id: this._id } },
        process.env.refreshsecret,
        { expiresIn: "7d" }
    );
    return refreshtoken;
};

module.exports = mongoose.model("user", userSchema);
