const express = require("express");
const app = express();
const UserModel = require("./models/user");

const connectDB = require("./config/database");

app.use(express.json()); 

app.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password, age, gender } = req.body;
        const user = new UserModel({ firstName, lastName, emailId, password, age, gender }); 
        await user.save();
        res.status(201).json({ message: "User registered successfully" }); 
    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Connect to the database and start the server and then handle API routes
connectDB().then(() => {
    console.log("devTinder connected successfully");
    app.listen(7777, () => {
        console.log("Server is successfully listening on port 7777");
    });
}).catch((err) => {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
});
