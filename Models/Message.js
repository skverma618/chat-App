const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const msgSchema = new Schema(
    {
        senderid: { type: Schema.Types.ObjectId, ref: "user" },
        recieverid: { type: Schema.Types.ObjectId, ref: "user" },
        data: { type: String },
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("message", msgSchema);
