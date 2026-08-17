const userAuth = (req, res, next) => {
    console.log("User auth is getting checked");
    const token = "xyz"
    const isUserAuthenticated = token === "xyz";
    if (!isUserAuthenticated) {
        res.status(401).json({ message: "Unauthorized" });
    } else {
        next();
    }
}

module.exports = { userAuth };