const express = require("express");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const io = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const authroutes = require("./Routes/Auth");
const profileroutes = require("./Routes/Profile");
const messagesroutes = require("./Routes/Messages");
const grouprotes = require("./Routes/Group");
const cookieparser = require("cookie-parser");
const contactroutes = require("./Routes/Contacts");
const socketio = require("socket.io");

const app = express();

dotenv.config();

if (process.env.NODE_ENV === "development") {
    app.use(
        cors({
            origin: ["http://localhost:3000", "http://localhost:3001"],
            credentials: true,
        })
    );
}

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use(cookieparser());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/Media", express.static(path.join(__dirname, "Media")));
app.use("/auth", authroutes);
app.use("/contacts", contactroutes);
app.use("/profile", profileroutes);
app.use("/messages", messagesroutes);
app.use("/group", grouprotes);
app.use(express.static("client/build"));

if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "staging"
) {
    console.log("hi");
    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
}

mongoose
    .connect(process.env.mongodUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        var server = require("http").createServer(app);
        server.listen(process.env.PORT || 8000);
        const io = require("./socket").init(server);
        require("./socket-events").registerevent();
        console.log("server started");
    })
    .catch((err) => {
        console.log(err);
    });
