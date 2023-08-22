const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "hey there i am using kunal chat",
        },
        members: [
            {
                member: { type: Schema.Types.ObjectId, ref: "user" },
                role: { type: String, default: "participant" },
            },
        ],
        imgUrl: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("group", groupSchema);
