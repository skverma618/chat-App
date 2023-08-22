const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.tokensecret);
        const userid = decoded.data._id;
        const user = await User.findById(userid).select(
            "-refreshtoken -password"
        );
        if (!user) {
            return res
                .clearCookie("refreshtoken")
                .status(400)
                .redirect("http://localhost:3000?authfailed=true");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("please login again token invaild");
    }
};

module.exports = isAuth;
