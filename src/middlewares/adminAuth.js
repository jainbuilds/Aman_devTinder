const adminAuth = (req, res, next) => {
    console.log("Admin auth middleware is getting checked");
    const token = "zxc"
    const isAdminAuthenticated = token === "xyz";
    if (!isAdminAuthenticated) {
        res.status(401).json({ message: "Unauthorized access" });  
    } else {    
        next();
    }   
}

module.exports = { adminAuth };  
