const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GrpMsgSchema = new Schema(
    {
        groupid: { type: Schema.Types.ObjectId, ref: "group" },
        senderid: { type: Schema.Types.ObjectId, ref: "user" },
        data: { type: String },
        sendermob: { type: String },
        status: { type: String, default: "sending" },
        type: { type: String, default: "text" },
        deletedby: [{ type: Schema.Types.ObjectId, ref: "user" }],
        media: {
            type: { type: String },
            url: { type: String },
            name: { type: String },
            size: { type: String },
            path: { type: String },
        },
        infomsg: {
            type: { type: String },
            doneby: { type: Schema.Types.ObjectId, ref: "user" },
            doneto: { type: Schema.Types.ObjectId, ref: "user" },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("grpmsg", GrpMsgSchema);
