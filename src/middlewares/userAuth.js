const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const userAuth = async (req, res, next) => {
    //Read the token from the request 
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const decodedObj = await jwt.verify(token, "Aman@1009");

        const { _id } = decodedObj;

        const user = await UserModel.findById(_id);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = user; // Attach the user object to the request for further use
        next();
    }
    catch (error) {
        console.error("Error verifying token:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { userAuth };